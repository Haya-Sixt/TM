// ==UserScript==
// @name         📺
// @namespace    🐵
// @version      1
// @description  YouTube
// @run-at       document-start
// @match        https://*.youtube.com/*
// @match        https://loader.to/api/button/*
// @exclude      https://*.youtube.com/feed/history*
// @exclude      https://*.youtube.com/live_chat_replay*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getTabs
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.close
// ==/UserScript==



// Common
const $app = (()=> { try { return document.querySelector('html')[GM_info.script.namespace] ?? Object.create (top.document.querySelector('html')[GM_info.script.namespace]) } catch { return {  get NS() { return (e = GM_info)=> { with (e.script) { return `${namespace}.${name}.` } } }  } } })(), 
      Inc = (a, b ='')=> location.href.includes (`${b}youtube.com/${a}`);
$app.$yt = {
  ids: `${$app.ids}yt_`, NS: $app.NS (GM_info),
  get I() { return { gb: `${$app.$yt.ids}guide-button`, wl: `${$app.$yt.ids}WatchLater`, get wlf() { return `${$app.$yt.I.wl}_frm` }, dl: {get n() {return `${$app.$yt.NS}DL`}, url: 'https://loader.to/api/button/?f=mp3&color=049c16&url='} } },
  get E() { return { theater: `${$app.$yt.ids}theater`, toast: `${$app.$yt.ids}toast`} },
  get isWatch() { return Inc ('watch') }, 
  get isShorts() { return Inc ('shorts') },  
  get isWL() { return Inc ('playlist?list=WL') },
  get isGrid() { return Inc ('feed') || Inc ('playlist') || location.pathname == '/' },
  get isChannel() { return Inc ('@') },
  get isTopW () { return location == top.location }, //window.location == window.parent.location 
  get isMobile() { return Inc ('', 'm.') }, 
  get isYT() { return Inc ('') },
  get isDL() { return location.origin == new URL ($app.$yt.I.dl.url).origin },
};


// 📺 Background playback. 🗒: Can be replaced by extension 'Music Mode For YouTube'
$app.$yt.isMobile && $app.$yt.isWatch && (function() {

const lactRefreshInterval = 5 * 60 * 1000, initialLactDelay = 1000;

async function Load () {
  Object.defineProperties(document, { 'hidden': { value: false }, 'visibilityState': { value: 'visible' } });
  window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
  waitForYoutubeLactInit();
}

function waitForYoutubeLactInit(delay = initialLactDelay) {
  if (window.hasOwnProperty('_lact')) window.setInterval(() => { window._lact = Date.now(); }, lactRefreshInterval) 
  else window.setTimeout(() => waitForYoutubeLactInit(delay * 2), delay); 
}

document.addEventListener("DOMContentLoaded", Load);

})();


//
if (Inc ('', 'music.')) return;


