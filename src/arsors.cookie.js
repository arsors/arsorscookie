function arsorsCookie(customConfig) {
  // check for deprecated functions
  if (customConfig === false) console.error("arsorsCookie(false) is deprecated. Use: arsorsCookie.prototype instead!");

  // Early access on robot that he can index the complete page
  if (/bot|googlebot|crawler|spider|robot|crawling|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent)) return false;

  // Set variables
  this.dynamicAllowInteract = false;
  this.dynamicAllowHTML = [];
  this.initScriptsFromCookieMemory = [];
  this.dynamicAllowHTMLInt = 0;
  this.customConfig = customConfig;
  this.cookieConfig = {
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

  if (customConfig !== false) this.run();
}

arsorsCookie.prototype = {

  run: function() {
    /*
      Init all dependencies for arsorsCookie
    */
    /*  Merge Objects */
    if (this.customConfig && typeof this.customConfig === "object") {
      this.cookieConfig = this.merge(this.cookieConfig, this.customConfig);
    }

    /* Append <scripts></scripts> */
    var elem = document.createElement('scripts');
    document.body.appendChild(elem);
    if (this.cookieConfig.c.dynamicAllow) this.dynamicAllowInteract = this.getCookie('arsorsCookie_interact');

    /* Init Cookies */
    this.initCookies();
    for (var key in this.cookieConfig.e) {
      if (this.cookieConfig.e.hasOwnProperty(key)) {
        /* INIT AND APPEND ERROR MESSAGES */
        this.setCookieErrorMessages(key);
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
  },

  merge: function(current, update) {
    /*
      Override Config Object
    */
    Object.keys(update).forEach(function(key) {
      // if update[key] exist, and it's not a string or array,
      // we go in one level deeper
      if (
        current.hasOwnProperty(key) &&
        typeof current[key] === 'object' &&
        !(current[key] instanceof Array)
      ) {
        arsorsCookie.prototype.merge(current[key], update[key]);
      } else {
        // if update[key] doesn't exist in current, or it's a string
        // or array, then assign/overwrite current[key] to update[key]
        current[key] = update[key];
      }
    });
    return current;
  },

  isCookieAllowed: function(cname) {
    /*
      Check if a specific cookie is on status allow
    */
    return (this.getCookie(cname) === "allow") ? true : false;
  },

  allowOrDenySelectedCookies: function() {
    /*
      Set or Remove Cookies
    */
    for (var key in this.cookieConfig.e) {
      if (this.cookieConfig.e.hasOwnProperty(key)) {
        if (document.getElementById(this.cookieConfig.e[key].cookieName).checked) {
          this.setCookie(this.cookieConfig.e[key].cookieName, "allow", this.cookieConfig.c.lifetime);
        } else {
          this.setCookie(this.cookieConfig.e[key].cookieName, "deny", this.cookieConfig.c.lifetime);
        }
      }
    }
    this.setCookie("arsorsCookie_interact", "true", this.cookieConfig.c.lifetime);
    this.reload('all');
  },

  allowAllCookies: function(reload) {
    /*
      Add all Cookies on allow
    */
    for (var key in this.cookieConfig.e) {
      if (this.cookieConfig.e.hasOwnProperty(key)) {
        this.setCookie(this.cookieConfig.e[key].cookieName, "allow", this.cookieConfig.c.lifetime);
      }
    }
    if (reload !== false) {
      this.setCookie("arsorsCookie_interact", "true", this.cookieConfig.c.lifetime);
      this.reload('all');
    }
  },

  denyAllCookies: function() {
    /*
      Remove all Cookies on Deny
    */
    for (var key in this.cookieConfig.e) {
      if (this.cookieConfig.e.hasOwnProperty(key)) {
        this.setCookie(this.cookieConfig.e[key].cookieName, "deny", this.cookieConfig.c.lifetime);
      }
    }
    this.setCookie("arsorsCookie_interact", "true", this.cookieConfig.c.lifetime);
    this.reload(false);
  },

  initCookies: function() {
    /*
      Init Cookies (depends on cookie type)
    */
    if ((this.cookieConfig.c.type === "opt-out" && this.getCookie(this.cookieConfig.e[".arsorsCookie_main"].cookieName) === "") || this.cookieConfig.c.type === "info") this.allowAllCookies(false);
  },

  getCookie: function(cname) {
    /*
      Add Cookie manage to javascript
    */
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
  },

  setCookie: function(cname, cvalue, exdays) {
    /*
      Add Cookie manage to javascript
    */
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },

  setCountryCode: function(callback, html, fallback) {
    var countryCode;
    if (countryCode = this.getCookie('arsorsCookie_countryCode')) {
      if (countryCode == "false") {
        // fallback if can't get countryCode (countryCode-Cookie was set to false)
        return (fallback) ? fallback : 'opt-in';
      } else {
        // Has country code and decide which type should be used
        return this.getTypeByCountryCode(countryCode);
      }
    } else {
      // Remove the content and show a message that the country get searched...
      document.getElementsByTagName('body')[0].innerHTML = (html) ? html : "Searching for the correct privacy policy...";
      if (callback) callback();
      return false;
    }
  },

  getTypeByCountryCode: function(countryCode) {
    var optIn  = this.cookieConfig.c.optInArray,
        optOut = this.cookieConfig.c.optOutArray;
    if (optIn.includes(countryCode)) return 'opt-in';
    else if (optOut.includes(countryCode)) return 'opt-out';
    else return 'info';
  },

  initCookieUi: function() {
    /*
      Init the Cookie Ui
    */
    var content = this.replaceTags(this.cookieConfig.c.html);

    var elem = document.createElement('div');
    elem.innerHTML = content;
    if (this.getCookie("arsorsCookie_interact") !== "true") elem.className="arsorsCookie_wrapper ac_show"; else elem.className="arsorsCookie_wrapper ac_hide";
    document.body.appendChild(elem);

    this.initCookieEventListener("all");
  },

  toggleCookieUi: function() {
    /*
      Toggle the Cookie Ui
    */
    var elements = document.getElementsByClassName('arsorsCookie_wrapper');
    for (var x = 0; x < elements.length; x++) {
      if (elements[x].className.includes('ac_hide')) {
        elements[x].className="arsorsCookie_wrapper ac_show";
      } else {
        elements[x].className="arsorsCookie_wrapper ac_hide";
      }
    }
  },

  createCheckbox: function(cookieKey) {
    /*
      Create options for Cookie Consent Notice
      Usage: include ${this.createCheckbox()} into message or messagelink to create checkboxes
    */
    var content = "";
    var includes = [];
    if (this.cookieConfig.c.type != "info") {
      if (!cookieKey.includes(".") && !cookieKey.includes("#")) {
        // If all checkboxes should be drawn...
        for (var key in this.cookieConfig.e) {
          var tmpContent = this.createSingleCheckbox(key, includes);
          if (tmpContent!="") {
            content += tmpContent;
            includes.push(this.cookieConfig.e[key].cookieName);
          }
        }
      } else {
        // If a specific checkbox should be drawn...
        cookieKey = cookieKey.replace("{{createCheckbox","").replace("}}", "");
        var tmpContent = this.createSingleCheckbox(cookieKey, includes);
        if (tmpContent!="") {
          content += tmpContent;
          includes.push(this.cookieConfig.e[cookieKey].cookieName);
        }
      }
    }
    return content;
  },

  createSingleCheckbox: function(key, includes) {
    /*
      Create single checkbox
    */
    if (this.cookieConfig.e.hasOwnProperty(key) && !includes.includes(this.cookieConfig.e[key].cookieName)) {
      var disabled = (this.cookieConfig.e[key].required) ? " disabled" : "";
      var checked = ((this.cookieConfig.e[key].required || this.isCookieAllowed(this.cookieConfig.e[key].cookieName) || (this.cookieConfig.c.type == "opt-in" && this.getCookie("arsorsCookie_interact") !== "true")) && this.cookieConfig.e[key].forceUnchecked != true) ? " checked" : "";
      return '<label id="' + this.cookieConfig.e[key].cookieName + '_wrapper"><input id="' + this.cookieConfig.e[key].cookieName + '" type="checkbox" name="' + this.cookieConfig.e[key].cookieName + '"' + disabled + checked + '><span class="arsorsCookie_options_box"></span><span class="arsorsCookie_options_label"> ' + this.cookieConfig.e[key].title + '</span></label> ';
    }
    return "";
  },

  replaceTags: function(content) {
    /*
      Replace {{tags}} by object property
    */
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
      if (!m[0].includes("{{createCheckbox")) html = html.replace(m[0], this.cookieConfig.c[m[1]]);
      else html = (this.cookieConfig.c.showOptions) ? html.replace(m[0], this.createCheckbox(m[0])) : html.replace(m[0], "");
    }
    if (html.includes("{{")) return this.replaceTags(html); else return html;
  },


  setCookieErrorMessages: function(container) {
    /*
      Append Error Messages to the specific containers
    */
    if (!this.isCookieAllowed(this.cookieConfig.e[container].cookieName)) {
      // Get Error Message from this.cookieConfig.e
      var content = (this.cookieConfig.e[container].errorMsg) ? this.cookieConfig.e[container].errorMsg : this.cookieConfig.c.globalErrorMsg;
      // Check for ID or Class and append Error Message Content
      if (container.startsWith("#")) {
        // For ID
        if (document.getElementById(container.substr(1))) {
          var element = document.getElementById(container.substr(1));
          if (this.cookieConfig.c.dynamicAllow) {
            element.setAttribute('data-arsors-content', this.dynamicAllowHTMLInt);
            this.dynamicAllowHTML[this.dynamicAllowHTMLInt] = [];
            this.dynamicAllowHTML[this.dynamicAllowHTMLInt]['container'] = container;
            this.dynamicAllowHTML[this.dynamicAllowHTMLInt]['cookie'] = this.cookieConfig.e[container].cookieName;
            this.dynamicAllowHTML[this.dynamicAllowHTMLInt]['html'] = element.innerHTML;
            this.dynamicAllowHTMLInt++;
          }
          element.innerHTML = content;
        }
      } else if (container.startsWith(".")) {
        // For Classes
        var elements = document.getElementsByClassName(container.substr(1));
        for (var x = 0; x < elements.length; x++) {
          if (this.cookieConfig.c.dynamicAllow) {
            elements[x].setAttribute('data-arsors-content', this.dynamicAllowHTMLInt);
            this.dynamicAllowHTML[this.dynamicAllowHTMLInt] = [];
            this.dynamicAllowHTML[this.dynamicAllowHTMLInt]['container'] = container;
            this.dynamicAllowHTML[this.dynamicAllowHTMLInt]['cookie'] = this.cookieConfig.e[container].cookieName;
            this.dynamicAllowHTML[this.dynamicAllowHTMLInt]['html'] = elements[x].innerHTML;
            this.dynamicAllowHTMLInt++;
          }
          elements[x].innerHTML = content;
        }
      } else alert("Can't decide if container-Parameter in this.setCookieErrorMessages() is a ID (#) or a class (.) Check this.cookieConfig.e");
    }
  },

  initScriptsFromCookies: function() {
    /*
      Create scripts-Array. Depending on which cookies were set
    */
    for (var key in this.cookieConfig.e) {
      if (this.isCookieAllowed(this.cookieConfig.e[key].cookieName)) {
        // add scripts property
        if (this.cookieConfig.e[key].scripts) {
          for (var s = 0; s < this.cookieConfig.e[key].scripts.length; s++) {
            if (!this.initScriptsFromCookieMemory.includes(this.cookieConfig.e[key].scripts[s])) {
              this.initScriptsFromCookieMemory.push(this.cookieConfig.e[key].scripts[s]);
            }
          }
        }
        // add script property
        if (this.cookieConfig.e[key].script) {
          this.initScriptsFromCookieMemory.push('<singleScript>'+this.cookieConfig.e[key].script);
        }
      }
    }
    this.loadScriptsFromCookies(this.initScriptsFromCookieMemory);
  },

  loadScriptsFromCookies: function(urls) {
    /*
      Add and loads scripts
    */
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
  },

  initCookieEventListener: function(key) {
    /*
      Create HTML-Classes for links to allow or deny cookies (outside the cookie consent notice)
      USAGE: <a href="#" class="btnClasses.allow or btnClasses.deny">LINK TITLE</a>
    */
    var elements, x,
        ac = this;
    if (key != "all") {
      // allow
      if (
          this.cookieConfig.e[key].btnClasses &&
          this.cookieConfig.e[key].btnClasses.allow &&
          document.querySelectorAll("."+this.cookieConfig.e[key].btnClasses.allow+", [href='#"+this.cookieConfig.e[key].btnClasses.allow+"']")
      ) {
        elements = document.querySelectorAll("."+this.cookieConfig.e[key].btnClasses.allow+", [href='#"+this.cookieConfig.e[key].btnClasses.allow+"']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            ac.setCookie(ac.cookieConfig.e[key].cookieName, "allow", ac.cookieConfig.c.lifetime);
            //ac.setCookie("arsorsCookie_interact", "true", ac.cookieConfig.c.lifetime); // The cookie message should not disappear if you accept or reject single modules.
            ac.reload('single');
          };
        }
      }
      // deny
      if (
          this.cookieConfig.e[key].btnClasses &&
          this.cookieConfig.e[key].btnClasses.deny &&
          document.querySelectorAll("."+this.cookieConfig.e[key].btnClasses.deny+", [href='#"+this.cookieConfig.e[key].btnClasses.deny+"']")
      ) {
        elements = document.querySelectorAll("."+this.cookieConfig.e[key].btnClasses.deny+", [href='#"+this.cookieConfig.e[key].btnClasses.deny+"']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            ac.setCookie(ac.cookieConfig.e[key].cookieName, "deny", ac.cookieConfig.c.lifetime);
            //ac.setCookie("arsorsCookie_interact", "true", ac.cookieConfig.c.lifetime); // The cookie message should not disappear if you accept or reject single modules.
            ac.reload(false);
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
            ac.allowAllCookies();
          };
        }
      }
      // allow selected
      if (document.querySelectorAll(".btn-allowCookie-selected, [href='#btn-allowCookie-selected']")) {
        elements = document.querySelectorAll(".btn-allowCookie-selected, [href='#btn-allowCookie-selected']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            ac.allowOrDenySelectedCookies();
          };
        }
      }
      // deny all
      if (document.querySelectorAll(".btn-denyCookie-all, [href='#btn-denyCookie-all']")) {
        elements = document.querySelectorAll(".btn-denyCookie-all, [href='#btn-denyCookie-all']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            ac.denyAllCookies();
          };
        }
      }
      // toggleCookieUi
      if (document.querySelectorAll(".btn-toggleCookie, [href='#btn-toggleCookie']")) {
        elements = document.querySelectorAll(".btn-toggleCookie, [href='#btn-toggleCookie']");
        for (x = 0; x < elements.length; x++) {
          elements[x].onclick = function (e) {
            e.preventDefault();
            ac.toggleCookieUi();
          };
        }
      }
    }
  },

  reload: function(allow) {
    /*
      Dynamic reload or location.reload
      If dynamicAllow is true: If you click on "Allow single cookies", or the first interaction with Arsors.Cookie is the
      button "Allow all" or "Allow selected", then the dynamic loading is used.
    */
    if (this.cookieConfig.c.dynamicAllow) {
      // if single allow
      if (allow === 'single') {
        for (var key in this.dynamicAllowHTML) {
          if (this.isCookieAllowed(this.dynamicAllowHTML[key]['cookie']))
            document.querySelector('[data-arsors-content="' + key + '"]').innerHTML = this.dynamicAllowHTML[key]['html'];
        }
        this.dynamicAllowInteract = true;
        arsorsCookieInitIFramesAndImages();
      }
      // if all allow but not interact
      if (allow === 'all') {
        if (!this.dynamicAllowInteract && this.cookieConfig.c.type === 'opt-in') {
          for (var key in this.dynamicAllowHTML) {
            if (this.isCookieAllowed(this.dynamicAllowHTML[key]['cookie']))
              document.querySelector('[data-arsors-content="' + key + '"]').innerHTML = this.dynamicAllowHTML[key]['html'];
          }
          this.dynamicAllowInteract = true;
          arsorsCookieInitIFramesAndImages();
          this.toggleCookieUi();
        } else location.reload();
      }
      // if deny
      if (!allow) location.reload();
    } else location.reload();
  }

}

function arsorsCookieInitIFramesAndImages() {
  var e = document.querySelectorAll('iframe,img,script');
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
