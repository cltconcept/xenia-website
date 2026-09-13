"""Contraste RÉEL : pour chaque sélecteur, on rend le texte transparent, on
capture l'élément, on relève le fond effectif (médiane + pixel le plus clair et
le plus sombre) puis on calcule le ratio WCAG contre la couleur calculée du texte.

Usage : python contrast.py <url> <selectors.json> [--w 1440 --h 900] [--mobile] [--rm] [--wait MS]
"""
import argparse, json, io, sys
from playwright.sync_api import sync_playwright
from PIL import Image

def chan(v):
    v = v / 255
    return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4

def lum(c):
    return 0.2126 * chan(c[0]) + 0.7152 * chan(c[1]) + 0.0722 * chan(c[2])

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def parse_rgb(s):
    nums = [float(x) for x in s.replace('rgba(', '').replace('rgb(', '').replace(')', '').replace('/', ',').split(',') if x.strip()]
    return (int(nums[0]), int(nums[1]), int(nums[2])), (nums[3] if len(nums) > 3 else 1.0)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('url'); p.add_argument('selectors')
    p.add_argument('--w', type=int, default=1440); p.add_argument('--h', type=int, default=900)
    p.add_argument('--mobile', action='store_true'); p.add_argument('--rm', action='store_true')
    p.add_argument('--wait', type=int, default=2500)
    a = p.parse_args()
    sels = json.load(open(a.selectors, encoding='utf-8'))
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        kw = dict(viewport={'width': a.w, 'height': a.h}, reduced_motion='reduce' if a.rm else 'no-preference', locale='fr-BE')
        if a.mobile:
            kw.update(device_scale_factor=2, is_mobile=True, has_touch=True, user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        ctx = browser.new_context(**kw)
        page = ctx.new_page()
        page.goto(a.url, wait_until='load', timeout=45000)
        page.wait_for_timeout(a.wait)
        # Neutraliser le grain (4 % de bruit) pour lire le fond réel, et couper les animations restantes
        page.add_style_tag(content='.grain{display:none!important} *{animation-play-state:paused!important}')
        out = []
        for item in sels:
            sel = item['sel'] if isinstance(item, dict) else item
            label = item.get('label', sel) if isinstance(item, dict) else sel
            els = page.query_selector_all(sel)
            els = [e for e in els if e.is_visible()]
            if not els:
                out.append({'label': label, 'sel': sel, 'error': 'introuvable ou invisible'}); continue
            el = els[0]
            try:
                el.scroll_into_view_if_needed(timeout=5000)
            except Exception as ex:
                out.append({'label': label, 'sel': sel, 'error': 'scroll: ' + str(ex)[:60]}); continue
            page.wait_for_timeout(900)
            info = el.evaluate('''(el) => {
                const c = getComputedStyle(el);
                const r = el.getBoundingClientRect();
                // le texte réel peut être dans un enfant (em, strong) : couleur de l'élément lui-même
                return {color: c.color, fs: c.fontSize, fw: c.fontWeight, fst: c.fontStyle, w: Math.round(r.width), h: Math.round(r.height), txt: (el.textContent||'').trim().replace(/\\s+/g,' ').slice(0,40), opacity: c.opacity};
            }''')
            # Rendre transparents l'élément et ses descendants (texte + traits SVG)
            el.evaluate('''(el) => {
                const all = [el, ...el.querySelectorAll('*')];
                el.__saved = all.map(e => [e, e.style.color, e.style.webkitTextFillColor, e.style.textShadow, e.style.stroke, e.style.fill, e.style.outline, e.style.borderColor]);
                for (const e of all) { e.style.color = 'transparent'; e.style.webkitTextFillColor = 'transparent'; e.style.textShadow = 'none'; if (e.tagName === 'path' || e.tagName === 'svg' || e.tagName === 'ellipse' || e.tagName === 'circle') { e.style.visibility = 'hidden'; } }
                // pseudo-éléments (flèches, puces) : on ne peut pas les toucher — ils restent comptés
            }''')
            page.wait_for_timeout(120)
            try:
                png = el.screenshot(timeout=8000)
            except Exception as ex:
                out.append({'label': label, 'sel': sel, 'error': 'shot: ' + str(ex)[:60]})
                el.evaluate('(el) => { for (const [e,c,f,t,s,fi,o,b] of (el.__saved||[])) { e.style.color=c; e.style.webkitTextFillColor=f; e.style.textShadow=t; e.style.visibility=""; } }')
                continue
            el.evaluate('(el) => { for (const [e,c,f,t,s,fi,o,b] of (el.__saved||[])) { e.style.color=c; e.style.webkitTextFillColor=f; e.style.textShadow=t; e.style.visibility=""; } }')
            im = Image.open(io.BytesIO(png)).convert('RGB')
            w, h = im.size
            # zone intérieure (évite bordures/anneaux) : marge 12 % de chaque côté
            mx, my = int(w * 0.12), int(h * 0.12)
            box = im.crop((mx, my, max(mx + 1, w - mx), max(my + 1, h - my)))
            px = list(box.getdata())
            if not px:
                out.append({'label': label, 'sel': sel, 'error': 'vide'}); continue
            step = max(1, len(px) // 4000)
            px = px[::step]
            lums = sorted(((lum(c), c) for c in px), key=lambda x: x[0])
            med = px[len(px) // 2]
            rs = sorted(px, key=lambda c: c[0]); gs = sorted(px, key=lambda c: c[1]); bs = sorted(px, key=lambda c: c[2])
            med = (rs[len(rs) // 2][0], gs[len(gs) // 2][1], bs[len(bs) // 2][2])
            dark = lums[int(len(lums) * 0.05)][1]
            light = lums[int(len(lums) * 0.95)][1]
            fg, alpha = parse_rgb(info['color'])
            fs_px = float(info['fs'].replace('px', ''))
            fw = int(info['fw']) if info['fw'].isdigit() else 400
            large = fs_px >= 24 or (fs_px >= 18.66 and fw >= 700)
            seuil = 3.0 if large else 4.5
            r_med, r_dark, r_light = ratio(fg, med), ratio(fg, dark), ratio(fg, light)
            worst = min(r_med, r_dark, r_light)
            out.append({'label': label, 'sel': sel, 'txt': info['txt'], 'fg': '#%02X%02X%02X' % fg, 'fgAlpha': alpha, 'elOpacity': info['opacity'], 'bg_med': '#%02X%02X%02X' % med, 'bg_dark': '#%02X%02X%02X' % dark, 'bg_light': '#%02X%02X%02X' % light,
                        'fs': fs_px, 'fw': fw, 'large': large, 'seuil': seuil, 'ratio_med': round(r_med, 2), 'ratio_worst': round(worst, 2), 'verdict': 'OK' if worst >= seuil else ('LIMITE' if r_med >= seuil else 'FAIL'), 'size': [info['w'], info['h']]})
        print(json.dumps(out, ensure_ascii=False, indent=1))
        browser.close()

if __name__ == '__main__':
    main()
