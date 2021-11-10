import {ArsorsCookie,ArsorsDOMReady,ArsorsCookieInitIFramesAndImages} from './arsors.cookie';

(function exportToGlobal(eg) {
  var envGlobal = eg;
  envGlobal.ArsorsCookie = ArsorsCookie;
  envGlobal.ArsorsDOMReady = ArsorsDOMReady;
  envGlobal.ArsorsCookieInitIFramesAndImages = ArsorsCookieInitIFramesAndImages;
}(typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
