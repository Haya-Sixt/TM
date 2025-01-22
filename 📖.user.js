// ==UserScript==
// @name         📖
// @namespace    🐵
// @version      1
// @description  pash.co.il
// @run-at       document-start
// @match        https://www.pash.co.il/*
// @grant        GM_addStyle
// ==/UserScript==

// Common
const $app = document.querySelector('html')['🐵'];

// UI
(function() {

const maxlines = $app.isDroid ? 4 : 3;

function Style () {
  GM_addStyle(`

body {
  ${ $app.isDroid && 'font-size: xx-large' };
  overflow-x: hidden;
  font-family: Arial;
}
body > center:nth-child(2) > img, #searchForm br, #lbPasukTitle, #TreeView1 > table, #TreeView1 img {
  display: none;
}
table, div, a, span {
  display: block;
}
#tblpsukim a:first-of-type {
  display: none;
}
#tblpsukim a {
  font-size: ${ $app.isDroid ? 'small' : 'smaller' };
  text-decoration: none;
}
#tblpsukim a:first-letter { /* display:block needed for first-letter*/
  color: #2b488b;
  font-weight: 900;
  font-style: oblique;
}
#TreeView1 > div > table span { /* Q  */
  ${ $app.isDroid && 'font-size: 1.1em' };
  cursor: pointer;
}
#TreeView1 > div > table td { /* Q  */
  padding: 0.5em 0 0.5em 0;
} 
#TreeView1 > div > table span:first-letter { /* display:block needed for first-letter*/
  color: Azure;
  font-weight: 900;
  font-style: oblique;
}
#TreeView1 > div > div { /* Name + A */
  display: none;
  background-color: rgb(37,38,35);
  margin-bottom: 2em;
}
#TreeView1 > div > div > table { /* Name  */
  color: AntiqueWhite;
  cursor: pointer;
  font-size: smaller;
}
#TreeView1 > div > div > div { /* A */
  max-height: ${maxlines}em;
  overflow-y: hidden;
  cursor: pointer;
  background-image: repeating-linear-gradient(transparent 0 2.98lh, #736b5e 3.02lh);
}
#TreeView1 > div > div > div span:first-letter { /* A */ 
  letter-spacing: 1em;
}
#searchForm > center:last-of-type input { /* Next + Before */
  font-size: large;
}
#searchForm > center:last-of-type:before { /* Next + Before */
  content: ".";
  opacity: 0;
}
  `);
}


function Load() {
  Move ();

  Clear ();

  Style ();

  Click ();
}

// Next + Before
function Move () {
  const s = document.querySelector('#searchForm > table:first-of-type tr:nth-child(2)'),
        t = document.querySelector('#searchForm > center:last-of-type tbody'),
        b = document.querySelector('body');
  t.firstChild.remove();
  t.appendChild(s);
  for(let i =0; i < 2; i++) b.appendChild(document.createElement('br'));
}

// Remove all styling
function Clear () {
  document.querySelectorAll('link, style:not([id])').forEach((e) => {
    e.remove();
  });
  document.querySelectorAll('*:not([class*="mcs_"])').forEach((e) => {
    e.removeAttribute('class');
    e.removeAttribute('style');
  });
}

function Click () {
  const C = (s, p, v1, v2 = 'unset', b = false)=> {
    document.querySelectorAll (s).forEach (e=> {
      e.addEventListener ('click', ()=> {
        const d = b ? e.nextSibling : e, x = p.indexOf ("-");
        if (d.style [x < 0 ? p : p.replace(p.slice(x, x+2), String.fromCharCode (p.charCodeAt (x+1) - 32))] !== v1) d.style.setProperty(p, v1, '')
        else d.style.setProperty(p, v2, '');
      });
    });
  };
  
  C ('#TreeView1 > div > table, #TreeView1 > div > div > table', 'display', 'block', 'none', true);
  
  C ('#TreeView1 > div > div > div', 'max-height', 'unset', `${maxlines}em`);
  
  C ('#TreeView1 > div > div > div', 'column-width', '27.2em');
}

//
addEventListener($app.E.rsi, Load);

})();
