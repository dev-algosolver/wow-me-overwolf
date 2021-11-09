/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./ow-game-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games-events */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-hotkeys */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-window */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js"), exports);


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGameListener = void 0;
const ow_listener_1 = __webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js");
class OWGameListener extends ow_listener_1.OWListener {
    constructor(delegate) {
        super(delegate);
        this.onGameInfoUpdated = (update) => {
            if (!update || !update.gameInfo) {
                return;
            }
            if (!update.runningChanged && !update.gameChanged) {
                return;
            }
            if (update.gameInfo.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(update.gameInfo);
                }
            }
            else {
                if (this._delegate.onGameEnded) {
                    this._delegate.onGameEnded(update.gameInfo);
                }
            }
        };
        this.onRunningGameInfo = (info) => {
            if (!info) {
                return;
            }
            if (info.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(info);
                }
            }
        };
    }
    start() {
        super.start();
        overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated);
        overwolf.games.getRunningGameInfo(this.onRunningGameInfo);
    }
    stop() {
        overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated);
    }
}
exports.OWGameListener = OWGameListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js":
/*!************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGamesEvents = void 0;
const timer_1 = __webpack_require__(/*! ./timer */ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js");
class OWGamesEvents {
    constructor(delegate, requiredFeatures, featureRetries = 10) {
        this.onInfoUpdates = (info) => {
            this._delegate.onInfoUpdates(info.info);
        };
        this.onNewEvents = (e) => {
            this._delegate.onNewEvents(e);
        };
        this._delegate = delegate;
        this._requiredFeatures = requiredFeatures;
        this._featureRetries = featureRetries;
    }
    async getInfo() {
        return new Promise((resolve) => {
            overwolf.games.events.getInfo(resolve);
        });
    }
    async setRequiredFeatures() {
        let tries = 1, result;
        while (tries <= this._featureRetries) {
            result = await new Promise(resolve => {
                overwolf.games.events.setRequiredFeatures(this._requiredFeatures, resolve);
            });
            if (result.status === 'success') {
                console.log('setRequiredFeatures(): success: ' + JSON.stringify(result, null, 2));
                return (result.supportedFeatures.length > 0);
            }
            await timer_1.Timer.wait(3000);
            tries++;
        }
        console.warn('setRequiredFeatures(): failure after ' + tries + ' tries' + JSON.stringify(result, null, 2));
        return false;
    }
    registerEvents() {
        this.unRegisterEvents();
        overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.addListener(this.onNewEvents);
    }
    unRegisterEvents() {
        overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.removeListener(this.onNewEvents);
    }
    async start() {
        console.log(`[ow-game-events] START`);
        this.registerEvents();
        await this.setRequiredFeatures();
        const { res, status } = await this.getInfo();
        if (res && status === 'success') {
            this.onInfoUpdates({ info: res });
        }
    }
    stop() {
        console.log(`[ow-game-events] STOP`);
        this.unRegisterEvents();
    }
}
exports.OWGamesEvents = OWGamesEvents;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGames = void 0;
class OWGames {
    static getRunningGameInfo() {
        return new Promise((resolve) => {
            overwolf.games.getRunningGameInfo(resolve);
        });
    }
    static classIdFromGameId(gameId) {
        let classId = Math.floor(gameId / 10);
        return classId;
    }
    static async getRecentlyPlayedGames(limit = 3) {
        return new Promise((resolve) => {
            if (!overwolf.games.getRecentlyPlayedGames) {
                return resolve(null);
            }
            overwolf.games.getRecentlyPlayedGames(limit, result => {
                resolve(result.games);
            });
        });
    }
    static async getGameDBInfo(gameClassId) {
        return new Promise((resolve) => {
            overwolf.games.getGameDBInfo(gameClassId, resolve);
        });
    }
}
exports.OWGames = OWGames;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWHotkeys = void 0;
class OWHotkeys {
    constructor() { }
    static getHotkeyText(hotkeyId, gameId) {
        return new Promise(resolve => {
            overwolf.settings.hotkeys.get(result => {
                if (result && result.success) {
                    let hotkey;
                    if (gameId === undefined)
                        hotkey = result.globals.find(h => h.name === hotkeyId);
                    else if (result.games && result.games[gameId])
                        hotkey = result.games[gameId].find(h => h.name === hotkeyId);
                    if (hotkey)
                        return resolve(hotkey.binding);
                }
                resolve('UNASSIGNED');
            });
        });
    }
    static onHotkeyDown(hotkeyId, action) {
        overwolf.settings.hotkeys.onPressed.addListener((result) => {
            if (result && result.name === hotkeyId)
                action(result);
        });
    }
}
exports.OWHotkeys = OWHotkeys;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js":
/*!********************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWListener = void 0;
class OWListener {
    constructor(delegate) {
        this._delegate = delegate;
    }
    start() {
        this.stop();
    }
}
exports.OWListener = OWListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js":
/*!******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWWindow = void 0;
class OWWindow {
    constructor(name = null) {
        this._name = name;
        this._id = null;
    }
    async restore() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.restore(id, result => {
                if (!result.success)
                    console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`);
                resolve();
            });
        });
    }
    async minimize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.minimize(id, () => { });
            return resolve();
        });
    }
    async maximize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.maximize(id, () => { });
            return resolve();
        });
    }
    async hide() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.hide(id, () => { });
            return resolve();
        });
    }
    async close() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            const result = await this.getWindowState();
            if (result.success &&
                (result.window_state !== 'closed')) {
                await this.internalClose();
            }
            return resolve();
        });
    }
    dragMove(elem) {
        elem.className = elem.className + ' draggable';
        elem.onmousedown = e => {
            e.preventDefault();
            overwolf.windows.dragMove(this._name);
        };
    }
    async getWindowState() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.getWindowState(id, resolve);
        });
    }
    static async getCurrentInfo() {
        return new Promise(async (resolve) => {
            overwolf.windows.getCurrentWindow(result => {
                resolve(result.window);
            });
        });
    }
    obtain() {
        return new Promise((resolve, reject) => {
            const cb = res => {
                if (res && res.status === "success" && res.window && res.window.id) {
                    this._id = res.window.id;
                    if (!this._name) {
                        this._name = res.window.name;
                    }
                    resolve(res.window);
                }
                else {
                    this._id = null;
                    reject();
                }
            };
            if (!this._name) {
                overwolf.windows.getCurrentWindow(cb);
            }
            else {
                overwolf.windows.obtainDeclaredWindow(this._name, cb);
            }
        });
    }
    async assureObtained() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.obtain();
            return resolve();
        });
    }
    async internalClose() {
        let that = this;
        return new Promise(async (resolve, reject) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.close(id, res => {
                if (res && res.success)
                    resolve();
                else
                    reject(res);
            });
        });
    }
}
exports.OWWindow = OWWindow;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/timer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
class Timer {
    constructor(delegate, id) {
        this._timerId = null;
        this.handleTimerEvent = () => {
            this._timerId = null;
            this._delegate.onTimer(this._id);
        };
        this._delegate = delegate;
        this._id = id;
    }
    static async wait(intervalInMS) {
        return new Promise(resolve => {
            setTimeout(resolve, intervalInMS);
        });
    }
    start(intervalInMS) {
        this.stop();
        this._timerId = setTimeout(this.handleTimerEvent, intervalInMS);
    }
    stop() {
        if (this._timerId == null) {
            return;
        }
        clearTimeout(this._timerId);
        this._timerId = null;
    }
}
exports.Timer = Timer;


/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/AppWindow.ts":
/*!**************************!*\
  !*** ./src/AppWindow.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppWindow = void 0;
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
class AppWindow {
    constructor(windowName) {
        this.maximized = false;
        this.mainWindow = new overwolf_api_ts_1.OWWindow('background');
        this.currWindow = new overwolf_api_ts_1.OWWindow(windowName);
        const closeButton = document.getElementById('closeButton');
        const minimizeButton = document.getElementById('minimizeButton');
        const header = document.getElementById('header');
        this.setDrag(header);
        closeButton.addEventListener('click', () => {
            console.log('closeButton clicked');
            this.mainWindow.close();
        });
        minimizeButton.addEventListener('click', () => {
            console.log('minimizeButton clicked');
            this.currWindow.minimize();
        });
    }
    closeWindow() {
        this.mainWindow.close();
    }
    async getWindowState() {
        return await this.currWindow.getWindowState();
    }
    async setDrag(elem) {
        this.currWindow.dragMove(elem);
    }
}
exports.AppWindow = AppWindow;


/***/ }),

/***/ "./src/components/dropdown.ts":
/*!************************************!*\
  !*** ./src/components/dropdown.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createCustomDropDown = void 0;
function createCurrentElement(dropdownInfo) {
    const dropdownCurrent = document.createElement("div");
    dropdownCurrent.classList.add("select-box__current");
    dropdownInfo.dropDownList.forEach((dropdownItemInfo, index) => {
        const dropdownItem = document.createElement("div");
        dropdownItem.classList.add("select-box__value");
        const input = document.createElement("input");
        input.classList.add("select-box__input");
        input.setAttribute("type", "radio");
        input.setAttribute("id", dropdownItemInfo.id);
        input.setAttribute("value", dropdownItemInfo.text);
        input.setAttribute("name", dropdownInfo.variableName);
        if (index === 0) {
            input.setAttribute("checked", "checked");
        }
        dropdownItem.appendChild(input);
        const text = document.createElement("p");
        text.classList.add("select-box__input-text");
        text.innerText = dropdownItemInfo.text;
        dropdownItem.appendChild(text);
        dropdownCurrent.appendChild(dropdownItem);
    });
    const arrow = document.createElement("img");
    if (dropdownInfo.variableName === 'character') {
        arrow.setAttribute("src", "./img/desktop-window/dropdown-arrow.svg");
    }
    else {
        arrow.setAttribute("src", "./img/in-game-window/dropdown/drop-down-arrow.png");
    }
    arrow.setAttribute("alt", "Arrow Icon");
    arrow.classList.add("select-box__icon");
    dropdownCurrent.appendChild(arrow);
    return dropdownCurrent;
}
function createListElement(dropdownInfo) {
    const dropdownList = document.createElement("ul");
    dropdownList.classList.add("select-box__list");
    dropdownInfo.dropDownList.forEach((dropdownItemInfo) => {
        const li = document.createElement("li");
        const label = document.createElement("label");
        label.classList.add("select-box__option");
        label.setAttribute("for", dropdownItemInfo.id);
        label.innerText = dropdownItemInfo.text;
        li.appendChild(label);
        dropdownList.appendChild(li);
    });
    return dropdownList;
}
function createCustomDropDown(dropdownInfo) {
    const dropdown = document.createElement("div");
    dropdown.classList.add("select-box");
    dropdown.setAttribute("tabindex", "1");
    const current = createCurrentElement(dropdownInfo);
    dropdown.appendChild(current);
    const list = createListElement(dropdownInfo);
    dropdown.appendChild(list);
    current.addEventListener('click', (e) => {
        current.classList.toggle('focussed');
    });
    dropdown.addEventListener('blur', (e) => {
        e.stopPropagation();
        current.classList.remove('focussed');
    });
    return dropdown;
}
exports.createCustomDropDown = createCustomDropDown;


/***/ }),

/***/ "./src/components/talentsTable.ts":
/*!****************************************!*\
  !*** ./src/components/talentsTable.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTalentsTable = void 0;
const getColorForPercentage = function (pct) {
    const pctUpper = (pct < 50 ? pct : pct - 50) / 50;
    const pctLower = 1 - pctUpper;
    const r = Math.floor(222 * pctLower + (pct < 50 ? 222 : 0) * pctUpper);
    const g = Math.floor((pct < 50 ? 0 : 222) * pctLower + 222 * pctUpper);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | 0x00).toString(16).slice(1);
};
function createTalentRowElement(talentLevel, treeMode) {
    const talentLevelElement = document.createElement("div");
    talentLevelElement.classList.add("talent-row");
    talentLevelElement.setAttribute("data-selected", talentLevel.is_selected ? "yes" : "no");
    const level = document.createElement("div");
    level.classList.add("outer");
    const levelInner = document.createElement("div");
    levelInner.classList.add("inner");
    levelInner.innerText = `${talentLevel.level}`;
    level.appendChild(levelInner);
    talentLevelElement.appendChild(level);
    talentLevel.talentItemList.forEach(talentItem => {
        const talentItemElement = document.createElement("div");
        talentItemElement.classList.add("outer");
        talentItemElement.setAttribute("data-selected", talentItem.is_selected ? "yes" : "no");
        const Inner = document.createElement("div");
        Inner.classList.add("inner");
        if (!treeMode) {
            const percent = document.createElement("span");
            percent.classList.add('percent');
            percent.style['color'] = getColorForPercentage(talentItem.percent);
            percent.innerText = `${talentItem.percent}`;
            Inner.appendChild(percent);
        }
        const icon = document.createElement("i");
        icon.classList.add("talent-icon");
        icon.style.backgroundImage = `url(/img/in-game-window/talents/${talentItem.icon})`;
        const text = document.createElement("span");
        text.innerText = talentItem.name;
        Inner.appendChild(icon);
        Inner.appendChild(text);
        talentItemElement.appendChild(Inner);
        talentLevelElement.appendChild(talentItemElement);
    });
    return talentLevelElement;
}
function createTalentsTable(talentTable, treeMode) {
    const talentsTableElement = document.createElement("div");
    talentsTableElement.classList.add("talent-table");
    talentTable.talentLevelList.forEach(talentLevel => {
        const talentLevelElement = createTalentRowElement(talentLevel, treeMode);
        talentsTableElement.appendChild(talentLevelElement);
    });
    return talentsTableElement;
}
exports.createTalentsTable = createTalentsTable;


/***/ }),

/***/ "./src/consts.ts":
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hotkeys = exports.windowNames = exports.interestingFeatures = exports.wowClassId = void 0;
const wowClassId = 765;
exports.wowClassId = wowClassId;
const interestingFeatures = [
    'counters',
    'death',
    'items',
    'kill',
    'killed',
    'killer',
    'location',
    'match_info',
    'match',
    'me',
    'phase',
    'rank',
    'revived',
    'roster',
    'team'
];
exports.interestingFeatures = interestingFeatures;
const windowNames = {
    inGame: 'in_game',
    desktop: 'desktop'
};
exports.windowNames = windowNames;
const hotkeys = {
    toggle: 'showhide'
};
exports.hotkeys = hotkeys;


/***/ }),

/***/ "./src/init/initData.ts":
/*!******************************!*\
  !*** ./src/init/initData.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.testTalentsInfo = exports.testRaidBossList = exports.testKeyLevelList = exports.testRaidList = exports.testDungeonList = exports.testSpecsList = exports.testClassList = void 0;
exports.testClassList = [
    { id: "death-knight", text: "Death Knight" },
    { id: "demon-hunter", text: "Demon Hunter" },
    { id: "druid", text: "Druid" },
    { id: "hunter", text: "Hunter" },
    { id: "mage", text: "Mage" },
    { id: "monk", text: "Monk" },
    { id: "paladin", text: "Paladin" },
    { id: "priest", text: "Priest" },
    { id: "rogue", text: "Rogue" },
    { id: "shaman", text: "Shaman" },
    { id: "warlock", text: "Warlock" },
    { id: "warrior", text: "Warrior" },
];
exports.testSpecsList = [
    { id: "blood", text: "Blood" },
    { id: "frost", text: "Frost" },
    { id: "unholy", text: "Unholy" },
];
exports.testDungeonList = [
    { id: "de-other-side", text: "de other side" },
    { id: "halls-of-atonement", text: "halls of atonement" },
    { id: "mists-of-tirna-scithe", text: "mists of tirna scithe" },
    { id: "plaguefall", text: "plaguefall" },
    { id: "sanguine-depths", text: "sanguine depths" },
    { id: "spires-of-ascension", text: "spires of ascension" },
    { id: "the-necrotic-wake", text: "the necrotic wake" },
    { id: "theater-of-pain", text: "theater of pain" },
];
exports.testRaidList = [
    { id: "antorus-the-burning-throne", text: "Antorus, the Burning Throne" },
    { id: "battle-of-dazaralor", text: "Battle of Dazar'alor" },
    { id: "castle-nathria", text: "Castle Nathria" },
    { id: "crucible-of-storms", text: "Crucible of Storms" },
    { id: "nyaltha-the-waking-city", text: "Ny'altha, the Waking City" },
    { id: "the-emerald-nightmare", text: "The Emerald Nightmare" },
    { id: "the-eternal-palace", text: "The Eternal Palace" },
    { id: "the-nighthold", text: "The Nighthold" },
    { id: "tomb-of-sargeras", text: "Tomb of Sargeras" },
    { id: "trial-of-valor", text: "Trial of Valor" },
    { id: "uldir", text: "Uldir" },
];
exports.testKeyLevelList = [
    { id: "mythic", text: "Mythic" },
    { id: "heroic", text: "Heroic" },
    { id: "normal", text: "Normal" },
];
exports.testRaidBossList = [
    { id: "aggramar", text: "Aggramar" },
    { id: "antoran-high-command", text: "Antoran High Command" },
    { id: "argus-the-unmaker", text: "Argus the Unmaker" },
    { id: "eonar-the-life-binder", text: "Eonar the Life-Binder" },
    { id: "felhounds-of-sargeras", text: "Felhounds of Sargeras" },
    { id: "garothi-worldbreaker", text: "Garothi Worldbreaker" },
    { id: "imonar-the-soulhunter", text: "Imonar the Soulhunter" },
    { id: "kin'garoth", text: "Kin'garoth" },
    { id: "portal-keeper-hasabel", text: "Portal Keeper Hasabel" },
    { id: "the-coven-of-shivarra", text: "The Coven of Shivarra" },
    { id: "varimathras", text: "Varimathras" },
];
exports.testTalentsInfo = [
    {
        level: 15,
        talentItemList: [
            {
                name: "Heartbreaker",
                icon: "spell_deathknight_deathstrike.jpg",
                count: 2730,
                is_selected: false
            },
            {
                name: "Blooddrinker",
                icon: "ability_animusdraw.jpg",
                count: 400,
                is_selected: false
            },
            {
                name: "Tombstone",
                icon: "ability_fiegndead.jpg",
                count: 83,
                is_selected: false
            }
        ],
        is_selected: false
    },
    {
        level: 25,
        talentItemList: [
            {
                name: "Rapid Decomposition",
                icon: "ability_deathknight_deathsiphon2.jpg",
                count: 54,
                is_selected: false
            },
            {
                name: "Hemostasis",
                icon: "ability_deathwing_bloodcorruption_earth.jpg",
                count: 3144,
                is_selected: false
            },
            {
                name: "Consumption",
                icon: "inv_axe_2h_artifactmaw_d_01.jpg",
                count: 15,
                is_selected: false
            }
        ],
        is_selected: false
    },
    {
        level: 30,
        talentItemList: [
            {
                name: "Foul Bulwark",
                icon: "inv_armor_shield_naxxramas_d_02.jpg",
                count: 607,
                is_selected: false
            },
            {
                name: "Relish in Blood",
                icon: "ability_deathknight_roilingblood.jpg",
                count: 1613,
                is_selected: false
            },
            {
                name: "Blood Tap",
                icon: "spell_deathknight_bloodtap.jpg",
                count: 993,
                is_selected: false
            }
        ],
        is_selected: false
    },
    {
        level: 35,
        talentItemList: [
            {
                name: "Will of the Necropolis",
                icon: "achievement_boss_kelthuzad_01.jpg",
                count: 3113,
                is_selected: false
            },
            {
                name: "Anti-Magic Barrier",
                icon: "spell_shadow_antimagicshell.jpg",
                count: 92,
                is_selected: false
            },
            {
                name: "Mark of Blood",
                icon: "ability_hunter_rapidkilling.jpg",
                count: 8,
                is_selected: false
            }
        ],
        is_selected: false
    },
    {
        level: 40,
        talentItemList: [
            {
                name: "Grip of the Dead",
                icon: "ability_creature_disease_05.jpg",
                count: 2369,
                is_selected: false
            },
            {
                name: "Tightening Grasp",
                icon: "ability_deathknight_aoedeathgrip.jpg",
                count: 185,
                is_selected: false
            },
            {
                name: "Wraith Walk",
                icon: "inv_helm_plate_raiddeathknight_p_01.jpg",
                count: 659,
                is_selected: false
            }
        ],
        is_selected: false
    },
    {
        level: 45,
        talentItemList: [
            {
                name: "Voracious",
                icon: "ability_ironmaidens_whirlofblood.jpg",
                count: 1996,
                is_selected: false
            },
            {
                name: "Death Pact",
                icon: "spell_shadow_deathpact.jpg",
                count: 17,
                is_selected: false
            },
            {
                name: "Bloodworms",
                icon: "spell_shadow_soulleech.jpg",
                count: 1200,
                is_selected: false
            }
        ],
        is_selected: false
    },
    {
        level: 50,
        talentItemList: [
            {
                name: "Purgatory",
                icon: "inv_misc_shadowegg.jpg",
                count: 661,
                is_selected: false
            },
            {
                name: "Red Thirst",
                icon: "spell_deathknight_bloodpresence.jpg",
                count: 1669,
                is_selected: false
            },
            {
                name: "Bonestorm",
                icon: "achievement_boss_lordmarrowgar.jpg",
                count: 883,
                is_selected: false
            }
        ],
        is_selected: false
    }
];


/***/ }),

/***/ "./src/utils/api.ts":
/*!**************************!*\
  !*** ./src/utils/api.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteJournal = exports.editJournalContent = exports.deleteJournalContent = exports.storeJournalContent = exports.updateJournals = exports.storeJournals = exports.getJournals = exports.getCharacters = exports.getToken = exports.getTalentTableInfo = exports.getRaidBossList = exports.getRaidList = exports.getDungeonList = exports.getSpecList = exports.setAuthToken = void 0;
const axios_1 = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
const api = axios_1.default.create({
    baseURL: `https://wowme.gg/api`,
    headers: {
        "Content-Type": "application/json",
    },
});
const setAuthToken = (token) => {
    delete api.defaults.headers.common["x-auth-token"];
    if (token) {
        api.defaults.headers.common["x-auth-token"] = token;
    }
};
exports.setAuthToken = setAuthToken;
const getSpecList = async (class_name) => {
    try {
        const response = await api.get(`/get_spec_list`, {
            params: { class: class_name },
        });
        if (response.data.status === "success") {
            return response.data.specList;
        }
    }
    catch (e) {
        console.log(e);
    }
    return [];
};
exports.getSpecList = getSpecList;
const getDungeonList = async (min, max) => {
    try {
        const response = await api.get(`/get_dungeon_list`, {
            params: { min: min, max: max },
        });
        if (response.data.status === "success") {
            return response.data.dungeonList;
        }
    }
    catch (e) {
        console.log(e);
    }
    return [];
};
exports.getDungeonList = getDungeonList;
const getRaidList = async () => {
    try {
        const response = await api.get(`/get_raid_list`);
        if (response.data.status === "success") {
            return response.data.raidList;
        }
    }
    catch (e) {
        console.log(e);
    }
    return [];
};
exports.getRaidList = getRaidList;
const getRaidBossList = async (raid) => {
    try {
        const response = await api.get(`/get_raid_boss_list`, {
            params: { raid: raid },
        });
        if (response.data.status === "success") {
            return response.data.raidBossList;
        }
    }
    catch (e) {
        console.log(e);
    }
    return [];
};
exports.getRaidBossList = getRaidBossList;
const getTalentTableInfo = async (params) => {
    try {
        const response = await api.get(`/get_talent_table_info`, {
            params: params,
        });
        if (response.data.status === "success") {
            return {
                talentTableInfo: response.data.famousTalentInfo,
                logCount: response.data.logCount,
            };
        }
    }
    catch (e) {
        console.log(e);
    }
    return {
        talentTableInfo: [],
        logCount: 0,
    };
};
exports.getTalentTableInfo = getTalentTableInfo;
const getToken = async (params) => {
    try {
        const res = await api.post("/auth/bnet_token", params);
        if (res.data.success) {
            console.log(res.data);
            (0, exports.setAuthToken)(res.data.token);
            return res.data;
        }
        else {
            console.log(res.data);
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};
exports.getToken = getToken;
const getCharacters = async () => {
    try {
        const res = await api.post("/get_characters");
        if (res.data.success) {
            return res.data;
        }
        else {
            console.log(res.data);
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};
exports.getCharacters = getCharacters;
const getJournals = async () => {
    try {
        const res = await api.get("/journals");
        if (res.data.success) {
            return res.data;
        }
        else {
            console.log(res.data);
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};
exports.getJournals = getJournals;
const storeJournals = async (data) => {
    try {
        const res = await api.post("/journals", data);
        if (res.data.success) {
            return res.data;
        }
        else {
            console.log(res.data);
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};
exports.storeJournals = storeJournals;
const updateJournals = async (journelID, data) => {
    try {
        const res = await api.put(`/journals/${journelID}`, data);
        if (res.data.success) {
            return res.data;
        }
        else {
            console.log(res.data);
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};
exports.updateJournals = updateJournals;
const storeJournalContent = async (id, data) => {
    try {
        const res = await api.post(`/journals/${id}/content`, data);
        if (res.data.success) {
            return res.data;
        }
        else {
            console.log(res.data);
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};
exports.storeJournalContent = storeJournalContent;
const deleteJournalContent = async (journelID, contentID) => {
    try {
        const res = await api.delete(`/journals/${journelID}/content/${contentID}`);
        console.log(res);
        if (res.data.success) {
            console.log(res.data);
            return res.data;
        }
        else {
            console.log(res.data);
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};
exports.deleteJournalContent = deleteJournalContent;
const editJournalContent = async (journelID, contentID, data) => {
    try {
        const res = await api.put(`/journals/${journelID}/content/${contentID}`, data);
        console.log(res);
        if (res.data.success) {
            console.log(res.data);
            return res.data;
        }
        else {
            console.log(res.data);
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};
exports.editJournalContent = editJournalContent;
const deleteJournal = async (journelID) => {
    try {
        const res = await api.delete(`/journals/${journelID}`);
        console.log(res);
        if (res.data.success) {
            console.log(res.data);
            return res.data;
        }
        else {
            console.log(res.data);
        }
    }
    catch (e) {
        console.log(e);
    }
    return null;
};
exports.deleteJournal = deleteJournal;


/***/ }),

