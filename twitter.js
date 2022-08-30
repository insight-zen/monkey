// ==UserScript==
// @name        Twitter
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @grant       none
// @version     0.1
// @require     https://insight-zen.github.io/monkey/base0.js
// @author      -
// @description 8/29/22
// @run-at document-idle
// ==/UserScript==


//TODO: window.D is not available in the document

const tw = {
  unAnnoy(){

    // if (window){
    //   window.ga = 456
    //   Object.defineProperty(window, "ga", {writable: false})
    // // window.D = D
    // // Object.defineProperty(window, "D", {writable: false})
    // }


    // Remove bottom login bar at the bottom
    [...document.querySelectorAll("[data-testid='BottomBar']")].forEach(n => n.remove() )

    // Remove modal that shows up after scrolling
    const ml = document.querySelectorAll("[data-testid='sheetDialog']")
    if (ml.length > 0){
      const sd = ml[0]
      const dl = sd.closest("div#layers")
      if (dl){
        dl.children[1].remove()
      }
    }
    const h = document.getElementsByTagName("html")[0]
    h.style["overflow"] = "auto"
  },
}

tw.unAnnoy()

console.log("--------- Twitter Monkey -----------")
const sBtn = "<button id='b101' style='position: fixed; padding: 0.5em; background-color: #c13838; color: #dedede; top: 5px; left: 5px; border: none; border-radius: 4px; z-index: 10;'>UnAnnoy</button>"
D.b.insertAdjacentHTML("afterbegin", sBtn)
D.b.querySelector("#b101").addEventListener("click", tw.unAnnoy)

// window.GoogleAnalyticsObject = 123
// window.ga = 456
// Object.defineProperty(window, "ga", {writable: false})
// window.D = D
// Object.defineProperty(window, "D", {writable: false})
