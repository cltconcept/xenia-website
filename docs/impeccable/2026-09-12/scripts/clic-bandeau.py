"""Contre-vérification du constat C n°1 : le premier tap/clic sur une capsule du bandeau navigue-t-il ?"""
import json
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:4331/"

def essai(pw, mobile, neutraliser):
    browser = pw.chromium.launch(headless=True)
    kw = dict(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True) if mobile \
        else dict(viewport={"width": 1440, "height": 900})
    ctx = browser.new_context(**kw)
    page = ctx.new_page()
    page.goto(URL, wait_until="load", timeout=45000)
    page.wait_for_timeout(3800)
    if neutraliser:
        page.add_style_tag(content=".bandeau:focus-within .bandeau__piste{animation:bandeau-defile 60s linear infinite !important;width:max-content !important;justify-content:flex-start !important}.bandeau:focus-within .bandeau__liste{flex-wrap:nowrap !important}.bandeau:focus-within .bandeau__liste[aria-hidden]{display:flex !important}")
    page.evaluate("document.querySelector('.bandeau').scrollIntoView({block:'center', behavior:'instant'})")
    page.wait_for_timeout(800)
    liens = page.query_selector_all(".bandeau__liste:not([aria-hidden]) a")
    cible = None
    for a in liens:
        b = a.bounding_box()
        if b and 0 < b["x"] and b["x"] + b["width"] < (390 if mobile else 1440):
            cible = a; break
    if cible is None:
        browser.close(); return {"mobile": mobile, "neutralise": neutraliser, "erreur": "aucune capsule visible"}
    texte = cible.inner_text().strip()
    href = cible.get_attribute("href")
    avant = page.url
    b = cible.bounding_box()
    x, y = b["x"] + b["width"] / 2, b["y"] + b["height"] / 2
    if mobile:
        page.touchscreen.tap(x, y)
    else:
        page.mouse.click(x, y)
    page.wait_for_timeout(1500)
    apres = page.url
    res = {"mobile": mobile, "neutralise": neutraliser, "capsule": texte, "href": href, "url_avant": avant, "url_apres": apres,
           "navigue": apres != avant}
    browser.close()
    return res

with sync_playwright() as pw:
    out = []
    for mobile in (True, False):
        for neutraliser in (False, True):
            out.append(essai(pw, mobile, neutraliser))
    print(json.dumps(out, ensure_ascii=False, indent=1))
