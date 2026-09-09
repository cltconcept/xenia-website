#!/usr/bin/env bash
# L'aquarelle du hero (spec §7) : 3 candidats nano-banana-pro, 4:5, 2K (repli 1K).
# Sortie : brief/illu-src/hero-cabinet-<n>.png (hors git). Un fichier présent n'est jamais regénéré.
# Aucun retry sur une tâche créée (retenter = repayer).
set -u
cd "$(dirname "$0")/.."
[ -n "${KIE_API_KEY:-}" ] || { echo "KIE_API_KEY absente" >&2; exit 1; }
mkdir -p brief/illu-src
API="https://api.kie.ai/api/v1"
PROMPT="Entirely hand-painted watercolor illustration on white paper, soft pastel, loose wet-on-wet washes, visible paper grain, no photorealism, no text, no letters. A quiet corner of a therapist's consulting room bathed in morning light: a soft rounded armchair in peach and pale rose, a sheer white curtain glowing with daylight, a diagonal ray of warm light on a pale floor, a small ceramic pot with a few green leaves on a side table, one raspberry-pink cushion as the only strong accent. Lots of white paper left visible at the edges, airy, luminous, peaceful. Palette: peach, pale rose, lilac, mint green, a touch of raspberry."
creer() { # $1 = résolution
  python3 -c 'import json,sys; print(json.dumps({"model":"nano-banana-pro","input":{"prompt":sys.argv[1],"aspect_ratio":"4:5","resolution":sys.argv[2],"output_format":"png"}}))' "$PROMPT" "$1" \
  | curl -sS --max-time 30 -X POST "$API/jobs/createTask" -H "Authorization: Bearer $KIE_API_KEY" -H "Content-Type: application/json" -d @- \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("data",{}).get("taskId","") if d.get("code")==200 else "")'
}
for n in 1 2 3; do
  out="brief/illu-src/hero-cabinet-$n.png"
  if [ -s "$out" ]; then echo "= candidat $n déjà présent"; continue; fi
  task=$(creer 2K); [ -n "$task" ] || task=$(creer 1K)
  [ -n "$task" ] || { echo "✗ candidat $n : création refusée" >&2; continue; }
  url=""
  for i in $(seq 1 40); do
    sleep 6
    rep=$(curl -sS --max-time 20 -H "Authorization: Bearer $KIE_API_KEY" "$API/jobs/recordInfo?taskId=$task")
    etat=$(printf '%s' "$rep" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("data",{}).get("state",""))' 2>/dev/null || echo "")
    if [ "$etat" = "success" ]; then
      url=$(printf '%s' "$rep" | python3 -c 'import json,sys; d=json.load(sys.stdin)["data"]; print((json.loads(d.get("resultJson") or "{}").get("resultUrls") or [""])[0])'); break
    elif [ "$etat" = "fail" ]; then echo "✗ candidat $n : $(printf '%s' "$rep" | head -c 300)" >&2; break; fi
  done
  if [ -n "$url" ] && curl -sS --max-time 90 -o "$out" "$url" && [ -s "$out" ]; then echo "✓ candidat $n"; else rm -f "$out"; echo "✗ candidat $n : pas de résultat" >&2; fi
done