// UI
($app.$yt.isYT && $app.$yt.isTopW || $app.$yt.isWL) && (function() {

function Load () {
  $app.$yt.isGrid && Grid ();
  $app.$yt.isWatch && Watch ();
  $app.$yt.isShorts && Shorts ();
  All (); 
  if ($app.$yt.isMobile) return;
  $app.$yt.isChannel && Channel ();
  $app.isDroid && Zoom ();
}


//
function Watch () {
  //
  !$app.$yt.isMobile && !location.search.includes ('app=desktop') && location.assign (location.href.replace ('www.', 'm.'));
  //
  if ($app.$yt.isMobile) {
    const hdr = '#header-bar > header', pb = 'yt-progress-bar', pbl= '.YtProgressBarLineProgressBar', cpc = '#player-control-overlay .player-controls-', cpc_t_b_p_s = `:is(${cpc}top,${cpc}bottom) :is(path,span`,
      tag_fs = `${$app.$yt.ids}fullscreen`, tag_or = `${$app.$yt.ids}orientation`,
      FS = ()=> {
        const fs = document.querySelector ('video'); 
        if (document.fullscreenElement) fs?.setAttribute (tag_fs, '1')
        else fs?.removeAttribute (tag_fs);
        Or ();
      },
      Or = (ev_or)=> {
        const ld = screen.orientation.type.startsWith('landscape'),
          fs = document.fullscreenElement,
          or = document.querySelector ('ytm-watch');

        if (fs) !ev_or && or?.removeAttribute (tag_or); 
        if ((!fs && ld) || (ev_or && fs && !ld)) or?.setAttribute (tag_or, '1');
      };
  
    removeEventListener("fullscreenchange", FS);
    addEventListener("fullscreenchange", FS); 
    removeEventListener("orientationchange", Or);
    addEventListener("orientationchange", Or);

    return GM_addStyle(` 

video[${tag_fs}] { 
  position: absolute !important; top: 0 !important; left: 0 !important;
  height: 100vh !important; width: 100vw !important; zoom: unset !important;
} 


@media not (display-mode: fullscreen) { @media (min-device-width: 900px) and (orientation: landscape) { 
  ytm-single-column-watch-next-results-renderer > div.related-items-container {
    display: none;
  }
}}
 
@media not (display-mode: fullscreen) { @media (max-device-width: 900px) { 

  ${hdr} { filter: grayscale(1) opacity(0.1); }
  ${hdr} > ytm-home-logo { filter: invert(1); }

  ytm-watch { top: 10vh; }
  ytm-watch[${tag_or}] { top: 16vh; }
  /* it set to 'none' by itself: ytm-watch { display: unset !important; } */
  
  .page-container {
    height: 80vh;
    overflow-y: hidden;
  }

  #related, #comments, ytm-standalone-collection-badge-renderer, /* tags */ 
  ytm-item-section-renderer.single-column-watch-next-modern-panels, 
  ytm-playlist-engagement-panel, .slim-owner-subscribe-button {
    display: none;
  }

  player-autonav-toggle, 
  ytm-subscribe-button-renderer,
  like-button-view-model,
  dislike-button-view-model, 
  button[aria-label="Report"],
  .yt-spec-button-shape-next__button-text-content { 
    display: none !important; 
  }

  ${pb} { bottom: -70px !important; }
  ${pbl}Background, ${pbl}Loaded { background-color: dimgray !important; }
  ${pb}-playhead > div, ${pbl}Played { background-color: darkred !important; }

  ${cpc}background-container, ${cpc}middle :is(button[aria-label="Previous video"], button[aria-label="Next video"]) { 
    display: none; 
  }
  ${cpc}content { visibility: visible !important; }
  ${cpc}middle button[aria-label="Pause video"] { opacity: 0; } 

  ${cpc}bottom { 
    z-index: 9999; 
    bottom: -40px !important; 
  }
  ${cpc}bottom button.fullscreen-icon { margin: 0 50px; }
  ${cpc}top {
    top: unset !important;
    bottom: -53px !important;
    z-index: 9999 !important; 
    zoom: 0.7;
  }
  /* device invert color mode: */
  .mobile-topbar-header-background { background-color: transparent !important }
  #header-bar path { fill: black !important; }
  ${cpc_t_b_p_s}) {
    color: gray !important;
    fill: gray !important; 
  }
  ${cpc_t_b_p_s}:not(:has(path))) {
    opacity: 0.8; 
  }
}}

    `);
  }


  //
  GM_addStyle(`
ytd-watch-metadata #top-row {
    direction: ltr;
}
ytd-watch-metadata button:not([aria-label^="like"]) > div:nth-of-type(n + 2), /* all button's Text content. Including 'Subscribe' */
ytd-watch-metadata ytd-download-button-renderer,
#sponsor-button,
ytd-watch-metadata button[aria-label="Thanks"],
ytd-watch-metadata button[aria-label="Clip"],
ytd-watch-metadata button[aria-label="More actions"]
{ 
  display:none !important;
}
#info-text {
  position: absolute;
  z-index: 1000;
}
/* 💻 portrait */
@media (max-device-width: 900px) { 
  ytd-watch-flexy > div:has(ytd-player) {  /* '#full-bleed-container' */ 
    min-height: ${$app.isDroid ? 'calc(-7% + var(--ytd-watch-flexy-panel-max-height))' : 'unset'} !important;
  }
}
  `);

  //
  if (!$app.isDroid) return;

  GM_addStyle(`
tp-yt-paper-button#expand { /* 'more..' */
    display: none;
}
#primary.ytd-watch-flexy {
  margin-left: unset !important;
  padding-right: unset !important;
}
yt-formatted-string#owner-sub-count { /* also subscribers counter */
    font-size: large !important;
}
#info-container a { /* hashtags */
    display: none;
}
h1.ytd-watch-metadata { /* video main title */
  font-size: x-large;
}
ytd-watch-info-text#ytd-watch-info-text * { /* time and views */
    font-size: 2rem;
    font-weight: 100;
}
ytd-text-inline-expander * { /* the 2 lines snippet of the 'more..' */
  font-size: 1.7rem !important; 
}
#meta *, span#video-title { /* videos list */
    font-size: 2.2rem !important;
    font-weight: 100 !important;
    line-height: unset !important;
}
span.inline-metadata-item.ytd-video-meta-block { /* videos list - views count */
    font-size: large;
}
.ytp-svg-shadow,  /* player buttons */
.ytp-time-display { /* player time */
  stroke: gray;
  stroke-opacity: 1;
  filter: drop-shadow(1px 0 1px rgba(0,0,0,.8)) drop-shadow(0 1px 1px rgba(0,0,0,.8));
}
.ytp-time-display { /* player time */ 
  font-size: larger !important;
}
a:is(.ytp-prev-button,.ytp-next-button) {
    width: 30px !important;
}
.ytp-fit-cover-video .html5-main-video { /* Sinai. 🗒: both classes are needed */
  min-width: 100% !important; /* 🗒: not 'vw' */
  left: 0px !important;
}
.ytp-volume-panel {
    display: none !important; /* 'full screen' button is overflowing */
}
tp-yt-iron-dropdown,
tp-yt-paper-dialog {
    zoom: 1.5 !important; 
}
ytd-popup-container { /* Share */
    z-index: 99999;
}
  `);

  //
  Fullscreen (); 

  // 🥝 🐛  
  let fs_top;
  async function Fullscreen () {
    removeEventListener("fullscreenchange", Fullscreen);
    addEventListener("fullscreenchange", Fullscreen);
    const e = document.querySelector('#page-manager');
    let t = '5%', z = 1;
    if (document.fullscreenElement) {
      if (!fs_top) fs_top = e?.getComputedStyleValue ('top');
    }
    else {
      t = fs_top;
      z = 0;
      fs_top = null;
    }
    e?.style?.setProperty('top','${t}', 'important');
    Zoom (z);
  }
}
 

//
function Shorts () {
  if (!$app.$yt.isMobile) return;
  //
  location.hostname.startsWith ('m.') && location.assign (`${location.href}?app=desktop`);
  //
  GM_addStyle(` 

.reel-player-overlay-actions > *:not(ytm-bottom-sheet-renderer),
h2.ReelPlayerHeaderRendererReelTitle > span > span,
.ReelPlayerHeaderRendererReelMultiFormatLink { 
  display: none !important; 
}
@media not (display-mode: fullscreen) { 
  @media (max-device-width: 900px) { 
    button.ytp-unmute, 
    .ReelPlayerHeaderRendererHost > .cbox {
      display: none; 
    }
  }
`);
}


//
function Grid () {
  GM_addStyle(` 
/* hide 'Notify me' */
ytd-browse ytd-grid-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]), 
ytd-browse ytd-rich-item-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]), 
ytd-browse[page-subtype="subscriptions"] ytd-video-renderer ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]:has(ytd-item-section-renderer) {
  display: none;
}
ytd-rich-grid-row, #contents.ytd-rich-grid-row {
  display:contents !important; 
}

#items > ytd-grid-video-renderer:is(
    /* "Notify me" » uOrigin */
    :has(a#video-title[aria-label*="אידיש"])) {
  display: none !important;
}
ytd-rich-shelf-renderer[is-shorts] {
    display: none;
}
`);
  //
  if (!$app.isPcL) GM_addStyle(`
ytd-rich-grid-renderer {
  --ytd-rich-grid-items-per-row: 2 !important;
}`);
  //
  if ($app.isDroid) GM_addStyle(`
ytd-video-meta-block #byline-container { /* channel */
    display: none !important; 
}
#video-title.ytd-rich-grid-media {
  max-height: unset !important;
  -webkit-line-clamp: unset !important;
}
h3.ytd-rich-grid-media * {
    font-size: larger;
}
div#avatar-container.ytd-rich-grid-media {
    position: absolute;
    top: -10rem;
    right: -8%;
    filter: opacity(0.3);
}
ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block {
    max-height: unset !important;
}
div#menu.ytd-rich-grid-media {
    position: absolute;
    top: calc(-5 * var(--ytd-thumbnail-height) / 10);
    right: 2%;
    zoom: 2;
}
ytd-rich-section-renderer { /* shorts? */
    display: none !important;
}
div#video-preview {
    display: none;
}
  `);

  // WL
  $app.$yt.isWL && GM_addStyle(`
#video-title.ytd-playlist-video-renderer {
    overflow: unset;
    font-size: x-large !important; 
    font-weight: 100 !important;
}
td-video-meta-block:not([rich-meta]) #byline-container.ytd-video-meta-block {
    overflow: unset;
    white-space: nowrap;
}
#contents.ytd-playlist-video-list-renderer {
  width: 90vw !important;
  zoom: ${$app.$yt.isTopW ? 0.8 : 1.1};
}
ytd-playlist-video-list-renderer[amsterdam] {
  margin-left: 2vw;
  max-width: unset;
  min-width: 100vw;
}
yt-icon {
  width: var(--iron-icon-width,44px) !important;
  height: var(--iron-icon-height,44px) !important;
}
ytd-playlist-video-renderer[amsterdam-post-mvp] ytd-thumbnail.ytd-playlist-video-renderer {
    width: 140px;
}
div#metadata #byline-container.ytd-video-meta-block {
    max-height: fit-content;
    font-size: 1.5rem;
}
#video-info.ytd-video-meta-block {
    width: 100%;
} 
  `);

  // 🦺 Loading failed. Reboot 
  const Reboot = ()=> {
    const e = document.querySelector("#contents > ytd-continuation-item-renderer:first-child"),
      u = 'https://www.youtube.com/feed/subscriptions?app=desktop';
    if (!e) return;
    steps-- < 10 && $app['🪧'].Add (`Rebooting in ${steps} seconds`);
    setTimeout (Reboot, 1000);
    !steps && location.replace (`${u}&${$app.$yt.NS}=${new Date ().getTime ()}`); // reload
  };
  let steps = 15;
  Reboot ();
}
  
//
function Channel () {
  GM_addStyle(` 
html {
  --ytd-grid-2-columns-width: 100vw;
} 
tp-yt-paper-tabs#tabs {
    margin: 0 !important;
}
#header.ytd-c4-tabbed-header-renderer, 
#wrapper.tp-yt-app-header-layout > [slot="header"] { 
  position: static !important; 
}
#meta *, /* time and view count, and also the description below the channel main title */
span#video-title { 
    font-size: 2.8rem !important;
    line-height: unset !important;
}
span.inline-metadata-item.ytd-video-meta-block, /* also views count */
.yt-simple-endpoint { /* play-lists */
    font-size: x-large !important;
}
  `);

  // prevent right/left swift
  document.querySelectorAll('ytd-two-column-browse-results-renderer > *').forEach((e)=> e.addEventListener('pointerdown', ()=> event.stopPropagation()));
}

function All () {
  if ($app.$yt.isMobile) return GM_addStyle(` .searchbox-dropdown, .modern-overlay { display: none; } `);

  $app.isDroid && GM_addStyle(`
#container.ytd-searchbox > [slot=search-input] {
  min-width: 40px;
} 
.ytp-chrome-bottom { 
  height: 150px !important; 
}
tp-yt-iron-dropdown,
tp-yt-paper-dialog {
  zoom: 1.5 !important;  
  left: 10vw !important;
  top: 15vh !important;
  max-width: calc(90vw / 2 - 5vw) !important; 
  max-height: calc(85vh / 2 - 5vh) !important;
}
  `);
}

function Zoom (reset) { 
  GM_addStyle(`
.html5-video-player {
  width: 100% !important;
}
  `);
  if (!$app.$yt.isTopW) return; 
  // 🗒: the complicity is due to pnp mode
  let w = 1, nw = 1;
  if (!reset) if (!$app.$yt.isGrid) w = 1.6 // 5.9.23 changed from '2' 
  else nw = 2;//1.35; // 8.6.23 changed from '2'.
  GM_addStyle(`
#masthead-container, #guide, #${$app.$yt.I.gb}, #columns, ytd-popup-container {
  zoom: ${w}; 
}
${ $app.$yt.isGrid ? `ytd-popup-container { zoom: ${w/1.3}; }` : '' }
.ytp-chrome-controls {
  zoom: ${w-0.1}; 
}
body {
  zoom: ${nw}; 
}
  `);
}


//
addEventListener($app.E.spa, Load);

})();



