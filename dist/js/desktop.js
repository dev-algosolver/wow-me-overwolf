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
        const response = await (0, api_1.getJournals)();
        const journalList = document.getElementById("journal-tabs");
        for (let i = 0; i < response.data.length; i++) {
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
                let item = document.querySelector(`[data-id="${response.data[i]._id}"]`);
                item.remove();
                let content = response.data;
                content = content.filter((con) => con._id != response.data[i]._id);
                response.data = content;
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
                console.log(response);
                const selectedJournal = response.data[i];
                console.log(selectedJournal);
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
            const check = cb.checked;
            const data = {
                battleId: "a232df3dfafa213",
                name: inputVal,
                template: check,
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
            const check = cb.checked;
            let content = document.querySelector(".edit-journel");
            const contentID = content.getAttribute("data-id");
            const data = {
                battleId: "a232df3dfafa213",
                name: inputVal,
                template: check,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUU7WUFDbkIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHVCQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRU0sTUFBTSxDQUFDLFFBQVE7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1NBQ2hDO1FBRUQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7Q0FDRjtBQUVELE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lLWxpc3RlbmVyLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctZ2FtZXMtZXZlbnRzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctZ2FtZXMuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1ob3RrZXlzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctbGlzdGVuZXIuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy13aW5kb3cuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC90aW1lci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdmFsaWRhdG9yLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL0FwcFdpbmRvdy50cyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvY29tcG9uZW50cy9kcm9wZG93bi50cyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvY29tcG9uZW50cy90YWxlbnRzVGFibGUudHMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL2NvbnN0cy50cyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvaW5pdC9pbml0RGF0YS50cyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvdXRpbHMvYXBpLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy91dGlscy9jaGFyYWN0ZXJJbmZvLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy91dGlscy90YWxlbnRQaWNrZXIudHMiLCJ3ZWJwYWNrOi8vd293Lm1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9kZXNrdG9wL2Rlc2t0b3AudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lLWxpc3RlbmVyXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWVzLWV2ZW50c1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lc1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1ob3RrZXlzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWxpc3RlbmVyXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LXdpbmRvd1wiKSwgZXhwb3J0cyk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lTGlzdGVuZXIgPSB2b2lkIDA7XHJcbmNvbnN0IG93X2xpc3RlbmVyXzEgPSByZXF1aXJlKFwiLi9vdy1saXN0ZW5lclwiKTtcclxuY2xhc3MgT1dHYW1lTGlzdGVuZXIgZXh0ZW5kcyBvd19saXN0ZW5lcl8xLk9XTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUpIHtcclxuICAgICAgICBzdXBlcihkZWxlZ2F0ZSk7XHJcbiAgICAgICAgdGhpcy5vbkdhbWVJbmZvVXBkYXRlZCA9ICh1cGRhdGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF1cGRhdGUgfHwgIXVwZGF0ZS5nYW1lSW5mbykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdXBkYXRlLnJ1bm5pbmdDaGFuZ2VkICYmICF1cGRhdGUuZ2FtZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXBkYXRlLmdhbWVJbmZvLmlzUnVubmluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKHVwZGF0ZS5nYW1lSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lRW5kZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVFbmRlZCh1cGRhdGUuZ2FtZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uUnVubmluZ0dhbWVJbmZvID0gKGluZm8pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQoaW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5vbkdhbWVJbmZvVXBkYXRlZC5hZGRMaXN0ZW5lcih0aGlzLm9uR2FtZUluZm9VcGRhdGVkKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8odGhpcy5vblJ1bm5pbmdHYW1lSW5mbyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLm9uR2FtZUluZm9VcGRhdGVkLnJlbW92ZUxpc3RlbmVyKHRoaXMub25HYW1lSW5mb1VwZGF0ZWQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lTGlzdGVuZXIgPSBPV0dhbWVMaXN0ZW5lcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVzRXZlbnRzID0gdm9pZCAwO1xyXG5jb25zdCB0aW1lcl8xID0gcmVxdWlyZShcIi4vdGltZXJcIik7XHJcbmNsYXNzIE9XR2FtZXNFdmVudHMge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUsIHJlcXVpcmVkRmVhdHVyZXMsIGZlYXR1cmVSZXRyaWVzID0gMTApIHtcclxuICAgICAgICB0aGlzLm9uSW5mb1VwZGF0ZXMgPSAoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkluZm9VcGRhdGVzKGluZm8uaW5mbyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uTmV3RXZlbnRzID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25OZXdFdmVudHMoZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMgPSByZXF1aXJlZEZlYXR1cmVzO1xyXG4gICAgICAgIHRoaXMuX2ZlYXR1cmVSZXRyaWVzID0gZmVhdHVyZVJldHJpZXM7XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMuZ2V0SW5mbyhyZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIHNldFJlcXVpcmVkRmVhdHVyZXMoKSB7XHJcbiAgICAgICAgbGV0IHRyaWVzID0gMSwgcmVzdWx0O1xyXG4gICAgICAgIHdoaWxlICh0cmllcyA8PSB0aGlzLl9mZWF0dXJlUmV0cmllcykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5zZXRSZXF1aXJlZEZlYXR1cmVzKHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMsIHJlc29sdmUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NldFJlcXVpcmVkRmVhdHVyZXMoKTogc3VjY2VzczogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQuc3VwcG9ydGVkRmVhdHVyZXMubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXdhaXQgdGltZXJfMS5UaW1lci53YWl0KDMwMDApO1xyXG4gICAgICAgICAgICB0cmllcysrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLndhcm4oJ3NldFJlcXVpcmVkRmVhdHVyZXMoKTogZmFpbHVyZSBhZnRlciAnICsgdHJpZXMgKyAnIHRyaWVzJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgMikpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyRXZlbnRzKCkge1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbkluZm9VcGRhdGVzMi5hZGRMaXN0ZW5lcih0aGlzLm9uSW5mb1VwZGF0ZXMpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbk5ld0V2ZW50cy5hZGRMaXN0ZW5lcih0aGlzLm9uTmV3RXZlbnRzKTtcclxuICAgIH1cclxuICAgIHVuUmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uSW5mb1VwZGF0ZXMyLnJlbW92ZUxpc3RlbmVyKHRoaXMub25JbmZvVXBkYXRlcyk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uTmV3RXZlbnRzLnJlbW92ZUxpc3RlbmVyKHRoaXMub25OZXdFdmVudHMpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc3RhcnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtvdy1nYW1lLWV2ZW50c10gU1RBUlRgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zZXRSZXF1aXJlZEZlYXR1cmVzKCk7XHJcbiAgICAgICAgY29uc3QgeyByZXMsIHN0YXR1cyB9ID0gYXdhaXQgdGhpcy5nZXRJbmZvKCk7XHJcbiAgICAgICAgaWYgKHJlcyAmJiBzdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICB0aGlzLm9uSW5mb1VwZGF0ZXMoeyBpbmZvOiByZXMgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW293LWdhbWUtZXZlbnRzXSBTVE9QYCk7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVzRXZlbnRzID0gT1dHYW1lc0V2ZW50cztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVzID0gdm9pZCAwO1xyXG5jbGFzcyBPV0dhbWVzIHtcclxuICAgIHN0YXRpYyBnZXRSdW5uaW5nR2FtZUluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbyhyZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjbGFzc0lkRnJvbUdhbWVJZChnYW1lSWQpIHtcclxuICAgICAgICBsZXQgY2xhc3NJZCA9IE1hdGguZmxvb3IoZ2FtZUlkIC8gMTApO1xyXG4gICAgICAgIHJldHVybiBjbGFzc0lkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldFJlY2VudGx5UGxheWVkR2FtZXMobGltaXQgPSAzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghb3ZlcndvbGYuZ2FtZXMuZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcyhsaW1pdCwgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LmdhbWVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0R2FtZURCSW5mbyhnYW1lQ2xhc3NJZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRHYW1lREJJbmZvKGdhbWVDbGFzc0lkLCByZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZXMgPSBPV0dhbWVzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XSG90a2V5cyA9IHZvaWQgMDtcclxuY2xhc3MgT1dIb3RrZXlzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBzdGF0aWMgZ2V0SG90a2V5VGV4dChob3RrZXlJZCwgZ2FtZUlkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLmdldChyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBob3RrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWVJZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3RrZXkgPSByZXN1bHQuZ2xvYmFscy5maW5kKGggPT4gaC5uYW1lID09PSBob3RrZXlJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0LmdhbWVzICYmIHJlc3VsdC5nYW1lc1tnYW1lSWRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3RrZXkgPSByZXN1bHQuZ2FtZXNbZ2FtZUlkXS5maW5kKGggPT4gaC5uYW1lID09PSBob3RrZXlJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvdGtleSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoaG90a2V5LmJpbmRpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgnVU5BU1NJR05FRCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBvbkhvdGtleURvd24oaG90a2V5SWQsIGFjdGlvbikge1xyXG4gICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMub25QcmVzc2VkLmFkZExpc3RlbmVyKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubmFtZSA9PT0gaG90a2V5SWQpXHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ocmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XSG90a2V5cyA9IE9XSG90a2V5cztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0xpc3RlbmVyID0gdm9pZCAwO1xyXG5jbGFzcyBPV0xpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlKSB7XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dMaXN0ZW5lciA9IE9XTGlzdGVuZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dXaW5kb3cgPSB2b2lkIDA7XHJcbmNsYXNzIE9XV2luZG93IHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgcmVzdG9yZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MucmVzdG9yZShpZCwgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LnN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW3Jlc3RvcmVdIC0gYW4gZXJyb3Igb2NjdXJyZWQsIHdpbmRvd0lkPSR7aWR9LCByZWFzb249JHtyZXN1bHQuZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbWluaW1pemUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm1pbmltaXplKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbWF4aW1pemUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm1heGltaXplKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaGlkZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuaGlkZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGNsb3NlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5nZXRXaW5kb3dTdGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgJiZcclxuICAgICAgICAgICAgICAgIChyZXN1bHQud2luZG93X3N0YXRlICE9PSAnY2xvc2VkJykpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW50ZXJuYWxDbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkcmFnTW92ZShlbGVtKSB7XHJcbiAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgZHJhZ2dhYmxlJztcclxuICAgICAgICBlbGVtLm9ubW91c2Vkb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5kcmFnTW92ZSh0aGlzLl9uYW1lKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0V2luZG93U3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldFdpbmRvd1N0YXRlKGlkLCByZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRDdXJyZW50SW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRDdXJyZW50V2luZG93KHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC53aW5kb3cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9idGFpbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYiA9IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5zdGF0dXMgPT09IFwic3VjY2Vzc1wiICYmIHJlcy53aW5kb3cgJiYgcmVzLndpbmRvdy5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gcmVzLndpbmRvdy5pZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHJlcy53aW5kb3cubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMud2luZG93KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3coY2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5vYnRhaW5EZWNsYXJlZFdpbmRvdyh0aGlzLl9uYW1lLCBjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGFzc3VyZU9idGFpbmVkKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5vYnRhaW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGludGVybmFsQ2xvc2UoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuY2xvc2UoaWQsIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5zdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV1dpbmRvdyA9IE9XV2luZG93O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlRpbWVyID0gdm9pZCAwO1xyXG5jbGFzcyBUaW1lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSwgaWQpIHtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhbmRsZVRpbWVyRXZlbnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vblRpbWVyKHRoaXMuX2lkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyB3YWl0KGludGVydmFsSW5NUykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBpbnRlcnZhbEluTVMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoaW50ZXJ2YWxJbk1TKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IHNldFRpbWVvdXQodGhpcy5oYW5kbGVUaW1lckV2ZW50LCBpbnRlcnZhbEluTVMpO1xyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGltZXJJZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVySWQpO1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuVGltZXIgPSBUaW1lcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuLi9jb3JlL2J1aWxkRnVsbFBhdGgnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG4gICAgdmFyIHJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChjb25maWcuYXV0aC5wYXNzd29yZCkpIDogJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIGZ1bmN0aW9uIG9ubG9hZGVuZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFyZXNwb25zZVR5cGUgfHwgcmVzcG9uc2VUeXBlID09PSAndGV4dCcgfHwgIHJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nID9cbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoJ29ubG9hZGVuZCcgaW4gcmVxdWVzdCkge1xuICAgICAgLy8gVXNlIG9ubG9hZGVuZCBpZiBhdmFpbGFibGVcbiAgICAgIHJlcXVlc3Qub25sb2FkZW5kID0gb25sb2FkZW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlIHRvIGVtdWxhdGUgb25sb2FkZW5kXG4gICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCB8fCByZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVhZHlzdGF0ZSBoYW5kbGVyIGlzIGNhbGxpbmcgYmVmb3JlIG9uZXJyb3Igb3Igb250aW1lb3V0IGhhbmRsZXJzLFxuICAgICAgICAvLyBzbyB3ZSBzaG91bGQgY2FsbCBvbmxvYWRlbmQgb24gdGhlIG5leHQgJ3RpY2snXG4gICAgICAgIHNldFRpbWVvdXQob25sb2FkZW5kKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGJyb3dzZXIgcmVxdWVzdCBjYW5jZWxsYXRpb24gKGFzIG9wcG9zZWQgdG8gYSBtYW51YWwgY2FuY2VsbGF0aW9uKVxuICAgIHJlcXVlc3Qub25hYm9ydCA9IGZ1bmN0aW9uIGhhbmRsZUFib3J0KCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdSZXF1ZXN0IGFib3J0ZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHZhciB0aW1lb3V0RXJyb3JNZXNzYWdlID0gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJztcbiAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICB9XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgY29uZmlnLnRyYW5zaXRpb25hbCAmJiBjb25maWcudHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyAnRVRJTUVET1VUJyA6ICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKHJlc3BvbnNlVHlwZSAmJiByZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuYXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhheGlvcy5kZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcbn07XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsJyk7XG5heGlvcy5DYW5jZWxUb2tlbiA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbFRva2VuJyk7XG5heGlvcy5pc0NhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL2lzQ2FuY2VsJyk7XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7XG5cbi8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcbmF4aW9zLmlzQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4vaGVscGVycy9pc0F4aW9zRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkNhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG59O1xuXG5DYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWVyZ2VDb25maWcnKTtcbnZhciB2YWxpZGF0b3IgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3ZhbGlkYXRvcicpO1xuXG52YXIgdmFsaWRhdG9ycyA9IHZhbGlkYXRvci52YWxpZGF0b3JzO1xuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICBjb25maWcudXJsID0gYXJndW1lbnRzWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgdmFyIHRyYW5zaXRpb25hbCA9IGNvbmZpZy50cmFuc2l0aW9uYWw7XG5cbiAgaWYgKHRyYW5zaXRpb25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICBzaWxlbnRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuLCAnMS4wLjAnKSxcbiAgICAgIGZvcmNlZEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4sICcxLjAuMCcpLFxuICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuLCAnMS4wLjAnKVxuICAgIH0sIGZhbHNlKTtcbiAgfVxuXG4gIC8vIGZpbHRlciBvdXQgc2tpcHBlZCBpbnRlcmNlcHRvcnNcbiAgdmFyIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluID0gW107XG4gIHZhciBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBpZiAodHlwZW9mIGludGVyY2VwdG9yLnJ1bldoZW4gPT09ICdmdW5jdGlvbicgJiYgaW50ZXJjZXB0b3IucnVuV2hlbihjb25maWcpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyA9IHN5bmNocm9ub3VzUmVxdWVzdEludGVyY2VwdG9ycyAmJiBpbnRlcmNlcHRvci5zeW5jaHJvbm91cztcblxuICAgIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHZhciByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHByb21pc2U7XG5cbiAgaWYgKCFzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMpIHtcbiAgICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuXG4gICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoY2hhaW4sIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluKTtcbiAgICBjaGFpbiA9IGNoYWluLmNvbmNhdChyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuXG4gICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuICAgIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuXG4gIHZhciBuZXdDb25maWcgPSBjb25maWc7XG4gIHdoaWxlIChyZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICB2YXIgb25GdWxmaWxsZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpO1xuICAgIHZhciBvblJlamVjdGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICB0cnkge1xuICAgICAgbmV3Q29uZmlnID0gb25GdWxmaWxsZWQobmV3Q29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgb25SZWplY3RlZChlcnJvcik7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIHByb21pc2UgPSBkaXNwYXRjaFJlcXVlc3QobmV3Q29uZmlnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICB9XG5cbiAgd2hpbGUgKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5zaGlmdCgpLCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCwgb3B0aW9ucykge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZCxcbiAgICBzeW5jaHJvbm91czogb3B0aW9ucyA/IG9wdGlvbnMuc3luY2hyb25vdXMgOiBmYWxzZSxcbiAgICBydW5XaGVuOiBvcHRpb25zID8gb3B0aW9ucy5ydW5XaGVuIDogbnVsbFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICBjb25maWcsXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNcbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgIGNvbmZpZyxcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG5cbiAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIGVycm9yLmlzQXhpb3NFcnJvciA9IHRydWU7XG5cbiAgZXJyb3IudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBTdGFuZGFyZFxuICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgLy8gTWljcm9zb2Z0XG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAvLyBNb3ppbGxhXG4gICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIC8vIEF4aW9zXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgY29kZTogdGhpcy5jb2RlXG4gICAgfTtcbiAgfTtcbiAgcmV0dXJuIGVycm9yO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBDb25maWctc3BlY2lmaWMgbWVyZ2UtZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhIG5ldyBjb25maWctb2JqZWN0XG4gKiBieSBtZXJnaW5nIHR3byBjb25maWd1cmF0aW9uIG9iamVjdHMgdG9nZXRoZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzFcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBOZXcgb2JqZWN0IHJlc3VsdGluZyBmcm9tIG1lcmdpbmcgY29uZmlnMiB0byBjb25maWcxXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIHZhciBjb25maWcgPSB7fTtcblxuICB2YXIgdmFsdWVGcm9tQ29uZmlnMktleXMgPSBbJ3VybCcsICdtZXRob2QnLCAnZGF0YSddO1xuICB2YXIgbWVyZ2VEZWVwUHJvcGVydGllc0tleXMgPSBbJ2hlYWRlcnMnLCAnYXV0aCcsICdwcm94eScsICdwYXJhbXMnXTtcbiAgdmFyIGRlZmF1bHRUb0NvbmZpZzJLZXlzID0gW1xuICAgICdiYXNlVVJMJywgJ3RyYW5zZm9ybVJlcXVlc3QnLCAndHJhbnNmb3JtUmVzcG9uc2UnLCAncGFyYW1zU2VyaWFsaXplcicsXG4gICAgJ3RpbWVvdXQnLCAndGltZW91dE1lc3NhZ2UnLCAnd2l0aENyZWRlbnRpYWxzJywgJ2FkYXB0ZXInLCAncmVzcG9uc2VUeXBlJywgJ3hzcmZDb29raWVOYW1lJyxcbiAgICAneHNyZkhlYWRlck5hbWUnLCAnb25VcGxvYWRQcm9ncmVzcycsICdvbkRvd25sb2FkUHJvZ3Jlc3MnLCAnZGVjb21wcmVzcycsXG4gICAgJ21heENvbnRlbnRMZW5ndGgnLCAnbWF4Qm9keUxlbmd0aCcsICdtYXhSZWRpcmVjdHMnLCAndHJhbnNwb3J0JywgJ2h0dHBBZ2VudCcsXG4gICAgJ2h0dHBzQWdlbnQnLCAnY2FuY2VsVG9rZW4nLCAnc29ja2V0UGF0aCcsICdyZXNwb25zZUVuY29kaW5nJ1xuICBdO1xuICB2YXIgZGlyZWN0TWVyZ2VLZXlzID0gWyd2YWxpZGF0ZVN0YXR1cyddO1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgdXRpbHMuZm9yRWFjaCh2YWx1ZUZyb21Db25maWcyS2V5cywgZnVuY3Rpb24gdmFsdWVGcm9tQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gobWVyZ2VEZWVwUHJvcGVydGllc0tleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuXG4gIHV0aWxzLmZvckVhY2goZGVmYXVsdFRvQ29uZmlnMktleXMsIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKGRpcmVjdE1lcmdlS2V5cywgZnVuY3Rpb24gbWVyZ2UocHJvcCkge1xuICAgIGlmIChwcm9wIGluIGNvbmZpZzIpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGF4aW9zS2V5cyA9IHZhbHVlRnJvbUNvbmZpZzJLZXlzXG4gICAgLmNvbmNhdChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cylcbiAgICAuY29uY2F0KGRlZmF1bHRUb0NvbmZpZzJLZXlzKVxuICAgIC5jb25jYXQoZGlyZWN0TWVyZ2VLZXlzKTtcblxuICB2YXIgb3RoZXJLZXlzID0gT2JqZWN0XG4gICAgLmtleXMoY29uZmlnMSlcbiAgICAuY29uY2F0KE9iamVjdC5rZXlzKGNvbmZpZzIpKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24gZmlsdGVyQXhpb3NLZXlzKGtleSkge1xuICAgICAgcmV0dXJuIGF4aW9zS2V5cy5pbmRleE9mKGtleSkgPT09IC0xO1xuICAgIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gob3RoZXJLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcblxuICByZXR1cm4gY29uZmlnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgbnVsbCxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLy4uL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICB2YXIgY29udGV4dCA9IHRoaXMgfHwgZGVmYXVsdHM7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuLmNhbGwoY29udGV4dCwgZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4vY29yZS9lbmhhbmNlRXJyb3InKTtcblxudmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbmZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gIHZhciBhZGFwdGVyO1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlTYWZlbHkocmF3VmFsdWUsIHBhcnNlciwgZW5jb2Rlcikge1xuICBpZiAodXRpbHMuaXNTdHJpbmcocmF3VmFsdWUpKSB7XG4gICAgdHJ5IHtcbiAgICAgIChwYXJzZXIgfHwgSlNPTi5wYXJzZSkocmF3VmFsdWUpO1xuICAgICAgcmV0dXJuIHV0aWxzLnRyaW0ocmF3VmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgIT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gKGVuY29kZXIgfHwgSlNPTi5zdHJpbmdpZnkpKHJhd1ZhbHVlKTtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuXG4gIHRyYW5zaXRpb25hbDoge1xuICAgIHNpbGVudEpTT05QYXJzaW5nOiB0cnVlLFxuICAgIGZvcmNlZEpTT05QYXJzaW5nOiB0cnVlLFxuICAgIGNsYXJpZnlUaW1lb3V0RXJyb3I6IGZhbHNlXG4gIH0sXG5cbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSB8fCAoaGVhZGVycyAmJiBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICByZXR1cm4gc3RyaW5naWZ5U2FmZWx5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgdmFyIHRyYW5zaXRpb25hbCA9IHRoaXMudHJhbnNpdGlvbmFsO1xuICAgIHZhciBzaWxlbnRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuc2lsZW50SlNPTlBhcnNpbmc7XG4gICAgdmFyIGZvcmNlZEpTT05QYXJzaW5nID0gdHJhbnNpdGlvbmFsICYmIHRyYW5zaXRpb25hbC5mb3JjZWRKU09OUGFyc2luZztcbiAgICB2YXIgc3RyaWN0SlNPTlBhcnNpbmcgPSAhc2lsZW50SlNPTlBhcnNpbmcgJiYgdGhpcy5yZXNwb25zZVR5cGUgPT09ICdqc29uJztcblxuICAgIGlmIChzdHJpY3RKU09OUGFyc2luZyB8fCAoZm9yY2VkSlNPTlBhcnNpbmcgJiYgdXRpbHMuaXNTdHJpbmcoZGF0YSkgJiYgZGF0YS5sZW5ndGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHN0cmljdEpTT05QYXJzaW5nKSB7XG4gICAgICAgICAgaWYgKGUubmFtZSA9PT0gJ1N5bnRheEVycm9yJykge1xuICAgICAgICAgICAgdGhyb3cgZW5oYW5jZUVycm9yKGUsIHRoaXMsICdFX0pTT05fUEFSU0UnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcblxuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cblxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zXG4gKlxuICogQHBhcmFtIHsqfSBwYXlsb2FkIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXhpb3NFcnJvcihwYXlsb2FkKSB7XG4gIHJldHVybiAodHlwZW9mIHBheWxvYWQgPT09ICdvYmplY3QnKSAmJiAocGF5bG9hZC5pc0F4aW9zRXJyb3IgPT09IHRydWUpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4gIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXG4gICAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLy8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbnZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGtnID0gcmVxdWlyZSgnLi8uLi8uLi9wYWNrYWdlLmpzb24nKTtcblxudmFyIHZhbGlkYXRvcnMgPSB7fTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcblsnb2JqZWN0JywgJ2Jvb2xlYW4nLCAnbnVtYmVyJywgJ2Z1bmN0aW9uJywgJ3N0cmluZycsICdzeW1ib2wnXS5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUsIGkpIHtcbiAgdmFsaWRhdG9yc1t0eXBlXSA9IGZ1bmN0aW9uIHZhbGlkYXRvcih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09IHR5cGUgfHwgJ2EnICsgKGkgPCAxID8gJ24gJyA6ICcgJykgKyB0eXBlO1xuICB9O1xufSk7XG5cbnZhciBkZXByZWNhdGVkV2FybmluZ3MgPSB7fTtcbnZhciBjdXJyZW50VmVyQXJyID0gcGtnLnZlcnNpb24uc3BsaXQoJy4nKTtcblxuLyoqXG4gKiBDb21wYXJlIHBhY2thZ2UgdmVyc2lvbnNcbiAqIEBwYXJhbSB7c3RyaW5nfSB2ZXJzaW9uXG4gKiBAcGFyYW0ge3N0cmluZz99IHRoYW5WZXJzaW9uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNPbGRlclZlcnNpb24odmVyc2lvbiwgdGhhblZlcnNpb24pIHtcbiAgdmFyIHBrZ1ZlcnNpb25BcnIgPSB0aGFuVmVyc2lvbiA/IHRoYW5WZXJzaW9uLnNwbGl0KCcuJykgOiBjdXJyZW50VmVyQXJyO1xuICB2YXIgZGVzdFZlciA9IHZlcnNpb24uc3BsaXQoJy4nKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBpZiAocGtnVmVyc2lvbkFycltpXSA+IGRlc3RWZXJbaV0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAocGtnVmVyc2lvbkFycltpXSA8IGRlc3RWZXJbaV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRyYW5zaXRpb25hbCBvcHRpb24gdmFsaWRhdG9yXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufGJvb2xlYW4/fSB2YWxpZGF0b3JcbiAqIEBwYXJhbSB7c3RyaW5nP30gdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAqL1xudmFsaWRhdG9ycy50cmFuc2l0aW9uYWwgPSBmdW5jdGlvbiB0cmFuc2l0aW9uYWwodmFsaWRhdG9yLCB2ZXJzaW9uLCBtZXNzYWdlKSB7XG4gIHZhciBpc0RlcHJlY2F0ZWQgPSB2ZXJzaW9uICYmIGlzT2xkZXJWZXJzaW9uKHZlcnNpb24pO1xuXG4gIGZ1bmN0aW9uIGZvcm1hdE1lc3NhZ2Uob3B0LCBkZXNjKSB7XG4gICAgcmV0dXJuICdbQXhpb3MgdicgKyBwa2cudmVyc2lvbiArICddIFRyYW5zaXRpb25hbCBvcHRpb24gXFwnJyArIG9wdCArICdcXCcnICsgZGVzYyArIChtZXNzYWdlID8gJy4gJyArIG1lc3NhZ2UgOiAnJyk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG9wdCwgb3B0cykge1xuICAgIGlmICh2YWxpZGF0b3IgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZm9ybWF0TWVzc2FnZShvcHQsICcgaGFzIGJlZW4gcmVtb3ZlZCBpbiAnICsgdmVyc2lvbikpO1xuICAgIH1cblxuICAgIGlmIChpc0RlcHJlY2F0ZWQgJiYgIWRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdKSB7XG4gICAgICBkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSA9IHRydWU7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBmb3JtYXRNZXNzYWdlKFxuICAgICAgICAgIG9wdCxcbiAgICAgICAgICAnIGhhcyBiZWVuIGRlcHJlY2F0ZWQgc2luY2UgdicgKyB2ZXJzaW9uICsgJyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZWFyIGZ1dHVyZSdcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdG9yID8gdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdHMpIDogdHJ1ZTtcbiAgfTtcbn07XG5cbi8qKlxuICogQXNzZXJ0IG9iamVjdCdzIHByb3BlcnRpZXMgdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7b2JqZWN0fSBzY2hlbWFcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGFsbG93VW5rbm93blxuICovXG5cbmZ1bmN0aW9uIGFzc2VydE9wdGlvbnMob3B0aW9ucywgc2NoZW1hLCBhbGxvd1Vua25vd24pIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tID4gMCkge1xuICAgIHZhciBvcHQgPSBrZXlzW2ldO1xuICAgIHZhciB2YWxpZGF0b3IgPSBzY2hlbWFbb3B0XTtcbiAgICBpZiAodmFsaWRhdG9yKSB7XG4gICAgICB2YXIgdmFsdWUgPSBvcHRpb25zW29wdF07XG4gICAgICB2YXIgcmVzdWx0ID0gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0aW9ucyk7XG4gICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiAnICsgb3B0ICsgJyBtdXN0IGJlICcgKyByZXN1bHQpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbGxvd1Vua25vd24gIT09IHRydWUpIHtcbiAgICAgIHRocm93IEVycm9yKCdVbmtub3duIG9wdGlvbiAnICsgb3B0KTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzT2xkZXJWZXJzaW9uOiBpc09sZGVyVmVyc2lvbixcbiAgYXNzZXJ0T3B0aW9uczogYXNzZXJ0T3B0aW9ucyxcbiAgdmFsaWRhdG9yczogdmFsaWRhdG9yc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKHZhbCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnRyaW0gPyBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOYXRpdmVTY3JpcHQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOUycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0W2tleV0pICYmIGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZSh7fSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWwuc2xpY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG4vKipcbiAqIFJlbW92ZSBieXRlIG9yZGVyIG1hcmtlci4gVGhpcyBjYXRjaGVzIEVGIEJCIEJGICh0aGUgVVRGLTggQk9NKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IHdpdGggQk9NXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuZnVuY3Rpb24gc3RyaXBCT00oY29udGVudCkge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW0sXG4gIHN0cmlwQk9NOiBzdHJpcEJPTVxufTtcbiIsImltcG9ydCB7IE9XV2luZG93IH0gZnJvbSBcIkBvdmVyd29sZi9vdmVyd29sZi1hcGktdHNcIjtcclxuXHJcbi8vIEEgYmFzZSBjbGFzcyBmb3IgdGhlIGFwcCdzIGZvcmVncm91bmQgd2luZG93cy5cclxuLy8gU2V0cyB0aGUgbW9kYWwgYW5kIGRyYWcgYmVoYXZpb3JzLCB3aGljaCBhcmUgc2hhcmVkIGFjY3Jvc3MgdGhlIGRlc2t0b3AgYW5kIGluLWdhbWUgd2luZG93cy5cclxuZXhwb3J0IGNsYXNzIEFwcFdpbmRvdyB7XHJcbiAgcHJvdGVjdGVkIGN1cnJXaW5kb3c6IE9XV2luZG93O1xyXG4gIHByb3RlY3RlZCBtYWluV2luZG93OiBPV1dpbmRvdztcclxuICBwcm90ZWN0ZWQgbWF4aW1pemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHdpbmRvd05hbWUpIHtcclxuICAgIHRoaXMubWFpbldpbmRvdyA9IG5ldyBPV1dpbmRvdygnYmFja2dyb3VuZCcpO1xyXG4gICAgdGhpcy5jdXJyV2luZG93ID0gbmV3IE9XV2luZG93KHdpbmRvd05hbWUpO1xyXG5cclxuICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlQnV0dG9uJyk7XHJcbiAgICAvLyBjb25zdCBtYXhpbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXhpbWl6ZUJ1dHRvbicpO1xyXG4gICAgY29uc3QgbWluaW1pemVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWluaW1pemVCdXR0b24nKTtcclxuXHJcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyJyk7XHJcblxyXG4gICAgdGhpcy5zZXREcmFnKGhlYWRlcik7XHJcblxyXG4gICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjbG9zZUJ1dHRvbiBjbGlja2VkJylcclxuICAgICAgdGhpcy5tYWluV2luZG93LmNsb3NlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBtaW5pbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ21pbmltaXplQnV0dG9uIGNsaWNrZWQnKVxyXG4gICAgICB0aGlzLmN1cnJXaW5kb3cubWluaW1pemUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIG1heGltaXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgLy8gICBjb25zdCBpbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1heGltaXplLWltZ1wiKTtcclxuICAgIC8vICAgaWYgKCF0aGlzLm1heGltaXplZCkge1xyXG4gICAgLy8gICAgIHRoaXMuY3VycldpbmRvdy5tYXhpbWl6ZSgpO1xyXG4gICAgLy8gICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1nL2luLWdhbWUtd2luZG93L2J1dHRvbi9yZXN0b3JlLnBuZycpO1xyXG4gICAgLy8gICB9IGVsc2Uge1xyXG4gICAgLy8gICAgIHRoaXMuY3VycldpbmRvdy5yZXN0b3JlKCk7XHJcbiAgICAvLyAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWcvaW4tZ2FtZS13aW5kb3cvYnV0dG9uL21heGltaXplLnBuZycpO1xyXG4gICAgLy8gICB9XHJcblxyXG4gICAgLy8gICB0aGlzLm1heGltaXplZCA9ICF0aGlzLm1heGltaXplZDtcclxuICAgIC8vIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsb3NlV2luZG93KCkge1xyXG4gICAgdGhpcy5tYWluV2luZG93LmNsb3NlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0V2luZG93U3RhdGUoKSB7XHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jdXJyV2luZG93LmdldFdpbmRvd1N0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHNldERyYWcoZWxlbSkge1xyXG4gICAgdGhpcy5jdXJyV2luZG93LmRyYWdNb3ZlKGVsZW0pO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgaW50ZXJmYWNlIERyb3BEb3duSXRlbUluZm8ge1xyXG4gICAgaWQ6IHN0cmluZyxcclxuICAgIHRleHQ6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRHJvcERvd25JbmZvIHtcclxuICAgIHZhcmlhYmxlTmFtZTogc3RyaW5nLFxyXG4gICAgZHJvcERvd25MaXN0OiBEcm9wRG93bkl0ZW1JbmZvW11cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ3VycmVudEVsZW1lbnQoZHJvcGRvd25JbmZvOiBEcm9wRG93bkluZm8pOkhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGRyb3Bkb3duQ3VycmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkcm9wZG93bkN1cnJlbnQuY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hfX2N1cnJlbnRcIik7XHJcblxyXG4gICAgZHJvcGRvd25JbmZvLmRyb3BEb3duTGlzdC5mb3JFYWNoKChkcm9wZG93bkl0ZW1JbmZvOiBEcm9wRG93bkl0ZW1JbmZvLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRyb3Bkb3duSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZHJvcGRvd25JdGVtLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3QtYm94X192YWx1ZVwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hfX2lucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJyYWRpb1wiKTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBkcm9wZG93bkl0ZW1JbmZvLmlkKTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBkcm9wZG93bkl0ZW1JbmZvLnRleHQpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgZHJvcGRvd25JbmZvLnZhcmlhYmxlTmFtZSk7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImNoZWNrZWRcIiwgXCJjaGVja2VkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZHJvcGRvd25JdGVtLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHRleHQuY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hfX2lucHV0LXRleHRcIik7XHJcbiAgICAgICAgdGV4dC5pbm5lclRleHQgPSBkcm9wZG93bkl0ZW1JbmZvLnRleHQ7XHJcblxyXG4gICAgICAgIGRyb3Bkb3duSXRlbS5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuXHJcbiAgICAgICAgZHJvcGRvd25DdXJyZW50LmFwcGVuZENoaWxkKGRyb3Bkb3duSXRlbSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBhcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICBpZiAoZHJvcGRvd25JbmZvLnZhcmlhYmxlTmFtZSA9PT0gJ2NoYXJhY3RlcicpIHtcclxuICAgICAgICBhcnJvdy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCIuL2ltZy9kZXNrdG9wLXdpbmRvdy9kcm9wZG93bi1hcnJvdy5zdmdcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFycm93LnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4vaW1nL2luLWdhbWUtd2luZG93L2Ryb3Bkb3duL2Ryb3AtZG93bi1hcnJvdy5wbmdcIik7XHJcbiAgICB9XHJcbiAgICBhcnJvdy5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgXCJBcnJvdyBJY29uXCIpO1xyXG4gICAgYXJyb3cuY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hfX2ljb25cIik7XHJcblxyXG4gICAgZHJvcGRvd25DdXJyZW50LmFwcGVuZENoaWxkKGFycm93KVxyXG5cclxuICAgIHJldHVybiBkcm9wZG93bkN1cnJlbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpc3RFbGVtZW50KGRyb3Bkb3duSW5mbzogRHJvcERvd25JbmZvKTpIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBkcm9wZG93bkxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XHJcbiAgICBkcm9wZG93bkxpc3QuY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hfX2xpc3RcIik7XHJcblxyXG4gICAgZHJvcGRvd25JbmZvLmRyb3BEb3duTGlzdC5mb3JFYWNoKChkcm9wZG93bkl0ZW1JbmZvOiBEcm9wRG93bkl0ZW1JbmZvKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3QtYm94X19vcHRpb25cIik7XHJcbiAgICAgICAgbGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIGRyb3Bkb3duSXRlbUluZm8uaWQpO1xyXG4gICAgICAgIGxhYmVsLmlubmVyVGV4dCA9IGRyb3Bkb3duSXRlbUluZm8udGV4dDtcclxuXHJcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG5cclxuICAgICAgICBkcm9wZG93bkxpc3QuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIHJldHVybiBkcm9wZG93bkxpc3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDdXN0b21Ecm9wRG93bihkcm9wZG93bkluZm86IERyb3BEb3duSW5mbyk6SFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZHJvcGRvd24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZHJvcGRvd24uY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hcIik7XHJcbiAgICBkcm9wZG93bi5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjFcIik7XHJcblxyXG4gICAgY29uc3QgY3VycmVudCA9IGNyZWF0ZUN1cnJlbnRFbGVtZW50KGRyb3Bkb3duSW5mbyk7XHJcbiAgICAvLyBpZiAoZHJvcGRvd25JbmZvLnZhcmlhYmxlTmFtZSA9PT0gJ3JhaWRfZHVuZ2VvbicpIHtcclxuICAgIC8vICAgICBjdXJyZW50LmNsYXNzTGlzdC5hZGQoJ2ZvY3Vzc2VkJyk7XHJcbiAgICAvLyB9XHJcbiAgICBkcm9wZG93bi5hcHBlbmRDaGlsZChjdXJyZW50KTtcclxuXHJcbiAgICBjb25zdCBsaXN0ID0gY3JlYXRlTGlzdEVsZW1lbnQoZHJvcGRvd25JbmZvKTtcclxuICAgIGRyb3Bkb3duLmFwcGVuZENoaWxkKGxpc3QpO1xyXG5cclxuICAgIGN1cnJlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGN1cnJlbnQuY2xhc3NMaXN0LnRvZ2dsZSgnZm9jdXNzZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRyb3Bkb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoZSkgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgY3VycmVudC5jbGFzc0xpc3QucmVtb3ZlKCdmb2N1c3NlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRyb3Bkb3duO1xyXG59XHJcbiIsImludGVyZmFjZSBUYWxlbnRJdGVtIHtcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGljb246IHN0cmluZyxcclxuICAgIGNvdW50OiBudW1iZXIsXHJcbiAgICBwZXJjZW50OiBudW1iZXIsXHJcbiAgICBpc19zZWxlY3RlZDogYm9vbGVhblxyXG59XHJcblxyXG5pbnRlcmZhY2UgVGFsZW50TGV2ZWwge1xyXG4gICAgbGV2ZWw6IG51bWJlcixcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBUYWxlbnRJdGVtW10sXHJcbiAgICBpc19zZWxlY3RlZDogYm9vbGVhblxyXG59XHJcblxyXG5pbnRlcmZhY2UgVGFsZW50VGFibGUge1xyXG4gICAgdGFsZW50TGV2ZWxMaXN0OiBUYWxlbnRMZXZlbFtdXHJcbn1cclxuXHJcbmNvbnN0IGdldENvbG9yRm9yUGVyY2VudGFnZSA9IGZ1bmN0aW9uKHBjdDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBwY3RVcHBlciA9IChwY3QgPCA1MCA/IHBjdCA6IHBjdCAtIDUwKSAvIDUwO1xyXG4gICAgY29uc3QgcGN0TG93ZXIgPSAxIC0gcGN0VXBwZXI7XHJcbiAgICBjb25zdCByID0gTWF0aC5mbG9vcigyMjIgKiBwY3RMb3dlciArIChwY3QgPCA1MCA/IDIyMiA6IDApICogcGN0VXBwZXIpO1xyXG4gICAgY29uc3QgZyA9IE1hdGguZmxvb3IoKHBjdCA8IDUwID8gMCA6IDIyMikgKiBwY3RMb3dlciArIDIyMiAqIHBjdFVwcGVyKTtcclxuICAgIHJldHVybiBcIiNcIiArICgoMSA8PCAyNCkgfCAociA8PCAxNikgfCAoZyA8PCA4KSB8IDB4MDApLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlVGFsZW50Um93RWxlbWVudCh0YWxlbnRMZXZlbDogVGFsZW50TGV2ZWwsIHRyZWVNb2RlOiBib29sZWFuKTpIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCB0YWxlbnRMZXZlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGFsZW50TGV2ZWxFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0YWxlbnQtcm93XCIpO1xyXG4gICAgdGFsZW50TGV2ZWxFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc2VsZWN0ZWRcIiwgdGFsZW50TGV2ZWwuaXNfc2VsZWN0ZWQgPyBcInllc1wiIDogXCJub1wiKTtcclxuXHJcbiAgICBjb25zdCBsZXZlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXZlbC5jbGFzc0xpc3QuYWRkKFwib3V0ZXJcIik7XHJcblxyXG4gICAgY29uc3QgbGV2ZWxJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXZlbElubmVyLmNsYXNzTGlzdC5hZGQoXCJpbm5lclwiKTtcclxuICAgIGxldmVsSW5uZXIuaW5uZXJUZXh0ID0gYCR7dGFsZW50TGV2ZWwubGV2ZWx9YDtcclxuXHJcbiAgICBsZXZlbC5hcHBlbmRDaGlsZChsZXZlbElubmVyKTtcclxuICAgIFxyXG4gICAgdGFsZW50TGV2ZWxFbGVtZW50LmFwcGVuZENoaWxkKGxldmVsKTtcclxuXHJcbiAgICB0YWxlbnRMZXZlbC50YWxlbnRJdGVtTGlzdC5mb3JFYWNoKHRhbGVudEl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0IHRhbGVudEl0ZW1FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0YWxlbnRJdGVtRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwib3V0ZXJcIik7XHJcbiAgICAgICAgdGFsZW50SXRlbUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zZWxlY3RlZFwiLCB0YWxlbnRJdGVtLmlzX3NlbGVjdGVkID8gXCJ5ZXNcIiA6IFwibm9cIik7XHJcbiAgICBcclxuICAgICAgICBjb25zdCBJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgSW5uZXIuY2xhc3NMaXN0LmFkZChcImlubmVyXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXRyZWVNb2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBlcmNlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICAgICAgcGVyY2VudC5jbGFzc0xpc3QuYWRkKCdwZXJjZW50Jyk7XHJcbiAgICAgICAgICAgIHBlcmNlbnQuc3R5bGVbJ2NvbG9yJ10gPSBnZXRDb2xvckZvclBlcmNlbnRhZ2UodGFsZW50SXRlbS5wZXJjZW50KTtcclxuICAgICAgICAgICAgcGVyY2VudC5pbm5lclRleHQgPSBgJHt0YWxlbnRJdGVtLnBlcmNlbnR9YDtcclxuICAgICAgICAgICAgSW5uZXIuYXBwZW5kQ2hpbGQocGVyY2VudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XHJcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKFwidGFsZW50LWljb25cIik7XHJcbiAgICAgICAgaWNvbi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKC9pbWcvaW4tZ2FtZS13aW5kb3cvdGFsZW50cy8ke3RhbGVudEl0ZW0uaWNvbn0pYDtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHRleHQuaW5uZXJUZXh0ID0gdGFsZW50SXRlbS5uYW1lO1xyXG5cclxuICAgICAgICBJbm5lci5hcHBlbmRDaGlsZChpY29uKTtcclxuICAgICAgICBJbm5lci5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICB0YWxlbnRJdGVtRWxlbWVudC5hcHBlbmRDaGlsZChJbm5lcik7XHJcbiAgICAgICAgdGFsZW50TGV2ZWxFbGVtZW50LmFwcGVuZENoaWxkKHRhbGVudEl0ZW1FbGVtZW50KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0YWxlbnRMZXZlbEVsZW1lbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUYWxlbnRzVGFibGUodGFsZW50VGFibGU6IFRhbGVudFRhYmxlLCB0cmVlTW9kZTogYm9vbGVhbik6SFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgdGFsZW50c1RhYmxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0YWxlbnRzVGFibGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0YWxlbnQtdGFibGVcIik7XHJcblxyXG4gICAgdGFsZW50VGFibGUudGFsZW50TGV2ZWxMaXN0LmZvckVhY2godGFsZW50TGV2ZWwgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRhbGVudExldmVsRWxlbWVudCA9IGNyZWF0ZVRhbGVudFJvd0VsZW1lbnQodGFsZW50TGV2ZWwsIHRyZWVNb2RlKTtcclxuICAgICAgICB0YWxlbnRzVGFibGVFbGVtZW50LmFwcGVuZENoaWxkKHRhbGVudExldmVsRWxlbWVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGFsZW50c1RhYmxlRWxlbWVudDtcclxufSIsIi8vIGNvbnN0IGZvcnRuaXRlQ2xhc3NJZCA9IDIxMjE2O1xyXG5jb25zdCB3b3dDbGFzc0lkID0gNzY1O1xyXG5cclxuY29uc3QgaW50ZXJlc3RpbmdGZWF0dXJlcyA9IFtcclxuICAnY291bnRlcnMnLFxyXG4gICdkZWF0aCcsXHJcbiAgJ2l0ZW1zJyxcclxuICAna2lsbCcsXHJcbiAgJ2tpbGxlZCcsXHJcbiAgJ2tpbGxlcicsXHJcbiAgJ2xvY2F0aW9uJyxcclxuICAnbWF0Y2hfaW5mbycsXHJcbiAgJ21hdGNoJyxcclxuICAnbWUnLFxyXG4gICdwaGFzZScsXHJcbiAgJ3JhbmsnLFxyXG4gICdyZXZpdmVkJyxcclxuICAncm9zdGVyJyxcclxuICAndGVhbSdcclxuXTtcclxuXHJcbmNvbnN0IHdpbmRvd05hbWVzID0ge1xyXG4gIGluR2FtZTogJ2luX2dhbWUnLFxyXG4gIGRlc2t0b3A6ICdkZXNrdG9wJ1xyXG59O1xyXG5cclxuY29uc3QgaG90a2V5cyA9IHtcclxuICB0b2dnbGU6ICdzaG93aGlkZSdcclxufTtcclxuXHJcbmV4cG9ydCB7XHJcbiAgd293Q2xhc3NJZCxcclxuICBpbnRlcmVzdGluZ0ZlYXR1cmVzLFxyXG4gIHdpbmRvd05hbWVzLFxyXG4gIGhvdGtleXNcclxufSIsImV4cG9ydCBjb25zdCB0ZXN0Q2xhc3NMaXN0ID0gW1xyXG4gIHsgaWQ6IFwiZGVhdGgta25pZ2h0XCIsIHRleHQ6IFwiRGVhdGggS25pZ2h0XCIgfSxcclxuICB7IGlkOiBcImRlbW9uLWh1bnRlclwiLCB0ZXh0OiBcIkRlbW9uIEh1bnRlclwiIH0sXHJcbiAgeyBpZDogXCJkcnVpZFwiLCB0ZXh0OiBcIkRydWlkXCIgfSxcclxuICB7IGlkOiBcImh1bnRlclwiLCB0ZXh0OiBcIkh1bnRlclwiIH0sXHJcbiAgeyBpZDogXCJtYWdlXCIsIHRleHQ6IFwiTWFnZVwiIH0sXHJcbiAgeyBpZDogXCJtb25rXCIsIHRleHQ6IFwiTW9ua1wiIH0sXHJcbiAgeyBpZDogXCJwYWxhZGluXCIsIHRleHQ6IFwiUGFsYWRpblwiIH0sXHJcbiAgeyBpZDogXCJwcmllc3RcIiwgdGV4dDogXCJQcmllc3RcIiB9LFxyXG4gIHsgaWQ6IFwicm9ndWVcIiwgdGV4dDogXCJSb2d1ZVwiIH0sXHJcbiAgeyBpZDogXCJzaGFtYW5cIiwgdGV4dDogXCJTaGFtYW5cIiB9LFxyXG4gIHsgaWQ6IFwid2FybG9ja1wiLCB0ZXh0OiBcIldhcmxvY2tcIiB9LFxyXG4gIHsgaWQ6IFwid2FycmlvclwiLCB0ZXh0OiBcIldhcnJpb3JcIiB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRlc3RTcGVjc0xpc3QgPSBbXHJcbiAgeyBpZDogXCJibG9vZFwiLCB0ZXh0OiBcIkJsb29kXCIgfSxcclxuICB7IGlkOiBcImZyb3N0XCIsIHRleHQ6IFwiRnJvc3RcIiB9LFxyXG4gIHsgaWQ6IFwidW5ob2x5XCIsIHRleHQ6IFwiVW5ob2x5XCIgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB0ZXN0RHVuZ2Vvbkxpc3QgPSBbXHJcbiAgeyBpZDogXCJkZS1vdGhlci1zaWRlXCIsIHRleHQ6IFwiZGUgb3RoZXIgc2lkZVwiIH0sXHJcbiAgeyBpZDogXCJoYWxscy1vZi1hdG9uZW1lbnRcIiwgdGV4dDogXCJoYWxscyBvZiBhdG9uZW1lbnRcIiB9LFxyXG4gIHsgaWQ6IFwibWlzdHMtb2YtdGlybmEtc2NpdGhlXCIsIHRleHQ6IFwibWlzdHMgb2YgdGlybmEgc2NpdGhlXCIgfSxcclxuICB7IGlkOiBcInBsYWd1ZWZhbGxcIiwgdGV4dDogXCJwbGFndWVmYWxsXCIgfSxcclxuICB7IGlkOiBcInNhbmd1aW5lLWRlcHRoc1wiLCB0ZXh0OiBcInNhbmd1aW5lIGRlcHRoc1wiIH0sXHJcbiAgeyBpZDogXCJzcGlyZXMtb2YtYXNjZW5zaW9uXCIsIHRleHQ6IFwic3BpcmVzIG9mIGFzY2Vuc2lvblwiIH0sXHJcbiAgeyBpZDogXCJ0aGUtbmVjcm90aWMtd2FrZVwiLCB0ZXh0OiBcInRoZSBuZWNyb3RpYyB3YWtlXCIgfSxcclxuICB7IGlkOiBcInRoZWF0ZXItb2YtcGFpblwiLCB0ZXh0OiBcInRoZWF0ZXIgb2YgcGFpblwiIH0sXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdGVzdFJhaWRMaXN0ID0gW1xyXG4gIHsgaWQ6IFwiYW50b3J1cy10aGUtYnVybmluZy10aHJvbmVcIiwgdGV4dDogXCJBbnRvcnVzLCB0aGUgQnVybmluZyBUaHJvbmVcIiB9LFxyXG4gIHsgaWQ6IFwiYmF0dGxlLW9mLWRhemFyYWxvclwiLCB0ZXh0OiBcIkJhdHRsZSBvZiBEYXphcidhbG9yXCIgfSxcclxuICB7IGlkOiBcImNhc3RsZS1uYXRocmlhXCIsIHRleHQ6IFwiQ2FzdGxlIE5hdGhyaWFcIiB9LFxyXG4gIHsgaWQ6IFwiY3J1Y2libGUtb2Ytc3Rvcm1zXCIsIHRleHQ6IFwiQ3J1Y2libGUgb2YgU3Rvcm1zXCIgfSxcclxuICB7IGlkOiBcIm55YWx0aGEtdGhlLXdha2luZy1jaXR5XCIsIHRleHQ6IFwiTnknYWx0aGEsIHRoZSBXYWtpbmcgQ2l0eVwiIH0sXHJcbiAgeyBpZDogXCJ0aGUtZW1lcmFsZC1uaWdodG1hcmVcIiwgdGV4dDogXCJUaGUgRW1lcmFsZCBOaWdodG1hcmVcIiB9LFxyXG4gIHsgaWQ6IFwidGhlLWV0ZXJuYWwtcGFsYWNlXCIsIHRleHQ6IFwiVGhlIEV0ZXJuYWwgUGFsYWNlXCIgfSxcclxuICB7IGlkOiBcInRoZS1uaWdodGhvbGRcIiwgdGV4dDogXCJUaGUgTmlnaHRob2xkXCIgfSxcclxuICB7IGlkOiBcInRvbWItb2Ytc2FyZ2VyYXNcIiwgdGV4dDogXCJUb21iIG9mIFNhcmdlcmFzXCIgfSxcclxuICB7IGlkOiBcInRyaWFsLW9mLXZhbG9yXCIsIHRleHQ6IFwiVHJpYWwgb2YgVmFsb3JcIiB9LFxyXG4gIHsgaWQ6IFwidWxkaXJcIiwgdGV4dDogXCJVbGRpclwiIH0sXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdGVzdEtleUxldmVsTGlzdCA9IFtcclxuICB7IGlkOiBcIm15dGhpY1wiLCB0ZXh0OiBcIk15dGhpY1wiIH0sXHJcbiAgeyBpZDogXCJoZXJvaWNcIiwgdGV4dDogXCJIZXJvaWNcIiB9LFxyXG4gIHsgaWQ6IFwibm9ybWFsXCIsIHRleHQ6IFwiTm9ybWFsXCIgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB0ZXN0UmFpZEJvc3NMaXN0ID0gW1xyXG4gIHsgaWQ6IFwiYWdncmFtYXJcIiwgdGV4dDogXCJBZ2dyYW1hclwiIH0sXHJcbiAgeyBpZDogXCJhbnRvcmFuLWhpZ2gtY29tbWFuZFwiLCB0ZXh0OiBcIkFudG9yYW4gSGlnaCBDb21tYW5kXCIgfSxcclxuICB7IGlkOiBcImFyZ3VzLXRoZS11bm1ha2VyXCIsIHRleHQ6IFwiQXJndXMgdGhlIFVubWFrZXJcIiB9LFxyXG4gIHsgaWQ6IFwiZW9uYXItdGhlLWxpZmUtYmluZGVyXCIsIHRleHQ6IFwiRW9uYXIgdGhlIExpZmUtQmluZGVyXCIgfSxcclxuICB7IGlkOiBcImZlbGhvdW5kcy1vZi1zYXJnZXJhc1wiLCB0ZXh0OiBcIkZlbGhvdW5kcyBvZiBTYXJnZXJhc1wiIH0sXHJcbiAgeyBpZDogXCJnYXJvdGhpLXdvcmxkYnJlYWtlclwiLCB0ZXh0OiBcIkdhcm90aGkgV29ybGRicmVha2VyXCIgfSxcclxuICB7IGlkOiBcImltb25hci10aGUtc291bGh1bnRlclwiLCB0ZXh0OiBcIkltb25hciB0aGUgU291bGh1bnRlclwiIH0sXHJcbiAgeyBpZDogXCJraW4nZ2Fyb3RoXCIsIHRleHQ6IFwiS2luJ2dhcm90aFwiIH0sXHJcbiAgeyBpZDogXCJwb3J0YWwta2VlcGVyLWhhc2FiZWxcIiwgdGV4dDogXCJQb3J0YWwgS2VlcGVyIEhhc2FiZWxcIiB9LFxyXG4gIHsgaWQ6IFwidGhlLWNvdmVuLW9mLXNoaXZhcnJhXCIsIHRleHQ6IFwiVGhlIENvdmVuIG9mIFNoaXZhcnJhXCIgfSxcclxuICB7IGlkOiBcInZhcmltYXRocmFzXCIsIHRleHQ6IFwiVmFyaW1hdGhyYXNcIiB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRlc3RUYWxlbnRzSW5mbyA9IFtcclxuICB7XHJcbiAgICBsZXZlbDogMTUsXHJcbiAgICB0YWxlbnRJdGVtTGlzdDogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJIZWFydGJyZWFrZXJcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX2RlYXRoa25pZ2h0X2RlYXRoc3RyaWtlLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAyNzMwLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJCbG9vZGRyaW5rZXJcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfYW5pbXVzZHJhdy5qcGdcIixcclxuICAgICAgICBjb3VudDogNDAwLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJUb21ic3RvbmVcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfZmllZ25kZWFkLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA4MyxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbGV2ZWw6IDI1LFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiUmFwaWQgRGVjb21wb3NpdGlvblwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9kZWF0aGtuaWdodF9kZWF0aHNpcGhvbjIuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDU0LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJIZW1vc3Rhc2lzXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2RlYXRod2luZ19ibG9vZGNvcnJ1cHRpb25fZWFydGguanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDMxNDQsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkNvbnN1bXB0aW9uXCIsXHJcbiAgICAgICAgaWNvbjogXCJpbnZfYXhlXzJoX2FydGlmYWN0bWF3X2RfMDEuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDE1LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgfSxcclxuICB7XHJcbiAgICBsZXZlbDogMzAsXHJcbiAgICB0YWxlbnRJdGVtTGlzdDogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJGb3VsIEJ1bHdhcmtcIixcclxuICAgICAgICBpY29uOiBcImludl9hcm1vcl9zaGllbGRfbmF4eHJhbWFzX2RfMDIuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDYwNyxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiUmVsaXNoIGluIEJsb29kXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2RlYXRoa25pZ2h0X3JvaWxpbmdibG9vZC5qcGdcIixcclxuICAgICAgICBjb3VudDogMTYxMyxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiQmxvb2QgVGFwXCIsXHJcbiAgICAgICAgaWNvbjogXCJzcGVsbF9kZWF0aGtuaWdodF9ibG9vZHRhcC5qcGdcIixcclxuICAgICAgICBjb3VudDogOTkzLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgfSxcclxuICB7XHJcbiAgICBsZXZlbDogMzUsXHJcbiAgICB0YWxlbnRJdGVtTGlzdDogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJXaWxsIG9mIHRoZSBOZWNyb3BvbGlzXCIsXHJcbiAgICAgICAgaWNvbjogXCJhY2hpZXZlbWVudF9ib3NzX2tlbHRodXphZF8wMS5qcGdcIixcclxuICAgICAgICBjb3VudDogMzExMyxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiQW50aS1NYWdpYyBCYXJyaWVyXCIsXHJcbiAgICAgICAgaWNvbjogXCJzcGVsbF9zaGFkb3dfYW50aW1hZ2ljc2hlbGwuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDkyLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJNYXJrIG9mIEJsb29kXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2h1bnRlcl9yYXBpZGtpbGxpbmcuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDgsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiA0MCxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkdyaXAgb2YgdGhlIERlYWRcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfY3JlYXR1cmVfZGlzZWFzZV8wNS5qcGdcIixcclxuICAgICAgICBjb3VudDogMjM2OSxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiVGlnaHRlbmluZyBHcmFzcFwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9kZWF0aGtuaWdodF9hb2VkZWF0aGdyaXAuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDE4NSxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiV3JhaXRoIFdhbGtcIixcclxuICAgICAgICBpY29uOiBcImludl9oZWxtX3BsYXRlX3JhaWRkZWF0aGtuaWdodF9wXzAxLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA2NTksXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiA0NSxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlZvcmFjaW91c1wiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9pcm9ubWFpZGVuc193aGlybG9mYmxvb2QuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDE5OTYsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkRlYXRoIFBhY3RcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX3NoYWRvd19kZWF0aHBhY3QuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDE3LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJCbG9vZHdvcm1zXCIsXHJcbiAgICAgICAgaWNvbjogXCJzcGVsbF9zaGFkb3dfc291bGxlZWNoLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAxMjAwLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgfSxcclxuICB7XHJcbiAgICBsZXZlbDogNTAsXHJcbiAgICB0YWxlbnRJdGVtTGlzdDogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJQdXJnYXRvcnlcIixcclxuICAgICAgICBpY29uOiBcImludl9taXNjX3NoYWRvd2VnZy5qcGdcIixcclxuICAgICAgICBjb3VudDogNjYxLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJSZWQgVGhpcnN0XCIsXHJcbiAgICAgICAgaWNvbjogXCJzcGVsbF9kZWF0aGtuaWdodF9ibG9vZHByZXNlbmNlLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAxNjY5LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJCb25lc3Rvcm1cIixcclxuICAgICAgICBpY29uOiBcImFjaGlldmVtZW50X2Jvc3NfbG9yZG1hcnJvd2dhci5qcGdcIixcclxuICAgICAgICBjb3VudDogODgzLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgfVxyXG5dOyIsImltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcclxuXHJcbmNvbnN0IGFwaSA9IGF4aW9zLmNyZWF0ZSh7XHJcbiAgLy8gICBiYXNlVVJMOiBgaHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaWAsXHJcbiAgYmFzZVVSTDogYGh0dHBzOi8vd293bWUuZ2cvYXBpYCxcclxuICBoZWFkZXJzOiB7XHJcbiAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBzZXRBdXRoVG9rZW4gPSAodG9rZW4pID0+IHtcclxuICBkZWxldGUgYXBpLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uW1wieC1hdXRoLXRva2VuXCJdO1xyXG5cclxuICBpZiAodG9rZW4pIHtcclxuICAgIGFwaS5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbltcIngtYXV0aC10b2tlblwiXSA9IHRva2VuO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTcGVjTGlzdCA9IGFzeW5jIChjbGFzc19uYW1lKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLmdldChgL2dldF9zcGVjX2xpc3RgLCB7XHJcbiAgICAgIHBhcmFtczogeyBjbGFzczogY2xhc3NfbmFtZSB9LFxyXG4gICAgfSk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLnNwZWNMaXN0O1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuICByZXR1cm4gW107XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RHVuZ2Vvbkxpc3QgPSBhc3luYyAobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLmdldChgL2dldF9kdW5nZW9uX2xpc3RgLCB7XHJcbiAgICAgIHBhcmFtczogeyBtaW46IG1pbiwgbWF4OiBtYXggfSxcclxuICAgIH0pO1xyXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5kdW5nZW9uTGlzdDtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBbXTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSYWlkTGlzdCA9IGFzeW5jICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkuZ2V0KGAvZ2V0X3JhaWRfbGlzdGApO1xyXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yYWlkTGlzdDtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBbXTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRSYWlkQm9zc0xpc3QgPSBhc3luYyAocmFpZCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5nZXQoYC9nZXRfcmFpZF9ib3NzX2xpc3RgLCB7XHJcbiAgICAgIHBhcmFtczogeyByYWlkOiByYWlkIH0sXHJcbiAgICB9KTtcclxuICAgIGlmIChyZXNwb25zZS5kYXRhLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmFpZEJvc3NMaXN0O1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtdO1xyXG59O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUYWxlbnRJbmZvUmVzcG9uc2Uge1xyXG4gIHRhbGVudFRhYmxlSW5mbzogYW55W107XHJcbiAgbG9nQ291bnQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFRhbGVudFRhYmxlSW5mbyA9IGFzeW5jIChcclxuICBwYXJhbXNcclxuKTogUHJvbWlzZTxUYWxlbnRJbmZvUmVzcG9uc2U+ID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkuZ2V0KGAvZ2V0X3RhbGVudF90YWJsZV9pbmZvYCwge1xyXG4gICAgICBwYXJhbXM6IHBhcmFtcyxcclxuICAgIH0pO1xyXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHRhbGVudFRhYmxlSW5mbzogcmVzcG9uc2UuZGF0YS5mYW1vdXNUYWxlbnRJbmZvLFxyXG4gICAgICAgIGxvZ0NvdW50OiByZXNwb25zZS5kYXRhLmxvZ0NvdW50LFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHRhbGVudFRhYmxlSW5mbzogW10sXHJcbiAgICBsb2dDb3VudDogMCxcclxuICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFRva2VuID0gYXN5bmMgKHBhcmFtcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkucG9zdChcIi9hdXRoL2JuZXRfdG9rZW5cIiwgcGFyYW1zKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgICAgc2V0QXV0aFRva2VuKHJlcy5kYXRhLnRva2VuKTtcclxuICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Q2hhcmFjdGVycyA9IGFzeW5jICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLnBvc3QoXCIvZ2V0X2NoYXJhY3RlcnNcIik7XHJcbiAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRKb3VybmFscyA9IGFzeW5jICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLmdldChcIi9qb3VybmFsc1wiKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBzdG9yZUpvdXJuYWxzID0gYXN5bmMgKGRhdGEpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLnBvc3QoXCIvam91cm5hbHNcIiwgZGF0YSk7XHJcbiAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlSm91cm5hbHMgPSBhc3luYyAoam91cm5lbElEICxkYXRhKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5wdXQoYC9qb3VybmFscy8ke2pvdXJuZWxJRH1gLCBkYXRhKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlSm91cm5hbENvbnRlbnQgPSBhc3luYyAoaWQsZGF0YSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkucG9zdChgL2pvdXJuYWxzLyR7aWR9L2NvbnRlbnRgLCBkYXRhKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVKb3VybmFsQ29udGVudCA9IGFzeW5jIChqb3VybmVsSUQsY29udGVudElEKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5kZWxldGUoYC9qb3VybmFscy8ke2pvdXJuZWxJRH0vY29udGVudC8ke2NvbnRlbnRJRH1gKTtcclxuICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgZWRpdEpvdXJuYWxDb250ZW50ID0gYXN5bmMgKGpvdXJuZWxJRCxjb250ZW50SUQgLCBkYXRhKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5wdXQoYC9qb3VybmFscy8ke2pvdXJuZWxJRH0vY29udGVudC8ke2NvbnRlbnRJRH1gLCBkYXRhKTtcclxuICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVKb3VybmFsID0gYXN5bmMgKGpvdXJuZWxJRCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkuZGVsZXRlKGAvam91cm5hbHMvJHtqb3VybmVsSUR9YCk7XHJcbiAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSlcclxuICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn07XHJcbiIsImltcG9ydCB7IGNyZWF0ZUN1c3RvbURyb3BEb3duLCBEcm9wRG93bkl0ZW1JbmZvIH0gZnJvbSAnLi4vY29tcG9uZW50cy9kcm9wZG93bic7XHJcblxyXG5jb25zdCBjb252ZXJ0Q2hhcmFjdGVyc1RvRHJvcGRvd25Gb3JtYXQgPSAoY2hhcmFjdGVycykgPT4ge1xyXG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gIGZvciAoY29uc3QgY2hhcmFjdGVyIG9mIGNoYXJhY3RlcnMpIHtcclxuICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgaWQ6IGNoYXJhY3Rlci5pZCxcclxuICAgICAgdGV4dDogYCR7Y2hhcmFjdGVyLnJlYWxtX25hbWV9IC0gJHtjaGFyYWN0ZXIubmFtZX1gXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhcmFjdGVySW5mbyB7XHJcbiAgcHJpdmF0ZSBjaGFyYWN0ZXJzID0gW107XHJcbiAgcHJpdmF0ZSBzZWxlY3RlZENoYXJhY3RlcklEO1xyXG5cclxuICBjb25zdHJ1Y3RvcihjaGFyYWN0ZXJzKSB7XHJcbiAgICB0aGlzLmNoYXJhY3RlcnMgPSBjaGFyYWN0ZXJzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRFbGVtZW50SW5uZXJIVE1MKGlkLCBjb250ZW50KSB7XHJcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIGVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXREcm9wRG93bkV2ZW50TGlzdG5lcihuYW1lOiBzdHJpbmcpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKG5hbWUpLmZvckVhY2goZWxlbSA9PiB7XHJcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYXJhY3RlcklEID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zZWxlY3RlZENoYXJhY3RlcklEKTtcclxuICAgICAgICB0aGlzLnNldENoYXJhY3RlckluZm9QYW5lbCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldENoYXJhY3RlckluZm9QYW5lbCgpIHtcclxuICAgIGZvciAoY29uc3QgY2hhcmFjdGVyIG9mIHRoaXMuY2hhcmFjdGVycykge1xyXG4gICAgICBpZiAoY2hhcmFjdGVyLmlkID09IHRoaXMuc2VsZWN0ZWRDaGFyYWN0ZXJJRCkge1xyXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElubmVySFRNTChcInRvdGFsX251bWJlcl9kZWF0aHNcIiwgYFRvdGFsIE51bWJlciBEZWF0aHM6ICR7Y2hhcmFjdGVyLnRvdGFsX251bWJlcl9kZWF0aHN9YCk7XHJcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SW5uZXJIVE1MKFwidG90YWxfZ29sZF9nYWluZWRcIiwgYFRvdGFsIEdvbGQgR2FpbmVkOiAke2NoYXJhY3Rlci50b3RhbF9nb2xkX2dhaW5lZH1gKTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnRJbm5lckhUTUwoXCJ0b3RhbF9nb2xkX2xvc3RcIiwgYFRvdGFsIEdvbGQgTG9zdDogJHtjaGFyYWN0ZXIudG90YWxfZ29sZF9sb3N0fWApO1xyXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElubmVySFRNTChcInRvdGFsX2l0ZW1fdmFsdWVfZ2FpbmVkXCIsIGBUb3RhbCBJdGVtIFZhbHVlIEdhaW5lZDogJHtjaGFyYWN0ZXIudG90YWxfaXRlbV92YWx1ZV9nYWluZWR9YCk7XHJcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SW5uZXJIVE1MKFwibGV2ZWxfbnVtYmVyX2RlYXRoc1wiLCBgTGV2ZWwgTnVtYmVyIERlYXRoczogJHtjaGFyYWN0ZXIubGV2ZWxfbnVtYmVyX2RlYXRoc31gKTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnRJbm5lckhUTUwoXCJsZXZlbF9nb2xkX2dhaW5lZFwiLCBgTGV2ZWwgR29sZCBHYWluZWQ6ICR7Y2hhcmFjdGVyLmxldmVsX2dvbGRfZ2FpbmVkfWApO1xyXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElubmVySFRNTChcImxldmVsX2dvbGRfbG9zdFwiLCBgTGV2ZWwgR29sZCBMb3N0OiAke2NoYXJhY3Rlci5sZXZlbF9nb2xkX2xvc3R9YCk7XHJcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SW5uZXJIVE1MKFwibGV2ZWxfaXRlbV92YWx1ZV9nYWluZWRcIiwgYExldmVsIEl0ZW0gVmFsdWUgR2FpbmVkOiAke2NoYXJhY3Rlci5sZXZlbF9pdGVtX3ZhbHVlX2dhaW5lZH1gKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBwdWJsaWMgaW5pdERyb3Bkb3duKCkge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJhY3Rlci1zZWxlY3QtYm94X19jb250YWluZXInKTtcclxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuICBcclxuICAgIGNvbnN0IGVsRHJvcGRvd24gPSBjcmVhdGVDdXN0b21Ecm9wRG93bih7XHJcbiAgICAgIHZhcmlhYmxlTmFtZTogJ2NoYXJhY3RlcicsXHJcbiAgICAgIGRyb3BEb3duTGlzdDogY29udmVydENoYXJhY3RlcnNUb0Ryb3Bkb3duRm9ybWF0KHRoaXMuY2hhcmFjdGVycylcclxuICAgIH0pO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsRHJvcGRvd24pO1xyXG4gIFxyXG4gICAgdGhpcy5pbml0RHJvcERvd25FdmVudExpc3RuZXIoJ2NoYXJhY3RlcicpO1xyXG5cclxuICAgIHRoaXMuc2VsZWN0ZWRDaGFyYWN0ZXJJRCA9IHRoaXMuY2hhcmFjdGVycy5sZW5ndGggPiAwID8gdGhpcy5jaGFyYWN0ZXJzWzBdLmlkIDogbnVsbDtcclxuICAgIHRoaXMuc2V0Q2hhcmFjdGVySW5mb1BhbmVsKCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNyZWF0ZUN1c3RvbURyb3BEb3duLCBEcm9wRG93bkl0ZW1JbmZvIH0gZnJvbSAnLi4vY29tcG9uZW50cy9kcm9wZG93bic7XHJcbmltcG9ydCB7IGNyZWF0ZVRhbGVudHNUYWJsZSB9IGZyb20gJy4uL2NvbXBvbmVudHMvdGFsZW50c1RhYmxlJztcclxuXHJcbmltcG9ydCB7IHRlc3RDbGFzc0xpc3QsIHRlc3RLZXlMZXZlbExpc3QsIHRlc3RSYWlkQm9zc0xpc3QsIHRlc3REdW5nZW9uTGlzdCwgdGVzdFJhaWRMaXN0LCB0ZXN0U3BlY3NMaXN0LCB0ZXN0VGFsZW50c0luZm8gfSBmcm9tICcuLi9pbml0L2luaXREYXRhJztcclxuXHJcbmltcG9ydCB7IGdldFNwZWNMaXN0LCBnZXREdW5nZW9uTGlzdCwgZ2V0UmFpZExpc3QsIGdldFJhaWRCb3NzTGlzdCwgZ2V0VGFsZW50VGFibGVJbmZvIH0gZnJvbSAnLi9hcGknO1xyXG5cclxuaW50ZXJmYWNlIFNlYXJjaENvbmRpdGlvbiB7XHJcbiAgY2xhc3M6IHN0cmluZyxcclxuICBzcGVjczogc3RyaW5nLFxyXG4gIGlzX2R1bmdlb246IGJvb2xlYW4sXHJcbiAgcmFpZF9kdW5nZW9uOiBzdHJpbmcsXHJcbiAga2V5X2xldmVsOiBzdHJpbmcsXHJcbiAgcmFpZF9ib3NzOiBzdHJpbmcsXHJcbiAga2V5X3N0b25lX2xldmVsX21pbjogbnVtYmVyLFxyXG4gIGtleV9zdG9uZV9sZXZlbF9tYXg6IG51bWJlcixcclxuICBhZHZhbmNlZF9maWx0ZXJzOiBib29sZWFuLFxyXG4gIHRyZWVfbW9kZTogYm9vbGVhblxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFsZW50UGlja2VyIHtcclxuICBwcml2YXRlIHNlYXJjaENvbmRpdGlvbjogU2VhcmNoQ29uZGl0aW9uO1xyXG4gIHByaXZhdGUgZmFtb3VzVGFsZW50SW5mbzogYW55O1xyXG4gIHByaXZhdGUgc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXg6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlYXJjaENvbmRpdGlvbiA9IHtcclxuICAgICAgY2xhc3M6ICdEZW1vbiBIdW50ZXInLFxyXG4gICAgICBzcGVjczogJ0hhdm9jJyxcclxuICAgICAgaXNfZHVuZ2VvbjogdHJ1ZSxcclxuICAgICAgcmFpZF9kdW5nZW9uOiAnQ2FzdGxlIE5hdGhyaWEnLFxyXG4gICAgICBrZXlfbGV2ZWw6ICdNeXRoaWMnLFxyXG4gICAgICByYWlkX2Jvc3M6ICdTaHJpZWt3aW5nJyxcclxuICAgICAga2V5X3N0b25lX2xldmVsX21pbjogMSxcclxuICAgICAga2V5X3N0b25lX2xldmVsX21heDogNDUsXHJcbiAgICAgIGFkdmFuY2VkX2ZpbHRlcnM6IGZhbHNlLFxyXG4gICAgICB0cmVlX21vZGU6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvID0gdGVzdFRhbGVudHNJbmZvO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGluaXRDb21wb25lbnRzKCkge1xyXG4gICAgdGhpcy5pbml0RHJvcGRvd25zKCk7XHJcbiAgICB0aGlzLmluaXRLZXlTdG9uZUxldmVsUmFuZ2UoKTtcclxuICAgIHRoaXMuaW5pdFN3aXRjaCgpO1xyXG5cclxuICAgIHRoaXMuaW5pdFRhbGVudHNUYWJsZSh0aGlzLmZhbW91c1RhbGVudEluZm8sIDApO1xyXG5cclxuICAgIHRoaXMuaW5pdEluUHJvZ3Jlc3NFdmVudCgpO1xyXG4gICAgdGhpcy5pbml0VHJlZU1vZGVBY3Rpb25QYW5lbEV2ZW50KCk7XHJcblxyXG4gICAgLy8gdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdERyb3BEb3duRXZlbnRMaXN0bmVyKG5hbWU6IHN0cmluZykge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUobmFtZSkuZm9yRWFjaChlbGVtID0+IHtcclxuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbltuYW1lXSA9ICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCkudmFsdWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcclxuICAgICAgICAgIHRoaXMucmVsb2FkU3BlY0Ryb3Bkb3duKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAncmFpZF9kdW5nZW9uJykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VhcmNoQ29uZGl0aW9uLmlzX2R1bmdlb24pIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVsb2FkUmFpZEJvc3NEcm9wZG93bigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXRTZWxlY3QodGl0bGU6IHN0cmluZywgcGFyZW50X2lkOiBzdHJpbmcsIGRyb3Bkb3duTGlzdDogRHJvcERvd25JdGVtSW5mb1tdLCB2YXJpYWJsZU5hbWU6IHN0cmluZykge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyZW50X2lkKTtcclxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuICBcclxuICAgIGNvbnN0IGVsVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG4gICAgZWxUaXRsZS5pbm5lclRleHQgPSB0aXRsZTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbFRpdGxlKTtcclxuICBcclxuICAgIGNvbnN0IGVsRHJvcGRvd24gPSBjcmVhdGVDdXN0b21Ecm9wRG93bih7XHJcbiAgICAgIHZhcmlhYmxlTmFtZTogdmFyaWFibGVOYW1lLFxyXG4gICAgICBkcm9wRG93bkxpc3Q6IGRyb3Bkb3duTGlzdFxyXG4gICAgfSk7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWxEcm9wZG93bik7XHJcbiAgXHJcbiAgICB0aGlzLmluaXREcm9wRG93bkV2ZW50TGlzdG5lcih2YXJpYWJsZU5hbWUpO1xyXG4gICAgdGhpcy5zZWFyY2hDb25kaXRpb25bdmFyaWFibGVOYW1lXSA9IGRyb3Bkb3duTGlzdFswXS50ZXh0O1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXREcm9wZG93bnMoKSB7XHJcbiAgICB0aGlzLmluaXRTZWxlY3QoXCJDbGFzc1wiLCBcImNsYXNzLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiLCB0ZXN0Q2xhc3NMaXN0LCAnY2xhc3MnKTtcclxuICAgIHRoaXMuaW5pdFNlbGVjdChcIlNwZWNzXCIsIFwic3BlY3Mtc2VsZWN0LWJveF9fY29udGFpbmVyXCIsIHRlc3RTcGVjc0xpc3QsICdzcGVjcycpO1xyXG4gICAgdGhpcy5pbml0U2VsZWN0KFwiRHVuZ2VvbiBMaXN0XCIsIFwicmFpZF9kdW5nZW9uLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiLCB0ZXN0RHVuZ2Vvbkxpc3QsICdyYWlkX2R1bmdlb24nKTtcclxuICAgIHRoaXMuaW5pdFNlbGVjdChcIlJhaWQgTGV2ZWxcIiwgXCJrZXlfbGV2ZWwtc2VsZWN0LWJveF9fY29udGFpbmVyXCIsIHRlc3RLZXlMZXZlbExpc3QsICdrZXlfbGV2ZWwnKTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBhc3luYyByZWxvYWRTcGVjRHJvcGRvd24oKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgc3BlY0xpc3QgPSBhd2FpdCBnZXRTcGVjTGlzdCh0aGlzLnNlYXJjaENvbmRpdGlvbi5jbGFzcyk7XHJcbiAgICAgIHNwZWNMaXN0ID0gc3BlY0xpc3QubGVuZ3RoID4gMCA/IHNwZWNMaXN0IDogdGVzdFNwZWNzTGlzdDtcclxuICAgICAgdGhpcy5pbml0U2VsZWN0KFwiU3BlY3NcIiwgXCJzcGVjcy1zZWxlY3QtYm94X19jb250YWluZXJcIiwgc3BlY0xpc3QsICdzcGVjcycpO1xyXG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5zcGVjcyA9IHNwZWNMaXN0WzBdLnRleHQ7XHJcbiAgXHJcbiAgICAgIGNvbnN0IGFuaW1QYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxlbnQtYW5pbS1wYW5lbCcpO1xyXG4gICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZUluJyk7XHJcbiAgICAgIGlmICghYW5pbVBhbmVsLmNsYXNzTGlzdC5jb250YWlucygnZmFkZU91dCcpKSB7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXQnKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBhc3luYyByZWxvYWRSYWlkRHVuZ2VvbkRyb3Bkb3duKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgYW5pbVBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGVudC1hbmltLXBhbmVsJyk7XHJcbiAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlSW4nKTtcclxuICAgICAgaWYgKCFhbmltUGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdmYWRlT3V0JykpIHtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZU91dCcpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGxldCByYWlkRHVuZ2Vvbkxpc3QgPSBbXTtcclxuICAgICAgaWYgKHRoaXMuc2VhcmNoQ29uZGl0aW9uLmlzX2R1bmdlb24pIHtcclxuICAgICAgICByYWlkRHVuZ2Vvbkxpc3QgPSBhd2FpdCBnZXREdW5nZW9uTGlzdCh0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWluLCB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4KTtcclxuICAgICAgICByYWlkRHVuZ2Vvbkxpc3QgPSByYWlkRHVuZ2Vvbkxpc3QubGVuZ3RoID4gMCA/IHJhaWREdW5nZW9uTGlzdCA6IHRlc3REdW5nZW9uTGlzdDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByYWlkRHVuZ2Vvbkxpc3QgPSBhd2FpdCBnZXRSYWlkTGlzdCgpO1xyXG4gICAgICAgIHJhaWREdW5nZW9uTGlzdCA9IHJhaWREdW5nZW9uTGlzdC5sZW5ndGggPiAwID8gcmFpZER1bmdlb25MaXN0IDogdGVzdFJhaWRMaXN0O1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaW5pdFNlbGVjdChcclxuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uID8gXCJEdW5nZW9uIExpc3RcIiA6IFwiUmFpZCBMaXN0XCIsIFxyXG4gICAgICAgIFwicmFpZF9kdW5nZW9uLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiLCBcclxuICAgICAgICByYWlkRHVuZ2Vvbkxpc3QsIFxyXG4gICAgICAgICdyYWlkX2R1bmdlb24nXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLnJhaWRfZHVuZ2VvbiA9IHJhaWREdW5nZW9uTGlzdFswXS50ZXh0O1xyXG4gIFxyXG4gICAgICBpZiAodGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2Vvbikge1xyXG4gICAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZWxvYWRSYWlkQm9zc0Ryb3Bkb3duKCk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgYXN5bmMgcmVsb2FkUmFpZEJvc3NEcm9wZG93bigpIHtcclxuICAgIGNvbnN0IGFuaW1QYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxlbnQtYW5pbS1wYW5lbCcpO1xyXG4gICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVJbicpO1xyXG4gICAgaWYgKCFhbmltUGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdmYWRlT3V0JykpIHtcclxuICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXQnKTtcclxuICAgIH1cclxuICBcclxuICAgIGxldCByYWlkQm9zc0xpc3QgPSBhd2FpdCBnZXRSYWlkQm9zc0xpc3QodGhpcy5zZWFyY2hDb25kaXRpb24ucmFpZF9kdW5nZW9uKTtcclxuICAgIHJhaWRCb3NzTGlzdCA9IHJhaWRCb3NzTGlzdC5sZW5ndGggPiAwID8gcmFpZEJvc3NMaXN0IDogdGVzdFJhaWRCb3NzTGlzdDtcclxuICBcclxuICAgIHRoaXMuaW5pdFNlbGVjdChcIlJhaWQgQm9zc1wiLCBcInJhaWRfYm9zcy1zZWxlY3QtYm94X19jb250YWluZXJcIiwgIHJhaWRCb3NzTGlzdCwgJ3JhaWRfYm9zcycpO1xyXG4gICAgdGhpcy5zZWFyY2hDb25kaXRpb24ucmFpZF9ib3NzID0gcmFpZEJvc3NMaXN0WzBdLnRleHQ7XHJcbiAgXHJcbiAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGFzeW5jIGRyYXdUYWxlbnRUYWJsZShub0FuaW0/OiBib29sZWFuKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBhbmltUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsZW50LWFuaW0tcGFuZWwnKTtcclxuICAgICAgaWYgKCFub0FuaW0gJiYgIWFuaW1QYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZhZGVPdXQnKSkge1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0Jyk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBnZXRUYWxlbnRUYWJsZUluZm8oe1xyXG4gICAgICAgIGNsYXNzX25hbWU6IHRoaXMuc2VhcmNoQ29uZGl0aW9uLmNsYXNzLCBcclxuICAgICAgICBzcGVjOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5zcGVjcyxcclxuICAgICAgICB0eXBlOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uID8gJ2R1bmdlb24nIDogJ3JhaWQnLFxyXG4gICAgICAgIHJhaWRfZHVuZ2VvbjogdGhpcy5zZWFyY2hDb25kaXRpb24ucmFpZF9kdW5nZW9uLCBcclxuICAgICAgICByYWlkX2Jvc3M6IHRoaXMuc2VhcmNoQ29uZGl0aW9uLnJhaWRfYm9zcyxcclxuICAgICAgICByYWlkX2xldmVsOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfbGV2ZWwsXHJcbiAgICAgICAgZHVuZ2Vvbl9taW5fbGV2ZWw6IHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW4sXHJcbiAgICAgICAgZHVuZ2Vvbl9tYXhfbGV2ZWw6IHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXgsXHJcbiAgICAgICAgdHJlZV9tb2RlOiB0aGlzLnNlYXJjaENvbmRpdGlvbi50cmVlX21vZGUgPyAndHJlZScgOiAnbm9ybWFsJ1xyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgaWYgKHRoaXMuc2VhcmNoQ29uZGl0aW9uLnRyZWVfbW9kZSkge1xyXG4gICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mbyA9IHJlc3BvbnNlLnRhbGVudFRhYmxlSW5mby5sZW5ndGggPiAwID8gcmVzcG9uc2UudGFsZW50VGFibGVJbmZvIDogW3twaWNrX3JhdGU6IDAsIHRhbGVudF90cmVlOiB0ZXN0VGFsZW50c0luZm99XTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4ID0gMDtcclxuICAgICAgICB0aGlzLmluaXRUYWxlbnRzVGFibGUodGhpcy5mYW1vdXNUYWxlbnRJbmZvWzBdLnRhbGVudF90cmVlLCByZXNwb25zZS5sb2dDb3VudCwgMCwgdGhpcy5mYW1vdXNUYWxlbnRJbmZvWzBdLnBpY2tfcmF0ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvID0gcmVzcG9uc2UudGFsZW50VGFibGVJbmZvLmxlbmd0aCA+IDAgPyByZXNwb25zZS50YWxlbnRUYWJsZUluZm8gOiB0ZXN0VGFsZW50c0luZm87XHJcbiAgICAgICAgdGhpcy5pbml0VGFsZW50c1RhYmxlKHRoaXMuZmFtb3VzVGFsZW50SW5mbywgcmVzcG9uc2UubG9nQ291bnQpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGlmICghbm9BbmltKSB7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVPdXQnKTtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZUluJyk7XHJcbiAgICAgIH1cclxuICBcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgaW5pdEtleVN0b25lTGV2ZWxSYW5nZSgpIHtcclxuICAgIGNvbnN0IGVsZW1NaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImtleS1zdG9uZS1sZXZlbC1taW5cIik7XHJcbiAgICBjb25zdCBlbGVtTWF4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJrZXktc3RvbmUtbGV2ZWwtbWF4XCIpO1xyXG4gICAgY29uc3QgZWxlbVRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImtleS1zdG9uZS1sZXZlbC10ZXh0XCIpO1xyXG4gIFxyXG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PmVsZW1NaW4pLnZhbHVlID0gYCR7dGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbn1gO1xyXG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PmVsZW1NYXgpLnZhbHVlID0gYCR7dGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heH1gO1xyXG4gICAgZWxlbVRleHQuaW5uZXJUZXh0ID0gYCR7dGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbn0gLSAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXh9YDtcclxuICBcclxuICAgIGVsZW1NaW4uYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChlKSA9PiB7XHJcbiAgICAgIGxldCB2YWx1ZTpudW1iZXIgPSBwYXJzZUludCgoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpLnZhbHVlKTtcclxuICAgICAgaWYgKHZhbHVlID49IHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXgpIHtcclxuICAgICAgICB2YWx1ZSA9IHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXggLSAxO1xyXG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCkudmFsdWUgPSBgJHt2YWx1ZX1gO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW4gPSB2YWx1ZTtcclxuICAgICAgZWxlbVRleHQuaW5uZXJUZXh0ID0gYCR7dGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbn0gLSAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXh9YDtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgZWxlbU1pbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoZSkgPT4ge1xyXG4gICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBlbGVtTWF4LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU6bnVtYmVyID0gcGFyc2VJbnQoKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS52YWx1ZSk7XHJcbiAgICAgIGlmICh2YWx1ZSA8PSB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWluKSB7XHJcbiAgICAgICAgdmFsdWUgPSB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWluICsgMTtcclxuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpLnZhbHVlID0gYCR7dmFsdWV9YDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4ID0gdmFsdWU7XHJcbiAgICAgIGVsZW1UZXh0LmlubmVyVGV4dCA9IGAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW59IC0gJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4fWA7XHJcbiAgICB9KTtcclxuICBcclxuICAgIGVsZW1NYXguYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKGUpID0+IHtcclxuICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXRUYWxlbnRzVGFibGUodGFsZW50c0luZm8sIGxvZ0NvdW50OiBudW1iZXIsIHRyZWVfaW5kZXg/OiBudW1iZXIsIHBpY2tfcmF0ZT86IG51bWJlcikge1xyXG4gICAgY29uc3QgZWxUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFsZW50LXBhbmVsLXRpdGxlXCIpO1xyXG4gICAgY29uc3QgZWxUcmVlQWN0aW9uUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyZWVfbW9kZV9hY3Rpb25fcGFuZWxcIik7XHJcbiAgXHJcbiAgICBpZiAodGhpcy5zZWFyY2hDb25kaXRpb24udHJlZV9tb2RlKSB7XHJcbiAgICAgIGlmIChsb2dDb3VudCA+IDApIHtcclxuICAgICAgICBlbFRpdGxlLmlubmVyVGV4dCA9IGBNb3N0IHBvcHVsYXIgdGFsZW50IHRyZWVzYDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlbFRpdGxlLmlubmVyVGV4dCA9IGBXZSBzdGlsbCBkb24ndCBoYXZlIGFueSBydW5zIHNjYW5uZWQgZm9yIHRoaXNgO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGNvbnN0IHBpY2tSYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaWNrX3JhdGVcIik7XHJcbiAgICAgIGNvbnN0IHRyZWVJbmRleCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJlZV9pbmRleFwiKTtcclxuICBcclxuICAgICAgaWYgKCFlbFRyZWVBY3Rpb25QYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgZWxUcmVlQWN0aW9uUGFuZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgcGlja1JhdGUuaW5uZXJUZXh0ID0gYFBpY2sgUmF0ZSA6ICR7cGlja19yYXRlID8gcGlja19yYXRlIDogMH0lYDtcclxuICAgICAgdHJlZUluZGV4LmlubmVyVGV4dCA9IGAkeyh0cmVlX2luZGV4ID8gdHJlZV9pbmRleCA6IDApICsgMX0gLyAke3RoaXMuZmFtb3VzVGFsZW50SW5mby5sZW5ndGh9YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChsb2dDb3VudCA+IDApIHtcclxuICAgICAgICBlbFRpdGxlLmlubmVyVGV4dCA9IGBNb3N0IHBvcHVsYXIgdGFsZW50IHRyZWVzIGZvciAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLnNwZWNzfSAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmNsYXNzfSBpbiAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLnJhaWRfZHVuZ2Vvbn1gO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVsVGl0bGUuaW5uZXJUZXh0ID0gYFdlIHN0aWxsIGRvbid0IGhhdmUgYW55IHJ1bnMgc2Nhbm5lZCBmb3IgdGhpc2A7XHJcbiAgICAgIH1cclxuICAgICAgZWxUcmVlQWN0aW9uUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhbGVudC10YWJsZS1jb250YWluZXJcIik7XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBjb25zdCB0YWxlbnRzVGFibGUgPSBjcmVhdGVUYWxlbnRzVGFibGUoeyB0YWxlbnRMZXZlbExpc3Q6IHRhbGVudHNJbmZvIH0sIHRoaXMuc2VhcmNoQ29uZGl0aW9uLnRyZWVfbW9kZSApO1xyXG4gIFxyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRhbGVudHNUYWJsZSk7XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgaW5pdEluUHJvZ3Jlc3NFdmVudCgpIHtcclxuICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd29yay1pbi1wcm9ncmVzcycpO1xyXG4gICAgY29uc3QgbWVzc2FnZVBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2UnKTtcclxuICBcclxuICAgIGZvciAoY29uc3QgZWwgb2YgZWxlbWVudHMpIHtcclxuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlbC5nZXRBdHRyaWJ1dGUoXCJtZXNzYWdlXCIpO1xyXG4gICAgICAgIG1lc3NhZ2VQYW5lbC5pbm5lckhUTUwgPSBgPGRpdj4ke21lc3NhZ2V9PC9kaXY+YDtcclxuICAgICAgICBtZXNzYWdlUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgICAgIHZvaWQgbWVzc2FnZVBhbmVsLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIG1lc3NhZ2VQYW5lbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXRUcmVlTW9kZUFjdGlvblBhbmVsRXZlbnQoKSB7XHJcbiAgICBjb25zdCBlbFRyZWVNb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfbW9kZScpO1xyXG4gIFxyXG4gICAgZWxUcmVlTW9kZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xyXG4gICAgICBpZiAoKDxIVE1MSW5wdXRFbGVtZW50PihlLnRhcmdldCkpLmNoZWNrZWQpIHtcclxuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi50cmVlX21vZGUgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLnRyZWVfbW9kZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICB9KTtcclxuICBcclxuICAgIGNvbnN0IGVsUHJldkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuX3ByZXZcIik7XHJcbiAgXHJcbiAgICBlbFByZXZCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleCA+IDApIHtcclxuICAgICAgICBjb25zdCBhbmltUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsZW50LWFuaW0tcGFuZWwnKTtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZUluJyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXQnKTtcclxuICBcclxuICAgICAgICB0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4LS07XHJcbiAgICAgICAgdGhpcy5pbml0VGFsZW50c1RhYmxlKFxyXG4gICAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvW3RoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXhdLnRhbGVudF90cmVlLCBcclxuICAgICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mb1t0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4XS5waWNrX3JhdGUsIFxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleCwgXHJcbiAgICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm9bdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleF0ucGlja19yYXRlXHJcbiAgICAgICAgKTtcclxuICBcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZU91dCcpO1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlSW4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBjb25zdCBlbE5leHRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl9uZXh0XCIpO1xyXG4gIFxyXG4gICAgZWxOZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXggPCB0aGlzLmZhbW91c1RhbGVudEluZm8ubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIGNvbnN0IGFuaW1QYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxlbnQtYW5pbS1wYW5lbCcpO1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlSW4nKTtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZU91dCcpO1xyXG4gIFxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXgrKztcclxuICAgICAgICB0aGlzLmluaXRUYWxlbnRzVGFibGUoXHJcbiAgICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm9bdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleF0udGFsZW50X3RyZWUsIFxyXG4gICAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvW3RoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXhdLnBpY2tfcmF0ZSwgXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4LCBcclxuICAgICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mb1t0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4XS5waWNrX3JhdGVcclxuICAgICAgICApO1xyXG4gIFxyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlT3V0Jyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVJbicpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICBcclxuICAgIGNvbnN0IGVsUmVmcmVzaEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuX3JlZnJlc2hcIik7XHJcbiAgICBpZiAoZWxSZWZyZXNoQnV0dG9uKSB7XHJcbiAgICAgIGVsUmVmcmVzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgc2V0U3dpdGNoVmFsdWUoaXNfZHVuZ2VvbjogYm9vbGVhbikge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYWlkX2R1bmdlb24tc3dpdGNoX19jb250YWluZXJcIik7XHJcbiAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uID0gaXNfZHVuZ2VvbjtcclxuICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEnLCB0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uID8gJ2R1bmdlb24nIDogJ3JhaWQnKTtcclxuICAgIHRoaXMucmVsb2FkUmFpZER1bmdlb25Ecm9wZG93bigpO1xyXG4gIFxyXG4gICAgY29uc3QgcmFuZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5nZXJfX2NvbnRhaW5lclwiKTtcclxuICAgIGNvbnN0IHJhaWRMZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwia2V5X2xldmVsLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiKTtcclxuICAgIGNvbnN0IHJhaWRCb3NzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYWlkX2Jvc3Mtc2VsZWN0LWJveF9fY29udGFpbmVyXCIpO1xyXG4gIFxyXG4gICAgcmFuZ2VyLnN0eWxlLmRpc3BsYXkgPSBpc19kdW5nZW9uID8gJ2Jsb2NrJyA6ICdub25lJztcclxuICAgIHJhaWRMZXZlbC5zdHlsZS5kaXNwbGF5ID0gaXNfZHVuZ2VvbiA/ICdub25lJyA6ICdibG9jayc7XHJcbiAgICByYWlkQm9zcy5zdHlsZS5kaXNwbGF5ID0gaXNfZHVuZ2VvbiA/ICdub25lJyA6ICdibG9jayc7XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgaW5pdFN3aXRjaCgpIHtcclxuICAgIHRoaXMuc2V0U3dpdGNoVmFsdWUodHJ1ZSk7XHJcbiAgXHJcbiAgICBjb25zdCBlbFN3aXRjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFpZF9kdW5nZW9uLXN3aXRjaFwiKTtcclxuICAgIGNvbnN0IGVsU3dpdGNoRHVuZ2VvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3dpdGNoX2R1bmdlb25cIik7XHJcbiAgICBjb25zdCBlbFN3aXRjaFJhaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN3aXRjaF9yYWlkXCIpO1xyXG4gIFxyXG4gICAgZWxTd2l0Y2guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3dpdGNoVmFsdWUoIXRoaXMuc2VhcmNoQ29uZGl0aW9uLmlzX2R1bmdlb24pO1xyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBlbFN3aXRjaER1bmdlb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3dpdGNoVmFsdWUodHJ1ZSk7XHJcbiAgICB9KTtcclxuICBcclxuICAgIGVsU3dpdGNoUmFpZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5zZXRTd2l0Y2hWYWx1ZShmYWxzZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IEFwcFdpbmRvdyB9IGZyb20gXCIuLi9BcHBXaW5kb3dcIjtcclxuaW1wb3J0IHsgT1dIb3RrZXlzIH0gZnJvbSBcIkBvdmVyd29sZi9vdmVyd29sZi1hcGktdHNcIjtcclxuaW1wb3J0IHsgaG90a2V5cywgd2luZG93TmFtZXMsIHdvd0NsYXNzSWQgfSBmcm9tIFwiLi4vY29uc3RzXCI7XHJcblxyXG5pbXBvcnQge1xyXG4gIHNldEF1dGhUb2tlbixcclxuICBnZXRUb2tlbixcclxuICBnZXRDaGFyYWN0ZXJzLFxyXG4gIGdldEpvdXJuYWxzLFxyXG4gIHN0b3JlSm91cm5hbHMsXHJcbiAgdXBkYXRlSm91cm5hbHMsXHJcbiAgc3RvcmVKb3VybmFsQ29udGVudCxcclxuICBkZWxldGVKb3VybmFsQ29udGVudCxcclxuICBlZGl0Sm91cm5hbENvbnRlbnQsXHJcbiAgZGVsZXRlSm91cm5hbFxyXG59IGZyb20gXCIuLi91dGlscy9hcGlcIjtcclxuaW1wb3J0IENoYXJhY3RlckluZm8gZnJvbSBcIi4uL3V0aWxzL2NoYXJhY3RlckluZm9cIjtcclxuaW1wb3J0IFRhbGVudFBpY2tlciBmcm9tIFwiLi4vdXRpbHMvdGFsZW50UGlja2VyXCI7XHJcblxyXG4vLyBUaGUgZGVza3RvcCB3aW5kb3cgaXMgdGhlIHdpbmRvdyBkaXNwbGF5ZWQgd2hpbGUgRm9ydG5pdGUgaXMgbm90IHJ1bm5pbmcuXHJcbi8vIEluIG91ciBjYXNlLCBvdXIgZGVza3RvcCB3aW5kb3cgaGFzIG5vIGxvZ2ljIC0gaXQgb25seSBkaXNwbGF5cyBzdGF0aWMgZGF0YS5cclxuLy8gVGhlcmVmb3JlLCBvbmx5IHRoZSBnZW5lcmljIEFwcFdpbmRvdyBjbGFzcyBpcyBjYWxsZWQuXHJcblxyXG5jb25zdCBDTElFTlRfSUQgPSBcIjc2NmI4YWFiN2YzZjQ0MDZhNWQ0ODQ0ZjVhMGM2YmQ3XCI7XHJcbmNvbnN0IEFVVEhPUklaRV9FTkRQT0lOVCA9IFwiaHR0cHM6Ly9ldS5iYXR0bGUubmV0L29hdXRoL2F1dGhvcml6ZVwiO1xyXG4vLyBjb25zdCByZWRpcmVjdFVyaSA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvb2F1dGgvY2FsbGJhY2tfb3ZlcndvbGYnO1xyXG5jb25zdCByZWRpcmVjdFVyaSA9IFwiaHR0cHM6Ly93b3dtZS5nZy9vYXV0aC9jYWxsYmFja19vdmVyd29sZlwiO1xyXG5jb25zdCBzY29wZSA9IFtcIndvdy5wcm9maWxlXCIsIFwib3BlbmlkXCJdO1xyXG5cclxuY29uc3QgZGlzY29yZFVSTCA9IFwiaHR0cHM6Ly9kaXNjb3JkLmdnL3J5ZzlDenpyOFpcIjtcclxuXHJcbmNsYXNzIERlc2t0b3AgZXh0ZW5kcyBBcHBXaW5kb3cge1xyXG4gIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogRGVza3RvcDtcclxuICBwcml2YXRlIGlzTG9nZ2VkSW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwcml2YXRlIGJhdHRsZVRhZzogc3RyaW5nO1xyXG4gIHByaXZhdGUgY2hhcmFjdGVyczogW107XHJcbiAgcHJpdmF0ZSByZWdpb246IHN0cmluZztcclxuICBwcml2YXRlIGNoYXJhY3RlckluZm86IENoYXJhY3RlckluZm87XHJcbiAgcHJpdmF0ZSB0YWxlbnRQaWNrZXI6IFRhbGVudFBpY2tlcjtcclxuXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKHdpbmRvd05hbWVzLmRlc2t0b3ApO1xyXG5cclxuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcclxuICAgIGNvbnN0IGV4cGlyZXNJbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZXhwaXJlc0luXCIpO1xyXG5cclxuICAgIGlmICh0b2tlbiAmJiBwYXJzZUludChleHBpcmVzSW4pID4gRGF0ZS5ub3coKSkge1xyXG4gICAgICB0aGlzLmJhdHRsZVRhZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYmF0dGxlVGFnXCIpO1xyXG4gICAgICB0aGlzLnJlZ2lvbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmVnaW9uXCIpO1xyXG5cclxuICAgICAgc2V0QXV0aFRva2VuKHRva2VuKTtcclxuICAgICAgdGhpcy5nZXRVc2VyQ2hhcmFjdGVySW5mbygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ0b2tlblwiKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJleHBpcmVzSW5cIik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYmF0dGxlVGFnXCIpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInJlZ2lvblwiKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXRCdXR0b25FdmVudHMoKTtcclxuICAgIG92ZXJ3b2xmLmV4dGVuc2lvbnMub25BcHBMYXVuY2hUcmlnZ2VyZWQuYWRkTGlzdGVuZXIodGhpcy5jYWxsYmFja09BdXRoKTtcclxuXHJcbiAgICB0aGlzLnRhbGVudFBpY2tlciA9IG5ldyBUYWxlbnRQaWNrZXIoKTtcclxuICAgIHRoaXMudGFsZW50UGlja2VyLmluaXRDb21wb25lbnRzKCk7XHJcbiAgICB0aGlzLmluaXRTZXR0aW5nc1BhbmVsKCk7XHJcbiAgICB0aGlzLmdldFVzZXJKb3VybmFscygpO1xyXG4gICAgdGhpcy5zdG9yZVVzZXJKb3VybmFscygpO1xyXG4gICAgdGhpcy51cGRhdGVVc2VySm91cm5hbHMoKTtcclxuICAgIHRoaXMuc3RvcmVVc2VySm91cm5hbENvbnRlbnQoKTtcclxuICAgIHRoaXMudXBkYXRlVXNlckpvdXJuYWxDb250ZW50KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0QmF0dGxlVGFnKGJhdHRsZVRhZykge1xyXG4gICAgdGhpcy5iYXR0bGVUYWcgPSBiYXR0bGVUYWc7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0Q2hhcmFjdGVycyhjaGFyYWN0ZXJzKSB7XHJcbiAgICB0aGlzLmNoYXJhY3RlcnMgPSBjaGFyYWN0ZXJzO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldFJlZ2lvbihyZWdpb24pIHtcclxuICAgIHRoaXMucmVnaW9uID0gcmVnaW9uO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0QnV0dG9uRXZlbnRzKCkge1xyXG4gICAgLy8gTG9naW5cclxuICAgIGNvbnN0IGxvZ2luQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbG9naW5cIik7XHJcbiAgICBsb2dpbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgY29uc3Qgc2NvcGVzU3RyaW5nID0gZW5jb2RlVVJJQ29tcG9uZW50KHNjb3BlLmpvaW4oXCIgXCIpKTtcclxuICAgICAgY29uc3QgcmVkaXJlY3RVcmlTdHJpbmcgPSBlbmNvZGVVUklDb21wb25lbnQocmVkaXJlY3RVcmkpO1xyXG4gICAgICBjb25zdCBhdXRob3JpemVVcmwgPSBgJHtBVVRIT1JJWkVfRU5EUE9JTlR9P2NsaWVudF9pZD0ke0NMSUVOVF9JRH0mc2NvcGU9JHtzY29wZXNTdHJpbmd9JnJlZGlyZWN0X3VyaT0ke3JlZGlyZWN0VXJpU3RyaW5nfSZyZXNwb25zZV90eXBlPWNvZGVgO1xyXG4gICAgICBvdmVyd29sZi51dGlscy5vcGVuVXJsSW5EZWZhdWx0QnJvd3NlcihhdXRob3JpemVVcmwpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gTWFpbiBNZW51XHJcbiAgICBjb25zdCBtZW51SXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibWVudS1pdGVtXCIpO1xyXG4gICAgQXJyYXkuZnJvbShtZW51SXRlbXMpLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICBpZiAoZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJpbi1wcm9ncmVzc1wiKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbS5pZCA9PT0gXCJidG4tbG9nb3V0XCIpIHtcclxuICAgICAgICAgIHRoaXMuaXNMb2dnZWRJbiA9IGZhbHNlO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJleHBpcmVzSW5cIik7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImJhdHRsZVRhZ1wiKTtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidG9rZW5cIik7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInJlZ2lvblwiKTtcclxuXHJcbiAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJlbmFibGVkXCIpO1xyXG5cclxuICAgICAgICAgIHRoaXMuZHJhd1VzZXJJbmZvKCk7XHJcbiAgICAgICAgICB0aGlzLmRyYXdTdWJQYW5lbCgpO1xyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgQXJyYXkuZnJvbShtZW51SXRlbXMpLmZvckVhY2goKGVsZW0xKSA9PiB7XHJcbiAgICAgICAgICBlbGVtMS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgZWxNYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpO1xyXG4gICAgICAgIGVsTWFpbi5jbGFzc05hbWUgPSBlbGVtLmdldEF0dHJpYnV0ZShcInBhZ2UtdHlwZVwiKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEaXNjb3JkXHJcbiAgICBjb25zdCBkaXNjb3JkQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaXNjb3JkQnV0dG9uXCIpO1xyXG4gICAgZGlzY29yZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgb3ZlcndvbGYudXRpbHMub3BlblVybEluRGVmYXVsdEJyb3dzZXIoZGlzY29yZFVSTCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgc2V0Q3VycmVudEhvdGtleVRvSW5wdXQoKSB7XHJcbiAgICBjb25zdCBlbElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3RrZXktZWRpdG9yXCIpO1xyXG4gICAgY29uc3QgaG90a2V5VGV4dCA9IGF3YWl0IE9XSG90a2V5cy5nZXRIb3RrZXlUZXh0KFxyXG4gICAgICBob3RrZXlzLnRvZ2dsZSxcclxuICAgICAgd293Q2xhc3NJZFxyXG4gICAgKTtcclxuICAgIGVsSW5wdXQuaW5uZXJUZXh0ID0gaG90a2V5VGV4dDtcclxuICAgIHJldHVybiBob3RrZXlUZXh0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0SG90a2V5SW5wdXQoKSB7XHJcbiAgICB0aGlzLnNldEN1cnJlbnRIb3RrZXlUb0lucHV0KCk7XHJcblxyXG4gICAgY29uc3QgZWxJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG90a2V5LWVkaXRvclwiKTtcclxuICAgIGNvbnN0IGVsQ2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvdGtleS1jbG9zZVwiKTtcclxuXHJcbiAgICBsZXQga2V5cyA9IFtcIlwiLCBcIlwiLCBcIlwiLCBcIlwiXTtcclxuXHJcbiAgICBlbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoZSkgPT4ge1xyXG4gICAgICBlbElucHV0LmlubmVyVGV4dCA9IFwiQ2hvb3NlIEtleVwiO1xyXG4gICAgICBrZXlzID0gW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCJdO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNvdXRcIiwgKGUpID0+IHtcclxuICAgICAgdGhpcy5zZXRDdXJyZW50SG90a2V5VG9JbnB1dCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImtleWRvd25cIiwgZS5rZXksIGUubWV0YUtleSwgZS5zaGlmdEtleSwgZS5hbHRLZXksIGUuY3RybEtleSk7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKGUua2V5ID09PSBcIlNoaWZ0XCIpIHtcclxuICAgICAgICBrZXlzWzJdID0gXCJTaGlmdCtcIjtcclxuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJBbHRcIikge1xyXG4gICAgICAgIGtleXNbMF0gPSBcIkFsdCtcIjtcclxuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJDb250cm9sXCIpIHtcclxuICAgICAgICBrZXlzWzFdID0gXCJDdHJsK1wiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGtleXNbM10gPSBlLmtleTtcclxuICAgICAgICBjb25zdCBuZXdIb3RrZXkgPSB7XHJcbiAgICAgICAgICBuYW1lOiBob3RrZXlzLnRvZ2dsZSxcclxuICAgICAgICAgIGdhbWVJZDogNzY1LFxyXG4gICAgICAgICAgdmlydHVhbEtleTogZS5rZXlDb2RlLFxyXG4gICAgICAgICAgbW9kaWZpZXJzOiB7XHJcbiAgICAgICAgICAgIGN0cmw6IGUuY3RybEtleSxcclxuICAgICAgICAgICAgc2hpZnQ6IGUuc2hpZnRLZXksXHJcbiAgICAgICAgICAgIGFsdDogZS5hbHRLZXksXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZWxDbG9zZS5mb2N1cygpO1xyXG4gICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMuYXNzaWduKG5ld0hvdGtleSwgKGUpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXNzaWduOiBcIiwgbmV3SG90a2V5LCBlKTtcclxuICAgICAgICAgIHRoaXMuc2V0Q3VycmVudEhvdGtleVRvSW5wdXQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbElucHV0LmlubmVyVGV4dCA9IGtleXMuam9pbihcIlwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGVsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgY29uc29sZS5sb2coXCJrZXl1cFwiLCBlLmtleSwgZS5tZXRhS2V5LCBlLnNoaWZ0S2V5LCBlLmFsdEtleSwgZS5jdHJsS2V5KTtcclxuICAgICAgaWYgKGUua2V5ID09PSBcIlNoaWZ0XCIpIHtcclxuICAgICAgICBrZXlzWzJdID0gXCJcIjtcclxuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJBbHRcIikge1xyXG4gICAgICAgIGtleXNbMF0gPSBcIlwiO1xyXG4gICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBcIkNvbnRyb2xcIikge1xyXG4gICAgICAgIGtleXNbMV0gPSBcIlwiO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHN0ckhvdGtleSA9IGtleXMuam9pbihcIlwiKTtcclxuICAgICAgZWxJbnB1dC5pbm5lclRleHQgPSBzdHJIb3RrZXkgPT09IFwiXCIgPyBcIkNob29zZSBLZXlcIiA6IHN0ckhvdGtleTtcclxuICAgIH0pO1xyXG5cclxuICAgIGVsQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IGhvdGtleSA9IHtcclxuICAgICAgICBuYW1lOiBob3RrZXlzLnRvZ2dsZSxcclxuICAgICAgICBnYW1lSWQ6IDc2NSxcclxuICAgICAgfTtcclxuICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy51bmFzc2lnbihob3RrZXksIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50SG90a2V5VG9JbnB1dCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0U2V0dGluZ3NQYW5lbCgpIHtcclxuICAgIHRoaXMuaW5pdEhvdGtleUlucHV0KCk7XHJcblxyXG4gICAgY29uc3QgYnRuQ29weSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLWNvcHktc29jaWFsLXVybFwiKTtcclxuICAgIGJ0bkNvcHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IGVsU29jaWFsVXJsID0gPEhUTUxJbnB1dEVsZW1lbnQ+KFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtc29jaWFsLXVybFwiKVxyXG4gICAgICApO1xyXG4gICAgICBlbFNvY2lhbFVybC5mb2N1cygpO1xyXG4gICAgICBlbFNvY2lhbFVybC5zZWxlY3QoKTtcclxuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJjb3B5XCIpO1xyXG4gICAgICBlbFNvY2lhbFVybC5zZWxlY3Rpb25TdGFydCA9IDA7XHJcbiAgICAgIGVsU29jaWFsVXJsLnNlbGVjdGlvbkVuZCA9IDA7XHJcbiAgICAgIGJ0bkNvcHkuZm9jdXMoKTtcclxuICAgICAgYnRuQ29weS5jbGFzc0xpc3QucmVtb3ZlKFwiY29waWVkXCIpO1xyXG4gICAgICB2b2lkIGJ0bkNvcHkub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGJ0bkNvcHkuY2xhc3NMaXN0LmFkZChcImNvcGllZFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGVsU3dpdGNoR2FtZVN0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwiYXV0by1sYXVuY2gtd2hlbi1nYW1lLXN0YXJ0c1wiXHJcbiAgICApO1xyXG4gICAgbGV0IHN3aXRjaFZhbHVlR2FtZVN0YXJ0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXHJcbiAgICAgIFwiYXV0by1sYXVuY2gtd2hlbi1nYW1lLXN0YXJ0c1wiXHJcbiAgICApO1xyXG4gICAgaWYgKHN3aXRjaFZhbHVlR2FtZVN0YXJ0ICE9PSBcImZhbHNlXCIpIHtcclxuICAgICAgc3dpdGNoVmFsdWVHYW1lU3RhcnQgPSBcInRydWVcIjtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgXCJhdXRvLWxhdW5jaC13aGVuLWdhbWUtc3RhcnRzXCIsXHJcbiAgICAgICAgc3dpdGNoVmFsdWVHYW1lU3RhcnRcclxuICAgICAgKTtcclxuICAgICAgZWxTd2l0Y2hHYW1lU3RhcnQuc2V0QXR0cmlidXRlKFwiZGF0YVwiLCBcIlllc1wiKTtcclxuICAgIH1cclxuICAgIGVsU3dpdGNoR2FtZVN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBzd2l0Y2hWYWx1ZUdhbWVTdGFydCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFxyXG4gICAgICAgIFwiYXV0by1sYXVuY2gtd2hlbi1nYW1lLXN0YXJ0c1wiXHJcbiAgICAgICk7XHJcbiAgICAgIGlmIChzd2l0Y2hWYWx1ZUdhbWVTdGFydCA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICBzd2l0Y2hWYWx1ZUdhbWVTdGFydCA9IFwiZmFsc2VcIjtcclxuICAgICAgICBlbFN3aXRjaEdhbWVTdGFydC5zZXRBdHRyaWJ1dGUoXCJkYXRhXCIsIFwiXCIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN3aXRjaFZhbHVlR2FtZVN0YXJ0ID0gXCJ0cnVlXCI7XHJcbiAgICAgICAgZWxTd2l0Y2hHYW1lU3RhcnQuc2V0QXR0cmlidXRlKFwiZGF0YVwiLCBcIlllc1wiKTtcclxuICAgICAgfVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICBcImF1dG8tbGF1bmNoLXdoZW4tZ2FtZS1zdGFydHNcIixcclxuICAgICAgICBzd2l0Y2hWYWx1ZUdhbWVTdGFydFxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZWxTd2l0Y2hHYW1lRW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaG93LWFwcC13aGVuLWdhbWUtZW5kc1wiKTtcclxuICAgIGxldCBzd2l0Y2hWYWx1ZUdhbWVFbmQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNob3ctYXBwLXdoZW4tZ2FtZS1lbmRzXCIpO1xyXG4gICAgaWYgKHN3aXRjaFZhbHVlR2FtZUVuZCAhPT0gXCJmYWxzZVwiKSB7XHJcbiAgICAgIHN3aXRjaFZhbHVlR2FtZUVuZCA9IFwidHJ1ZVwiO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNob3ctYXBwLXdoZW4tZ2FtZS1lbmRzXCIsIHN3aXRjaFZhbHVlR2FtZUVuZCk7XHJcbiAgICAgIGVsU3dpdGNoR2FtZUVuZC5zZXRBdHRyaWJ1dGUoXCJkYXRhXCIsIFwiWWVzXCIpO1xyXG4gICAgfVxyXG4gICAgZWxTd2l0Y2hHYW1lRW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBzd2l0Y2hWYWx1ZUdhbWVFbmQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNob3ctYXBwLXdoZW4tZ2FtZS1lbmRzXCIpO1xyXG4gICAgICBpZiAoc3dpdGNoVmFsdWVHYW1lRW5kID09PSBcInRydWVcIikge1xyXG4gICAgICAgIHN3aXRjaFZhbHVlR2FtZUVuZCA9IFwiZmFsc2VcIjtcclxuICAgICAgICBlbFN3aXRjaEdhbWVFbmQuc2V0QXR0cmlidXRlKFwiZGF0YVwiLCBcIlwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2l0Y2hWYWx1ZUdhbWVFbmQgPSBcInRydWVcIjtcclxuICAgICAgICBlbFN3aXRjaEdhbWVFbmQuc2V0QXR0cmlidXRlKFwiZGF0YVwiLCBcIlllc1wiKTtcclxuICAgICAgfVxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNob3ctYXBwLXdoZW4tZ2FtZS1lbmRzXCIsIHN3aXRjaFZhbHVlR2FtZUVuZCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgY2FsbGJhY2tPQXV0aCh1cmxzY2hlbWUpIHtcclxuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmctb3ZlcmxheVwiKTtcclxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuXHJcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGRlY29kZVVSSUNvbXBvbmVudCh1cmxzY2hlbWUucGFyYW1ldGVyKSk7XHJcbiAgICBjb25zdCBjb2RlID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJjb2RlXCIpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHVzZXJJbmZvID0gYXdhaXQgZ2V0VG9rZW4oeyBjb2RlLCBpc092ZXJ3b2xmOiB0cnVlIH0pO1xyXG4gICAgICBjb25zdCB0b2tlbiA9IHVzZXJJbmZvLnRva2VuO1xyXG4gICAgICBjb25zdCBleHBpcmVzSW4gPSBEYXRlLm5vdygpICsgdXNlckluZm8uZXhwaXJlc0luICogMTAwMDtcclxuXHJcbiAgICAgIGNvbnN0IGRlc2t0b3AgPSBEZXNrdG9wLmluc3RhbmNlKCk7XHJcblxyXG4gICAgICBkZXNrdG9wLnNldEJhdHRsZVRhZyh1c2VySW5mby5iYXR0bGVUYWcpO1xyXG4gICAgICBkZXNrdG9wLnNldENoYXJhY3RlcnModXNlckluZm8uY2hhcmFjdGVycyk7XHJcbiAgICAgIGRlc2t0b3Auc2V0UmVnaW9uKHVzZXJJbmZvLnJlZ2lvbik7XHJcblxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRva2VuXCIsIHRva2VuKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJleHBpcmVzSW5cIiwgZXhwaXJlc0luLnRvU3RyaW5nKCkpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJhdHRsZVRhZ1wiLCB1c2VySW5mby5iYXR0bGVUYWcpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJlZ2lvblwiLCB1c2VySW5mby5yZWdpb24pO1xyXG5cclxuICAgICAgZGVza3RvcC5vbkxvZ2dlZEluKCk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgZ2V0VXNlckNoYXJhY3RlckluZm8oKSB7XHJcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLW92ZXJsYXlcIik7XHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBnZXRDaGFyYWN0ZXJzKCk7XHJcblxyXG4gICAgdGhpcy5yZWdpb24gPSByZXNwb25zZS5yZWdpb247XHJcbiAgICB0aGlzLmNoYXJhY3RlcnMgPSByZXNwb25zZS5jaGFyYWN0ZXJzO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5jaGFyYWN0ZXJzKTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmVnaW9uXCIsIHRoaXMucmVnaW9uKTtcclxuICAgIHRoaXMub25Mb2dnZWRJbigpO1xyXG5cclxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgZ2V0VXNlckpvdXJuYWxzKCkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBnZXRKb3VybmFscygpO1xyXG4gICAgY29uc3Qgam91cm5hbExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWwtdGFic1wiKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3BvbnNlLmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgYnRuLmlubmVySFRNTCA9IHJlc3BvbnNlLmRhdGFbaV0ubmFtZTtcclxuICAgICAgYnRuLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgcmVzcG9uc2UuZGF0YVtpXS5faWQpO1xyXG4gICAgICBidG4uY2xhc3NMaXN0LmFkZChcInRhYi1saW5rXCIpO1xyXG4gICAgICBsZXQgZGVsZXRlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBkZWxldGVTcGFuLmNsYXNzTGlzdC5hZGQoXCJtYXRlcmlhbC1pY29uc1wiKVxyXG4gICAgICBkZWxldGVTcGFuLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0U3BhbjJcIilcclxuICAgICAgZGVsZXRlU3Bhbi5pbm5lckhUTUwgPSBcImRlbGV0ZVwiXHJcbiAgICAgIGpvdXJuYWxMaXN0LmFwcGVuZENoaWxkKGJ0bik7XHJcbiAgICAgIGJ0bi5hcHBlbmRDaGlsZChkZWxldGVTcGFuKVxyXG5cclxuXHJcbiAgICAgIHZhciBlZGl0Sm91cm5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBlZGl0Sm91cm5lbC5jbGFzc0xpc3QuYWRkKFwibWF0ZXJpYWwtaWNvbnNcIilcclxuICAgICAgZWRpdEpvdXJuZWwuY2xhc3NMaXN0LmFkZChcImVkaXRTcGFuMlwiKVxyXG4gICAgICBlZGl0Sm91cm5lbC5pbm5lckhUTUwgPSBcImVkaXRcIlxyXG4gICAgICBidG4uYXBwZW5kQ2hpbGQoZWRpdEpvdXJuZWwpXHJcblxyXG4gICAgICBlZGl0Sm91cm5lbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBFbGVtZW50O1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0LWpvdXJuZWxcIik7XHJcbiAgICAgICAgaWYgKGVsZW1zICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBlbGVtcy5jbGFzc0xpc3QucmVtb3ZlKFwiZWRpdC1qb3VybmVsXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZWRpdC1qb3VybmVsXCIpO1xyXG4gICAgICAgIGNvbnN0IGVkaXRNb2RhbE9wZW5CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15QnRuRWRpdFwiKTtcclxuICAgICAgICBlZGl0TW9kYWxPcGVuQnV0dG9uLmNsaWNrKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIsIHJlc3BvbnNlLmRhdGFbaV0ubmFtZSk7XHJcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlJbnB1dDJcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSByZXNwb25zZS5kYXRhW2ldLm5hbWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvYmplY3RcIiwgcmVzcG9uc2UuZGF0YVtpXSlcclxuICAgICAgICBjb25zdCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWNjZXB0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgY2IudmFsdWUgPSByZXNwb25zZS5kYXRhW2ldLnRlbXBsYXRlXHJcbiAgICAgIH0pXHJcblxyXG5cclxuICAgICAgZGVsZXRlU3Bhbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGRlbGV0ZUpvdXJuYWwocmVzcG9uc2UuZGF0YVtpXS5faWQpO1xyXG4gICAgICAgIGxldCBpdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke3Jlc3BvbnNlLmRhdGFbaV0uX2lkfVwiXWApO1xyXG4gICAgICAgIGl0ZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIGNvbnRlbnQgPSBjb250ZW50LmZpbHRlcigoY29uKSA9PiBjb24uX2lkICE9IHJlc3BvbnNlLmRhdGFbaV0uX2lkKTtcclxuICAgICAgICByZXNwb25zZS5kYXRhID0gY29udGVudDtcclxuICAgICAgICBjb25zdCBqb3VybmFsQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICBcImpvdXJuYWwtaXRlbS1jb250YWluZXJcIlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgam91cm5hbENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xyXG4gICAgICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLXRhYlwiKTtcclxuICAgICAgICBpZiAoZWxlbXMgIT09IG51bGwpIHtcclxuICAgICAgICAgIGVsZW1zLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtdGFiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZS10YWJcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSm91cm5hbCA9IHJlc3BvbnNlLmRhdGFbaV07XHJcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRKb3VybmFsKTtcclxuICAgICAgICBjb25zdCBqb3VybmFsQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICBcImpvdXJuYWwtaXRlbS1jb250YWluZXJcIlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGpvdXJuYWxDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBzZWxlY3RlZEpvdXJuYWwuZGF0YS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBqb3VybmFsSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICBqb3VybmFsSXRlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGVsZW1lbnQuX2lkKTtcclxuICAgICAgICAgIGpvdXJuYWxJdGVtLmNsYXNzTGlzdC5hZGQoXCJqb3VybmFsLWl0ZW1cIik7XHJcbiAgICAgICAgICBjb25zdCBqb3VybmFsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgIGpvdXJuYWxCdG4uaW5uZXJIVE1MID0gZWxlbWVudC50aXRsZTtcclxuICAgICAgICAgIHZhciB0ZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgdGV4dFNwYW4uY2xhc3NMaXN0LmFkZChcIm1hdGVyaWFsLWljb25zXCIpXHJcbiAgICAgICAgICB0ZXh0U3Bhbi5jbGFzc0xpc3QuYWRkKFwidGV4dFNwYW5cIilcclxuICAgICAgICAgIHRleHRTcGFuLmlubmVySFRNTCA9IFwiZGVsZXRlXCJcclxuICAgICAgICAgIGpvdXJuYWxCdG4uYXBwZW5kQ2hpbGQodGV4dFNwYW4pXHJcbiAgICAgICAgICBjb25zdCBqb3VybmFsRGVzYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG5cclxuXHJcbiAgICAgICAgICB2YXIgZWRpdFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICAgIGVkaXRTcGFuLmNsYXNzTGlzdC5hZGQoXCJtYXRlcmlhbC1pY29uc1wiKVxyXG4gICAgICAgICAgZWRpdFNwYW4uY2xhc3NMaXN0LmFkZChcImVkaXRTcGFuXCIpXHJcbiAgICAgICAgICBlZGl0U3Bhbi5pbm5lckhUTUwgPSBcImVkaXRcIlxyXG4gICAgICAgICAgam91cm5hbEJ0bi5hcHBlbmRDaGlsZChlZGl0U3BhbilcclxuXHJcbiAgICAgICAgICBqb3VybmFsQnRuLmNsYXNzTGlzdC5hZGQoXCJhY2NvcmRpb25cIik7XHJcbiAgICAgICAgICBpZiAoam91cm5hbERlc2MuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSB7XHJcbiAgICAgICAgICAgIGpvdXJuYWxEZXNjLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgIGpvdXJuYWxEZXNjLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBqb3VybmFsRGVzYy5pbm5lckhUTUwgPSBlbGVtZW50LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICBqb3VybmFsRGVzYy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGpvdXJuYWxCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGpvdXJuYWxEZXNjLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSkge1xyXG4gICAgICAgICAgICAgIGpvdXJuYWxEZXNjLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgam91cm5hbERlc2MuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBqb3VybmFsRGVzYy5pbm5lckhUTUwgPSBlbGVtZW50LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgIGpvdXJuYWxEZXNjLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGVkaXRTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBFbGVtZW50O1xyXG4gICAgICAgICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZS1jb250ZW50XCIpO1xyXG4gICAgICAgICAgICBpZiAoZWxlbXMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICBlbGVtcy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlLWNvbnRlbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlLWNvbnRlbnRcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsT3BlbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdENvbnRlbnRCdXR0b25cIik7XHJcbiAgICAgICAgICAgIG1vZGFsT3BlbkJ1dHRvbi5jbGljaygpO1xyXG4gICAgICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0Q29udGVudFRpdGxlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gZWxlbWVudC50aXRsZTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0RWRpdG9yXCIpLmlubmVySFRNTCA9IGVsZW1lbnQuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIHRleHRTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLXRhYlwiKTtcclxuICAgICAgICAgICAgbGV0IGRhdGFJRCA9IGVsZW1zLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpXHJcbiAgICAgICAgICAgIGRlbGV0ZUpvdXJuYWxDb250ZW50KGRhdGFJRCwgZWxlbWVudC5faWQpO1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWlkPVwiJHtlbGVtZW50Ll9pZH1cIl1gKTtcclxuICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSByZXNwb25zZS5kYXRhW2ldLmRhdGE7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LmZpbHRlcigoY29uKSA9PiBjb24uX2lkICE9IGVsZW1lbnQuX2lkKTtcclxuICAgICAgICAgICAgcmVzcG9uc2UuZGF0YVtpXS5kYXRhID0gY29udGVudDtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICBqb3VybmFsSXRlbS5hcHBlbmRDaGlsZChqb3VybmFsQnRuKTtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgIGpvdXJuYWxJdGVtLmFwcGVuZENoaWxkKGpvdXJuYWxEZXNjKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGpvdXJuYWxDb250YWluZXIuYXBwZW5kQ2hpbGQoam91cm5hbEl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBwcml2YXRlIGFzeW5jIHN0b3JlVXNlckpvdXJuYWxzKCkge1xyXG4gICAgY29uc3Qgc2F2ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZUJ1dHRvblwiKVxyXG5cclxuICAgIHNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGlucHV0VmFsID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlJbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcclxuICAgICAgY29uc3QgY2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFjY2VwdFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICBjb25zdCBjaGVjayA9IGNiLmNoZWNrZWRcclxuICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICBiYXR0bGVJZDogXCJhMjMyZGYzZGZhZmEyMTNcIixcclxuICAgICAgICBuYW1lOiBpbnB1dFZhbCxcclxuICAgICAgICB0ZW1wbGF0ZTogY2hlY2ssXHJcbiAgICAgIH1cclxuICAgICAgY29uc29sZS5sb2coZGF0YSlcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzdG9yZUpvdXJuYWxzKGRhdGEpO1xyXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsLXRhYnNcIik7XHJcbiAgICAgICAgam91cm5hbExpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5nZXRVc2VySm91cm5hbHMoKTtcclxuICAgICAgICBsZXQgYnR0bm4yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke3Jlc3BvbnNlLmRhdGEuX2lkfVwiXWApO1xyXG4gICAgICAgIGlmICgoYnR0bm4yIGFzIEhUTUxFbGVtZW50KSkge1xyXG4gICAgICAgICAgKGJ0dG5uMiBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICAgIH1cclxuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlVXNlckpvdXJuYWxzKCkge1xyXG4gICAgY29uc3Qgc2F2ZUJ1dHRvbkVkaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15TW9kYWwyU2F2ZVwiKVxyXG5cclxuICAgIHNhdmVCdXR0b25FZGl0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBpbnB1dFZhbCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXQyXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgICBjb25zdCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWNjZXB0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgIGNvbnN0IGNoZWNrID0gY2IuY2hlY2tlZFxyXG4gICAgICBsZXQgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC1qb3VybmVsXCIpO1xyXG4gICAgICBjb25zdCBjb250ZW50SUQgPSBjb250ZW50LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIilcclxuICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICBiYXR0bGVJZDogXCJhMjMyZGYzZGZhZmEyMTNcIixcclxuICAgICAgICBuYW1lOiBpbnB1dFZhbCxcclxuICAgICAgICB0ZW1wbGF0ZTogY2hlY2ssXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB1cGRhdGVKb3VybmFscyhjb250ZW50SUQsIGRhdGEpO1xyXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsLXRhYnNcIik7XHJcbiAgICAgICAgam91cm5hbExpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5nZXRVc2VySm91cm5hbHMoKTtcclxuICAgICAgICBsZXQgYnR0bm4yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke3Jlc3BvbnNlLmRhdGEuX2lkfVwiXWApO1xyXG4gICAgICAgIGlmICgoYnR0bm4yIGFzIEhUTUxFbGVtZW50KSkge1xyXG4gICAgICAgICAgKGJ0dG5uMiBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICAgIH1cclxuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0MlwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubXlNb2RhbDJDbG9zZVwiKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIHByaXZhdGUgYXN5bmMgc3RvcmVVc2VySm91cm5hbENvbnRlbnQoKSB7XHJcbiAgICBjb25zdCBzYXZlQ29udGVudEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudHNhdmVCdXR0b25cIilcclxuXHJcbiAgICBzYXZlQ29udGVudEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZS10YWJcIik7XHJcbiAgICAgIGNvbnN0IGlkID0gZWxlbXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKVxyXG4gICAgICBsZXQgY29udGVudFRpdGxlID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFRpdGxlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgICBjb25zdCBodG1sRmlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdG9yXCIpLmlubmVySFRNTDtcclxuICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgdGl0bGU6IGNvbnRlbnRUaXRsZSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogaHRtbEZpbGVcclxuICAgICAgfVxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHN0b3JlSm91cm5hbENvbnRlbnQoaWQsIGRhdGEpO1xyXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsLXRhYnNcIik7XHJcbiAgICAgICAgam91cm5hbExpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5nZXRVc2VySm91cm5hbHMoKVxyXG4gICAgICAgIGxldCBidHRubiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcclxuICAgICAgICBpZiAoKGJ0dG5uIGFzIEhUTUxFbGVtZW50KSkge1xyXG4gICAgICAgICAgKGJ0dG5uIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRUaXRsZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCJcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRvclwiKS5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICAgIH1cclxuICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuQ29udGVudE1vZGFsQ2xvc2VcIikgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlVXNlckpvdXJuYWxDb250ZW50KCkge1xyXG4gICAgY29uc3Qgc2F2ZUNvbnRlbnRCdXR0b24yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50c2F2ZUJ1dHRvbjJcIilcclxuXHJcbiAgICBzYXZlQ29udGVudEJ1dHRvbjIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdGFiXCIpO1xyXG4gICAgICBjb25zdCBpZCA9IGVsZW1zLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIilcclxuICAgICAgbGV0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZS1jb250ZW50XCIpO1xyXG4gICAgICBjb25zdCBjb250ZW50SUQgPSBjb250ZW50LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIilcclxuICAgICAgbGV0IGNvbnRlbnRUaXRsZSA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRDb250ZW50VGl0bGVcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgIGNvbnN0IGh0bWxGaWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0RWRpdG9yXCIpLmlubmVySFRNTDtcclxuICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgdGl0bGU6IGNvbnRlbnRUaXRsZSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogaHRtbEZpbGVcclxuICAgICAgfVxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGVkaXRKb3VybmFsQ29udGVudChpZCwgY29udGVudElELCBkYXRhKTtcclxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcclxuICAgICAgICBjb25zdCBqb3VybmFsTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbC10YWJzXCIpO1xyXG4gICAgICAgIGpvdXJuYWxMaXN0LmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZ2V0VXNlckpvdXJuYWxzKClcclxuICAgICAgICBsZXQgYnR0bm4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pZD1cIiR7aWR9XCJdYCk7XHJcbiAgICAgICAgaWYgKChidHRubiBhcyBIVE1MRWxlbWVudCkpIHtcclxuICAgICAgICAgIChidHRubiBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICAgIH1cclxuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0Q29udGVudFRpdGxlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gXCJcIlxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdEVkaXRvclwiKS5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICAgIH1cclxuICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdENvbnRlbnRNb2RhbENsb3NlXCIpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uTG9nZ2VkSW4oKSB7XHJcbiAgICB0aGlzLmlzTG9nZ2VkSW4gPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGVsQnRuTG9nb3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbG9nb3V0XCIpO1xyXG4gICAgZWxCdG5Mb2dvdXQuY2xhc3NMaXN0LmFkZChcImVuYWJsZWRcIik7XHJcblxyXG4gICAgdGhpcy5kcmF3VXNlckluZm8oKTtcclxuICAgIHRoaXMuZHJhd1N1YlBhbmVsKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRyYXdVc2VySW5mbygpIHtcclxuICAgIGNvbnN0IGVsVXNlckluZm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItaW5mb1wiKTtcclxuICAgIGVsVXNlckluZm8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgIGlmICh0aGlzLmlzTG9nZ2VkSW4pIHtcclxuICAgICAgZWxVc2VySW5mby5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgY29uc3QgZWxCYXR0bGVUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhdHRsZS10YWdcIik7XHJcbiAgICAgIGVsQmF0dGxlVGFnLmlubmVySFRNTCA9IHRoaXMuYmF0dGxlVGFnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkcmF3U3ViUGFuZWwoKSB7XHJcbiAgICBjb25zdCBlbFN1YlBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWItcGFuZWxcIik7XHJcbiAgICBlbFN1YlBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJsb2dnZWQtaW5cIik7XHJcbiAgICBpZiAodGhpcy5pc0xvZ2dlZEluKSB7XHJcbiAgICAgIGVsU3ViUGFuZWwuY2xhc3NMaXN0LmFkZChcImxvZ2dlZC1pblwiKTtcclxuICAgICAgdGhpcy5jaGFyYWN0ZXJJbmZvID0gbmV3IENoYXJhY3RlckluZm8odGhpcy5jaGFyYWN0ZXJzKTtcclxuICAgICAgdGhpcy5jaGFyYWN0ZXJJbmZvLmluaXREcm9wZG93bigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBpbnN0YW5jZSgpIHtcclxuICAgIGlmICghdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgRGVza3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcclxuICB9XHJcbn1cclxuXHJcbkRlc2t0b3AuaW5zdGFuY2UoKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9