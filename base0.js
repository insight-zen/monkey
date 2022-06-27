
// ==UserScript==
// @name        Basic Utilities
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      -
// @description Jun 10 2022, 9:07:42 AM Added C, qsa extended
// ==/UserScript==

const C = {
  list(){
    const rv = document.cookie.split(";").map(e => e.split("=")).map(e => e[0] ).sort()
    return rv
  },

  // returns the cookie with the given name,
  // or undefined if not found
  get(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  },

  set(name, value, options = {}) {
    options = {
      path: '/',
      // add other defaults here if necessary
      ...options
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    document.cookie = updatedCookie;
  },

  delete(name) {
    this.set(name, "", {
      'max-age': -1
    })
  },

  // https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript#
  clear(){
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
  },

  clear2(){
    document.cookie.replace(/(?<=^|;).+?(?=\=|;|$)/g, name => location.hostname.split('.').reverse().reduce(domain => (domain=domain.replace(/^\.?[^.]+/, ''),document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`,domain), location.hostname));
  }
}

const D = {
  c: C,
  h: document.querySelector("html"),
  b: document.querySelector("body"),

  purge(){
    localStorage.clear()
    sessionStorage.clear()
    this.c.clear2()
    this.c.clear()
  },

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
    URL.revokeObjectURL(a.href)
  },

  // https://github.com/WebDevSimplified/js-util-functions/blob/main/domUtils/domUtils.js
  // When text: "foo" or text: /foo/ is used, searches textConten
  //  - returns first element matching that pattern based on textContent
  qs(pattern, {parent = document, ...opts} = {}){
    if (opts.text){
      const elements = D.qsa(pattern, {parent: parent})
      return elements.find(e => e.textContent.match(opts.text))
    } else {
      return parent.querySelector(pattern)
    }
  },

  // filter: provide a function that takes in the node element and return true/false
  //   f = (e) => e.id.match(/^(pay|soft)wall/)
  //   qsa("div", {filter: f }) => qsa("div").filter(e => e.id.match(/^(pay|soft)wall/) )
  // delete: boolean argument. If provided, will delete all matching elements
  //   qsa("div", {delete: true})  => qsa("div").forEach(e => e.remove() )
  qsa(pattern, {parent = document, ...opts} = {}) {
    let rv = [...parent.querySelectorAll(pattern)]
    if (Object.keys(opts).length == 0) return rv
    if (opts.filter) rv = rv.filter(opts.filter)
    if (opts.delete) rv = rv.forEach(e => e.remove())
    return rv
  },


  // create Element
  ce(type, options = {}) {
    const element = document.createElement(type)
    Object.entries(options).forEach(([key, value]) => {
      if (key === "class") {
        element.classList.add(value)
        return
      }

      if (key === "data") {
        Object.entries(value).forEach(([dKey, dValue]) => {
          element.dataset[`data-${dKey}`] = dValue
        })
        return
      }

      if (key === "text") {
        element.textContent = value
        return
      }

      if (key == "html") {
        element.innerHTML = value
        return
      }

      if (key == "children") {
        value.forEach(ce => element.appendChild(ce))
      }

      if (key == "event") {
        element.addEventListener(value.type || "click", value.callback || value)
        return
      }

      if (key == "parent") {
        return
      }
      element.setAttribute(key, value)
    })

    if (options.parent) options.parent.appendChild(element)
    return element
  },


  // Add Global Event Listener that executes only on matching elements
  agel(type, selector, callback, options, parent = document) {
    parent.addEventListener(
      type,
      e => {
        if (e.target.matches(selector)) callback(e)
      },
      options
    )
  }
}

window.D = D