// Watch Later (child)
($app.$yt.isYT && $app.$yt.isTopW || $app.$yt.isWL) && (function() {

const dm = $app.$yt.isMobile ? 'm' : 'd',
  c_remove = `${$app.$yt.I.wl}_🧼`, isDelegation = location.href.includes (encodeURIComponent (c_remove));
let w;

//
async function Load () {
  if (!$app.$yt.isWL ) return;
  w = $app.$yt.isTopW ? { contentDocument: document } : parent.document.getElementById ($app.$yt.I.wlf);
  if (!w) return;
  Style ();
  i_init = setInterval (Init, 1000);
}

// 
function Style () {
  if (!$app.$yt.isMobile) document.querySelector ('html').style.fontSize = 'larger';

  GM_addStyle(`
yt${dm}-playlist-video-list-renderer {
  position: fixed;
  top: -2%;
  left: 0;
  width: 100%;
  height: 100%; /* Not tested on PC. Was 'vh', but scrolling didn't work */
  z-index: 9999;
  background-color: ${$app.isDroid ? 'white' : 'black'};
  overflow: auto;
}

ytd-app > ytd-popup-container { z-index: 99999; }
ytd-playlist-video-list-renderer #contents {
  width: 100vw;
  margin: 0 100px 100px 0;
}

ytm-app > bottom-sheet-container { z-index: 9999; }
ytm-playlist-video-list-renderer .video-thumbnail-container-compact {
    width: 90px !important;
    height: 60px !important;
}
.compact-media-item {
    display: flex !important;
}
  `);

($app.$yt.isTopW || !$app.isDroid) && GM_addStyle(`
 
yt${dm}-playlist-video-list-renderer {
  zoom: 0.8;
  direction: ltr;
}
  `);
}

//
let i_init;
function Init () {
  const b = w.contentDocument?.querySelector('body'),
        l = b?.querySelector(`yt${dm}-playlist-video-list-renderer`),
        c = $app.$yt.isMobile ? l : l?.querySelector('#contents');
  if (!c) return; // b?.textContent?.slice (0,100)
  
  clearInterval (i_init);

  Show ();

  isDelegation && document.querySelector (`#${$app.I.tb}_${c_remove}`)?.click ();
}

//
function Remove () {
  const b = w.contentDocument?.querySelector('body'),
        m = b?.querySelector("#button-shape > button"), // button menu
        p = b?.querySelector(`yt${dm}-app > yt${dm}-popup-container`), // menu container
        N = (c)=> $app['🪧'].Add (c); 
     CM = ()=> (p?.querySelector('tp-yt-iron-dropdown:not([style*="display: none"])') && m?.click()) || (isDelegation && setTimeout (()=> window.close(), 3000));

  if (!m || !p) {
    N (`⚠️ No API available for Mobile mode.
      Only for Desktop.
      Trying a workaround...`);
    return (GM_openInTab(`${location.origin.replace ('m', 'www')}/playlist?list=WL&app=desktop#${c_remove}`, { "active": false, "setParent": true } ).onclose = ()=> location.reload()); // 🗒: "doc.addEvListener focus" doesn't work, bcs btn isn't in focus in the first place. 
  }
  
  let i = 4, i_ = setInterval (()=> {
    if (!(i % 2)) m.click(); // open menu
    N (`opening menu (${i})`);  
    b.querySelectorAll(`#items > yt${dm}-menu-navigation-item-renderer> a`).forEach((e)=> {
      if (!e.textContent.includes('Remove watched videos')) 
      clearInterval (i_);
      N (`clicking 'Remove'`);
      e.click(); // click remove
      setTimeout (()=> {
        const cb = b.querySelector("#confirm-button > yt-button-shape > button");
        if (!cb) {
          N (`Error - confirmation dialog not found`);
          return;
        }
        N (`clicking 'Confirm'`);
        cb.click(); // confirm
        setTimeout (()=> {
          CM (); 
        }, 2000);
      }, 2000);      
    });
    if (--i) return;
    clearInterval (i_); 
    m?.click(); // close menu (should now be an empty popup)
    setTimeout (()=> {
      CM () // try again to close menu
    }, 2000);
  }, 1000);
}

function Show () {
  const e = parent.document.getElementById ($app.$yt.I.wlf); 
  if (e && e.style.display != 'block') return;
  $app.Bars[$app.I.tb].Add ('🧼', c_remove, Remove);
  $app.Bars[$app.I.tb].Add ('🔃', `${$app.$yt.I.wl}_🔃`, ()=> location.reload()); 
}

function Hide () {
  $app.Bars[$app.I.tb].Remove (`${$app.$yt.I.wl}_🧼`); 
  $app.Bars[$app.I.tb].Remove (`${$app.$yt.I.wl}_🔃`); 
}

// 
if ($app.$yt.isTopW) addEventListener($app.E.spa, Load)
else {
  document.addEventListener("readystatechange", ()=> event.target.readyState == "interactive" && Load ()); // 🗒: 'rsi' event isn't on iframe
  top.window.addEventListener ('message', (ev)=> ev.data.startsWith (`${$app.$yt.I.wl}_`) && (ev.data.endsWith ('hide') ? Hide () : Show ()) );
}

})();



