// Injects static JSON-LD (Arabic default) into index.html. Run: node tools/build-jsonld.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { faq } from "../js/data.js";
import { translations as T } from "../js/translations.js";
const p = new URL("../index.html", import.meta.url); let html = readFileSync(p, "utf8");
const article = { "@context": "https://schema.org", "@type": "Article", headline: T.ar["hero.title"], description: T.ar["meta.description"], inLanguage: "ar", author: { "@type": "Person", name: "Othman Drioche" }, keywords: "SoC, smartphone processors, معالجات الهواتف", about: "Smartphone SoCs" };
const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Processor Hub" }, { "@type": "ListItem", position: 2, name: T.ar["hero.title"] }] };
const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "ar", mainEntity: faq.map(f => ({ "@type": "Question", name: f.ar[0], acceptedAnswer: { "@type": "Answer", text: f.ar[1] } })) };
const block = `<!--JSONLD-->\n<script type="application/ld+json" id="ld-article">${JSON.stringify(article)}</script>\n<script type="application/ld+json" id="ld-breadcrumb">${JSON.stringify(crumbs)}</script>\n<script type="application/ld+json" id="ld-faq">${JSON.stringify(faqLd)}</script>\n<!--/JSONLD-->`;
html = html.replace(/<!--JSONLD-->[\s\S]*?<!--\/JSONLD-->/, () => block); writeFileSync(p, html); console.log("JSON-LD injected");
