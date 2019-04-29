# Arsors.Cookie
Customizable cookie plugin with JavaScript blocker

---

## Introduction
**TL;TR** Arsors.Cookie is fully customizable!
Arsors.Cookie has everything you expect from a Cookie Plugin. You have full control over the HTML markup and can change and expand it as you like. You can block specific JavaScript Files, iFrames and any Content you whish. Thanks to the modular system, you can also manage as many cookies as you like! The user has the freedom to accept or deny each cookie separately. You can fully customize Arsors.Cookie. It comes with three different types of privacy policies: Opt-In, Opt-Out & Info Modus.
Normally you would have to pay a monthly fee for such features. Arsors.Cookie breaks the rules as the first advanced open source Cookie Plugin!

---

## Demonstration
Enough of the advertisement, let's get into action. On the Arsors.Cookie Website you can find a [Live-Demo](https://www.cookie.arsors.de/en/demo) of the Plugin. If you want to play with it before you use it in productive mode then just check out the demonstration folder and have fun with it ;)

---

## Installation
You can download Arsors.Cookie from [GitHub](https://github.com/arsors/arsorscookie) or install it via **composer** or **bower**. Simply copy the appropriate commandline and quickly add the plugin to your project.
`composer require arsors-cookie`
`bower install arsors-cookie`

Then Just add the arsors.cookie.min.js before the `</body>` closing tag.
```html
<script src="https://raw.githubusercontent.com/arsors/cookie/master/arsors.cookie.min.js"></script>
```
Take a look at the section below to see a basic example or the full power of configuration.

---

## Basic Example
If you only want to set one single cookie which blocks content and loads/blocks the scripts automatically by Arsors.Cookie, you have to follow two steps:
**First Step: JavaScript**
```html
<script src="https://raw.githubusercontent.com/arsors/cookie/master/arsors.cookie.min.js"></script>
<script>
var myCookie = new arsorsCookie({
    c : {
        type: 'opt-in'
    },
    e : {
        '.arsorsCookie_main': {
            title: "Arsors.Cookie",
            cookieName: "arsorsCookie",
            scripts: ['main.js', 'jquery.js']
        }
    }
});
</script>
```
**Second Step: HTML**
```html
<div class="arsorsCookie_main">
    Just wrap an element with the class "arsorsCookie_main" around the content you want to block.
    <iframes src="get/blocked/too.html"></iframe>
</div>
```

---

## Compatibility
### Desktop
| Chrome | FireFox | Edge | IE | Opera | Safari |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 33 | 26 | 12 | 9* | 15 | 9 |

\* *The css of Arsors.Cookie uses animations which are not supported in IE9*

### Mobile
| Chrome | FireFox | Edge | Opera | Safari |
|:-:|:-:|:-:|:-:|:-:|
| 33 | 26 | 12 | 6 | 7 |

---

## Configuration (Config)
Arsors.Cookie configuration is segmented into two sections: one for the global settings and one for the cookie elements. The configuration is done by a JavaScript Object. In this section you will learn all about the global settings. The key `c` stands for `configuration`. All global settings belong in this section.

### Change Privacy Policy
There are three different types of privacy policies: `opt-in`, `opt-out` & `info`. All you have to change is the `type` property in `c`.
```js
var myCookie = new arsorsCookie({
    c : {
        type: 'opt-in'
    }
});
```

### Custom HTML
You can adjust the complete HTML markup as you like and work with template variables `{{variableName}}` which you can also use nested. Your custom HTML is wrapped into a `div` which you can't change. It has the classes `arsorsCookie_wrapper` for identification and `ac_show` or `ac_hide` for the different visibility status of the cookie notice. Template variables are rendered recursively. That means you need to start with the property `html` in `c` and can add a custom property `myCustomText` in `c` as well. After that you can insert the content of `myCustomText` into the `html` property like this: `html: "<p>{{myCustomText}}</p>"`. Have a look below for an example.

#### Cookie Notice
Create your custom cookie notice HTML with nested template variables.
```js
var myCookie = new arsorsCookie({
    c : {
        html: '<div class="arsorsCookie"><div class="arsorsCookie_text">{{myCustomText}}</div><div class="arsorsCookie_btnWrapper">{{deny}}{{allow}}</div></div>',
        myCustomText: 'This website uses cookies. Some of these cookies require your explicit consent. Please agree to the use of cookies in order to use all functions of the website. Detailed information on the use of cookies can be found in our {{learnMore}}. Here you can also revoke your consent to the use of cookies.',
        learnMore: '<a href="{{learnMoreUrl}}" class="arsorsCookie_learnmore">{{learnMoreText}}</a>',
        learnMoreText: 'Privacy Policy',
        learnMoreUrl: 'https://cookie.arsors.de/',
        allow: '<a class="arsorsCookie_btn btn-allowCookie-selected" href="#">{{allowText}}</a>',
        allowText: 'Allow Selected',
        deny: '<a class="arsorsCookie_btn btn-denyCookie-all" href="#">{{denyText}}</a>',
        denyText: 'Deny All'
    }
});
```
As you can see we start with the required `html` property and insert the content of our custom property `myCustomText` using the template variable `{{myCustomText}}`. In `myCustomText` we have the template variable `{{learnMore}}` which gets replaced by the content of the property `learnMore`. With this nested functionality you can go as deep as you like.

#### Floating Button
When the user accepts or denies the cookies the cookie notice disappears. If you want to provide the possibility to display the cookie notice again, you could use a floating button. You decide how you want to implement it.
Arsors.Cookie generates a Click EventHandler for the class `btn-toggleCookie` by default. Just add this class to a button anywhere you want **or** add it as template variable and include it to your custom cookie notice HTML. For example:
```js
var myCookie = new arsorsCookie({
    c : {
        html: '{{floatingHtml}}<div class="arsorsCookie">[...]</div>',
        floatingHtml: '<a class="btn-toggleCookie arsorsCookie_floatingBtn" href="#">{{floatingHtmlText}}</a>',
        floatingHtmlText: 'Cookie Policy'
    }
});
```

### Checkbox Function
When you create [multiple cookies](#initialize-a-new-cookie) it can make sense to activate the checkbox function. When the checkbox function is activated Arsors.Cookie draws one checkbox for each cookie. So the user can decide which cookie to load or block. You can render this by just including the predefined template variable `{{createCookieOptions}}` into the `html` property. See custom [Cookie Notice](#cookie-notice). You can also mark specific [cookies as required](#required) so the user can't uncheck these.

### Cookie Lifetime
You can change the global cookie lifetime with the property `lifetime` in `c`. This property must be set as an integer. The integer will be counted as days.
```js
var myCookie = new arsorsCookie({
    c : {
        lifetime: 365
    }
});
```

### Global Error Message
If you don't set up a custom error message for a custom cookie the default global error message will appear. Here is an example of how you can change it:
```js
var myCookie = new arsorsCookie({
    c : {
        globalErrorMsg: '<div class="ac_error"><p>You must accept cookies to view this content. <a class="btn-allowCookie-all" href="#">Accept Cookies</a></p></div>'
    }
});
```

---

## Configuration (Elements)
Arsors.Cookie enables you to create as many cookies as you like. Each cookie has its own Click EventHandler, can mangage JavaScript files, block any content, show a custom error message or set it as required. The key `e` stand for `elements`. All the configrations for the cookie elements belong here.
If you want a checkbox to allow or deny each cookie then just [activate the checkbox function](#checkbox-function).

### Initialize a new Cookie
To initialize a new custom cookie just add a new object to the `e` property with the minimum of these three required values: `Class/ID Name` as object key (and as HTML Class or ID for the [custom error message](#custom-error-message)), `title` as the title of the cookie and `cookieName` for the name of the cookie that shall be created.
Please keep in mind that Arsors.Cookie has already one predefined cookie `.arsorsCookie_main`. The first cookie key **has** to be `.arsorsCookie_main` otherwise you will recieve an error. Of course you can overwrite all properties of the predefined cookie.
```js
var myCookie = new arsorsCookie({
    e : {
        '.arsorsCookie_main': { // this key is predefined and must exist
            title: "Required",
            cookieName: "arsorsCookie_main"
        },
        '#customID': {
            title: "customID Cookie",
            cookieName: "arsorsCookie_customID"
        },
        '.customClass': {
            title: "customClass Cookie",
            cookieName: "arsorsCookie_customClass"
        }
    }
});
```

### Event Handler
Every custom cookie can have its own Click EventHandler. It can be initialized by the property `btnClasses`. The property will create classes which you have to add to a HTML-Tag (such as button or a). That way you can place the button everywhere you want it in the frontend and enable the user to edit the custom cookie preferences afterwards. To allow or deny all cookies at a time there's a [predefined EventHandler](#predefined-click-eventHandler).
```js
var myCookie = new arsorsCookie({
    e : {
        '.arsorsCookie_main': { // this key is predefined and must exist
            title: "Required",
            cookieName: "arsorsCookie_main",
            btnClasses: {allow: 'btn-allowCookie', deny: "btn-denyCookie"}
        }
    }
});
```
Then you can add the following HTML where you want it:
```html
<a href="#" class="btn-allowCookie">[...]</a>
<a href="#" class="btn-denyCookie">[...]</a>
```

### Blocking Scripts
Each custom cookie can block multiple JavaScript files. Therefore you need to reference these JavaScript files under the property `scripts` as an array. You can also add the same JavaScript file to multiple custom cookies. Arsors.Cookie will handle this and load the specific JavaScript file only once. The order in which you specify the scripts in the array also determines the order in which the scripts are loaded. When you initialize several cookies in a row the scripts will be loaded top to button.
```js
var myCookie = new arsorsCookie({
    e : {
        '.arsorsCookie_main': { // this key is predefined and must exist
            title: "Required",
            cookieName: "arsorsCookie_main",
            scripts: ['main.js', '../path/to/file.js']
        }
    }
});
```
**NOTICE:** The Arsors.Cookie Plugin doesn't recognize the scripts embedded via the tag `<script>` in your HTML file. Thus all scripts you want to manage have to be included as explained above.

**Tip:** If you don't want to include thousands of different JavaScript files then just use [Arsors.uglify-merge-js](https://github.com/arsors/uglify-merge-js) ;)

#### Blocking inline script
You also have the option to block/load an inline script. This is helpful if you want to include your Google Analytics snippet in Arsors.Cookie without creating an own file for it. To do so you have to add the script snippet as string to the `script` property.
```js
script: 'console.log("Your custom script without <script>-Tag");'
```
When you want to combine the property `script` and `scripts` it could happen that scripts is executed after script. To prevent that just wrap `document.onreadystatechange=function(){if(document.readyState==="complete"){ [...your snippet...] }};` around your inline script.

### Blocking iFrames or any Content
The key of each custom cookie object needs to initialize as an ID `#name` or as a class `.name`. Then Arsors.Cookie creates for you the specific ID or Class as blocking container. All you have to do is wrap an element with the ID or Class around the content you want to block and change the `src`-Attribute of the iFrames or Images to `data-src` or `data-ac-src`. When the container gets blocked the global error message or the custom cookie error message will appear instead.
```js
var myCookie = new arsorsCookie({
    e : {
        '.arsorsCookie_main': { // this key is predefined and must exist
            title: "Required",
            cookieName: "arsorsCookie_main"
        }
    }
});
```
```html
<div class="arsorsCookie_main">
    <p>Maybe this text container can read your private data? I don't think so.</p>
    <div style='height:300px;width:100%;'>
        <iframe width="" height="300" data-src=https://maps.google.de/maps?q=berlin&hl=de&t=&z=5&ie=utf8&iwloc=b&output=embed frameborder="0" scrolling="no" marginheight="0" marginwidth="0" style='height:300px;width:100%;'></iframe>
    </div>
</div>
```

### Custom Error Message
When you [block iFrames or any content](#blocking-iframes-or-any-content) you can also show a custom error message. Each custom cookie can be provided with a custom error message. Just add the property `errorMsg`. If you also added the `btnClasses` ([Event Handler](#event-handler)) you can directly provide a link to accept the specific cookie in the custom error message.
```js
var myCookie = new arsorsCookie({
    e : {
        '.arsorsCookie_main': { // this key is predefined and must exist
            title: "Required",
            cookieName: "arsorsCookie_main"
            btnClasses: {allow: 'btn-allowCookie', deny: "btn-denyCookie"},
            errorMsg: '<div class="ac_error"><p>CUSTOM: You must accept cookies to view this content. <a class="btn-allowCookie" href="#">Accept Cookies</a></p></div>'
        }
    }
});
```
If you don't need a custom error message then just set the property `errorMsg` to an empty string.

### Required
Using the [checkbox function](#checkbox-function) each custom cookie can be marked as `required`. Thus the user can't uncheck this one and only gets the two options to accept or deny all cookies.
```js
var myCookie = new arsorsCookie({
    e : {
        '.arsorsCookie_main': { // this key is predefined and must exist
            title: "Required",
            cookieName: "arsorsCookie_main",
            required: true
        }
    }
});
```

---

## Predefined Click EventHandler
There are some predefined Click EventHandlers as HTML-classes which you can use:
`btn-allowCookie-all`: Allow all cookies
`btn-denyCookie-all`: Deny all cookies
`btn-allowCookie-selected`: Allow the cookies selected in the checkboxes
`btn-toggleCookie`: Toggle cookie notice between the class `ac_show` and `ac_hide`

---

## Hypothetical Multilingualism
This plugin does not have an integrated multilingualism. But it is still possible. For example: Different JavaScript objects can be initialized to do exactly that for you.
```js
var lang = "en";
var globalConfig = {
    c: {
        type: 'opt-in'
    }
};

if (lang == "de") {
    var langConfig = {
        c: {
            globalErrorMsg: 'Eine deutsche Fehlermeldung.'
        }
    };
} else {
    // Fallback
    var langConfig = {
        c: {
            globalErrorMsg: 'An english error message.'
        }
    };
}

var mergeConfig = arsorsCookie(false).merge(globalConfig, langConfig);
var myCookie = new arsorsCookie(mergeConfig);
```
**Other possibilities:** For Wordpress, Neos or any other content management system you could also use PHP to generate the JavaScript configuration with the appropriate texts in the desired language. You could also use i18n for the integration of the correct texts or you could write your own JavaScript function which returns the correct text via IDs. Be creative! There are lots of possibilities.

---

## Location Service
You can also force a different cookie behavior depending on which country the user comes from. Some countrys require `opt-in`, `opt-out` or just a `info` for cookies. There are two methods in Arsors.Cookie that allow you to do this: `setCountryCode()` and `getTypeByCountryCode()`.

### setCountryCode()
In this method you can add a callback mechanism that determines the country code of the current user by IP or other means. In this method it is important that a cookie is set (`arsorsCookie_countryCode`) that contains either the country code or a `false` (string). False in this case stands for error when determining the country code, in this case a fallback type is used. After setting the cookie it is important to reload the current page using `location.reload()`. This will load the country specific settings. While this method is active, the whole body content is replaced by a message that the country code is determined. So all contents are blocked first and only after reloading the page the cookies are allowed or blocked.

 `setCountryCode(function callback, string html, string fallback)` has three parameters with which you can define the following things:
1. function callback: In this callback function you can add your own mechanism which determines the user's country code. Important here is that the cookie `arsorsCookie_countryCode` is set with the country code or with the string `false`. After setting the cookie you have to reload the page with `location.reload()`.
2. As long as the country code is determined, the entire body content is replaced by HTML. With this parameter you can define the HTML to output.
3. If the cookie in the callback function is set to false, Arsors.Cookie still needs a type `opt-in`, `opt-out` or `info`. The default fallback is `opt-in`, but you can also set your own fallback using this parameter.

This function called `getTypeByCountryCode()` inside and return like `getTypeByCountryCode()` the `type` of the cookie notice behavior `opt-in`, `opt-out` or `info`.

#### Example
```js
// setCountryCode()
// IF WE DON'T KNOW THE COUNTRY CODE WE HAVE TO USE A SERVICE
var locationType = arsorsCookie(false).setCountryCode(function() {
  // get content of api
  var xmlhttp = new XMLHttpRequest();
  var url = 'http://api.ipinfodb.com/v3/ip-country/?format=json&key=KEY&ip=IP';

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(this.responseText);
      if (json.statusCode == "OK") {
        arsorsCookie(false).setCookie("arsorsCookie_countryCode", json.countryCode, 365);
        location.reload();
      } else {
        arsorsCookie(false).setCookie("arsorsCookie_countryCode", "false", 365);
        location.reload();
      }
    }
    if (this.readyState == 4 && this.status == 0) {
      arsorsCookie(false).setCookie("arsorsCookie_countryCode", "false", 365);
      location.reload();
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}, "<h1>This is my private HTML. Searching for the correct privacy policy...</h2>");

// Set global cookie config
var globalConfig = {
    c: {
        html: '{{floatingHtml}}<div class="arsorsCookie"><div class="arsorsCookie_text">{{htmlText}}</div><div class="arsorsCookie_options">{{createCookieOptions}}</div><div class="arsorsCookie_btnWrapper">{{locationHtml}}</div></div>',
        type: locationType, //insert the correct law through getTypeByCountryCode()
        locationHtml: (locationType == "info") ? '{{info}}' : '{{deny}}{{allow}}', // decide which buttons should used
        info: '<a class="btn-toggleCookie arsorsCookie_btn" href="#">{{infoText}}</a>',
        infoText: "Info"
    }
};

// Activate Arsors.Cookie if country code is set
if (locationType != false) var myCookie = new arsorsCookie(mergeConfig); // locationType != false prevent loading the cookie notice while searching for the country code by a external service
```
**Tip** Here is a wonderful list of services to get the the country code from IPs: https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript

**Remember** In some country it is not allow to read the IP adress of the visitor and search the country code by IP. This function as well as the whole plugin is used at your own risk.

### getTypeByCountryCode()
If you know already the country code of your customer then you can use the `getTypeByCountryCode()` method. The method will return the `type` of the cookie notice behavior. Simply set the country code as parameter and Arsors.Cookie will return you the law of the country code.
```js
var locationType = arsorsCookie(false).getTypeByCountryCode("DE");
```
**Tip** If Arsors.Cookie didn't reply the correct law of the country code you can customize the law settings by setting the `c.optInArray` and `c.optOutArray`.
```js
{
    c: {
        optInArray: ['HR', 'IT', 'ES'],
        optOutArray: ['AT','BE','BG' ...]
    }
}
```
#### Example
```js
// getTypeByCountryCode()
var locationType = arsorsCookie(false).getTypeByCountryCode("DE");

// Set global cookie config
var globalConfig = {
    c: {
        html: '{{floatingHtml}}<div class="arsorsCookie"><div class="arsorsCookie_text">{{htmlText}}</div><div class="arsorsCookie_options">{{createCookieOptions}}</div><div class="arsorsCookie_btnWrapper">{{locationHtml}}</div></div>',
        type: locationType, //insert the correct law through getTypeByCountryCode()
        locationHtml: (locationType == "info") ? '{{info}}' : '{{deny}}{{allow}}', // decide which buttons should used
        info: '<a class="btn-toggleCookie arsorsCookie_btn" href="#">{{infoText}}</a>',
        infoText: "Info"
    }
};

// Activate Arsors.Cookie if country code is set
var myCookie = new arsorsCookie(mergeConfig);
```

---

## Properties
Most of the shown properties are set in the default configuration of Arsors.Cookie. The optional properties are uncommented. You just have to overwrite or add what you want. Below this section you see the default configuration of Arsors.Cookie.
```js
{
    //c: {
        //type: "string",             // default opt-in
        //html: "string",
        //showOptions: boolean,       // default true
        //lifetime: integer,          // default 365 (days)
        //globalErrorMsg: "string",
        //optInArray: array,
        //optOutArray: array
    //},
    e: {
        '.string': {                 // default .arsorsCookie_main (is required) Needs # for ID or . Class infront
            title: "string",
            cookieName: "string",
            //btnClasses: {allow: "", deny: ""},
            //scripts: array[],
            //errorMsg: "string",
            //required: boolean
        }
    }
}
```

---

## Default Configuration of Arsors.Cookie
```js
{
    c: {
        type: "opt-in",
        html: '{{floatingHtml}}<div class="arsorsCookie"><div class="arsorsCookie_text">{{htmlText}}</div><div class="arsorsCookie_options">{{createCookieOptions}}</div><div class="arsorsCookie_btnWrapper">{{deny}}{{allow}}</div></div>',
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
        '.arsorsCookie_main': {                 // .arsorsCookie_main is required
            title: "Required",                  // is required
            cookieName: "arsorsCookie_main"     // is required
        }
    }
}
```

---

## Credits
[Marvin Schieler](https://arsors.de)
### Special thanks to:
[Marco Sadowski](https://github.com/MarcoPNS)

Anna Schäfer
