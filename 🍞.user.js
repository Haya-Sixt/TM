// ==UserScript==
// @name         🍞
// @namespace    🐵
// @version      1
// @description  common
// @run-at       document-start 
// @include      * 
// @exclude      http://localhost:4200/*
// @exclude      https://console.cloud.google.com/*
// @exclude      https://login.live.com/*
// @exclude      https://accounts.google.com/*
//// @exclude      https://gemini.google.com/app/*
//// @exclude      https://onedrive.live.com/edit*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        window.close
// @grant        GM_xmlhttpRequest
// @connect      t3.gstatic.com
// @grant        GM_getTabs
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        window.focus
// @grant        window.onurlchange
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_cookie
// @connect      https://cdn.jsdelivr.net/npm/eruda
// ==/UserScript==
// 🗒: after import script, replace '@match' › '@include'.


// @require      https://cdn.jsdelivr.net/npm/eruda
//
if (!document.querySelector('html')) { console.log(`${GM_info.script.namespace}.${GM_info.script.name} !document.html`); return; }

  
// App
const $app = (function () {

// Init
let app = (document.querySelector('html')['🐵'] = {
  ids: 'mcs_', '🐵': {}, get NS() { return (e = GM_info)=> { with (e.script) { return `${namespace}.${name}.` } } }, 
  get I() { return { ni: 'AutoHotkey', tb: `${$app.ids}toolbar`, tbb: `${$app.ids}tabsbar`, oi: `${$app.ids}openIn` } },
  get E() { return { rsi: `${$app.ids}.E.rsi`, rsc: `${$app.ids}.E.rsc` /*📒*/, uc: `${$app.ids}.E.uc`, spa: `${$app.ids}.E.spa` } },
  //{userAgentData} = GM_info // << architecture:'x86', platform:'windows', mobile:false, brands[0].brand:'Microsoft Edge'
  get isDroid() { return navigator.maxTouchPoints == 5 || window.orientation != undefined }, 
  get isPcL() { return !this.isDroid && screen.availWidth > 768; }, //return !['mcs_pcp','mcs_droid'].some(s => navigator.userAgent.includes(s)) } // 🚘, 📺 Theater-view
  get isDesktop() { return !navigator.userAgent.includes ("Android") }, 
  get isEdge() { return (!$app.isDroid || navigator.userAgent.includes (" EdgA/")) ? true : false },
  Css (v, e = document.querySelector('html')) { return getComputedStyle(e).getPropertyValue(decodeURIComponent(v)).trim(); }
});
// Incognito
(async ()=> { const l = await navigator.storage?.estimate(), m = performance.memory.jsHeapSizeLimit; if (l?.quota < m) app.isIncognito = true })();
// 🐵 🐛 
app.isDroid && (()=>{ const og_GM_openInTab = GM_openInTab; GM_openInTab = (h, o)=> { const e = og_GM_openInTab (h, o); o?.active == false && window.focus (); return e } })();

return app;

})();




// UI
(function () {

const h = 'h1, h2, h3, h4, h5, h6', hh = `${h}, is:(${h})`, nf = ':not(style*=["fixed"])',
  s = '::-webkit-scrollbar', st = `${s}-thumb`;

GM_addStyle(`

I, ${hh} * {
  max-height: unset !important;
  overflow-x: unset !important; /* 18/10/24 '-x' https://github.com/jwmcpeak/Angular-Fundamentals/blob/main/02.07/src/app/app.module.ts */
}
${nf} a:not(:has(*)) {
  white-space: normal !important;
}
${nf} ${hh} * {
  white-space: unset !important;
}

`);

if ($app.isDroid) return;

GM_addStyle(`
${s} {
    min-height: 1px;
    min-width: 1px;
}
${st}, ${st}:hover, ${st}:active {
    border-color: buttonFace;
    background-color: buttonText !important;
}
${st}, ${st}:hover {
    border-radius: 9px;
    border: solid 6px transparent;
}`);


// https://www.typescriptlang.org/docs/handbook/modules/theory.html
GM_addStyle(` article > div:first-of-type:last-of-type {
    margin: unset !important;
}
nav#sidebar {
  min-width: unset !important;
}`);

})();



// 🪧
(function () {

$app['🪧'] = {
  Add: (v, t = 5000)=> {
    try {
    if (!o) return;
    const n = document.createElement('div'),
      idx = `${id}${Date.now ()}`;
    n.id = idx;
    if ('string number'.includes (typeof v)) {
      `${v}`.split ('\n').forEach (e=> { 
        const o = document.createElement ('p'); 
        o.textContent = e; 
        n.appendChild (o) 
      })
    } else n.appendChild (v);

    o.appendChild (n);
    $app['🪧'].Toggle (1);
    t && setTimeout (()=> document.getElementById (idx)?.remove (), t);
    console.log (`🪧`, v);
    } catch (er) { console.log (`🪧.er`, er) }
  },
  Toggle (show) {
    if (!o) return;
    if (o.style.display != 'flex' || show) o.style.setProperty('display', 'flex')
    else o.style.setProperty('display', 'none');
  }
}

const id = `${$app.ids}🪧`;
let o = null;

GM_addStyle(`

#${id} {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  overflow: scroll;
  direction:ltr; 
  height: 100%;
  width: 100%;
  z-index: 9999999;
  /*⚠️*/
  flex-wrap: nowrap;
  flex-direction: column-reverse;
  align-items: flex-start;
  /*🔔*/
  flex-flow: row wrap; 
  pointer-events: none; 
  align-items: center;
  justify-content: center; 
  align-content: center; 
  padding-top: 10%; 
}

#${id}:empty {
  display: none;
}

#${id} > div {
  background-color: black;
  border: 3px solid orange;
  border-radius: 20px;
  padding: 0 3px;
  font-size: min(4vw, 4vh);
  font-family: system-ui;
  color: white;
}

`);

  
function Init () {
  o = document.createElement('div');
  o.id = id;
  document.querySelector('html').appendChild(o);
}

//
//if (!$app.isTrustedType) 
Init ();

})();



