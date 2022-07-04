// ==UserScript==
// @name        UCT Frame
// @namespace   Violentmonkey Scripts
// @match       https://*.uctnew.com/*
// @grant       none
// @version     1.0
// @author      -
// @require     https://insight-zen.github.io/monkey/base0.js
// @description 7/1/2022, 1:56:14 PM
// ==/UserScript==

// Tied to webcric, but separated to run in the iframe from the uct domain.

const UC = {
  ucCleanup(){
    console.log("ucCleanup from UC")
    let html = window.document.getElementsByTagName("html")[0]
    html.replaceWith(html.cloneNode(true))
  }
}

window.UC = UC
console.log(`%c -- UC Load phase. ${window.location} --`, "color: #fff; background-color: #405df9")

let html = window.document.getElementsByTagName("html")[0]
D.qsa("div.video_ads_overdiv", {parent: html, delete: true})
delete html.dataset.fp
html.replaceWith(html.cloneNode(true))