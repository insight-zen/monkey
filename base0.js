
// ==UserScript==
// @name        Basic Utilities
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 6/2/2022, 9:07:42 AM
// ==/UserScript==

const D = {
  // https://javascript.info/blob
  // makeDownload(fileName: "a.txt", content: "Hello Dude")
  makeDownload(opts={}){
    let a = document.createElement("a")
    let mimeType = "text/plain"
    let fileExt = ".txt"
    let content = opts.content || "Hello, world!"
    if (opts.type == "json") {
      mimeType = "application/json"
      fileExt = ".json"
      content = JSON.stringify(content)
    }
    let blob = new Blob([content], {type: mimeType});

    a.href = URL.createObjectURL(blob)
    a.download = opts.fileName || `#{demo}#{fileExt}`
    a.click();
    URL.revokeObjectURL(a.href);
  },

  qs(pattern, parent=document){
    return parent.querySelector(pattern)
  },

  qsa(pattern, parent=document){
    return [...parent.querySelectorAll(pattern)]
  }
}

window.D = D