/***/ "./src/utils/characterInfo.ts":
/*!************************************!*\
  !*** ./src/utils/characterInfo.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const dropdown_1 = __webpack_require__(/*! ../components/dropdown */ "./src/components/dropdown.ts");
const convertCharactersToDropdownFormat = (characters) => {
    const result = [];
    for (const character of characters) {
        result.push({
            id: character.id,
            text: `${character.realm_name} - ${character.name}`
        });
    }
    return result;
};
class CharacterInfo {
    constructor(characters) {
        this.characters = [];
        this.characters = characters;
    }
    setElementInnerHTML(id, content) {
        const el = document.getElementById(id);
        el.innerHTML = content;
    }
    initDropDownEventListner(name) {
        document.getElementsByName(name).forEach(elem => {
            elem.addEventListener("click", (e) => {
                this.selectedCharacterID = e.target.getAttribute('id');
                console.log(this.selectedCharacterID);
                this.setCharacterInfoPanel();
            });
        });
    }
    setCharacterInfoPanel() {
        for (const character of this.characters) {
            if (character.id == this.selectedCharacterID) {
                this.setElementInnerHTML("total_number_deaths", `Total Number Deaths: ${character.total_number_deaths}`);
                this.setElementInnerHTML("total_gold_gained", `Total Gold Gained: ${character.total_gold_gained}`);
                this.setElementInnerHTML("total_gold_lost", `Total Gold Lost: ${character.total_gold_lost}`);
                this.setElementInnerHTML("total_item_value_gained", `Total Item Value Gained: ${character.total_item_value_gained}`);
                this.setElementInnerHTML("level_number_deaths", `Level Number Deaths: ${character.level_number_deaths}`);
                this.setElementInnerHTML("level_gold_gained", `Level Gold Gained: ${character.level_gold_gained}`);
                this.setElementInnerHTML("level_gold_lost", `Level Gold Lost: ${character.level_gold_lost}`);
                this.setElementInnerHTML("level_item_value_gained", `Level Item Value Gained: ${character.level_item_value_gained}`);
                break;
            }
        }
    }
    initDropdown() {
        const container = document.getElementById('character-select-box__container');
        container.innerHTML = '';
        const elDropdown = (0, dropdown_1.createCustomDropDown)({
            variableName: 'character',
            dropDownList: convertCharactersToDropdownFormat(this.characters)
        });
        container.appendChild(elDropdown);
        this.initDropDownEventListner('character');
        this.selectedCharacterID = this.characters.length > 0 ? this.characters[0].id : null;
        this.setCharacterInfoPanel();
    }
}
exports["default"] = CharacterInfo;


/***/ }),

/***/ "./src/utils/talentPicker.ts":
/*!***********************************!*\
  !*** ./src/utils/talentPicker.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const dropdown_1 = __webpack_require__(/*! ../components/dropdown */ "./src/components/dropdown.ts");
