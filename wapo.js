// ==UserScript==
// @name        WPost Test
// @namespace   Violentmonkey Scripts
// @match       https://www.washingtonpost.com/*
// @grant       none
// @version     1.1
// @require     https://insight-zen.github.io/monkey/base0.js
// @author      -
// @description 6/8/2022, 2:17:16 PM
// ==/UserScript==

const wp = {
  unAnnoy(){
    // D.qsa("div").filter(e => e.id.match(/^(pay|soft)wall/) ).forEach(e => e.remove() )
    D.qsa("div", {filter: (e) => e.id.match(/^(pay|soft)wall/), delete: true})
    D.h.style = ""
    D.b.style = ""
  }
}

const sBtn = "<button id='b101' style='cursor: crosshair; position: fixed; padding: 0.5em; background-color: #fbbfbf; color: #232323; z-index: 10;'>UnAnnoy</button>"
D.b.insertAdjacentHTML("afterbegin", sBtn)
D.b.querySelector("#b101").addEventListener("click", wp.unAnnoy)

D.purge()
window.wp = wp