// Download MP3 (child)
$app.$yt.isDL && !$app.$yt.isTopW && (function() {

const c_name = $app.$yt.I.dl.n; 

//
function Click () {
  const b = document.querySelector ("#downloadButton"),
    C = ()=> {
      if (b.textContent.includes ("Download")) {
        b.click ();
        top.postMessage (c_name, "*");
      }
      else if (!b.textContent.includes ("One moment")
          && !b.textContent.includes ("% done")) {
        top.postMessage (`${c_name}_er`, "*");
      }
      else setTimeout (C, 1000)
    };
  b.click();
  C ();
}
  
//
document.addEventListener("readystatechange", ()=> event.target.readyState == "interactive" && Click ()); 

})();



// Top Frame
if (!$app.$yt.isTopW || !unsafeWindow.innerWidth) return; // 🦺 future proof. e.g. new iframe 'live_chat_replay'



// ⏬ Download MP3
(()=> {

const bar = $app?.Bars?.[$app?.I?.tb], id = 'Download', ids = `#${$app?.I?.tb}_${id}`, c_pl = 'Liked',
  c_name = $app.$yt.I.dl.n, w_id = `${$app.$yt.ids.slice (1)}${id}`;
  
//
function Load () { 
  clearTimeout (i_init);
  $app.$yt.isWatch && Init ();
}

//
let i_init;
function Init (steps = 60) { 
  const v = document.querySelector ('video'), d = v?.duration / 60;
  if (isNaN (d)) return (steps > 0 ? (i_init = setTimeout (Init, 3000, --steps)) : null);
  if (!Add (d)) return;
  Auto (v); 
}

//
function Add (d = 0) {
  const c_tl = ['music','prod.','קליפ','רמיקס','remix','סינגל','שיר','song','ft.', 'cover'], c_ic = '⏬';
  //
  document.querySelector (`#${w_id}`)?.remove (); 
  clearTimeout (i_auto);
  bar.Remove(id);
  Mark ('');
  //
  if (d < 2 || d > 10 || !c_tl.some (e=> document.title.includes (e)) || isDownloaded ()) {
    bar.Hover.Add (c_ic, id, Download); 
    return;
  }
  bar.Add (c_ic, id, Download, {ccc: 2});
  return 1;
}   

//
let i_auto;
function Auto (v, auto = 60, previousTime = 0) {
  if (isCanceled () || isDownloaded ()) return;
  if (auto > 0) {
    if (v.currentTime != previousTime) Mark (auto--);
    i_auto = setTimeout (Auto, 2000, v, auto, v.currentTime);
  }
  else Download ();
}

//
let canceled;
function isCanceled () {
  if (canceled) {
    canceled = 0;
    return 1
  }
  return 0;
}

//
function Mark (v) {
  GM_addStyle (`
${ids}:after { 
  content: "${v}"; 
}
  `);
}

//
function Download (ev) {  
  if (!$app.$yt.isWatch) return;
  const addedToLike = ev?.detail?.content?.includes (`Added to ${c_pl}`);
  Add ();
  //
  if (isDownloaded (1) && ev || !$app.$yt.isWatch) return;
  //
  if (!addedToLike && ev?.type == $app.$yt.E.toast) return;
  //
  DL ();
  GM_addStyle(`#${w_id} { width: 99vw; height: 1px; position: absolute; left: 0; top: 0; }`);
}
  
//
function isDownloaded (dl) {
  try {
  const id = parseInt(new URL(location).searchParams.get ('v').split ('').reduce ((s, e, i)=>s+Math.pow (e.charCodeAt (),i % 2 + 1.5), 0)), 
    v = GM_getValue(c_name, ''),
    pl = $app.$yt.isMobile ? document.querySelector("div.playlist-panel-subhead")?.textContent?.includes (c_pl) : document.querySelector(`#publisher-container > [title^="${c_pl}"]`);
  dl && !v.includes (id) && GM_setValue(c_name, `${id},${v}`);
  return (v.includes (id) || pl);
  }
  catch (er) {  // soft navigate while countdown 
    $app['🪧'].Add (`${$app.$yt.NS}.isDownloaded er: ${er}`);
    return (canceled = 1);
  }
}

//
function DL () {
  const q = `&${encodeURIComponent(c_name)}`,
    H = ()=> {
      const h = location.href;
      return h.includes (q) ? h.replace (q, '') : `${$app.$yt.I.dl.url}${h.split ('&')[0]}&${c_name}`;
    };

  if ($app.$yt.isYT && !$app.$yt.isMobile) return GM_openInTab (H (), { "active": false, "setParent": true } );    
  
  if ($app.$yt.isDL) document.write (`<body></body>`);
  const w = document.createElement ('iframe');
  w.id = w_id;
  w.src = H ();
  w.width="100%";
  w.height="100%";
  w.frameBorder="0";
  document.querySelector ('html').appendChild (w);
  window.removeEventListener ('message', MessageFromChild);
  window.addEventListener ('message', MessageFromChild);
}

//
function MessageFromChild (ev) {
  if (ev.data == c_name) {
    if ($app.$yt.isDL) setTimeout (()=> window.close (), 5000) 
    else document.querySelector (`#${w_id}`).style.setProperty ('display', 'none');
  }
  else if (ev.data == `${c_name}_er`) GM_addStyle(`${w_ids} { height: unset; position: unset; }`);
}


//
if ($app.$yt.isDL) return DL ();
addEventListener($app.E.spa, Load); 
addEventListener ($app.$yt.E.toast, Download); 
addEventListener(`${$app.I.tb}_${id}_DblC`, () => { canceled = 1; Add () });

})();



