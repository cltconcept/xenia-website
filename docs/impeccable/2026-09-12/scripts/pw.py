"""Outil de capture / évaluation Playwright (repli au navigateur gstack absent).

Usage :
  python pw.py shot <url> <out.png> [--w 1440 --h 900] [--full] [--scroll N] [--wait MS] [--rm]
  python pw.py eval <url> <script.js> [--w 1440 --h 900] [--scroll N] [--wait MS] [--rm]
  python pw.py console <url> [--w 1440 --h 900] [--scroll-all] [--wait MS]

--rm     : émule prefers-reduced-motion: reduce
--scroll : window.scrollTo(0, N) puis attente avant capture
--wait   : délai après chargement (ms), défaut 3500 (l'intro du hero dure ~3 s)
eval     : le script JS est une expression (ou une IIFE) évaluée dans la page, résultat JSON imprimé
"""
import argparse, json, sys, time
from playwright.sync_api import sync_playwright

def main():
    p = argparse.ArgumentParser()
    p.add_argument("cmd", choices=["shot", "eval", "console"])
    p.add_argument("url")
    p.add_argument("arg", nargs="?")
    p.add_argument("--w", type=int, default=1440)
    p.add_argument("--h", type=int, default=900)
    p.add_argument("--full", action="store_true")
    p.add_argument("--scroll", type=int, default=None)
    p.add_argument("--scroll-all", action="store_true")
    p.add_argument("--wait", type=int, default=3500)
    p.add_argument("--rm", action="store_true")
    p.add_argument("--mobile", action="store_true", help="UA mobile + touch + deviceScaleFactor 2")
    a = p.parse_args()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx_kwargs = dict(viewport={"width": a.w, "height": a.h},
                          reduced_motion="reduce" if a.rm else "no-preference",
                          locale="fr-BE")
        if a.mobile:
            ctx_kwargs.update(device_scale_factor=2, is_mobile=True, has_touch=True,
                              user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
        ctx = browser.new_context(**ctx_kwargs)
        page = ctx.new_page()
        msgs = []
        page.on("console", lambda m: msgs.append({"type": m.type, "text": m.text}))
        page.on("pageerror", lambda e: msgs.append({"type": "pageerror", "text": str(e)}))
        page.goto(a.url, wait_until="load", timeout=45000)
        page.wait_for_timeout(a.wait)
        if a.scroll is not None:
            page.evaluate(f"window.scrollTo(0, {a.scroll})")
            page.wait_for_timeout(1200)
        if a.scroll_all:
            h = page.evaluate("document.documentElement.scrollHeight")
            y = 0
            while y < h:
                page.evaluate(f"window.scrollTo(0, {y})")
                page.wait_for_timeout(250)
                y += 600
            page.wait_for_timeout(800)
        if a.cmd == "shot":
            page.screenshot(path=a.arg, full_page=a.full)
            print(json.dumps({"ok": True, "out": a.arg, "scrollHeight": page.evaluate("document.documentElement.scrollHeight"),
                              "docWidth": page.evaluate("document.documentElement.scrollWidth"), "console": msgs}, ensure_ascii=False))
        elif a.cmd == "eval":
            js = open(a.arg, encoding="utf-8").read()
            res = page.evaluate(js)
            print(json.dumps({"result": res, "console": msgs}, ensure_ascii=False, indent=1))
        else:
            print(json.dumps({"console": msgs, "scrollHeight": page.evaluate("document.documentElement.scrollHeight"),
                              "docWidth": page.evaluate("document.documentElement.scrollWidth")}, ensure_ascii=False, indent=1))
        browser.close()

if __name__ == "__main__":
    main()