const talentsTable_1 = __webpack_require__(/*! ../components/talentsTable */ "./src/components/talentsTable.ts");
const initData_1 = __webpack_require__(/*! ../init/initData */ "./src/init/initData.ts");
const api_1 = __webpack_require__(/*! ./api */ "./src/utils/api.ts");
;
class TalentPicker {
    constructor() {
        this.searchCondition = {
            class: 'Demon Hunter',
            specs: 'Havoc',
            is_dungeon: true,
            raid_dungeon: 'Castle Nathria',
            key_level: 'Mythic',
            raid_boss: 'Shriekwing',
            key_stone_level_min: 1,
            key_stone_level_max: 45,
            advanced_filters: false,
            tree_mode: false
        };
        this.famousTalentInfo = initData_1.testTalentsInfo;
    }
    initComponents() {
        this.initDropdowns();
        this.initKeyStoneLevelRange();
        this.initSwitch();
        this.initTalentsTable(this.famousTalentInfo, 0);
        this.initInProgressEvent();
        this.initTreeModeActionPanelEvent();
    }
    initDropDownEventListner(name) {
        document.getElementsByName(name).forEach(elem => {
            elem.addEventListener("click", (e) => {
                this.searchCondition[name] = e.target.value;
                if (name === 'class') {
                    this.reloadSpecDropdown();
                }
                else if (name === 'raid_dungeon') {
                    if (this.searchCondition.is_dungeon) {
                        this.drawTalentTable();
                    }
                    else {
                        this.reloadRaidBossDropdown();
                    }
                }
                else {
                    this.drawTalentTable();
                }
            });
        });
    }
    initSelect(title, parent_id, dropdownList, variableName) {
        const container = document.getElementById(parent_id);
        container.innerHTML = '';
        const elTitle = document.createElement('label');
        elTitle.innerText = title;
        container.appendChild(elTitle);
        const elDropdown = (0, dropdown_1.createCustomDropDown)({
            variableName: variableName,
            dropDownList: dropdownList
        });
        container.appendChild(elDropdown);
        this.initDropDownEventListner(variableName);
        this.searchCondition[variableName] = dropdownList[0].text;
    }
    initDropdowns() {
        this.initSelect("Class", "class-select-box__container", initData_1.testClassList, 'class');
        this.initSelect("Specs", "specs-select-box__container", initData_1.testSpecsList, 'specs');
        this.initSelect("Dungeon List", "raid_dungeon-select-box__container", initData_1.testDungeonList, 'raid_dungeon');
        this.initSelect("Raid Level", "key_level-select-box__container", initData_1.testKeyLevelList, 'key_level');
    }
    async reloadSpecDropdown() {
        try {
            let specList = await (0, api_1.getSpecList)(this.searchCondition.class);
            specList = specList.length > 0 ? specList : initData_1.testSpecsList;
            this.initSelect("Specs", "specs-select-box__container", specList, 'specs');
            this.searchCondition.specs = specList[0].text;
            const animPanel = document.getElementById('talent-anim-panel');
            animPanel.classList.remove('fadeIn');
            if (!animPanel.classList.contains('fadeOut')) {
                animPanel.classList.add('fadeOut');
            }
            this.drawTalentTable();
        }
        catch (e) {
            console.log(e);
        }
    }
    async reloadRaidDungeonDropdown() {
        try {
            const animPanel = document.getElementById('talent-anim-panel');
            animPanel.classList.remove('fadeIn');
            if (!animPanel.classList.contains('fadeOut')) {
                animPanel.classList.add('fadeOut');
            }
            let raidDungeonList = [];
            if (this.searchCondition.is_dungeon) {
                raidDungeonList = await (0, api_1.getDungeonList)(this.searchCondition.key_stone_level_min, this.searchCondition.key_stone_level_max);
                raidDungeonList = raidDungeonList.length > 0 ? raidDungeonList : initData_1.testDungeonList;
            }
            else {
                raidDungeonList = await (0, api_1.getRaidList)();
                raidDungeonList = raidDungeonList.length > 0 ? raidDungeonList : initData_1.testRaidList;
            }
            this.initSelect(this.searchCondition.is_dungeon ? "Dungeon List" : "Raid List", "raid_dungeon-select-box__container", raidDungeonList, 'raid_dungeon');
            this.searchCondition.raid_dungeon = raidDungeonList[0].text;
            if (this.searchCondition.is_dungeon) {
                this.drawTalentTable();
            }
            else {
                this.reloadRaidBossDropdown();
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async reloadRaidBossDropdown() {
        const animPanel = document.getElementById('talent-anim-panel');
        animPanel.classList.remove('fadeIn');
        if (!animPanel.classList.contains('fadeOut')) {
            animPanel.classList.add('fadeOut');
        }
        let raidBossList = await (0, api_1.getRaidBossList)(this.searchCondition.raid_dungeon);
        raidBossList = raidBossList.length > 0 ? raidBossList : initData_1.testRaidBossList;
        this.initSelect("Raid Boss", "raid_boss-select-box__container", raidBossList, 'raid_boss');
        this.searchCondition.raid_boss = raidBossList[0].text;
        this.drawTalentTable();
    }
    async drawTalentTable(noAnim) {
        try {
            const animPanel = document.getElementById('talent-anim-panel');
            if (!noAnim && !animPanel.classList.contains('fadeOut')) {
                animPanel.classList.add('fadeOut');
            }
            const response = await (0, api_1.getTalentTableInfo)({
                class_name: this.searchCondition.class,
                spec: this.searchCondition.specs,
                type: this.searchCondition.is_dungeon ? 'dungeon' : 'raid',
                raid_dungeon: this.searchCondition.raid_dungeon,
                raid_boss: this.searchCondition.raid_boss,
                raid_level: this.searchCondition.key_level,
                dungeon_min_level: this.searchCondition.key_stone_level_min,
                dungeon_max_level: this.searchCondition.key_stone_level_max,
                tree_mode: this.searchCondition.tree_mode ? 'tree' : 'normal'
            });
            if (this.searchCondition.tree_mode) {
                this.famousTalentInfo = response.talentTableInfo.length > 0 ? response.talentTableInfo : [{ pick_rate: 0, talent_tree: initData_1.testTalentsInfo }];
                this.selectedTalentTreeIndex = 0;
                this.initTalentsTable(this.famousTalentInfo[0].talent_tree, response.logCount, 0, this.famousTalentInfo[0].pick_rate);
            }
            else {
                this.famousTalentInfo = response.talentTableInfo.length > 0 ? response.talentTableInfo : initData_1.testTalentsInfo;
                this.initTalentsTable(this.famousTalentInfo, response.logCount);
            }
            if (!noAnim) {
                animPanel.classList.remove('fadeOut');
                animPanel.classList.add('fadeIn');
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    initKeyStoneLevelRange() {
        const elemMin = document.getElementById("key-stone-level-min");
        const elemMax = document.getElementById("key-stone-level-max");
        const elemText = document.getElementById("key-stone-level-text");
        elemMin.value = `${this.searchCondition.key_stone_level_min}`;
        elemMax.value = `${this.searchCondition.key_stone_level_max}`;
        elemText.innerText = `${this.searchCondition.key_stone_level_min} - ${this.searchCondition.key_stone_level_max}`;
        elemMin.addEventListener("input", (e) => {
            let value = parseInt(e.target.value);
            if (value >= this.searchCondition.key_stone_level_max) {
                value = this.searchCondition.key_stone_level_max - 1;
                e.target.value = `${value}`;
            }
            this.searchCondition.key_stone_level_min = value;
            elemText.innerText = `${this.searchCondition.key_stone_level_min} - ${this.searchCondition.key_stone_level_max}`;
        });
        elemMin.addEventListener("mouseup", (e) => {
            this.drawTalentTable();
        });
        elemMax.addEventListener("input", (e) => {
            let value = parseInt(e.target.value);
            if (value <= this.searchCondition.key_stone_level_min) {
                value = this.searchCondition.key_stone_level_min + 1;
                e.target.value = `${value}`;
            }
            this.searchCondition.key_stone_level_max = value;
            elemText.innerText = `${this.searchCondition.key_stone_level_min} - ${this.searchCondition.key_stone_level_max}`;
        });
        elemMax.addEventListener("mouseup", (e) => {
            this.drawTalentTable();
        });
    }
    initTalentsTable(talentsInfo, logCount, tree_index, pick_rate) {
        const elTitle = document.getElementById("talent-panel-title");
        const elTreeActionPanel = document.getElementById("tree_mode_action_panel");
        if (this.searchCondition.tree_mode) {
            if (logCount > 0) {
                elTitle.innerText = `Most popular talent trees`;
            }
            else {
                elTitle.innerText = `We still don't have any runs scanned for this`;
            }
            const pickRate = document.getElementById("pick_rate");
            const treeIndex = document.getElementById("tree_index");
            if (!elTreeActionPanel.classList.contains('active')) {
                elTreeActionPanel.classList.add('active');
            }
            pickRate.innerText = `Pick Rate : ${pick_rate ? pick_rate : 0}%`;
            treeIndex.innerText = `${(tree_index ? tree_index : 0) + 1} / ${this.famousTalentInfo.length}`;
        }
        else {
            if (logCount > 0) {
                elTitle.innerText = `Most popular talent trees for ${this.searchCondition.specs} ${this.searchCondition.class} in ${this.searchCondition.raid_dungeon}`;
            }
            else {
                elTitle.innerText = `We still don't have any runs scanned for this`;
            }
            elTreeActionPanel.classList.remove('active');
        }
        const container = document.getElementById("talent-table-container");
        container.innerHTML = '';
        const talentsTable = (0, talentsTable_1.createTalentsTable)({ talentLevelList: talentsInfo }, this.searchCondition.tree_mode);
        container.appendChild(talentsTable);
    }
    initInProgressEvent() {
        const elements = document.getElementsByClassName('work-in-progress');
        const messagePanel = document.getElementById('message');
        for (const el of elements) {
            el.addEventListener('click', (e) => {
                const message = el.getAttribute("message");
                messagePanel.innerHTML = `<div>${message}</div>`;
                messagePanel.classList.remove('open');
                void messagePanel.offsetWidth;
                messagePanel.classList.add('open');
            });
        }
    }
    initTreeModeActionPanelEvent() {
        const elTreeMode = document.getElementById('tree_mode');
        elTreeMode.addEventListener('change', (e) => {
            if ((e.target).checked) {
                this.searchCondition.tree_mode = true;
            }
            else {
                this.searchCondition.tree_mode = false;
            }
            this.drawTalentTable();
        });
        const elPrevButton = document.getElementById("btn_prev");
        elPrevButton.addEventListener('click', (e) => {
            if (this.selectedTalentTreeIndex > 0) {
                const animPanel = document.getElementById('talent-anim-panel');
                animPanel.classList.remove('fadeIn');
                animPanel.classList.add('fadeOut');
                this.selectedTalentTreeIndex--;
                this.initTalentsTable(this.famousTalentInfo[this.selectedTalentTreeIndex].talent_tree, this.famousTalentInfo[this.selectedTalentTreeIndex].pick_rate, this.selectedTalentTreeIndex, this.famousTalentInfo[this.selectedTalentTreeIndex].pick_rate);
                animPanel.classList.remove('fadeOut');
                animPanel.classList.add('fadeIn');
            }
        });
        const elNextButton = document.getElementById("btn_next");
        elNextButton.addEventListener('click', (e) => {
            if (this.selectedTalentTreeIndex < this.famousTalentInfo.length - 1) {
                const animPanel = document.getElementById('talent-anim-panel');
                animPanel.classList.remove('fadeIn');
                animPanel.classList.add('fadeOut');
                this.selectedTalentTreeIndex++;
                this.initTalentsTable(this.famousTalentInfo[this.selectedTalentTreeIndex].talent_tree, this.famousTalentInfo[this.selectedTalentTreeIndex].pick_rate, this.selectedTalentTreeIndex, this.famousTalentInfo[this.selectedTalentTreeIndex].pick_rate);
                animPanel.classList.remove('fadeOut');
                animPanel.classList.add('fadeIn');
            }
        });
        const elRefreshButton = document.getElementById("btn_refresh");
        if (elRefreshButton) {
            elRefreshButton.addEventListener('click', (e) => {
                this.drawTalentTable();
            });
        }
    }
    setSwitchValue(is_dungeon) {
        const container = document.getElementById("raid_dungeon-switch__container");
        this.searchCondition.is_dungeon = is_dungeon;
        container.setAttribute('data', this.searchCondition.is_dungeon ? 'dungeon' : 'raid');
        this.reloadRaidDungeonDropdown();
        const ranger = document.getElementById("ranger__container");
        const raidLevel = document.getElementById("key_level-select-box__container");
        const raidBoss = document.getElementById("raid_boss-select-box__container");
        ranger.style.display = is_dungeon ? 'block' : 'none';
        raidLevel.style.display = is_dungeon ? 'none' : 'block';
        raidBoss.style.display = is_dungeon ? 'none' : 'block';
    }
    initSwitch() {
        this.setSwitchValue(true);
        const elSwitch = document.getElementById("raid_dungeon-switch");
        const elSwitchDungeon = document.getElementById("switch_dungeon");
        const elSwitchRaid = document.getElementById("switch_raid");
        elSwitch.addEventListener('click', () => {
            this.setSwitchValue(!this.searchCondition.is_dungeon);
        });
        elSwitchDungeon.addEventListener('click', () => {
            this.setSwitchValue(true);
        });
        elSwitchRaid.addEventListener('click', () => {
            this.setSwitchValue(false);
        });
    }
}
exports["default"] = TalentPicker;


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./src/desktop/desktop.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const AppWindow_1 = __webpack_require__(/*! ../AppWindow */ "./src/AppWindow.ts");
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
const consts_1 = __webpack_require__(/*! ../consts */ "./src/consts.ts");
const api_1 = __webpack_require__(/*! ../utils/api */ "./src/utils/api.ts");
const characterInfo_1 = __webpack_require__(/*! ../utils/characterInfo */ "./src/utils/characterInfo.ts");
const talentPicker_1 = __webpack_require__(/*! ../utils/talentPicker */ "./src/utils/talentPicker.ts");
const CLIENT_ID = "766b8aab7f3f4406a5d4844f5a0c6bd7";
const AUTHORIZE_ENDPOINT = "https://eu.battle.net/oauth/authorize";
const redirectUri = "https://wowme.gg/oauth/callback_overwolf";
const scope = ["wow.profile", "openid"];
const discordURL = "https://discord.gg/ryg9Czzr8Z";
class Desktop extends AppWindow_1.AppWindow {
    constructor() {
        super(consts_1.windowNames.desktop);
        this.isLoggedIn = false;
        const token = localStorage.getItem("token");
        const expiresIn = localStorage.getItem("expiresIn");
        if (token && parseInt(expiresIn) > Date.now()) {
            this.battleTag = localStorage.getItem("battleTag");
            this.region = localStorage.getItem("region");
            (0, api_1.setAuthToken)(token);
            this.getUserCharacterInfo();
        }
        else {
            localStorage.removeItem("token");
            localStorage.removeItem("expiresIn");
            localStorage.removeItem("battleTag");
            localStorage.removeItem("region");
        }
        this.initButtonEvents();
        overwolf.extensions.onAppLaunchTriggered.addListener(this.callbackOAuth);
        this.talentPicker = new talentPicker_1.default();
        this.talentPicker.initComponents();
        this.initSettingsPanel();
        this.getUserJournals();
        this.storeUserJournals();
        this.updateUserJournals();
        this.storeUserJournalContent();
        this.updateUserJournalContent();
    }
    setBattleTag(battleTag) {
        this.battleTag = battleTag;
    }
    setCharacters(characters) {
        this.characters = characters;
    }
    setRegion(region) {
        this.region = region;
    }
    initButtonEvents() {
        const loginButton = document.getElementById("btn-login");
        loginButton.addEventListener("click", (e) => {
            const scopesString = encodeURIComponent(scope.join(" "));
            const redirectUriString = encodeURIComponent(redirectUri);
            const authorizeUrl = `${AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&scope=${scopesString}&redirect_uri=${redirectUriString}&response_type=code`;
            overwolf.utils.openUrlInDefaultBrowser(authorizeUrl);
        });
        const menuItems = document.getElementsByClassName("menu-item");
        Array.from(menuItems).forEach((elem) => {
            elem.addEventListener("click", (e) => {
                if (elem.classList.contains("in-progress")) {
                    return;
                }
                else if (elem.id === "btn-logout") {
                    this.isLoggedIn = false;
                    localStorage.removeItem("expiresIn");
                    localStorage.removeItem("battleTag");
                    localStorage.removeItem("token");
                    localStorage.removeItem("region");
                    elem.classList.remove("enabled");
                    this.drawUserInfo();
                    this.drawSubPanel();
                    return;
                }
                Array.from(menuItems).forEach((elem1) => {
                    elem1.classList.remove("active");
                });
                elem.classList.add("active");
                const elMain = document.getElementById("main");
                elMain.className = elem.getAttribute("page-type");
            });
        });
        const discordButton = document.getElementById("discordButton");
        discordButton.addEventListener("click", (e) => {
            overwolf.utils.openUrlInDefaultBrowser(discordURL);
        });
    }
    async setCurrentHotkeyToInput() {
        const elInput = document.getElementById("hotkey-editor");
        const hotkeyText = await overwolf_api_ts_1.OWHotkeys.getHotkeyText(consts_1.hotkeys.toggle, consts_1.wowClassId);
        elInput.innerText = hotkeyText;
        return hotkeyText;
    }
    initHotkeyInput() {
        this.setCurrentHotkeyToInput();
        const elInput = document.getElementById("hotkey-editor");
        const elClose = document.getElementById("hotkey-close");
        let keys = ["", "", "", ""];
        elInput.addEventListener("focus", (e) => {
            elInput.innerText = "Choose Key";
            keys = ["", "", "", ""];
        });
        elInput.addEventListener("focusout", (e) => {
            this.setCurrentHotkeyToInput();
        });
        elInput.addEventListener("keydown", (e) => {
            console.log("keydown", e.key, e.metaKey, e.shiftKey, e.altKey, e.ctrlKey);
            e.preventDefault();
            if (e.key === "Shift") {
                keys[2] = "Shift+";
            }
            else if (e.key === "Alt") {
                keys[0] = "Alt+";
            }
            else if (e.key === "Control") {
                keys[1] = "Ctrl+";
            }
            else {
                keys[3] = e.key;
                const newHotkey = {
                    name: consts_1.hotkeys.toggle,
                    gameId: 765,
                    virtualKey: e.keyCode,
                    modifiers: {
                        ctrl: e.ctrlKey,
                        shift: e.shiftKey,
                        alt: e.altKey,
                    },
                };
                elClose.focus();
                overwolf.settings.hotkeys.assign(newHotkey, (e) => {
                    console.log("assign: ", newHotkey, e);
                    this.setCurrentHotkeyToInput();
                });
            }
            elInput.innerText = keys.join("");
        });
        elInput.addEventListener("keyup", (e) => {
            e.preventDefault();
            console.log("keyup", e.key, e.metaKey, e.shiftKey, e.altKey, e.ctrlKey);
            if (e.key === "Shift") {
                keys[2] = "";
            }
            else if (e.key === "Alt") {
                keys[0] = "";
            }
            else if (e.key === "Control") {
                keys[1] = "";
            }
            const strHotkey = keys.join("");
            elInput.innerText = strHotkey === "" ? "Choose Key" : strHotkey;
        });
        elClose.addEventListener("click", (e) => {
            const hotkey = {
                name: consts_1.hotkeys.toggle,
                gameId: 765,
            };
            overwolf.settings.hotkeys.unassign(hotkey, (e) => {
                this.setCurrentHotkeyToInput();
            });
        });
    }
    initSettingsPanel() {
        this.initHotkeyInput();
        const btnCopy = document.getElementById("btn-copy-social-url");
        btnCopy.addEventListener("click", (e) => {
            const elSocialUrl = (document.getElementById("input-social-url"));
            elSocialUrl.focus();
            elSocialUrl.select();
            document.execCommand("copy");
            elSocialUrl.selectionStart = 0;
            elSocialUrl.selectionEnd = 0;
            btnCopy.focus();
            btnCopy.classList.remove("copied");
            void btnCopy.offsetWidth;
            btnCopy.classList.add("copied");
        });
        const elSwitchGameStart = document.getElementById("auto-launch-when-game-starts");
        let switchValueGameStart = localStorage.getItem("auto-launch-when-game-starts");
        if (switchValueGameStart !== "false") {
            switchValueGameStart = "true";
            localStorage.setItem("auto-launch-when-game-starts", switchValueGameStart);
            elSwitchGameStart.setAttribute("data", "Yes");
        }
        elSwitchGameStart.addEventListener("click", (e) => {
            switchValueGameStart = localStorage.getItem("auto-launch-when-game-starts");
            if (switchValueGameStart === "true") {
                switchValueGameStart = "false";
                elSwitchGameStart.setAttribute("data", "");
            }
            else {
                switchValueGameStart = "true";
                elSwitchGameStart.setAttribute("data", "Yes");
            }
            localStorage.setItem("auto-launch-when-game-starts", switchValueGameStart);
        });
        const elSwitchGameEnd = document.getElementById("show-app-when-game-ends");
        let switchValueGameEnd = localStorage.getItem("show-app-when-game-ends");
        if (switchValueGameEnd !== "false") {
            switchValueGameEnd = "true";
            localStorage.setItem("show-app-when-game-ends", switchValueGameEnd);
            elSwitchGameEnd.setAttribute("data", "Yes");
        }
        elSwitchGameEnd.addEventListener("click", (e) => {
            switchValueGameEnd = localStorage.getItem("show-app-when-game-ends");
            if (switchValueGameEnd === "true") {
                switchValueGameEnd = "false";
                elSwitchGameEnd.setAttribute("data", "");
            }
            else {
                switchValueGameEnd = "true";
                elSwitchGameEnd.setAttribute("data", "Yes");
            }
            localStorage.setItem("show-app-when-game-ends", switchValueGameEnd);
        });
    }
    async callbackOAuth(urlscheme) {
        const overlay = document.getElementById("loading-overlay");
        overlay.classList.add("active");
        const url = new URL(decodeURIComponent(urlscheme.parameter));
        const code = url.searchParams.get("code");
        try {
            const userInfo = await (0, api_1.getToken)({ code, isOverwolf: true });
            const token = userInfo.token;
            const expiresIn = Date.now() + userInfo.expiresIn * 1000;
            const desktop = Desktop.instance();
            desktop.setBattleTag(userInfo.battleTag);
            desktop.setCharacters(userInfo.characters);
            desktop.setRegion(userInfo.region);
            localStorage.setItem("token", token);
            localStorage.setItem("expiresIn", expiresIn.toString());
            localStorage.setItem("battleTag", userInfo.battleTag);
            localStorage.setItem("region", userInfo.region);
            desktop.onLoggedIn();
        }
        catch (e) {
            console.log(e);
        }
        overlay.classList.remove("active");
    }
    async getUserCharacterInfo() {
        const overlay = document.getElementById("loading-overlay");
        overlay.classList.add("active");
        const response = await (0, api_1.getCharacters)();
        this.region = response.region;
        this.characters = response.characters;
        console.log(this.characters);
        localStorage.setItem("region", this.region);
        this.onLoggedIn();
        overlay.classList.remove("active");
    }
    async getUserJournals() {
        let response = await (0, api_1.getJournals)();
        const journalList = document.getElementById("journal-tabs");
        for (let i = 0; i < (response === null || response === void 0 ? void 0 : response.data.length); i++) {
            console.log("loop started", i);
            const btn = document.createElement("div");
            btn.innerHTML = response.data[i].name;
            btn.setAttribute("data-id", response.data[i]._id);
            btn.classList.add("tab-link");
            let deleteSpan = document.createElement("span");
            deleteSpan.classList.add("material-icons");
            deleteSpan.classList.add("textSpan2");
            deleteSpan.innerHTML = "delete";
            journalList.appendChild(btn);
            btn.appendChild(deleteSpan);
            var editJournel = document.createElement("span");
            editJournel.classList.add("material-icons");
            editJournel.classList.add("editSpan2");
            editJournel.innerHTML = "edit";
            btn.appendChild(editJournel);
            editJournel.addEventListener("click", (e) => {
                const target = e.target;
                e.stopPropagation();
                let elems = document.querySelector(".edit-journel");
                if (elems !== null) {
                    elems.classList.remove("edit-journel");
                }
                target.parentElement.classList.add("edit-journel");
                const editModalOpenButton = document.getElementById("myBtnEdit");
                editModalOpenButton.click();
                console.log("clicked", response.data[i].name);
                document.getElementById("myInput2").value = response.data[i].name;
                console.log("object", response.data[i]);
                const cb = document.getElementById("accept");
                cb.value = response.data[i].template;
            });
            deleteSpan.addEventListener("click", (e) => {
                e.stopPropagation();
                (0, api_1.deleteJournal)(response.data[i]._id);
                const oldJournalList = document.getElementById('journal-tabs');
                oldJournalList.innerHTML = '';
                response.data = [];
                this.getUserJournals();
                const journalContainer = document.getElementById("journal-item-container");
                journalContainer.innerHTML = "";
            });
            btn.addEventListener("click", function (e) {
                const target = e.target;
                const id = this.getAttribute("data-id");
                let elems = document.querySelector(".active-tab");
                if (elems !== null) {
                    elems.classList.remove("active-tab");
                }
                target.classList.add("active-tab");
                const selectedJournal = response.data[i];
                console.log("response data", response.data);
                console.log(i, selectedJournal);
                const journalContainer = document.getElementById("journal-item-container");
                journalContainer.innerHTML = "";
                selectedJournal.data.forEach((element) => {
                    const journalItem = document.createElement("div");
                    journalItem.setAttribute("data-id", element._id);
                    journalItem.classList.add("journal-item");
                    const journalBtn = document.createElement("div");
                    journalBtn.innerHTML = element.title;
                    var textSpan = document.createElement("span");
                    textSpan.classList.add("material-icons");
                    textSpan.classList.add("textSpan");
                    textSpan.innerHTML = "delete";
                    journalBtn.appendChild(textSpan);
                    const journalDesc = document.createElement("p");
                    var editSpan = document.createElement("span");
                    editSpan.classList.add("material-icons");
                    editSpan.classList.add("editSpan");
                    editSpan.innerHTML = "edit";
                    journalBtn.appendChild(editSpan);
                    journalBtn.classList.add("accordion");
                    if (journalDesc.classList.contains("active")) {
                        journalDesc.classList.remove("active");
                        journalDesc.innerHTML = "";
                    }
                    else {
                        journalDesc.innerHTML = element.description;
                        journalDesc.classList.add("active");
                    }
                    journalBtn.addEventListener("click", function () {
                        if (journalDesc.classList.contains("active")) {
                            journalDesc.classList.remove("active");
                            journalDesc.innerHTML = "";
                        }
                        else {
                            journalDesc.innerHTML = element.description;
                            journalDesc.classList.add("active");
                        }
                    });
                    editSpan.addEventListener("click", (e) => {
                        const target = e.target;
                        let elems = document.querySelector(".active-content");
                        if (elems !== null) {
                            elems.classList.remove("active-content");
                        }
                        target.parentElement.parentElement.classList.add("active-content");
                        const modalOpenButton = document.getElementById("editContentButton");
                        modalOpenButton.click();
                        document.getElementById("editContentTitle").value = element.title;
                        document.querySelector(".editEditor").innerHTML = element.description;
                    });
                    textSpan.addEventListener("click", () => {
                        let elems = document.querySelector(".active-tab");
                        let dataID = elems.getAttribute('data-id');
                        (0, api_1.deleteJournalContent)(dataID, element._id);
                        let item = document.querySelector(`[data-id="${element._id}"]`);
                        item.remove();
                        let content = response.data[i].data;
                        content = content.filter((con) => con._id != element._id);
                        response.data[i].data = content;
                    });
                    journalItem.appendChild(journalBtn);
                    if (element.description) {
                        journalItem.appendChild(journalDesc);
                    }
                    journalContainer.appendChild(journalItem);
                });
            });
        }
    }
    async storeUserJournals() {
        const saveButton = document.getElementById("saveButton");
        saveButton.addEventListener("click", async (e) => {
            e.preventDefault();
            let inputVal = document.getElementById("myInput").value;
            const cb = document.getElementById("accept");
            const data = {
                battleId: "a232df3dfafa213",
                name: inputVal,
            };
            console.log(data);
            const response = await (0, api_1.storeJournals)(data);
            if (response.success) {
                const journalList = document.getElementById("journal-tabs");
                journalList.innerHTML = '';
                await this.getUserJournals();
                let bttnn2 = document.querySelector(`[data-id="${response.data._id}"]`);
                if (bttnn2) {
                    bttnn2.click();
                }
                document.getElementById("myInput").value = "";
                document.querySelector(".close").click();
            }
        });
    }
    async updateUserJournals() {
        const saveButtonEdit = document.getElementById("myModal2Save");
        saveButtonEdit.addEventListener("click", async (e) => {
            e.preventDefault();
            let inputVal = document.getElementById("myInput2").value;
            const cb = document.getElementById("accept");
            let content = document.querySelector(".edit-journel");
            const contentID = content.getAttribute("data-id");
            const data = {
                battleId: "a232df3dfafa213",
                name: inputVal,
            };
            const response = await (0, api_1.updateJournals)(contentID, data);
            if (response.success) {
                const journalList = document.getElementById("journal-tabs");
                journalList.innerHTML = '';
                await this.getUserJournals();
                let bttnn2 = document.querySelector(`[data-id="${response.data._id}"]`);
                if (bttnn2) {
                    bttnn2.click();
                }
                document.getElementById("myInput2").value = "";
                document.querySelector(".myModal2Close").click();
            }
        });
    }
    async storeUserJournalContent() {
        const saveContentButton = document.getElementById("contentsaveButton");
        saveContentButton.addEventListener("click", async (e) => {
            e.preventDefault();
            let elems = document.querySelector(".active-tab");
            const id = elems.getAttribute("data-id");
            let contentTitle = document.getElementById("contentTitle").value;
            const htmlFile = document.querySelector(".editor").innerHTML;
            let data = {
                title: contentTitle,
                description: htmlFile
            };
            const response = await (0, api_1.storeJournalContent)(id, data);
            if (response.success) {
                const journalList = document.getElementById("journal-tabs");
                journalList.innerHTML = '';
                await this.getUserJournals();
                let bttnn = document.querySelector(`[data-id="${id}"]`);
                if (bttnn) {
                    bttnn.click();
                }
                document.getElementById("contentTitle").value = "";
                document.querySelector(".editor").innerHTML = "";
            }
            document.querySelector(".ContentModalClose").click();
        });
    }
    async updateUserJournalContent() {
        const saveContentButton2 = document.getElementById("contentsaveButton2");
        saveContentButton2.addEventListener("click", async (e) => {
            e.preventDefault();
            let elems = document.querySelector(".active-tab");
            const id = elems.getAttribute("data-id");
            let content = document.querySelector(".active-content");
            const contentID = content.getAttribute("data-id");
            let contentTitle = document.getElementById("editContentTitle").value;
            const htmlFile = document.querySelector(".editEditor").innerHTML;
            let data = {
                title: contentTitle,
                description: htmlFile
            };
            const response = await (0, api_1.editJournalContent)(id, contentID, data);
            if (response.success) {
                const journalList = document.getElementById("journal-tabs");
                journalList.innerHTML = '';
                await this.getUserJournals();
                let bttnn = document.querySelector(`[data-id="${id}"]`);
                if (bttnn) {
                    bttnn.click();
                }
                document.getElementById("editContentTitle").value = "";
                document.querySelector(".editEditor").innerHTML = "";
            }
            document.querySelector(".editContentModalClose").click();
        });
    }
    onLoggedIn() {
        this.isLoggedIn = true;
        const elBtnLogout = document.getElementById("btn-logout");
        elBtnLogout.classList.add("enabled");
        this.drawUserInfo();
        this.drawSubPanel();
    }
    drawUserInfo() {
        const elUserInfo = document.getElementById("user-info");
        elUserInfo.classList.remove("active");
        if (this.isLoggedIn) {
            elUserInfo.classList.add("active");
            const elBattleTag = document.getElementById("battle-tag");
            elBattleTag.innerHTML = this.battleTag;
        }
    }
    drawSubPanel() {
        const elSubPanel = document.getElementById("sub-panel");
        elSubPanel.classList.remove("logged-in");
        if (this.isLoggedIn) {
            elSubPanel.classList.add("logged-in");
            this.characterInfo = new characterInfo_1.default(this.characters);
            this.characterInfo.initDropdown();
        }
    }
    static instance() {
        if (!this._instance) {
            this._instance = new Desktop();
        }
        return this._instance;
    }
}
Desktop.instance();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsUUFBUTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7U0FDaEM7UUFFRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztDQUNGO0FBRUQsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWUtbGlzdGVuZXIuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy1ldmVudHMuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWhvdGtleXMuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LXdpbmRvdy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L3RpbWVyLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9pbmRleC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2F4aW9zLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9pc0NhbmNlbC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3MuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvYnVpbGRGdWxsUGF0aC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvY3JlYXRlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZW5oYW5jZUVycm9yLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9tZXJnZUNvbmZpZy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2J1aWxkVVJMLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb21iaW5lVVJMcy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNBeGlvc0Vycm9yLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3BhcnNlSGVhZGVycy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy92YWxpZGF0b3IuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvQXBwV2luZG93LnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9jb21wb25lbnRzL2Ryb3Bkb3duLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9jb21wb25lbnRzL3RhbGVudHNUYWJsZS50cyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvY29uc3RzLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9pbml0L2luaXREYXRhLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy91dGlscy9hcGkudHMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL3V0aWxzL2NoYXJhY3RlckluZm8udHMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL3V0aWxzL3RhbGVudFBpY2tlci50cyIsIndlYnBhY2s6Ly93b3cubWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL2Rlc2t0b3AvZGVza3RvcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWUtbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZXMtZXZlbnRzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWVzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWhvdGtleXNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctd2luZG93XCIpLCBleHBvcnRzKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IHZvaWQgMDtcclxuY29uc3Qgb3dfbGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL293LWxpc3RlbmVyXCIpO1xyXG5jbGFzcyBPV0dhbWVMaXN0ZW5lciBleHRlbmRzIG93X2xpc3RlbmVyXzEuT1dMaXN0ZW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSkge1xyXG4gICAgICAgIHN1cGVyKGRlbGVnYXRlKTtcclxuICAgICAgICB0aGlzLm9uR2FtZUluZm9VcGRhdGVkID0gKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZSB8fCAhdXBkYXRlLmdhbWVJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF1cGRhdGUucnVubmluZ0NoYW5nZWQgJiYgIXVwZGF0ZS5nYW1lQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1cGRhdGUuZ2FtZUluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQodXBkYXRlLmdhbWVJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZUVuZGVkKHVwZGF0ZS5nYW1lSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25SdW5uaW5nR2FtZUluZm8gPSAoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWluZm8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5mby5pc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZChpbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLm9uR2FtZUluZm9VcGRhdGVkLmFkZExpc3RlbmVyKHRoaXMub25HYW1lSW5mb1VwZGF0ZWQpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbyh0aGlzLm9uUnVubmluZ0dhbWVJbmZvKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMub25HYW1lSW5mb1VwZGF0ZWQucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkdhbWVJbmZvVXBkYXRlZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IE9XR2FtZUxpc3RlbmVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSB2b2lkIDA7XHJcbmNvbnN0IHRpbWVyXzEgPSByZXF1aXJlKFwiLi90aW1lclwiKTtcclxuY2xhc3MgT1dHYW1lc0V2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSwgcmVxdWlyZWRGZWF0dXJlcywgZmVhdHVyZVJldHJpZXMgPSAxMCkge1xyXG4gICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyA9IChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uSW5mb1VwZGF0ZXMoaW5mby5pbmZvKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25OZXdFdmVudHMgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbk5ld0V2ZW50cyhlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICAgICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcyA9IHJlcXVpcmVkRmVhdHVyZXM7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZVJldHJpZXMgPSBmZWF0dXJlUmV0cmllcztcclxuICAgIH1cclxuICAgIGFzeW5jIGdldEluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5nZXRJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc2V0UmVxdWlyZWRGZWF0dXJlcygpIHtcclxuICAgICAgICBsZXQgdHJpZXMgPSAxLCByZXN1bHQ7XHJcbiAgICAgICAgd2hpbGUgKHRyaWVzIDw9IHRoaXMuX2ZlYXR1cmVSZXRyaWVzKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLnNldFJlcXVpcmVkRmVhdHVyZXModGhpcy5fcmVxdWlyZWRGZWF0dXJlcywgcmVzb2x2ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBzdWNjZXNzOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHJlc3VsdC5zdXBwb3J0ZWRGZWF0dXJlcy5sZW5ndGggPiAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhd2FpdCB0aW1lcl8xLlRpbWVyLndhaXQoMzAwMCk7XHJcbiAgICAgICAgICAgIHRyaWVzKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUud2Fybignc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBmYWlsdXJlIGFmdGVyICcgKyB0cmllcyArICcgdHJpZXMnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uSW5mb1VwZGF0ZXMyLmFkZExpc3RlbmVyKHRoaXMub25JbmZvVXBkYXRlcyk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uTmV3RXZlbnRzLmFkZExpc3RlbmVyKHRoaXMub25OZXdFdmVudHMpO1xyXG4gICAgfVxyXG4gICAgdW5SZWdpc3RlckV2ZW50cygpIHtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25JbmZvVXBkYXRlczIucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkluZm9VcGRhdGVzKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25OZXdFdmVudHMucmVtb3ZlTGlzdGVuZXIodGhpcy5vbk5ld0V2ZW50cyk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzdGFydCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW293LWdhbWUtZXZlbnRzXSBTVEFSVGApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnNldFJlcXVpcmVkRmVhdHVyZXMoKTtcclxuICAgICAgICBjb25zdCB7IHJlcywgc3RhdHVzIH0gPSBhd2FpdCB0aGlzLmdldEluZm8oKTtcclxuICAgICAgICBpZiAocmVzICYmIHN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyh7IGluZm86IHJlcyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbb3ctZ2FtZS1ldmVudHNdIFNUT1BgKTtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSBPV0dhbWVzRXZlbnRzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXMgPSB2b2lkIDA7XHJcbmNsYXNzIE9XR2FtZXMge1xyXG4gICAgc3RhdGljIGdldFJ1bm5pbmdHYW1lSW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UnVubmluZ0dhbWVJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGNsYXNzSWRGcm9tR2FtZUlkKGdhbWVJZCkge1xyXG4gICAgICAgIGxldCBjbGFzc0lkID0gTWF0aC5mbG9vcihnYW1lSWQgLyAxMCk7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzSWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcyhsaW1pdCA9IDMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKGxpbWl0LCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQuZ2FtZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRHYW1lREJJbmZvKGdhbWVDbGFzc0lkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldEdhbWVEQkluZm8oZ2FtZUNsYXNzSWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lcyA9IE9XR2FtZXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gdm9pZCAwO1xyXG5jbGFzcyBPV0hvdGtleXMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHN0YXRpYyBnZXRIb3RrZXlUZXh0KGhvdGtleUlkLCBnYW1lSWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMuZ2V0KHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhvdGtleTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZUlkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nbG9iYWxzLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQuZ2FtZXMgJiYgcmVzdWx0LmdhbWVzW2dhbWVJZF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nYW1lc1tnYW1lSWRdLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaG90a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShob3RrZXkuYmluZGluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCdVTkFTU0lHTkVEJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG9uSG90a2V5RG93bihob3RrZXlJZCwgYWN0aW9uKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5vblByZXNzZWQuYWRkTGlzdGVuZXIoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5uYW1lID09PSBob3RrZXlJZClcclxuICAgICAgICAgICAgICAgIGFjdGlvbihyZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gT1dIb3RrZXlzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XTGlzdGVuZXIgPSB2b2lkIDA7XHJcbmNsYXNzIE9XTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUpIHtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0xpc3RlbmVyID0gT1dMaXN0ZW5lcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV1dpbmRvdyA9IHZvaWQgMDtcclxuY2xhc3MgT1dXaW5kb3cge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLl9pZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBhc3luYyByZXN0b3JlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5yZXN0b3JlKGlkLCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuc3VjY2VzcylcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbcmVzdG9yZV0gLSBhbiBlcnJvciBvY2N1cnJlZCwgd2luZG93SWQ9JHtpZH0sIHJlYXNvbj0ke3Jlc3VsdC5lcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtaW5pbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWluaW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtYXhpbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWF4aW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBoaWRlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5oaWRlKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgY2xvc2UoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmdldFdpbmRvd1N0YXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJlxyXG4gICAgICAgICAgICAgICAgKHJlc3VsdC53aW5kb3dfc3RhdGUgIT09ICdjbG9zZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5pbnRlcm5hbENsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRyYWdNb3ZlKGVsZW0pIHtcclxuICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lICsgJyBkcmFnZ2FibGUnO1xyXG4gICAgICAgIGVsZW0ub25tb3VzZWRvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmRyYWdNb3ZlKHRoaXMuX25hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRXaW5kb3dTdGF0ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0V2luZG93U3RhdGUoaWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldEN1cnJlbnRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3cocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LndpbmRvdyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb2J0YWluKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNiID0gcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIgJiYgcmVzLndpbmRvdyAmJiByZXMud2luZG93LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSByZXMud2luZG93LmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lID0gcmVzLndpbmRvdy5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcy53aW5kb3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0Q3VycmVudFdpbmRvdyhjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm9idGFpbkRlY2xhcmVkV2luZG93KHRoaXMuX25hbWUsIGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgYXNzdXJlT2J0YWluZWQoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0Lm9idGFpbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaW50ZXJuYWxDbG9zZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5jbG9zZShpZCwgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XV2luZG93ID0gT1dXaW5kb3c7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVGltZXIgPSB2b2lkIDA7XHJcbmNsYXNzIFRpbWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlLCBpZCkge1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGltZXJFdmVudCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uVGltZXIodGhpcy5faWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIHdhaXQoaW50ZXJ2YWxJbk1TKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGludGVydmFsSW5NUyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGFydChpbnRlcnZhbEluTVMpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gc2V0VGltZW91dCh0aGlzLmhhbmRsZVRpbWVyRXZlbnQsIGludGVydmFsSW5NUyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90aW1lcklkID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXJJZCk7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UaW1lciA9IFRpbWVyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcbiAgICB2YXIgcmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgZnVuY3Rpb24gb25sb2FkZW5kKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIXJlc3BvbnNlVHlwZSB8fCByZXNwb25zZVR5cGUgPT09ICd0ZXh0JyB8fCAgcmVzcG9uc2VUeXBlID09PSAnanNvbicgP1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICgnb25sb2FkZW5kJyBpbiByZXF1ZXN0KSB7XG4gICAgICAvLyBVc2Ugb25sb2FkZW5kIGlmIGF2YWlsYWJsZVxuICAgICAgcmVxdWVzdC5vbmxvYWRlbmQgPSBvbmxvYWRlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGUgdG8gZW11bGF0ZSBvbmxvYWRlbmRcbiAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWFkeXN0YXRlIGhhbmRsZXIgaXMgY2FsbGluZyBiZWZvcmUgb25lcnJvciBvciBvbnRpbWVvdXQgaGFuZGxlcnMsXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCBjYWxsIG9ubG9hZGVuZCBvbiB0aGUgbmV4dCAndGljaydcbiAgICAgICAgc2V0VGltZW91dChvbmxvYWRlbmQpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSAndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICBjb25maWcudHJhbnNpdGlvbmFsICYmIGNvbmZpZy50cmFuc2l0aW9uYWwuY2xhcmlmeVRpbWVvdXRFcnJvciA/ICdFVElNRURPVVQnIDogJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAocmVzcG9uc2VUeXBlICYmIHJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXF1ZXN0RGF0YSkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBBeGlvcyA9IHJlcXVpcmUoJy4vY29yZS9BeGlvcycpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9jb3JlL21lcmdlQ29uZmlnJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGF4aW9zLmRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTtcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxuLy8gRXhwb3NlIGlzQXhpb3NFcnJvclxuYXhpb3MuaXNBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzQXhpb3NFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdmFsaWRhdG9yJyk7XG5cbnZhciB2YWxpZGF0b3JzID0gdmFsaWRhdG9yLnZhbGlkYXRvcnM7XG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuICAgIGNvbmZpZy51cmwgPSBhcmd1bWVudHNbMF07XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICB9XG5cbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblxuICAvLyBTZXQgY29uZmlnLm1ldGhvZFxuICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0cy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gdGhpcy5kZWZhdWx0cy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcubWV0aG9kID0gJ2dldCc7XG4gIH1cblxuICB2YXIgdHJhbnNpdGlvbmFsID0gY29uZmlnLnRyYW5zaXRpb25hbDtcblxuICBpZiAodHJhbnNpdGlvbmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YWxpZGF0b3IuYXNzZXJ0T3B0aW9ucyh0cmFuc2l0aW9uYWwsIHtcbiAgICAgIHNpbGVudEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4sICcxLjAuMCcpLFxuICAgICAgZm9yY2VkSlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiwgJzEuMC4wJyksXG4gICAgICBjbGFyaWZ5VGltZW91dEVycm9yOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4sICcxLjAuMCcpXG4gICAgfSwgZmFsc2UpO1xuICB9XG5cbiAgLy8gZmlsdGVyIG91dCBza2lwcGVkIGludGVyY2VwdG9yc1xuICB2YXIgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgdmFyIHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyA9IHRydWU7XG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGlmICh0eXBlb2YgaW50ZXJjZXB0b3IucnVuV2hlbiA9PT0gJ2Z1bmN0aW9uJyAmJiBpbnRlcmNlcHRvci5ydW5XaGVuKGNvbmZpZykgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzICYmIGludGVyY2VwdG9yLnN5bmNocm9ub3VzO1xuXG4gICAgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB2YXIgcHJvbWlzZTtcblxuICBpZiAoIXN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycykge1xuICAgIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG5cbiAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShjaGFpbiwgcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4pO1xuICAgIGNoYWluID0gY2hhaW4uY29uY2F0KHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbik7XG5cbiAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG4gICAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG5cbiAgdmFyIG5ld0NvbmZpZyA9IGNvbmZpZztcbiAgd2hpbGUgKHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLmxlbmd0aCkge1xuICAgIHZhciBvbkZ1bGZpbGxlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCk7XG4gICAgdmFyIG9uUmVqZWN0ZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpO1xuICAgIHRyeSB7XG4gICAgICBuZXdDb25maWcgPSBvbkZ1bGZpbGxlZChuZXdDb25maWcpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBvblJlamVjdGVkKGVycm9yKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgcHJvbWlzZSA9IGRpc3BhdGNoUmVxdWVzdChuZXdDb25maWcpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gIH1cblxuICB3aGlsZSAocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4ocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCksIHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuQXhpb3MucHJvdG90eXBlLmdldFVyaSA9IGZ1bmN0aW9uIGdldFVyaShjb25maWcpIHtcbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgcmV0dXJuIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKS5yZXBsYWNlKC9eXFw/LywgJycpO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkLCBvcHRpb25zKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkLFxuICAgIHN5bmNocm9ub3VzOiBvcHRpb25zID8gb3B0aW9ucy5zeW5jaHJvbm91cyA6IGZhbHNlLFxuICAgIHJ1bldoZW46IG9wdGlvbnMgPyBvcHRpb25zLnJ1bldoZW4gOiBudWxsXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4vZW5oYW5jZUVycm9yJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgIGNvbmZpZyxcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1xuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgY29uZmlnLFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cblxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgZXJyb3IuaXNBeGlvc0Vycm9yID0gdHJ1ZTtcblxuICBlcnJvci50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBjb2RlOiB0aGlzLmNvZGVcbiAgICB9O1xuICB9O1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIHZhciB2YWx1ZUZyb21Db25maWcyS2V5cyA9IFsndXJsJywgJ21ldGhvZCcsICdkYXRhJ107XG4gIHZhciBtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cyA9IFsnaGVhZGVycycsICdhdXRoJywgJ3Byb3h5JywgJ3BhcmFtcyddO1xuICB2YXIgZGVmYXVsdFRvQ29uZmlnMktleXMgPSBbXG4gICAgJ2Jhc2VVUkwnLCAndHJhbnNmb3JtUmVxdWVzdCcsICd0cmFuc2Zvcm1SZXNwb25zZScsICdwYXJhbXNTZXJpYWxpemVyJyxcbiAgICAndGltZW91dCcsICd0aW1lb3V0TWVzc2FnZScsICd3aXRoQ3JlZGVudGlhbHMnLCAnYWRhcHRlcicsICdyZXNwb25zZVR5cGUnLCAneHNyZkNvb2tpZU5hbWUnLFxuICAgICd4c3JmSGVhZGVyTmFtZScsICdvblVwbG9hZFByb2dyZXNzJywgJ29uRG93bmxvYWRQcm9ncmVzcycsICdkZWNvbXByZXNzJyxcbiAgICAnbWF4Q29udGVudExlbmd0aCcsICdtYXhCb2R5TGVuZ3RoJywgJ21heFJlZGlyZWN0cycsICd0cmFuc3BvcnQnLCAnaHR0cEFnZW50JyxcbiAgICAnaHR0cHNBZ2VudCcsICdjYW5jZWxUb2tlbicsICdzb2NrZXRQYXRoJywgJ3Jlc3BvbnNlRW5jb2RpbmcnXG4gIF07XG4gIHZhciBkaXJlY3RNZXJnZUtleXMgPSBbJ3ZhbGlkYXRlU3RhdHVzJ107XG5cbiAgZnVuY3Rpb24gZ2V0TWVyZ2VkVmFsdWUodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHRhcmdldCwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHt9LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlLnNsaWNlKCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZURlZXBQcm9wZXJ0aWVzKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB1dGlscy5mb3JFYWNoKHZhbHVlRnJvbUNvbmZpZzJLZXlzLCBmdW5jdGlvbiB2YWx1ZUZyb21Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG5cbiAgdXRpbHMuZm9yRWFjaChkZWZhdWx0VG9Db25maWcyS2V5cywgZnVuY3Rpb24gZGVmYXVsdFRvQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2goZGlyZWN0TWVyZ2VLZXlzLCBmdW5jdGlvbiBtZXJnZShwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmIChwcm9wIGluIGNvbmZpZzEpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB2YXIgYXhpb3NLZXlzID0gdmFsdWVGcm9tQ29uZmlnMktleXNcbiAgICAuY29uY2F0KG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzKVxuICAgIC5jb25jYXQoZGVmYXVsdFRvQ29uZmlnMktleXMpXG4gICAgLmNvbmNhdChkaXJlY3RNZXJnZUtleXMpO1xuXG4gIHZhciBvdGhlcktleXMgPSBPYmplY3RcbiAgICAua2V5cyhjb25maWcxKVxuICAgIC5jb25jYXQoT2JqZWN0LmtleXMoY29uZmlnMikpXG4gICAgLmZpbHRlcihmdW5jdGlvbiBmaWx0ZXJBeGlvc0tleXMoa2V5KSB7XG4gICAgICByZXR1cm4gYXhpb3NLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTE7XG4gICAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChvdGhlcktleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuXG4gIHJldHVybiBjb25maWc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vLi4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIHZhciBjb250ZXh0ID0gdGhpcyB8fCBkZWZhdWx0cztcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4uY2FsbChjb250ZXh0LCBkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9jb3JlL2VuaGFuY2VFcnJvcicpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVNhZmVseShyYXdWYWx1ZSwgcGFyc2VyLCBlbmNvZGVyKSB7XG4gIGlmICh1dGlscy5pc1N0cmluZyhyYXdWYWx1ZSkpIHtcbiAgICB0cnkge1xuICAgICAgKHBhcnNlciB8fCBKU09OLnBhcnNlKShyYXdWYWx1ZSk7XG4gICAgICByZXR1cm4gdXRpbHMudHJpbShyYXdWYWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUubmFtZSAhPT0gJ1N5bnRheEVycm9yJykge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoZW5jb2RlciB8fCBKU09OLnN0cmluZ2lmeSkocmF3VmFsdWUpO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG5cbiAgdHJhbnNpdGlvbmFsOiB7XG4gICAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gICAgZm9yY2VkSlNPTlBhcnNpbmc6IHRydWUsXG4gICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogZmFsc2VcbiAgfSxcblxuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdBY2NlcHQnKTtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpIHx8IChoZWFkZXJzICYmIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID09PSAnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHJldHVybiBzdHJpbmdpZnlTYWZlbHkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICB2YXIgdHJhbnNpdGlvbmFsID0gdGhpcy50cmFuc2l0aW9uYWw7XG4gICAgdmFyIHNpbGVudEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5zaWxlbnRKU09OUGFyc2luZztcbiAgICB2YXIgZm9yY2VkSlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLmZvcmNlZEpTT05QYXJzaW5nO1xuICAgIHZhciBzdHJpY3RKU09OUGFyc2luZyA9ICFzaWxlbnRKU09OUGFyc2luZyAmJiB0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nO1xuXG4gICAgaWYgKHN0cmljdEpTT05QYXJzaW5nIHx8IChmb3JjZWRKU09OUGFyc2luZyAmJiB1dGlscy5pc1N0cmluZyhkYXRhKSAmJiBkYXRhLmxlbmd0aCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcpIHtcbiAgICAgICAgICBpZiAoZS5uYW1lID09PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgICAgICB0aHJvdyBlbmhhbmNlRXJyb3IoZSwgdGhpcywgJ0VfSlNPTl9QQVJTRScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuXG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB2YXIgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuXG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBeGlvc0Vycm9yKHBheWxvYWQpIHtcbiAgcmV0dXJuICh0eXBlb2YgcGF5bG9hZCA9PT0gJ29iamVjdCcpICYmIChwYXlsb2FkLmlzQXhpb3NFcnJvciA9PT0gdHJ1ZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwa2cgPSByZXF1aXJlKCcuLy4uLy4uL3BhY2thZ2UuanNvbicpO1xuXG52YXIgdmFsaWRhdG9ycyA9IHt9O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuWydvYmplY3QnLCAnYm9vbGVhbicsICdudW1iZXInLCAnZnVuY3Rpb24nLCAnc3RyaW5nJywgJ3N5bWJvbCddLmZvckVhY2goZnVuY3Rpb24odHlwZSwgaSkge1xuICB2YWxpZGF0b3JzW3R5cGVdID0gZnVuY3Rpb24gdmFsaWRhdG9yKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gdHlwZSB8fCAnYScgKyAoaSA8IDEgPyAnbiAnIDogJyAnKSArIHR5cGU7XG4gIH07XG59KTtcblxudmFyIGRlcHJlY2F0ZWRXYXJuaW5ncyA9IHt9O1xudmFyIGN1cnJlbnRWZXJBcnIgPSBwa2cudmVyc2lvbi5zcGxpdCgnLicpO1xuXG4vKipcbiAqIENvbXBhcmUgcGFja2FnZSB2ZXJzaW9uc1xuICogQHBhcmFtIHtzdHJpbmd9IHZlcnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nP30gdGhhblZlcnNpb25cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc09sZGVyVmVyc2lvbih2ZXJzaW9uLCB0aGFuVmVyc2lvbikge1xuICB2YXIgcGtnVmVyc2lvbkFyciA9IHRoYW5WZXJzaW9uID8gdGhhblZlcnNpb24uc3BsaXQoJy4nKSA6IGN1cnJlbnRWZXJBcnI7XG4gIHZhciBkZXN0VmVyID0gdmVyc2lvbi5zcGxpdCgnLicpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIGlmIChwa2dWZXJzaW9uQXJyW2ldID4gZGVzdFZlcltpXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmIChwa2dWZXJzaW9uQXJyW2ldIDwgZGVzdFZlcltpXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVHJhbnNpdGlvbmFsIG9wdGlvbiB2YWxpZGF0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb258Ym9vbGVhbj99IHZhbGlkYXRvclxuICogQHBhcmFtIHtzdHJpbmc/fSB2ZXJzaW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG52YWxpZGF0b3JzLnRyYW5zaXRpb25hbCA9IGZ1bmN0aW9uIHRyYW5zaXRpb25hbCh2YWxpZGF0b3IsIHZlcnNpb24sIG1lc3NhZ2UpIHtcbiAgdmFyIGlzRGVwcmVjYXRlZCA9IHZlcnNpb24gJiYgaXNPbGRlclZlcnNpb24odmVyc2lvbik7XG5cbiAgZnVuY3Rpb24gZm9ybWF0TWVzc2FnZShvcHQsIGRlc2MpIHtcbiAgICByZXR1cm4gJ1tBeGlvcyB2JyArIHBrZy52ZXJzaW9uICsgJ10gVHJhbnNpdGlvbmFsIG9wdGlvbiBcXCcnICsgb3B0ICsgJ1xcJycgKyBkZXNjICsgKG1lc3NhZ2UgPyAnLiAnICsgbWVzc2FnZSA6ICcnKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3B0LCBvcHRzKSB7XG4gICAgaWYgKHZhbGlkYXRvciA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXRNZXNzYWdlKG9wdCwgJyBoYXMgYmVlbiByZW1vdmVkIGluICcgKyB2ZXJzaW9uKSk7XG4gICAgfVxuXG4gICAgaWYgKGlzRGVwcmVjYXRlZCAmJiAhZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0pIHtcbiAgICAgIGRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdID0gdHJ1ZTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGZvcm1hdE1lc3NhZ2UoXG4gICAgICAgICAgb3B0LFxuICAgICAgICAgICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2JyArIHZlcnNpb24gKyAnIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5lYXIgZnV0dXJlJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0b3IgPyB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0cykgOiB0cnVlO1xuICB9O1xufTtcblxuLyoqXG4gKiBBc3NlcnQgb2JqZWN0J3MgcHJvcGVydGllcyB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYVxuICogQHBhcmFtIHtib29sZWFuP30gYWxsb3dVbmtub3duXG4gKi9cblxuZnVuY3Rpb24gYXNzZXJ0T3B0aW9ucyhvcHRpb25zLCBzY2hlbWEsIGFsbG93VW5rbm93bikge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICB9XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgdmFyIG9wdCA9IGtleXNbaV07XG4gICAgdmFyIHZhbGlkYXRvciA9IHNjaGVtYVtvcHRdO1xuICAgIGlmICh2YWxpZGF0b3IpIHtcbiAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnNbb3B0XTtcbiAgICAgIHZhciByZXN1bHQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRpb25zKTtcbiAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uICcgKyBvcHQgKyAnIG11c3QgYmUgJyArIHJlc3VsdCk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGFsbG93VW5rbm93biAhPT0gdHJ1ZSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1Vua25vd24gb3B0aW9uICcgKyBvcHQpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNPbGRlclZlcnNpb246IGlzT2xkZXJWZXJzaW9uLFxuICBhc3NlcnRPcHRpb25zOiBhc3NlcnRPcHRpb25zLFxuICB2YWxpZGF0b3JzOiB2YWxpZGF0b3JzXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQnVmZmVyKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwpICYmIHZhbC5jb25zdHJ1Y3RvciAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsLmNvbnN0cnVjdG9yKVxuICAgICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWwpIHtcbiAgaWYgKHRvU3RyaW5nLmNhbGwodmFsKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbCk7XG4gIHJldHVybiBwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gIHJldHVybiBzdHIudHJpbSA/IHN0ci50cmltKCkgOiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqIG5hdGl2ZXNjcmlwdFxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdOYXRpdmVTY3JpcHQnIG9yICdOUydcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiAobmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05hdGl2ZVNjcmlwdCcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05TJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHRba2V5XSkgJiYgaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHt9LCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbC5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5dGUgb3JkZXIgbWFya2VyLiBUaGlzIGNhdGNoZXMgRUYgQkIgQkYgKHRoZSBVVEYtOCBCT00pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgd2l0aCBCT01cbiAqIEByZXR1cm4ge3N0cmluZ30gY29udGVudCB2YWx1ZSB3aXRob3V0IEJPTVxuICovXG5mdW5jdGlvbiBzdHJpcEJPTShjb250ZW50KSB7XG4gIGlmIChjb250ZW50LmNoYXJDb2RlQXQoMCkgPT09IDB4RkVGRikge1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDEpO1xuICB9XG4gIHJldHVybiBjb250ZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzUGxhaW5PYmplY3Q6IGlzUGxhaW5PYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbSxcbiAgc3RyaXBCT006IHN0cmlwQk9NXG59O1xuIiwiaW1wb3J0IHsgT1dXaW5kb3cgfSBmcm9tIFwiQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10c1wiO1xyXG5cclxuLy8gQSBiYXNlIGNsYXNzIGZvciB0aGUgYXBwJ3MgZm9yZWdyb3VuZCB3aW5kb3dzLlxyXG4vLyBTZXRzIHRoZSBtb2RhbCBhbmQgZHJhZyBiZWhhdmlvcnMsIHdoaWNoIGFyZSBzaGFyZWQgYWNjcm9zcyB0aGUgZGVza3RvcCBhbmQgaW4tZ2FtZSB3aW5kb3dzLlxyXG5leHBvcnQgY2xhc3MgQXBwV2luZG93IHtcclxuICBwcm90ZWN0ZWQgY3VycldpbmRvdzogT1dXaW5kb3c7XHJcbiAgcHJvdGVjdGVkIG1haW5XaW5kb3c6IE9XV2luZG93O1xyXG4gIHByb3RlY3RlZCBtYXhpbWl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3Iod2luZG93TmFtZSkge1xyXG4gICAgdGhpcy5tYWluV2luZG93ID0gbmV3IE9XV2luZG93KCdiYWNrZ3JvdW5kJyk7XHJcbiAgICB0aGlzLmN1cnJXaW5kb3cgPSBuZXcgT1dXaW5kb3cod2luZG93TmFtZSk7XHJcblxyXG4gICAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VCdXR0b24nKTtcclxuICAgIC8vIGNvbnN0IG1heGltaXplQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21heGltaXplQnV0dG9uJyk7XHJcbiAgICBjb25zdCBtaW5pbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtaW5pbWl6ZUJ1dHRvbicpO1xyXG5cclxuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXInKTtcclxuXHJcbiAgICB0aGlzLnNldERyYWcoaGVhZGVyKTtcclxuXHJcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2Nsb3NlQnV0dG9uIGNsaWNrZWQnKVxyXG4gICAgICB0aGlzLm1haW5XaW5kb3cuY2xvc2UoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIG1pbmltaXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnbWluaW1pemVCdXR0b24gY2xpY2tlZCcpXHJcbiAgICAgIHRoaXMuY3VycldpbmRvdy5taW5pbWl6ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gbWF4aW1pemVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAvLyAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWF4aW1pemUtaW1nXCIpO1xyXG4gICAgLy8gICBpZiAoIXRoaXMubWF4aW1pemVkKSB7XHJcbiAgICAvLyAgICAgdGhpcy5jdXJyV2luZG93Lm1heGltaXplKCk7XHJcbiAgICAvLyAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWcvaW4tZ2FtZS13aW5kb3cvYnV0dG9uL3Jlc3RvcmUucG5nJyk7XHJcbiAgICAvLyAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgdGhpcy5jdXJyV2luZG93LnJlc3RvcmUoKTtcclxuICAgIC8vICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltZy9pbi1nYW1lLXdpbmRvdy9idXR0b24vbWF4aW1pemUucG5nJyk7XHJcbiAgICAvLyAgIH1cclxuXHJcbiAgICAvLyAgIHRoaXMubWF4aW1pemVkID0gIXRoaXMubWF4aW1pemVkO1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2VXaW5kb3coKSB7XHJcbiAgICB0aGlzLm1haW5XaW5kb3cuY2xvc2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRXaW5kb3dTdGF0ZSgpIHtcclxuICAgIHJldHVybiBhd2FpdCB0aGlzLmN1cnJXaW5kb3cuZ2V0V2luZG93U3RhdGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgc2V0RHJhZyhlbGVtKSB7XHJcbiAgICB0aGlzLmN1cnJXaW5kb3cuZHJhZ01vdmUoZWxlbSk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBpbnRlcmZhY2UgRHJvcERvd25JdGVtSW5mbyB7XHJcbiAgICBpZDogc3RyaW5nLFxyXG4gICAgdGV4dDogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBEcm9wRG93bkluZm8ge1xyXG4gICAgdmFyaWFibGVOYW1lOiBzdHJpbmcsXHJcbiAgICBkcm9wRG93bkxpc3Q6IERyb3BEb3duSXRlbUluZm9bXVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDdXJyZW50RWxlbWVudChkcm9wZG93bkluZm86IERyb3BEb3duSW5mbyk6SFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZHJvcGRvd25DdXJyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGRyb3Bkb3duQ3VycmVudC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9fY3VycmVudFwiKTtcclxuXHJcbiAgICBkcm9wZG93bkluZm8uZHJvcERvd25MaXN0LmZvckVhY2goKGRyb3Bkb3duSXRlbUluZm86IERyb3BEb3duSXRlbUluZm8sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZHJvcGRvd25JdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkcm9wZG93bkl0ZW0uY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hfX3ZhbHVlXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9faW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIGRyb3Bkb3duSXRlbUluZm8uaWQpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGRyb3Bkb3duSXRlbUluZm8udGV4dCk7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBkcm9wZG93bkluZm8udmFyaWFibGVOYW1lKTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiLCBcImNoZWNrZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkcm9wZG93bkl0ZW0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICAgICAgdGV4dC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9faW5wdXQtdGV4dFwiKTtcclxuICAgICAgICB0ZXh0LmlubmVyVGV4dCA9IGRyb3Bkb3duSXRlbUluZm8udGV4dDtcclxuXHJcbiAgICAgICAgZHJvcGRvd25JdGVtLmFwcGVuZENoaWxkKHRleHQpO1xyXG5cclxuICAgICAgICBkcm9wZG93bkN1cnJlbnQuYXBwZW5kQ2hpbGQoZHJvcGRvd25JdGVtKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIGlmIChkcm9wZG93bkluZm8udmFyaWFibGVOYW1lID09PSAnY2hhcmFjdGVyJykge1xyXG4gICAgICAgIGFycm93LnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4vaW1nL2Rlc2t0b3Atd2luZG93L2Ryb3Bkb3duLWFycm93LnN2Z1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXJyb3cuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi9pbWcvaW4tZ2FtZS13aW5kb3cvZHJvcGRvd24vZHJvcC1kb3duLWFycm93LnBuZ1wiKTtcclxuICAgIH1cclxuICAgIGFycm93LnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIkFycm93IEljb25cIik7XHJcbiAgICBhcnJvdy5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9faWNvblwiKTtcclxuXHJcbiAgICBkcm9wZG93bkN1cnJlbnQuYXBwZW5kQ2hpbGQoYXJyb3cpXHJcblxyXG4gICAgcmV0dXJuIGRyb3Bkb3duQ3VycmVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlzdEVsZW1lbnQoZHJvcGRvd25JbmZvOiBEcm9wRG93bkluZm8pOkhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGRyb3Bkb3duTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcclxuICAgIGRyb3Bkb3duTGlzdC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9fbGlzdFwiKTtcclxuXHJcbiAgICBkcm9wZG93bkluZm8uZHJvcERvd25MaXN0LmZvckVhY2goKGRyb3Bkb3duSXRlbUluZm86IERyb3BEb3duSXRlbUluZm8pID0+IHtcclxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICAgICAgbGFiZWwuY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hfX29wdGlvblwiKTtcclxuICAgICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgZHJvcGRvd25JdGVtSW5mby5pZCk7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gZHJvcGRvd25JdGVtSW5mby50ZXh0O1xyXG5cclxuICAgICAgICBsaS5hcHBlbmRDaGlsZChsYWJlbCk7XHJcblxyXG4gICAgICAgIGRyb3Bkb3duTGlzdC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgcmV0dXJuIGRyb3Bkb3duTGlzdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbURyb3BEb3duKGRyb3Bkb3duSW5mbzogRHJvcERvd25JbmZvKTpIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBkcm9wZG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkcm9wZG93bi5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveFwiKTtcclxuICAgIGRyb3Bkb3duLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMVwiKTtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50ID0gY3JlYXRlQ3VycmVudEVsZW1lbnQoZHJvcGRvd25JbmZvKTtcclxuICAgIC8vIGlmIChkcm9wZG93bkluZm8udmFyaWFibGVOYW1lID09PSAncmFpZF9kdW5nZW9uJykge1xyXG4gICAgLy8gICAgIGN1cnJlbnQuY2xhc3NMaXN0LmFkZCgnZm9jdXNzZWQnKTtcclxuICAgIC8vIH1cclxuICAgIGRyb3Bkb3duLmFwcGVuZENoaWxkKGN1cnJlbnQpO1xyXG5cclxuICAgIGNvbnN0IGxpc3QgPSBjcmVhdGVMaXN0RWxlbWVudChkcm9wZG93bkluZm8pO1xyXG4gICAgZHJvcGRvd24uYXBwZW5kQ2hpbGQobGlzdCk7XHJcblxyXG4gICAgY3VycmVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgY3VycmVudC5jbGFzc0xpc3QudG9nZ2xlKCdmb2N1c3NlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZHJvcGRvd24uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIChlKSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBjdXJyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3Vzc2VkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZHJvcGRvd247XHJcbn1cclxuIiwiaW50ZXJmYWNlIFRhbGVudEl0ZW0ge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgaWNvbjogc3RyaW5nLFxyXG4gICAgY291bnQ6IG51bWJlcixcclxuICAgIHBlcmNlbnQ6IG51bWJlcixcclxuICAgIGlzX3NlbGVjdGVkOiBib29sZWFuXHJcbn1cclxuXHJcbmludGVyZmFjZSBUYWxlbnRMZXZlbCB7XHJcbiAgICBsZXZlbDogbnVtYmVyLFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFRhbGVudEl0ZW1bXSxcclxuICAgIGlzX3NlbGVjdGVkOiBib29sZWFuXHJcbn1cclxuXHJcbmludGVyZmFjZSBUYWxlbnRUYWJsZSB7XHJcbiAgICB0YWxlbnRMZXZlbExpc3Q6IFRhbGVudExldmVsW11cclxufVxyXG5cclxuY29uc3QgZ2V0Q29sb3JGb3JQZXJjZW50YWdlID0gZnVuY3Rpb24ocGN0OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHBjdFVwcGVyID0gKHBjdCA8IDUwID8gcGN0IDogcGN0IC0gNTApIC8gNTA7XHJcbiAgICBjb25zdCBwY3RMb3dlciA9IDEgLSBwY3RVcHBlcjtcclxuICAgIGNvbnN0IHIgPSBNYXRoLmZsb29yKDIyMiAqIHBjdExvd2VyICsgKHBjdCA8IDUwID8gMjIyIDogMCkgKiBwY3RVcHBlcik7XHJcbiAgICBjb25zdCBnID0gTWF0aC5mbG9vcigocGN0IDwgNTAgPyAwIDogMjIyKSAqIHBjdExvd2VyICsgMjIyICogcGN0VXBwZXIpO1xyXG4gICAgcmV0dXJuIFwiI1wiICsgKCgxIDw8IDI0KSB8IChyIDw8IDE2KSB8IChnIDw8IDgpIHwgMHgwMCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVUYWxlbnRSb3dFbGVtZW50KHRhbGVudExldmVsOiBUYWxlbnRMZXZlbCwgdHJlZU1vZGU6IGJvb2xlYW4pOkhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHRhbGVudExldmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0YWxlbnRMZXZlbEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInRhbGVudC1yb3dcIik7XHJcbiAgICB0YWxlbnRMZXZlbEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zZWxlY3RlZFwiLCB0YWxlbnRMZXZlbC5pc19zZWxlY3RlZCA/IFwieWVzXCIgOiBcIm5vXCIpO1xyXG5cclxuICAgIGNvbnN0IGxldmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJvdXRlclwiKTtcclxuXHJcbiAgICBjb25zdCBsZXZlbElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldmVsSW5uZXIuY2xhc3NMaXN0LmFkZChcImlubmVyXCIpO1xyXG4gICAgbGV2ZWxJbm5lci5pbm5lclRleHQgPSBgJHt0YWxlbnRMZXZlbC5sZXZlbH1gO1xyXG5cclxuICAgIGxldmVsLmFwcGVuZENoaWxkKGxldmVsSW5uZXIpO1xyXG4gICAgXHJcbiAgICB0YWxlbnRMZXZlbEVsZW1lbnQuYXBwZW5kQ2hpbGQobGV2ZWwpO1xyXG5cclxuICAgIHRhbGVudExldmVsLnRhbGVudEl0ZW1MaXN0LmZvckVhY2godGFsZW50SXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgdGFsZW50SXRlbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRhbGVudEl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJvdXRlclwiKTtcclxuICAgICAgICB0YWxlbnRJdGVtRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNlbGVjdGVkXCIsIHRhbGVudEl0ZW0uaXNfc2VsZWN0ZWQgPyBcInllc1wiIDogXCJub1wiKTtcclxuICAgIFxyXG4gICAgICAgIGNvbnN0IElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBJbm5lci5jbGFzc0xpc3QuYWRkKFwiaW5uZXJcIik7XHJcblxyXG4gICAgICAgIGlmICghdHJlZU1vZGUpIHtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICBwZXJjZW50LmNsYXNzTGlzdC5hZGQoJ3BlcmNlbnQnKTtcclxuICAgICAgICAgICAgcGVyY2VudC5zdHlsZVsnY29sb3InXSA9IGdldENvbG9yRm9yUGVyY2VudGFnZSh0YWxlbnRJdGVtLnBlcmNlbnQpO1xyXG4gICAgICAgICAgICBwZXJjZW50LmlubmVyVGV4dCA9IGAke3RhbGVudEl0ZW0ucGVyY2VudH1gO1xyXG4gICAgICAgICAgICBJbm5lci5hcHBlbmRDaGlsZChwZXJjZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcclxuICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoXCJ0YWxlbnQtaWNvblwiKTtcclxuICAgICAgICBpY29uLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoL2ltZy9pbi1nYW1lLXdpbmRvdy90YWxlbnRzLyR7dGFsZW50SXRlbS5pY29ufSlgO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgdGV4dC5pbm5lclRleHQgPSB0YWxlbnRJdGVtLm5hbWU7XHJcblxyXG4gICAgICAgIElubmVyLmFwcGVuZENoaWxkKGljb24pO1xyXG4gICAgICAgIElubmVyLmFwcGVuZENoaWxkKHRleHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRhbGVudEl0ZW1FbGVtZW50LmFwcGVuZENoaWxkKElubmVyKTtcclxuICAgICAgICB0YWxlbnRMZXZlbEVsZW1lbnQuYXBwZW5kQ2hpbGQodGFsZW50SXRlbUVsZW1lbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRhbGVudExldmVsRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRhbGVudHNUYWJsZSh0YWxlbnRUYWJsZTogVGFsZW50VGFibGUsIHRyZWVNb2RlOiBib29sZWFuKTpIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCB0YWxlbnRzVGFibGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRhbGVudHNUYWJsZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInRhbGVudC10YWJsZVwiKTtcclxuXHJcbiAgICB0YWxlbnRUYWJsZS50YWxlbnRMZXZlbExpc3QuZm9yRWFjaCh0YWxlbnRMZXZlbCA9PiB7XHJcbiAgICAgICAgY29uc3QgdGFsZW50TGV2ZWxFbGVtZW50ID0gY3JlYXRlVGFsZW50Um93RWxlbWVudCh0YWxlbnRMZXZlbCwgdHJlZU1vZGUpO1xyXG4gICAgICAgIHRhbGVudHNUYWJsZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGFsZW50TGV2ZWxFbGVtZW50KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0YWxlbnRzVGFibGVFbGVtZW50O1xyXG59IiwiLy8gY29uc3QgZm9ydG5pdGVDbGFzc0lkID0gMjEyMTY7XHJcbmNvbnN0IHdvd0NsYXNzSWQgPSA3NjU7XHJcblxyXG5jb25zdCBpbnRlcmVzdGluZ0ZlYXR1cmVzID0gW1xyXG4gICdjb3VudGVycycsXHJcbiAgJ2RlYXRoJyxcclxuICAnaXRlbXMnLFxyXG4gICdraWxsJyxcclxuICAna2lsbGVkJyxcclxuICAna2lsbGVyJyxcclxuICAnbG9jYXRpb24nLFxyXG4gICdtYXRjaF9pbmZvJyxcclxuICAnbWF0Y2gnLFxyXG4gICdtZScsXHJcbiAgJ3BoYXNlJyxcclxuICAncmFuaycsXHJcbiAgJ3Jldml2ZWQnLFxyXG4gICdyb3N0ZXInLFxyXG4gICd0ZWFtJ1xyXG5dO1xyXG5cclxuY29uc3Qgd2luZG93TmFtZXMgPSB7XHJcbiAgaW5HYW1lOiAnaW5fZ2FtZScsXHJcbiAgZGVza3RvcDogJ2Rlc2t0b3AnXHJcbn07XHJcblxyXG5jb25zdCBob3RrZXlzID0ge1xyXG4gIHRvZ2dsZTogJ3Nob3doaWRlJ1xyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICB3b3dDbGFzc0lkLFxyXG4gIGludGVyZXN0aW5nRmVhdHVyZXMsXHJcbiAgd2luZG93TmFtZXMsXHJcbiAgaG90a2V5c1xyXG59IiwiZXhwb3J0IGNvbnN0IHRlc3RDbGFzc0xpc3QgPSBbXHJcbiAgeyBpZDogXCJkZWF0aC1rbmlnaHRcIiwgdGV4dDogXCJEZWF0aCBLbmlnaHRcIiB9LFxyXG4gIHsgaWQ6IFwiZGVtb24taHVudGVyXCIsIHRleHQ6IFwiRGVtb24gSHVudGVyXCIgfSxcclxuICB7IGlkOiBcImRydWlkXCIsIHRleHQ6IFwiRHJ1aWRcIiB9LFxyXG4gIHsgaWQ6IFwiaHVudGVyXCIsIHRleHQ6IFwiSHVudGVyXCIgfSxcclxuICB7IGlkOiBcIm1hZ2VcIiwgdGV4dDogXCJNYWdlXCIgfSxcclxuICB7IGlkOiBcIm1vbmtcIiwgdGV4dDogXCJNb25rXCIgfSxcclxuICB7IGlkOiBcInBhbGFkaW5cIiwgdGV4dDogXCJQYWxhZGluXCIgfSxcclxuICB7IGlkOiBcInByaWVzdFwiLCB0ZXh0OiBcIlByaWVzdFwiIH0sXHJcbiAgeyBpZDogXCJyb2d1ZVwiLCB0ZXh0OiBcIlJvZ3VlXCIgfSxcclxuICB7IGlkOiBcInNoYW1hblwiLCB0ZXh0OiBcIlNoYW1hblwiIH0sXHJcbiAgeyBpZDogXCJ3YXJsb2NrXCIsIHRleHQ6IFwiV2FybG9ja1wiIH0sXHJcbiAgeyBpZDogXCJ3YXJyaW9yXCIsIHRleHQ6IFwiV2FycmlvclwiIH0sXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdGVzdFNwZWNzTGlzdCA9IFtcclxuICB7IGlkOiBcImJsb29kXCIsIHRleHQ6IFwiQmxvb2RcIiB9LFxyXG4gIHsgaWQ6IFwiZnJvc3RcIiwgdGV4dDogXCJGcm9zdFwiIH0sXHJcbiAgeyBpZDogXCJ1bmhvbHlcIiwgdGV4dDogXCJVbmhvbHlcIiB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRlc3REdW5nZW9uTGlzdCA9IFtcclxuICB7IGlkOiBcImRlLW90aGVyLXNpZGVcIiwgdGV4dDogXCJkZSBvdGhlciBzaWRlXCIgfSxcclxuICB7IGlkOiBcImhhbGxzLW9mLWF0b25lbWVudFwiLCB0ZXh0OiBcImhhbGxzIG9mIGF0b25lbWVudFwiIH0sXHJcbiAgeyBpZDogXCJtaXN0cy1vZi10aXJuYS1zY2l0aGVcIiwgdGV4dDogXCJtaXN0cyBvZiB0aXJuYSBzY2l0aGVcIiB9LFxyXG4gIHsgaWQ6IFwicGxhZ3VlZmFsbFwiLCB0ZXh0OiBcInBsYWd1ZWZhbGxcIiB9LFxyXG4gIHsgaWQ6IFwic2FuZ3VpbmUtZGVwdGhzXCIsIHRleHQ6IFwic2FuZ3VpbmUgZGVwdGhzXCIgfSxcclxuICB7IGlkOiBcInNwaXJlcy1vZi1hc2NlbnNpb25cIiwgdGV4dDogXCJzcGlyZXMgb2YgYXNjZW5zaW9uXCIgfSxcclxuICB7IGlkOiBcInRoZS1uZWNyb3RpYy13YWtlXCIsIHRleHQ6IFwidGhlIG5lY3JvdGljIHdha2VcIiB9LFxyXG4gIHsgaWQ6IFwidGhlYXRlci1vZi1wYWluXCIsIHRleHQ6IFwidGhlYXRlciBvZiBwYWluXCIgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB0ZXN0UmFpZExpc3QgPSBbXHJcbiAgeyBpZDogXCJhbnRvcnVzLXRoZS1idXJuaW5nLXRocm9uZVwiLCB0ZXh0OiBcIkFudG9ydXMsIHRoZSBCdXJuaW5nIFRocm9uZVwiIH0sXHJcbiAgeyBpZDogXCJiYXR0bGUtb2YtZGF6YXJhbG9yXCIsIHRleHQ6IFwiQmF0dGxlIG9mIERhemFyJ2Fsb3JcIiB9LFxyXG4gIHsgaWQ6IFwiY2FzdGxlLW5hdGhyaWFcIiwgdGV4dDogXCJDYXN0bGUgTmF0aHJpYVwiIH0sXHJcbiAgeyBpZDogXCJjcnVjaWJsZS1vZi1zdG9ybXNcIiwgdGV4dDogXCJDcnVjaWJsZSBvZiBTdG9ybXNcIiB9LFxyXG4gIHsgaWQ6IFwibnlhbHRoYS10aGUtd2FraW5nLWNpdHlcIiwgdGV4dDogXCJOeSdhbHRoYSwgdGhlIFdha2luZyBDaXR5XCIgfSxcclxuICB7IGlkOiBcInRoZS1lbWVyYWxkLW5pZ2h0bWFyZVwiLCB0ZXh0OiBcIlRoZSBFbWVyYWxkIE5pZ2h0bWFyZVwiIH0sXHJcbiAgeyBpZDogXCJ0aGUtZXRlcm5hbC1wYWxhY2VcIiwgdGV4dDogXCJUaGUgRXRlcm5hbCBQYWxhY2VcIiB9LFxyXG4gIHsgaWQ6IFwidGhlLW5pZ2h0aG9sZFwiLCB0ZXh0OiBcIlRoZSBOaWdodGhvbGRcIiB9LFxyXG4gIHsgaWQ6IFwidG9tYi1vZi1zYXJnZXJhc1wiLCB0ZXh0OiBcIlRvbWIgb2YgU2FyZ2VyYXNcIiB9LFxyXG4gIHsgaWQ6IFwidHJpYWwtb2YtdmFsb3JcIiwgdGV4dDogXCJUcmlhbCBvZiBWYWxvclwiIH0sXHJcbiAgeyBpZDogXCJ1bGRpclwiLCB0ZXh0OiBcIlVsZGlyXCIgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB0ZXN0S2V5TGV2ZWxMaXN0ID0gW1xyXG4gIHsgaWQ6IFwibXl0aGljXCIsIHRleHQ6IFwiTXl0aGljXCIgfSxcclxuICB7IGlkOiBcImhlcm9pY1wiLCB0ZXh0OiBcIkhlcm9pY1wiIH0sXHJcbiAgeyBpZDogXCJub3JtYWxcIiwgdGV4dDogXCJOb3JtYWxcIiB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRlc3RSYWlkQm9zc0xpc3QgPSBbXHJcbiAgeyBpZDogXCJhZ2dyYW1hclwiLCB0ZXh0OiBcIkFnZ3JhbWFyXCIgfSxcclxuICB7IGlkOiBcImFudG9yYW4taGlnaC1jb21tYW5kXCIsIHRleHQ6IFwiQW50b3JhbiBIaWdoIENvbW1hbmRcIiB9LFxyXG4gIHsgaWQ6IFwiYXJndXMtdGhlLXVubWFrZXJcIiwgdGV4dDogXCJBcmd1cyB0aGUgVW5tYWtlclwiIH0sXHJcbiAgeyBpZDogXCJlb25hci10aGUtbGlmZS1iaW5kZXJcIiwgdGV4dDogXCJFb25hciB0aGUgTGlmZS1CaW5kZXJcIiB9LFxyXG4gIHsgaWQ6IFwiZmVsaG91bmRzLW9mLXNhcmdlcmFzXCIsIHRleHQ6IFwiRmVsaG91bmRzIG9mIFNhcmdlcmFzXCIgfSxcclxuICB7IGlkOiBcImdhcm90aGktd29ybGRicmVha2VyXCIsIHRleHQ6IFwiR2Fyb3RoaSBXb3JsZGJyZWFrZXJcIiB9LFxyXG4gIHsgaWQ6IFwiaW1vbmFyLXRoZS1zb3VsaHVudGVyXCIsIHRleHQ6IFwiSW1vbmFyIHRoZSBTb3VsaHVudGVyXCIgfSxcclxuICB7IGlkOiBcImtpbidnYXJvdGhcIiwgdGV4dDogXCJLaW4nZ2Fyb3RoXCIgfSxcclxuICB7IGlkOiBcInBvcnRhbC1rZWVwZXItaGFzYWJlbFwiLCB0ZXh0OiBcIlBvcnRhbCBLZWVwZXIgSGFzYWJlbFwiIH0sXHJcbiAgeyBpZDogXCJ0aGUtY292ZW4tb2Ytc2hpdmFycmFcIiwgdGV4dDogXCJUaGUgQ292ZW4gb2YgU2hpdmFycmFcIiB9LFxyXG4gIHsgaWQ6IFwidmFyaW1hdGhyYXNcIiwgdGV4dDogXCJWYXJpbWF0aHJhc1wiIH0sXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdGVzdFRhbGVudHNJbmZvID0gW1xyXG4gIHtcclxuICAgIGxldmVsOiAxNSxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkhlYXJ0YnJlYWtlclwiLFxyXG4gICAgICAgIGljb246IFwic3BlbGxfZGVhdGhrbmlnaHRfZGVhdGhzdHJpa2UuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDI3MzAsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkJsb29kZHJpbmtlclwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9hbmltdXNkcmF3LmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA0MDAsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlRvbWJzdG9uZVwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9maWVnbmRlYWQuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDgzLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgfSxcclxuICB7XHJcbiAgICBsZXZlbDogMjUsXHJcbiAgICB0YWxlbnRJdGVtTGlzdDogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJSYXBpZCBEZWNvbXBvc2l0aW9uXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2RlYXRoa25pZ2h0X2RlYXRoc2lwaG9uMi5qcGdcIixcclxuICAgICAgICBjb3VudDogNTQsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkhlbW9zdGFzaXNcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfZGVhdGh3aW5nX2Jsb29kY29ycnVwdGlvbl9lYXJ0aC5qcGdcIixcclxuICAgICAgICBjb3VudDogMzE0NCxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiQ29uc3VtcHRpb25cIixcclxuICAgICAgICBpY29uOiBcImludl9heGVfMmhfYXJ0aWZhY3RtYXdfZF8wMS5qcGdcIixcclxuICAgICAgICBjb3VudDogMTUsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiAzMCxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkZvdWwgQnVsd2Fya1wiLFxyXG4gICAgICAgIGljb246IFwiaW52X2FybW9yX3NoaWVsZF9uYXh4cmFtYXNfZF8wMi5qcGdcIixcclxuICAgICAgICBjb3VudDogNjA3LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJSZWxpc2ggaW4gQmxvb2RcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfZGVhdGhrbmlnaHRfcm9pbGluZ2Jsb29kLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAxNjEzLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJCbG9vZCBUYXBcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX2RlYXRoa25pZ2h0X2Jsb29kdGFwLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA5OTMsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiAzNSxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIldpbGwgb2YgdGhlIE5lY3JvcG9saXNcIixcclxuICAgICAgICBpY29uOiBcImFjaGlldmVtZW50X2Jvc3Nfa2VsdGh1emFkXzAxLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAzMTEzLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJBbnRpLU1hZ2ljIEJhcnJpZXJcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX3NoYWRvd19hbnRpbWFnaWNzaGVsbC5qcGdcIixcclxuICAgICAgICBjb3VudDogOTIsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIk1hcmsgb2YgQmxvb2RcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfaHVudGVyX3JhcGlka2lsbGluZy5qcGdcIixcclxuICAgICAgICBjb3VudDogOCxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbGV2ZWw6IDQwLFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiR3JpcCBvZiB0aGUgRGVhZFwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9jcmVhdHVyZV9kaXNlYXNlXzA1LmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAyMzY5LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJUaWdodGVuaW5nIEdyYXNwXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2RlYXRoa25pZ2h0X2FvZWRlYXRoZ3JpcC5qcGdcIixcclxuICAgICAgICBjb3VudDogMTg1LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJXcmFpdGggV2Fsa1wiLFxyXG4gICAgICAgIGljb246IFwiaW52X2hlbG1fcGxhdGVfcmFpZGRlYXRoa25pZ2h0X3BfMDEuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDY1OSxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbGV2ZWw6IDQ1LFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiVm9yYWNpb3VzXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2lyb25tYWlkZW5zX3doaXJsb2ZibG9vZC5qcGdcIixcclxuICAgICAgICBjb3VudDogMTk5NixcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiRGVhdGggUGFjdFwiLFxyXG4gICAgICAgIGljb246IFwic3BlbGxfc2hhZG93X2RlYXRocGFjdC5qcGdcIixcclxuICAgICAgICBjb3VudDogMTcsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkJsb29kd29ybXNcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX3NoYWRvd19zb3VsbGVlY2guanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDEyMDAsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiA1MCxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlB1cmdhdG9yeVwiLFxyXG4gICAgICAgIGljb246IFwiaW52X21pc2Nfc2hhZG93ZWdnLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA2NjEsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlJlZCBUaGlyc3RcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX2RlYXRoa25pZ2h0X2Jsb29kcHJlc2VuY2UuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDE2NjksXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkJvbmVzdG9ybVwiLFxyXG4gICAgICAgIGljb246IFwiYWNoaWV2ZW1lbnRfYm9zc19sb3JkbWFycm93Z2FyLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA4ODMsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9XHJcbl07IiwiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xyXG5cclxuY29uc3QgYXBpID0gYXhpb3MuY3JlYXRlKHtcclxuICAvLyAgIGJhc2VVUkw6IGBodHRwOi8vbG9jYWxob3N0OjUwMDAvYXBpYCxcclxuICBiYXNlVVJMOiBgaHR0cHM6Ly93b3dtZS5nZy9hcGlgLFxyXG4gIGhlYWRlcnM6IHtcclxuICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldEF1dGhUb2tlbiA9ICh0b2tlbikgPT4ge1xyXG4gIGRlbGV0ZSBhcGkuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bXCJ4LWF1dGgtdG9rZW5cIl07XHJcblxyXG4gIGlmICh0b2tlbikge1xyXG4gICAgYXBpLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uW1wieC1hdXRoLXRva2VuXCJdID0gdG9rZW47XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNwZWNMaXN0ID0gYXN5bmMgKGNsYXNzX25hbWUpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkuZ2V0KGAvZ2V0X3NwZWNfbGlzdGAsIHtcclxuICAgICAgcGFyYW1zOiB7IGNsYXNzOiBjbGFzc19uYW1lIH0sXHJcbiAgICB9KTtcclxuICAgIGlmIChyZXNwb25zZS5kYXRhLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEuc3BlY0xpc3Q7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG4gIHJldHVybiBbXTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXREdW5nZW9uTGlzdCA9IGFzeW5jIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkuZ2V0KGAvZ2V0X2R1bmdlb25fbGlzdGAsIHtcclxuICAgICAgcGFyYW1zOiB7IG1pbjogbWluLCBtYXg6IG1heCB9LFxyXG4gICAgfSk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLmR1bmdlb25MaXN0O1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtdO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJhaWRMaXN0ID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5nZXQoYC9nZXRfcmFpZF9saXN0YCk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJhaWRMaXN0O1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtdO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJhaWRCb3NzTGlzdCA9IGFzeW5jIChyYWlkKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLmdldChgL2dldF9yYWlkX2Jvc3NfbGlzdGAsIHtcclxuICAgICAgcGFyYW1zOiB7IHJhaWQ6IHJhaWQgfSxcclxuICAgIH0pO1xyXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yYWlkQm9zc0xpc3Q7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW107XHJcbn07XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRhbGVudEluZm9SZXNwb25zZSB7XHJcbiAgdGFsZW50VGFibGVJbmZvOiBhbnlbXTtcclxuICBsb2dDb3VudDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VGFsZW50VGFibGVJbmZvID0gYXN5bmMgKFxyXG4gIHBhcmFtc1xyXG4pOiBQcm9taXNlPFRhbGVudEluZm9SZXNwb25zZT4gPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5nZXQoYC9nZXRfdGFsZW50X3RhYmxlX2luZm9gLCB7XHJcbiAgICAgIHBhcmFtczogcGFyYW1zLFxyXG4gICAgfSk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFsZW50VGFibGVJbmZvOiByZXNwb25zZS5kYXRhLmZhbW91c1RhbGVudEluZm8sXHJcbiAgICAgICAgbG9nQ291bnQ6IHJlc3BvbnNlLmRhdGEubG9nQ291bnQsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGFsZW50VGFibGVJbmZvOiBbXSxcclxuICAgIGxvZ0NvdW50OiAwLFxyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VG9rZW4gPSBhc3luYyAocGFyYW1zKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5wb3N0KFwiL2F1dGgvYm5ldF90b2tlblwiLCBwYXJhbXMpO1xyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgICBzZXRBdXRoVG9rZW4ocmVzLmRhdGEudG9rZW4pO1xyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDaGFyYWN0ZXJzID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkucG9zdChcIi9nZXRfY2hhcmFjdGVyc1wiKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEpvdXJuYWxzID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkuZ2V0KFwiL2pvdXJuYWxzXCIpO1xyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlSm91cm5hbHMgPSBhc3luYyAoZGF0YSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkucG9zdChcIi9qb3VybmFsc1wiLCBkYXRhKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVKb3VybmFscyA9IGFzeW5jIChqb3VybmVsSUQsIGRhdGEpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLnB1dChgL2pvdXJuYWxzLyR7am91cm5lbElEfWAsIGRhdGEpO1xyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJlZGl0ZWQgY2FsbCBmcm9tIGFwaVwiKTtcclxuICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgc3RvcmVKb3VybmFsQ29udGVudCA9IGFzeW5jIChpZCwgZGF0YSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkucG9zdChgL2pvdXJuYWxzLyR7aWR9L2NvbnRlbnRgLCBkYXRhKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVKb3VybmFsQ29udGVudCA9IGFzeW5jIChqb3VybmVsSUQsIGNvbnRlbnRJRCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkuZGVsZXRlKGAvam91cm5hbHMvJHtqb3VybmVsSUR9L2NvbnRlbnQvJHtjb250ZW50SUR9YCk7XHJcbiAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSlcclxuICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGVkaXRKb3VybmFsQ29udGVudCA9IGFzeW5jIChqb3VybmVsSUQsIGNvbnRlbnRJRCwgZGF0YSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkucHV0KGAvam91cm5hbHMvJHtqb3VybmVsSUR9L2NvbnRlbnQvJHtjb250ZW50SUR9YCwgZGF0YSk7XHJcbiAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSlcclxuICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlSm91cm5hbCA9IGFzeW5jIChqb3VybmVsSUQpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLmRlbGV0ZShgL2pvdXJuYWxzLyR7am91cm5lbElEfWApO1xyXG4gICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpXHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBjcmVhdGVDdXN0b21Ecm9wRG93biwgRHJvcERvd25JdGVtSW5mbyB9IGZyb20gJy4uL2NvbXBvbmVudHMvZHJvcGRvd24nO1xyXG5cclxuY29uc3QgY29udmVydENoYXJhY3RlcnNUb0Ryb3Bkb3duRm9ybWF0ID0gKGNoYXJhY3RlcnMpID0+IHtcclxuICBjb25zdCByZXN1bHQgPSBbXTtcclxuICBmb3IgKGNvbnN0IGNoYXJhY3RlciBvZiBjaGFyYWN0ZXJzKSB7XHJcbiAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgIGlkOiBjaGFyYWN0ZXIuaWQsXHJcbiAgICAgIHRleHQ6IGAke2NoYXJhY3Rlci5yZWFsbV9uYW1lfSAtICR7Y2hhcmFjdGVyLm5hbWV9YFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYXJhY3RlckluZm8ge1xyXG4gIHByaXZhdGUgY2hhcmFjdGVycyA9IFtdO1xyXG4gIHByaXZhdGUgc2VsZWN0ZWRDaGFyYWN0ZXJJRDtcclxuXHJcbiAgY29uc3RydWN0b3IoY2hhcmFjdGVycykge1xyXG4gICAgdGhpcy5jaGFyYWN0ZXJzID0gY2hhcmFjdGVycztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RWxlbWVudElubmVySFRNTChpZCwgY29udGVudCkge1xyXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICBlbC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0RHJvcERvd25FdmVudExpc3RuZXIobmFtZTogc3RyaW5nKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShuYW1lKS5mb3JFYWNoKGVsZW0gPT4ge1xyXG4gICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFyYWN0ZXJJRCA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCkuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2VsZWN0ZWRDaGFyYWN0ZXJJRCk7XHJcbiAgICAgICAgdGhpcy5zZXRDaGFyYWN0ZXJJbmZvUGFuZWwoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRDaGFyYWN0ZXJJbmZvUGFuZWwoKSB7XHJcbiAgICBmb3IgKGNvbnN0IGNoYXJhY3RlciBvZiB0aGlzLmNoYXJhY3RlcnMpIHtcclxuICAgICAgaWYgKGNoYXJhY3Rlci5pZCA9PSB0aGlzLnNlbGVjdGVkQ2hhcmFjdGVySUQpIHtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnRJbm5lckhUTUwoXCJ0b3RhbF9udW1iZXJfZGVhdGhzXCIsIGBUb3RhbCBOdW1iZXIgRGVhdGhzOiAke2NoYXJhY3Rlci50b3RhbF9udW1iZXJfZGVhdGhzfWApO1xyXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElubmVySFRNTChcInRvdGFsX2dvbGRfZ2FpbmVkXCIsIGBUb3RhbCBHb2xkIEdhaW5lZDogJHtjaGFyYWN0ZXIudG90YWxfZ29sZF9nYWluZWR9YCk7XHJcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SW5uZXJIVE1MKFwidG90YWxfZ29sZF9sb3N0XCIsIGBUb3RhbCBHb2xkIExvc3Q6ICR7Y2hhcmFjdGVyLnRvdGFsX2dvbGRfbG9zdH1gKTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnRJbm5lckhUTUwoXCJ0b3RhbF9pdGVtX3ZhbHVlX2dhaW5lZFwiLCBgVG90YWwgSXRlbSBWYWx1ZSBHYWluZWQ6ICR7Y2hhcmFjdGVyLnRvdGFsX2l0ZW1fdmFsdWVfZ2FpbmVkfWApO1xyXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElubmVySFRNTChcImxldmVsX251bWJlcl9kZWF0aHNcIiwgYExldmVsIE51bWJlciBEZWF0aHM6ICR7Y2hhcmFjdGVyLmxldmVsX251bWJlcl9kZWF0aHN9YCk7XHJcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SW5uZXJIVE1MKFwibGV2ZWxfZ29sZF9nYWluZWRcIiwgYExldmVsIEdvbGQgR2FpbmVkOiAke2NoYXJhY3Rlci5sZXZlbF9nb2xkX2dhaW5lZH1gKTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnRJbm5lckhUTUwoXCJsZXZlbF9nb2xkX2xvc3RcIiwgYExldmVsIEdvbGQgTG9zdDogJHtjaGFyYWN0ZXIubGV2ZWxfZ29sZF9sb3N0fWApO1xyXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElubmVySFRNTChcImxldmVsX2l0ZW1fdmFsdWVfZ2FpbmVkXCIsIGBMZXZlbCBJdGVtIFZhbHVlIEdhaW5lZDogJHtjaGFyYWN0ZXIubGV2ZWxfaXRlbV92YWx1ZV9nYWluZWR9YCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcHVibGljIGluaXREcm9wZG93bigpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFyYWN0ZXItc2VsZWN0LWJveF9fY29udGFpbmVyJyk7XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgXHJcbiAgICBjb25zdCBlbERyb3Bkb3duID0gY3JlYXRlQ3VzdG9tRHJvcERvd24oe1xyXG4gICAgICB2YXJpYWJsZU5hbWU6ICdjaGFyYWN0ZXInLFxyXG4gICAgICBkcm9wRG93bkxpc3Q6IGNvbnZlcnRDaGFyYWN0ZXJzVG9Ecm9wZG93bkZvcm1hdCh0aGlzLmNoYXJhY3RlcnMpXHJcbiAgICB9KTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbERyb3Bkb3duKTtcclxuICBcclxuICAgIHRoaXMuaW5pdERyb3BEb3duRXZlbnRMaXN0bmVyKCdjaGFyYWN0ZXInKTtcclxuXHJcbiAgICB0aGlzLnNlbGVjdGVkQ2hhcmFjdGVySUQgPSB0aGlzLmNoYXJhY3RlcnMubGVuZ3RoID4gMCA/IHRoaXMuY2hhcmFjdGVyc1swXS5pZCA6IG51bGw7XHJcbiAgICB0aGlzLnNldENoYXJhY3RlckluZm9QYW5lbCgpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjcmVhdGVDdXN0b21Ecm9wRG93biwgRHJvcERvd25JdGVtSW5mbyB9IGZyb20gJy4uL2NvbXBvbmVudHMvZHJvcGRvd24nO1xyXG5pbXBvcnQgeyBjcmVhdGVUYWxlbnRzVGFibGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3RhbGVudHNUYWJsZSc7XHJcblxyXG5pbXBvcnQgeyB0ZXN0Q2xhc3NMaXN0LCB0ZXN0S2V5TGV2ZWxMaXN0LCB0ZXN0UmFpZEJvc3NMaXN0LCB0ZXN0RHVuZ2Vvbkxpc3QsIHRlc3RSYWlkTGlzdCwgdGVzdFNwZWNzTGlzdCwgdGVzdFRhbGVudHNJbmZvIH0gZnJvbSAnLi4vaW5pdC9pbml0RGF0YSc7XHJcblxyXG5pbXBvcnQgeyBnZXRTcGVjTGlzdCwgZ2V0RHVuZ2Vvbkxpc3QsIGdldFJhaWRMaXN0LCBnZXRSYWlkQm9zc0xpc3QsIGdldFRhbGVudFRhYmxlSW5mbyB9IGZyb20gJy4vYXBpJztcclxuXHJcbmludGVyZmFjZSBTZWFyY2hDb25kaXRpb24ge1xyXG4gIGNsYXNzOiBzdHJpbmcsXHJcbiAgc3BlY3M6IHN0cmluZyxcclxuICBpc19kdW5nZW9uOiBib29sZWFuLFxyXG4gIHJhaWRfZHVuZ2Vvbjogc3RyaW5nLFxyXG4gIGtleV9sZXZlbDogc3RyaW5nLFxyXG4gIHJhaWRfYm9zczogc3RyaW5nLFxyXG4gIGtleV9zdG9uZV9sZXZlbF9taW46IG51bWJlcixcclxuICBrZXlfc3RvbmVfbGV2ZWxfbWF4OiBudW1iZXIsXHJcbiAgYWR2YW5jZWRfZmlsdGVyczogYm9vbGVhbixcclxuICB0cmVlX21vZGU6IGJvb2xlYW5cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhbGVudFBpY2tlciB7XHJcbiAgcHJpdmF0ZSBzZWFyY2hDb25kaXRpb246IFNlYXJjaENvbmRpdGlvbjtcclxuICBwcml2YXRlIGZhbW91c1RhbGVudEluZm86IGFueTtcclxuICBwcml2YXRlIHNlbGVjdGVkVGFsZW50VHJlZUluZGV4OiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWFyY2hDb25kaXRpb24gPSB7XHJcbiAgICAgIGNsYXNzOiAnRGVtb24gSHVudGVyJyxcclxuICAgICAgc3BlY3M6ICdIYXZvYycsXHJcbiAgICAgIGlzX2R1bmdlb246IHRydWUsXHJcbiAgICAgIHJhaWRfZHVuZ2VvbjogJ0Nhc3RsZSBOYXRocmlhJyxcclxuICAgICAga2V5X2xldmVsOiAnTXl0aGljJyxcclxuICAgICAgcmFpZF9ib3NzOiAnU2hyaWVrd2luZycsXHJcbiAgICAgIGtleV9zdG9uZV9sZXZlbF9taW46IDEsXHJcbiAgICAgIGtleV9zdG9uZV9sZXZlbF9tYXg6IDQ1LFxyXG4gICAgICBhZHZhbmNlZF9maWx0ZXJzOiBmYWxzZSxcclxuICAgICAgdHJlZV9tb2RlOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mbyA9IHRlc3RUYWxlbnRzSW5mbztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0Q29tcG9uZW50cygpIHtcclxuICAgIHRoaXMuaW5pdERyb3Bkb3ducygpO1xyXG4gICAgdGhpcy5pbml0S2V5U3RvbmVMZXZlbFJhbmdlKCk7XHJcbiAgICB0aGlzLmluaXRTd2l0Y2goKTtcclxuXHJcbiAgICB0aGlzLmluaXRUYWxlbnRzVGFibGUodGhpcy5mYW1vdXNUYWxlbnRJbmZvLCAwKTtcclxuXHJcbiAgICB0aGlzLmluaXRJblByb2dyZXNzRXZlbnQoKTtcclxuICAgIHRoaXMuaW5pdFRyZWVNb2RlQWN0aW9uUGFuZWxFdmVudCgpO1xyXG5cclxuICAgIC8vIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXREcm9wRG93bkV2ZW50TGlzdG5lcihuYW1lOiBzdHJpbmcpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKG5hbWUpLmZvckVhY2goZWxlbSA9PiB7XHJcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb25bbmFtZV0gPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpLnZhbHVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbG9hZFNwZWNEcm9wZG93bigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ3JhaWRfZHVuZ2VvbicpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlbG9hZFJhaWRCb3NzRHJvcGRvd24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0U2VsZWN0KHRpdGxlOiBzdHJpbmcsIHBhcmVudF9pZDogc3RyaW5nLCBkcm9wZG93bkxpc3Q6IERyb3BEb3duSXRlbUluZm9bXSwgdmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudF9pZCk7XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgXHJcbiAgICBjb25zdCBlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICAgIGVsVGl0bGUuaW5uZXJUZXh0ID0gdGl0bGU7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWxUaXRsZSk7XHJcbiAgXHJcbiAgICBjb25zdCBlbERyb3Bkb3duID0gY3JlYXRlQ3VzdG9tRHJvcERvd24oe1xyXG4gICAgICB2YXJpYWJsZU5hbWU6IHZhcmlhYmxlTmFtZSxcclxuICAgICAgZHJvcERvd25MaXN0OiBkcm9wZG93bkxpc3RcclxuICAgIH0pO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsRHJvcGRvd24pO1xyXG4gIFxyXG4gICAgdGhpcy5pbml0RHJvcERvd25FdmVudExpc3RuZXIodmFyaWFibGVOYW1lKTtcclxuICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uW3ZhcmlhYmxlTmFtZV0gPSBkcm9wZG93bkxpc3RbMF0udGV4dDtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0RHJvcGRvd25zKCkge1xyXG4gICAgdGhpcy5pbml0U2VsZWN0KFwiQ2xhc3NcIiwgXCJjbGFzcy1zZWxlY3QtYm94X19jb250YWluZXJcIiwgdGVzdENsYXNzTGlzdCwgJ2NsYXNzJyk7XHJcbiAgICB0aGlzLmluaXRTZWxlY3QoXCJTcGVjc1wiLCBcInNwZWNzLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiLCB0ZXN0U3BlY3NMaXN0LCAnc3BlY3MnKTtcclxuICAgIHRoaXMuaW5pdFNlbGVjdChcIkR1bmdlb24gTGlzdFwiLCBcInJhaWRfZHVuZ2Vvbi1zZWxlY3QtYm94X19jb250YWluZXJcIiwgdGVzdER1bmdlb25MaXN0LCAncmFpZF9kdW5nZW9uJyk7XHJcbiAgICB0aGlzLmluaXRTZWxlY3QoXCJSYWlkIExldmVsXCIsIFwia2V5X2xldmVsLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiLCB0ZXN0S2V5TGV2ZWxMaXN0LCAna2V5X2xldmVsJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgYXN5bmMgcmVsb2FkU3BlY0Ryb3Bkb3duKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHNwZWNMaXN0ID0gYXdhaXQgZ2V0U3BlY0xpc3QodGhpcy5zZWFyY2hDb25kaXRpb24uY2xhc3MpO1xyXG4gICAgICBzcGVjTGlzdCA9IHNwZWNMaXN0Lmxlbmd0aCA+IDAgPyBzcGVjTGlzdCA6IHRlc3RTcGVjc0xpc3Q7XHJcbiAgICAgIHRoaXMuaW5pdFNlbGVjdChcIlNwZWNzXCIsIFwic3BlY3Mtc2VsZWN0LWJveF9fY29udGFpbmVyXCIsIHNwZWNMaXN0LCAnc3BlY3MnKTtcclxuICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24uc3BlY3MgPSBzcGVjTGlzdFswXS50ZXh0O1xyXG4gIFxyXG4gICAgICBjb25zdCBhbmltUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsZW50LWFuaW0tcGFuZWwnKTtcclxuICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVJbicpO1xyXG4gICAgICBpZiAoIWFuaW1QYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZhZGVPdXQnKSkge1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0Jyk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgYXN5bmMgcmVsb2FkUmFpZER1bmdlb25Ecm9wZG93bigpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGFuaW1QYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxlbnQtYW5pbS1wYW5lbCcpO1xyXG4gICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZUluJyk7XHJcbiAgICAgIGlmICghYW5pbVBhbmVsLmNsYXNzTGlzdC5jb250YWlucygnZmFkZU91dCcpKSB7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXQnKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBsZXQgcmFpZER1bmdlb25MaXN0ID0gW107XHJcbiAgICAgIGlmICh0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uKSB7XHJcbiAgICAgICAgcmFpZER1bmdlb25MaXN0ID0gYXdhaXQgZ2V0RHVuZ2Vvbkxpc3QodGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbiwgdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heCk7XHJcbiAgICAgICAgcmFpZER1bmdlb25MaXN0ID0gcmFpZER1bmdlb25MaXN0Lmxlbmd0aCA+IDAgPyByYWlkRHVuZ2Vvbkxpc3QgOiB0ZXN0RHVuZ2Vvbkxpc3Q7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmFpZER1bmdlb25MaXN0ID0gYXdhaXQgZ2V0UmFpZExpc3QoKTtcclxuICAgICAgICByYWlkRHVuZ2Vvbkxpc3QgPSByYWlkRHVuZ2Vvbkxpc3QubGVuZ3RoID4gMCA/IHJhaWREdW5nZW9uTGlzdCA6IHRlc3RSYWlkTGlzdDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmluaXRTZWxlY3QoXHJcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2VvbiA/IFwiRHVuZ2VvbiBMaXN0XCIgOiBcIlJhaWQgTGlzdFwiLCBcclxuICAgICAgICBcInJhaWRfZHVuZ2Vvbi1zZWxlY3QtYm94X19jb250YWluZXJcIiwgXHJcbiAgICAgICAgcmFpZER1bmdlb25MaXN0LCBcclxuICAgICAgICAncmFpZF9kdW5nZW9uJ1xyXG4gICAgICApO1xyXG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5yYWlkX2R1bmdlb24gPSByYWlkRHVuZ2Vvbkxpc3RbMF0udGV4dDtcclxuICBcclxuICAgICAgaWYgKHRoaXMuc2VhcmNoQ29uZGl0aW9uLmlzX2R1bmdlb24pIHtcclxuICAgICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVsb2FkUmFpZEJvc3NEcm9wZG93bigpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGFzeW5jIHJlbG9hZFJhaWRCb3NzRHJvcGRvd24oKSB7XHJcbiAgICBjb25zdCBhbmltUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsZW50LWFuaW0tcGFuZWwnKTtcclxuICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlSW4nKTtcclxuICAgIGlmICghYW5pbVBhbmVsLmNsYXNzTGlzdC5jb250YWlucygnZmFkZU91dCcpKSB7XHJcbiAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0Jyk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBsZXQgcmFpZEJvc3NMaXN0ID0gYXdhaXQgZ2V0UmFpZEJvc3NMaXN0KHRoaXMuc2VhcmNoQ29uZGl0aW9uLnJhaWRfZHVuZ2Vvbik7XHJcbiAgICByYWlkQm9zc0xpc3QgPSByYWlkQm9zc0xpc3QubGVuZ3RoID4gMCA/IHJhaWRCb3NzTGlzdCA6IHRlc3RSYWlkQm9zc0xpc3Q7XHJcbiAgXHJcbiAgICB0aGlzLmluaXRTZWxlY3QoXCJSYWlkIEJvc3NcIiwgXCJyYWlkX2Jvc3Mtc2VsZWN0LWJveF9fY29udGFpbmVyXCIsICByYWlkQm9zc0xpc3QsICdyYWlkX2Jvc3MnKTtcclxuICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLnJhaWRfYm9zcyA9IHJhaWRCb3NzTGlzdFswXS50ZXh0O1xyXG4gIFxyXG4gICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBhc3luYyBkcmF3VGFsZW50VGFibGUobm9BbmltPzogYm9vbGVhbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgYW5pbVBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGVudC1hbmltLXBhbmVsJyk7XHJcbiAgICAgIGlmICghbm9BbmltICYmICFhbmltUGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdmYWRlT3V0JykpIHtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZU91dCcpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0VGFsZW50VGFibGVJbmZvKHtcclxuICAgICAgICBjbGFzc19uYW1lOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5jbGFzcywgXHJcbiAgICAgICAgc3BlYzogdGhpcy5zZWFyY2hDb25kaXRpb24uc3BlY3MsXHJcbiAgICAgICAgdHlwZTogdGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2VvbiA/ICdkdW5nZW9uJyA6ICdyYWlkJyxcclxuICAgICAgICByYWlkX2R1bmdlb246IHRoaXMuc2VhcmNoQ29uZGl0aW9uLnJhaWRfZHVuZ2VvbiwgXHJcbiAgICAgICAgcmFpZF9ib3NzOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5yYWlkX2Jvc3MsXHJcbiAgICAgICAgcmFpZF9sZXZlbDogdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X2xldmVsLFxyXG4gICAgICAgIGR1bmdlb25fbWluX2xldmVsOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWluLFxyXG4gICAgICAgIGR1bmdlb25fbWF4X2xldmVsOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4LFxyXG4gICAgICAgIHRyZWVfbW9kZTogdGhpcy5zZWFyY2hDb25kaXRpb24udHJlZV9tb2RlID8gJ3RyZWUnIDogJ25vcm1hbCdcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGlmICh0aGlzLnNlYXJjaENvbmRpdGlvbi50cmVlX21vZGUpIHtcclxuICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm8gPSByZXNwb25zZS50YWxlbnRUYWJsZUluZm8ubGVuZ3RoID4gMCA/IHJlc3BvbnNlLnRhbGVudFRhYmxlSW5mbyA6IFt7cGlja19yYXRlOiAwLCB0YWxlbnRfdHJlZTogdGVzdFRhbGVudHNJbmZvfV07XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5pbml0VGFsZW50c1RhYmxlKHRoaXMuZmFtb3VzVGFsZW50SW5mb1swXS50YWxlbnRfdHJlZSwgcmVzcG9uc2UubG9nQ291bnQsIDAsIHRoaXMuZmFtb3VzVGFsZW50SW5mb1swXS5waWNrX3JhdGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mbyA9IHJlc3BvbnNlLnRhbGVudFRhYmxlSW5mby5sZW5ndGggPiAwID8gcmVzcG9uc2UudGFsZW50VGFibGVJbmZvIDogdGVzdFRhbGVudHNJbmZvO1xyXG4gICAgICAgIHRoaXMuaW5pdFRhbGVudHNUYWJsZSh0aGlzLmZhbW91c1RhbGVudEluZm8sIHJlc3BvbnNlLmxvZ0NvdW50KTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBpZiAoIW5vQW5pbSkge1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlT3V0Jyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVJbicpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXRLZXlTdG9uZUxldmVsUmFuZ2UoKSB7XHJcbiAgICBjb25zdCBlbGVtTWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJrZXktc3RvbmUtbGV2ZWwtbWluXCIpO1xyXG4gICAgY29uc3QgZWxlbU1heCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwia2V5LXN0b25lLWxldmVsLW1heFwiKTtcclxuICAgIGNvbnN0IGVsZW1UZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJrZXktc3RvbmUtbGV2ZWwtdGV4dFwiKTtcclxuICBcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5lbGVtTWluKS52YWx1ZSA9IGAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW59YDtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5lbGVtTWF4KS52YWx1ZSA9IGAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXh9YDtcclxuICAgIGVsZW1UZXh0LmlubmVyVGV4dCA9IGAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW59IC0gJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4fWA7XHJcbiAgXHJcbiAgICBlbGVtTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU6bnVtYmVyID0gcGFyc2VJbnQoKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS52YWx1ZSk7XHJcbiAgICAgIGlmICh2YWx1ZSA+PSB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4KSB7XHJcbiAgICAgICAgdmFsdWUgPSB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4IC0gMTtcclxuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpLnZhbHVlID0gYCR7dmFsdWV9YDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWluID0gdmFsdWU7XHJcbiAgICAgIGVsZW1UZXh0LmlubmVyVGV4dCA9IGAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW59IC0gJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4fWA7XHJcbiAgICB9KTtcclxuICBcclxuICAgIGVsZW1NaW4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKGUpID0+IHtcclxuICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgZWxlbU1heC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcclxuICAgICAgbGV0IHZhbHVlOm51bWJlciA9IHBhcnNlSW50KCg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCkudmFsdWUpO1xyXG4gICAgICBpZiAodmFsdWUgPD0gdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbikge1xyXG4gICAgICAgIHZhbHVlID0gdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbiArIDE7XHJcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS52YWx1ZSA9IGAke3ZhbHVlfWA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heCA9IHZhbHVlO1xyXG4gICAgICBlbGVtVGV4dC5pbm5lclRleHQgPSBgJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWlufSAtICR7dGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heH1gO1xyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBlbGVtTWF4LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0VGFsZW50c1RhYmxlKHRhbGVudHNJbmZvLCBsb2dDb3VudDogbnVtYmVyLCB0cmVlX2luZGV4PzogbnVtYmVyLCBwaWNrX3JhdGU/OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhbGVudC1wYW5lbC10aXRsZVwiKTtcclxuICAgIGNvbnN0IGVsVHJlZUFjdGlvblBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmVlX21vZGVfYWN0aW9uX3BhbmVsXCIpO1xyXG4gIFxyXG4gICAgaWYgKHRoaXMuc2VhcmNoQ29uZGl0aW9uLnRyZWVfbW9kZSkge1xyXG4gICAgICBpZiAobG9nQ291bnQgPiAwKSB7XHJcbiAgICAgICAgZWxUaXRsZS5pbm5lclRleHQgPSBgTW9zdCBwb3B1bGFyIHRhbGVudCB0cmVlc2A7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxUaXRsZS5pbm5lclRleHQgPSBgV2Ugc3RpbGwgZG9uJ3QgaGF2ZSBhbnkgcnVucyBzY2FubmVkIGZvciB0aGlzYDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBjb25zdCBwaWNrUmF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGlja19yYXRlXCIpO1xyXG4gICAgICBjb25zdCB0cmVlSW5kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyZWVfaW5kZXhcIik7XHJcbiAgXHJcbiAgICAgIGlmICghZWxUcmVlQWN0aW9uUGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGVsVHJlZUFjdGlvblBhbmVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIHBpY2tSYXRlLmlubmVyVGV4dCA9IGBQaWNrIFJhdGUgOiAke3BpY2tfcmF0ZSA/IHBpY2tfcmF0ZSA6IDB9JWA7XHJcbiAgICAgIHRyZWVJbmRleC5pbm5lclRleHQgPSBgJHsodHJlZV9pbmRleCA/IHRyZWVfaW5kZXggOiAwKSArIDF9IC8gJHt0aGlzLmZhbW91c1RhbGVudEluZm8ubGVuZ3RofWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAobG9nQ291bnQgPiAwKSB7XHJcbiAgICAgICAgZWxUaXRsZS5pbm5lclRleHQgPSBgTW9zdCBwb3B1bGFyIHRhbGVudCB0cmVlcyBmb3IgJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5zcGVjc30gJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5jbGFzc30gaW4gJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5yYWlkX2R1bmdlb259YDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlbFRpdGxlLmlubmVyVGV4dCA9IGBXZSBzdGlsbCBkb24ndCBoYXZlIGFueSBydW5zIHNjYW5uZWQgZm9yIHRoaXNgO1xyXG4gICAgICB9XHJcbiAgICAgIGVsVHJlZUFjdGlvblBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YWxlbnQtdGFibGUtY29udGFpbmVyXCIpO1xyXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgY29uc3QgdGFsZW50c1RhYmxlID0gY3JlYXRlVGFsZW50c1RhYmxlKHsgdGFsZW50TGV2ZWxMaXN0OiB0YWxlbnRzSW5mbyB9LCB0aGlzLnNlYXJjaENvbmRpdGlvbi50cmVlX21vZGUgKTtcclxuICBcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0YWxlbnRzVGFibGUpO1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXRJblByb2dyZXNzRXZlbnQoKSB7XHJcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dvcmstaW4tcHJvZ3Jlc3MnKTtcclxuICAgIGNvbnN0IG1lc3NhZ2VQYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyk7XHJcbiAgXHJcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGVsZW1lbnRzKSB7XHJcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gZWwuZ2V0QXR0cmlidXRlKFwibWVzc2FnZVwiKTtcclxuICAgICAgICBtZXNzYWdlUGFuZWwuaW5uZXJIVE1MID0gYDxkaXY+JHttZXNzYWdlfTwvZGl2PmA7XHJcbiAgICAgICAgbWVzc2FnZVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICB2b2lkIG1lc3NhZ2VQYW5lbC5vZmZzZXRXaWR0aDtcclxuICAgICAgICBtZXNzYWdlUGFuZWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0VHJlZU1vZGVBY3Rpb25QYW5lbEV2ZW50KCkge1xyXG4gICAgY29uc3QgZWxUcmVlTW9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlX21vZGUnKTtcclxuICBcclxuICAgIGVsVHJlZU1vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcclxuICAgICAgaWYgKCg8SFRNTElucHV0RWxlbWVudD4oZS50YXJnZXQpKS5jaGVja2VkKSB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24udHJlZV9tb2RlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi50cmVlX21vZGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBjb25zdCBlbFByZXZCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl9wcmV2XCIpO1xyXG4gIFxyXG4gICAgZWxQcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgYW5pbVBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGVudC1hbmltLXBhbmVsJyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVJbicpO1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0Jyk7XHJcbiAgXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleC0tO1xyXG4gICAgICAgIHRoaXMuaW5pdFRhbGVudHNUYWJsZShcclxuICAgICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mb1t0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4XS50YWxlbnRfdHJlZSwgXHJcbiAgICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm9bdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleF0ucGlja19yYXRlLCBcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXgsIFxyXG4gICAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvW3RoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXhdLnBpY2tfcmF0ZVxyXG4gICAgICAgICk7XHJcbiAgXHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVPdXQnKTtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZUluJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIFxyXG4gICAgY29uc3QgZWxOZXh0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5fbmV4dFwiKTtcclxuICBcclxuICAgIGVsTmV4dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4IDwgdGhpcy5mYW1vdXNUYWxlbnRJbmZvLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICBjb25zdCBhbmltUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsZW50LWFuaW0tcGFuZWwnKTtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZUluJyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXQnKTtcclxuICBcclxuICAgICAgICB0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4Kys7XHJcbiAgICAgICAgdGhpcy5pbml0VGFsZW50c1RhYmxlKFxyXG4gICAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvW3RoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXhdLnRhbGVudF90cmVlLCBcclxuICAgICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mb1t0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4XS5waWNrX3JhdGUsIFxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleCwgXHJcbiAgICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm9bdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleF0ucGlja19yYXRlXHJcbiAgICAgICAgKTtcclxuICBcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZU91dCcpO1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlSW4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBjb25zdCBlbFJlZnJlc2hCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl9yZWZyZXNoXCIpO1xyXG4gICAgaWYgKGVsUmVmcmVzaEJ1dHRvbikge1xyXG4gICAgICBlbFJlZnJlc2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBwcml2YXRlIHNldFN3aXRjaFZhbHVlKGlzX2R1bmdlb246IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFpZF9kdW5nZW9uLXN3aXRjaF9fY29udGFpbmVyXCIpO1xyXG4gICAgdGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2VvbiA9IGlzX2R1bmdlb247XHJcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhJywgdGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2VvbiA/ICdkdW5nZW9uJyA6ICdyYWlkJyk7XHJcbiAgICB0aGlzLnJlbG9hZFJhaWREdW5nZW9uRHJvcGRvd24oKTtcclxuICBcclxuICAgIGNvbnN0IHJhbmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2VyX19jb250YWluZXJcIik7XHJcbiAgICBjb25zdCByYWlkTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImtleV9sZXZlbC1zZWxlY3QtYm94X19jb250YWluZXJcIik7XHJcbiAgICBjb25zdCByYWlkQm9zcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFpZF9ib3NzLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiKTtcclxuICBcclxuICAgIHJhbmdlci5zdHlsZS5kaXNwbGF5ID0gaXNfZHVuZ2VvbiA/ICdibG9jaycgOiAnbm9uZSc7XHJcbiAgICByYWlkTGV2ZWwuc3R5bGUuZGlzcGxheSA9IGlzX2R1bmdlb24gPyAnbm9uZScgOiAnYmxvY2snO1xyXG4gICAgcmFpZEJvc3Muc3R5bGUuZGlzcGxheSA9IGlzX2R1bmdlb24gPyAnbm9uZScgOiAnYmxvY2snO1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXRTd2l0Y2goKSB7XHJcbiAgICB0aGlzLnNldFN3aXRjaFZhbHVlKHRydWUpO1xyXG4gIFxyXG4gICAgY29uc3QgZWxTd2l0Y2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhaWRfZHVuZ2Vvbi1zd2l0Y2hcIik7XHJcbiAgICBjb25zdCBlbFN3aXRjaER1bmdlb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN3aXRjaF9kdW5nZW9uXCIpO1xyXG4gICAgY29uc3QgZWxTd2l0Y2hSYWlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzd2l0Y2hfcmFpZFwiKTtcclxuICBcclxuICAgIGVsU3dpdGNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnNldFN3aXRjaFZhbHVlKCF0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uKTtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgZWxTd2l0Y2hEdW5nZW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnNldFN3aXRjaFZhbHVlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBlbFN3aXRjaFJhaWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3dpdGNoVmFsdWUoZmFsc2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBBcHBXaW5kb3cgfSBmcm9tIFwiLi4vQXBwV2luZG93XCI7XHJcbmltcG9ydCB7IE9XSG90a2V5cyB9IGZyb20gXCJAb3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzXCI7XHJcbmltcG9ydCB7IGhvdGtleXMsIHdpbmRvd05hbWVzLCB3b3dDbGFzc0lkIH0gZnJvbSBcIi4uL2NvbnN0c1wiO1xyXG5cclxuaW1wb3J0IHtcclxuICBzZXRBdXRoVG9rZW4sXHJcbiAgZ2V0VG9rZW4sXHJcbiAgZ2V0Q2hhcmFjdGVycyxcclxuICBnZXRKb3VybmFscyxcclxuICBzdG9yZUpvdXJuYWxzLFxyXG4gIHVwZGF0ZUpvdXJuYWxzLFxyXG4gIHN0b3JlSm91cm5hbENvbnRlbnQsXHJcbiAgZGVsZXRlSm91cm5hbENvbnRlbnQsXHJcbiAgZWRpdEpvdXJuYWxDb250ZW50LFxyXG4gIGRlbGV0ZUpvdXJuYWxcclxufSBmcm9tIFwiLi4vdXRpbHMvYXBpXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXJJbmZvIGZyb20gXCIuLi91dGlscy9jaGFyYWN0ZXJJbmZvXCI7XHJcbmltcG9ydCBUYWxlbnRQaWNrZXIgZnJvbSBcIi4uL3V0aWxzL3RhbGVudFBpY2tlclwiO1xyXG5cclxuLy8gVGhlIGRlc2t0b3Agd2luZG93IGlzIHRoZSB3aW5kb3cgZGlzcGxheWVkIHdoaWxlIEZvcnRuaXRlIGlzIG5vdCBydW5uaW5nLlxyXG4vLyBJbiBvdXIgY2FzZSwgb3VyIGRlc2t0b3Agd2luZG93IGhhcyBubyBsb2dpYyAtIGl0IG9ubHkgZGlzcGxheXMgc3RhdGljIGRhdGEuXHJcbi8vIFRoZXJlZm9yZSwgb25seSB0aGUgZ2VuZXJpYyBBcHBXaW5kb3cgY2xhc3MgaXMgY2FsbGVkLlxyXG5cclxuY29uc3QgQ0xJRU5UX0lEID0gXCI3NjZiOGFhYjdmM2Y0NDA2YTVkNDg0NGY1YTBjNmJkN1wiO1xyXG5jb25zdCBBVVRIT1JJWkVfRU5EUE9JTlQgPSBcImh0dHBzOi8vZXUuYmF0dGxlLm5ldC9vYXV0aC9hdXRob3JpemVcIjtcclxuLy8gY29uc3QgcmVkaXJlY3RVcmkgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwL29hdXRoL2NhbGxiYWNrX292ZXJ3b2xmJztcclxuY29uc3QgcmVkaXJlY3RVcmkgPSBcImh0dHBzOi8vd293bWUuZ2cvb2F1dGgvY2FsbGJhY2tfb3ZlcndvbGZcIjtcclxuY29uc3Qgc2NvcGUgPSBbXCJ3b3cucHJvZmlsZVwiLCBcIm9wZW5pZFwiXTtcclxuXHJcbmNvbnN0IGRpc2NvcmRVUkwgPSBcImh0dHBzOi8vZGlzY29yZC5nZy9yeWc5Q3p6cjhaXCI7XHJcblxyXG5jbGFzcyBEZXNrdG9wIGV4dGVuZHMgQXBwV2luZG93IHtcclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IERlc2t0b3A7XHJcbiAgcHJpdmF0ZSBpc0xvZ2dlZEluOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBiYXR0bGVUYWc6IHN0cmluZztcclxuICBwcml2YXRlIGNoYXJhY3RlcnM6IFtdO1xyXG4gIHByaXZhdGUgcmVnaW9uOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBjaGFyYWN0ZXJJbmZvOiBDaGFyYWN0ZXJJbmZvO1xyXG4gIHByaXZhdGUgdGFsZW50UGlja2VyOiBUYWxlbnRQaWNrZXI7XHJcblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcih3aW5kb3dOYW1lcy5kZXNrdG9wKTtcclxuXHJcbiAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XHJcbiAgICBjb25zdCBleHBpcmVzSW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImV4cGlyZXNJblwiKTtcclxuXHJcbiAgICBpZiAodG9rZW4gJiYgcGFyc2VJbnQoZXhwaXJlc0luKSA+IERhdGUubm93KCkpIHtcclxuICAgICAgdGhpcy5iYXR0bGVUYWcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJhdHRsZVRhZ1wiKTtcclxuICAgICAgdGhpcy5yZWdpb24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZ2lvblwiKTtcclxuXHJcbiAgICAgIHNldEF1dGhUb2tlbih0b2tlbik7XHJcbiAgICAgIHRoaXMuZ2V0VXNlckNoYXJhY3RlckluZm8oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidG9rZW5cIik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZXhwaXJlc0luXCIpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImJhdHRsZVRhZ1wiKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJyZWdpb25cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0QnV0dG9uRXZlbnRzKCk7XHJcbiAgICBvdmVyd29sZi5leHRlbnNpb25zLm9uQXBwTGF1bmNoVHJpZ2dlcmVkLmFkZExpc3RlbmVyKHRoaXMuY2FsbGJhY2tPQXV0aCk7XHJcblxyXG4gICAgdGhpcy50YWxlbnRQaWNrZXIgPSBuZXcgVGFsZW50UGlja2VyKCk7XHJcbiAgICB0aGlzLnRhbGVudFBpY2tlci5pbml0Q29tcG9uZW50cygpO1xyXG4gICAgdGhpcy5pbml0U2V0dGluZ3NQYW5lbCgpO1xyXG4gICAgdGhpcy5nZXRVc2VySm91cm5hbHMoKTtcclxuICAgIHRoaXMuc3RvcmVVc2VySm91cm5hbHMoKTtcclxuICAgIHRoaXMudXBkYXRlVXNlckpvdXJuYWxzKCk7XHJcbiAgICB0aGlzLnN0b3JlVXNlckpvdXJuYWxDb250ZW50KCk7XHJcbiAgICB0aGlzLnVwZGF0ZVVzZXJKb3VybmFsQ29udGVudCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldEJhdHRsZVRhZyhiYXR0bGVUYWcpIHtcclxuICAgIHRoaXMuYmF0dGxlVGFnID0gYmF0dGxlVGFnO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldENoYXJhY3RlcnMoY2hhcmFjdGVycykge1xyXG4gICAgdGhpcy5jaGFyYWN0ZXJzID0gY2hhcmFjdGVycztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRSZWdpb24ocmVnaW9uKSB7XHJcbiAgICB0aGlzLnJlZ2lvbiA9IHJlZ2lvbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdEJ1dHRvbkV2ZW50cygpIHtcclxuICAgIC8vIExvZ2luXHJcbiAgICBjb25zdCBsb2dpbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLWxvZ2luXCIpO1xyXG4gICAgbG9naW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNjb3Blc1N0cmluZyA9IGVuY29kZVVSSUNvbXBvbmVudChzY29wZS5qb2luKFwiIFwiKSk7XHJcbiAgICAgIGNvbnN0IHJlZGlyZWN0VXJpU3RyaW5nID0gZW5jb2RlVVJJQ29tcG9uZW50KHJlZGlyZWN0VXJpKTtcclxuICAgICAgY29uc3QgYXV0aG9yaXplVXJsID0gYCR7QVVUSE9SSVpFX0VORFBPSU5UfT9jbGllbnRfaWQ9JHtDTElFTlRfSUR9JnNjb3BlPSR7c2NvcGVzU3RyaW5nfSZyZWRpcmVjdF91cmk9JHtyZWRpcmVjdFVyaVN0cmluZ30mcmVzcG9uc2VfdHlwZT1jb2RlYDtcclxuICAgICAgb3ZlcndvbGYudXRpbHMub3BlblVybEluRGVmYXVsdEJyb3dzZXIoYXV0aG9yaXplVXJsKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIE1haW4gTWVudVxyXG4gICAgY29uc3QgbWVudUl0ZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1lbnUtaXRlbVwiKTtcclxuICAgIEFycmF5LmZyb20obWVudUl0ZW1zKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaW4tcHJvZ3Jlc3NcIikpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW0uaWQgPT09IFwiYnRuLWxvZ291dFwiKSB7XHJcbiAgICAgICAgICB0aGlzLmlzTG9nZ2VkSW4gPSBmYWxzZTtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZXhwaXJlc0luXCIpO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJiYXR0bGVUYWdcIik7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInRva2VuXCIpO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJyZWdpb25cIik7XHJcblxyXG4gICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiZW5hYmxlZFwiKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmRyYXdVc2VySW5mbygpO1xyXG4gICAgICAgICAgdGhpcy5kcmF3U3ViUGFuZWwoKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFycmF5LmZyb20obWVudUl0ZW1zKS5mb3JFYWNoKChlbGVtMSkgPT4ge1xyXG4gICAgICAgICAgZWxlbTEuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGVsTWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblwiKTtcclxuICAgICAgICBlbE1haW4uY2xhc3NOYW1lID0gZWxlbS5nZXRBdHRyaWJ1dGUoXCJwYWdlLXR5cGVcIik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGlzY29yZFxyXG4gICAgY29uc3QgZGlzY29yZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlzY29yZEJ1dHRvblwiKTtcclxuICAgIGRpc2NvcmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgIG92ZXJ3b2xmLnV0aWxzLm9wZW5VcmxJbkRlZmF1bHRCcm93c2VyKGRpc2NvcmRVUkwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHNldEN1cnJlbnRIb3RrZXlUb0lucHV0KCkge1xyXG4gICAgY29uc3QgZWxJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG90a2V5LWVkaXRvclwiKTtcclxuICAgIGNvbnN0IGhvdGtleVRleHQgPSBhd2FpdCBPV0hvdGtleXMuZ2V0SG90a2V5VGV4dChcclxuICAgICAgaG90a2V5cy50b2dnbGUsXHJcbiAgICAgIHdvd0NsYXNzSWRcclxuICAgICk7XHJcbiAgICBlbElucHV0LmlubmVyVGV4dCA9IGhvdGtleVRleHQ7XHJcbiAgICByZXR1cm4gaG90a2V5VGV4dDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdEhvdGtleUlucHV0KCkge1xyXG4gICAgdGhpcy5zZXRDdXJyZW50SG90a2V5VG9JbnB1dCgpO1xyXG5cclxuICAgIGNvbnN0IGVsSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvdGtleS1lZGl0b3JcIik7XHJcbiAgICBjb25zdCBlbENsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3RrZXktY2xvc2VcIik7XHJcblxyXG4gICAgbGV0IGtleXMgPSBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl07XHJcblxyXG4gICAgZWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKGUpID0+IHtcclxuICAgICAgZWxJbnB1dC5pbm5lclRleHQgPSBcIkNob29zZSBLZXlcIjtcclxuICAgICAga2V5cyA9IFtcIlwiLCBcIlwiLCBcIlwiLCBcIlwiXTtcclxuICAgIH0pO1xyXG5cclxuICAgIGVsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3Vzb3V0XCIsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMuc2V0Q3VycmVudEhvdGtleVRvSW5wdXQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGVsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJrZXlkb3duXCIsIGUua2V5LCBlLm1ldGFLZXksIGUuc2hpZnRLZXksIGUuYWx0S2V5LCBlLmN0cmxLZXkpO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmIChlLmtleSA9PT0gXCJTaGlmdFwiKSB7XHJcbiAgICAgICAga2V5c1syXSA9IFwiU2hpZnQrXCI7XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IFwiQWx0XCIpIHtcclxuICAgICAgICBrZXlzWzBdID0gXCJBbHQrXCI7XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IFwiQ29udHJvbFwiKSB7XHJcbiAgICAgICAga2V5c1sxXSA9IFwiQ3RybCtcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBrZXlzWzNdID0gZS5rZXk7XHJcbiAgICAgICAgY29uc3QgbmV3SG90a2V5ID0ge1xyXG4gICAgICAgICAgbmFtZTogaG90a2V5cy50b2dnbGUsXHJcbiAgICAgICAgICBnYW1lSWQ6IDc2NSxcclxuICAgICAgICAgIHZpcnR1YWxLZXk6IGUua2V5Q29kZSxcclxuICAgICAgICAgIG1vZGlmaWVyczoge1xyXG4gICAgICAgICAgICBjdHJsOiBlLmN0cmxLZXksXHJcbiAgICAgICAgICAgIHNoaWZ0OiBlLnNoaWZ0S2V5LFxyXG4gICAgICAgICAgICBhbHQ6IGUuYWx0S2V5LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGVsQ2xvc2UuZm9jdXMoKTtcclxuICAgICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLmFzc2lnbihuZXdIb3RrZXksIChlKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImFzc2lnbjogXCIsIG5ld0hvdGtleSwgZSk7XHJcbiAgICAgICAgICB0aGlzLnNldEN1cnJlbnRIb3RrZXlUb0lucHV0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxJbnB1dC5pbm5lclRleHQgPSBrZXlzLmpvaW4oXCJcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBlbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwia2V5dXBcIiwgZS5rZXksIGUubWV0YUtleSwgZS5zaGlmdEtleSwgZS5hbHRLZXksIGUuY3RybEtleSk7XHJcbiAgICAgIGlmIChlLmtleSA9PT0gXCJTaGlmdFwiKSB7XHJcbiAgICAgICAga2V5c1syXSA9IFwiXCI7XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IFwiQWx0XCIpIHtcclxuICAgICAgICBrZXlzWzBdID0gXCJcIjtcclxuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJDb250cm9sXCIpIHtcclxuICAgICAgICBrZXlzWzFdID0gXCJcIjtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBzdHJIb3RrZXkgPSBrZXlzLmpvaW4oXCJcIik7XHJcbiAgICAgIGVsSW5wdXQuaW5uZXJUZXh0ID0gc3RySG90a2V5ID09PSBcIlwiID8gXCJDaG9vc2UgS2V5XCIgOiBzdHJIb3RrZXk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBlbENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBob3RrZXkgPSB7XHJcbiAgICAgICAgbmFtZTogaG90a2V5cy50b2dnbGUsXHJcbiAgICAgICAgZ2FtZUlkOiA3NjUsXHJcbiAgICAgIH07XHJcbiAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMudW5hc3NpZ24oaG90a2V5LCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudEhvdGtleVRvSW5wdXQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdFNldHRpbmdzUGFuZWwoKSB7XHJcbiAgICB0aGlzLmluaXRIb3RrZXlJbnB1dCgpO1xyXG5cclxuICAgIGNvbnN0IGJ0bkNvcHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1jb3B5LXNvY2lhbC11cmxcIik7XHJcbiAgICBidG5Db3B5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBlbFNvY2lhbFVybCA9IDxIVE1MSW5wdXRFbGVtZW50PihcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXNvY2lhbC11cmxcIilcclxuICAgICAgKTtcclxuICAgICAgZWxTb2NpYWxVcmwuZm9jdXMoKTtcclxuICAgICAgZWxTb2NpYWxVcmwuc2VsZWN0KCk7XHJcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiY29weVwiKTtcclxuICAgICAgZWxTb2NpYWxVcmwuc2VsZWN0aW9uU3RhcnQgPSAwO1xyXG4gICAgICBlbFNvY2lhbFVybC5zZWxlY3Rpb25FbmQgPSAwO1xyXG4gICAgICBidG5Db3B5LmZvY3VzKCk7XHJcbiAgICAgIGJ0bkNvcHkuY2xhc3NMaXN0LnJlbW92ZShcImNvcGllZFwiKTtcclxuICAgICAgdm9pZCBidG5Db3B5Lm9mZnNldFdpZHRoO1xyXG4gICAgICBidG5Db3B5LmNsYXNzTGlzdC5hZGQoXCJjb3BpZWRcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBlbFN3aXRjaEdhbWVTdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImF1dG8tbGF1bmNoLXdoZW4tZ2FtZS1zdGFydHNcIlxyXG4gICAgKTtcclxuICAgIGxldCBzd2l0Y2hWYWx1ZUdhbWVTdGFydCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFxyXG4gICAgICBcImF1dG8tbGF1bmNoLXdoZW4tZ2FtZS1zdGFydHNcIlxyXG4gICAgKTtcclxuICAgIGlmIChzd2l0Y2hWYWx1ZUdhbWVTdGFydCAhPT0gXCJmYWxzZVwiKSB7XHJcbiAgICAgIHN3aXRjaFZhbHVlR2FtZVN0YXJ0ID0gXCJ0cnVlXCI7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgIFwiYXV0by1sYXVuY2gtd2hlbi1nYW1lLXN0YXJ0c1wiLFxyXG4gICAgICAgIHN3aXRjaFZhbHVlR2FtZVN0YXJ0XHJcbiAgICAgICk7XHJcbiAgICAgIGVsU3dpdGNoR2FtZVN0YXJ0LnNldEF0dHJpYnV0ZShcImRhdGFcIiwgXCJZZXNcIik7XHJcbiAgICB9XHJcbiAgICBlbFN3aXRjaEdhbWVTdGFydC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgc3dpdGNoVmFsdWVHYW1lU3RhcnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcclxuICAgICAgICBcImF1dG8tbGF1bmNoLXdoZW4tZ2FtZS1zdGFydHNcIlxyXG4gICAgICApO1xyXG4gICAgICBpZiAoc3dpdGNoVmFsdWVHYW1lU3RhcnQgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgc3dpdGNoVmFsdWVHYW1lU3RhcnQgPSBcImZhbHNlXCI7XHJcbiAgICAgICAgZWxTd2l0Y2hHYW1lU3RhcnQuc2V0QXR0cmlidXRlKFwiZGF0YVwiLCBcIlwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2l0Y2hWYWx1ZUdhbWVTdGFydCA9IFwidHJ1ZVwiO1xyXG4gICAgICAgIGVsU3dpdGNoR2FtZVN0YXJ0LnNldEF0dHJpYnV0ZShcImRhdGFcIiwgXCJZZXNcIik7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgXCJhdXRvLWxhdW5jaC13aGVuLWdhbWUtc3RhcnRzXCIsXHJcbiAgICAgICAgc3dpdGNoVmFsdWVHYW1lU3RhcnRcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGVsU3dpdGNoR2FtZUVuZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvdy1hcHAtd2hlbi1nYW1lLWVuZHNcIik7XHJcbiAgICBsZXQgc3dpdGNoVmFsdWVHYW1lRW5kID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaG93LWFwcC13aGVuLWdhbWUtZW5kc1wiKTtcclxuICAgIGlmIChzd2l0Y2hWYWx1ZUdhbWVFbmQgIT09IFwiZmFsc2VcIikge1xyXG4gICAgICBzd2l0Y2hWYWx1ZUdhbWVFbmQgPSBcInRydWVcIjtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaG93LWFwcC13aGVuLWdhbWUtZW5kc1wiLCBzd2l0Y2hWYWx1ZUdhbWVFbmQpO1xyXG4gICAgICBlbFN3aXRjaEdhbWVFbmQuc2V0QXR0cmlidXRlKFwiZGF0YVwiLCBcIlllc1wiKTtcclxuICAgIH1cclxuICAgIGVsU3dpdGNoR2FtZUVuZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgc3dpdGNoVmFsdWVHYW1lRW5kID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaG93LWFwcC13aGVuLWdhbWUtZW5kc1wiKTtcclxuICAgICAgaWYgKHN3aXRjaFZhbHVlR2FtZUVuZCA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICBzd2l0Y2hWYWx1ZUdhbWVFbmQgPSBcImZhbHNlXCI7XHJcbiAgICAgICAgZWxTd2l0Y2hHYW1lRW5kLnNldEF0dHJpYnV0ZShcImRhdGFcIiwgXCJcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoVmFsdWVHYW1lRW5kID0gXCJ0cnVlXCI7XHJcbiAgICAgICAgZWxTd2l0Y2hHYW1lRW5kLnNldEF0dHJpYnV0ZShcImRhdGFcIiwgXCJZZXNcIik7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaG93LWFwcC13aGVuLWdhbWUtZW5kc1wiLCBzd2l0Y2hWYWx1ZUdhbWVFbmQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGNhbGxiYWNrT0F1dGgodXJsc2NoZW1lKSB7XHJcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLW92ZXJsYXlcIik7XHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChkZWNvZGVVUklDb21wb25lbnQodXJsc2NoZW1lLnBhcmFtZXRlcikpO1xyXG4gICAgY29uc3QgY29kZSA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwiY29kZVwiKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldFRva2VuKHsgY29kZSwgaXNPdmVyd29sZjogdHJ1ZSB9KTtcclxuICAgICAgY29uc3QgdG9rZW4gPSB1c2VySW5mby50b2tlbjtcclxuICAgICAgY29uc3QgZXhwaXJlc0luID0gRGF0ZS5ub3coKSArIHVzZXJJbmZvLmV4cGlyZXNJbiAqIDEwMDA7XHJcblxyXG4gICAgICBjb25zdCBkZXNrdG9wID0gRGVza3RvcC5pbnN0YW5jZSgpO1xyXG5cclxuICAgICAgZGVza3RvcC5zZXRCYXR0bGVUYWcodXNlckluZm8uYmF0dGxlVGFnKTtcclxuICAgICAgZGVza3RvcC5zZXRDaGFyYWN0ZXJzKHVzZXJJbmZvLmNoYXJhY3RlcnMpO1xyXG4gICAgICBkZXNrdG9wLnNldFJlZ2lvbih1c2VySW5mby5yZWdpb24pO1xyXG5cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCB0b2tlbik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZXhwaXJlc0luXCIsIGV4cGlyZXNJbi50b1N0cmluZygpKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJiYXR0bGVUYWdcIiwgdXNlckluZm8uYmF0dGxlVGFnKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyZWdpb25cIiwgdXNlckluZm8ucmVnaW9uKTtcclxuXHJcbiAgICAgIGRlc2t0b3Aub25Mb2dnZWRJbigpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH1cclxuXHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGdldFVzZXJDaGFyYWN0ZXJJbmZvKCkge1xyXG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZy1vdmVybGF5XCIpO1xyXG4gICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0Q2hhcmFjdGVycygpO1xyXG5cclxuICAgIHRoaXMucmVnaW9uID0gcmVzcG9uc2UucmVnaW9uO1xyXG4gICAgdGhpcy5jaGFyYWN0ZXJzID0gcmVzcG9uc2UuY2hhcmFjdGVycztcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY2hhcmFjdGVycyk7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJlZ2lvblwiLCB0aGlzLnJlZ2lvbik7XHJcbiAgICB0aGlzLm9uTG9nZ2VkSW4oKTtcclxuXHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGdldFVzZXJKb3VybmFscygpIHtcclxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGdldEpvdXJuYWxzKCk7XHJcbiAgICBjb25zdCBqb3VybmFsTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbC10YWJzXCIpO1xyXG5cclxuICAgIC8vIGxldCBjb3VudCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3BvbnNlPy5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwibG9vcCBzdGFydGVkXCIsIGkpO1xyXG4gICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBidG4uaW5uZXJIVE1MID0gcmVzcG9uc2UuZGF0YVtpXS5uYW1lO1xyXG4gICAgICBidG4uc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCByZXNwb25zZS5kYXRhW2ldLl9pZCk7XHJcbiAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwidGFiLWxpbmtcIik7XHJcbiAgICAgIGxldCBkZWxldGVTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgIGRlbGV0ZVNwYW4uY2xhc3NMaXN0LmFkZChcIm1hdGVyaWFsLWljb25zXCIpXHJcbiAgICAgIGRlbGV0ZVNwYW4uY2xhc3NMaXN0LmFkZChcInRleHRTcGFuMlwiKVxyXG4gICAgICBkZWxldGVTcGFuLmlubmVySFRNTCA9IFwiZGVsZXRlXCJcclxuICAgICAgam91cm5hbExpc3QuYXBwZW5kQ2hpbGQoYnRuKTtcclxuICAgICAgYnRuLmFwcGVuZENoaWxkKGRlbGV0ZVNwYW4pXHJcblxyXG5cclxuICAgICAgdmFyIGVkaXRKb3VybmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgIGVkaXRKb3VybmVsLmNsYXNzTGlzdC5hZGQoXCJtYXRlcmlhbC1pY29uc1wiKVxyXG4gICAgICBlZGl0Sm91cm5lbC5jbGFzc0xpc3QuYWRkKFwiZWRpdFNwYW4yXCIpXHJcbiAgICAgIGVkaXRKb3VybmVsLmlubmVySFRNTCA9IFwiZWRpdFwiXHJcbiAgICAgIGJ0bi5hcHBlbmRDaGlsZChlZGl0Sm91cm5lbClcclxuXHJcbiAgICAgIGVkaXRKb3VybmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtam91cm5lbFwiKTtcclxuICAgICAgICBpZiAoZWxlbXMgIT09IG51bGwpIHtcclxuICAgICAgICAgIGVsZW1zLmNsYXNzTGlzdC5yZW1vdmUoXCJlZGl0LWpvdXJuZWxcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJlZGl0LWpvdXJuZWxcIik7XHJcbiAgICAgICAgY29uc3QgZWRpdE1vZGFsT3BlbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlCdG5FZGl0XCIpO1xyXG4gICAgICAgIGVkaXRNb2RhbE9wZW5CdXR0b24uY2xpY2soKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIiwgcmVzcG9uc2UuZGF0YVtpXS5uYW1lKTtcclxuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0MlwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IHJlc3BvbnNlLmRhdGFbaV0ubmFtZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9iamVjdFwiLCByZXNwb25zZS5kYXRhW2ldKVxyXG4gICAgICAgIGNvbnN0IGNiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY2NlcHRcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBjYi52YWx1ZSA9IHJlc3BvbnNlLmRhdGFbaV0udGVtcGxhdGU7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBkZWxldGVTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgZGVsZXRlSm91cm5hbChyZXNwb25zZS5kYXRhW2ldLl9pZCk7XHJcbiAgICAgICAgY29uc3Qgb2xkSm91cm5hbExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91cm5hbC10YWJzJyk7XHJcbiAgICAgICAgb2xkSm91cm5hbExpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgcmVzcG9uc2UuZGF0YSA9IFtdO1xyXG4gICAgICAgIHRoaXMuZ2V0VXNlckpvdXJuYWxzKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgIFwiam91cm5hbC1pdGVtLWNvbnRhaW5lclwiXHJcbiAgICAgICAgKTtcclxuICAgICAgICBqb3VybmFsQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XHJcbiAgICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdGFiXCIpO1xyXG4gICAgICAgIGlmIChlbGVtcyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgZWxlbXMuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZS10YWJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlLXRhYlwiKTtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZEpvdXJuYWwgPSByZXNwb25zZS5kYXRhW2ldO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2UgZGF0YVwiLCByZXNwb25zZS5kYXRhKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhpLCBzZWxlY3RlZEpvdXJuYWwpO1xyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgIFwiam91cm5hbC1pdGVtLWNvbnRhaW5lclwiXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgam91cm5hbENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHNlbGVjdGVkSm91cm5hbC5kYXRhLmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGpvdXJuYWxJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgIGpvdXJuYWxJdGVtLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgZWxlbWVudC5faWQpO1xyXG4gICAgICAgICAgam91cm5hbEl0ZW0uY2xhc3NMaXN0LmFkZChcImpvdXJuYWwtaXRlbVwiKTtcclxuICAgICAgICAgIGNvbnN0IGpvdXJuYWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgam91cm5hbEJ0bi5pbm5lckhUTUwgPSBlbGVtZW50LnRpdGxlO1xyXG4gICAgICAgICAgdmFyIHRleHRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICB0ZXh0U3Bhbi5jbGFzc0xpc3QuYWRkKFwibWF0ZXJpYWwtaWNvbnNcIilcclxuICAgICAgICAgIHRleHRTcGFuLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0U3BhblwiKVxyXG4gICAgICAgICAgdGV4dFNwYW4uaW5uZXJIVE1MID0gXCJkZWxldGVcIlxyXG4gICAgICAgICAgam91cm5hbEJ0bi5hcHBlbmRDaGlsZCh0ZXh0U3BhbilcclxuICAgICAgICAgIGNvbnN0IGpvdXJuYWxEZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcblxyXG5cclxuICAgICAgICAgIHZhciBlZGl0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgZWRpdFNwYW4uY2xhc3NMaXN0LmFkZChcIm1hdGVyaWFsLWljb25zXCIpXHJcbiAgICAgICAgICBlZGl0U3Bhbi5jbGFzc0xpc3QuYWRkKFwiZWRpdFNwYW5cIilcclxuICAgICAgICAgIGVkaXRTcGFuLmlubmVySFRNTCA9IFwiZWRpdFwiXHJcbiAgICAgICAgICBqb3VybmFsQnRuLmFwcGVuZENoaWxkKGVkaXRTcGFuKVxyXG5cclxuICAgICAgICAgIGpvdXJuYWxCdG4uY2xhc3NMaXN0LmFkZChcImFjY29yZGlvblwiKTtcclxuICAgICAgICAgIGlmIChqb3VybmFsRGVzYy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHtcclxuICAgICAgICAgICAgam91cm5hbERlc2MuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgam91cm5hbERlc2MuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGpvdXJuYWxEZXNjLmlubmVySFRNTCA9IGVsZW1lbnQuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgIGpvdXJuYWxEZXNjLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgam91cm5hbEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoam91cm5hbERlc2MuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSB7XHJcbiAgICAgICAgICAgICAgam91cm5hbERlc2MuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICBqb3VybmFsRGVzYy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGpvdXJuYWxEZXNjLmlubmVySFRNTCA9IGVsZW1lbnQuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgam91cm5hbERlc2MuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZWRpdFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLWNvbnRlbnRcIik7XHJcbiAgICAgICAgICAgIGlmIChlbGVtcyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIGVsZW1zLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtY29udGVudFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmUtY29udGVudFwiKTtcclxuICAgICAgICAgICAgY29uc3QgbW9kYWxPcGVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0Q29udGVudEJ1dHRvblwiKTtcclxuICAgICAgICAgICAgbW9kYWxPcGVuQnV0dG9uLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRDb250ZW50VGl0bGVcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBlbGVtZW50LnRpdGxlO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRFZGl0b3JcIikuaW5uZXJIVE1MID0gZWxlbWVudC5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgdGV4dFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdGFiXCIpO1xyXG4gICAgICAgICAgICBsZXQgZGF0YUlEID0gZWxlbXMuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJylcclxuICAgICAgICAgICAgZGVsZXRlSm91cm5hbENvbnRlbnQoZGF0YUlELCBlbGVtZW50Ll9pZCk7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke2VsZW1lbnQuX2lkfVwiXWApO1xyXG4gICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IHJlc3BvbnNlLmRhdGFbaV0uZGF0YTtcclxuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQuZmlsdGVyKChjb24pID0+IGNvbi5faWQgIT0gZWxlbWVudC5faWQpO1xyXG4gICAgICAgICAgICByZXNwb25zZS5kYXRhW2ldLmRhdGEgPSBjb250ZW50O1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIGpvdXJuYWxJdGVtLmFwcGVuZENoaWxkKGpvdXJuYWxCdG4pO1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgam91cm5hbEl0ZW0uYXBwZW5kQ2hpbGQoam91cm5hbERlc2MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgam91cm5hbENvbnRhaW5lci5hcHBlbmRDaGlsZChqb3VybmFsSXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBzdG9yZVVzZXJKb3VybmFscygpIHtcclxuICAgIGNvbnN0IHNhdmVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmVCdXR0b25cIilcclxuXHJcbiAgICBzYXZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBpbnB1dFZhbCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXRcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgIGNvbnN0IGNiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY2NlcHRcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgLy8gY29uc3QgY2hlY2sgPSBjYi5jaGVja2VkXHJcbiAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgYmF0dGxlSWQ6IFwiYTIzMmRmM2RmYWZhMjEzXCIsXHJcbiAgICAgICAgbmFtZTogaW5wdXRWYWwsXHJcbiAgICAgICAgLy8gdGVtcGxhdGU6IGNoZWNrLFxyXG4gICAgICB9XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc3RvcmVKb3VybmFscyhkYXRhKTtcclxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcclxuICAgICAgICBjb25zdCBqb3VybmFsTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbC10YWJzXCIpO1xyXG4gICAgICAgIGpvdXJuYWxMaXN0LmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZ2V0VXNlckpvdXJuYWxzKCk7XHJcbiAgICAgICAgbGV0IGJ0dG5uMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWlkPVwiJHtyZXNwb25zZS5kYXRhLl9pZH1cIl1gKTtcclxuICAgICAgICBpZiAoKGJ0dG5uMiBhcyBIVE1MRWxlbWVudCkpIHtcclxuICAgICAgICAgIChidHRubjIgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgICAgICB9XHJcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlJbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIikgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG5cclxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZVVzZXJKb3VybmFscygpIHtcclxuICAgIGNvbnN0IHNhdmVCdXR0b25FZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU1vZGFsMlNhdmVcIilcclxuXHJcbiAgICBzYXZlQnV0dG9uRWRpdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGUpID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJmcm9tIHNhdmVCdXR0b25cIik7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGlucHV0VmFsID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlJbnB1dDJcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgIGNvbnN0IGNiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY2NlcHRcIikgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgLy8gY29uc3QgY2hlY2sgPSBjYi5jaGVja2VkXHJcbiAgICAgIGxldCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LWpvdXJuZWxcIik7XHJcbiAgICAgIGNvbnN0IGNvbnRlbnRJRCA9IGNvbnRlbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKVxyXG4gICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgIGJhdHRsZUlkOiBcImEyMzJkZjNkZmFmYTIxM1wiLFxyXG4gICAgICAgIG5hbWU6IGlucHV0VmFsLFxyXG4gICAgICAgIC8vIHRlbXBsYXRlOiBjaGVjayxcclxuICAgICAgfVxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHVwZGF0ZUpvdXJuYWxzKGNvbnRlbnRJRCwgZGF0YSk7XHJcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgY29uc3Qgam91cm5hbExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWwtdGFic1wiKTtcclxuICAgICAgICBqb3VybmFsTGlzdC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICBhd2FpdCB0aGlzLmdldFVzZXJKb3VybmFscygpO1xyXG4gICAgICAgIGxldCBidHRubjIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pZD1cIiR7cmVzcG9uc2UuZGF0YS5faWR9XCJdYCk7XHJcbiAgICAgICAgaWYgKChidHRubjIgYXMgSFRNTEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAoYnR0bm4yIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXQyXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5teU1vZGFsMkNsb3NlXCIpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBzdG9yZVVzZXJKb3VybmFsQ29udGVudCgpIHtcclxuICAgIGNvbnN0IHNhdmVDb250ZW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50c2F2ZUJ1dHRvblwiKVxyXG5cclxuICAgIHNhdmVDb250ZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLXRhYlwiKTtcclxuICAgICAgY29uc3QgaWQgPSBlbGVtcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpXHJcbiAgICAgIGxldCBjb250ZW50VGl0bGUgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50VGl0bGVcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgIGNvbnN0IGh0bWxGaWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0b3JcIikuaW5uZXJIVE1MO1xyXG4gICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICB0aXRsZTogY29udGVudFRpdGxlLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBodG1sRmlsZVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc3RvcmVKb3VybmFsQ29udGVudChpZCwgZGF0YSk7XHJcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgY29uc3Qgam91cm5hbExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWwtdGFic1wiKTtcclxuICAgICAgICBqb3VybmFsTGlzdC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICBhd2FpdCB0aGlzLmdldFVzZXJKb3VybmFscygpXHJcbiAgICAgICAgbGV0IGJ0dG5uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xyXG4gICAgICAgIGlmICgoYnR0bm4gYXMgSFRNTEVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAoYnR0bm4gYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgICAgICB9XHJcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFRpdGxlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gXCJcIlxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdG9yXCIpLmlubmVySFRNTCA9IFwiXCJcclxuICAgICAgfVxyXG4gICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5Db250ZW50TW9kYWxDbG9zZVwiKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG5cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVVc2VySm91cm5hbENvbnRlbnQoKSB7XHJcbiAgICBjb25zdCBzYXZlQ29udGVudEJ1dHRvbjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRzYXZlQnV0dG9uMlwiKVxyXG5cclxuICAgIHNhdmVDb250ZW50QnV0dG9uMi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZS10YWJcIik7XHJcbiAgICAgIGNvbnN0IGlkID0gZWxlbXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKVxyXG4gICAgICBsZXQgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLWNvbnRlbnRcIik7XHJcbiAgICAgIGNvbnN0IGNvbnRlbnRJRCA9IGNvbnRlbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKVxyXG4gICAgICBsZXQgY29udGVudFRpdGxlID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdENvbnRlbnRUaXRsZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgICAgY29uc3QgaHRtbEZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRFZGl0b3JcIikuaW5uZXJIVE1MO1xyXG4gICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICB0aXRsZTogY29udGVudFRpdGxlLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBodG1sRmlsZVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZWRpdEpvdXJuYWxDb250ZW50KGlkLCBjb250ZW50SUQsIGRhdGEpO1xyXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsLXRhYnNcIik7XHJcbiAgICAgICAgam91cm5hbExpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5nZXRVc2VySm91cm5hbHMoKVxyXG4gICAgICAgIGxldCBidHRubiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcclxuICAgICAgICBpZiAoKGJ0dG5uIGFzIEhUTUxFbGVtZW50KSkge1xyXG4gICAgICAgICAgKGJ0dG5uIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRDb250ZW50VGl0bGVcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBcIlwiXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0RWRpdG9yXCIpLmlubmVySFRNTCA9IFwiXCJcclxuICAgICAgfVxyXG4gICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0Q29udGVudE1vZGFsQ2xvc2VcIikgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25Mb2dnZWRJbigpIHtcclxuICAgIHRoaXMuaXNMb2dnZWRJbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgZWxCdG5Mb2dvdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1sb2dvdXRcIik7XHJcbiAgICBlbEJ0bkxvZ291dC5jbGFzc0xpc3QuYWRkKFwiZW5hYmxlZFwiKTtcclxuXHJcbiAgICB0aGlzLmRyYXdVc2VySW5mbygpO1xyXG4gICAgdGhpcy5kcmF3U3ViUGFuZWwoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZHJhd1VzZXJJbmZvKCkge1xyXG4gICAgY29uc3QgZWxVc2VySW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1pbmZvXCIpO1xyXG4gICAgZWxVc2VySW5mby5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgaWYgKHRoaXMuaXNMb2dnZWRJbikge1xyXG4gICAgICBlbFVzZXJJbmZvLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgICBjb25zdCBlbEJhdHRsZVRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmF0dGxlLXRhZ1wiKTtcclxuICAgICAgZWxCYXR0bGVUYWcuaW5uZXJIVE1MID0gdGhpcy5iYXR0bGVUYWc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRyYXdTdWJQYW5lbCgpIHtcclxuICAgIGNvbnN0IGVsU3ViUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Yi1wYW5lbFwiKTtcclxuICAgIGVsU3ViUGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcImxvZ2dlZC1pblwiKTtcclxuICAgIGlmICh0aGlzLmlzTG9nZ2VkSW4pIHtcclxuICAgICAgZWxTdWJQYW5lbC5jbGFzc0xpc3QuYWRkKFwibG9nZ2VkLWluXCIpO1xyXG4gICAgICB0aGlzLmNoYXJhY3RlckluZm8gPSBuZXcgQ2hhcmFjdGVySW5mbyh0aGlzLmNoYXJhY3RlcnMpO1xyXG4gICAgICB0aGlzLmNoYXJhY3RlckluZm8uaW5pdERyb3Bkb3duKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGluc3RhbmNlKCkge1xyXG4gICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBEZXNrdG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gIH1cclxufVxyXG5cclxuRGVza3RvcC5pbnN0YW5jZSgpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=