//
if (!$app.$yt.isYT) return;



// Toast Observatory 
(()=> {

function Load (ev) {
  if (!ev.detail.load) return;
  Observe ()
}

//
function Observe () {
  const mw = $app.$yt.isMobile && $app.$yt.isWatch, dm = mw ? 'm' : '',
    c = mw ? document.body : document.querySelector(`ytd-app > ytd-popup-container`),
    q = `yt${dm}-notification-action-renderer ${mw ? 'span' : 'tp-yt-paper-toast#toast:not([style$="display: none;"]) #text'}`,
    o = { childList: true };
  if (mw) o.subtree = true;
  if (!c) return setTimeout (Observe, 1000);
  let smpr = false;
  try {
    let pLbl;
    new MutationObserver(()=> {
      if (smpr) return;
      smpr = true;
      setTimeout (()=> { // allow label to render
        const lbl = c.querySelector (q)?.textContent;
        lbl && pLbl != lbl && dispatchEvent (new CustomEvent ($app.$yt.E.toast, { detail: { content: lbl } } ));
        pLbl = lbl;
        smpr = false;
      }, 1000);
    })
    .observe (c, o);
  } catch (er) { $app['🪧'].Add (`${$app.$yt.NS}.Toast-Observatory. er: ${er}`) }
}


//
addEventListener($app.E.spa, Load);

})();



