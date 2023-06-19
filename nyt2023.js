// ==UserScript==
// @name        NYT 2023
// @namespace   Violentmonkey Scripts
// @match       *://*.nytimes.com/*
// @grant       none
// @version     1.2
// @author      -
// @description 2023 version of NYT
// ==/UserScript==

function unAnnoyBtn(cb, opts = {}) {
  const sBtn =
    "<button id='b101' style='font-size: 11px; cursor: pointer; position: fixed; padding: 0.5em; background-color: #c13838; color: #dedede; top: 14px; left: 50px; border: none; border-radius: 4px; z-index: 1000;'>UnAnnoy</button>";
  document.querySelector("body").insertAdjacentHTML("afterbegin", sBtn);
  document
    .querySelector("body")
    .querySelector("#b101")
    .addEventListener("click", cb);
}

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

  // overflow blocking elements
  clearFirstOverflow() {
    const firstOf = uA.overflowHidden()[0];
    if (!firstOf) return;
    uA.removeAllCssClasses(firstOf);
  },
};

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
