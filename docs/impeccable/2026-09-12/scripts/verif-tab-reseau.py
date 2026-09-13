"""Vérifications post-correction :
 1. ordre de tabulation desktop : les CTA du hero ne reçoivent le focus que visibles (scène amenée à sa fin)
 2. réseau : le film desktop n'est pas demandé avant un signe de défilement, et l'est après
 3. bandeau : premier clic navigue (desktop + mobile)
 4. en-tête mobile : pilule RDV visible, ≥ 44 px, pas de débordement à 390 et 360
"""
import json, sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4331/"
out = {}

with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True)

    # 1. Tabulation desktop
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    page.goto(URL, wait_until="load", timeout=45000)
    page.wait_for_timeout(4000)
    seq = []
    for i in range(16):
        page.keyboard.press("Tab")
        page.wait_for_timeout(350)
        info = page.evaluate("""() => { const a = document.activeElement; if (!a) return null;
            const cs = getComputedStyle(a); const r = a.getBoundingClientRect();
            return { tag: a.tagName, text: (a.innerText||a.getAttribute('aria-label')||'').trim().slice(0,40), cls: a.className.toString().slice(0,50),
                     opacity: cs.opacity, visibility: cs.visibility, y: Math.round(r.y), scrollY: Math.round(scrollY),
                     heroScene: !!document.querySelector('.hero.is-scene') } }""")
        seq.append(info)
    out["tab_desktop"] = seq
    ctx.close()

    # 2. Réseau desktop : film avant / après défilement
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    films = []
    page.on("request", lambda r: films.append(r.url) if "hero-film" in r.url else None)
    page.goto(URL, wait_until="load", timeout=45000)
    page.wait_for_timeout(5000)
    avant = list(films)
    page.mouse.wheel(0, 300)
    page.wait_for_timeout(2500)
    apres = list(films)
    out["reseau_film"] = {"avant_scroll": avant, "apres_scroll": apres}
    ctx.close()

    # 3. Bandeau : premier clic
    def clic_bandeau(mobile):
        kw = dict(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True) if mobile \
            else dict(viewport={"width": 1440, "height": 900})
        c = b.new_context(**kw); p = c.new_page()
        p.goto(URL, wait_until="load", timeout=45000); p.wait_for_timeout(3800)
        p.evaluate("document.querySelector('.bandeau').scrollIntoView({block:'center', behavior:'instant'})"); p.wait_for_timeout(800)
        cible = None
        for a in p.query_selector_all(".bandeau__liste:not([aria-hidden]) a"):
            bb = a.bounding_box()
            if bb and bb["x"] > 0 and bb["x"] + bb["width"] < (390 if mobile else 1440):
                cible = a; break
        if not cible: c.close(); return {"erreur": "aucune capsule visible"}
        texte = cible.inner_text().strip(); bb = cible.bounding_box()
        x, y = bb["x"] + bb["width"]/2, bb["y"] + bb["height"]/2
        if mobile: p.touchscreen.tap(x, y)
        else: p.mouse.click(x, y)
        p.wait_for_timeout(1500)
        res = {"capsule": texte, "url_apres": p.url, "navigue": p.url != URL}
        c.close(); return res
    out["bandeau_mobile"] = clic_bandeau(True)
    out["bandeau_desktop"] = clic_bandeau(False)

    # 4. En-tête mobile à 390 et 360
    for w in (390, 360):
        c = b.new_context(viewport={"width": w, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        p = c.new_page(); p.goto(URL, wait_until="load", timeout=45000); p.wait_for_timeout(3800)
        info = p.evaluate("""() => { const q = s => document.querySelector(s); const r = e => e ? e.getBoundingClientRect() : null;
            const cta = q('.nav__cta'), pill = q('.nav__pill'), burger = q('.nav__burger');
            const rc = r(cta), rp = r(pill), rb = r(burger);
            return { cta: rc && { x: Math.round(rc.x), w: Math.round(rc.width), h: Math.round(rc.height), display: getComputedStyle(cta).display, nom: cta.textContent.trim() },
                     pill: rp && { x: Math.round(rp.x), w: Math.round(rp.width), right: Math.round(rp.right), h: Math.round(rp.height) },
                     burger: rb && { w: Math.round(rb.width), h: Math.round(rb.height) },
                     scrollWidth: document.documentElement.scrollWidth, innerWidth } }""")
        out[f"header_{w}"] = info
        p.screenshot(path=f"C:/Users/debes/AppData/Local/Temp/claude/C--Dev-Noveo--autres-website/7bac8134-cfb9-4728-96e0-f16cbb14937c/scratchpad/verif-header-{w}.png", clip={"x": 0, "y": 0, "width": w, "height": 120})
        c.close()
    b.close()

print(json.dumps(out, ensure_ascii=False, indent=1))
