// ==UserScript==
// @name         🔍
// @version      1
// @description  Google
// @namespace    🐵
// @run-at       document-start
// @match        https://www.google.com/*
// @grant        GM_addStyle
// ==/UserScript==



// Common
const $app = document.querySelector('html')['🐵'];



// UI
(function() {
  
const logos = 0, logos_id = '#mlogo img, #hplogo';

GM_addStyle(`
#main, #searchform { min-width: 0; }
${logos_id} { ${ logos ? 'visibility: hidden;' : 'display: none;' } }
`);
  
//
!$app.isDesktop && GM_addStyle(`
/* all href=".." video href="&udm=7 images href="&udm=2 web href="&udm=14 shopping href="&url=/search books href="&udm=36--19/11/24:&tbm=bks shorts href="&udm=39 flights href="&url=/travel/flights maps href="&url=https://maps.google.com finance href="/finance? feedback href="#" */
#appbar div[role="navigation"] div[role="list"] a:is([aria-disabled="true"], [href*="&udm=14"], [href*="&udm=36"], [href*="&udm=39"], [href^="/travel"], [href^="/finance"], [href="#"]),
div:has(> div[role="button"][tabindex="0"] > span:only-child), div:has(> div > a[href*="https://support.google.com/websearch?p"][href*="featured_snippets"][aria-hidden="true"]) { 
  display: none; 
}
div[aria-label^="A span of a video titled"] > div > div[style*="padding-top"] {
    padding-top: 20vh !important;
}
form#tsf div:has(button[aria-label="Back"]) { padding-left: 10px; }
form#tsf :is(button[aria-label="Back"], button[aria-label="Google Search"], button:has( > span[aria-label="Clear Search"]) + span, button:has( > svg[alt="Search by voice"]), a[aria-label="Search using your camera or photos"]) {
  display: none;
}
div:has(>a.${$app.I.oi}) { margin: 0 !important; }
`)

//
$app.isDesktop && GM_addStyle(`
block-component > div:first-child > div:last-of-type { display: none; } /* snippet feedback */
a.${$app.I.oi} { display: inline-grid; }
`)

//
if (!logos) {
  const c_srp = 'html[itemtype="http://schema.org/SearchResultsPage"]';
  $app.isDesktop && GM_addStyle(`
form#tsf >div>div { margin-left: 0; }
${c_srp} header > div:has(form#tsf) { position: absolute; top: .5em; width: 90vw; }
  `);
  !$app.isDesktop && GM_addStyle(`
${c_srp} form#tsf { top: -4em; left: -2em; width: calc(100vw - 50px); position: absolute; }
  `);
}


function Load() {
  $app.isDroid && Menu ();

  FullScreen ();
  
  logos && Doodle ();
}

function Menu () {
  GM_addStyle(`
.hdtb-mitem a { 
  display: -webkit-inline-box !important;
  padding: 8px 12px 8px 0px !important;
}
  `);
}

function FullScreen () {
  let o = 0, e = document.querySelector('input[name="q"]');
  if (!e) return;
  for (let i = 0; i < 100; i++) { 
    if (!e.offsetParent) break;
    o += e.offsetTop;
    e = e.offsetParent; 
  }
  e = document.querySelector('#tsf > div > div');
  e?.style?.setProperty('top', `${o}px`);
}

// 🗒: Alternative to uBO: ||google.com/logos/doodles$image,domain=google.com
function Doodle() {
  document.querySelectorAll('img[src*="/logos/doodles"]')
    .forEach((img)=>{
      img.removeAttribute('alt');
      img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Google_2015_logo_colorless_mourning_period.svg/440px-Google_2015_logo_colorless_mourning_period.svg.png'; // 'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_64dp.png';
      const a = img.parentElement;
      if (a.tagName == 'A' && a.href.includes('/search?')) {
        a.href = '/';
        a.removeAttribute('style');
      }
    });
  document.querySelectorAll(logos_id).forEach( (e) => { 
    e.onload = () => { event.target.style.setProperty('visibility','visible') } 
  });
}

//
addEventListener($app.E.rsi, Load);


// 26.02.24 images search scrolling: 
//// fix some weird escaping to the left.
//addEventListener("scroll", ()=> document.body.scrollIntoViewIfNeeded())

})();