// Watch Later
(()=> {

const w = document.createElement('iframe'),
  dm = $app.$yt.isMobile ? 'm' : 'd',
  btn = $app.Bars[$app.I.tb].Add ('🕓', $app.$yt.I.wl, Click, {ccc: 2}),
  IsW = ()=> w.style.display == 'block',
  BScroll= ()=> setTimeout (()=> w.contentDocument?.querySelector('body')?.style?.setProperty('overflow', 'hidden', 'important'), 500);

GM_addStyle(`

#${$app.$yt.I.wlf} {
  position: fixed;
  z-index: 99999;
  display: none;
  border: ${$app.isDroid ? 5 : 1}px solid DimGray;
  border-radius: ${$app.isDroid ? 35 : 10}px;
  transition: all 500ms ease;
}

ytd-playlist-panel-renderer#playlist[playlist-type="WL"] {
  display: none !important;
}

`);

let load = 1;
async function Load (ev) {
  if (!ev.detail.load) return reload = 1; 
  //
  Init ();
}

function Init () {
  OnOff ();
  addEventListener ($app.$yt.E.toast, Toast); 
  Style (1);
} 

//
function Auto (steps = 2) { 
  const v = document.querySelector ('video'), p = v?.paused;
  if ($app.$yt.isWatch && (typeof p =='undefined' || p)) return (steps > 0 ? setTimeout (Auto, 10000, --steps) : null);
  setTimeout (()=> !IsW () && btn.Badge ('🔴', {before: 1}) || Click () || Click (), ($app.$yt.isWatch ? 5 : 10) * 1000);
}

function Toast (ev) {
  //ev.detail.content.includes ('Saved to Watch later') && $app['🪧'].Add (`🕓`, 1000);
}
  
function Click () {
  reload && Reload ();
  let d = 'none', m = 'hide';
  if (!IsW ()) {
    BScroll();
    d = 'block';
    m = 'show';
  }
  w.style.setProperty ('display', d);
  window.postMessage (`${$app.$yt.I.wl}_${m}`, "*");
}

// 🗒: 0 is ⏸️
function OnOff (set) {
  let v = 1;
  if (GM_getValue($app.$yt.I.wl, 0)) v = 0;
  if (!set) v = !v;
  if (v) btn.Badge ();
  if (!v) btn.Badge ("⏸️");
  if (set) GM_setValue($app.$yt.I.wl, v);
}

//
let reload = 1; 
function Reload (force = 0) {
  reload = 0;
  if (load) {
    load = 0;
    w.id = $app.$yt.I.wlf;
    w.src = `${location.origin}/playlist?list=WL${ !$app.$yt.isMobile ? '&app=desktop' : '' }`;
    w.onload = ()=> { i_wl = setInterval (WL, 1000) };
    document.querySelector('html').appendChild(w);
  }
  else if (force) w.src += `&${ new Date().getTime() }` // force reload. needed.
  else {
    w?.contentDocument?.location?.reload();
    Style (1);
  }  
}

//
let i_wl, i_wl_o;
function WL () {
  clearInterval (i_wl_o);
  if (!w.contentDocument) { // pc sleep
    clearInterval (i_wl);
    Reload (1);
    return;
  }
  const b = w.contentDocument.querySelector('body'),
        p = b?.querySelector(`yt${dm}-app > yt${dm}-popup-container`), // menu container
        l = b?.querySelector(`yt${dm}-playlist-video-list-renderer`),
        c = $app.$yt.isMobile ? l : l?.querySelector('#contents'),
        a = c?.querySelectorAll ('a');
  if (!c) return;
  clearInterval (i_wl);
  //
  a.forEach ((a)=> {
    a.onclick = ()=> { 
      const h = a.href.split ('&') [0]; // otherwise it continues playing next.
      dispatchEvent (new CustomEvent ($app.I.oi, { detail: { h: h } } ));
      top.location.assign (h);
      event.stopPropagation ();
      return false;
    };
  });
  //
  let i = 5;
  i_wl_o = setInterval (()=> {
    if (i-- < 0) clearInterval (i_wl_o);
    BScroll();
  }, 500);
  //
  Style();
  BScroll();
  btn.Badge (null, {before: 1})
}

//
function Style () {
  const l = screen.orientation.type.startsWith('landscape'), 
    p = l ? 10 : 2, p100 = 100 - p*2,
    hx = (!l && $app.isDroid) ? -10 : 0;
  GM_addStyle(`
#${$app.$yt.I.wlf} {
  top: ${p}vh;
  left: ${p}vw;
  width: ${p100}vw;
  height: ${p100 + hx}vh;
  ${$app.isDroid ? 'background-color' : 'border-color'}: var(--yt-spec-yellow);
}
  `)
}


//
addEventListener ($app.E.rsc, ()=> Auto ());
addEventListener($app.E.spa, Load);
addEventListener(`${$app.I.tb}_${$app.$yt.I.wl}_DblC`, () => OnOff (true));

})();



