"""Génère PROJET.html depuis PROJET.md (page autonome : sombre par défaut, bascule clair, sommaire fixe, badges, frise du journal).
Usage : python scripts/projet-html.py   (depuis le dossier du site ; nécessite le paquet Python `markdown`)"""
import html, pathlib, re
import markdown

RACINE = pathlib.Path(__file__).resolve().parents[1]
md = (RACINE / "PROJET.md").read_text(encoding="utf-8")

titre = re.search(r"^# (.+)$", md, re.M).group(1)
resume = (re.search(r"^> (.+)$", md, re.M) or [None, ""])[1]
corps = re.sub(r"^# .+\n(> .+\n)?", "", md, count=1, flags=re.M)

rendu = markdown.markdown(corps, extensions=["tables", "fenced_code", "toc"])

ICONES = {"Stack": "🧱", "Démarrage": "🚀", "Architecture": "🗂️", "Variables": "🔐", "Roadmap": "🗺️", "Journal": "📓", "Problèmes": "⚠️", "Déploiement": "🌐"}
sections = re.findall(r'<h2 id="([^"]+)">(.+?)</h2>', rendu)
def icone(t): return next((v for k, v in ICONES.items() if t.startswith(k)), "•")
rendu = re.sub(r'<h2 id="([^"]+)">(.+?)</h2>', lambda m: f'</section><section id="{m[1]}"><h2><span aria-hidden="true">{icone(m[2])}</span> {m[2]}</h2>', rendu)
rendu = rendu.replace("</section>", "", 1) + "</section>"

BADGES = {"✅ Done": "ok", "🚧 In Progress": "encours", "📋 Planned": "prevu"}
for k, v in BADGES.items():
    rendu = rendu.replace(f"<td>{k}</td>", f'<td><span class="badge {v}">{k}</span></td>')
rendu = re.sub(r'(<section id="journal[^"]*">.*?)(</section>)', lambda m: m[1].replace("<h3>", '<h3 class="jalon">') + m[2], rendu, flags=re.S)

stack = re.findall(r"^\| ([^|]+?) \| ([^|]+?) \|$", md.split("## Stack technique")[1].split("##")[0], re.M)[2:]
badges = "".join(f'<span class="puce">{html.escape(t.split("(")[0].strip())}</span>' for _, t in stack[:6])
nav = "".join(f'<a href="#{i}">{icone(t)} {t}</a>' for i, t in sections)

page = f"""<!doctype html>
<html lang="fr" data-theme="sombre"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>{html.escape(titre)} — Projet</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
:root{{--fond:#0f1418;--carte:#161d23;--texte:#e6ebef;--doux:#9aa7b2;--filet:#26313a;--acc:#00aeff;--acc2:#5cc8ff}}
[data-theme=clair]{{--fond:#f4f5f2;--carte:#fff;--texte:#1b2229;--doux:#56616b;--filet:#dde1dc;--acc:#0069a6;--acc2:#174460}}
*{{box-sizing:border-box}}body{{margin:0;font:16px/1.6 Inter,system-ui,sans-serif;background:var(--fond);color:var(--texte)}}
header{{padding:40px 24px 28px;border-bottom:1px solid var(--filet)}}header h1{{margin:0 0 6px;font-size:clamp(1.7rem,4vw,2.4rem)}}
header p{{margin:0 0 14px;color:var(--doux);max-width:70ch}}.puce{{display:inline-block;margin:0 6px 6px 0;padding:3px 10px;border:1px solid var(--filet);border-radius:99px;font-size:.82rem}}
.cadre{{display:grid;grid-template-columns:240px 1fr;gap:32px;max-width:1200px;margin:auto;padding:24px}}
nav{{position:sticky;top:16px;align-self:start;display:flex;flex-direction:column;gap:2px}}nav a{{color:var(--doux);text-decoration:none;padding:6px 10px;border-radius:6px}}nav a:hover{{background:var(--carte);color:var(--texte)}}
section{{background:var(--carte);border:1px solid var(--filet);border-radius:12px;padding:20px 24px;margin-bottom:20px;overflow-x:auto}}
h2{{margin-top:0;font-size:1.3rem}}table{{border-collapse:collapse;width:100%;font-size:.92rem}}th,td{{text-align:left;padding:8px 10px;border-bottom:1px solid var(--filet);vertical-align:top}}
th{{color:var(--doux);font-weight:600}}code{{font-size:.88em;background:var(--fond);padding:1px 5px;border-radius:4px}}pre{{background:var(--fond);padding:14px;border-radius:8px;overflow-x:auto}}pre code{{padding:0}}
a{{color:var(--acc)}}.badge{{padding:2px 9px;border-radius:99px;font-size:.8rem;white-space:nowrap}}.ok{{background:#1f6f3a33;color:#4cc27a}}.encours{{background:#c96a0033;color:#ef9a3c}}.prevu{{background:#2457a833;color:#6ea2f0}}
.jalon{{position:relative;padding-left:22px;color:var(--acc2)}}.jalon::before{{content:"";position:absolute;left:4px;top:.45em;width:10px;height:10px;border-radius:50%;background:var(--acc2)}}
.jalon+ul{{border-left:2px solid var(--filet);margin-left:8px;padding-left:22px}}
button{{position:fixed;top:14px;right:14px;background:var(--carte);color:var(--texte);border:1px solid var(--filet);border-radius:99px;padding:6px 12px;cursor:pointer;font:inherit;font-size:.85rem}}
@media (max-width:820px){{.cadre{{grid-template-columns:1fr}}nav{{position:static;flex-direction:row;flex-wrap:wrap}}}}
</style></head><body>
<button type="button" onclick="var h=document.documentElement;h.dataset.theme=h.dataset.theme==='clair'?'sombre':'clair'">Clair / sombre</button>
<header><h1>{html.escape(titre)}</h1><p>{html.escape(resume)}</p>{badges}</header>
<div class="cadre"><nav aria-label="Sommaire">{nav}</nav><main>{rendu}</main></div>
</body></html>"""
(RACINE / "PROJET.html").write_text(page, encoding="utf-8")
print("PROJET.html", len(page), "octets,", len(sections), "sections")