// Don't track me Google
// @version 4.28

document.addEventListener('mousedown', handlePointerPress, true);
document.addEventListener('touchstart', handlePointerPress, true);
document.addEventListener('click', handleClick, true);
var scriptCspNonce;
var needsCspNonce = typeof browser !== 'undefined'; // Firefox.
var preferenceObservers = [];
setupAggresiveUglyLinkPreventer();

var forceNoReferrer = true;
var noping = true;
if (typeof chrome == 'object' && chrome.storage) {
    (chrome.storage.sync || chrome.storage.local).get({
        forceNoReferrer: true,
        // From version 4.7 until 4.11, the preference was the literal value of
        // the referrer policy.
        referrerPolicy: 'no-referrer',
        noping: true,
    }, function(items) {
        if (items) {
            // Migration code (to be removed in the future).
            if (items.referrerPolicy === '') {
                // User explicitly allowed referrers to be sent, respect that.
                items.forceNoReferrer = false;
            }
            forceNoReferrer = items.forceNoReferrer;
            noping = items.noping;
            callPreferenceObservers();
        }
    });
    chrome.storage.onChanged.addListener(function(changes) {
        if (changes.forceNoReferrer) {
            forceNoReferrer = changes.forceNoReferrer.newValue;
        }
        if (changes.noping) {
            noping = changes.noping.newValue;
        }
        callPreferenceObservers();
    });
}

function callImmediatelyAndOnPreferenceUpdate(callback) {
    callback();
    preferenceObservers.push(callback);
}
function callPreferenceObservers() {
    // This method is usually once, and occasionally more than once if the user
    // changes a preference. For simplicity we don't check whether a pref was
    // changed before calling a callback - these are cheap anyway.
    preferenceObservers.forEach(function(callback) {
        callback();
    });
}

function getReferrerPolicy() {
    return forceNoReferrer ? 'origin' : '';
}

function updateReferrerPolicy(a) {
    if (a.referrerPolicy === 'no-referrer') {
        // "no-referrer" is more privacy-friendly than "origin".
        return;
    }
    var referrerPolicy = getReferrerPolicy();
    if (referrerPolicy) {
        a.referrerPolicy = referrerPolicy;
    }
}

