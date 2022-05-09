// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 3/8/2020, 8:42:28 PM
// ==/UserScript==

const iC = {
  qsa(spec){
    return [...document.querySelectorAll(spec)]
  },

  qsa(spec){
    return document.querySelector(spec)
  }
}

console.log("I am in nyt.user.js")