// Queue
$app.$yt.isGrid && (function() {

const c_e = 'ytd-miniplayer';

GM_addStyle(` 
${c_e}, div.${c_e} {
    width: min(40vh,40vw) !important;
    height: min(30vh,30vw) !important;
}    
${c_e} {    
    z-index: 9999 !important;
    cursor: move;
}   
${c_e}::before { 
    position: inherit;
    z-index: 99999;
    top: -1em;
    height: 2em;
    width: 100%;
    background-color: var(--default-primary-color);
}
${c_e}:not([modern]) {
    transform: unset !important;
    left: 0 !important;
}
`);

//
function Init (ev) {
  if (!ev.detail.content.includes ('Added to Queue')) return;
  GM_addStyle (`${c_e}::before { content: " "; }`);
  Drag ();
}

//
function Drag () {
  const e = document.querySelector (c_e), EP = ev=> { ev.preventDefault(); p3 = ev.clientX; p4 = ev.clientY };
  let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
  e.onmousedown = Down;

  function Down (ev) {
    EP (ev);
    document.addEventListener ('mouseup', Up);    
    document.addEventListener ('mousemove', Move);
  }

  function Move (ev) {
    p1 = p3 - ev.clientX;
    p2 = p4 - ev.clientY;
    EP (ev);
    e.style.top = `${e.offsetTop - p2}px`;
    e.style.setProperty ('left', `${e.offsetLeft - p1}px`, 'important');;
  }

  function Up() {
    document.removeEventListener ('mouseup', Up);    
    document.removeEventListener ('mousemove', Move);
  }
}

//
addEventListener ($app.$yt.E.toast, Init); 
  
})();



// Unmute
$app.$yt.isMobile && $app.$yt.isWatch && (function() {

async function Load () {
  Init ();
}

function Init (steps = 10) {
  const e = document.querySelector('div#player-container-id button.ytp-unmute');
  if (steps > 0 && !e) return setTimeout (Init, 3000, --steps);
  e?.style?.display != 'none' && e?.click ()
}

//
addEventListener($app.E.spa, Load);

})();



// Share menu - 'Start at'
$app.$yt.isMobile && $app.$yt.isWatch && (function() {

async function Load () {
  Init ();
}

function Init (steps = 10) {
  const e = document.querySelector('#app div.watch-below-the-player button[aria-label="Share"]'); 
  if (steps > 0 && !e) return setTimeout (Init, 3000, --steps);
  e?.addEventListener ('click', ()=> location.assign (location.href.replace ('m.', '').replace ('?v', '?app=desktop&v')))
}

//
addEventListener($app.E.spa, Load);

})();



// 🐛 (missing below the player)
$app.$yt.isMobile && $app.$yt.isWatch && (function() {

const c = { childList: true };
new MutationObserver ((m, o)=> {
  if (!document.body) return;
  o.disconnect();
  o = new MutationObserver ((m, o)=> {
    const c = /\\x2(?![0-9a-f])/g; 
    document.body.querySelectorAll ('script').forEach ((e)=> {
      if (!e.textContent.match (c)) return;
      e.textContent = e.textContent.replaceAll (c, '\\x22');
      o.disconnect();
      console.log (`${$app.$yt.NS}.🐛`);
    });
  });
  o.observe (document.body, c);
  //
  addEventListener($app.E.spa, ()=> o.disconnect());
}).observe (document.querySelector('html'), c);

})();



