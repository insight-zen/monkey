// ==UserScript==
// @name        WebCric UTC - webcric.com
// @namespace   Violentmonkey Scripts
// @match       https://*.webcric.com/*
// @grant       none
// @version     1.0
// @author      -
// @require     https://insight-zen.github.io/monkey/base0.js
// @description 7/1/2022, 1:56:14 PM
// ==/UserScript==

var passCounter = 1

// Checks if the current window has a frameElement. True if this is the TOP frame
function topFrame(){
  let fE
  try {
    fE = window.frameElement
  } catch {
  }
  return fE ? false : true
}

// Remove all the frames except the one matching the pattern
function allButThis(sFrames, pattern){
  let rv
  sFrames.forEach(f => {
    if (f.src.match(pattern)){
      console.log(` ** Frame: ${f.src} set as returnValue`)
      rv = f
    } else {
      console.log(` ** Removing frame: ${f.src}`)
      f.remove()
    }
  })
  if (rv === undefined) {
    console.error(` >> Could not locate iframe: ${pattern} from ${sFrames.length} choices <<`)
  }
  return(rv)
}

function cleanupVidFrame(vF){
  console.log(`%c -- Cleanup Video Frame -${vF.src}-`, "color: #fff; background-color: #00f;")
}

// This is bound in the frameWindow context
function subAnnoy(event){
  console.log("In SubAnnoy")
  let html = window.document.getElementsByTagName("html")[0]
  html.replaceWith(html.cloneNode(true))
}

// Run on load and on button click
function unAnnoy(event){
  if (topFrame()) console.clear()
  console.log(`%c -- Starting unAnnoy pass: ${passCounter}, ${window.location}, top: ${topFrame()}--`, "color: #fff; background-color: #f00;")

  let sFrames
  if (topFrame()){
    sFrames = [...window.top.document.getElementsByTagName("iframe")]
    console.log(` * Top level cleanup of ${sFrames.length} frames`)
    const tFrame = allButThis(sFrames, /my\.webcric\.com/)
    if (passCounter > 1) {
      sFrames = [...tFrame.contentDocument.getElementsByTagName("iframe")]
      const vidFrame = allButThis(sFrames, /live\.uctnew\.com/)
      if (vidFrame) {
        cleanupVidFrame(vidFrame)
      }
    }
  } else {
    sFrames = [...window.document.getElementsByTagName("iframe")]
    console.log(` * Second level cleanup of ${sFrames.length} frames`)
    const vidFrame = allButThis(sFrames, /live\.uctnew\.com/)
    console.log(` * Cloning and replacing node on ${vidFrame.src}`)
    vidFrame.replaceWith(vidFrame.cloneNode(true))
  }

  console.log(` * Removing ad div`)
  const logoDiv = D.qs("body div.container div.row div.col-lg-12 div")
  if (logoDiv) logoDiv.remove()
  console.log(` * Removing logo div`)
  D.qsa("div.container div.row div.container div.col-lg-12", {delete: true})

  console.log(`%c -- Exiting unAnnoy pass: ${passCounter}, ${window.location}, top: ${topFrame()}--`, "color: #fff; background-color: #419641")  // console.log("Firing from the button")
  passCounter += 1
}

const styleSpec  = { position: "fixed", "z-index": 10000, top: 0, left: "20px" }
const styleSpec2 = { position: "fixed", "z-index": 10000, top: 0, left: "100px" }

if (topFrame()) {
  D.ce("button", {text: "Annoy", parent: D.b, event: {callback: unAnnoy}, class: "btn btn-primary btn-sm", style: styleSpec} )
} else {
  D.ce("button", {text: "SubAnnoy", parent: window.top.document.body, event: {callback: subAnnoy}, class: "btn btn-success btn-sm", style: styleSpec2} )
}

unAnnoy()