// ⚠️
(function () {

const id = `${$app.I.tb}_Error`;
let tm=0, other=0;

GM_addStyle(`

#${$app.ids}🪧 > div > ul { 
  border-radius : 25px; 
  margin: 1% 20% 0 20%; 
  padding: 1% 5%;
  color: white; 
  text-shadow: 2px 2px 4px #000, -2px -2px 14px #000; 
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); 
	background-color: yellowgreen; /* 🥝 night mode */
  background-image: linear-gradient(to right bottom, rgb(233 136 248 / 87%), rgb(140 13 13 / 70%)); 
}
#${$app.ids}🪧 > div > ul :first-child { 
  text-align: center;
}
#${$app.ids}🪧 > div > ul :not(:first-child) { 
  font-size: smaller;
}
#${id}:after {
  white-space: nowrap;
}

`);

async function Error (ev) {
  if (!document.body) { // xda
    setTimeout (Error, 2000, ev);
    return;
  }
  Notify (ev) && Append (ev);
}
  
function Append (ev) {
  const n = document.createElement('ul'),
    LI = t=> {
      const li = document.createElement('li');
      li.textContent = t;
      n.appendChild (li)
    };

  LI (ev.message.replace('Uncaught',''));
  LI (`Url : ${decodeURIComponent(decodeURIComponent(ev.filename)). replaceAll (/chrome-extension:\/\/.*\//gmu, 'ext://...') }`);
  LI (`Line : ${ev.lineno}`);
  LI (`Column : ${ev.colno}`);
  //LI (`Error : ${ev.error}`);
  $app['🪧'].Add (n, 0);
}

function Notify (ev) {
  const b = document.querySelector(`#${id}`);
  if (ev.filename.includes('.user.js&id=') ) { // || ev.message.startsWith ('Uncaught SyntaxError:') ) {
    if (!b && !tm) setTimeout(()=> $app.Bars[$app.I.tb].Add ('⚠️', 'Error', Click), 1000);
    tm++;
  }
  else other++;
  if (!tm) return;
  GM_addStyle(`#${id}:after { content: "${tm} ${other}"; }`);
  return true;
}

function Click () {
  $app['🪧'].Toggle ();
}

//
window.addEventListener("error", Error);

})();



// Touch timing
(function () {
  
  if (!$app.isDroid) return;

  let timer = [];
  const step1 = 1000;
  window[`${$app.ids}longtouch_steps`] = [step1];

  async function Start(ev) {
    const e = ev.target.id ? ev.target : ev.target.parentNode;
    timer.push({e: e, i: setTimeout(Long, step1, e, step1)});
    contextmenu = 0;
  }

  async function End() {
    timer.forEach((t) => clearTimeout(t.i) ); // 🗒: Probably a 🐛. It won't stop it
    timer = [];
    setTimeout(()=> { window[`${$app.ids}longtouch`] = null }, 300);
  }

  function Long (e, t) {
    if (!contextmenu) return;
    window[`${$app.ids}longtouch`] = { e: e, t: t }; 
    dispatchEvent(new Event(`${$app.ids}longtouch`)); 
  }

  let contextmenu;
  addEventListener("contextmenu", async ()=> { contextmenu = 1; });
  window.addEventListener("touchstart", Start);
  window.addEventListener("touchend", End);

})();

 
// History
// TODO: outlook.live.com
(function() {


//
$app.Nav = { 
  get isReload () { return window.performance.getEntriesByType('navigation').map((nav) => nav.type).includes('reload') }
};


//
const c_h = `${$app.I.tbb}_history`, 
  c_b = `${$app.I.tb}_Back`,
  {pushState, replaceState} = history,
  c_ts = 20000, AH = ()=> ah.filter ((e)=> e.id && typeof e.title != 'undefined');
let bar;


//
async function Change () { 
  // - 📺 fires it also after load 'complete' (and twice!) (on all pages - grid, watch...)
  //      Hence the href, for firing only once - when navigating the app menus (not including watch-links etc).
  //      And to be even more clearer - on other websites, except for 📺, it doesn't fire on first page/load.
  //      14.5.23 Analysis: yt incriminating 'index' param, after every loading, no matter what is the real Playlist index (but perhaps only on the verge between videos). 
  //                        Therefore, comparison to the href isn't the solution.
Log ('Change', {h: location.href, ts: event.timeStamp - complete })
  SPA (1);
  if (event.timeStamp - complete < c_ts) return; // 🗒: avg is 8500
  window.dispatchEvent (new Event($app.E.uc));
}


// logic:
// +*. if history up/down, it means forward.
//     ACTIONS: 1. Pop.  2. Push
// ×*. if history the same, it can be: 
// ×   1. both:
// ×     so, check href against idx ±.
// ×   2. new branch:
// ×   when href is new.
// ×   but, still, not sufficient info!
// ×     a, b, a/c, 
// ×      b, a.  idx=b, href=a.
// ×   yet, it's not that crusial.
// ×   hint: if spa, than prioritize forward..
// ×     'din' triggers nothing in b/f.
// -*. if history the same, and last != href,
//     ACTIONS: 3. Replace-Last. 
//
// Testing results:
// *. 'urlchange':
//      1. doesn't detect 'back' on 'xda'.
//      2. it's the only ev triggered by 📺's 'autoplay next'
// 🗒: DEVTools:  monitorEvents (window),  monitorEvents (window, ['blur']),  unmonitorEvents (window)
//



// 🗒: triggered by interactive(), pushstate(), popstate(-1)
let spa;
async function SPA (p = 0, state) {
Log ('SPA', {p: p, isReload: $app.Nav.isReload });
  if (ah.length == history.length && event && event.timeStamp - spa < c_ts) return; // 🗒: avg is 8500
  if (event) spa = event.timeStamp;
  window.dispatchEvent (new CustomEvent ($app.E.spa, { detail: { load: !p } } ));
  ah.length !== history.length && Add (state);
  Mark ();
}


//
let ah = JSON.parse (sessionStorage.getItem (c_h) ?? '[]');
function Add (state) {
  while (ah.length >= history.length) ah.pop ();
  while (ah.length < history.length) ah.push ({}); // when diff = 2 than the first entry is 'New Tab'.
  if (state) Save ({ ...ah.findLast (e=> e.id), ...state})
  else ah [ah.length - 1].id = 1; // needed for 'style :after' 
Log ('Add');
}

//
function Mark () {
//  GM_addStyle (`#${c_b}:after { content: "${ AH ().length < 2 ? '' : AH ().length }"; }`);
}

//
function Save (t, title) {
  const h = location.href;
  let x = ah.length - 1;
  if (title && t.id != ah [x].id) ah [x].title = t.title;
  if (x >= 0 && ( !ah [x].history_href || !ah.find ((e)=> e.history_href == h) )) {
    const id = Date.now ();
//191124
//console.log ('🍞.💊: $app.Tab.id: %s, \nt.id: %s, \nDate.now: %s, \nah[x].id: %s, \nt, ah:', $app.Tab.id, t.id, id, ah [x]?.id, t, ah)
    ah [x] = t;
    ah [x].id = t.id > 1 ? t.id : id;
    ah [x].history_href = t.state_url ? t.state_url : h;
  }
Log ('bar.S', {t: t});
  sessionStorage.setItem (c_h, JSON.stringify (ah));
  // Back btn
  const b = document.getElementById (c_b), e = ah [0]; // '0' means no more history, therefore closing tab 
  if (b) b[c_h] = { t: e.title, h: e.history_href }; // 🗒: 'title' needed bc GDrive doesn't change url, only title.
}

//
function Click (t) { 
Log ('bar.C', { history_href: t.history_href });
  if (t.state_url) return location.replace (t.state_url);
  //if (t.state_position) return history.go (t.state_position);
  let x = ah.length - 1, xs, xt;
  while (x >= 0 && (!xs || !xt)) {
    if (!xs && ah [x].history_href == location.href) xs = x;
    if (!xt && ah [x].history_href == t.history_href) xt = x;
    x--;
  }
  if (x >= 0) history.go (xt - xs);
}


//
let interactive
function Interactive () {
  interactive = 1;
  window.dispatchEvent (new Event($app.E.rsi));
  SPA ();
  // init
  bar = $app.Bars[$app.I.tbb];
  bar.Data ({
    L: (cb)=> cb (AH ()), 
    C: Click,
    S: Save,
    Title: 'unique',    
  });
}

//
let complete;
function Complete () { // 🗒: can't use 'ev'
  complete = event.timeStamp;
  if (!interactive) Interactive (); // 'Iframe' doesn't fire 'Interactive'
  window.dispatchEvent (new Event($app.E.rsc));
}

//
async function ReadyStateChange () {
  switch (event.target.readyState) {
    case 'interactive': Interactive (); break;
    case 'complete': Complete ()
  }
}


//
function Log (k, v = null) { return; 
  const c_log = `${$app.NS ()}History`,
    t = document.querySelector('title')?.textContent, h = location.href;
  try {
  const j = JSON.parse (sessionStorage.getItem (c_log)) ?? [],
    d = v ? [{k: k, v}] : [k];
  d.push ({history: history.length});
  d.push ({ah: ah});
  d.push ({href: h});
  d.push ({title: t});
  j.push (d);
  sessionStorage.setItem (c_log, JSON.stringify (j));
  console.log (c_log, d);
  }
  catch (e) { 
    console.log (c_log, e);
    throw e;
  }
}


//
document.addEventListener ("readystatechange", ReadyStateChange);
window.addEventListener ('urlchange', Change); 

//
// test result: 'din.org.il' fires nothing 
window.addEventListener('popstate', (ev)=> {
  Log ('popState', {ev: ev});
  SPA (ev);
});

//
history.pushState = (...a)=> {
  try { 
Log ('pushState', { args: a });
  pushState.call (history, ...a); //  [{a},'']);
  // * fix for 📺 WL. The index didn't change.
  // * on Maccabi 💊 -> new appointment, it 🔙 
  const l = a[2]?.split ('/,')?.[0]; // ',DanaInfo=' at the end of every url in Maccabi 💊 (causing new appointment to 🔙) 
  if (l && !location.href.includes (l)) location.assign (a[2]);
  SPA (1, { title: a [0] ? a [0]?.current : a [1], state_position: a [0]?.position, state_url: !a[2]?.startsWith ("/") ? a[2] : new URL (a [2], location).href }); 
  } catch (ex) { console.log (`${$app.NS ()}history.pushState.ex`, ex)}
};

//
history.replaceState = (...a)=> {
  try {
Log ('replaceState', { args: a });
  replaceState.call (history, ...a);
//    replaceState.apply(history, [{a},'']);
  } catch (ex) { console.log (`${$app.NS ()}history.replaceState.ex`, ex)}
//  SPA (1, a); 
};


//
// test result: 'din.org.il' fires only type 'navigate' (but others do fire b/f).
// 🗒: 'PerformanceObserver' doesn't help detecting 'uc'.
function Observe () {
  const observer = new PerformanceObserver ((list) => {
      list.getEntries ().forEach ((entry) => {
Log ('Observe', { type: entry.type, e: entry.type });
//        if (entry.type === "back_forward") 
      });
    });
  observer.observe ({ type: "navigation" }); //, buffered: true 
}

//
//Observe ();


})();