//
if (!$app.$yt.isMobile) return;



// Guide
(()=> {

let b;

//
async function Load (ev) {
  if (ev.detail.load) i_init = setInterval(Init, 1000)
  else Close (ev);
}

//
let i_init
function Init () {
  b = document.getElementById('guide-button');
  if (b) clearInterval(i_init)
  else return;

  Style ();
  
  Clone ();
}

//
function Clone () {
  const n = b.cloneNode(true);
  n.id = $app.$yt.I.gb;
  document.body.appendChild(n);
  n.addEventListener("click", Click);
}

//
let click = 0;
function Click () {
  const m = document.getElementById("masthead-container"),
    c = document.getElementById("contentContainer");
  if (click++ % 2 == 0) {
    m.style.visibility = "visible";
    c.setAttribute("opened","");
    c.style.visibility = "visible";
    //b.fire('mouseenter');
    b.dispatchEvent(new MouseEvent('mouseenter'));
  }
  else {
    m.style.visibility = "hidden";
    c.removeAttribute("opened");
    c.style.visibility = "hidden";
  }
}

//
function Style () {
  GM_addStyle(`
#masthead-container {
  visibility: hidden;
}
#page-manager {
  position: absolute !important;
  direction: rtl;
}
@media not (display-mode: fullscreen) { 
  @media (max-device-width: 900px) { 
    #page-manager { top: -${ $app.isDroid ? '4%' : '55px' } !important; } 
  } 
  @media (min-device-width: 900px) {
    #page-manager { top: -12% !important; } 
  } 
}
#guide-button {
  visibility: hidden;
}
#${$app.$yt.I.gb} {
  position: fixed;
  top: 0%;
  left: 0%;
  cursor: pointer;
  z-index: 99999;
  font-size: 2em;
  background-color: rgba(0,0,0,0.7);
  border: 1px solid rgba(256,256,0,0.7) !important;
  border-radius: 25px;
  opacity: 0.5;
}
  `);

  !$app.isDroid && GM_addStyle(`
#page-manager {
  width: 100% !important;
}
ytd-app {
  --ytd-mini-guide-width: 0 !important;
}
ytd-mini-guide-renderer {
  display: none;
}
  `);
}

//
let close;
async function Close (ev) {
  const e = document.getElementById("masthead-container");
  if (ev) close = e.style.left;
  if (e.style.visibility != "visible" || e.style.left != close) return;
  setTimeout(()=> {
    document.getElementById($app.$yt.I.gb).click ();
    Close ();
  }, 1000);
}


//
addEventListener($app.E.spa, Load);

})();



// Restricted Mode
(()=> {

const id = `${$app.$yt.ids}RestrictedMode`;

//
async function Load() {
  Fix();

  Verify();
}

function Fix() {
  if (!location.href.includes(id)) Error()
  else if (!GM_getValue(id, 0)) On()
  else Close();
}

function Error() {
  if (!$app.$yt.isWatch) return;
  let steps = 5, i_err = setInterval( () => {
    const e = document.getElementsByTagName('yt-player-error-message-renderer');
    if (steps && (!e.length || !e[0].textContent.includes('Restricted Mode'))) {
      steps--;
      return;
    }
    else {
      clearInterval(i_err);
      steps && (steps=0)==Off(); // Interval  missed...
    }
  }, 3000);
}

function Off() {
  GM_setValue(id, 0);
  document.getElementsByTagName('ytd-app')[0].setRestrictedMode(!1);
  GM_openInTab(location.origin + '#' + id, { "active": false, "setParent": true } );
}

function On() {
  GM_setValue(id, 1);
  document.getElementsByTagName('ytd-app')[0].setRestrictedMode(!0);
}

function Close() {
  window.close();
}

function Verify() {
  let r = -1,
  i_avatar = setInterval( () => {
    const a = document.getElementById('avatar-btn');
    if (a) {
      clearInterval(i_avatar);
      document.getElementById($app.$yt.I.gb).style.setProperty('border-color','rgba(256,256,0,1)','important');
      document.querySelector('ytd-popup-container').style.setProperty('visibility','hidden','important');
      a.click();
      a.click();
    }
  }, 3000),
  i_menu = setInterval( () => {
    document.querySelectorAll('#label.ytd-compact-link-renderer').forEach( (m) => {
      if (m.textContent.includes('Restricted Mode:')) r = m.textContent.includes(' On') ? 1 : 0;
    });
    if (r != -1) {
      clearInterval(i_menu);
      if (document.querySelector('ytd-popup-container > tp-yt-iron-dropdown').style.display !== 'none') {
        document.querySelector('ytd-popup-container > tp-yt-iron-dropdown').style.setProperty('display','none');
      }
      document.querySelector('ytd-popup-container').style.setProperty('visibility','visible','important');
      if (r) document.getElementById($app.$yt.I.gb).style.setProperty('border-color','rgba(0,256,0,0.2)','important') 
      else {
        document.getElementById($app.$yt.I.gb).style.setProperty('background-color','red','important'); 
        throw 'Restricted Mode is off';
      }
    }
  }, 3000);
}

//
addEventListener($app.E.rsi, Load);

})();