function handlePointerPress(e) {
    var a = e.target;
    while (a && !a.href) {
        a = a.parentElement;
    }
    if (!a) {
        return;
    }
    var inlineMousedown = a.getAttribute('onmousedown');
    // return rwt(....); // E.g Google search results.
    // return google.rwt(...); // E.g. sponsored search results
    // return google.arwt(this); // E.g. sponsored search results (dec 2016).
    if (inlineMousedown && /\ba?rwt\(/.test(inlineMousedown)) {
        a.removeAttribute('onmousedown');
        // Just in case:
        a.removeAttribute('ping');
        // In Chrome, removing onmousedown during event dispatch does not
        // prevent the inline listener from running... So we have to cancel
        // event propagation just in case.
        e.stopImmediatePropagation();
    }
    if (noping) {
        a.removeAttribute('ping');
    }
    var realLink = getRealLinkFromGoogleUrl(a);
    if (realLink) {
        a.href = realLink;
        // Sometimes, two fixups are needed, on old mobile user agents:
        // /url?q=https://googleweblight.com/fp?u=... -> ...
        realLink = getRealLinkFromGoogleUrl(a);
        if (realLink) {
            a.href = realLink;
        }
    }
    updateReferrerPolicy(a);

    if (e.eventPhase === Event.CAPTURING_PHASE) {
        // Our event listener runs first, to sanitize the link.
        // But the page may have an event handler that modifies the link again.
        // We can append a listener to the bubbling phase of the (current)
        // event dispatch to fix the link up again, provided that the page did
        // not call stopPropagation() or stopImmediatePropagation().
        var eventOptions = { capture: false, once: true };
        a.addEventListener(e.type, handlePointerPress, eventOptions);
        document.addEventListener(e.type, handlePointerPress, eventOptions);
    }
}

// This is specifically designed for catching clicks in Gmail.
// Gmail binds a click handler to a <div> and cancels the event after opening
// a window with an ugly URL. It uses a blank window + meta refresh in Firefox,
// which is too crazy to patch. So we just make sure that the browser's default
// click handler is activated (=open link in new tab).
// The entry point for this crazy stuff is shown in my comment at
// https://github.com/Rob--W/dont-track-me-google/issues/2
function handleClick(e) {
    if (e.button !== 0) {
        return;
    }
    var a = e.target;
    while (a && !a.href) {
        a = a.parentElement;
    }
    if (!a) {
        return;
    }
    if (a.dataset && a.dataset.url) {
        var realLink = getSanitizedIntentUrl(a.dataset.url);
        if (realLink) {
            a.dataset.url = realLink;
        }
    }
    if (!location.hostname.startsWith('mail.')) {
        // This hack was designed for Gmail, but broke other Google sites:
        // - https://github.com/Rob--W/dont-track-me-google/issues/6
        // - https://github.com/Rob--W/dont-track-me-google/issues/19
        // So let's disable it for every domain except Gmail.
        return;
    }
    // TODO: Consider using a.baseURI instead of location in case Gmail ever
    // starts using <base href>?
    if (a.origin === location.origin) {
        // Same-origin link.
        // E.g. an in-page navigation at Google Docs (#...)
        // or an attachment at Gmail (https://mail.google.com/mail/u/0?ui=2&...)
        return;
    }
    if (a.protocol !== 'http:' &&
        a.protocol !== 'https:' &&
        a.protocol !== 'ftp:') {
        // Be conservative and don't block too much. E.g. Gmail has special
        // handling for mailto:-URLs, and using stopPropagation now would
        // cause mailto:-links to be opened by the platform's default mailto
        // handler instead of Gmail's handler (=open in new window).
        return;
    }
    if (a.target === '_blank') {
        e.stopPropagation();
        updateReferrerPolicy(a);
    }
}

/**
 * @param {URL|HTMLHyperlinkElementUtils} a
 * @returns {String} the real URL if the given link is a Google redirect URL.
 */
function getRealLinkFromGoogleUrl(a) {
    if (a.protocol !== 'https:' && a.protocol !== 'http:') {
        return;
    }
    var url;
    if ((a.hostname === location.hostname || a.hostname === 'www.google.com') &&
        (a.pathname === '/url' || a.pathname === '/local_url' ||
         a.pathname === '/searchurl/rr.html' ||
         a.pathname === '/linkredirect')) {
        // Google Maps / Dito (/local_url?q=<url>)
        // Mobile (/url?q=<url>)
        // Google Meet's chat (/linkredirect?authuser=0&dest=<url>)
        url = /[?&](?:q|url|dest)=((?:https?|ftp)[%:][^&]+)/.exec(a.search);
        if (url) {
            return decodeURIComponent(url[1]);
        }
        // Help pages, e.g. safe browsing (/url?...&q=%2Fsupport%2Fanswer...)
        url = /[?&](?:q|url)=((?:%2[Ff]|\/)[^&]+)/.exec(a.search);
        if (url) {
            return a.origin + decodeURIComponent(url[1]);
        }
        // Redirect pages for Android intents (/searchurl/rr.html#...&url=...)
        // rr.html only supports http(s). So restrict to http(s) only.
        url = /[#&]url=(https?[:%][^&]+)/.exec(a.hash);
        if (url) {
            return decodeURIComponent(url[1]);
        }
    }
    // Google Search with old mobile UA (e.g. Firefox 41).
    if (a.hostname === 'googleweblight.com' && a.pathname === '/fp') {
        url = /[?&]u=((?:https?|ftp)[%:][^&]+)/.exec(a.search);
        if (url) {
            return decodeURIComponent(url[1]);
        }
    }
}

/**
 * @param {string} intentUrl
 * @returns {string|undefined} The sanitized intent:-URL if it was an intent URL
 *   with embedded tracking link.
 */
function getSanitizedIntentUrl(intentUrl) {
    if (!intentUrl.startsWith('intent:')) {
        return;
    }
    // https://developer.chrome.com/multidevice/android/intents#syntax
    var BROWSER_FALLBACK_URL = ';S.browser_fallback_url=';
    var indexStart = intentUrl.indexOf(BROWSER_FALLBACK_URL);
    if (indexStart === -1) {
        return;
    }
    indexStart += BROWSER_FALLBACK_URL.length;
    var indexEnd = intentUrl.indexOf(';', indexStart);
    indexEnd = indexEnd === -1 ? intentUrl.length : indexEnd;

    var url = decodeURIComponent(intentUrl.substring(indexStart, indexEnd));
    var realUrl = getRealLinkFromGoogleUrl(newURL(url));
    if (!realUrl) {
        return;
    }
    return intentUrl.substring(0, indexStart) +
        encodeURIComponent(realUrl) +
        intentUrl.substring(indexEnd);
}

/**
 * Intercept the .href setter in the page so that the page can never change the
 * URL to a tracking URL. Just intercepting mousedown/touchstart is not enough
 * because e.g. on Google Maps, the page rewrites the URL in the contextmenu
 * event at the bubbling event stage and then stops the event propagation. So
 * there is no event-driven way to fix the URL. The DOMAttrModified event could
 * be used, but the event is deprecated, so not a viable long-term solution.
 */
function setupAggresiveUglyLinkPreventer() {
    // This content script runs as document_start, so we can have some assurance
    // that the methods in the page are reliable.
    var s = document.createElement('script');
    if (getScriptCspNonce()) {
        s.setAttribute('nonce', scriptCspNonce);
    } else if (document.readyState !== 'complete' && needsCspNonce) {
        // In Firefox, a page's CSP is enforced for content scripts, so we need
        // to wait for the document to be loaded (we may be at document_start)
        // and find a fitting CSP nonce.
        findScriptCspNonce(setupAggresiveUglyLinkPreventer);
        return;
    }
    let tc = '(' + function(getRealLinkFromGoogleUrl) {
        var proto = HTMLAnchorElement.prototype;
        // The link target can be changed in many ways, but let's only consider
        // the .href attribute since it's probably the only used setter.
        var hrefProp = Object.getOwnPropertyDescriptor(proto, 'href');
        var hrefGet = Function.prototype.call.bind(hrefProp.get);
        var hrefSet = Function.prototype.call.bind(hrefProp.set);

        Object.defineProperty(proto, 'href', {
            configurable: true,
            enumerable: true,
            get() {
                return hrefGet(this);
            },
            set(v) {
                hrefSet(this, v);
                try {
                    v = getRealLinkFromGoogleUrl(this);
                    if (v) {
                        hrefSet(this, v);
                    }
                } catch (e) {
                    // Not expected to happen, but don't break the setter if for
                    // some reason the (hostile) page broke the link APIs.
                }
                updateReferrerPolicy(this);
            },
        });
        function replaceAMethod(methodName, methodFunc) {
            // Overwrite the methods without triggering setters, because that
            // may inadvertently overwrite the prototype, as observed in
            // https://github.com/Rob--W/dont-track-me-google/issues/52#issuecomment-1596207655
            Object.defineProperty(proto, methodName, {
                configurable: true,
                // All methods that we are overriding are not part of
                // HTMLAnchorElement.prototype, but inherit.
                enumerable: false,
                writable: true,
                value: methodFunc,
            });
        }

        // proto inherits Element.prototype.setAttribute:
        var setAttribute = Function.prototype.call.bind(proto.setAttribute);
        replaceAMethod('setAttribute', function(name, value) {
            // Attribute names are not case-sensitive, but weird capitalizations
            // are unlikely, so only check all-lowercase and all-uppercase.
            if (name === 'href' || name === 'HREF') {
                this.href = value;
            } else {
                setAttribute(this, name, value);
            }
        });

        // proto inherits EventTarget.prototype.dispatchEvent:
        var aDispatchEvent = Function.prototype.apply.bind(proto.dispatchEvent);
        replaceAMethod('dispatchEvent', function() {
            updateReferrerPolicy(this);
            return aDispatchEvent(this, arguments);
        });

        // proto inherits HTMLElement.prototype.click:
        var aClick = Function.prototype.apply.bind(proto.click);
        replaceAMethod('click', function() {
            updateReferrerPolicy(this);
            return aClick(this, arguments);
        });

        var rpProp = Object.getOwnPropertyDescriptor(proto, 'referrerPolicy');
        var rpGet = Function.prototype.call.bind(rpProp.get);
        var rpSet = Function.prototype.call.bind(rpProp.set);

        var currentScript = document.currentScript;
        var getReferrerPolicy = Object.getOwnPropertyDescriptor(
            HTMLScriptElement.prototype,
            'referrerPolicy'
        ).get.bind(currentScript);

        function updateReferrerPolicy(a) {
            try {
                if (rpGet(a) === 'no-referrer') {
                    // "no-referrer" is more privacy-friendly than "origin".
                    return;
                }
                var referrerPolicy = getReferrerPolicy();
                if (referrerPolicy) {
                    rpSet(a, referrerPolicy);
                }
            } catch (e) {
                // Not expected to happen, but don't break callers if it happens
                // anyway.
            }
        }
        currentScript.dataset.jsEnabled = 1;
    } + ')(' + getRealLinkFromGoogleUrl + ');';

/*

Err: 
  Uncaught (in promise) TypeError: Failed to set the 'textContent' property on 'Node': 
  This document requires 'TrustedScript' assignment. 

if (unsafeWindow.trustedTypes && unsafeWindow.trustedTypes.createPolicy) {
  unsafeWindow.trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => string
  });
}
    s.textContent = trustedTypes.defaultPolicy.createHTML(tc)
*/
    s.appendChild (new Text (tc)); // 25.12.23 rani: 's.textContent = '

    callImmediatelyAndOnPreferenceUpdate(function forceNoReferrerChanged() {
        // Send the desired referrerPolicy value to the injected script.
        s.referrerPolicy = getReferrerPolicy();
    });
    (document.head || document.documentElement).appendChild(s);
    s.remove();
    if (!s.dataset.jsEnabled) {
        cleanLinksWhenJsIsDisabled();
        if (!needsCspNonce) {
            needsCspNonce = true;
            // This is not Firefox, but the script was blocked. Perhaps a CSP
            // nonce is needed anyway.
            findScriptCspNonce(function() {
                if (scriptCspNonce) {
                    setupAggresiveUglyLinkPreventer();
                }
            });
        }
    } else {
        // Scripts enabled (not blocked by CSP), run other inline scripts.
        blockTrackingBeacons();
        overwriteWindowOpen();

        if (location.hostname === 'docs.google.com') {
            // Google Docs have simple non-JS interfaces where the ugly links
            // are hard-coded in the HTML. Remove them (#51).
            // https://docs.google.com/document/d/.../mobilebasic
            // https://docs.google.com/spreadsheets/d/.../htmlview
            cleanLinksWhenJsIsDisabled();
        }
    }
}

// Block sendBeacon requests with destination /gen_204, because Google
// asynchronously sends beacon requests in response to mouse events on links:
// https://github.com/Rob--W/dont-track-me-google/issues/20
//
// This implementation also blocks other forms of tracking via gen_204 as a side
// effect. That is not fully intentional, but given the lack of obvious ways to
// discern such link-tracking events from others, I will block all of them.
function blockTrackingBeacons() {
    var s = document.createElement('script');
    if (getScriptCspNonce()) {
        s.setAttribute('nonce', scriptCspNonce);
    }
    let tc = '(' + function() {
        var navProto = window.Navigator.prototype;
        var navProtoSendBeacon = navProto.sendBeacon;
        if (!navProtoSendBeacon) {
            return;
        }
        var sendBeacon = Function.prototype.apply.bind(navProtoSendBeacon);

        // Blocks the following:
        //   gen_204
        //   /gen_204
        //   https://www.google.com/gen_204
        var isTrackingUrl = RegExp.prototype.test.bind(
            /^(?:(?:https?:\/\/[^\/]+)?\/)?gen_204(?:[?#]|$)/);

        navProto.sendBeacon = function(url, data) {
            if (isTrackingUrl(url) && isNoPingEnabled()) {
                // Lie that the data has been transmitted to avoid fallbacks.
                return true;
            }
            return sendBeacon(this, arguments);
        };

        var currentScript = document.currentScript;
        var getElementId = Object.getOwnPropertyDescriptor(
            Element.prototype,
            'id'
        ).get.bind(currentScript);
        function isNoPingEnabled() {
            try {
                return getElementId() !== '_dtmg_do_not_touch_ping';
            } catch (e) {
                return true;
            }
        }
    } + ')();';

    s.appendChild (new Text (tc)); // 25.12.23 rani: 's.textContent = ' 

    callImmediatelyAndOnPreferenceUpdate(function nopingChanged() {
        // Send the noping value to the injected script. The "id" property is
        // mirrored and can have an arbitrary (string) value, so we use that:
        s.id = noping ? '' : '_dtmg_do_not_touch_ping';
    });
    (document.head || document.documentElement).appendChild(s);
    s.remove();
}

// Google sometimes uses window.open() to open ugly links.
// https://github.com/Rob--W/dont-track-me-google/issues/18
// https://github.com/Rob--W/dont-track-me-google/issues/41
function overwriteWindowOpen() {
    var s = document.createElement('script');
    if (getScriptCspNonce()) {
        s.setAttribute('nonce', scriptCspNonce);
    }
    s.textContent = '(' + function() {
        var open = window.open;
        window.open = function(url, windowName, windowFeatures) {
            var isBlankUrl = !url || url === "about:blank";
            try {
                if (!isBlankUrl) {
                    var a = document.createElement('a');
                    // Triggers getRealLinkFromGoogleUrl via the href setter in
                    // setupAggresiveUglyLinkPreventer.
                    a.href = url;
                    url = a.href;
                    // The origin check exists to avoid adding "noreferrer" to
                    // same-origin popups. That implies noopener and causes
                    // https://github.com/Rob--W/dont-track-me-google/issues/43
                    // And allow any Google domain to support auth popups:
                    // https://github.com/Rob--W/dont-track-me-google/issues/45
                    // And don't bother editing the list if it already contains
                    // "opener" (it would be disabled by "noreferrer").
                    if (a.referrerPolicy && a.origin !== location.origin &&
                        !/\.google\.([a-z]+)$/.test(a.hostname) &&
                        !/\bopener|noreferrer/.test(windowFeatures)) {
                        if (windowFeatures) {
                            windowFeatures += ',';
                        } else {
                            windowFeatures = '';
                        }
                        windowFeatures += 'noreferrer';
                    }
                }
            } catch (e) {
                // Not expected to happen, but don't break callers if it does.
            }
            var win = open(url, windowName, windowFeatures);
            try {
                if (isBlankUrl && win) {
                    // In Google Docs, sometimes a blank document is opened,
                    // and document.write is used to insert a redirector.
                    // https://github.com/Rob--W/dont-track-me-google/issues/41
                    var doc = win.document;
                    var docWrite = win.Function.prototype.call.bind(doc.write);
                    doc.write = function(markup) {
                        try {
                            markup = fixupDocMarkup(markup);
                        } catch (e) {
                            // Not expected, but don't break callers otherwise.
                        }
                        return docWrite(this, markup);
                    };
                }
            } catch (e) {
                // Not expected to happen, but don't break callers if it does.
            }
            return win;
        };
        function fixupDocMarkup(html) {
            html = html || '';
            html += '';
            return html.replace(
                /<meta [^>]*http-equiv=(["']?)refresh\1[^>]*>/i,
                function(m) {
                    var doc = new DOMParser().parseFromString(m, 'text/html');
                    var meta = doc.querySelector('meta[http-equiv=refresh]');
                    return meta && fixupMetaUrl(meta) || m;
                });
        }
        function fixupMetaUrl(meta) {
            var parts = /^(\d*;\s*url=)(.+)$/i.exec(meta.content);
            if (!parts) {
                return;
            }
            var metaPrefix = parts[1];
            var url = parts[2];
            var a = document.createElement('a');
            // Triggers getRealLinkFromGoogleUrl via the href setter in
            // setupAggresiveUglyLinkPreventer.
            a.href = url;
            url = a.href;
            meta.content = metaPrefix + url;

            var html = meta.outerHTML;
            if (a.referrerPolicy) {
                // Google appears to already append the no-referrer
                // meta tag, but add one just in case it doesn't.
                html = '<meta name="referrer" content="no-referrer">' + html;
            }
            return html;
        }
    } + ')();';
    (document.head || document.documentElement).appendChild(s);
    s.remove();
}

function cleanLinksWhenJsIsDisabled() {
    // When JavaScript is disabled, Google sets the "href" attribute's value to
    // an ugly URL. Although the link is rewritten on click, we still need to
    // rewrite the link even earlier because otherwise the ugly URL is shown in
    // the tooltip upon hover.

    if (document.readyState == 'complete') {
        cleanAllLinks();
        return;
    }

    // When JS is disabled, the links won't change after the document finishes
    // loading. Until the DOM has finished loading, use the mouseover event to
    // beautify links (the DOMContentLoaded may be delayed on slow networks).
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('DOMContentLoaded', function() {
        document.removeEventListener('mouseover', handleMouseOver);
        cleanAllLinks();
    }, {once: true});

    function cleanAllLinks() {
        var as = document.querySelectorAll('a[href]');
        for (var i = 0; i < as.length; ++i) {
            var href = getRealLinkFromGoogleUrl(as[i]);
            if (href) {
                as[i].href = href;
            }
        }
    }

    function handleMouseOver(e) {
        var a = e.target;
        var href = a.href && getRealLinkFromGoogleUrl(a);
        if (href) {
            a.href = href;
        }
    }
}

function getScriptCspNonce() {
    var scripts = document.querySelectorAll('script[nonce]');
    for (var i = 0; i < scripts.length && !scriptCspNonce; ++i) {
        scriptCspNonce = scripts[i].nonce;
    }
    return scriptCspNonce;
}

function findScriptCspNonce(callback) {
    var timer;
    function checkDOM() {
        if (getScriptCspNonce() || document.readyState === 'complete') {
            document.removeEventListener('DOMContentLoaded', checkDOM, true);
            if (timer) {
                clearTimeout(timer);
            }
            callback();
            return;
        }
        timer = setTimeout(checkDOM, 50);
    }
    document.addEventListener('DOMContentLoaded', checkDOM, true);
    checkDOM();
}

function newURL(href) {
    try {
        return new URL(href);
    } catch (e) {
        var a = document.createElement('a');
        a.href = href;
        return a;
    }
}