// Bars
(function () {

GM_addStyle(`

.${$app.ids}bar {
  z-index: 9999999 !important;
  border-spacing: unset !important;
  padding: 0 !important;
  margin: 0 !important;
  font-family: sans-serif !important;
  display: block !important;
  zoom: 1 !important;
  width: fit-content !important; /*din.org.il*/
  border: none !important;
  background: transparent !important;
  line-height: 0 !important; /*ask-dh.org*/
  transition: all 275ms ease;
}
.${$app.ids}bar tr {
  direction: rtl !important;
}
.${$app.ids}bar td {
  direction: rtl !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  display: inline-block !important;
  text-align: center !important;
  vertical-align: middle !important;
  cursor: pointer !important;
  max-height: max(4.6vw,4vh) !important;  /* dev.Mozilla*/
  max-width: max(4.6vw,4vh) !important; 
  min-height: max(4vw,4vh) !important; /* 4,4 tested on 📱 */
  min-width: max(4vw,4vh) !important;
  transition: all 0.5s ease-out;
}
.${$app.ids}bar td:empty {
  min-width: max(2vw,2vh) !important;
}
.${$app.ids}bar td::after {
  position: relative;
  color: purple;
  font-size: max(3vw,3vh);
  text-shadow: 0 -1px 3px #00b0ff, -1px 0 3px hsl(210deg 8% 5%), 0 1px 3px #00b0ff, 1px 0 3px hsl(210deg 8% 5%);
  white-space: nowrap; 
  font-weight: 400;
}
.${$app.ids}bar td::before {
    color: purple;
    font-size: 0.5em;
} 
.${$app.ids}bar img {
  opacity: 0.8 !important;
  filter: unset !important;
  width: 1${$app.isDroid ? 1 :0}0% !important; /* 🗒: it has no effect on 📱din.org.il */
  height: 1${$app.isDroid ? 1 :0}0% !important;
}
@media (display-mode: fullscreen) { .${$app.ids}bar { display: none !important; } }

.${$app.ids}barFixed {
  position: fixed !important;
  right: 10vw !important;
}
.${$app.ids}barAbs {
  position: absolute !important;
  display: none;
}

`);

//
$app.Bars = [];

//
$app.Bar = class Bar {
  static Type = { Fixed: 'Fixed', Abs: 'Abs' }
  //
  constructor (id, type = $app.Bar.Type.Fixed) {
    this.t = document.createElement("table");
    this.t.id = this.id = id;
    this.type = type;
    this.t.className = `${$app.ids}bar ${$app.ids}bar${type}`;
    this.t.appendChild(document.createElement('tr'));
    document.querySelector('html').appendChild(this.t); // document.body fails on All4pet

    $app.Bars[id] = this;
  }
  //
  get btns () {
    return this.t.querySelectorAll('td');
  }
  //
  Add (t, id, cb, options) {
    const b = document.createElement("td");
    if (typeof (cb) != 'function' && !options) {
      options = cb;
      cb = null
    }
    if (!options) options = {};
    if (typeof options?.ccc == 'undefined') options.ccc = 1;
    if (options?.title) b.title = options.title;
    if (options?.tag) b.tag = options.tag;
    else if (id) b.title = String(id).split('_').reverse()[0] // (i.e. yt_WatchLater)
    if (!id) id = Date.now ();
    b.id = `${this.id}_${id}`;
    if (document.querySelector(`#${b.id}`)) return;
    Click (this, b, cb, options.ccc);
    b.appendChild(Img(t));
    //
    const tag = `${$app.ids}bar_hover`, c_tr = `#${this.id} > tr`, c_td = `${c_tr} > td:not([${tag}]):not(:empty)`, //:not([style*="display: none"])`, 
      tr = document.querySelector (c_tr),
      A = e=> td ? td.insertAdjacentElement ('afterend', e) : tr.appendChild (e);
    let td = Array.from (document.querySelectorAll (c_td)).reverse()?.[0];
    if (tr.childNodes.length) {
      A (document.createElement("td"));
      td = td?.nextSibling ?? tr.lastChild;
    }
    A (b);
    //
    b.Badge = (c, o)=> {
      const ba = o?.before ? 'before' : 'after';
      GM_addStyle(`#${this.id}_${id}::${ba} { content: "${c??''}" }`);
    }
    return b;
  }
  //
  #Remove (id) {
    id && this.t.querySelector (`#${id}`)?.remove (); 
    this.t.querySelector ('td:empty + td:empty')?.remove (); 
  }
  Remove (id) {
    this.#Remove (`${this.id}_${id}`);
  }
  //
  Clear (tag) {
    this.btns.forEach(b=> {
      (!tag || b.tag == tag) && this.#Remove (b.id);
    });
  }
};

//
function Click (bar, b, cb, ccc) {
  const effect = () => { b.style.setProperty('filter', 'invert(0.8)'); setTimeout(()=> b.style.setProperty('filter', 'unset'), 1000); };
  if ($app.isDroid) {
    b.onclick = ()=> {
      effect ();
      Dispatch (bar, b.id, 1, cb);
    }
    addEventListener(`${$app.ids}longtouch`, async () => {
      const d = window[`${$app.ids}longtouch`];
      if (d.e == b && d.t >= 1000) Dispatch (bar, b.id, 2, cb);
    });
  }
  else {
    let c = 0;
    b.onclick = ()=> {
      if (c == 0 || !(event instanceof CustomEvent)) { 
        c++;
      }
      if (c == 1) {
        effect ();
        setTimeout(() => { Dispatch (bar, b.id, c, cb); c = 0; }, ccc == 1 ? 0 : 1000);
      }
      return false;
    };
  }
}

//
function Dispatch (bar, id, c, cb) {
  if (c == 3) {
    dispatchEvent(new Event(id + '_TrplC')); // unused
  }              
  else if (c == 2) {
    dispatchEvent(new Event(id + '_DblC')); 
  }
  else {
    if (typeof cb == 'string') GM_notification(cb, $app.I.ni)
    else if (typeof cb == 'function') cb();
    dispatchEvent(new Event(id));
  }
  bar.Click && bar.Click();
}

//
function Img (t) {
  const img = document.createElement("img"), h = 32; // 🗒: changing 'h' won't enlarge the btn (tested also on 📱din.org.il).
  let src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${h}" height="${h}">`;
  if (t.startsWith('data:image')) {  
    src += ` <image href="${t}" width="${h}" height="${h}" />`
  } 
  else {
    src += ` <text dx="${$app.isDroid ? -1 : -6}" dy="${$app.isDroid ? 26 : 27}" style="font: ${$app.isDroid ? h-4 : h}px sans-serif;" >${t}</text>`;
  } 
  img.src = src + '</svg>';
  return img;
}

//
function Hide () {
  let d = 'block';
  if (document.fullscreenElement) d = 'none';
  GM_addStyle(`.${$app.ids}bar { display: ${d} !important; }`);
}

//
if ( $app.isDroid ) document.addEventListener("fullscreenchange", Hide); // 🥝 ignores the css rule 

})();


