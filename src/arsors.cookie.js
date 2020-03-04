function arsorsCookie(customConfig) {

  // Early access on robot that he can index the complete page
  this.stopIfRobot = function() {
    if (/bot|googlebot|crawler|spider|robot|crawling|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent)) return true;
  };
  if (this.stopIfRobot()) return false;

  var cookieObject = this;

  var dynamicAllowHTML = [],
      dynamicAllowHTMLInt = 0,
      dynamicAllowInteract;

  var cookieConfig = {
    c: {
      type: "opt-in",
      dynamicAllow: true,
      html: '{{floatingHtml}}<div class="arsorsCookie"><div class="arsorsCookie_text">{{htmlText}}</div><div class="arsorsCookie_options">{{createCheckbox}}</div><div class="arsorsCookie_btnWrapper">{{deny}}{{allow}}</div></div>',
      htmlText: 'This website uses cookies. Some of these cookies require your explicit consent. Please agree to the use of cookies in order to use all functions of the website. Detailed information on the use of cookies can be found in our {{learnMore}}. Here you can also revoke your consent to the use of cookies.',
      learnMore: '<a href="{{learnMoreUrl}}" class="arsorsCookie_learnmore">{{learnMoreText}}</a>',
      learnMoreText: 'Privacy Policy',
      learnMoreUrl: 'https://cookie.arsors.de/',
      allow: '<a class="arsorsCookie_btn btn-allowCookie-selected" href="#">{{allowText}}</a>',
      allowText: 'Allow Selected',
      deny: '<a class="arsorsCookie_btn btn-denyCookie-all" href="#">{{denyText}}</a>',
      denyText: 'Deny All',
      floatingHtml: '<a class="btn-toggleCookie arsorsCookie_floatingBtn" href="#">{{floatingHtmlText}}</a>',
      floatingHtmlText: 'Cookie Policy',
      showOptions: true,
      lifetime: 365,
      globalErrorMsg: '<div class="ac_error"><p>You must accept cookies to view this content. <a class="btn-allowCookie-all" href="#">Accept Cookies</a></p></div>',
      optInArray: ['HR', 'IT', 'ES'],
      optOutArray: ['AT','BE','BG','CZ','CY','DE','DK','EE','FI','FR','EL','HU','IE','LV','LT','LU','MT','NL','PL','PT','SK','SE','GB','UK','GR','EU']
    },
    e: {
      '.arsorsCookie_main': {             // .arsorsCookie_main is required
        title: "Required",                // is required
        cookieName: "arsorsCookie_main"   // is required
      }
    }
  };

  /*
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  */

  /*
    ------------------------
    Cookie Handler
    ------------------------
  */

  /*
    Check if a specific cookie is on status allow
  */
  this.isCookieAllowed = function(cname) {
    return (cookieObject.getCookie(cname) === "allow") ? true : false;
  };

  /*
    Set or Remove Cookies
  */
  this.allowOrDenySelectedCookies = function() {
    for (var key in cookieConfig.e) {
      if (cookieConfig.e.hasOwnProperty(key)) {
        if (document.getElementById(cookieConfig.e[key].cookieName).checked) {
          cookieObject.setCookie(cookieConfig.e[key].cookieName, "allow", cookieConfig.c.lifetime);
        } else {
          cookieObject.setCookie(cookieConfig.e[key].cookieName, "deny", cookieConfig.c.lifetime);
        }
      }
    }
    cookieObject.setCookie("arsorsCookie_interact", "true", cookieConfig.c.lifetime);
    cookieObject.reload('all');
  };

  /*
    Add all Cookies on allow
  */
  this.allowAllCookies = function(reload) {
    for (var key in cookieConfig.e) {
      if (cookieConfig.e.hasOwnProperty(key)) {
        cookieObject.setCookie(cookieConfig.e[key].cookieName, "allow", cookieConfig.c.lifetime);
      }
    }
    if (reload !== false) {
      cookieObject.setCookie("arsorsCookie_interact", "true", cookieConfig.c.lifetime);
      cookieObject.reload('all');
    }
  };

  /*
    Remove all Cookies on Deny
  */
  this.denyAllCookies = function() {
    for (var key in cookieConfig.e) {
      if (cookieConfig.e.hasOwnProperty(key)) {
        cookieObject.setCookie(cookieConfig.e[key].cookieName, "deny", cookieConfig.c.lifetime);
      }
    }
    cookieObject.setCookie("arsorsCookie_interact", "true", cookieConfig.c.lifetime);
    cookieObject.reload(false);
  };

  /*
    Init Cookies (depends on cookie type)
  */
  this.initCookies = function() {
    if ((cookieConfig.c.type === "opt-out" && cookieObject.getCookie(cookieConfig.e[".arsorsCookie_main"].cookieName) === "") || cookieConfig.c.type === "info") cookieObject.allowAllCookies(false);
  };

  /*
    Add Cookie manage functions to javascript
  */
  this.getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  this.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  /*
    ------------------------
    Location Service Section
    ------------------------
  */

  this.setCountryCode = function(callback, html, fallback) {
    var countryCode;
    if (countryCode = cookieObject.getCookie('arsorsCookie_countryCode')) {
      if (countryCode == "false") {
        // fallback if can't get countryCode (countryCode-Cookie was set to false)
        return (fallback) ? fallback : 'opt-in';
      } else {
        // Has country code and decide which type should be used
        return cookieObject.getTypeByCountryCode(countryCode);
      }
    } else {
      // Remove the content and show a message that the country get searched...
      document.getElementsByTagName('body')[0].innerHTML = (html) ? html : "Searching for the correct privacy policy...";
      if (callback) callback();
      return false;
    }
  };

  this.getTypeByCountryCode = function(countryCode) {
    var optIn  = cookieConfig.c.optInArray,
        optOut = cookieConfig.c.optOutArray;
    if (optIn.includes(countryCode)) return 'opt-in';
    else if (optOut.includes(countryCode)) return 'opt-out';
    else return 'info';
  };

  /*
    ------------------------
    UI - Section
    ------------------------
  */

  /*
    Init the Cookie Ui
  */
  this.initCookieUi = function() {
    var content = this.replaceTags(cookieConfig.c.html);

    var elem = document.createElement('div');
    elem.innerHTML = content;
    if (cookieObject.getCookie("arsorsCookie_interact") !== "true") elem.className="arsorsCookie_wrapper ac_show"; else elem.className="arsorsCookie_wrapper ac_hide";
    document.body.appendChild(elem);

    this.initCookieEventListener("all");
  };

  this.toggleCookieUi = function() {
    var elements = document.getElementsByClassName('arsorsCookie_wrapper');
    for (var x = 0; x < elements.length; x++) {
      if (elements[x].className.includes('ac_hide')) {
        elements[x].className="arsorsCookie_wrapper ac_show";
      } else {
        elements[x].className="arsorsCookie_wrapper ac_hide";
      }
    }
  };

  /*
    Create options for Cookie Consent Notice
    Usage: include ${this.createCheckbox()} into message or messagelink to create checkboxes
  */
  this.createCheckbox = function(cookieKey) {
    var content = "";
    var includes = [];
    if (cookieConfig.c.type != "info") {
      if (!cookieKey.includes(".") && !cookieKey.includes("#")) {
        // If all checkboxes should be drawn...
        for (var key in cookieConfig.e) {
          var tmpContent = this.createSingleCheckbox(key, includes);
          if (tmpContent!="") {
            content += tmpContent;
            includes.push(cookieConfig.e[key].cookieName);
          }
        }
      } else {
        // If a specific checkbox should be drawn...
        cookieKey = cookieKey.replace("{{createCheckbox","").replace("}}", "");
        var tmpContent = this.createSingleCheckbox(cookieKey, includes);
        if (tmpContent!="") {
          content += tmpContent;
          includes.push(cookieConfig.e[cookieKey].cookieName);
        }
      }
    }
    return content;
  };

  /*
    Create single checkbox
  */
  this.createSingleCheckbox = function(key, includes) {
    if (cookieConfig.e.hasOwnProperty(key) && !includes.includes(cookieConfig.e[key].cookieName)) {
      var disabled = (cookieConfig.e[key].required) ? " disabled checked" : (this.isCookieAllowed(cookieConfig.e[key].cookieName) || (cookieConfig.c.type == "opt-in" && cookieObject.getCookie("arsorsCookie_interact") !== "true")) ? " checked" : "";
      return '<label id="' + cookieConfig.e[key].cookieName + '_wrapper"><input id="' + cookieConfig.e[key].cookieName + '" type="checkbox" name="' + cookieConfig.e[key].cookieName + '"' + disabled + '><span class="arsorsCookie_options_box"></span><span class="arsorsCookie_options_label"> ' + cookieConfig.e[key].title + '</span></label> ';
    }
    return "";
  };

  /*
    Replace {{tags}} by object property
  */
  this.replaceTags = function(content) {
    var regex = /[\{]{2}([a-zA-Z0-1-_\.#]*)[\}]{2}/gm;
    var str = content;
    var html = str;
    var m;
    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      if (!m[0].includes("{{createCheckbox")) html = html.replace(m[0], cookieConfig.c[m[1]]);
      else html = (cookieConfig.c.showOptions) ? html.replace(m[0], this.createCheckbox(m[0])) : html.replace(m[0], "");
    }
    if (html.includes("{{")) return this.replaceTags(html); else return html;
  };

  /*
    Append Error Messages to the specific containers
  */
  cookieObject.setCookieErrorMessages = function(container) {
    if (!this.isCookieAllowed(cookieConfig.e[container].cookieName)) {
      // Get Error Message from cookieConfig.e
      var content = (cookieConfig.e[container].errorMsg) ? cookieConfig.e[container].errorMsg : cookieConfig.c.globalErrorMsg;
      // Check for ID or Class and append Error Message Content
      if (container.startsWith("#")) {
        // For ID
        if (document.getElementById(container.substr(1))) {
          var element = document.getElementById(container.substr(1));
          if (cookieConfig.c.dynamicAllow) {
            element.setAttribute('data-arsors-content', dynamicAllowHTMLInt);
            dynamicAllowHTML[dynamicAllowHTMLInt] = [];
            dynamicAllowHTML[dynamicAllowHTMLInt]['container'] = container;
            dynamicAllowHTML[dynamicAllowHTMLInt]['cookie'] = cookieConfig.e[container].cookieName;
            dynamicAllowHTML[dynamicAllowHTMLInt]['html'] = element.innerHTML;
            dynamicAllowHTMLInt++;
          }
          element.innerHTML = content;
        }
      } else if (container.startsWith(".")) {
        // For Classes
        var elements = document.getElementsByClassName(container.substr(1));
        for (var x = 0; x < elements.length; x++) {
          if (cookieConfig.c.dynamicAllow) {
            elements[x].setAttribute('data-arsors-content', dynamicAllowHTMLInt);
            dynamicAllowHTML[dynamicAllowHTMLInt] = [];
            dynamicAllowHTML[dynamicAllowHTMLInt]['container'] = container;
            dynamicAllowHTML[dynamicAllowHTMLInt]['cookie'] = cookieConfig.e[container].cookieName;
            dynamicAllowHTML[dynamicAllowHTMLInt]['html'] = elements[x].innerHTML;
            dynamicAllowHTMLInt++;
          }
          elements[x].innerHTML = content;
        }
      } else alert("Can't decide if container-Parameter in cookieObject.setCookieErrorMessages() is a ID (#) or a class (.) Check cookieConfig.e");
    }
  };

  /*
    ------------------------
    JavaScript Loading Handler
    ------------------------
  */

  /*
    Create scripts-Array. Depending on which cookies were set
  */
  var initScriptsFromCookieMemory = [];

  this.initScriptsFromCookies = function() {
    for (var key in cookieConfig.e) {
      if (this.isCookieAllowed(cookieConfig.e[key].cookieName)) {
        // add scripts property
        if (cookieConfig.e[key].scripts) {
          for (var s = 0; s < cookieConfig.e[key].scripts.length; s++) {
            if (!initScriptsFromCookieMemory.includes(cookieConfig.e[key].scripts[s])) {
              initScriptsFromCookieMemory.push(cookieConfig.e[key].scripts[s]);
            }
          }
        }
        // add script property
        if (cookieConfig.e[key].script) {
          initScriptsFromCookieMemory.push('<singleScript>'+cookieConfig.e[key].script);
        }
      }
    }
    this.loadScriptsFromCookies(initScriptsFromCookieMemory);
  };

  /*
    Add and loads scripts
  */
  this.loadScriptsFromCookies = function(urls) {
    var tag, content;
    for (var s = 0; s < urls.length; s++) {
      if (urls[s].startsWith('<singleScript>')) {
        content = urls[s].replace('<singleScript>','');
        tag = document.createElement("script");
        tag.innerHTML = content;
      } else {
        tag = document.createElement("script");
        tag.src = urls[s];
        tag.defer = true;
      }
      document.getElementsByTagName("scripts")[0].appendChild(tag);
    }
  };

  /*
    ------------------------
    Click Handler
    ------------------------
  */

  /*
    Create HTML-Classes for links to allow or deny cookies (outside the cookie consent notice)
    USAGE: <a href="#" class="btnClasses.allow or btnClasses.deny">LINK TITLE</a>
  */
  this.initCookieEventListener = function(key) {
    var elements, x;
    if (key != "all") {
      // allow
      if (
          cookieConfig.e[key].btnClasses &&
          cookieConfig.e[key].btnClasses.allow &&
          document.querySelectorAll("."+cookieConfig.e[key].btnClasses.allow+", [href='#"+cookieConfig.e[key].btnClasses.allow+"']")
      ) {
        elements = document.querySelectorAll("."+cookieConfig.e[key].btnClasses.allow+", [href='#"+cookieConfig.e[key].btnClasses.allow+"']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            cookieObject.setCookie(cookieConfig.e[key].cookieName, "allow", cookieConfig.c.lifetime);
            //cookieObject.setCookie("arsorsCookie_interact", "true", cookieConfig.c.lifetime); // The cookie message should not disappear if you accept or reject single modules.
            cookieObject.reload('single');
          };
        }
      }
      // deny
      if (
          cookieConfig.e[key].btnClasses &&
          cookieConfig.e[key].btnClasses.deny &&
          document.querySelectorAll("."+cookieConfig.e[key].btnClasses.deny+", [href='#"+cookieConfig.e[key].btnClasses.deny+"']")
      ) {
        elements = document.querySelectorAll("."+cookieConfig.e[key].btnClasses.deny+", [href='#"+cookieConfig.e[key].btnClasses.deny+"']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            cookieObject.setCookie(cookieConfig.e[key].cookieName, "deny", cookieConfig.c.lifetime);
            //cookieObject.setCookie("arsorsCookie_interact", "true", cookieConfig.c.lifetime); // The cookie message should not disappear if you accept or reject single modules.
            cookieObject.reload(false);
          };
        }
      }
    } else {
      // allow all
      if (document.querySelectorAll(".btn-allowCookie-all, [href='#btn-allowCookie-all']")) {
        elements = document.querySelectorAll(".btn-allowCookie-all, [href='#btn-allowCookie-all']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            cookieObject.allowAllCookies();
          };
        }
      }
      // allow selected
      if (document.querySelectorAll(".btn-allowCookie-selected, [href='#btn-allowCookie-selected']")) {
        elements = document.querySelectorAll(".btn-allowCookie-selected, [href='#btn-allowCookie-selected']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            cookieObject.allowOrDenySelectedCookies();
          };
        }
      }
      // deny all
      if (document.querySelectorAll(".btn-denyCookie-all, [href='#btn-denyCookie-all']")) {
        elements = document.querySelectorAll(".btn-denyCookie-all, [href='#btn-denyCookie-all']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            cookieObject.denyAllCookies();
          };
        }
      }
      // toggleCookieUi
      if (document.querySelectorAll(".btn-toggleCookie, [href='#btn-toggleCookie']")) {
        elements = document.querySelectorAll(".btn-toggleCookie, [href='#btn-toggleCookie']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            cookieObject.toggleCookieUi();
          };
        }
      }
    }
  };

  /*
    ------------------------
    Other important stuff
    ------------------------
  */

  /*
    Init all dependencies for arsorsCookie
  */
  this.__constructor = function() {
    // Append <scripts></scripts>
    var elem = document.createElement('scripts');
    document.body.appendChild(elem);
    if (cookieConfig.c.dynamicAllow) dynamicAllowInteract = cookieObject.getCookie('arsorsCookie_interact');
  };

  /*
    Override Config Object
  */
  this.merge = function(current, update) {
    Object.keys(update).forEach(function(key) {
      // if update[key] exist, and it's not a string or array,
      // we go in one level deeper
      if (current.hasOwnProperty(key) &&
          typeof current[key] === 'object' &&
          !(current[key] instanceof Array)) {
        cookieObject.merge(current[key], update[key]);

      // if update[key] doesn't exist in current, or it's a string
      // or array, then assign/overwrite current[key] to update[key]
      } else {
        current[key] = update[key];
      }
    });
    return current;
  };

  /*
    Dynamic reload or location.reload
    If dynamicAllow is true: If you click on "Allow single cookies", or the first interaction with Arsors.Cookie is the
    button "Allow all" or "Allow selected", then the dynamic loading is used.
  */
  this.reload = function (allow) {
    if (cookieConfig.c.dynamicAllow) {
      // if single allow
      if (allow === 'single') {
        for (var key in dynamicAllowHTML) {
          if (cookieObject.isCookieAllowed(dynamicAllowHTML[key]['cookie']))
            document.querySelector('[data-arsors-content="' + key + '"]').innerHTML = dynamicAllowHTML[key]['html'];
        }
        dynamicAllowInteract = true;
        arsorsCookieInitIFramesAndImages();
      }
      // if all allow but not interact
      if (allow === 'all') {
        if (!dynamicAllowInteract && cookieConfig.c.type === 'opt-in') {
          for (var key in dynamicAllowHTML) {
            if (cookieObject.isCookieAllowed(dynamicAllowHTML[key]['cookie']))
              document.querySelector('[data-arsors-content="' + key + '"]').innerHTML = dynamicAllowHTML[key]['html'];
          }
          dynamicAllowInteract = true;
          arsorsCookieInitIFramesAndImages();
          cookieObject.toggleCookieUi();
        } else location.reload();
      }
      // if deny
      if (!allow) location.reload();
    } else location.reload();
  };

  /*
    ------------------------
    Run Script
    ------------------------
  */
  if (customConfig != false) {

    /* Init all nessecary scripts */
    this.__constructor();
    /*  Merge Objects */
    if (customConfig && typeof customConfig === "object") cookieConfig = this.merge(cookieConfig, customConfig);
    /* Init Cookies */
    this.initCookies();
    for (var key in cookieConfig.e) {
      if (cookieConfig.e.hasOwnProperty(key)) {
        /* INIT AND APPEND ERROR MESSAGES */
        cookieObject.setCookieErrorMessages(key);
        /* INIT EVENTLISTENER FOR LINKS */
        this.initCookieEventListener(key);
      }
    }
    /* INIT GLOBAL EVENTLISTENER FOR LINKS */
    this.initCookieEventListener("all");
    /* INIT SCRIPTS */
    this.initScriptsFromCookies();
    /* INIT UI */
    this.initCookieUi();

  }

  return this;

}

function arsorsCookieInitIFramesAndImages() {
  var e = document.querySelectorAll('iframe,img');
    for (var i=0; i<e.length; i++) {
    if(e[i].getAttribute('data-src')) {
      e[i].setAttribute('src',e[i].getAttribute('data-src'));
      e[i].removeAttribute('data-src');
    }
    if(e[i].getAttribute('data-ac-src')) {
      e[i].setAttribute('src',e[i].getAttribute('data-ac-src'));
      e[i].removeAttribute('data-ac-src');
    }
  } 
}
ArsorsDOMReady(arsorsCookieInitIFramesAndImages);

// THX to youmightnotneedjquery.com
function ArsorsDOMReady(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        fn();
    });
  }
}


/*
  ------------------------
  POLYFILLS FOR OLDER BROWSERS
  ------------------------
*/
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
/*
  ------------------------
  END - POLYFILLS FOR OLDER BROWSERS
  ------------------------
*/
