// ==UserScript==
// @name        Test for NYT
// @namespace   Violentmonkey Scripts
// @match       *://*.nytimes.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 5/9/2022, 9:21:06 AM
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// ==/UserScript==

const iC = {
  qsa(spec){
    return [...document.querySelectorAll(spec)]
  },

  qs(spec){
    return document.querySelector(spec)
  }
}

iC.qsa("div[aria-label='A message from The Times']").forEach( e => e.remove() )

window.iC = iC

console.log(`Hello from new NYT script: v01`)


VM.observe(document.body, () => {
  const footDivs = iC.qsa("div[aria-label='A message from The Times']")

  if (footDivs.length > 0 ) {
    console.log(`Found ${footDivs.length} divs and removing them now.`)
    footDivs.forEach( e => e.remove() )
    return true
  }
});