// Toolbar
(function () {

const bar = new $app.Bar($app.I.tb);

GM_addStyle(`

#${bar.id} {
  bottom: 2vh !important;
}

`);

function Init () {
  !$app.isDroid && bar.Add ('⬆️', 'Top');
  bar.Add ('⬅️', 'Back', {ccc: 2});
  if ($app.isDroid || $app.isPcL) return;
  bar.Add ('🔃', 'Refresh', ()=> location.reload() ); // '^R'
  bar.Add ('⏏️', 'Home'); // '^+N'/assign/open ('extension:// » about:blank#blocked // '^+N'    
}

Init ();

})();




// Toolbar Hovering
(function() {

const tag = `${$app.ids}bar_hover`, tag_click = `${tag}_clicked`, bar = $app.Bars[$app.I.tb],
  PS = (e, f)=> [e, e.nextSibling].forEach (e=> f(e)), 
  D = (e, v, p)=> { e.style.setProperty ('display', v ? 'inline-block' : 'none', 'important'); !p && D (e.previousSibling, v, 1) }; 

bar.Hover = {
  Add: (...args)=> { 
    const b = bar.Add (...args);
    if (b) {
      D (b);
      PS (b, e=> e?.setAttribute(tag, ''));
      b.addEventListener ('click', ev=> PS (ev.currentTarget, e=> e?.setAttribute(tag_click, '')));
    }
    return b;
  },
  AddUntilClicked: (...args)=> bar.Hover.Add (...args)?.addEventListener('click', ev=> PS (ev.currentTarget, e=> e?.removeAttribute (tag))),
};

GM_addStyle(`
#${bar.id}:after { /* modified at... */
  position: fixed;
  left: 0;
  font-size: medium;
}
`);
  
function Init () {
  bar.Hover.Add ('‹', 'RTL', RTL);
  $app.isDroid && $app.isEdge && bar.Hover.AddUntilClicked ('☸️', 'eruda', ()=> {
      const e = document.createElement('script');
      e.src='https://cdn.jsdelivr.net/npm/eruda';
      e.onload=()=>eruda.init();
      document.head.appendChild (e);  
    });
//     bar.Hover.Add ('🔎', `Find`, '^f');
//     bar.Hover.AddUntilClicked ('🔠', `Read`);
  bar.t.addEventListener("pointerenter", Enter);
  bar.t.addEventListener("pointerout", Out); // 🗒: Doesn't work - "pointerdown"=>setPointerCapture;
}
  
async function Enter() {
  clearTimeout(i_out);
  Bar (1);
}
  
let i_out;
async function Out() {
  move = false; // effective only for mouse, but not for touch (dragging finger)
  i_out = setTimeout(Bar, 1500, 0);
}

let state = 1; // 🔐
function Bar (on) {
  if (state != on) return;
  if (on) {
    document.querySelectorAll (`#${bar.id} td[${tag}]`).forEach (e=> D (e, 1));
    dispatchEvent(new Event(`${bar.id}_${tag.replace($app.ids,'')}_on`));
    //
    if (event.pointerType == "touch") bar.t.addEventListener("touchmove", Move)
    else bar.t.addEventListener("pointermove", Move);
    state = 0;
    //
    GM_addStyle(`#${bar.id}:after { content: "Modified ${parseInt( ( (Date.now ()) - (new Date(document.lastModified)) ) / (1000 * 3600 * 24) )} days ago" }`);
  }
  else {
    GM_addStyle(`#${bar.id}:after { content: "" }`);
    Click (()=>{
      bar.t.removeEventListener("pointermove", Move);
      bar.t.removeEventListener("touchmove", Move);
      document.querySelectorAll (`#${bar.id} td:is([${tag}], [${tag_click}])`).forEach (e=> D (e));
      dispatchEvent(new Event(`${bar.id}_${tag.replace($app.ids,'')}_off`));
      state = 1;
    });
  }
}

let move;
async function Move () {
  move = event.changedTouches || event.getCoalescedEvents();
}

function Click (cb) {
  const Intersect = (p,box)=> !(p.clientX < box.left || p.clientX > box.right || p.clientY < box.top || p.clientY > box.bottom);
  state = -1; // Prevent multiple 'out' without 'enter' in-between 
  let f = 0;
  document.querySelectorAll(`#${bar.id} td[${tag}]:not([${tag}_clicked])`).forEach((e) => {
    if (move && Intersect(move[0], e.getBoundingClientRect())) {
      f = 1000;
      e.onclick();
    }
  });
  setTimeout(cb, f);
}  

//
function RTL() {
  const r = bar.rtl ? 0 : 'unset', 
    l = r ? 0 : 'unset';
  bar.rtl = r;
  GM_addStyle(`
#${bar.id} {
  right: ${r} !important;
  left: ${l} !important;
}
#${bar.id}:after {
  right: ${l};
  left: ${r};
}
  `);
}
  
//
Init ();

})();




