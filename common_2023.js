// ==UserScript==
// @name        Common script that matches all sites
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       GM_addStyle
// @version     1.0
// @author      -
// @description Use with PayWall, uBO only. No Matrix
// ==/UserScript==

const C = {
  putRefMeta(){
    if (document.querySelectorAll("meta[name='referrer']").length > 0) return;
    const s = `<meta name="referrer" content="none">`;
    const b = document.querySelector("head");
    b.insertAdjacentHTML("beforeend", s);
  },

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
  },

  purge(){
    localStorage.clear();
    sessionStorage.clear();
    C.clear();
    C.clear2();
    C.putRefMeta();
  },

  clickPurge(){
    C.purge();
    console.log("%cMonkey Purge%c Completed", 'background-color: #ff3456; color: #fff; padding: 1px; border-radius: 2px;', '')
  },

  unAnnoyBtn(cb, opts={}){
    const css = ".ua { position: fixed; padding: 0.5em; font-size: 0.8em; background-color: #667df0; color: #dedede; top: 5px; left: 5px; border: none; border-radius: 4px; z-index: 1000000; cursor: pointer; }"
    let styleElement = GM_addStyle(css);
    styleElement = GM_addStyle(`.ua:hover{background-color: #c13838;}`)
    const sBtn = "<button id='b101' class='ua'>UnAnnoy</button>"
    const body = document.querySelector("body")
    body.insertAdjacentHTML("afterbegin", sBtn)
    body.querySelector("#b101").addEventListener("click", C.clickPurge)
    C.purge()
  }
}

console.log("%c--------- %cMonkey for all%c -----------", '', 'background-color: #3456ff; color: #fff; padding: 1px; border-radius: 2px;', '')
console.log({href: window.location.href, hostname: window.location.hostname})
// C.unAnnoyBtn()
const purgeSites = ["hbr.org", "www.nytimes.com"]


setTimeout(() => {
  if (purgeSites.includes(window.location.hostname)) C.clickPurge();
}, 1200);

