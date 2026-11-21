// Runtime smoke test with a minimal DOM stub (NOT a real browser): executes render + chart code for both languages.
class N { constructor(t){this.tag=t;this.children=[];this.attrs={};this.dataset={};this.listeners={};this.className="";this._text="";this.style={};this.open=false;}
  append(...c){c.forEach(x=>this.children.push(typeof x==="string"?Object.assign(new N("#text"),{_text:x}):x));} replaceChildren(...c){this.children=[];this.append(...c);}
  setAttribute(k,v){this.attrs[k]=String(v);} removeAttribute(k){delete this.attrs[k];} addEventListener(e,f){(this.listeners[e]??=[]).push(f);}
  set textContent(v){this._text=String(v);this.children=[];} get textContent(){return this._text+this.children.map(c=>c.textContent).join("");}
  all(){return this.children.flatMap(c=>[c,...c.all()]);} querySelector(){return null;} querySelectorAll(){return [];} get classList(){return {toggle(){},add(){}};} }
globalThis.Node = N; const reg = {}; const root = new N("html"); root.lang="ar"; root.dir="rtl";
const ids=["components","tier-list","gen-box","node-list","node-note","core-list","arch-box","bench-list","bench-note","price-box","faq-list","ld-faq","chart-out","chart-controls"]; ids.forEach(i=>reg[i]=new N("div"));
const listeners={};
globalThis.document={ documentElement:root, createElement:t=>new N(t), createElementNS:(n,t)=>new N(t), createTextNode:t=>Object.assign(new N("#text"),{_text:t}), getElementById:i=>reg[i]??null,
  querySelectorAll:()=>[], querySelector:()=>null, addEventListener:(e,f)=>(listeners[e]??=[]).push(f), dispatchEvent:e=>(listeners[e.type]||[]).forEach(f=>f(e)), title:"" };
globalThis.CustomEvent=class{constructor(t,o){this.type=t;this.detail=o?.detail}};
globalThis.localStorage={getItem:()=>null,setItem(){}}; Object.defineProperty(globalThis,"navigator",{value:{languages:["en-US"]},configurable:true}); globalThis.location={search:""};
const { setLang } = await import("../js/i18n.js"); const { initRender } = await import("../js/render.js"); const { initCharts } = await import("../js/charts.js");
let bad=0; const ck=(c,m)=>{console.log((c?"PASS ":"FAIL ")+m); if(!c) bad++;};
setLang("ar"); initRender(); initCharts();
ck(reg["components"].children.length===6,"AR: 6 component cards"); ck(reg["tier-list"].children.length===4,"AR: 4 tier cards");
ck(reg["faq-list"].children.length>=8,"AR: FAQ items"); ck(reg["gen-box"].all().some(n=>n.tag==="tr"&&n.dataset.placeholder==="true"),"AR: placeholder row marked data-placeholder");
ck(reg["price-box"].all().some(n=>n.dataset.placeholder==="true"),"AR: price placeholders marked");
ck(reg["chart-out"].all().filter(n=>n.tag==="rect").length===6,"chart: 6 default bars");
ck(JSON.parse(reg["ld-faq"].textContent).inLanguage==="ar","FAQ JSON-LD AR at runtime");
setLang("en");
ck(root.dir==="ltr"&&root.lang==="en","EN: dir/lang switched"); ck(reg["components"].children[0].textContent.includes("Central Processing Unit"),"EN: content re-rendered in English");
ck(JSON.parse(reg["ld-faq"].textContent).inLanguage==="en","FAQ JSON-LD EN after switch");
const tab=reg["gen-box"].all().find(n=>n.tag==="button"&&n.textContent==="Apple A-Series"); tab.listeners.click[0]();
ck(reg["gen-box"].all().some(n=>n.tag==="td"&&n.textContent.includes("A17 Pro")),"gen tab click shows Apple rows");
const aud=reg["price-box"].all().find(n=>n.tag==="button"&&n.textContent==="AI users"); aud.listeners.click[0]();
ck(reg["price-box"].all().filter(n=>n.className==="match").length===1,"audience click highlights matching tier(s)");
const sel=reg["chart-controls"].all().find(n=>n.tag==="select"); sel.value="cores"; sel.listeners.change[0]();
ck(reg["chart-out"].all().some(n=>n.tag==="text"&&n.textContent==="6"),"chart metric switch to cores works");
const cb=reg["chart-controls"].all().filter(n=>n.tag==="input"); cb.forEach(c=>{c.checked=false; c.listeners.change[0]();});
ck(reg["chart-out"].textContent.includes("Select at least one chip"),"chart empty state");
console.log(bad?`${bad} FAILED`:"SMOKE PASSED"); process.exit(bad?1:0);
