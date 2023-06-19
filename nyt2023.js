// ==UserScript==
// @name        NYT 2023
// @namespace   Violentmonkey Scripts
// @match       *://*.nytimes.com/*
// @grant       none
// @version     1.3
// @author      -
// @description 2023 version of NYT with iCss added
// ==/UserScript==

function unAnnoyBtn(cb, opts = {}) {
  const sBtn =
    "<button id='b101' style='font-size: 11px; cursor: pointer; position: fixed; padding: 0.5em; background-color: #c13838; color: #dedede; top: 32px; left: 14px; border: none; border-radius: 4px; z-index: 1000;'>UnAnnoy</button>";
  document.querySelector("body").insertAdjacentHTML("afterbegin", sBtn);
  document
    .querySelector("body")
    .querySelector("#b101")
    .addEventListener("click", cb);
}

const iCss = {
  // Extract all rules from all stylesheets.
  // filtSpec if specified is used to filter returned cssStyleRule
  // return when width is specified as 100% => (r) => r.style.width === "100%"
  // With filter specified, will return selectorText (css Class or ID)
  allRules(filtSpec) {
    const rv = [...document.styleSheets].reduce((acc, s) => {
      let tmp = [];
      // This guards against error for font-only stylesheets that do not have cssRules
      try {
        tmp = s.cssRules;
      } catch {}
      acc = [...acc, ...tmp];
      return acc;
    }, []);
    if (!filtSpec) return rv;
    return rv.filter(filtSpec).map((c) => c.selectorText);
  },

  // Can be passed to allRules to filter height: 100%, width: 100%, position: absolute
  abs100: (r) =>
    r.style?.width === "100%" &&
    r.style?.height === "100%" &&
    r.style?.position === "absolute"
      ? true
      : false,

  // abs100 + background
  abs100backgr: (r) =>
    r.style?.width === "100%" &&
    r.style?.height === "100%" &&
    r.style?.position === "absolute" &&
    r.style?.background.match(/linear\-gradient/)
      ? true
      : false,
};

const uA = {
  clearLocalStorage() {
    localStorage.clear();
  },

  clearCookies() {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
      var d = window.location.hostname.split(".");
      while (d.length > 0) {
        var cookieBase =
          encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
          "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
          d.join(".") +
          " ;path=";
        var p = location.pathname.split("/");
        document.cookie = cookieBase + "/";
        while (p.length > 0) {
          document.cookie = cookieBase + p.join("/");
          p.pop();
        }
        d.shift();
      }
    }
  },

  // All elements in the document
  all() {
    return [...document.getElementsByTagName("*")];
  },

  withStyle(spec) {
    return uA.all().filter((e) => (spec ? e?.style : e?.style));
  },

  overflowHidden() {
    return uA
      .all()
      .filter((e) => window.getComputedStyle(e)?.overflow === "hidden");
  },

  removeAllCssClasses(e) {
    [...e.classList].forEach((cssClass) => e.classList.remove(cssClass));
  },

  // window.getComputedStyle($0).position === "absolute"
  //

  // overflow blocking elements
  clearFirstOverflow() {
    const firstOf = uA.overflowHidden()[0];
    if (!firstOf) return;
    uA.removeAllCssClasses(firstOf);
  },
};

window.iCss = iCss;
window.uA = uA;

const tw = {
  removeBlock() {
    const elements = ["expanded-dock", "dock-gateway"].reduce(
      (acc, e) => [
        ...acc,
        ...document.querySelectorAll(`[data-testid="${e}"]`),
      ],
      []
    );
    elements.forEach((n) => n.remove());
    document.getElementById("standalone-footer")?.remove();
    [...document.querySelectorAll("a[href='#site-content']")].forEach((e) =>
      e.remove()
    );
    [...document.querySelectorAll(iCss.allRules(iCss.abs100backgr))].forEach(
      (e) => e.remove()
    );
  },

  removeScrollModal() {
    const ml = document.querySelectorAll("[data-testid='sheetDialog']");
    if (ml.length > 0) {
      const sd = ml[0];
      const dl = sd.closest("div#layers");
      if (dl) {
        dl.children[1].remove();
      }
    }
    const h = document.getElementsByTagName("html")[0];
    if (h) h.style["overflow"] = "auto";
  },

  cleanup() {
    uA.clearCookies();
    uA.clearLocalStorage();
    tw.removeBlock();
    uA.clearFirstOverflow();
    console.log(`  ** Cleanup at ${Date()}`);
  },
};

console.clear();
console.log(" --- NYT ---");

unAnnoyBtn(() => {
  tw.cleanup();
});

setTimeout(() => {
  tw.cleanup();
}, 1200);