// Tabs + History
(function() {

//
// 🗒: GM context creates different t.id for different scripts. 
//     Also, they can't see each other props.
// 🗒: yt.AutoPlay (eval/slice)
$app.Tab = { 
  Init: ()=> { 
    GM_getTab ((t)=> { 
      if (t.id) {
        $app.Tab.id = t.id;
        return
      }
      $app.Tab.id = t.id = $app.Tab.id ? $app.Tab.id : Date.now ();
      GM_saveTab (t) 
    }) 
  } 
};

$app.Tab.Init ();


//
$app.TabBar = class TabBar extends $app.Bar {

data = [];

Data (d) {
  this.data.push (d);
}

} // TabBar


//
const bar_tb = $app.Bars[$app.I.tb], bar_tbb = new $app.TabBar($app.I.tbb), 
  bar = bar_tbb,
  isStrip = $app.isEdge,
  bar_tabs = isStrip ? bar_tb : bar_tbb,
  c_refresh = 'refresh_', c_tag = $app.I.tbb,
  W = ()=> $app.isDroid ? `${screen.availHeight} ${screen.availWidth}` : `${window.outerHeight} ${window.outerWidth}`;
let w;


//
GM_addStyle(`

#${bar.id} {
  bottom: calc(${ $app.isDroid ? 8 : 2 }vh + 50px) !important;
  width: min-content !important;
}
#${bar.id} td:not(:empty) {
  border-radius: 10px;
  margin-top: 0.5em !important;
}
#${bar.id} td:empty {
  display: none !important;
}
#${bar.id} td:after {
  position: relative;
  top: -0.8em;
  left: -1.6em;
  white-space: nowrap;
}
#${bar.id} img {
  border: #454543 1px solid; /* border and bg are the same as in text-selection-bar*/
  background: #363734;
  border-radius: 50%;
  opacity: 1 !important;
}

`);


//
async function Load (ev) {  return;
  ev.detail.load && $app.isEdge && bar.Data ({
    L: GM_getTabs, 
    C: t=> GM_setValue (bar.id, t.id),
    S: null,
  });
  GM_getTab(Fav);
  isStrip && On (c_tag);
}

async function On (ev) {
  bar.data.forEach (d=> d.L (ts => {
    let s = '';
    //console.log(JSON.stringify(ts))
    for (const [k, t] of Object.entries(ts).reverse()) {
      const title = new URL(t.history_href, location).href.replace (/(https:\/\/|www\.|\/$)/g, ''),
        tag = ev == c_tag,
        isHistory = d.S;
      if (!t.favicon || (tag && isHistory) || (!tag && !isHistory && isStrip) 
          || t.id == $app.Tab.id || t.window != W () || typeof t.title == 'undefined' ) continue;
      if (!tag) s += `#${bar.id}_${t.id}:after { content: "${t.title?.replaceAll("\"","'")}"; } `;
      const b = (isHistory ? bar : bar_tabs).Add (t.favicon, t.id, {tag: tag ? c_tag : null, title: title});
      b?.addEventListener('click', ()=> d.C (t));
    }
    s && GM_addStyle(s);
  }));
}

async function Off (ev) {
  ev == c_tag ? bar_tabs.Clear (ev) : bar.Clear ();
}

function Fav (t) {
  const url = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${location.origin}&size=16`;
  t.history_href != location.href && GM_xmlhttpRequest({
    method: "GET",
    url: url,
    headers: { "Content-Type": "image/png" },
    responseType: 'blob',
    onload: xhr=> {
      var reader = new FileReader();
      reader.onload = ()=> Save (t, reader.result, true);
      reader.onerror = ()=> Save (t, '❌', true);
      reader.readAsDataURL(xhr.response);
    },
    onerror: ()=> Save (t, '❌', true)
  });
}

//
function Send () {
  isStrip && GM_setValue (bar.id, `${c_refresh}${Date.now()}`);
}
  
//
function Receive (k, oldV, v, remote) {
  if (!remote) return; // it's here on this page
  if (v == $app.Tab.id) window.focus()  
  else if (v.startsWith (c_refresh)) {
    Off (c_tag);
    On (c_tag);
  }
}
  
//
let save_i_T, save_title;
function Save (t, r, ds) {
  const S = (title)=> {
      GM_saveTab (t);
      ds && bar.data.forEach ((d, i)=> d.S && d.S (t, title));
    },
    PN = h=> {
      let axt = new URL(h, location).pathname.split ("/,") [0].split ("/");  // '/,' is for 'DanaInfo' (💊)
      axt.length > 3 && axt.splice (0, axt.length - 3);
      return axt.join ("/");
    },
    T = (steps = 0)=> {
      const title = document.title = document.title ? document.title : PN (location.href);
      if (steps < 5 && (save_title == title || !title?.includes ('-'))) return (save_i_T = setTimeout (T, 1000, ++steps));
      // is title already exists
      bar.data.forEach (e=> {
        if (e?.Title != 'unique') {
          save_title = t.title = title;
          return S (true);
        }
        e.L (ts=> {
          const ah = [].concat (...Object.entries(ts)).filter (e=> e?.title && e?.history_href),
            last = ah.findLast (e=> e.id != t.id && e.title && new URL(e.history_href, location/*for keep.google.com*/).hostname == new URL(t.history_href ?? location.href).hostname),
            exists = last?.title?.endsWith ("/") || last?.title == title;
            
          if (exists) {
            const h = last.history_href == t.history_href ? location.href : t.history_href ?? location.href;
            t.title = PN (h)
          } else t.title = title;
          save_title = t.title;
          S (true);
      })});
    };
  clearTimeout (save_i_T);
  ds && T ();
  t.window = w = W ();
  if (r) t.favicon = r;
  S ();
  Send ();
}

async function Resize (r) {
  GM_getTabs(ts => {
    for (const [k, t] of Object.entries(ts)) {
      if (t.window != w) continue;
      t.window = W ();
      GM_saveTab(t);
    }
  });
  GM_getTab(Save);  
}


//
GM_addValueChangeListener(bar.id, Receive);
addEventListener('beforeunload', Send); //'focus' // document.addEventListener("visibilitychange", () => { console.log(document.hidden) })
addEventListener(`${$app.I.tb}_bar_hover_on`, On);
addEventListener(`${$app.I.tb}_bar_hover_off`, Off);
window.addEventListener("resize", Resize);
addEventListener($app.E.spa, Load);

})();




// Links opening 
!$app.isIncognito && (function () {
  
const coi = `.${$app.I.oi}:not([style*="background-image"])`,
      coic = (h = '')=> `${coi}${h}, ${coi}${h} > :is(h1,h2,h3,h4,h5)`, // 📺(watch), hidabroot.org
      coia = (h = '')=> `${coi.replace(':not(','').slice(0,-1)}${h}::after`;

GM_addStyle(`

${coic()}, ${coia()} { 
  background-repeat: no-repeat !important; /* 🗒: 'coia' has no need for 'important' */
  background-size: 100% 1px !important;
  transition: all 275ms ease; 
}
${coic(':hover')}, ${coia(':hover')} { 
  background-size: 100% 5px !important;
}
${coic()}, ${coia()}, ${coic(':hover')}, ${coia(':hover')} { 
  background-image: linear-gradient(to right, gray 0%, rgba(169, 175, 179, 0.2) 0.5%, rgba(169, 175, 179, 0.2) 33%, gray 33%, rgba(139, 145, 149, 0.4) 33.5%, rgba(139, 145, 149, 0.2) 66%, gray 66%, rgba(109, 115, 119, 0.5) 66.5%, rgba(109, 115, 119, 0.5) 99.5%, gray 99.5%) !important;
/*  todo: couldn't find how to split by the anchor width */
/*  box-shadow: inset 0px 33px 25px 0 #000, inset 0 66px 15px 0px #ccc !important; */
  /* angular.dev "on this page" menu */
  -webkit-background-clip: unset;
  background-color: unset;
  color: inherit;
}
/* better on din.org */
${coic()} {
  background-position: 0% 100% !important; 
}
/* better on telegram */
${coia()} {
  width: 100%;
  content: '\u00a0';
  background-position: 0% 0%;
  float: left;
}

`);

function Load() {
  //- 12.01.24. + 24.01.24 (yt)
  new ResizeObserver(openIn).observe(document.body);
  openIn('go');
}

//
let i_openIn = null, openin = 0;
async function openIn (go) {
  clearTimeout(i_openIn);
  if (openin) return;
  if (go !== 'go') return (i_openIn = setTimeout(()=>{ openIn('go'); }, 3000)); // used to be every 1s, but yt's scrolling is slow
  openin = 1; // needed (clearTimeout doesn't work).

//   din.org.il/page/2/?s
//   xda-developers.com/page/3/
//   forum.xda-developers.com/t...4294971/ » /page-2 
//   google.com/search?q=tt&client=firefox-b-d&ei=xEwYY&start=20&sa=N&ved=2ahUK&biw=960&bih=441&dpr=2
//   jobmaster.co.il/ » /index.asp?currPage=2&
//   jobmaster.co.il/jobs/?l=%D7 » /jobs/?currPage=3&l=%D7
//   wikivort.co.il/vort.php?page=3&parasha=52&sort=0 » view.php
//   href="//www.aliexpress.com/campaign/wow/gcp/ae/channel/ae/accelerate/tupr?..."
//   javascript:...
//   data:...
//   pay.google.com/gp/w/u/1/home/met?hl=en » ./home/...

  const host = document.location.host,
    R = ev=> { ev.preventDefault = true; /* 22/10/24 angular.dev */ ev.stopPropagation(); return false },
    E = a=> dispatchEvent (new CustomEvent ($app.I.oi, { detail: { h: a.href } } )),
    SP = (a, ev)=> {
//console.log (Date.now(), a.openin_timestamp, Date.now() - a.openin_timestamp)
//      if (Date.now() - a.openin_timestamp < 1000) return true;
//      a.openin_timestamp = Date.now()
      let e = ev.target;
      while (e && e!=a) {
        if (e.onclick) return 1; 
        e = e.parentElement
      }
    };
  document.querySelectorAll(`a[href]:not([href$="${host}"]):not([href$="${host}/"]):not([href="/"]):not([href=""]):not([href^="#"]):not([href*="/page"]):not([href^="javascript:"]):not([href^="data:"]):not([class*="${$app.I.oi}"]):not(target)`)
  .forEach (a => {
    if (a.offsetWidth < 101) { // 🗒: measure by: 20.11.23 101px yt.subscr. 1.1.22 110px upperbar of 7brachot
      a.setAttribute('target','');
      const C = a.onclick;
      a.onclick = (ev) => {
        if (SP (a, ev)) return;
        E (a);
        if (C) return C (ev);
      }
      return;
    }
    a.setAttribute('target','_blank');
    a.classList.add($app.I.oi); // 🗒: yt.AutoPlay

    // need to insert our event first in chain. 22/10/24 angular.dev
    // two ways: 1. addEvent's 3rd param - 'capture phase'  2. override addEvent - stackoverflow.com/a/64866668/2903366 
//a.onclick = ev=> { return R (ev) };
    a.addEventListener ('click', ev => { 
      if (SP (a, ev)) return;
      E (a); 
      return Click (a, ev); 
//return R (ev) 
    }, true);
  });
  openin = 0
}

function Click (a, ev) {  
  const h = a.href; // 🗒: '.href' vs 'getAttribute ("href")'  eq  'http../thread../' vs '\n/thread/../\t..'.
  let x1 = Math.max(event.layerX, event.offsetX), // 📺watch » click on menu-subscription » layer is the correct (and larger than offset)
//      x2 = x1 - event.currentTarget.offsetLeft,
//      o = x2 > 0 ? x2 : x1, // hidabroot.org. complex: <a><h3>..</h3></a>
      o = x1,
      c = parseInt( o / ( event.currentTarget.offsetWidth / 3) ) + 1;         
  if (c > 3) c = 3;
  if (c==3) document.location.assign(h)
  else if (c==2) GM_openInTab(h, { "active": true, "setParent": true } )
  else if (c==1) GM_openInTab(h, { "active": false, "setParent": true } );
  
  a.removeAttribute ('href');
  setTimeout (()=> a.setAttribute ('href', h), 3000);
  ev.preventDefault = true; // 22/10/24 angular.dev 
  ev.stopPropagation(); 
  return false     
}

//
window.addEventListener($app.E.uc, openIn );
addEventListener($app.E.rsi, Load);

})();



// Back
(function () {

const id = `${$app.I.tb}_Back`, c_name = `${$app.NS ()}Back`;
let ps;


// 🗒: '🏡.🖥️'
//let debug_close;
function Close (force) {
//  const C = () => {
    /*if (!force && window[`${$app.ids}hasHistory`] != 'false' ) return; */
//    try {
Log ('Close', { force: force, hasHistory: window[`${$app.ids}hasHistory`] });
//if (!debug_close) return debug_close = setTimeout (C, 200);
//alert (`${$app.NS ()}Back.Close`);
        // 🗒: 🥝 - all three methods will only replace into 'New Tab'. The best option is to set 'close all tabs on exit'
      open(location, '_self').close(); 
      window.close();
//    }
//    catch (e) { alert(e) } // 🥝 - doesn't work also
//    finally {
      setInterval(()=> window.history.back(), 200);
//    }
//  };
//  setTimeout (C, 200);
}

//
async function Click () {
  const c_h = `${$app.I.tbb}_history`, 
    b = document.getElementById (id)?.[c_h],
    bh =  b?.h == location.href && b?.t == document.title;
  window[`${$app.ids}hasHistory`] = 'false';
//Log ('Click', { bh: bh, b: b, h: b?.h == location.href, t: b?.t == document.title, dt: document.title } );
Log ('Click', { bh: bh, isIncognito: $app.isIncognito } );
  history.back ();
  !ps && bh && setTimeout (()=> !$app.isIncognito && Close(), 1); // 800
}

//
addEventListener(`${id}`, Click);
addEventListener(`${id}_DblC`, () => Close(true) );
//window.addEventListener("beforeunload", function() {
//  window[`${$app.ids}hasHistory`] = 'true';
//Log ('beforeunload', { hasHistory: window[`${$app.ids}hasHistory`] });
//});
//window.addEventListener('popstate', ()=> sessionStorage.setItem (`${c_name}.ps`, ps = 1));


//
function Log (k, v = null) { return;
  const t = document.querySelector('title')?.textContent, h = location.href;
  try {
  const j = JSON.parse (/*localStorage*/sessionStorage.getItem (c_name)) ?? [],
    kd = `${Date.now ()} ${k}`,
    d = v ? [{k: kd, v}] : [kd];
  if (!k) return console.log (c_name, j);
  d.push ({history: history.length});
  d.push ({href: h});
  d.push ({title: t});
  j.push (d);
  /*localStorage*/sessionStorage.setItem (c_name, JSON.stringify (j));
  console.log (c_name, d);
  }
  catch (ex) { 
    console.log (c_name, ex);
    throw ex;
  }
}

Log ();

})();




// 💻 only
if ($app.isDroid) return;



           
// Home
(function () {

function Click () {
  const c = //`chrome.tabs.update({"url": "edge://newtab"})`; 
    `chrome.tabs.create({"active": true, "index": n.tab.index,"url": "edge://newtab"}, null)`;
  GM_setValue ("GM_eval", c); // inject background.js after "saveStorageKey" === t.method :  ;GM_eval(t.key, t.value.slice(1));function GM_eval(k, v) { if (k != "GM_eval") return; const ca = v.slice (0, v.indexOf ("(")).split ("."), p = v.slice (v.indexOf ("(") + 1, -1).replace ("n.tab.index", n.tab.index); let c; ca.forEach (e=> { if (!c) { c = chrome; /*...*/} else c = c[e] }); c (...JSON.parse(`[${p}]`))}
  dispatchEvent(new Event(`${$app.I.tb}_Back_DblC`)); 
}

addEventListener(`${$app.I.tb}_Home`, Click);

})();




// <nav> page layout
// 💫 
// the idea:
// *. find a container that has the page's width and height.
// *..  unlike the code below, by grid-template or <nav>
// *. add a resizer to it's columns.
// *..  unlike the code below, the resizer can be append to body (not to the columns), and reposition.
// *. if it has only two column: auto collapse the smaller one.
// *.

(function () { return;

const tag = `${$app.ids}page_layout_`, c_bg = `${tag}bg`,
  c_nav = `${tag}nav`, c_content = `${tag}content`, c_container =  `${tag}container`,
  c_resizer = `${$app.ids}navmrnu_resizer`,
  BR = e=> e?.getBoundingClientRect(), CS = e=> e.computedStyleMap(),
  F = e=> { 
    e = BR(e); 
    return document.body.clientWidth - e.width < 50 && window.outerHeight - e.height < 50
  },
  S = (a, b)=> {
    a = BR(a), b = BR(b);
    return (b.width * b.height) - (a.width * a.height);
  },
  SR = (a, b)=> -S (a, b),
  Largest = (o = {})=> {    
    const b = o.b ?? document.body, d = b.querySelectorAll (`div${o.selector ?? ''}`);
    return Array.from(d.length ? d : b).filter(o.filter ?? F).sort(o.reverse ? SR : S)?.[0];
  };
let nav, content, container, resizer, nav_cw;

GM_addStyle(`

.${c_bg} {
  background-image: background-image: repeating-linear-gradient(rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 3lh, rgb(88, 89, 86, 1) 4lh, rgb(88, 89, 86, 1) 6lh, rgb(0, 0, 0, 0) 7lh) !important;
}

`);

function Load() {
  setTimeout (Init, 1000);
}
  
function Init () {
  if (BySidebar()) {  
    container.e.classList.add (c_container);
    nav.e.classList.add (c_nav);
    content.e.classList.add (c_content); // 'previous': https://github.com/tianocore/tianocore.github.io/wiki/EmulatorPkg 
    Style ();
    container.e.scrollIntoViewIfNeeded()
    BG (container.e);
  } else BG (Largest ());
}
  
// horizontal lines. easy to read
function BG (e) {
  e?.classList?.add (c_bg);
}  

//https://thelinuxforum.com/articles/799-method-to-install-and-run-onenote-note-taking-app-on-ubuntu-24-04
function BySidebar () {  
  const F = e=> {
      const w = document.body.clientWidth / BR (e).width, h = BR (e).height;
      return w > 2 && w < 6.5 && h > 200    
    },
    Content = ()=> Array.from(container.e.children).reduce((a, e)=> e != nav.e && (a.xw = BR(e).width) * (a.xh = BR(e).height) > a.w * a.h ? {e:e, w:a.xw, h:a.xh} : a, {w:0, h:0});
  if (!(nav = {e: Largest ({filter:F})}).e) return;
  nav.w = `${BR (nav.e).width}px`;
  container = {e:nav.e.parentElement};
  if (!(content = Content ()).e) return;
  // stretch container
  container.w = '100vw';
  content.w = `calc(${container.w} - ${BR (container.e).width}px + ${content.w - 2}px)`;  
  setTimeout(Resizer, 3000);
  return true;
}

//
function Resizer () {
  const r = BR (nav.e);
  resizer = {e:document.createElement('div'), w: r.width, h: r.height, t: r.top, l: r.left};  
  GM_addStyle(`
.${c_resizer} {
  height: ${resizer.h}px;
  top: ${resizer.t}px;
  left: ${resizer.l}px;
}
  `);
  container.e.appendChild(resizer.e);
  resizer.e.classList.add (c_resizer);
}

//
function Style () {
  const collapse_w = `${nav.e.querySelectorAll('a svg').length > 5 ? 3.5 : 8}em`; // stackoverflow
  GM_addStyle(`
.${c_container} {
  --${c_nav}: min(${collapse_w},${nav.w});
  --${c_content}: calc(${content.w} + ${nav.w} - var(--${c_nav})); /* 🗒: simply doing 'container - nav' wrap the nav on 'halacha-yomit' */
  gap: unset;
  grid-template-columns: unset !important; /* mdn, github */  
  width: ${container.w} !important;
  position: relative;
}
.${c_nav}, .${c_content} {
  transition: width .5s ease-in-out .25s !important;
}
.${c_nav} {
  min-width: unset;
  max-width: unset;
  overflow-x: hidden;
  white-space: nowrap;
  width: var(--${c_nav}) !important;
}
.${c_nav}:hover {
  white-space: unset;
  --${c_nav}: ${nav.w} !important; 
  --${c_content}: ${content.w} !important;  
}
.${c_content} {
  width: var(--${c_content}) !important;
}
.${c_resizer} {
  position: absolute;
  border: 5px solid transparent;
  cursor: e-resize;
}
  `);
}


// ByNav () || ByGrid ()
//
// //https://github.com/map220v/edk2-a72q
// function ByGrid () {
//   const FG = e=> CS (e).get('display').value == 'grid';
//   container = {e:Largest ({filter:e=>F(e) && FG(e), reverse:true})};
//   let ok;

//   container.e?.querySelectorAll(':scope > div').forEach(e=> {
//     if (e.nextElementSibling) return (content = {e:e});
//     nav = {e:e}, nav.w = BR(nav.e).width;    
//     const s = document.createElement('div'), 
//       C = (o, x = 0)=> ['grid-column-start','grid-column-end'].forEach (p=> o.style.setProperty(p, `calc(${x} + ${CS (e).get(p).toString()})`));
//     s.id = c_resizer;
//     C(s), C(e, 1);
//     e.insertAdjacentElement('beforeBegin', s);
//     ok = true;
//   });
//   return Style () || ok;
    
//   //
//   function Style () {
//     const collapse_w = '10em';
//     GM_addStyle(`
// .${c_nav} {
//   width: min(${collapse_w},${nav.w}px);
// }
//     `);
//   }
// }

// //https://stackoverflow.com/questions/3680876/using-queryselectorall-to-retrieve-direct-children/17206138#17206138
// function ByNav () {
//   const MaxNav = e=> document.body.clientWidth / e.xw > 2,
//         navs = Array.from(Largest ({selector:':has(nav)', reverse:true})?.querySelectorAll('nav') ?? []);
        
//   nav = navs.reduce ((a, e)=> (a.w * a.h < (a.xw = parseInt(BR(e).width)) * (a.xh = parseInt(BR(e).height)) && MaxNav (a)) ? {w:a.xw,h:a.xh,e:e} : a, {w:0,h:0});
//   container = {e:nav?.e}; 
  
//   while (container.e && ((nav.xw = BR(container.e).width) < document.body.clientWidth - 50) && MaxNav (nav)) {
//     nav = {e:container.e, w:nav.xw};
//     container.e = container.e.parentElement;
//   }
//   content = {e:(nav?.e?.nextElementSibling ?? nav?.e?.previousElementSibling)};
//   if (container.e != nav?.e) return Style () || true;
  
//   //
//   function Style () {
//     const collapse_w = `${nav.e.querySelectorAll('a svg').length > 5 ? 3.5 : 10}em`; // stackoverflow
//     GM_addStyle(`
// .${c_nav} {
//   width: min(${collapse_w},${nav.w}px);
// }
//     `);
//   }
// }

//
addEventListener($app.E.rsi, Load);
  
})();



// Top
addEventListener(`${$app.I.tb}_Top`, ()=> Scroll.scrollIntoView()); // ReferenceError: Cannot access 'Scroll' before initialization




//
class Scroll {
  static #state = -1;

  static #BoundingClientRect (a, b) {
    if (!b.getBoundingClientRect) return -1;
    a = a.getBoundingClientRect();
    b = b.getBoundingClientRect();
    return (b.width * b.height) - (a.width * a.height);
  }
  static #Largest () {
    const d = document.querySelectorAll('body div'),
          b = document.querySelectorAll('body');
    return Array.from(d.length ? d : b).sort(this.#BoundingClientRect)[0];
  }
  static Largest_sid () {
    return `#${this.#Largest ().id}`;
  }
  static #ContainerOfLargest (s) {
    const Container = ()=> {
      const l = this.#Largest ();
      for (let p = l; p; p = p.parentNode) {
        if (p.nodeName == 'BODY') return p;
        if (this.#BoundingClientRect(p, p.parentNode) < 0) return p.parentNode ? p.parentNode : p;
      }
      return l;
    };
    if (this.#state == 1 || s == 1) return Container ();
    if (s == 2) return document.documentElement;
    //
    const s1 = this.#ContainerOfLargest(1), t1 = s1.scrollTop, 
          s2 = this.#ContainerOfLargest(2), t2 = s2.scrollTop,
          Simulate = (s, t)=> {
            if (!s.scrollTo) return;
            const l = document.body.offsetWidth;
            s.scrollTo (l, t + 1);
            if (s.scrollTop > t) {
              s.scrollTo (l, t);
              return true;
            }
          };
    if (t1 > 0 && t2 <= 0) this.#state = 1
    else if (t2 > 0 && t1 <= 0) this.#state = 2
    else if (Simulate (s1, t1)) this.#state = 1
    else this.#state = 2;
    return this.#ContainerOfLargest(this.#state);
  }
  //
  static get scrollLeft () {
    return this.#ContainerOfLargest().scrollLeft;
  }
  //
  static get scrollTop () {
    return this.#ContainerOfLargest().scrollTop;
  }
  //
  static scrollIntoView () {
    this.#Largest ().scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
  //
  static scrollTo (l, t) {
    l = parseInt(l);
    t = parseInt(t);
    const c = this.#ContainerOfLargest();
    this.#scrollToSmoothly (c, l, t, 1000);
    //c.scrollTo ({top: t, left: l, behavior: 'smooth'}); // chrome://flags/#smooth-scrolling 
  }
  //
  static #scrollToSmoothly (c, l, t, time) {
    var currentPos = window.pageYOffset, start = null;
    if(time == null) time = 500;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      var progress = currentTime - start;
      if (currentPos < t) {
          c.scrollTo({top: ((t - currentPos) * progress / time) + currentPos, left: l, behavior: 'auto'});
      } else {
          c.scrollTo({top: currentPos - ((currentPos - t) * progress / time), left: l, behavior: 'auto'});
      }
      if (progress < time) {
          window.requestAnimationFrame(step);
      } else {
          c.scrollTo({top: t, left: l, behavior: 'auto'});
      }
    });
  }
}
 