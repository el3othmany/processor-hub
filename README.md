# Processor Hub — Smartphone SoC Guide

Bilingual (Arabic RTL default / English LTR) educational site. HTML5 + CSS3 + vanilla JS ES modules. No libraries, no build step. Visual identity (OD mark, colors, fonts) comes from Othman Drioche's portfolio; content is original.

## Run locally
```
cd processor-hub
python3 -m http.server 8000   # open http://localhost:8000
```
(ES modules need a server; `file://` will not work. Termux on Android: `pkg install python`.) Add `?lang=en` or `?lang=ar` to force a language without saving it.

## Structure
`index.html` · `css/` (themes, style, responsive) · `js/` (`main`, `i18n`, `theme`, `nav`, `data`, `render`, `charts`, `translations`, `storage`) · `tools/build-jsonld.mjs` · `tests/`

## Update content
- All facts live in `js/data.js` (`{ar, en}` pairs). All UI text: `js/translations.js`.
- After editing FAQ data run `node tools/build-jsonld.mjs` to refresh the static JSON-LD (it also updates at runtime on language change).
- Tests: `node tests/check.mjs` (static/data/links/JSON-LD) and `node tests/smoke-dom.mjs` (render + chart logic on a DOM stub; not a browser).

## Places that need manual updating (marked `data-placeholder="true"`)
1. **Price ranges** — `prices` in `data.js` (all four tiers, USD, approximate).
2. **2025 chip rows** — Snapdragon 8 Elite Gen 5, Apple A19/A19 Pro in `generations`.
3. **Release years/nodes** in `generations` and `socs`: verify against vendor pages.
4. No benchmark scores are included on purpose; add only with a dated source.
5. On deploy: absolute `hreflang` URLs, `canonical`, `og:url`, `og:image`.
