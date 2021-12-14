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

    // Listen for ready state
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

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
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
    };

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
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
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
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
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
module.exports.default = axios;


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

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
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
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
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
  config.data = transformData(
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
    response.data = transformData(
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
        reason.response.data = transformData(
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

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
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

var defaults = {
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
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
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

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

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
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
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
            exports.setAuthToken(res.data.token);
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
const getJournals = async (battleId) => {
    try {
        const res = await api.get(`/journals?battleId=${battleId}`);
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
            text: `${character.realm_name} - ${character.name}`,
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
        document.getElementsByName(name).forEach((elem) => {
            elem.addEventListener("click", (e) => {
                this.selectedCharacterID = e.target.getAttribute("id");
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
                break;
            }
        }
    }
    initDropdown() {
        const container = document.getElementById("character-select-box__container");
        container.innerHTML = "";
        const elDropdown = dropdown_1.createCustomDropDown({
            variableName: "character",
            dropDownList: convertCharactersToDropdownFormat(this.characters),
        });
        container.appendChild(elDropdown);
        this.initDropDownEventListner("character");
        this.selectedCharacterID =
            this.characters.length > 0 ? this.characters[0].id : null;
        this.setCharacterInfoPanel();
    }
}
exports.default = CharacterInfo;


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
        const elDropdown = dropdown_1.createCustomDropDown({
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
            let specList = await api_1.getSpecList(this.searchCondition.class);
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
                raidDungeonList = await api_1.getDungeonList(this.searchCondition.key_stone_level_min, this.searchCondition.key_stone_level_max);
                raidDungeonList = raidDungeonList.length > 0 ? raidDungeonList : initData_1.testDungeonList;
            }
            else {
                raidDungeonList = await api_1.getRaidList();
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
        let raidBossList = await api_1.getRaidBossList(this.searchCondition.raid_dungeon);
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
            const response = await api_1.getTalentTableInfo({
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
        const talentsTable = talentsTable_1.createTalentsTable({ talentLevelList: talentsInfo }, this.searchCondition.tree_mode);
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
exports.default = TalentPicker;


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
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
const AppWindow_1 = __webpack_require__(/*! ../AppWindow */ "./src/AppWindow.ts");
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
            this.battleId = localStorage.getItem("battleId");
            this.region = localStorage.getItem("region");
            api_1.setAuthToken(token);
            this.getUserCharacterInfo();
        }
        else {
            localStorage.removeItem("token");
            localStorage.removeItem("expiresIn");
            localStorage.removeItem("battleTag");
            localStorage.removeItem("battleId");
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
    setBattleId(battleId) {
        this.battleId = battleId;
    }
    setBattleCred(battleCred) {
        this.battleCred = battleCred;
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
        const loginButton2 = document.getElementById("btn-personal-journal");
        loginButton2.addEventListener("click", (e) => {
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
                    localStorage.removeItem("battleId");
                    localStorage.removeItem("token");
                    localStorage.removeItem("region");
                    elem.classList.remove("enabled");
                    this.drawUserInfo();
                    this.drawSubPanel();
                    this.clearJournalUI();
                    const pjBtnLogin = document.getElementById("btn-personal-journal-onLoggedin");
                    pjBtnLogin.classList.remove("enabled");
                    const pjBtnLogout = document.getElementById("btn-personal-journal");
                    pjBtnLogout.classList.remove("disabled");
                    const homeButton = document.getElementById("btn-main");
                    homeButton.click();
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
        const onlinestatus = document.getElementsByClassName("online-status");
        Array.from(onlinestatus).forEach((elem) => {
            elem.addEventListener("click", (e) => {
                if (elem.classList.contains("in-progress")) {
                    return;
                }
                else if (elem.id === "top-logout-button") {
                    this.isLoggedIn = false;
                    localStorage.removeItem("expiresIn");
                    localStorage.removeItem("battleTag");
                    localStorage.removeItem("battleId");
                    localStorage.removeItem("token");
                    localStorage.removeItem("region");
                    elem.classList.remove("enabled");
                    this.drawUserInfo();
                    this.drawSubPanel();
                    this.clearJournalUI();
                    const pjBtnLogin = document.getElementById("btn-personal-journal-onLoggedin");
                    pjBtnLogin.classList.remove("enabled");
                    const pjBtnLogout = document.getElementById("btn-personal-journal");
                    pjBtnLogout.classList.remove("disabled");
                    const homeButton = document.getElementById("btn-main");
                    const pjBtnLogout2 = document.getElementById("btn-logout");
                    pjBtnLogout2.classList.remove("enabled");
                    homeButton.click();
                    return;
                }
                Array.from(onlinestatus).forEach((elem1) => {
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
            const userInfo = await api_1.getToken({ code, isOverwolf: true });
            const token = userInfo.token;
            const expiresIn = Date.now() + userInfo.expiresIn * 1000;
            const desktop = Desktop.instance();
            desktop.setBattleTag(userInfo.battleTag);
            desktop.setBattleId(userInfo.battleId);
            desktop.setBattleCred(userInfo.battleCred);
            desktop.setCharacters(userInfo.characters);
            desktop.setRegion(userInfo.region);
            localStorage.setItem("token", token);
            localStorage.setItem("expiresIn", expiresIn.toString());
            localStorage.setItem("battleTag", userInfo.battleTag);
            localStorage.setItem("battleId", userInfo.battleId);
            localStorage.setItem("battleCred", userInfo.battleCred);
            localStorage.setItem("region", userInfo.region);
            desktop.onLoggedIn();
            desktop.getUserJournals();
        }
        catch (e) {
            console.log(e);
        }
        overlay.classList.remove("active");
    }
    async getUserCharacterInfo() {
        const overlay = document.getElementById("loading-overlay");
        overlay.classList.add("active");
        const response = await api_1.getCharacters();
        this.region = response.region;
        this.characters = response.characters;
        console.log(this.characters);
        localStorage.setItem("region", this.region);
        this.onLoggedIn();
        overlay.classList.remove("active");
    }
    async getUserJournals() {
        let response = localStorage.getItem("battleId")
            ? await api_1.getJournals(this.battleId.toString())
            : null;
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
                document.getElementById("myInput2").value =
                    response.data[i].name;
                console.log("object", response.data[i]);
                const cb = document.getElementById("accept");
                cb.value = response.data[i].template;
            });
            deleteSpan.addEventListener("click", (e) => {
                e.stopPropagation();
                api_1.deleteJournal(response.data[i]._id);
                this.clearJournalUI();
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
                const addContentButton = document.getElementById("addContentButton");
                addContentButton.classList.add("active");
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
                        document.querySelector(".editEditor").innerHTML =
                            element.description;
                    });
                    textSpan.addEventListener("click", () => {
                        let elems = document.querySelector(".active-tab");
                        let dataID = elems.getAttribute("data-id");
                        api_1.deleteJournalContent(dataID, element._id);
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
            let inputVal = document.getElementById("myInput")
                .value;
            const cb = document.getElementById("accept");
            const data = {
                battleId: this.battleId.toString(),
                name: inputVal,
            };
            console.log(data);
            const response = await api_1.storeJournals(data);
            if (response.success) {
                const journalList = document.getElementById("journal-tabs");
                journalList.innerHTML = "";
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
            let inputVal = document.getElementById("myInput2")
                .value;
            const cb = document.getElementById("accept");
            let content = document.querySelector(".edit-journel");
            const contentID = content.getAttribute("data-id");
            const data = {
                battleId: this.battleId.toString(),
                name: inputVal,
            };
            const response = await api_1.updateJournals(contentID, data);
            if (response.success) {
                const journalList = document.getElementById("journal-tabs");
                journalList.innerHTML = "";
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
                description: htmlFile,
            };
            const response = await api_1.storeJournalContent(id, data);
            if (response.success) {
                const journalList = document.getElementById("journal-tabs");
                journalList.innerHTML = "";
                await this.getUserJournals();
                let bttnn = document.querySelector(`[data-id="${id}"]`);
                if (bttnn) {
                    bttnn.click();
                }
                document.getElementById("contentTitle").value =
                    "";
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
                description: htmlFile,
            };
            const response = await api_1.editJournalContent(id, contentID, data);
            if (response.success) {
                const journalList = document.getElementById("journal-tabs");
                journalList.innerHTML = "";
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
        const pjBtnLogin = document.getElementById("btn-personal-journal-onLoggedin");
        pjBtnLogin.classList.add("enabled");
        const pjBtnLogout = document.getElementById("btn-personal-journal");
        pjBtnLogout.classList.add("disabled");
        this.drawUserInfo();
        this.drawSubPanel();
    }
    clearJournalUI() {
        const oldJournalList = document.getElementById("journal-tabs");
        oldJournalList.innerHTML = "";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctZ2FtZS1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLWV2ZW50cy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctaG90a2V5cy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWxpc3RlbmVyLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctd2luZG93LmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3QvdGltZXIuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9idWlsZEZ1bGxQYXRoLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9lbmhhbmNlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvQXBwV2luZG93LnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9jb21wb25lbnRzL2Ryb3Bkb3duLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9jb21wb25lbnRzL3RhbGVudHNUYWJsZS50cyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvY29uc3RzLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9pbml0L2luaXREYXRhLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy91dGlscy9hcGkudHMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL3V0aWxzL2NoYXJhY3RlckluZm8udHMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL3V0aWxzL3RhbGVudFBpY2tlci50cyIsIndlYnBhY2s6Ly93b3cubWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL2Rlc2t0b3AvZGVza3RvcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0Esa0NBQWtDLG9DQUFvQyxhQUFhLEVBQUUsRUFBRTtBQUN2RixDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLDZGQUFvQjtBQUN6QyxhQUFhLG1CQUFPLENBQUMsMkZBQW1CO0FBQ3hDLGFBQWEsbUJBQU8sQ0FBQyw2RUFBWTtBQUNqQyxhQUFhLG1CQUFPLENBQUMsaUZBQWM7QUFDbkMsYUFBYSxtQkFBTyxDQUFDLG1GQUFlO0FBQ3BDLGFBQWEsbUJBQU8sQ0FBQywrRUFBYTs7Ozs7Ozs7Ozs7O0FDakJyQjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxzQkFBc0I7QUFDdEIsc0JBQXNCLG1CQUFPLENBQUMsbUZBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjs7Ozs7Ozs7Ozs7O0FDN0NUO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELHFCQUFxQjtBQUNyQixnQkFBZ0IsbUJBQU8sQ0FBQyx1RUFBUztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FB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QUFjLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDMUQsV0FBVyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVPLFlBQVk7UUFDbEIsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4RCxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHVCQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRU0sTUFBTSxDQUFDLFFBQVE7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1NBQ2hDO1FBRUQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7Q0FDRjtBQUVELE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyIsImZpbGUiOiJqcy9kZXNrdG9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lLWxpc3RlbmVyXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWVzLWV2ZW50c1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lc1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1ob3RrZXlzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWxpc3RlbmVyXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LXdpbmRvd1wiKSwgZXhwb3J0cyk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lTGlzdGVuZXIgPSB2b2lkIDA7XHJcbmNvbnN0IG93X2xpc3RlbmVyXzEgPSByZXF1aXJlKFwiLi9vdy1saXN0ZW5lclwiKTtcclxuY2xhc3MgT1dHYW1lTGlzdGVuZXIgZXh0ZW5kcyBvd19saXN0ZW5lcl8xLk9XTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUpIHtcclxuICAgICAgICBzdXBlcihkZWxlZ2F0ZSk7XHJcbiAgICAgICAgdGhpcy5vbkdhbWVJbmZvVXBkYXRlZCA9ICh1cGRhdGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF1cGRhdGUgfHwgIXVwZGF0ZS5nYW1lSW5mbykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdXBkYXRlLnJ1bm5pbmdDaGFuZ2VkICYmICF1cGRhdGUuZ2FtZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXBkYXRlLmdhbWVJbmZvLmlzUnVubmluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKHVwZGF0ZS5nYW1lSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lRW5kZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVFbmRlZCh1cGRhdGUuZ2FtZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uUnVubmluZ0dhbWVJbmZvID0gKGluZm8pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQoaW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5vbkdhbWVJbmZvVXBkYXRlZC5hZGRMaXN0ZW5lcih0aGlzLm9uR2FtZUluZm9VcGRhdGVkKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8odGhpcy5vblJ1bm5pbmdHYW1lSW5mbyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLm9uR2FtZUluZm9VcGRhdGVkLnJlbW92ZUxpc3RlbmVyKHRoaXMub25HYW1lSW5mb1VwZGF0ZWQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lTGlzdGVuZXIgPSBPV0dhbWVMaXN0ZW5lcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVzRXZlbnRzID0gdm9pZCAwO1xyXG5jb25zdCB0aW1lcl8xID0gcmVxdWlyZShcIi4vdGltZXJcIik7XHJcbmNsYXNzIE9XR2FtZXNFdmVudHMge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUsIHJlcXVpcmVkRmVhdHVyZXMsIGZlYXR1cmVSZXRyaWVzID0gMTApIHtcclxuICAgICAgICB0aGlzLm9uSW5mb1VwZGF0ZXMgPSAoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkluZm9VcGRhdGVzKGluZm8uaW5mbyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uTmV3RXZlbnRzID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25OZXdFdmVudHMoZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMgPSByZXF1aXJlZEZlYXR1cmVzO1xyXG4gICAgICAgIHRoaXMuX2ZlYXR1cmVSZXRyaWVzID0gZmVhdHVyZVJldHJpZXM7XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMuZ2V0SW5mbyhyZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIHNldFJlcXVpcmVkRmVhdHVyZXMoKSB7XHJcbiAgICAgICAgbGV0IHRyaWVzID0gMSwgcmVzdWx0O1xyXG4gICAgICAgIHdoaWxlICh0cmllcyA8PSB0aGlzLl9mZWF0dXJlUmV0cmllcykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5zZXRSZXF1aXJlZEZlYXR1cmVzKHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMsIHJlc29sdmUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NldFJlcXVpcmVkRmVhdHVyZXMoKTogc3VjY2VzczogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQuc3VwcG9ydGVkRmVhdHVyZXMubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXdhaXQgdGltZXJfMS5UaW1lci53YWl0KDMwMDApO1xyXG4gICAgICAgICAgICB0cmllcysrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLndhcm4oJ3NldFJlcXVpcmVkRmVhdHVyZXMoKTogZmFpbHVyZSBhZnRlciAnICsgdHJpZXMgKyAnIHRyaWVzJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgMikpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyRXZlbnRzKCkge1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbkluZm9VcGRhdGVzMi5hZGRMaXN0ZW5lcih0aGlzLm9uSW5mb1VwZGF0ZXMpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbk5ld0V2ZW50cy5hZGRMaXN0ZW5lcih0aGlzLm9uTmV3RXZlbnRzKTtcclxuICAgIH1cclxuICAgIHVuUmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uSW5mb1VwZGF0ZXMyLnJlbW92ZUxpc3RlbmVyKHRoaXMub25JbmZvVXBkYXRlcyk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uTmV3RXZlbnRzLnJlbW92ZUxpc3RlbmVyKHRoaXMub25OZXdFdmVudHMpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc3RhcnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtvdy1nYW1lLWV2ZW50c10gU1RBUlRgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zZXRSZXF1aXJlZEZlYXR1cmVzKCk7XHJcbiAgICAgICAgY29uc3QgeyByZXMsIHN0YXR1cyB9ID0gYXdhaXQgdGhpcy5nZXRJbmZvKCk7XHJcbiAgICAgICAgaWYgKHJlcyAmJiBzdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICB0aGlzLm9uSW5mb1VwZGF0ZXMoeyBpbmZvOiByZXMgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW293LWdhbWUtZXZlbnRzXSBTVE9QYCk7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVzRXZlbnRzID0gT1dHYW1lc0V2ZW50cztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVzID0gdm9pZCAwO1xyXG5jbGFzcyBPV0dhbWVzIHtcclxuICAgIHN0YXRpYyBnZXRSdW5uaW5nR2FtZUluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbyhyZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjbGFzc0lkRnJvbUdhbWVJZChnYW1lSWQpIHtcclxuICAgICAgICBsZXQgY2xhc3NJZCA9IE1hdGguZmxvb3IoZ2FtZUlkIC8gMTApO1xyXG4gICAgICAgIHJldHVybiBjbGFzc0lkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldFJlY2VudGx5UGxheWVkR2FtZXMobGltaXQgPSAzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghb3ZlcndvbGYuZ2FtZXMuZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcyhsaW1pdCwgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LmdhbWVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0R2FtZURCSW5mbyhnYW1lQ2xhc3NJZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRHYW1lREJJbmZvKGdhbWVDbGFzc0lkLCByZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZXMgPSBPV0dhbWVzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XSG90a2V5cyA9IHZvaWQgMDtcclxuY2xhc3MgT1dIb3RrZXlzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBzdGF0aWMgZ2V0SG90a2V5VGV4dChob3RrZXlJZCwgZ2FtZUlkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLmdldChyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBob3RrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWVJZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3RrZXkgPSByZXN1bHQuZ2xvYmFscy5maW5kKGggPT4gaC5uYW1lID09PSBob3RrZXlJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0LmdhbWVzICYmIHJlc3VsdC5nYW1lc1tnYW1lSWRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3RrZXkgPSByZXN1bHQuZ2FtZXNbZ2FtZUlkXS5maW5kKGggPT4gaC5uYW1lID09PSBob3RrZXlJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvdGtleSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoaG90a2V5LmJpbmRpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgnVU5BU1NJR05FRCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBvbkhvdGtleURvd24oaG90a2V5SWQsIGFjdGlvbikge1xyXG4gICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMub25QcmVzc2VkLmFkZExpc3RlbmVyKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubmFtZSA9PT0gaG90a2V5SWQpXHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ocmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XSG90a2V5cyA9IE9XSG90a2V5cztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0xpc3RlbmVyID0gdm9pZCAwO1xyXG5jbGFzcyBPV0xpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlKSB7XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dMaXN0ZW5lciA9IE9XTGlzdGVuZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dXaW5kb3cgPSB2b2lkIDA7XHJcbmNsYXNzIE9XV2luZG93IHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgcmVzdG9yZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MucmVzdG9yZShpZCwgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LnN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW3Jlc3RvcmVdIC0gYW4gZXJyb3Igb2NjdXJyZWQsIHdpbmRvd0lkPSR7aWR9LCByZWFzb249JHtyZXN1bHQuZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbWluaW1pemUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm1pbmltaXplKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbWF4aW1pemUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm1heGltaXplKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaGlkZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuaGlkZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGNsb3NlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5nZXRXaW5kb3dTdGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgJiZcclxuICAgICAgICAgICAgICAgIChyZXN1bHQud2luZG93X3N0YXRlICE9PSAnY2xvc2VkJykpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW50ZXJuYWxDbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkcmFnTW92ZShlbGVtKSB7XHJcbiAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgZHJhZ2dhYmxlJztcclxuICAgICAgICBlbGVtLm9ubW91c2Vkb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5kcmFnTW92ZSh0aGlzLl9uYW1lKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0V2luZG93U3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldFdpbmRvd1N0YXRlKGlkLCByZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRDdXJyZW50SW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRDdXJyZW50V2luZG93KHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC53aW5kb3cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9idGFpbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYiA9IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5zdGF0dXMgPT09IFwic3VjY2Vzc1wiICYmIHJlcy53aW5kb3cgJiYgcmVzLndpbmRvdy5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gcmVzLndpbmRvdy5pZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHJlcy53aW5kb3cubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMud2luZG93KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3coY2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5vYnRhaW5EZWNsYXJlZFdpbmRvdyh0aGlzLl9uYW1lLCBjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGFzc3VyZU9idGFpbmVkKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5vYnRhaW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGludGVybmFsQ2xvc2UoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuY2xvc2UoaWQsIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5zdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV1dpbmRvdyA9IE9XV2luZG93O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlRpbWVyID0gdm9pZCAwO1xyXG5jbGFzcyBUaW1lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSwgaWQpIHtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhbmRsZVRpbWVyRXZlbnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vblRpbWVyKHRoaXMuX2lkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyB3YWl0KGludGVydmFsSW5NUykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBpbnRlcnZhbEluTVMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoaW50ZXJ2YWxJbk1TKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IHNldFRpbWVvdXQodGhpcy5oYW5kbGVUaW1lckV2ZW50LCBpbnRlcnZhbEluTVMpO1xyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGltZXJJZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVySWQpO1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuVGltZXIgPSBUaW1lcjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9heGlvcycpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHNldHRsZSA9IHJlcXVpcmUoJy4vLi4vY29yZS9zZXR0bGUnKTtcbnZhciBjb29raWVzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2Nvb2tpZXMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIGJ1aWxkRnVsbFBhdGggPSByZXF1aXJlKCcuLi9jb3JlL2J1aWxkRnVsbFBhdGgnKTtcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzJyk7XG52YXIgaXNVUkxTYW1lT3JpZ2luID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbicpO1xudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi4vY29yZS9jcmVhdGVFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHhockFkYXB0ZXIoY29uZmlnKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBkaXNwYXRjaFhoclJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlcXVlc3REYXRhID0gY29uZmlnLmRhdGE7XG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gY29uZmlnLmhlYWRlcnM7XG5cbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1snQ29udGVudC1UeXBlJ107IC8vIExldCB0aGUgYnJvd3NlciBzZXQgaXRcbiAgICB9XG5cbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICAgIGlmIChjb25maWcuYXV0aCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gY29uZmlnLmF1dGgudXNlcm5hbWUgfHwgJyc7XG4gICAgICB2YXIgcGFzc3dvcmQgPSBjb25maWcuYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChjb25maWcuYXV0aC5wYXNzd29yZCkpIDogJyc7XG4gICAgICByZXF1ZXN0SGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0Jhc2ljICcgKyBidG9hKHVzZXJuYW1lICsgJzonICsgcGFzc3dvcmQpO1xuICAgIH1cblxuICAgIHZhciBmdWxsUGF0aCA9IGJ1aWxkRnVsbFBhdGgoY29uZmlnLmJhc2VVUkwsIGNvbmZpZy51cmwpO1xuICAgIHJlcXVlc3Qub3Blbihjb25maWcubWV0aG9kLnRvVXBwZXJDYXNlKCksIGJ1aWxkVVJMKGZ1bGxQYXRoLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplciksIHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSByZXF1ZXN0IHRpbWVvdXQgaW4gTVNcbiAgICByZXF1ZXN0LnRpbWVvdXQgPSBjb25maWcudGltZW91dDtcblxuICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGVcbiAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uIGhhbmRsZUxvYWQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gV2l0aCBvbmUgZXhjZXB0aW9uOiByZXF1ZXN0IHRoYXQgdXNpbmcgZmlsZTogcHJvdG9jb2wsIG1vc3QgYnJvd3NlcnNcbiAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFByZXBhcmUgdGhlIHJlc3BvbnNlXG4gICAgICB2YXIgcmVzcG9uc2VIZWFkZXJzID0gJ2dldEFsbFJlc3BvbnNlSGVhZGVycycgaW4gcmVxdWVzdCA/IHBhcnNlSGVhZGVycyhyZXF1ZXN0LmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSA6IG51bGw7XG4gICAgICB2YXIgcmVzcG9uc2VEYXRhID0gIWNvbmZpZy5yZXNwb25zZVR5cGUgfHwgY29uZmlnLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnID8gcmVxdWVzdC5yZXNwb25zZVRleHQgOiByZXF1ZXN0LnJlc3BvbnNlO1xuICAgICAgdmFyIHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgIHN0YXR1czogcmVxdWVzdC5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IHJlcXVlc3Quc3RhdHVzVGV4dCxcbiAgICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdFxuICAgICAgfTtcblxuICAgICAgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGJyb3dzZXIgcmVxdWVzdCBjYW5jZWxsYXRpb24gKGFzIG9wcG9zZWQgdG8gYSBtYW51YWwgY2FuY2VsbGF0aW9uKVxuICAgIHJlcXVlc3Qub25hYm9ydCA9IGZ1bmN0aW9uIGhhbmRsZUFib3J0KCkge1xuICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdSZXF1ZXN0IGFib3J0ZWQnLCBjb25maWcsICdFQ09OTkFCT1JURUQnLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgbG93IGxldmVsIG5ldHdvcmsgZXJyb3JzXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoKSB7XG4gICAgICAvLyBSZWFsIGVycm9ycyBhcmUgaGlkZGVuIGZyb20gdXMgYnkgdGhlIGJyb3dzZXJcbiAgICAgIC8vIG9uZXJyb3Igc2hvdWxkIG9ubHkgZmlyZSBpZiBpdCdzIGEgbmV0d29yayBlcnJvclxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKCdOZXR3b3JrIEVycm9yJywgY29uZmlnLCBudWxsLCByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIHZhciB0aW1lb3V0RXJyb3JNZXNzYWdlID0gJ3RpbWVvdXQgb2YgJyArIGNvbmZpZy50aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJztcbiAgICAgIGlmIChjb25maWcudGltZW91dEVycm9yTWVzc2FnZSkge1xuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlID0gY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2U7XG4gICAgICB9XG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IodGltZW91dEVycm9yTWVzc2FnZSwgY29uZmlnLCAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGZ1bGxQYXRoKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3RcbiAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcud2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSAhIWNvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IGNvbmZpZy5yZXNwb25zZVR5cGU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIEV4cGVjdGVkIERPTUV4Y2VwdGlvbiB0aHJvd24gYnkgYnJvd3NlcnMgbm90IGNvbXBhdGlibGUgWE1MSHR0cFJlcXVlc3QgTGV2ZWwgMi5cbiAgICAgICAgLy8gQnV0LCB0aGlzIGNhbiBiZSBzdXBwcmVzc2VkIGZvciAnanNvbicgdHlwZSBhcyBpdCBjYW4gYmUgcGFyc2VkIGJ5IGRlZmF1bHQgJ3RyYW5zZm9ybVJlc3BvbnNlJyBmdW5jdGlvbi5cbiAgICAgICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUgIT09ICdqc29uJykge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXJlcXVlc3REYXRhKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL2NvcmUvbWVyZ2VDb25maWcnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoYXhpb3MuZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSByZXF1aXJlKCcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cbi8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBJbnRlcmNlcHRvck1hbmFnZXIgPSByZXF1aXJlKCcuL0ludGVyY2VwdG9yTWFuYWdlcicpO1xudmFyIGRpc3BhdGNoUmVxdWVzdCA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hSZXF1ZXN0Jyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL21lcmdlQ29uZmlnJyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG4gIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAqL1xuQXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25maWcgPSBhcmd1bWVudHNbMV0gfHwge307XG4gICAgY29uZmlnLnVybCA9IGFyZ3VtZW50c1swXTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gIH1cblxuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXG4gIC8vIFNldCBjb25maWcubWV0aG9kXG4gIGlmIChjb25maWcubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSB0aGlzLmRlZmF1bHRzLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5tZXRob2QgPSAnZ2V0JztcbiAgfVxuXG4gIC8vIEhvb2sgdXAgaW50ZXJjZXB0b3JzIG1pZGRsZXdhcmVcbiAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcbiAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXF1ZXN0LmZvckVhY2goZnVuY3Rpb24gdW5zaGlmdFJlcXVlc3RJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHdoaWxlIChjaGFpbi5sZW5ndGgpIHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5BeGlvcy5wcm90b3R5cGUuZ2V0VXJpID0gZnVuY3Rpb24gZ2V0VXJpKGNvbmZpZykge1xuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICByZXR1cm4gYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLnJlcGxhY2UoL15cXD8vLCAnJyk7XG59O1xuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWRcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBiYXNlVVJMIHdpdGggdGhlIHJlcXVlc3RlZFVSTCxcbiAqIG9ubHkgd2hlbiB0aGUgcmVxdWVzdGVkVVJMIGlzIG5vdCBhbHJlYWR5IGFuIGFic29sdXRlIFVSTC5cbiAqIElmIHRoZSByZXF1ZXN0VVJMIGlzIGFic29sdXRlLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHJlcXVlc3RlZFVSTCB1bnRvdWNoZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdGVkVVJMIEFic29sdXRlIG9yIHJlbGF0aXZlIFVSTCB0byBjb21iaW5lXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpIHtcbiAgaWYgKGJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwocmVxdWVzdGVkVVJMKSkge1xuICAgIHJldHVybiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpO1xuICB9XG4gIHJldHVybiByZXF1ZXN0ZWRVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzXG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgcmVzcG9uc2UuZGF0YSxcbiAgICAgIHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICApO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9LCBmdW5jdGlvbiBvbkFkYXB0ZXJSZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKCFpc0NhbmNlbChyZWFzb24pKSB7XG4gICAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgICBpZiAocmVhc29uICYmIHJlYXNvbi5yZXNwb25zZSkge1xuICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVcGRhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIGNvbmZpZywgZXJyb3IgY29kZSwgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBlcnJvci5jb25maWcgPSBjb25maWc7XG4gIGlmIChjb2RlKSB7XG4gICAgZXJyb3IuY29kZSA9IGNvZGU7XG4gIH1cblxuICBlcnJvci5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgZXJyb3IucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgZXJyb3IuaXNBeGlvc0Vycm9yID0gdHJ1ZTtcblxuICBlcnJvci50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIFN0YW5kYXJkXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICAvLyBNaWNyb3NvZnRcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgbnVtYmVyOiB0aGlzLm51bWJlcixcbiAgICAgIC8vIE1vemlsbGFcbiAgICAgIGZpbGVOYW1lOiB0aGlzLmZpbGVOYW1lLFxuICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxuICAgICAgY29sdW1uTnVtYmVyOiB0aGlzLmNvbHVtbk51bWJlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgLy8gQXhpb3NcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBjb2RlOiB0aGlzLmNvZGVcbiAgICB9O1xuICB9O1xuICByZXR1cm4gZXJyb3I7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG4vKipcbiAqIENvbmZpZy1zcGVjaWZpYyBtZXJnZS1mdW5jdGlvbiB3aGljaCBjcmVhdGVzIGEgbmV3IGNvbmZpZy1vYmplY3RcbiAqIGJ5IG1lcmdpbmcgdHdvIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB0b2dldGhlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzJcbiAqIEByZXR1cm5zIHtPYmplY3R9IE5ldyBvYmplY3QgcmVzdWx0aW5nIGZyb20gbWVyZ2luZyBjb25maWcyIHRvIGNvbmZpZzFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIHZhciB2YWx1ZUZyb21Db25maWcyS2V5cyA9IFsndXJsJywgJ21ldGhvZCcsICdkYXRhJ107XG4gIHZhciBtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cyA9IFsnaGVhZGVycycsICdhdXRoJywgJ3Byb3h5JywgJ3BhcmFtcyddO1xuICB2YXIgZGVmYXVsdFRvQ29uZmlnMktleXMgPSBbXG4gICAgJ2Jhc2VVUkwnLCAndHJhbnNmb3JtUmVxdWVzdCcsICd0cmFuc2Zvcm1SZXNwb25zZScsICdwYXJhbXNTZXJpYWxpemVyJyxcbiAgICAndGltZW91dCcsICd0aW1lb3V0TWVzc2FnZScsICd3aXRoQ3JlZGVudGlhbHMnLCAnYWRhcHRlcicsICdyZXNwb25zZVR5cGUnLCAneHNyZkNvb2tpZU5hbWUnLFxuICAgICd4c3JmSGVhZGVyTmFtZScsICdvblVwbG9hZFByb2dyZXNzJywgJ29uRG93bmxvYWRQcm9ncmVzcycsICdkZWNvbXByZXNzJyxcbiAgICAnbWF4Q29udGVudExlbmd0aCcsICdtYXhCb2R5TGVuZ3RoJywgJ21heFJlZGlyZWN0cycsICd0cmFuc3BvcnQnLCAnaHR0cEFnZW50JyxcbiAgICAnaHR0cHNBZ2VudCcsICdjYW5jZWxUb2tlbicsICdzb2NrZXRQYXRoJywgJ3Jlc3BvbnNlRW5jb2RpbmcnXG4gIF07XG4gIHZhciBkaXJlY3RNZXJnZUtleXMgPSBbJ3ZhbGlkYXRlU3RhdHVzJ107XG5cbiAgZnVuY3Rpb24gZ2V0TWVyZ2VkVmFsdWUodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdCh0YXJnZXQpICYmIHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHRhcmdldCwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHt9LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlLnNsaWNlKCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZURlZXBQcm9wZXJ0aWVzKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICB1dGlscy5mb3JFYWNoKHZhbHVlRnJvbUNvbmZpZzJLZXlzLCBmdW5jdGlvbiB2YWx1ZUZyb21Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG5cbiAgdXRpbHMuZm9yRWFjaChkZWZhdWx0VG9Db25maWcyS2V5cywgZnVuY3Rpb24gZGVmYXVsdFRvQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcxW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2goZGlyZWN0TWVyZ2VLZXlzLCBmdW5jdGlvbiBtZXJnZShwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gY29uZmlnMikge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmIChwcm9wIGluIGNvbmZpZzEpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB2YXIgYXhpb3NLZXlzID0gdmFsdWVGcm9tQ29uZmlnMktleXNcbiAgICAuY29uY2F0KG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzKVxuICAgIC5jb25jYXQoZGVmYXVsdFRvQ29uZmlnMktleXMpXG4gICAgLmNvbmNhdChkaXJlY3RNZXJnZUtleXMpO1xuXG4gIHZhciBvdGhlcktleXMgPSBPYmplY3RcbiAgICAua2V5cyhjb25maWcxKVxuICAgIC5jb25jYXQoT2JqZWN0LmtleXMoY29uZmlnMikpXG4gICAgLmZpbHRlcihmdW5jdGlvbiBmaWx0ZXJBeGlvc0tleXMoa2V5KSB7XG4gICAgICByZXR1cm4gYXhpb3NLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTE7XG4gICAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChvdGhlcktleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuXG4gIHJldHVybiBjb25maWc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuL2NyZWF0ZUVycm9yJyk7XG5cbi8qKlxuICogUmVzb2x2ZSBvciByZWplY3QgYSBQcm9taXNlIGJhc2VkIG9uIHJlc3BvbnNlIHN0YXR1cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlIEEgZnVuY3Rpb24gdGhhdCByZXNvbHZlcyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdCBBIGZ1bmN0aW9uIHRoYXQgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBUaGUgcmVzcG9uc2UuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgdmFyIHZhbGlkYXRlU3RhdHVzID0gcmVzcG9uc2UuY29uZmlnLnZhbGlkYXRlU3RhdHVzO1xuICBpZiAoIXJlc3BvbnNlLnN0YXR1cyB8fCAhdmFsaWRhdGVTdGF0dXMgfHwgdmFsaWRhdGVTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlamVjdChjcmVhdGVFcnJvcihcbiAgICAgICdSZXF1ZXN0IGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICcgKyByZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZS5jb25maWcsXG4gICAgICBudWxsLFxuICAgICAgcmVzcG9uc2UucmVxdWVzdCxcbiAgICAgIHJlc3BvbnNlXG4gICAgKSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBUcmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGEgcmVxdWVzdCBvciBhIHJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGJlIHRyYW5zZm9ybWVkXG4gKiBAcGFyYW0ge0FycmF5fSBoZWFkZXJzIFRoZSBoZWFkZXJzIGZvciB0aGUgcmVxdWVzdCBvciByZXNwb25zZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbn0gZm5zIEEgc2luZ2xlIGZ1bmN0aW9uIG9yIEFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybnMgeyp9IFRoZSByZXN1bHRpbmcgdHJhbnNmb3JtZWQgZGF0YVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zZm9ybURhdGEoZGF0YSwgaGVhZGVycywgZm5zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuKGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcblxudmFyIERFRkFVTFRfQ09OVEVOVF9UWVBFID0ge1xuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbmZ1bmN0aW9uIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCB2YWx1ZSkge1xuICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnMpICYmIHV0aWxzLmlzVW5kZWZpbmVkKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKSkge1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFkYXB0ZXIoKSB7XG4gIHZhciBhZGFwdGVyO1xuICBpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIEZvciBicm93c2VycyB1c2UgWEhSIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy94aHInKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICAvLyBGb3Igbm9kZSB1c2UgSFRUUCBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMvaHR0cCcpO1xuICB9XG4gIHJldHVybiBhZGFwdGVyO1xufVxuXG52YXIgZGVmYXVsdHMgPSB7XG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0FjY2VwdCcpO1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIGRhdGEudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCcpO1xuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgdHJhbnNmb3JtUmVzcG9uc2U6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXNwb25zZShkYXRhKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7IC8qIElnbm9yZSAqLyB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICAvKipcbiAgICogQSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kcyB0byBhYm9ydCBhIHJlcXVlc3QuIElmIHNldCB0byAwIChkZWZhdWx0KSBhXG4gICAqIHRpbWVvdXQgaXMgbm90IGNyZWF0ZWQuXG4gICAqL1xuICB0aW1lb3V0OiAwLFxuXG4gIHhzcmZDb29raWVOYW1lOiAnWFNSRi1UT0tFTicsXG4gIHhzcmZIZWFkZXJOYW1lOiAnWC1YU1JGLVRPS0VOJyxcblxuICBtYXhDb250ZW50TGVuZ3RoOiAtMSxcbiAgbWF4Qm9keUxlbmd0aDogLTEsXG5cbiAgdmFsaWRhdGVTdGF0dXM6IGZ1bmN0aW9uIHZhbGlkYXRlU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMDtcbiAgfVxufTtcblxuZGVmYXVsdHMuaGVhZGVycyA9IHtcbiAgY29tbW9uOiB7XG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLyonXG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0ge307XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgZGVmYXVsdHMuaGVhZGVyc1ttZXRob2RdID0gdXRpbHMubWVyZ2UoREVGQVVMVF9DT05URU5UX1RZUEUpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmYXVsdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcCgpIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKS5cbiAgICByZXBsYWNlKC8lNUIvZ2ksICdbJykuXG4gICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGJhc2Ugb2YgdGhlIHVybCAoZS5nLiwgaHR0cDovL3d3dy5nb29nbGUuY29tKVxuICogQHBhcmFtIHtvYmplY3R9IFtwYXJhbXNdIFRoZSBwYXJhbXMgdG8gYmUgYXBwZW5kZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRVUkwodXJsLCBwYXJhbXMsIHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIGlmICghcGFyYW1zKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIHZhciBzZXJpYWxpemVkUGFyYW1zO1xuICBpZiAocGFyYW1zU2VyaWFsaXplcikge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXNTZXJpYWxpemVyKHBhcmFtcyk7XG4gIH0gZWxzZSBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSkge1xuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJhbXMudG9TdHJpbmcoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFydHMgPSBbXTtcblxuICAgIHV0aWxzLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiBzZXJpYWxpemUodmFsLCBrZXkpIHtcbiAgICAgIGlmICh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbHMuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGtleSA9IGtleSArICdbXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSBbdmFsXTtcbiAgICAgIH1cblxuICAgICAgdXRpbHMuZm9yRWFjaCh2YWwsIGZ1bmN0aW9uIHBhcnNlVmFsdWUodikge1xuICAgICAgICBpZiAodXRpbHMuaXNEYXRlKHYpKSB7XG4gICAgICAgICAgdiA9IHYudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh1dGlscy5pc09iamVjdCh2KSkge1xuICAgICAgICAgIHYgPSBKU09OLnN0cmluZ2lmeSh2KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrZXkpICsgJz0nICsgZW5jb2RlKHYpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcnRzLmpvaW4oJyYnKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgdmFyIGhhc2htYXJrSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cblxuICAgIHVybCArPSAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgc2VyaWFsaXplZFBhcmFtcztcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgc3BlY2lmaWVkIFVSTHNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWxhdGl2ZVVSTCBUaGUgcmVsYXRpdmUgVVJMXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVsYXRpdmVVUkwpIHtcbiAgcmV0dXJuIHJlbGF0aXZlVVJMXG4gICAgPyBiYXNlVVJMLnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgcmVsYXRpdmVVUkwucmVwbGFjZSgvXlxcLysvLCAnJylcbiAgICA6IGJhc2VVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgICAgIHZhciBjb29raWUgPSBbXTtcbiAgICAgICAgICBjb29raWUucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNOdW1iZXIoZXhwaXJlcykpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdleHBpcmVzPScgKyBuZXcgRGF0ZShleHBpcmVzKS50b0dNVFN0cmluZygpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcocGF0aCkpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdwYXRoPScgKyBwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXRpbHMuaXNTdHJpbmcoZG9tYWluKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VjdXJlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnc2VjdXJlJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICAgICAgdmFyIG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoJyhefDtcXFxccyopKCcgKyBuYW1lICsgJyk9KFteO10qKScpKTtcbiAgICAgICAgICByZXR1cm4gKG1hdGNoID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoWzNdKSA6IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgICB0aGlzLndyaXRlKG5hbWUsICcnLCBEYXRlLm5vdygpIC0gODY0MDAwMDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCkge30sXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQoKSB7IHJldHVybiBudWxsOyB9LFxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBzcGVjaWZpZWQgVVJMIGlzIGFic29sdXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZFxcK1xcLVxcLl0qOik/XFwvXFwvL2kudGVzdCh1cmwpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zXG4gKlxuICogQHBhcmFtIHsqfSBwYXlsb2FkIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3MsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXhpb3NFcnJvcihwYXlsb2FkKSB7XG4gIHJldHVybiAodHlwZW9mIHBheWxvYWQgPT09ICdvYmplY3QnKSAmJiAocGF5bG9hZC5pc0F4aW9zRXJyb3IgPT09IHRydWUpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIGhhdmUgZnVsbCBzdXBwb3J0IG9mIHRoZSBBUElzIG5lZWRlZCB0byB0ZXN0XG4gIC8vIHdoZXRoZXIgdGhlIHJlcXVlc3QgVVJMIGlzIG9mIHRoZSBzYW1lIG9yaWdpbiBhcyBjdXJyZW50IGxvY2F0aW9uLlxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICB2YXIgbXNpZSA9IC8obXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICB2YXIgdXJsUGFyc2luZ05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICB2YXIgb3JpZ2luVVJMO1xuXG4gICAgICAvKipcbiAgICAqIFBhcnNlIGEgVVJMIHRvIGRpc2NvdmVyIGl0J3MgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCB0byBiZSBwYXJzZWRcbiAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJlc29sdmVVUkwodXJsKSB7XG4gICAgICAgIHZhciBocmVmID0gdXJsO1xuXG4gICAgICAgIGlmIChtc2llKSB7XG4gICAgICAgIC8vIElFIG5lZWRzIGF0dHJpYnV0ZSBzZXQgdHdpY2UgdG8gbm9ybWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgICBocmVmID0gdXJsUGFyc2luZ05vZGUuaHJlZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuXG4gICAgICAgIC8vIHVybFBhcnNpbmdOb2RlIHByb3ZpZGVzIHRoZSBVcmxVdGlscyBpbnRlcmZhY2UgLSBodHRwOi8vdXJsLnNwZWMud2hhdHdnLm9yZy8jdXJsdXRpbHNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBocmVmOiB1cmxQYXJzaW5nTm9kZS5ocmVmLFxuICAgICAgICAgIHByb3RvY29sOiB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbCA/IHVybFBhcnNpbmdOb2RlLnByb3RvY29sLnJlcGxhY2UoLzokLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdDogdXJsUGFyc2luZ05vZGUuaG9zdCxcbiAgICAgICAgICBzZWFyY2g6IHVybFBhcnNpbmdOb2RlLnNlYXJjaCA/IHVybFBhcnNpbmdOb2RlLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpIDogJycsXG4gICAgICAgICAgaGFzaDogdXJsUGFyc2luZ05vZGUuaGFzaCA/IHVybFBhcnNpbmdOb2RlLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0bmFtZTogdXJsUGFyc2luZ05vZGUuaG9zdG5hbWUsXG4gICAgICAgICAgcG9ydDogdXJsUGFyc2luZ05vZGUucG9ydCxcbiAgICAgICAgICBwYXRobmFtZTogKHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSA/XG4gICAgICAgICAgICB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZSA6XG4gICAgICAgICAgICAnLycgKyB1cmxQYXJzaW5nTm9kZS5wYXRobmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBvcmlnaW5VUkwgPSByZXNvbHZlVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgICAgLyoqXG4gICAgKiBEZXRlcm1pbmUgaWYgYSBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgY3VycmVudCBsb2NhdGlvblxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0VVJMIFRoZSBVUkwgdG8gdGVzdFxuICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4sIG90aGVyd2lzZSBmYWxzZVxuICAgICovXG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKHJlcXVlc3RVUkwpIHtcbiAgICAgICAgdmFyIHBhcnNlZCA9ICh1dGlscy5pc1N0cmluZyhyZXF1ZXN0VVJMKSkgPyByZXNvbHZlVVJMKHJlcXVlc3RVUkwpIDogcmVxdWVzdFVSTDtcbiAgICAgICAgcmV0dXJuIChwYXJzZWQucHJvdG9jb2wgPT09IG9yaWdpblVSTC5wcm90b2NvbCAmJlxuICAgICAgICAgICAgcGFyc2VkLmhvc3QgPT09IG9yaWdpblVSTC5ob3N0KTtcbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52cyAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAgICAoZnVuY3Rpb24gbm9uU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgIH0pKClcbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCBub3JtYWxpemVkTmFtZSkge1xuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIGZ1bmN0aW9uIHByb2Nlc3NIZWFkZXIodmFsdWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gbm9ybWFsaXplZE5hbWUgJiYgbmFtZS50b1VwcGVyQ2FzZSgpID09PSBub3JtYWxpemVkTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICBoZWFkZXJzW25vcm1hbGl6ZWROYW1lXSA9IHZhbHVlO1xuICAgICAgZGVsZXRlIGhlYWRlcnNbbmFtZV07XG4gICAgfVxuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuLy8gSGVhZGVycyB3aG9zZSBkdXBsaWNhdGVzIGFyZSBpZ25vcmVkIGJ5IG5vZGVcbi8vIGMuZi4gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9odHRwLmh0bWwjaHR0cF9tZXNzYWdlX2hlYWRlcnNcbnZhciBpZ25vcmVEdXBsaWNhdGVPZiA9IFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dO1xuXG4vKipcbiAqIFBhcnNlIGhlYWRlcnMgaW50byBhbiBvYmplY3RcbiAqXG4gKiBgYGBcbiAqIERhdGU6IFdlZCwgMjcgQXVnIDIwMTQgMDg6NTg6NDkgR01UXG4gKiBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb25cbiAqIENvbm5lY3Rpb246IGtlZXAtYWxpdmVcbiAqIFRyYW5zZmVyLUVuY29kaW5nOiBjaHVua2VkXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaGVhZGVycyBIZWFkZXJzIG5lZWRpbmcgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBIZWFkZXJzIHBhcnNlZCBpbnRvIGFuIG9iamVjdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhoZWFkZXJzKSB7XG4gIHZhciBwYXJzZWQgPSB7fTtcbiAgdmFyIGtleTtcbiAgdmFyIHZhbDtcbiAgdmFyIGk7XG5cbiAgaWYgKCFoZWFkZXJzKSB7IHJldHVybiBwYXJzZWQ7IH1cblxuICB1dGlscy5mb3JFYWNoKGhlYWRlcnMuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiBwYXJzZXIobGluZSkge1xuICAgIGkgPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBrZXkgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKDAsIGkpKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoaSArIDEpKTtcblxuICAgIGlmIChrZXkpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSAmJiBpZ25vcmVEdXBsaWNhdGVPZi5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSAocGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSA6IFtdKS5jb25jYXQoW3ZhbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkW2tleV0gPSBwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldICsgJywgJyArIHZhbCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJzZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFN5bnRhY3RpYyBzdWdhciBmb3IgaW52b2tpbmcgYSBmdW5jdGlvbiBhbmQgZXhwYW5kaW5nIGFuIGFycmF5IGZvciBhcmd1bWVudHMuXG4gKlxuICogQ29tbW9uIHVzZSBjYXNlIHdvdWxkIGJlIHRvIHVzZSBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YC5cbiAqXG4gKiAgYGBganNcbiAqICBmdW5jdGlvbiBmKHgsIHksIHopIHt9XG4gKiAgdmFyIGFyZ3MgPSBbMSwgMiwgM107XG4gKiAgZi5hcHBseShudWxsLCBhcmdzKTtcbiAqICBgYGBcbiAqXG4gKiBXaXRoIGBzcHJlYWRgIHRoaXMgZXhhbXBsZSBjYW4gYmUgcmUtd3JpdHRlbi5cbiAqXG4gKiAgYGBganNcbiAqICBzcHJlYWQoZnVuY3Rpb24oeCwgeSwgeikge30pKFsxLCAyLCAzXSk7XG4gKiAgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzcHJlYWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoYXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFycik7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG5cbi8qZ2xvYmFsIHRvU3RyaW5nOnRydWUqL1xuXG4vLyB1dGlscyBpcyBhIGxpYnJhcnkgb2YgZ2VuZXJpYyBoZWxwZXIgZnVuY3Rpb25zIG5vbi1zcGVjaWZpYyB0byBheGlvc1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXksIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB1bmRlZmluZWQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0J1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsKSAmJiB2YWwuY29uc3RydWN0b3IgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbC5jb25zdHJ1Y3RvcilcbiAgICAmJiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBGb3JtRGF0YSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRm9ybURhdGEodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJykgJiYgKHZhbCBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAodmFsLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBOdW1iZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKHZhbCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpO1xuICByZXR1cm4gcHJvdG90eXBlID09PSBudWxsIHx8IHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIERhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZpbGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0ZpbGUodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZpbGVdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJsb2JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEJsb2JdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmVhbSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyZWFtKHZhbCkge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC5waXBlKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyh2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIHZhbCBpbnN0YW5jZW9mIFVSTFNlYXJjaFBhcmFtcztcbn1cblxuLyoqXG4gKiBUcmltIGV4Y2VzcyB3aGl0ZXNwYWNlIG9mZiB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBTdHJpbmcgdG8gdHJpbVxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpLnJlcGxhY2UoL1xccyokLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqIG5hdGl2ZXNjcmlwdFxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdOYXRpdmVTY3JpcHQnIG9yICdOUydcbiAqL1xuZnVuY3Rpb24gaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiAobmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05hdGl2ZVNjcmlwdCcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ05TJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0IGludm9raW5nIGEgZnVuY3Rpb24gZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiBgb2JqYCBpcyBhbiBBcnJheSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGluZGV4LCBhbmQgY29tcGxldGUgYXJyYXkgZm9yIGVhY2ggaXRlbS5cbiAqXG4gKiBJZiAnb2JqJyBpcyBhbiBPYmplY3QgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBrZXksIGFuZCBjb21wbGV0ZSBvYmplY3QgZm9yIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayB0byBpbnZva2UgZm9yIGVhY2ggaXRlbVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGb3JjZSBhbiBhcnJheSBpZiBub3QgYWxyZWFkeSBzb21ldGhpbmcgaXRlcmFibGVcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgb2JqID0gW29ial07XG4gIH1cblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGFycmF5IHZhbHVlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBvYmplY3Qga2V5c1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBY2NlcHRzIHZhcmFyZ3MgZXhwZWN0aW5nIGVhY2ggYXJndW1lbnQgdG8gYmUgYW4gb2JqZWN0LCB0aGVuXG4gKiBpbW11dGFibHkgbWVyZ2VzIHRoZSBwcm9wZXJ0aWVzIG9mIGVhY2ggb2JqZWN0IGFuZCByZXR1cm5zIHJlc3VsdC5cbiAqXG4gKiBXaGVuIG11bHRpcGxlIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBrZXkgdGhlIGxhdGVyIG9iamVjdCBpblxuICogdGhlIGFyZ3VtZW50cyBsaXN0IHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciByZXN1bHQgPSBtZXJnZSh7Zm9vOiAxMjN9LCB7Zm9vOiA0NTZ9KTtcbiAqIGNvbnNvbGUubG9nKHJlc3VsdC5mb28pOyAvLyBvdXRwdXRzIDQ1NlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iajEgT2JqZWN0IHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXN1bHQgb2YgYWxsIG1lcmdlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoLyogb2JqMSwgb2JqMiwgb2JqMywgLi4uICovKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHRba2V5XSkgJiYgaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHJlc3VsdFtrZXldLCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IG1lcmdlKHt9LCB2YWwpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbC5zbGljZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmb3JFYWNoKGFyZ3VtZW50c1tpXSwgYXNzaWduVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRXh0ZW5kcyBvYmplY3QgYSBieSBtdXRhYmx5IGFkZGluZyB0byBpdCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGhpc0FyZyBUaGUgb2JqZWN0IHRvIGJpbmQgZnVuY3Rpb24gdG9cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHJlc3VsdGluZyB2YWx1ZSBvZiBvYmplY3QgYVxuICovXG5mdW5jdGlvbiBleHRlbmQoYSwgYiwgdGhpc0FyZykge1xuICBmb3JFYWNoKGIsIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKHRoaXNBcmcgJiYgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYVtrZXldID0gYmluZCh2YWwsIHRoaXNBcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhW2tleV0gPSB2YWw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGE7XG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5dGUgb3JkZXIgbWFya2VyLiBUaGlzIGNhdGNoZXMgRUYgQkIgQkYgKHRoZSBVVEYtOCBCT00pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgd2l0aCBCT01cbiAqIEByZXR1cm4ge3N0cmluZ30gY29udGVudCB2YWx1ZSB3aXRob3V0IEJPTVxuICovXG5mdW5jdGlvbiBzdHJpcEJPTShjb250ZW50KSB7XG4gIGlmIChjb250ZW50LmNoYXJDb2RlQXQoMCkgPT09IDB4RkVGRikge1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDEpO1xuICB9XG4gIHJldHVybiBjb250ZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNBcnJheUJ1ZmZlcjogaXNBcnJheUJ1ZmZlcixcbiAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhOiBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldzogaXNBcnJheUJ1ZmZlclZpZXcsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzUGxhaW5PYmplY3Q6IGlzUGxhaW5PYmplY3QsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNEYXRlOiBpc0RhdGUsXG4gIGlzRmlsZTogaXNGaWxlLFxuICBpc0Jsb2I6IGlzQmxvYixcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgaXNTdHJlYW06IGlzU3RyZWFtLFxuICBpc1VSTFNlYXJjaFBhcmFtczogaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzU3RhbmRhcmRCcm93c2VyRW52OiBpc1N0YW5kYXJkQnJvd3NlckVudixcbiAgZm9yRWFjaDogZm9yRWFjaCxcbiAgbWVyZ2U6IG1lcmdlLFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdHJpbTogdHJpbSxcbiAgc3RyaXBCT006IHN0cmlwQk9NXG59O1xuIiwiaW1wb3J0IHsgT1dXaW5kb3cgfSBmcm9tIFwiQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10c1wiO1xyXG5cclxuLy8gQSBiYXNlIGNsYXNzIGZvciB0aGUgYXBwJ3MgZm9yZWdyb3VuZCB3aW5kb3dzLlxyXG4vLyBTZXRzIHRoZSBtb2RhbCBhbmQgZHJhZyBiZWhhdmlvcnMsIHdoaWNoIGFyZSBzaGFyZWQgYWNjcm9zcyB0aGUgZGVza3RvcCBhbmQgaW4tZ2FtZSB3aW5kb3dzLlxyXG5leHBvcnQgY2xhc3MgQXBwV2luZG93IHtcclxuICBwcm90ZWN0ZWQgY3VycldpbmRvdzogT1dXaW5kb3c7XHJcbiAgcHJvdGVjdGVkIG1haW5XaW5kb3c6IE9XV2luZG93O1xyXG4gIHByb3RlY3RlZCBtYXhpbWl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3Iod2luZG93TmFtZSkge1xyXG4gICAgdGhpcy5tYWluV2luZG93ID0gbmV3IE9XV2luZG93KCdiYWNrZ3JvdW5kJyk7XHJcbiAgICB0aGlzLmN1cnJXaW5kb3cgPSBuZXcgT1dXaW5kb3cod2luZG93TmFtZSk7XHJcblxyXG4gICAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VCdXR0b24nKTtcclxuICAgIC8vIGNvbnN0IG1heGltaXplQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21heGltaXplQnV0dG9uJyk7XHJcbiAgICBjb25zdCBtaW5pbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtaW5pbWl6ZUJ1dHRvbicpO1xyXG5cclxuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXInKTtcclxuXHJcbiAgICB0aGlzLnNldERyYWcoaGVhZGVyKTtcclxuXHJcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2Nsb3NlQnV0dG9uIGNsaWNrZWQnKVxyXG4gICAgICB0aGlzLm1haW5XaW5kb3cuY2xvc2UoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIG1pbmltaXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnbWluaW1pemVCdXR0b24gY2xpY2tlZCcpXHJcbiAgICAgIHRoaXMuY3VycldpbmRvdy5taW5pbWl6ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gbWF4aW1pemVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAvLyAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWF4aW1pemUtaW1nXCIpO1xyXG4gICAgLy8gICBpZiAoIXRoaXMubWF4aW1pemVkKSB7XHJcbiAgICAvLyAgICAgdGhpcy5jdXJyV2luZG93Lm1heGltaXplKCk7XHJcbiAgICAvLyAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy9pbWcvaW4tZ2FtZS13aW5kb3cvYnV0dG9uL3Jlc3RvcmUucG5nJyk7XHJcbiAgICAvLyAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgdGhpcy5jdXJyV2luZG93LnJlc3RvcmUoKTtcclxuICAgIC8vICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltZy9pbi1nYW1lLXdpbmRvdy9idXR0b24vbWF4aW1pemUucG5nJyk7XHJcbiAgICAvLyAgIH1cclxuXHJcbiAgICAvLyAgIHRoaXMubWF4aW1pemVkID0gIXRoaXMubWF4aW1pemVkO1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2VXaW5kb3coKSB7XHJcbiAgICB0aGlzLm1haW5XaW5kb3cuY2xvc2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRXaW5kb3dTdGF0ZSgpIHtcclxuICAgIHJldHVybiBhd2FpdCB0aGlzLmN1cnJXaW5kb3cuZ2V0V2luZG93U3RhdGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgc2V0RHJhZyhlbGVtKSB7XHJcbiAgICB0aGlzLmN1cnJXaW5kb3cuZHJhZ01vdmUoZWxlbSk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBpbnRlcmZhY2UgRHJvcERvd25JdGVtSW5mbyB7XHJcbiAgICBpZDogc3RyaW5nLFxyXG4gICAgdGV4dDogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBEcm9wRG93bkluZm8ge1xyXG4gICAgdmFyaWFibGVOYW1lOiBzdHJpbmcsXHJcbiAgICBkcm9wRG93bkxpc3Q6IERyb3BEb3duSXRlbUluZm9bXVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDdXJyZW50RWxlbWVudChkcm9wZG93bkluZm86IERyb3BEb3duSW5mbyk6SFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZHJvcGRvd25DdXJyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGRyb3Bkb3duQ3VycmVudC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9fY3VycmVudFwiKTtcclxuXHJcbiAgICBkcm9wZG93bkluZm8uZHJvcERvd25MaXN0LmZvckVhY2goKGRyb3Bkb3duSXRlbUluZm86IERyb3BEb3duSXRlbUluZm8sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZHJvcGRvd25JdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkcm9wZG93bkl0ZW0uY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hfX3ZhbHVlXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9faW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInJhZGlvXCIpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIGRyb3Bkb3duSXRlbUluZm8uaWQpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGRyb3Bkb3duSXRlbUluZm8udGV4dCk7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBkcm9wZG93bkluZm8udmFyaWFibGVOYW1lKTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiLCBcImNoZWNrZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkcm9wZG93bkl0ZW0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICAgICAgdGV4dC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9faW5wdXQtdGV4dFwiKTtcclxuICAgICAgICB0ZXh0LmlubmVyVGV4dCA9IGRyb3Bkb3duSXRlbUluZm8udGV4dDtcclxuXHJcbiAgICAgICAgZHJvcGRvd25JdGVtLmFwcGVuZENoaWxkKHRleHQpO1xyXG5cclxuICAgICAgICBkcm9wZG93bkN1cnJlbnQuYXBwZW5kQ2hpbGQoZHJvcGRvd25JdGVtKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIGlmIChkcm9wZG93bkluZm8udmFyaWFibGVOYW1lID09PSAnY2hhcmFjdGVyJykge1xyXG4gICAgICAgIGFycm93LnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4vaW1nL2Rlc2t0b3Atd2luZG93L2Ryb3Bkb3duLWFycm93LnN2Z1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXJyb3cuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi9pbWcvaW4tZ2FtZS13aW5kb3cvZHJvcGRvd24vZHJvcC1kb3duLWFycm93LnBuZ1wiKTtcclxuICAgIH1cclxuICAgIGFycm93LnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIkFycm93IEljb25cIik7XHJcbiAgICBhcnJvdy5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9faWNvblwiKTtcclxuXHJcbiAgICBkcm9wZG93bkN1cnJlbnQuYXBwZW5kQ2hpbGQoYXJyb3cpXHJcblxyXG4gICAgcmV0dXJuIGRyb3Bkb3duQ3VycmVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlzdEVsZW1lbnQoZHJvcGRvd25JbmZvOiBEcm9wRG93bkluZm8pOkhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGRyb3Bkb3duTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcclxuICAgIGRyb3Bkb3duTGlzdC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9fbGlzdFwiKTtcclxuXHJcbiAgICBkcm9wZG93bkluZm8uZHJvcERvd25MaXN0LmZvckVhY2goKGRyb3Bkb3duSXRlbUluZm86IERyb3BEb3duSXRlbUluZm8pID0+IHtcclxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICAgICAgbGFiZWwuY2xhc3NMaXN0LmFkZChcInNlbGVjdC1ib3hfX29wdGlvblwiKTtcclxuICAgICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgZHJvcGRvd25JdGVtSW5mby5pZCk7XHJcbiAgICAgICAgbGFiZWwuaW5uZXJUZXh0ID0gZHJvcGRvd25JdGVtSW5mby50ZXh0O1xyXG5cclxuICAgICAgICBsaS5hcHBlbmRDaGlsZChsYWJlbCk7XHJcblxyXG4gICAgICAgIGRyb3Bkb3duTGlzdC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgcmV0dXJuIGRyb3Bkb3duTGlzdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbURyb3BEb3duKGRyb3Bkb3duSW5mbzogRHJvcERvd25JbmZvKTpIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBkcm9wZG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkcm9wZG93bi5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveFwiKTtcclxuICAgIGRyb3Bkb3duLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMVwiKTtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50ID0gY3JlYXRlQ3VycmVudEVsZW1lbnQoZHJvcGRvd25JbmZvKTtcclxuICAgIC8vIGlmIChkcm9wZG93bkluZm8udmFyaWFibGVOYW1lID09PSAncmFpZF9kdW5nZW9uJykge1xyXG4gICAgLy8gICAgIGN1cnJlbnQuY2xhc3NMaXN0LmFkZCgnZm9jdXNzZWQnKTtcclxuICAgIC8vIH1cclxuICAgIGRyb3Bkb3duLmFwcGVuZENoaWxkKGN1cnJlbnQpO1xyXG5cclxuICAgIGNvbnN0IGxpc3QgPSBjcmVhdGVMaXN0RWxlbWVudChkcm9wZG93bkluZm8pO1xyXG4gICAgZHJvcGRvd24uYXBwZW5kQ2hpbGQobGlzdCk7XHJcblxyXG4gICAgY3VycmVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgY3VycmVudC5jbGFzc0xpc3QudG9nZ2xlKCdmb2N1c3NlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZHJvcGRvd24uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIChlKSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBjdXJyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3Vzc2VkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZHJvcGRvd247XHJcbn1cclxuIiwiaW50ZXJmYWNlIFRhbGVudEl0ZW0ge1xyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgaWNvbjogc3RyaW5nLFxyXG4gICAgY291bnQ6IG51bWJlcixcclxuICAgIHBlcmNlbnQ6IG51bWJlcixcclxuICAgIGlzX3NlbGVjdGVkOiBib29sZWFuXHJcbn1cclxuXHJcbmludGVyZmFjZSBUYWxlbnRMZXZlbCB7XHJcbiAgICBsZXZlbDogbnVtYmVyLFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFRhbGVudEl0ZW1bXSxcclxuICAgIGlzX3NlbGVjdGVkOiBib29sZWFuXHJcbn1cclxuXHJcbmludGVyZmFjZSBUYWxlbnRUYWJsZSB7XHJcbiAgICB0YWxlbnRMZXZlbExpc3Q6IFRhbGVudExldmVsW11cclxufVxyXG5cclxuY29uc3QgZ2V0Q29sb3JGb3JQZXJjZW50YWdlID0gZnVuY3Rpb24ocGN0OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHBjdFVwcGVyID0gKHBjdCA8IDUwID8gcGN0IDogcGN0IC0gNTApIC8gNTA7XHJcbiAgICBjb25zdCBwY3RMb3dlciA9IDEgLSBwY3RVcHBlcjtcclxuICAgIGNvbnN0IHIgPSBNYXRoLmZsb29yKDIyMiAqIHBjdExvd2VyICsgKHBjdCA8IDUwID8gMjIyIDogMCkgKiBwY3RVcHBlcik7XHJcbiAgICBjb25zdCBnID0gTWF0aC5mbG9vcigocGN0IDwgNTAgPyAwIDogMjIyKSAqIHBjdExvd2VyICsgMjIyICogcGN0VXBwZXIpO1xyXG4gICAgcmV0dXJuIFwiI1wiICsgKCgxIDw8IDI0KSB8IChyIDw8IDE2KSB8IChnIDw8IDgpIHwgMHgwMCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVUYWxlbnRSb3dFbGVtZW50KHRhbGVudExldmVsOiBUYWxlbnRMZXZlbCwgdHJlZU1vZGU6IGJvb2xlYW4pOkhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHRhbGVudExldmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0YWxlbnRMZXZlbEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInRhbGVudC1yb3dcIik7XHJcbiAgICB0YWxlbnRMZXZlbEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zZWxlY3RlZFwiLCB0YWxlbnRMZXZlbC5pc19zZWxlY3RlZCA/IFwieWVzXCIgOiBcIm5vXCIpO1xyXG5cclxuICAgIGNvbnN0IGxldmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldmVsLmNsYXNzTGlzdC5hZGQoXCJvdXRlclwiKTtcclxuXHJcbiAgICBjb25zdCBsZXZlbElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldmVsSW5uZXIuY2xhc3NMaXN0LmFkZChcImlubmVyXCIpO1xyXG4gICAgbGV2ZWxJbm5lci5pbm5lclRleHQgPSBgJHt0YWxlbnRMZXZlbC5sZXZlbH1gO1xyXG5cclxuICAgIGxldmVsLmFwcGVuZENoaWxkKGxldmVsSW5uZXIpO1xyXG4gICAgXHJcbiAgICB0YWxlbnRMZXZlbEVsZW1lbnQuYXBwZW5kQ2hpbGQobGV2ZWwpO1xyXG5cclxuICAgIHRhbGVudExldmVsLnRhbGVudEl0ZW1MaXN0LmZvckVhY2godGFsZW50SXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgdGFsZW50SXRlbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRhbGVudEl0ZW1FbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJvdXRlclwiKTtcclxuICAgICAgICB0YWxlbnRJdGVtRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNlbGVjdGVkXCIsIHRhbGVudEl0ZW0uaXNfc2VsZWN0ZWQgPyBcInllc1wiIDogXCJub1wiKTtcclxuICAgIFxyXG4gICAgICAgIGNvbnN0IElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBJbm5lci5jbGFzc0xpc3QuYWRkKFwiaW5uZXJcIik7XHJcblxyXG4gICAgICAgIGlmICghdHJlZU1vZGUpIHtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICBwZXJjZW50LmNsYXNzTGlzdC5hZGQoJ3BlcmNlbnQnKTtcclxuICAgICAgICAgICAgcGVyY2VudC5zdHlsZVsnY29sb3InXSA9IGdldENvbG9yRm9yUGVyY2VudGFnZSh0YWxlbnRJdGVtLnBlcmNlbnQpO1xyXG4gICAgICAgICAgICBwZXJjZW50LmlubmVyVGV4dCA9IGAke3RhbGVudEl0ZW0ucGVyY2VudH1gO1xyXG4gICAgICAgICAgICBJbm5lci5hcHBlbmRDaGlsZChwZXJjZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaVwiKTtcclxuICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoXCJ0YWxlbnQtaWNvblwiKTtcclxuICAgICAgICBpY29uLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoL2ltZy9pbi1nYW1lLXdpbmRvdy90YWxlbnRzLyR7dGFsZW50SXRlbS5pY29ufSlgO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgdGV4dC5pbm5lclRleHQgPSB0YWxlbnRJdGVtLm5hbWU7XHJcblxyXG4gICAgICAgIElubmVyLmFwcGVuZENoaWxkKGljb24pO1xyXG4gICAgICAgIElubmVyLmFwcGVuZENoaWxkKHRleHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRhbGVudEl0ZW1FbGVtZW50LmFwcGVuZENoaWxkKElubmVyKTtcclxuICAgICAgICB0YWxlbnRMZXZlbEVsZW1lbnQuYXBwZW5kQ2hpbGQodGFsZW50SXRlbUVsZW1lbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRhbGVudExldmVsRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRhbGVudHNUYWJsZSh0YWxlbnRUYWJsZTogVGFsZW50VGFibGUsIHRyZWVNb2RlOiBib29sZWFuKTpIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCB0YWxlbnRzVGFibGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRhbGVudHNUYWJsZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInRhbGVudC10YWJsZVwiKTtcclxuXHJcbiAgICB0YWxlbnRUYWJsZS50YWxlbnRMZXZlbExpc3QuZm9yRWFjaCh0YWxlbnRMZXZlbCA9PiB7XHJcbiAgICAgICAgY29uc3QgdGFsZW50TGV2ZWxFbGVtZW50ID0gY3JlYXRlVGFsZW50Um93RWxlbWVudCh0YWxlbnRMZXZlbCwgdHJlZU1vZGUpO1xyXG4gICAgICAgIHRhbGVudHNUYWJsZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGFsZW50TGV2ZWxFbGVtZW50KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0YWxlbnRzVGFibGVFbGVtZW50O1xyXG59IiwiLy8gY29uc3QgZm9ydG5pdGVDbGFzc0lkID0gMjEyMTY7XHJcbmNvbnN0IHdvd0NsYXNzSWQgPSA3NjU7XHJcblxyXG5jb25zdCBpbnRlcmVzdGluZ0ZlYXR1cmVzID0gW1xyXG4gICdjb3VudGVycycsXHJcbiAgJ2RlYXRoJyxcclxuICAnaXRlbXMnLFxyXG4gICdraWxsJyxcclxuICAna2lsbGVkJyxcclxuICAna2lsbGVyJyxcclxuICAnbG9jYXRpb24nLFxyXG4gICdtYXRjaF9pbmZvJyxcclxuICAnbWF0Y2gnLFxyXG4gICdtZScsXHJcbiAgJ3BoYXNlJyxcclxuICAncmFuaycsXHJcbiAgJ3Jldml2ZWQnLFxyXG4gICdyb3N0ZXInLFxyXG4gICd0ZWFtJ1xyXG5dO1xyXG5cclxuY29uc3Qgd2luZG93TmFtZXMgPSB7XHJcbiAgaW5HYW1lOiAnaW5fZ2FtZScsXHJcbiAgZGVza3RvcDogJ2Rlc2t0b3AnXHJcbn07XHJcblxyXG5jb25zdCBob3RrZXlzID0ge1xyXG4gIHRvZ2dsZTogJ3Nob3doaWRlJ1xyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICB3b3dDbGFzc0lkLFxyXG4gIGludGVyZXN0aW5nRmVhdHVyZXMsXHJcbiAgd2luZG93TmFtZXMsXHJcbiAgaG90a2V5c1xyXG59IiwiZXhwb3J0IGNvbnN0IHRlc3RDbGFzc0xpc3QgPSBbXHJcbiAgeyBpZDogXCJkZWF0aC1rbmlnaHRcIiwgdGV4dDogXCJEZWF0aCBLbmlnaHRcIiB9LFxyXG4gIHsgaWQ6IFwiZGVtb24taHVudGVyXCIsIHRleHQ6IFwiRGVtb24gSHVudGVyXCIgfSxcclxuICB7IGlkOiBcImRydWlkXCIsIHRleHQ6IFwiRHJ1aWRcIiB9LFxyXG4gIHsgaWQ6IFwiaHVudGVyXCIsIHRleHQ6IFwiSHVudGVyXCIgfSxcclxuICB7IGlkOiBcIm1hZ2VcIiwgdGV4dDogXCJNYWdlXCIgfSxcclxuICB7IGlkOiBcIm1vbmtcIiwgdGV4dDogXCJNb25rXCIgfSxcclxuICB7IGlkOiBcInBhbGFkaW5cIiwgdGV4dDogXCJQYWxhZGluXCIgfSxcclxuICB7IGlkOiBcInByaWVzdFwiLCB0ZXh0OiBcIlByaWVzdFwiIH0sXHJcbiAgeyBpZDogXCJyb2d1ZVwiLCB0ZXh0OiBcIlJvZ3VlXCIgfSxcclxuICB7IGlkOiBcInNoYW1hblwiLCB0ZXh0OiBcIlNoYW1hblwiIH0sXHJcbiAgeyBpZDogXCJ3YXJsb2NrXCIsIHRleHQ6IFwiV2FybG9ja1wiIH0sXHJcbiAgeyBpZDogXCJ3YXJyaW9yXCIsIHRleHQ6IFwiV2FycmlvclwiIH0sXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdGVzdFNwZWNzTGlzdCA9IFtcclxuICB7IGlkOiBcImJsb29kXCIsIHRleHQ6IFwiQmxvb2RcIiB9LFxyXG4gIHsgaWQ6IFwiZnJvc3RcIiwgdGV4dDogXCJGcm9zdFwiIH0sXHJcbiAgeyBpZDogXCJ1bmhvbHlcIiwgdGV4dDogXCJVbmhvbHlcIiB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRlc3REdW5nZW9uTGlzdCA9IFtcclxuICB7IGlkOiBcImRlLW90aGVyLXNpZGVcIiwgdGV4dDogXCJkZSBvdGhlciBzaWRlXCIgfSxcclxuICB7IGlkOiBcImhhbGxzLW9mLWF0b25lbWVudFwiLCB0ZXh0OiBcImhhbGxzIG9mIGF0b25lbWVudFwiIH0sXHJcbiAgeyBpZDogXCJtaXN0cy1vZi10aXJuYS1zY2l0aGVcIiwgdGV4dDogXCJtaXN0cyBvZiB0aXJuYSBzY2l0aGVcIiB9LFxyXG4gIHsgaWQ6IFwicGxhZ3VlZmFsbFwiLCB0ZXh0OiBcInBsYWd1ZWZhbGxcIiB9LFxyXG4gIHsgaWQ6IFwic2FuZ3VpbmUtZGVwdGhzXCIsIHRleHQ6IFwic2FuZ3VpbmUgZGVwdGhzXCIgfSxcclxuICB7IGlkOiBcInNwaXJlcy1vZi1hc2NlbnNpb25cIiwgdGV4dDogXCJzcGlyZXMgb2YgYXNjZW5zaW9uXCIgfSxcclxuICB7IGlkOiBcInRoZS1uZWNyb3RpYy13YWtlXCIsIHRleHQ6IFwidGhlIG5lY3JvdGljIHdha2VcIiB9LFxyXG4gIHsgaWQ6IFwidGhlYXRlci1vZi1wYWluXCIsIHRleHQ6IFwidGhlYXRlciBvZiBwYWluXCIgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB0ZXN0UmFpZExpc3QgPSBbXHJcbiAgeyBpZDogXCJhbnRvcnVzLXRoZS1idXJuaW5nLXRocm9uZVwiLCB0ZXh0OiBcIkFudG9ydXMsIHRoZSBCdXJuaW5nIFRocm9uZVwiIH0sXHJcbiAgeyBpZDogXCJiYXR0bGUtb2YtZGF6YXJhbG9yXCIsIHRleHQ6IFwiQmF0dGxlIG9mIERhemFyJ2Fsb3JcIiB9LFxyXG4gIHsgaWQ6IFwiY2FzdGxlLW5hdGhyaWFcIiwgdGV4dDogXCJDYXN0bGUgTmF0aHJpYVwiIH0sXHJcbiAgeyBpZDogXCJjcnVjaWJsZS1vZi1zdG9ybXNcIiwgdGV4dDogXCJDcnVjaWJsZSBvZiBTdG9ybXNcIiB9LFxyXG4gIHsgaWQ6IFwibnlhbHRoYS10aGUtd2FraW5nLWNpdHlcIiwgdGV4dDogXCJOeSdhbHRoYSwgdGhlIFdha2luZyBDaXR5XCIgfSxcclxuICB7IGlkOiBcInRoZS1lbWVyYWxkLW5pZ2h0bWFyZVwiLCB0ZXh0OiBcIlRoZSBFbWVyYWxkIE5pZ2h0bWFyZVwiIH0sXHJcbiAgeyBpZDogXCJ0aGUtZXRlcm5hbC1wYWxhY2VcIiwgdGV4dDogXCJUaGUgRXRlcm5hbCBQYWxhY2VcIiB9LFxyXG4gIHsgaWQ6IFwidGhlLW5pZ2h0aG9sZFwiLCB0ZXh0OiBcIlRoZSBOaWdodGhvbGRcIiB9LFxyXG4gIHsgaWQ6IFwidG9tYi1vZi1zYXJnZXJhc1wiLCB0ZXh0OiBcIlRvbWIgb2YgU2FyZ2VyYXNcIiB9LFxyXG4gIHsgaWQ6IFwidHJpYWwtb2YtdmFsb3JcIiwgdGV4dDogXCJUcmlhbCBvZiBWYWxvclwiIH0sXHJcbiAgeyBpZDogXCJ1bGRpclwiLCB0ZXh0OiBcIlVsZGlyXCIgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB0ZXN0S2V5TGV2ZWxMaXN0ID0gW1xyXG4gIHsgaWQ6IFwibXl0aGljXCIsIHRleHQ6IFwiTXl0aGljXCIgfSxcclxuICB7IGlkOiBcImhlcm9pY1wiLCB0ZXh0OiBcIkhlcm9pY1wiIH0sXHJcbiAgeyBpZDogXCJub3JtYWxcIiwgdGV4dDogXCJOb3JtYWxcIiB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRlc3RSYWlkQm9zc0xpc3QgPSBbXHJcbiAgeyBpZDogXCJhZ2dyYW1hclwiLCB0ZXh0OiBcIkFnZ3JhbWFyXCIgfSxcclxuICB7IGlkOiBcImFudG9yYW4taGlnaC1jb21tYW5kXCIsIHRleHQ6IFwiQW50b3JhbiBIaWdoIENvbW1hbmRcIiB9LFxyXG4gIHsgaWQ6IFwiYXJndXMtdGhlLXVubWFrZXJcIiwgdGV4dDogXCJBcmd1cyB0aGUgVW5tYWtlclwiIH0sXHJcbiAgeyBpZDogXCJlb25hci10aGUtbGlmZS1iaW5kZXJcIiwgdGV4dDogXCJFb25hciB0aGUgTGlmZS1CaW5kZXJcIiB9LFxyXG4gIHsgaWQ6IFwiZmVsaG91bmRzLW9mLXNhcmdlcmFzXCIsIHRleHQ6IFwiRmVsaG91bmRzIG9mIFNhcmdlcmFzXCIgfSxcclxuICB7IGlkOiBcImdhcm90aGktd29ybGRicmVha2VyXCIsIHRleHQ6IFwiR2Fyb3RoaSBXb3JsZGJyZWFrZXJcIiB9LFxyXG4gIHsgaWQ6IFwiaW1vbmFyLXRoZS1zb3VsaHVudGVyXCIsIHRleHQ6IFwiSW1vbmFyIHRoZSBTb3VsaHVudGVyXCIgfSxcclxuICB7IGlkOiBcImtpbidnYXJvdGhcIiwgdGV4dDogXCJLaW4nZ2Fyb3RoXCIgfSxcclxuICB7IGlkOiBcInBvcnRhbC1rZWVwZXItaGFzYWJlbFwiLCB0ZXh0OiBcIlBvcnRhbCBLZWVwZXIgSGFzYWJlbFwiIH0sXHJcbiAgeyBpZDogXCJ0aGUtY292ZW4tb2Ytc2hpdmFycmFcIiwgdGV4dDogXCJUaGUgQ292ZW4gb2YgU2hpdmFycmFcIiB9LFxyXG4gIHsgaWQ6IFwidmFyaW1hdGhyYXNcIiwgdGV4dDogXCJWYXJpbWF0aHJhc1wiIH0sXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdGVzdFRhbGVudHNJbmZvID0gW1xyXG4gIHtcclxuICAgIGxldmVsOiAxNSxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkhlYXJ0YnJlYWtlclwiLFxyXG4gICAgICAgIGljb246IFwic3BlbGxfZGVhdGhrbmlnaHRfZGVhdGhzdHJpa2UuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDI3MzAsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkJsb29kZHJpbmtlclwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9hbmltdXNkcmF3LmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA0MDAsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlRvbWJzdG9uZVwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9maWVnbmRlYWQuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDgzLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgfSxcclxuICB7XHJcbiAgICBsZXZlbDogMjUsXHJcbiAgICB0YWxlbnRJdGVtTGlzdDogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJSYXBpZCBEZWNvbXBvc2l0aW9uXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2RlYXRoa25pZ2h0X2RlYXRoc2lwaG9uMi5qcGdcIixcclxuICAgICAgICBjb3VudDogNTQsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkhlbW9zdGFzaXNcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfZGVhdGh3aW5nX2Jsb29kY29ycnVwdGlvbl9lYXJ0aC5qcGdcIixcclxuICAgICAgICBjb3VudDogMzE0NCxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiQ29uc3VtcHRpb25cIixcclxuICAgICAgICBpY29uOiBcImludl9heGVfMmhfYXJ0aWZhY3RtYXdfZF8wMS5qcGdcIixcclxuICAgICAgICBjb3VudDogMTUsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiAzMCxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkZvdWwgQnVsd2Fya1wiLFxyXG4gICAgICAgIGljb246IFwiaW52X2FybW9yX3NoaWVsZF9uYXh4cmFtYXNfZF8wMi5qcGdcIixcclxuICAgICAgICBjb3VudDogNjA3LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJSZWxpc2ggaW4gQmxvb2RcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfZGVhdGhrbmlnaHRfcm9pbGluZ2Jsb29kLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAxNjEzLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJCbG9vZCBUYXBcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX2RlYXRoa25pZ2h0X2Jsb29kdGFwLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA5OTMsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiAzNSxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIldpbGwgb2YgdGhlIE5lY3JvcG9saXNcIixcclxuICAgICAgICBpY29uOiBcImFjaGlldmVtZW50X2Jvc3Nfa2VsdGh1emFkXzAxLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAzMTEzLFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJBbnRpLU1hZ2ljIEJhcnJpZXJcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX3NoYWRvd19hbnRpbWFnaWNzaGVsbC5qcGdcIixcclxuICAgICAgICBjb3VudDogOTIsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIk1hcmsgb2YgQmxvb2RcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfaHVudGVyX3JhcGlka2lsbGluZy5qcGdcIixcclxuICAgICAgICBjb3VudDogOCxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbGV2ZWw6IDQwLFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiR3JpcCBvZiB0aGUgRGVhZFwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9jcmVhdHVyZV9kaXNlYXNlXzA1LmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAyMzY5LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJUaWdodGVuaW5nIEdyYXNwXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2RlYXRoa25pZ2h0X2FvZWRlYXRoZ3JpcC5qcGdcIixcclxuICAgICAgICBjb3VudDogMTg1LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJXcmFpdGggV2Fsa1wiLFxyXG4gICAgICAgIGljb246IFwiaW52X2hlbG1fcGxhdGVfcmFpZGRlYXRoa25pZ2h0X3BfMDEuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDY1OSxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbGV2ZWw6IDQ1LFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiVm9yYWNpb3VzXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2lyb25tYWlkZW5zX3doaXJsb2ZibG9vZC5qcGdcIixcclxuICAgICAgICBjb3VudDogMTk5NixcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiRGVhdGggUGFjdFwiLFxyXG4gICAgICAgIGljb246IFwic3BlbGxfc2hhZG93X2RlYXRocGFjdC5qcGdcIixcclxuICAgICAgICBjb3VudDogMTcsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkJsb29kd29ybXNcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX3NoYWRvd19zb3VsbGVlY2guanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDEyMDAsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiA1MCxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlB1cmdhdG9yeVwiLFxyXG4gICAgICAgIGljb246IFwiaW52X21pc2Nfc2hhZG93ZWdnLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA2NjEsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlJlZCBUaGlyc3RcIixcclxuICAgICAgICBpY29uOiBcInNwZWxsX2RlYXRoa25pZ2h0X2Jsb29kcHJlc2VuY2UuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDE2NjksXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkJvbmVzdG9ybVwiLFxyXG4gICAgICAgIGljb246IFwiYWNoaWV2ZW1lbnRfYm9zc19sb3JkbWFycm93Z2FyLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA4ODMsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9XHJcbl07IiwiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xyXG5cclxuY29uc3QgYXBpID0gYXhpb3MuY3JlYXRlKHtcclxuICAvLyAgIGJhc2VVUkw6IGBodHRwOi8vbG9jYWxob3N0OjUwMDAvYXBpYCxcclxuICBiYXNlVVJMOiBgaHR0cHM6Ly93b3dtZS5nZy9hcGlgLFxyXG4gIGhlYWRlcnM6IHtcclxuICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldEF1dGhUb2tlbiA9ICh0b2tlbikgPT4ge1xyXG4gIGRlbGV0ZSBhcGkuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bXCJ4LWF1dGgtdG9rZW5cIl07XHJcblxyXG4gIGlmICh0b2tlbikge1xyXG4gICAgYXBpLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uW1wieC1hdXRoLXRva2VuXCJdID0gdG9rZW47XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNwZWNMaXN0ID0gYXN5bmMgKGNsYXNzX25hbWUpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkuZ2V0KGAvZ2V0X3NwZWNfbGlzdGAsIHtcclxuICAgICAgcGFyYW1zOiB7IGNsYXNzOiBjbGFzc19uYW1lIH0sXHJcbiAgICB9KTtcclxuICAgIGlmIChyZXNwb25zZS5kYXRhLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEuc3BlY0xpc3Q7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG4gIHJldHVybiBbXTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXREdW5nZW9uTGlzdCA9IGFzeW5jIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkuZ2V0KGAvZ2V0X2R1bmdlb25fbGlzdGAsIHtcclxuICAgICAgcGFyYW1zOiB7IG1pbjogbWluLCBtYXg6IG1heCB9LFxyXG4gICAgfSk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLmR1bmdlb25MaXN0O1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtdO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJhaWRMaXN0ID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5nZXQoYC9nZXRfcmFpZF9saXN0YCk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJhaWRMaXN0O1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtdO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJhaWRCb3NzTGlzdCA9IGFzeW5jIChyYWlkKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLmdldChgL2dldF9yYWlkX2Jvc3NfbGlzdGAsIHtcclxuICAgICAgcGFyYW1zOiB7IHJhaWQ6IHJhaWQgfSxcclxuICAgIH0pO1xyXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yYWlkQm9zc0xpc3Q7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW107XHJcbn07XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRhbGVudEluZm9SZXNwb25zZSB7XHJcbiAgdGFsZW50VGFibGVJbmZvOiBhbnlbXTtcclxuICBsb2dDb3VudDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VGFsZW50VGFibGVJbmZvID0gYXN5bmMgKFxyXG4gIHBhcmFtc1xyXG4pOiBQcm9taXNlPFRhbGVudEluZm9SZXNwb25zZT4gPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5nZXQoYC9nZXRfdGFsZW50X3RhYmxlX2luZm9gLCB7XHJcbiAgICAgIHBhcmFtczogcGFyYW1zLFxyXG4gICAgfSk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFsZW50VGFibGVJbmZvOiByZXNwb25zZS5kYXRhLmZhbW91c1RhbGVudEluZm8sXHJcbiAgICAgICAgbG9nQ291bnQ6IHJlc3BvbnNlLmRhdGEubG9nQ291bnQsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGFsZW50VGFibGVJbmZvOiBbXSxcclxuICAgIGxvZ0NvdW50OiAwLFxyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VG9rZW4gPSBhc3luYyAocGFyYW1zKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5wb3N0KFwiL2F1dGgvYm5ldF90b2tlblwiLCBwYXJhbXMpO1xyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgICBzZXRBdXRoVG9rZW4ocmVzLmRhdGEudG9rZW4pO1xyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDaGFyYWN0ZXJzID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkucG9zdChcIi9nZXRfY2hhcmFjdGVyc1wiKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEpvdXJuYWxzID0gYXN5bmMgKGJhdHRsZUlkKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5nZXQoYC9qb3VybmFscz9iYXR0bGVJZD0ke2JhdHRsZUlkfWApO1xyXG4gICAgLy8gY29uc29sZS5sb2cocmVzKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBzdG9yZUpvdXJuYWxzID0gYXN5bmMgKGRhdGEpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLnBvc3QoXCIvam91cm5hbHNcIiwgZGF0YSk7XHJcbiAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlSm91cm5hbHMgPSBhc3luYyAoam91cm5lbElELCBkYXRhKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5wdXQoYC9qb3VybmFscy8ke2pvdXJuZWxJRH1gLCBkYXRhKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiZWRpdGVkIGNhbGwgZnJvbSBhcGlcIik7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlSm91cm5hbENvbnRlbnQgPSBhc3luYyAoaWQsIGRhdGEpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLnBvc3QoYC9qb3VybmFscy8ke2lkfS9jb250ZW50YCwgZGF0YSk7XHJcbiAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlSm91cm5hbENvbnRlbnQgPSBhc3luYyAoam91cm5lbElELCBjb250ZW50SUQpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLmRlbGV0ZShgL2pvdXJuYWxzLyR7am91cm5lbElEfS9jb250ZW50LyR7Y29udGVudElEfWApO1xyXG4gICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpXHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBlZGl0Sm91cm5hbENvbnRlbnQgPSBhc3luYyAoam91cm5lbElELCBjb250ZW50SUQsIGRhdGEpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLnB1dChgL2pvdXJuYWxzLyR7am91cm5lbElEfS9jb250ZW50LyR7Y29udGVudElEfWAsIGRhdGEpO1xyXG4gICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpXHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUpvdXJuYWwgPSBhc3luYyAoam91cm5lbElEKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5kZWxldGUoYC9qb3VybmFscy8ke2pvdXJuZWxJRH1gKTtcclxuICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuIiwiaW1wb3J0IHsgY3JlYXRlQ3VzdG9tRHJvcERvd24gfSBmcm9tIFwiLi4vY29tcG9uZW50cy9kcm9wZG93blwiO1xyXG5cclxuY29uc3QgY29udmVydENoYXJhY3RlcnNUb0Ryb3Bkb3duRm9ybWF0ID0gKGNoYXJhY3RlcnMpID0+IHtcclxuICBjb25zdCByZXN1bHQgPSBbXTtcclxuICBmb3IgKGNvbnN0IGNoYXJhY3RlciBvZiBjaGFyYWN0ZXJzKSB7XHJcbiAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgIGlkOiBjaGFyYWN0ZXIuaWQsXHJcbiAgICAgIHRleHQ6IGAke2NoYXJhY3Rlci5yZWFsbV9uYW1lfSAtICR7Y2hhcmFjdGVyLm5hbWV9YCxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYXJhY3RlckluZm8ge1xyXG4gIHByaXZhdGUgY2hhcmFjdGVycyA9IFtdO1xyXG4gIHByaXZhdGUgc2VsZWN0ZWRDaGFyYWN0ZXJJRDtcclxuXHJcbiAgY29uc3RydWN0b3IoY2hhcmFjdGVycykge1xyXG4gICAgdGhpcy5jaGFyYWN0ZXJzID0gY2hhcmFjdGVycztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RWxlbWVudElubmVySFRNTChpZCwgY29udGVudCkge1xyXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICBlbC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0RHJvcERvd25FdmVudExpc3RuZXIobmFtZTogc3RyaW5nKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShuYW1lKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYXJhY3RlcklEID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXHJcbiAgICAgICAgICBcImlkXCJcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2VsZWN0ZWRDaGFyYWN0ZXJJRCk7XHJcbiAgICAgICAgdGhpcy5zZXRDaGFyYWN0ZXJJbmZvUGFuZWwoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0Q2hhcmFjdGVySW5mb1BhbmVsKCkge1xyXG4gICAgZm9yIChjb25zdCBjaGFyYWN0ZXIgb2YgdGhpcy5jaGFyYWN0ZXJzKSB7XHJcbiAgICAgIGlmIChjaGFyYWN0ZXIuaWQgPT0gdGhpcy5zZWxlY3RlZENoYXJhY3RlcklEKSB7XHJcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SW5uZXJIVE1MKFxyXG4gICAgICAgICAgXCJ0b3RhbF9udW1iZXJfZGVhdGhzXCIsXHJcbiAgICAgICAgICBgVG90YWwgTnVtYmVyIERlYXRoczogJHtjaGFyYWN0ZXIudG90YWxfbnVtYmVyX2RlYXRoc31gXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnRJbm5lckhUTUwoXHJcbiAgICAgICAgICBcInRvdGFsX2dvbGRfZ2FpbmVkXCIsXHJcbiAgICAgICAgICBgVG90YWwgR29sZCBHYWluZWQ6ICR7Y2hhcmFjdGVyLnRvdGFsX2dvbGRfZ2FpbmVkfWBcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudElubmVySFRNTChcclxuICAgICAgICAgIFwidG90YWxfZ29sZF9sb3N0XCIsXHJcbiAgICAgICAgICBgVG90YWwgR29sZCBMb3N0OiAke2NoYXJhY3Rlci50b3RhbF9nb2xkX2xvc3R9YFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50SW5uZXJIVE1MKFxyXG4gICAgICAgICAgXCJ0b3RhbF9pdGVtX3ZhbHVlX2dhaW5lZFwiLFxyXG4gICAgICAgICAgYFRvdGFsIEl0ZW0gVmFsdWUgR2FpbmVkOiAke2NoYXJhY3Rlci50b3RhbF9pdGVtX3ZhbHVlX2dhaW5lZH1gXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBDaGFuZ2VkIGhlcmUgYXMgY2xpZW50cyBnaXZlbiBkaXN0IGZpbGUgW3N0YXJ0XVxyXG4gICAgICAgIC8vIHRoaXMuc2V0RWxlbWVudElubmVySFRNTChcImxldmVsX251bWJlcl9kZWF0aHNcIiwgYExldmVsIE51bWJlciBEZWF0aHM6ICR7Y2hhcmFjdGVyLmxldmVsX251bWJlcl9kZWF0aHN9YCk7XHJcbiAgICAgICAgLy8gdGhpcy5zZXRFbGVtZW50SW5uZXJIVE1MKFwibGV2ZWxfZ29sZF9nYWluZWRcIiwgYExldmVsIEdvbGQgR2FpbmVkOiAke2NoYXJhY3Rlci5sZXZlbF9nb2xkX2dhaW5lZH1gKTtcclxuICAgICAgICAvLyB0aGlzLnNldEVsZW1lbnRJbm5lckhUTUwoXCJsZXZlbF9nb2xkX2xvc3RcIiwgYExldmVsIEdvbGQgTG9zdDogJHtjaGFyYWN0ZXIubGV2ZWxfZ29sZF9sb3N0fWApO1xyXG4gICAgICAgIC8vIHRoaXMuc2V0RWxlbWVudElubmVySFRNTChcImxldmVsX2l0ZW1fdmFsdWVfZ2FpbmVkXCIsIGBMZXZlbCBJdGVtIFZhbHVlIEdhaW5lZDogJHtjaGFyYWN0ZXIubGV2ZWxfaXRlbV92YWx1ZV9nYWluZWR9YCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0RHJvcGRvd24oKSB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJjaGFyYWN0ZXItc2VsZWN0LWJveF9fY29udGFpbmVyXCJcclxuICAgICk7XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICBjb25zdCBlbERyb3Bkb3duID0gY3JlYXRlQ3VzdG9tRHJvcERvd24oe1xyXG4gICAgICB2YXJpYWJsZU5hbWU6IFwiY2hhcmFjdGVyXCIsXHJcbiAgICAgIGRyb3BEb3duTGlzdDogY29udmVydENoYXJhY3RlcnNUb0Ryb3Bkb3duRm9ybWF0KHRoaXMuY2hhcmFjdGVycyksXHJcbiAgICB9KTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbERyb3Bkb3duKTtcclxuXHJcbiAgICB0aGlzLmluaXREcm9wRG93bkV2ZW50TGlzdG5lcihcImNoYXJhY3RlclwiKTtcclxuXHJcbiAgICB0aGlzLnNlbGVjdGVkQ2hhcmFjdGVySUQgPVxyXG4gICAgICB0aGlzLmNoYXJhY3RlcnMubGVuZ3RoID4gMCA/IHRoaXMuY2hhcmFjdGVyc1swXS5pZCA6IG51bGw7XHJcbiAgICB0aGlzLnNldENoYXJhY3RlckluZm9QYW5lbCgpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjcmVhdGVDdXN0b21Ecm9wRG93biwgRHJvcERvd25JdGVtSW5mbyB9IGZyb20gJy4uL2NvbXBvbmVudHMvZHJvcGRvd24nO1xyXG5pbXBvcnQgeyBjcmVhdGVUYWxlbnRzVGFibGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3RhbGVudHNUYWJsZSc7XHJcblxyXG5pbXBvcnQgeyB0ZXN0Q2xhc3NMaXN0LCB0ZXN0S2V5TGV2ZWxMaXN0LCB0ZXN0UmFpZEJvc3NMaXN0LCB0ZXN0RHVuZ2Vvbkxpc3QsIHRlc3RSYWlkTGlzdCwgdGVzdFNwZWNzTGlzdCwgdGVzdFRhbGVudHNJbmZvIH0gZnJvbSAnLi4vaW5pdC9pbml0RGF0YSc7XHJcblxyXG5pbXBvcnQgeyBnZXRTcGVjTGlzdCwgZ2V0RHVuZ2Vvbkxpc3QsIGdldFJhaWRMaXN0LCBnZXRSYWlkQm9zc0xpc3QsIGdldFRhbGVudFRhYmxlSW5mbyB9IGZyb20gJy4vYXBpJztcclxuXHJcbmludGVyZmFjZSBTZWFyY2hDb25kaXRpb24ge1xyXG4gIGNsYXNzOiBzdHJpbmcsXHJcbiAgc3BlY3M6IHN0cmluZyxcclxuICBpc19kdW5nZW9uOiBib29sZWFuLFxyXG4gIHJhaWRfZHVuZ2Vvbjogc3RyaW5nLFxyXG4gIGtleV9sZXZlbDogc3RyaW5nLFxyXG4gIHJhaWRfYm9zczogc3RyaW5nLFxyXG4gIGtleV9zdG9uZV9sZXZlbF9taW46IG51bWJlcixcclxuICBrZXlfc3RvbmVfbGV2ZWxfbWF4OiBudW1iZXIsXHJcbiAgYWR2YW5jZWRfZmlsdGVyczogYm9vbGVhbixcclxuICB0cmVlX21vZGU6IGJvb2xlYW5cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhbGVudFBpY2tlciB7XHJcbiAgcHJpdmF0ZSBzZWFyY2hDb25kaXRpb246IFNlYXJjaENvbmRpdGlvbjtcclxuICBwcml2YXRlIGZhbW91c1RhbGVudEluZm86IGFueTtcclxuICBwcml2YXRlIHNlbGVjdGVkVGFsZW50VHJlZUluZGV4OiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWFyY2hDb25kaXRpb24gPSB7XHJcbiAgICAgIGNsYXNzOiAnRGVtb24gSHVudGVyJyxcclxuICAgICAgc3BlY3M6ICdIYXZvYycsXHJcbiAgICAgIGlzX2R1bmdlb246IHRydWUsXHJcbiAgICAgIHJhaWRfZHVuZ2VvbjogJ0Nhc3RsZSBOYXRocmlhJyxcclxuICAgICAga2V5X2xldmVsOiAnTXl0aGljJyxcclxuICAgICAgcmFpZF9ib3NzOiAnU2hyaWVrd2luZycsXHJcbiAgICAgIGtleV9zdG9uZV9sZXZlbF9taW46IDEsXHJcbiAgICAgIGtleV9zdG9uZV9sZXZlbF9tYXg6IDQ1LFxyXG4gICAgICBhZHZhbmNlZF9maWx0ZXJzOiBmYWxzZSxcclxuICAgICAgdHJlZV9tb2RlOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mbyA9IHRlc3RUYWxlbnRzSW5mbztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0Q29tcG9uZW50cygpIHtcclxuICAgIHRoaXMuaW5pdERyb3Bkb3ducygpO1xyXG4gICAgdGhpcy5pbml0S2V5U3RvbmVMZXZlbFJhbmdlKCk7XHJcbiAgICB0aGlzLmluaXRTd2l0Y2goKTtcclxuXHJcbiAgICB0aGlzLmluaXRUYWxlbnRzVGFibGUodGhpcy5mYW1vdXNUYWxlbnRJbmZvLCAwKTtcclxuXHJcbiAgICB0aGlzLmluaXRJblByb2dyZXNzRXZlbnQoKTtcclxuICAgIHRoaXMuaW5pdFRyZWVNb2RlQWN0aW9uUGFuZWxFdmVudCgpO1xyXG5cclxuICAgIC8vIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXREcm9wRG93bkV2ZW50TGlzdG5lcihuYW1lOiBzdHJpbmcpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKG5hbWUpLmZvckVhY2goZWxlbSA9PiB7XHJcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb25bbmFtZV0gPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpLnZhbHVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbG9hZFNwZWNEcm9wZG93bigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ3JhaWRfZHVuZ2VvbicpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlbG9hZFJhaWRCb3NzRHJvcGRvd24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0U2VsZWN0KHRpdGxlOiBzdHJpbmcsIHBhcmVudF9pZDogc3RyaW5nLCBkcm9wZG93bkxpc3Q6IERyb3BEb3duSXRlbUluZm9bXSwgdmFyaWFibGVOYW1lOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudF9pZCk7XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgXHJcbiAgICBjb25zdCBlbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICAgIGVsVGl0bGUuaW5uZXJUZXh0ID0gdGl0bGU7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWxUaXRsZSk7XHJcbiAgXHJcbiAgICBjb25zdCBlbERyb3Bkb3duID0gY3JlYXRlQ3VzdG9tRHJvcERvd24oe1xyXG4gICAgICB2YXJpYWJsZU5hbWU6IHZhcmlhYmxlTmFtZSxcclxuICAgICAgZHJvcERvd25MaXN0OiBkcm9wZG93bkxpc3RcclxuICAgIH0pO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsRHJvcGRvd24pO1xyXG4gIFxyXG4gICAgdGhpcy5pbml0RHJvcERvd25FdmVudExpc3RuZXIodmFyaWFibGVOYW1lKTtcclxuICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uW3ZhcmlhYmxlTmFtZV0gPSBkcm9wZG93bkxpc3RbMF0udGV4dDtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0RHJvcGRvd25zKCkge1xyXG4gICAgdGhpcy5pbml0U2VsZWN0KFwiQ2xhc3NcIiwgXCJjbGFzcy1zZWxlY3QtYm94X19jb250YWluZXJcIiwgdGVzdENsYXNzTGlzdCwgJ2NsYXNzJyk7XHJcbiAgICB0aGlzLmluaXRTZWxlY3QoXCJTcGVjc1wiLCBcInNwZWNzLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiLCB0ZXN0U3BlY3NMaXN0LCAnc3BlY3MnKTtcclxuICAgIHRoaXMuaW5pdFNlbGVjdChcIkR1bmdlb24gTGlzdFwiLCBcInJhaWRfZHVuZ2Vvbi1zZWxlY3QtYm94X19jb250YWluZXJcIiwgdGVzdER1bmdlb25MaXN0LCAncmFpZF9kdW5nZW9uJyk7XHJcbiAgICB0aGlzLmluaXRTZWxlY3QoXCJSYWlkIExldmVsXCIsIFwia2V5X2xldmVsLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiLCB0ZXN0S2V5TGV2ZWxMaXN0LCAna2V5X2xldmVsJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgYXN5bmMgcmVsb2FkU3BlY0Ryb3Bkb3duKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHNwZWNMaXN0ID0gYXdhaXQgZ2V0U3BlY0xpc3QodGhpcy5zZWFyY2hDb25kaXRpb24uY2xhc3MpO1xyXG4gICAgICBzcGVjTGlzdCA9IHNwZWNMaXN0Lmxlbmd0aCA+IDAgPyBzcGVjTGlzdCA6IHRlc3RTcGVjc0xpc3Q7XHJcbiAgICAgIHRoaXMuaW5pdFNlbGVjdChcIlNwZWNzXCIsIFwic3BlY3Mtc2VsZWN0LWJveF9fY29udGFpbmVyXCIsIHNwZWNMaXN0LCAnc3BlY3MnKTtcclxuICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24uc3BlY3MgPSBzcGVjTGlzdFswXS50ZXh0O1xyXG4gIFxyXG4gICAgICBjb25zdCBhbmltUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsZW50LWFuaW0tcGFuZWwnKTtcclxuICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVJbicpO1xyXG4gICAgICBpZiAoIWFuaW1QYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZhZGVPdXQnKSkge1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0Jyk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgYXN5bmMgcmVsb2FkUmFpZER1bmdlb25Ecm9wZG93bigpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGFuaW1QYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxlbnQtYW5pbS1wYW5lbCcpO1xyXG4gICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZUluJyk7XHJcbiAgICAgIGlmICghYW5pbVBhbmVsLmNsYXNzTGlzdC5jb250YWlucygnZmFkZU91dCcpKSB7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXQnKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBsZXQgcmFpZER1bmdlb25MaXN0ID0gW107XHJcbiAgICAgIGlmICh0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uKSB7XHJcbiAgICAgICAgcmFpZER1bmdlb25MaXN0ID0gYXdhaXQgZ2V0RHVuZ2Vvbkxpc3QodGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbiwgdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heCk7XHJcbiAgICAgICAgcmFpZER1bmdlb25MaXN0ID0gcmFpZER1bmdlb25MaXN0Lmxlbmd0aCA+IDAgPyByYWlkRHVuZ2Vvbkxpc3QgOiB0ZXN0RHVuZ2Vvbkxpc3Q7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmFpZER1bmdlb25MaXN0ID0gYXdhaXQgZ2V0UmFpZExpc3QoKTtcclxuICAgICAgICByYWlkRHVuZ2Vvbkxpc3QgPSByYWlkRHVuZ2Vvbkxpc3QubGVuZ3RoID4gMCA/IHJhaWREdW5nZW9uTGlzdCA6IHRlc3RSYWlkTGlzdDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmluaXRTZWxlY3QoXHJcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2VvbiA/IFwiRHVuZ2VvbiBMaXN0XCIgOiBcIlJhaWQgTGlzdFwiLCBcclxuICAgICAgICBcInJhaWRfZHVuZ2Vvbi1zZWxlY3QtYm94X19jb250YWluZXJcIiwgXHJcbiAgICAgICAgcmFpZER1bmdlb25MaXN0LCBcclxuICAgICAgICAncmFpZF9kdW5nZW9uJ1xyXG4gICAgICApO1xyXG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5yYWlkX2R1bmdlb24gPSByYWlkRHVuZ2Vvbkxpc3RbMF0udGV4dDtcclxuICBcclxuICAgICAgaWYgKHRoaXMuc2VhcmNoQ29uZGl0aW9uLmlzX2R1bmdlb24pIHtcclxuICAgICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVsb2FkUmFpZEJvc3NEcm9wZG93bigpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGFzeW5jIHJlbG9hZFJhaWRCb3NzRHJvcGRvd24oKSB7XHJcbiAgICBjb25zdCBhbmltUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsZW50LWFuaW0tcGFuZWwnKTtcclxuICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlSW4nKTtcclxuICAgIGlmICghYW5pbVBhbmVsLmNsYXNzTGlzdC5jb250YWlucygnZmFkZU91dCcpKSB7XHJcbiAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0Jyk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBsZXQgcmFpZEJvc3NMaXN0ID0gYXdhaXQgZ2V0UmFpZEJvc3NMaXN0KHRoaXMuc2VhcmNoQ29uZGl0aW9uLnJhaWRfZHVuZ2Vvbik7XHJcbiAgICByYWlkQm9zc0xpc3QgPSByYWlkQm9zc0xpc3QubGVuZ3RoID4gMCA/IHJhaWRCb3NzTGlzdCA6IHRlc3RSYWlkQm9zc0xpc3Q7XHJcbiAgXHJcbiAgICB0aGlzLmluaXRTZWxlY3QoXCJSYWlkIEJvc3NcIiwgXCJyYWlkX2Jvc3Mtc2VsZWN0LWJveF9fY29udGFpbmVyXCIsICByYWlkQm9zc0xpc3QsICdyYWlkX2Jvc3MnKTtcclxuICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLnJhaWRfYm9zcyA9IHJhaWRCb3NzTGlzdFswXS50ZXh0O1xyXG4gIFxyXG4gICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBhc3luYyBkcmF3VGFsZW50VGFibGUobm9BbmltPzogYm9vbGVhbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgYW5pbVBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGVudC1hbmltLXBhbmVsJyk7XHJcbiAgICAgIGlmICghbm9BbmltICYmICFhbmltUGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdmYWRlT3V0JykpIHtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZU91dCcpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0VGFsZW50VGFibGVJbmZvKHtcclxuICAgICAgICBjbGFzc19uYW1lOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5jbGFzcywgXHJcbiAgICAgICAgc3BlYzogdGhpcy5zZWFyY2hDb25kaXRpb24uc3BlY3MsXHJcbiAgICAgICAgdHlwZTogdGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2VvbiA/ICdkdW5nZW9uJyA6ICdyYWlkJyxcclxuICAgICAgICByYWlkX2R1bmdlb246IHRoaXMuc2VhcmNoQ29uZGl0aW9uLnJhaWRfZHVuZ2VvbiwgXHJcbiAgICAgICAgcmFpZF9ib3NzOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5yYWlkX2Jvc3MsXHJcbiAgICAgICAgcmFpZF9sZXZlbDogdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X2xldmVsLFxyXG4gICAgICAgIGR1bmdlb25fbWluX2xldmVsOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWluLFxyXG4gICAgICAgIGR1bmdlb25fbWF4X2xldmVsOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4LFxyXG4gICAgICAgIHRyZWVfbW9kZTogdGhpcy5zZWFyY2hDb25kaXRpb24udHJlZV9tb2RlID8gJ3RyZWUnIDogJ25vcm1hbCdcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGlmICh0aGlzLnNlYXJjaENvbmRpdGlvbi50cmVlX21vZGUpIHtcclxuICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm8gPSByZXNwb25zZS50YWxlbnRUYWJsZUluZm8ubGVuZ3RoID4gMCA/IHJlc3BvbnNlLnRhbGVudFRhYmxlSW5mbyA6IFt7cGlja19yYXRlOiAwLCB0YWxlbnRfdHJlZTogdGVzdFRhbGVudHNJbmZvfV07XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5pbml0VGFsZW50c1RhYmxlKHRoaXMuZmFtb3VzVGFsZW50SW5mb1swXS50YWxlbnRfdHJlZSwgcmVzcG9uc2UubG9nQ291bnQsIDAsIHRoaXMuZmFtb3VzVGFsZW50SW5mb1swXS5waWNrX3JhdGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mbyA9IHJlc3BvbnNlLnRhbGVudFRhYmxlSW5mby5sZW5ndGggPiAwID8gcmVzcG9uc2UudGFsZW50VGFibGVJbmZvIDogdGVzdFRhbGVudHNJbmZvO1xyXG4gICAgICAgIHRoaXMuaW5pdFRhbGVudHNUYWJsZSh0aGlzLmZhbW91c1RhbGVudEluZm8sIHJlc3BvbnNlLmxvZ0NvdW50KTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBpZiAoIW5vQW5pbSkge1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlT3V0Jyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVJbicpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXRLZXlTdG9uZUxldmVsUmFuZ2UoKSB7XHJcbiAgICBjb25zdCBlbGVtTWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJrZXktc3RvbmUtbGV2ZWwtbWluXCIpO1xyXG4gICAgY29uc3QgZWxlbU1heCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwia2V5LXN0b25lLWxldmVsLW1heFwiKTtcclxuICAgIGNvbnN0IGVsZW1UZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJrZXktc3RvbmUtbGV2ZWwtdGV4dFwiKTtcclxuICBcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5lbGVtTWluKS52YWx1ZSA9IGAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW59YDtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5lbGVtTWF4KS52YWx1ZSA9IGAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXh9YDtcclxuICAgIGVsZW1UZXh0LmlubmVyVGV4dCA9IGAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW59IC0gJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4fWA7XHJcbiAgXHJcbiAgICBlbGVtTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU6bnVtYmVyID0gcGFyc2VJbnQoKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS52YWx1ZSk7XHJcbiAgICAgIGlmICh2YWx1ZSA+PSB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4KSB7XHJcbiAgICAgICAgdmFsdWUgPSB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4IC0gMTtcclxuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpLnZhbHVlID0gYCR7dmFsdWV9YDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWluID0gdmFsdWU7XHJcbiAgICAgIGVsZW1UZXh0LmlubmVyVGV4dCA9IGAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW59IC0gJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4fWA7XHJcbiAgICB9KTtcclxuICBcclxuICAgIGVsZW1NaW4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKGUpID0+IHtcclxuICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgZWxlbU1heC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcclxuICAgICAgbGV0IHZhbHVlOm51bWJlciA9IHBhcnNlSW50KCg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCkudmFsdWUpO1xyXG4gICAgICBpZiAodmFsdWUgPD0gdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbikge1xyXG4gICAgICAgIHZhbHVlID0gdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbiArIDE7XHJcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS52YWx1ZSA9IGAke3ZhbHVlfWA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heCA9IHZhbHVlO1xyXG4gICAgICBlbGVtVGV4dC5pbm5lclRleHQgPSBgJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWlufSAtICR7dGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heH1gO1xyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBlbGVtTWF4LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0VGFsZW50c1RhYmxlKHRhbGVudHNJbmZvLCBsb2dDb3VudDogbnVtYmVyLCB0cmVlX2luZGV4PzogbnVtYmVyLCBwaWNrX3JhdGU/OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGVsVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhbGVudC1wYW5lbC10aXRsZVwiKTtcclxuICAgIGNvbnN0IGVsVHJlZUFjdGlvblBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmVlX21vZGVfYWN0aW9uX3BhbmVsXCIpO1xyXG4gIFxyXG4gICAgaWYgKHRoaXMuc2VhcmNoQ29uZGl0aW9uLnRyZWVfbW9kZSkge1xyXG4gICAgICBpZiAobG9nQ291bnQgPiAwKSB7XHJcbiAgICAgICAgZWxUaXRsZS5pbm5lclRleHQgPSBgTW9zdCBwb3B1bGFyIHRhbGVudCB0cmVlc2A7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxUaXRsZS5pbm5lclRleHQgPSBgV2Ugc3RpbGwgZG9uJ3QgaGF2ZSBhbnkgcnVucyBzY2FubmVkIGZvciB0aGlzYDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBjb25zdCBwaWNrUmF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGlja19yYXRlXCIpO1xyXG4gICAgICBjb25zdCB0cmVlSW5kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyZWVfaW5kZXhcIik7XHJcbiAgXHJcbiAgICAgIGlmICghZWxUcmVlQWN0aW9uUGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIGVsVHJlZUFjdGlvblBhbmVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIHBpY2tSYXRlLmlubmVyVGV4dCA9IGBQaWNrIFJhdGUgOiAke3BpY2tfcmF0ZSA/IHBpY2tfcmF0ZSA6IDB9JWA7XHJcbiAgICAgIHRyZWVJbmRleC5pbm5lclRleHQgPSBgJHsodHJlZV9pbmRleCA/IHRyZWVfaW5kZXggOiAwKSArIDF9IC8gJHt0aGlzLmZhbW91c1RhbGVudEluZm8ubGVuZ3RofWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAobG9nQ291bnQgPiAwKSB7XHJcbiAgICAgICAgZWxUaXRsZS5pbm5lclRleHQgPSBgTW9zdCBwb3B1bGFyIHRhbGVudCB0cmVlcyBmb3IgJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5zcGVjc30gJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5jbGFzc30gaW4gJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5yYWlkX2R1bmdlb259YDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlbFRpdGxlLmlubmVyVGV4dCA9IGBXZSBzdGlsbCBkb24ndCBoYXZlIGFueSBydW5zIHNjYW5uZWQgZm9yIHRoaXNgO1xyXG4gICAgICB9XHJcbiAgICAgIGVsVHJlZUFjdGlvblBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YWxlbnQtdGFibGUtY29udGFpbmVyXCIpO1xyXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgY29uc3QgdGFsZW50c1RhYmxlID0gY3JlYXRlVGFsZW50c1RhYmxlKHsgdGFsZW50TGV2ZWxMaXN0OiB0YWxlbnRzSW5mbyB9LCB0aGlzLnNlYXJjaENvbmRpdGlvbi50cmVlX21vZGUgKTtcclxuICBcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0YWxlbnRzVGFibGUpO1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXRJblByb2dyZXNzRXZlbnQoKSB7XHJcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dvcmstaW4tcHJvZ3Jlc3MnKTtcclxuICAgIGNvbnN0IG1lc3NhZ2VQYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyk7XHJcbiAgXHJcbiAgICBmb3IgKGNvbnN0IGVsIG9mIGVsZW1lbnRzKSB7XHJcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gZWwuZ2V0QXR0cmlidXRlKFwibWVzc2FnZVwiKTtcclxuICAgICAgICBtZXNzYWdlUGFuZWwuaW5uZXJIVE1MID0gYDxkaXY+JHttZXNzYWdlfTwvZGl2PmA7XHJcbiAgICAgICAgbWVzc2FnZVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgICAgICB2b2lkIG1lc3NhZ2VQYW5lbC5vZmZzZXRXaWR0aDtcclxuICAgICAgICBtZXNzYWdlUGFuZWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0VHJlZU1vZGVBY3Rpb25QYW5lbEV2ZW50KCkge1xyXG4gICAgY29uc3QgZWxUcmVlTW9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlX21vZGUnKTtcclxuICBcclxuICAgIGVsVHJlZU1vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcclxuICAgICAgaWYgKCg8SFRNTElucHV0RWxlbWVudD4oZS50YXJnZXQpKS5jaGVja2VkKSB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24udHJlZV9tb2RlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi50cmVlX21vZGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBjb25zdCBlbFByZXZCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl9wcmV2XCIpO1xyXG4gIFxyXG4gICAgZWxQcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgYW5pbVBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGVudC1hbmltLXBhbmVsJyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVJbicpO1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0Jyk7XHJcbiAgXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleC0tO1xyXG4gICAgICAgIHRoaXMuaW5pdFRhbGVudHNUYWJsZShcclxuICAgICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mb1t0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4XS50YWxlbnRfdHJlZSwgXHJcbiAgICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm9bdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleF0ucGlja19yYXRlLCBcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXgsIFxyXG4gICAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvW3RoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXhdLnBpY2tfcmF0ZVxyXG4gICAgICAgICk7XHJcbiAgXHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVPdXQnKTtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZUluJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIFxyXG4gICAgY29uc3QgZWxOZXh0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5fbmV4dFwiKTtcclxuICBcclxuICAgIGVsTmV4dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4IDwgdGhpcy5mYW1vdXNUYWxlbnRJbmZvLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICBjb25zdCBhbmltUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsZW50LWFuaW0tcGFuZWwnKTtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZUluJyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXQnKTtcclxuICBcclxuICAgICAgICB0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4Kys7XHJcbiAgICAgICAgdGhpcy5pbml0VGFsZW50c1RhYmxlKFxyXG4gICAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvW3RoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXhdLnRhbGVudF90cmVlLCBcclxuICAgICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mb1t0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4XS5waWNrX3JhdGUsIFxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleCwgXHJcbiAgICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm9bdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleF0ucGlja19yYXRlXHJcbiAgICAgICAgKTtcclxuICBcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZU91dCcpO1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlSW4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBjb25zdCBlbFJlZnJlc2hCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bl9yZWZyZXNoXCIpO1xyXG4gICAgaWYgKGVsUmVmcmVzaEJ1dHRvbikge1xyXG4gICAgICBlbFJlZnJlc2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBwcml2YXRlIHNldFN3aXRjaFZhbHVlKGlzX2R1bmdlb246IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFpZF9kdW5nZW9uLXN3aXRjaF9fY29udGFpbmVyXCIpO1xyXG4gICAgdGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2VvbiA9IGlzX2R1bmdlb247XHJcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhJywgdGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2VvbiA/ICdkdW5nZW9uJyA6ICdyYWlkJyk7XHJcbiAgICB0aGlzLnJlbG9hZFJhaWREdW5nZW9uRHJvcGRvd24oKTtcclxuICBcclxuICAgIGNvbnN0IHJhbmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2VyX19jb250YWluZXJcIik7XHJcbiAgICBjb25zdCByYWlkTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImtleV9sZXZlbC1zZWxlY3QtYm94X19jb250YWluZXJcIik7XHJcbiAgICBjb25zdCByYWlkQm9zcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFpZF9ib3NzLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiKTtcclxuICBcclxuICAgIHJhbmdlci5zdHlsZS5kaXNwbGF5ID0gaXNfZHVuZ2VvbiA/ICdibG9jaycgOiAnbm9uZSc7XHJcbiAgICByYWlkTGV2ZWwuc3R5bGUuZGlzcGxheSA9IGlzX2R1bmdlb24gPyAnbm9uZScgOiAnYmxvY2snO1xyXG4gICAgcmFpZEJvc3Muc3R5bGUuZGlzcGxheSA9IGlzX2R1bmdlb24gPyAnbm9uZScgOiAnYmxvY2snO1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGluaXRTd2l0Y2goKSB7XHJcbiAgICB0aGlzLnNldFN3aXRjaFZhbHVlKHRydWUpO1xyXG4gIFxyXG4gICAgY29uc3QgZWxTd2l0Y2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhaWRfZHVuZ2Vvbi1zd2l0Y2hcIik7XHJcbiAgICBjb25zdCBlbFN3aXRjaER1bmdlb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN3aXRjaF9kdW5nZW9uXCIpO1xyXG4gICAgY29uc3QgZWxTd2l0Y2hSYWlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzd2l0Y2hfcmFpZFwiKTtcclxuICBcclxuICAgIGVsU3dpdGNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnNldFN3aXRjaFZhbHVlKCF0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uKTtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgZWxTd2l0Y2hEdW5nZW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnNldFN3aXRjaFZhbHVlKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBlbFN3aXRjaFJhaWQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3dpdGNoVmFsdWUoZmFsc2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBPV0hvdGtleXMgfSBmcm9tIFwiQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10c1wiO1xyXG5pbXBvcnQgeyBBcHBXaW5kb3cgfSBmcm9tIFwiLi4vQXBwV2luZG93XCI7XHJcbmltcG9ydCB7IGhvdGtleXMsIHdpbmRvd05hbWVzLCB3b3dDbGFzc0lkIH0gZnJvbSBcIi4uL2NvbnN0c1wiO1xyXG5pbXBvcnQge1xyXG4gIGRlbGV0ZUpvdXJuYWwsXHJcbiAgZGVsZXRlSm91cm5hbENvbnRlbnQsXHJcbiAgZWRpdEpvdXJuYWxDb250ZW50LFxyXG4gIGdldENoYXJhY3RlcnMsXHJcbiAgZ2V0Sm91cm5hbHMsXHJcbiAgZ2V0VG9rZW4sXHJcbiAgc2V0QXV0aFRva2VuLFxyXG4gIHN0b3JlSm91cm5hbENvbnRlbnQsXHJcbiAgc3RvcmVKb3VybmFscyxcclxuICB1cGRhdGVKb3VybmFscyxcclxufSBmcm9tIFwiLi4vdXRpbHMvYXBpXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXJJbmZvIGZyb20gXCIuLi91dGlscy9jaGFyYWN0ZXJJbmZvXCI7XHJcbmltcG9ydCBUYWxlbnRQaWNrZXIgZnJvbSBcIi4uL3V0aWxzL3RhbGVudFBpY2tlclwiO1xyXG5cclxuLy8gVGhlIGRlc2t0b3Agd2luZG93IGlzIHRoZSB3aW5kb3cgZGlzcGxheWVkIHdoaWxlIEZvcnRuaXRlIGlzIG5vdCBydW5uaW5nLlxyXG4vLyBJbiBvdXIgY2FzZSwgb3VyIGRlc2t0b3Agd2luZG93IGhhcyBubyBsb2dpYyAtIGl0IG9ubHkgZGlzcGxheXMgc3RhdGljIGRhdGEuXHJcbi8vIFRoZXJlZm9yZSwgb25seSB0aGUgZ2VuZXJpYyBBcHBXaW5kb3cgY2xhc3MgaXMgY2FsbGVkLlxyXG5cclxuY29uc3QgQ0xJRU5UX0lEID0gXCI3NjZiOGFhYjdmM2Y0NDA2YTVkNDg0NGY1YTBjNmJkN1wiO1xyXG5jb25zdCBBVVRIT1JJWkVfRU5EUE9JTlQgPSBcImh0dHBzOi8vZXUuYmF0dGxlLm5ldC9vYXV0aC9hdXRob3JpemVcIjtcclxuLy8gY29uc3QgcmVkaXJlY3RVcmkgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwL29hdXRoL2NhbGxiYWNrX292ZXJ3b2xmJztcclxuY29uc3QgcmVkaXJlY3RVcmkgPSBcImh0dHBzOi8vd293bWUuZ2cvb2F1dGgvY2FsbGJhY2tfb3ZlcndvbGZcIjtcclxuY29uc3Qgc2NvcGUgPSBbXCJ3b3cucHJvZmlsZVwiLCBcIm9wZW5pZFwiXTtcclxuXHJcbmNvbnN0IGRpc2NvcmRVUkwgPSBcImh0dHBzOi8vZGlzY29yZC5nZy9yeWc5Q3p6cjhaXCI7XHJcblxyXG5jbGFzcyBEZXNrdG9wIGV4dGVuZHMgQXBwV2luZG93IHtcclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IERlc2t0b3A7XHJcbiAgcHJpdmF0ZSBpc0xvZ2dlZEluOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBiYXR0bGVUYWc6IHN0cmluZztcclxuICBwcml2YXRlIGJhdHRsZUlkOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBiYXR0bGVDcmVkOiB7fTtcclxuICBwcml2YXRlIGNoYXJhY3RlcnM6IFtdO1xyXG4gIHByaXZhdGUgcmVnaW9uOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBjaGFyYWN0ZXJJbmZvOiBDaGFyYWN0ZXJJbmZvO1xyXG4gIHByaXZhdGUgdGFsZW50UGlja2VyOiBUYWxlbnRQaWNrZXI7XHJcblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcih3aW5kb3dOYW1lcy5kZXNrdG9wKTtcclxuXHJcbiAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XHJcbiAgICBjb25zdCBleHBpcmVzSW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImV4cGlyZXNJblwiKTtcclxuXHJcbiAgICBpZiAodG9rZW4gJiYgcGFyc2VJbnQoZXhwaXJlc0luKSA+IERhdGUubm93KCkpIHtcclxuICAgICAgdGhpcy5iYXR0bGVUYWcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJhdHRsZVRhZ1wiKTtcclxuICAgICAgdGhpcy5iYXR0bGVJZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYmF0dGxlSWRcIik7XHJcbiAgICAgIHRoaXMucmVnaW9uID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJyZWdpb25cIik7XHJcblxyXG4gICAgICBzZXRBdXRoVG9rZW4odG9rZW4pO1xyXG4gICAgICB0aGlzLmdldFVzZXJDaGFyYWN0ZXJJbmZvKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInRva2VuXCIpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImV4cGlyZXNJblwiKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJiYXR0bGVUYWdcIik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYmF0dGxlSWRcIik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwicmVnaW9uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdEJ1dHRvbkV2ZW50cygpO1xyXG4gICAgb3ZlcndvbGYuZXh0ZW5zaW9ucy5vbkFwcExhdW5jaFRyaWdnZXJlZC5hZGRMaXN0ZW5lcih0aGlzLmNhbGxiYWNrT0F1dGgpO1xyXG5cclxuICAgIHRoaXMudGFsZW50UGlja2VyID0gbmV3IFRhbGVudFBpY2tlcigpO1xyXG4gICAgdGhpcy50YWxlbnRQaWNrZXIuaW5pdENvbXBvbmVudHMoKTtcclxuICAgIHRoaXMuaW5pdFNldHRpbmdzUGFuZWwoKTtcclxuICAgIHRoaXMuZ2V0VXNlckpvdXJuYWxzKCk7XHJcbiAgICB0aGlzLnN0b3JlVXNlckpvdXJuYWxzKCk7XHJcbiAgICB0aGlzLnVwZGF0ZVVzZXJKb3VybmFscygpO1xyXG4gICAgdGhpcy5zdG9yZVVzZXJKb3VybmFsQ29udGVudCgpO1xyXG4gICAgdGhpcy51cGRhdGVVc2VySm91cm5hbENvbnRlbnQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRCYXR0bGVUYWcoYmF0dGxlVGFnKSB7XHJcbiAgICB0aGlzLmJhdHRsZVRhZyA9IGJhdHRsZVRhZztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRCYXR0bGVJZChiYXR0bGVJZCkge1xyXG4gICAgdGhpcy5iYXR0bGVJZCA9IGJhdHRsZUlkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldEJhdHRsZUNyZWQoYmF0dGxlQ3JlZCkge1xyXG4gICAgdGhpcy5iYXR0bGVDcmVkID0gYmF0dGxlQ3JlZDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRDaGFyYWN0ZXJzKGNoYXJhY3RlcnMpIHtcclxuICAgIHRoaXMuY2hhcmFjdGVycyA9IGNoYXJhY3RlcnM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0UmVnaW9uKHJlZ2lvbikge1xyXG4gICAgdGhpcy5yZWdpb24gPSByZWdpb247XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRCdXR0b25FdmVudHMoKSB7XHJcbiAgICAvLyBMb2dpblxyXG4gICAgY29uc3QgbG9naW5CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1sb2dpblwiKTtcclxuICAgIGxvZ2luQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBzY29wZXNTdHJpbmcgPSBlbmNvZGVVUklDb21wb25lbnQoc2NvcGUuam9pbihcIiBcIikpO1xyXG4gICAgICBjb25zdCByZWRpcmVjdFVyaVN0cmluZyA9IGVuY29kZVVSSUNvbXBvbmVudChyZWRpcmVjdFVyaSk7XHJcbiAgICAgIGNvbnN0IGF1dGhvcml6ZVVybCA9IGAke0FVVEhPUklaRV9FTkRQT0lOVH0/Y2xpZW50X2lkPSR7Q0xJRU5UX0lEfSZzY29wZT0ke3Njb3Blc1N0cmluZ30mcmVkaXJlY3RfdXJpPSR7cmVkaXJlY3RVcmlTdHJpbmd9JnJlc3BvbnNlX3R5cGU9Y29kZWA7XHJcbiAgICAgIG92ZXJ3b2xmLnV0aWxzLm9wZW5VcmxJbkRlZmF1bHRCcm93c2VyKGF1dGhvcml6ZVVybCk7XHJcbiAgICB9KTtcclxuICAgIC8vIENoYW5nZWQgaGVyZSBhcyBjbGllbnRzIGdpdmVuIGRpc3QgZmlsZSBbc3RhcnRdXHJcbiAgICBjb25zdCBsb2dpbkJ1dHRvbjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1wZXJzb25hbC1qb3VybmFsXCIpO1xyXG4gICAgbG9naW5CdXR0b24yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBzY29wZXNTdHJpbmcgPSBlbmNvZGVVUklDb21wb25lbnQoc2NvcGUuam9pbihcIiBcIikpO1xyXG4gICAgICBjb25zdCByZWRpcmVjdFVyaVN0cmluZyA9IGVuY29kZVVSSUNvbXBvbmVudChyZWRpcmVjdFVyaSk7XHJcbiAgICAgIGNvbnN0IGF1dGhvcml6ZVVybCA9IGAke0FVVEhPUklaRV9FTkRQT0lOVH0/Y2xpZW50X2lkPSR7Q0xJRU5UX0lEfSZzY29wZT0ke3Njb3Blc1N0cmluZ30mcmVkaXJlY3RfdXJpPSR7cmVkaXJlY3RVcmlTdHJpbmd9JnJlc3BvbnNlX3R5cGU9Y29kZWA7XHJcbiAgICAgIG92ZXJ3b2xmLnV0aWxzLm9wZW5VcmxJbkRlZmF1bHRCcm93c2VyKGF1dGhvcml6ZVVybCk7XHJcbiAgICB9KTtcclxuICAgIC8vIENoYW5nZWQgaGVyZSBhcyBjbGllbnRzIGdpdmVuIGRpc3QgZmlsZSBbZW5kXVxyXG5cclxuICAgIC8vIE1haW4gTWVudVxyXG4gICAgY29uc3QgbWVudUl0ZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1lbnUtaXRlbVwiKTtcclxuICAgIEFycmF5LmZyb20obWVudUl0ZW1zKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaW4tcHJvZ3Jlc3NcIikpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW0uaWQgPT09IFwiYnRuLWxvZ291dFwiKSB7XHJcbiAgICAgICAgICB0aGlzLmlzTG9nZ2VkSW4gPSBmYWxzZTtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZXhwaXJlc0luXCIpO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJiYXR0bGVUYWdcIik7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImJhdHRsZUlkXCIpO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ0b2tlblwiKTtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwicmVnaW9uXCIpO1xyXG5cclxuICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImVuYWJsZWRcIik7XHJcblxyXG4gICAgICAgICAgdGhpcy5kcmF3VXNlckluZm8oKTtcclxuICAgICAgICAgIHRoaXMuZHJhd1N1YlBhbmVsKCk7XHJcbiAgICAgICAgICB0aGlzLmNsZWFySm91cm5hbFVJKCk7XHJcbiAgICAgICAgICAvLyB0aGlzLmdldFVzZXJKb3VybmFscygpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHBqQnRuTG9naW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgXCJidG4tcGVyc29uYWwtam91cm5hbC1vbkxvZ2dlZGluXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBwakJ0bkxvZ2luLmNsYXNzTGlzdC5yZW1vdmUoXCJlbmFibGVkXCIpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHBqQnRuTG9nb3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tcGVyc29uYWwtam91cm5hbFwiKTtcclxuICAgICAgICAgIHBqQnRuTG9nb3V0LmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBob21lQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbWFpblwiKTtcclxuICAgICAgICAgIGhvbWVCdXR0b24uY2xpY2soKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFycmF5LmZyb20obWVudUl0ZW1zKS5mb3JFYWNoKChlbGVtMSkgPT4ge1xyXG4gICAgICAgICAgZWxlbTEuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGVsTWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblwiKTtcclxuICAgICAgICBlbE1haW4uY2xhc3NOYW1lID0gZWxlbS5nZXRBdHRyaWJ1dGUoXCJwYWdlLXR5cGVcIik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQ2hhbmdlZCBoZXJlIGFzIGNsaWVudHMgZ2l2ZW4gZGlzdCBmaWxlIFtzdGFydF1cclxuICAgIGNvbnN0IG9ubGluZXN0YXR1cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJvbmxpbmUtc3RhdHVzXCIpO1xyXG4gICAgQXJyYXkuZnJvbShvbmxpbmVzdGF0dXMpLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICBpZiAoZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJpbi1wcm9ncmVzc1wiKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbS5pZCA9PT0gXCJ0b3AtbG9nb3V0LWJ1dHRvblwiKSB7XHJcbiAgICAgICAgICB0aGlzLmlzTG9nZ2VkSW4gPSBmYWxzZTtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZXhwaXJlc0luXCIpO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJiYXR0bGVUYWdcIik7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImJhdHRsZUlkXCIpO1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ0b2tlblwiKTtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwicmVnaW9uXCIpO1xyXG4gICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiZW5hYmxlZFwiKTtcclxuICAgICAgICAgIHRoaXMuZHJhd1VzZXJJbmZvKCk7XHJcbiAgICAgICAgICB0aGlzLmRyYXdTdWJQYW5lbCgpO1xyXG4gICAgICAgICAgdGhpcy5jbGVhckpvdXJuYWxVSSgpO1xyXG4gICAgICAgICAgY29uc3QgcGpCdG5Mb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICBcImJ0bi1wZXJzb25hbC1qb3VybmFsLW9uTG9nZ2VkaW5cIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHBqQnRuTG9naW4uY2xhc3NMaXN0LnJlbW92ZShcImVuYWJsZWRcIik7XHJcbiAgICAgICAgICBjb25zdCBwakJ0bkxvZ291dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLXBlcnNvbmFsLWpvdXJuYWxcIik7XHJcbiAgICAgICAgICBwakJ0bkxvZ291dC5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICBjb25zdCBob21lQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbWFpblwiKTtcclxuICAgICAgICAgIGNvbnN0IHBqQnRuTG9nb3V0MiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLWxvZ291dFwiKTtcclxuICAgICAgICAgIHBqQnRuTG9nb3V0Mi5jbGFzc0xpc3QucmVtb3ZlKFwiZW5hYmxlZFwiKTtcclxuICAgICAgICAgIGhvbWVCdXR0b24uY2xpY2soKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgQXJyYXkuZnJvbShvbmxpbmVzdGF0dXMpLmZvckVhY2goKGVsZW0xKSA9PiB7XHJcbiAgICAgICAgICBlbGVtMS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgICAgICBjb25zdCBlbE1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIik7XHJcbiAgICAgICAgZWxNYWluLmNsYXNzTmFtZSA9IGVsZW0uZ2V0QXR0cmlidXRlKFwicGFnZS10eXBlXCIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgLy8gQ2hhbmdlZCBoZXJlIGFzIGNsaWVudHMgZ2l2ZW4gZGlzdCBmaWxlIFtlbmRdXHJcblxyXG4gICAgLy8gRGlzY29yZFxyXG4gICAgY29uc3QgZGlzY29yZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlzY29yZEJ1dHRvblwiKTtcclxuICAgIGRpc2NvcmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgIG92ZXJ3b2xmLnV0aWxzLm9wZW5VcmxJbkRlZmF1bHRCcm93c2VyKGRpc2NvcmRVUkwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHNldEN1cnJlbnRIb3RrZXlUb0lucHV0KCkge1xyXG4gICAgY29uc3QgZWxJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG90a2V5LWVkaXRvclwiKTtcclxuICAgIGNvbnN0IGhvdGtleVRleHQgPSBhd2FpdCBPV0hvdGtleXMuZ2V0SG90a2V5VGV4dChcclxuICAgICAgaG90a2V5cy50b2dnbGUsXHJcbiAgICAgIHdvd0NsYXNzSWRcclxuICAgICk7XHJcbiAgICBlbElucHV0LmlubmVyVGV4dCA9IGhvdGtleVRleHQ7XHJcbiAgICByZXR1cm4gaG90a2V5VGV4dDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdEhvdGtleUlucHV0KCkge1xyXG4gICAgdGhpcy5zZXRDdXJyZW50SG90a2V5VG9JbnB1dCgpO1xyXG5cclxuICAgIGNvbnN0IGVsSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvdGtleS1lZGl0b3JcIik7XHJcbiAgICBjb25zdCBlbENsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3RrZXktY2xvc2VcIik7XHJcblxyXG4gICAgbGV0IGtleXMgPSBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl07XHJcblxyXG4gICAgZWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKGUpID0+IHtcclxuICAgICAgZWxJbnB1dC5pbm5lclRleHQgPSBcIkNob29zZSBLZXlcIjtcclxuICAgICAga2V5cyA9IFtcIlwiLCBcIlwiLCBcIlwiLCBcIlwiXTtcclxuICAgIH0pO1xyXG5cclxuICAgIGVsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3Vzb3V0XCIsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMuc2V0Q3VycmVudEhvdGtleVRvSW5wdXQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGVsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJrZXlkb3duXCIsIGUua2V5LCBlLm1ldGFLZXksIGUuc2hpZnRLZXksIGUuYWx0S2V5LCBlLmN0cmxLZXkpO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmIChlLmtleSA9PT0gXCJTaGlmdFwiKSB7XHJcbiAgICAgICAga2V5c1syXSA9IFwiU2hpZnQrXCI7XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IFwiQWx0XCIpIHtcclxuICAgICAgICBrZXlzWzBdID0gXCJBbHQrXCI7XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IFwiQ29udHJvbFwiKSB7XHJcbiAgICAgICAga2V5c1sxXSA9IFwiQ3RybCtcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBrZXlzWzNdID0gZS5rZXk7XHJcbiAgICAgICAgY29uc3QgbmV3SG90a2V5ID0ge1xyXG4gICAgICAgICAgbmFtZTogaG90a2V5cy50b2dnbGUsXHJcbiAgICAgICAgICBnYW1lSWQ6IDc2NSxcclxuICAgICAgICAgIHZpcnR1YWxLZXk6IGUua2V5Q29kZSxcclxuICAgICAgICAgIG1vZGlmaWVyczoge1xyXG4gICAgICAgICAgICBjdHJsOiBlLmN0cmxLZXksXHJcbiAgICAgICAgICAgIHNoaWZ0OiBlLnNoaWZ0S2V5LFxyXG4gICAgICAgICAgICBhbHQ6IGUuYWx0S2V5LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGVsQ2xvc2UuZm9jdXMoKTtcclxuICAgICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLmFzc2lnbihuZXdIb3RrZXksIChlKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImFzc2lnbjogXCIsIG5ld0hvdGtleSwgZSk7XHJcbiAgICAgICAgICB0aGlzLnNldEN1cnJlbnRIb3RrZXlUb0lucHV0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxJbnB1dC5pbm5lclRleHQgPSBrZXlzLmpvaW4oXCJcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBlbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwia2V5dXBcIiwgZS5rZXksIGUubWV0YUtleSwgZS5zaGlmdEtleSwgZS5hbHRLZXksIGUuY3RybEtleSk7XHJcbiAgICAgIGlmIChlLmtleSA9PT0gXCJTaGlmdFwiKSB7XHJcbiAgICAgICAga2V5c1syXSA9IFwiXCI7XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IFwiQWx0XCIpIHtcclxuICAgICAgICBrZXlzWzBdID0gXCJcIjtcclxuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJDb250cm9sXCIpIHtcclxuICAgICAgICBrZXlzWzFdID0gXCJcIjtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBzdHJIb3RrZXkgPSBrZXlzLmpvaW4oXCJcIik7XHJcbiAgICAgIGVsSW5wdXQuaW5uZXJUZXh0ID0gc3RySG90a2V5ID09PSBcIlwiID8gXCJDaG9vc2UgS2V5XCIgOiBzdHJIb3RrZXk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBlbENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBob3RrZXkgPSB7XHJcbiAgICAgICAgbmFtZTogaG90a2V5cy50b2dnbGUsXHJcbiAgICAgICAgZ2FtZUlkOiA3NjUsXHJcbiAgICAgIH07XHJcbiAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMudW5hc3NpZ24oaG90a2V5LCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudEhvdGtleVRvSW5wdXQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdFNldHRpbmdzUGFuZWwoKSB7XHJcbiAgICB0aGlzLmluaXRIb3RrZXlJbnB1dCgpO1xyXG5cclxuICAgIGNvbnN0IGJ0bkNvcHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1jb3B5LXNvY2lhbC11cmxcIik7XHJcbiAgICBidG5Db3B5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBlbFNvY2lhbFVybCA9IDxIVE1MSW5wdXRFbGVtZW50PihcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXNvY2lhbC11cmxcIilcclxuICAgICAgKTtcclxuICAgICAgZWxTb2NpYWxVcmwuZm9jdXMoKTtcclxuICAgICAgZWxTb2NpYWxVcmwuc2VsZWN0KCk7XHJcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiY29weVwiKTtcclxuICAgICAgZWxTb2NpYWxVcmwuc2VsZWN0aW9uU3RhcnQgPSAwO1xyXG4gICAgICBlbFNvY2lhbFVybC5zZWxlY3Rpb25FbmQgPSAwO1xyXG4gICAgICBidG5Db3B5LmZvY3VzKCk7XHJcbiAgICAgIGJ0bkNvcHkuY2xhc3NMaXN0LnJlbW92ZShcImNvcGllZFwiKTtcclxuICAgICAgdm9pZCBidG5Db3B5Lm9mZnNldFdpZHRoO1xyXG4gICAgICBidG5Db3B5LmNsYXNzTGlzdC5hZGQoXCJjb3BpZWRcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBlbFN3aXRjaEdhbWVTdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImF1dG8tbGF1bmNoLXdoZW4tZ2FtZS1zdGFydHNcIlxyXG4gICAgKTtcclxuICAgIGxldCBzd2l0Y2hWYWx1ZUdhbWVTdGFydCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFxyXG4gICAgICBcImF1dG8tbGF1bmNoLXdoZW4tZ2FtZS1zdGFydHNcIlxyXG4gICAgKTtcclxuICAgIGlmIChzd2l0Y2hWYWx1ZUdhbWVTdGFydCAhPT0gXCJmYWxzZVwiKSB7XHJcbiAgICAgIHN3aXRjaFZhbHVlR2FtZVN0YXJ0ID0gXCJ0cnVlXCI7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxyXG4gICAgICAgIFwiYXV0by1sYXVuY2gtd2hlbi1nYW1lLXN0YXJ0c1wiLFxyXG4gICAgICAgIHN3aXRjaFZhbHVlR2FtZVN0YXJ0XHJcbiAgICAgICk7XHJcbiAgICAgIGVsU3dpdGNoR2FtZVN0YXJ0LnNldEF0dHJpYnV0ZShcImRhdGFcIiwgXCJZZXNcIik7XHJcbiAgICB9XHJcbiAgICBlbFN3aXRjaEdhbWVTdGFydC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgc3dpdGNoVmFsdWVHYW1lU3RhcnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcclxuICAgICAgICBcImF1dG8tbGF1bmNoLXdoZW4tZ2FtZS1zdGFydHNcIlxyXG4gICAgICApO1xyXG4gICAgICBpZiAoc3dpdGNoVmFsdWVHYW1lU3RhcnQgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgc3dpdGNoVmFsdWVHYW1lU3RhcnQgPSBcImZhbHNlXCI7XHJcbiAgICAgICAgZWxTd2l0Y2hHYW1lU3RhcnQuc2V0QXR0cmlidXRlKFwiZGF0YVwiLCBcIlwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2l0Y2hWYWx1ZUdhbWVTdGFydCA9IFwidHJ1ZVwiO1xyXG4gICAgICAgIGVsU3dpdGNoR2FtZVN0YXJ0LnNldEF0dHJpYnV0ZShcImRhdGFcIiwgXCJZZXNcIik7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXHJcbiAgICAgICAgXCJhdXRvLWxhdW5jaC13aGVuLWdhbWUtc3RhcnRzXCIsXHJcbiAgICAgICAgc3dpdGNoVmFsdWVHYW1lU3RhcnRcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGVsU3dpdGNoR2FtZUVuZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvdy1hcHAtd2hlbi1nYW1lLWVuZHNcIik7XHJcbiAgICBsZXQgc3dpdGNoVmFsdWVHYW1lRW5kID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaG93LWFwcC13aGVuLWdhbWUtZW5kc1wiKTtcclxuICAgIGlmIChzd2l0Y2hWYWx1ZUdhbWVFbmQgIT09IFwiZmFsc2VcIikge1xyXG4gICAgICBzd2l0Y2hWYWx1ZUdhbWVFbmQgPSBcInRydWVcIjtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaG93LWFwcC13aGVuLWdhbWUtZW5kc1wiLCBzd2l0Y2hWYWx1ZUdhbWVFbmQpO1xyXG4gICAgICBlbFN3aXRjaEdhbWVFbmQuc2V0QXR0cmlidXRlKFwiZGF0YVwiLCBcIlllc1wiKTtcclxuICAgIH1cclxuICAgIGVsU3dpdGNoR2FtZUVuZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgc3dpdGNoVmFsdWVHYW1lRW5kID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzaG93LWFwcC13aGVuLWdhbWUtZW5kc1wiKTtcclxuICAgICAgaWYgKHN3aXRjaFZhbHVlR2FtZUVuZCA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICBzd2l0Y2hWYWx1ZUdhbWVFbmQgPSBcImZhbHNlXCI7XHJcbiAgICAgICAgZWxTd2l0Y2hHYW1lRW5kLnNldEF0dHJpYnV0ZShcImRhdGFcIiwgXCJcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoVmFsdWVHYW1lRW5kID0gXCJ0cnVlXCI7XHJcbiAgICAgICAgZWxTd2l0Y2hHYW1lRW5kLnNldEF0dHJpYnV0ZShcImRhdGFcIiwgXCJZZXNcIik7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzaG93LWFwcC13aGVuLWdhbWUtZW5kc1wiLCBzd2l0Y2hWYWx1ZUdhbWVFbmQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGNhbGxiYWNrT0F1dGgodXJsc2NoZW1lKSB7XHJcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLW92ZXJsYXlcIik7XHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChkZWNvZGVVUklDb21wb25lbnQodXJsc2NoZW1lLnBhcmFtZXRlcikpO1xyXG4gICAgY29uc3QgY29kZSA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwiY29kZVwiKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldFRva2VuKHsgY29kZSwgaXNPdmVyd29sZjogdHJ1ZSB9KTtcclxuICAgICAgY29uc3QgdG9rZW4gPSB1c2VySW5mby50b2tlbjtcclxuICAgICAgY29uc3QgZXhwaXJlc0luID0gRGF0ZS5ub3coKSArIHVzZXJJbmZvLmV4cGlyZXNJbiAqIDEwMDA7XHJcblxyXG4gICAgICBjb25zdCBkZXNrdG9wID0gRGVza3RvcC5pbnN0YW5jZSgpO1xyXG5cclxuICAgICAgZGVza3RvcC5zZXRCYXR0bGVUYWcodXNlckluZm8uYmF0dGxlVGFnKTtcclxuICAgICAgZGVza3RvcC5zZXRCYXR0bGVJZCh1c2VySW5mby5iYXR0bGVJZCk7XHJcbiAgICAgIGRlc2t0b3Auc2V0QmF0dGxlQ3JlZCh1c2VySW5mby5iYXR0bGVDcmVkKTtcclxuICAgICAgZGVza3RvcC5zZXRDaGFyYWN0ZXJzKHVzZXJJbmZvLmNoYXJhY3RlcnMpO1xyXG4gICAgICBkZXNrdG9wLnNldFJlZ2lvbih1c2VySW5mby5yZWdpb24pO1xyXG5cclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCB0b2tlbik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZXhwaXJlc0luXCIsIGV4cGlyZXNJbi50b1N0cmluZygpKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJiYXR0bGVUYWdcIiwgdXNlckluZm8uYmF0dGxlVGFnKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJiYXR0bGVJZFwiLCB1c2VySW5mby5iYXR0bGVJZCk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYmF0dGxlQ3JlZFwiLCB1c2VySW5mby5iYXR0bGVDcmVkKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyZWdpb25cIiwgdXNlckluZm8ucmVnaW9uKTtcclxuXHJcbiAgICAgIGRlc2t0b3Aub25Mb2dnZWRJbigpO1xyXG4gICAgICBkZXNrdG9wLmdldFVzZXJKb3VybmFscygpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH1cclxuXHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGdldFVzZXJDaGFyYWN0ZXJJbmZvKCkge1xyXG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZy1vdmVybGF5XCIpO1xyXG4gICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZ2V0Q2hhcmFjdGVycygpO1xyXG5cclxuICAgIHRoaXMucmVnaW9uID0gcmVzcG9uc2UucmVnaW9uO1xyXG4gICAgdGhpcy5jaGFyYWN0ZXJzID0gcmVzcG9uc2UuY2hhcmFjdGVycztcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY2hhcmFjdGVycyk7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInJlZ2lvblwiLCB0aGlzLnJlZ2lvbik7XHJcbiAgICB0aGlzLm9uTG9nZ2VkSW4oKTtcclxuXHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGdldFVzZXJKb3VybmFscygpIHtcclxuICAgIGxldCByZXNwb25zZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYmF0dGxlSWRcIilcclxuICAgICAgPyBhd2FpdCBnZXRKb3VybmFscyh0aGlzLmJhdHRsZUlkLnRvU3RyaW5nKCkpXHJcbiAgICAgIDogbnVsbDtcclxuICAgIGNvbnN0IGpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsLXRhYnNcIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXNwb25zZT8uZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImxvb3Agc3RhcnRlZFwiLCBpKTtcclxuICAgICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgYnRuLmlubmVySFRNTCA9IHJlc3BvbnNlLmRhdGFbaV0ubmFtZTtcclxuICAgICAgYnRuLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgcmVzcG9uc2UuZGF0YVtpXS5faWQpO1xyXG4gICAgICBidG4uY2xhc3NMaXN0LmFkZChcInRhYi1saW5rXCIpO1xyXG4gICAgICBsZXQgZGVsZXRlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBkZWxldGVTcGFuLmNsYXNzTGlzdC5hZGQoXCJtYXRlcmlhbC1pY29uc1wiKTtcclxuICAgICAgZGVsZXRlU3Bhbi5jbGFzc0xpc3QuYWRkKFwidGV4dFNwYW4yXCIpO1xyXG4gICAgICBkZWxldGVTcGFuLmlubmVySFRNTCA9IFwiZGVsZXRlXCI7XHJcbiAgICAgIGpvdXJuYWxMaXN0LmFwcGVuZENoaWxkKGJ0bik7XHJcbiAgICAgIGJ0bi5hcHBlbmRDaGlsZChkZWxldGVTcGFuKTtcclxuXHJcbiAgICAgIHZhciBlZGl0Sm91cm5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBlZGl0Sm91cm5lbC5jbGFzc0xpc3QuYWRkKFwibWF0ZXJpYWwtaWNvbnNcIik7XHJcbiAgICAgIGVkaXRKb3VybmVsLmNsYXNzTGlzdC5hZGQoXCJlZGl0U3BhbjJcIik7XHJcbiAgICAgIGVkaXRKb3VybmVsLmlubmVySFRNTCA9IFwiZWRpdFwiO1xyXG4gICAgICBidG4uYXBwZW5kQ2hpbGQoZWRpdEpvdXJuZWwpO1xyXG5cclxuICAgICAgZWRpdEpvdXJuZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC1qb3VybmVsXCIpO1xyXG4gICAgICAgIGlmIChlbGVtcyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgZWxlbXMuY2xhc3NMaXN0LnJlbW92ZShcImVkaXQtam91cm5lbFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImVkaXQtam91cm5lbFwiKTtcclxuICAgICAgICBjb25zdCBlZGl0TW9kYWxPcGVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUJ0bkVkaXRcIik7XHJcbiAgICAgICAgZWRpdE1vZGFsT3BlbkJ1dHRvbi5jbGljaygpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xpY2tlZFwiLCByZXNwb25zZS5kYXRhW2ldLm5hbWUpO1xyXG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXQyXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID1cclxuICAgICAgICAgIHJlc3BvbnNlLmRhdGFbaV0ubmFtZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9iamVjdFwiLCByZXNwb25zZS5kYXRhW2ldKTtcclxuICAgICAgICBjb25zdCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWNjZXB0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgY2IudmFsdWUgPSByZXNwb25zZS5kYXRhW2ldLnRlbXBsYXRlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlbGV0ZVNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBkZWxldGVKb3VybmFsKHJlc3BvbnNlLmRhdGFbaV0uX2lkKTtcclxuICAgICAgICB0aGlzLmNsZWFySm91cm5hbFVJKCk7XHJcbiAgICAgICAgLy8gY29uc3Qgb2xkSm91cm5hbExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnam91cm5hbC10YWJzJyk7XHJcbiAgICAgICAgLy8gb2xkSm91cm5hbExpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgcmVzcG9uc2UuZGF0YSA9IFtdO1xyXG4gICAgICAgIHRoaXMuZ2V0VXNlckpvdXJuYWxzKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgIFwiam91cm5hbC1pdGVtLWNvbnRhaW5lclwiXHJcbiAgICAgICAgKTtcclxuICAgICAgICBqb3VybmFsQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XHJcbiAgICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdGFiXCIpO1xyXG4gICAgICAgIGlmIChlbGVtcyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgZWxlbXMuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZS10YWJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlLXRhYlwiKTtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZEpvdXJuYWwgPSByZXNwb25zZS5kYXRhW2ldO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2UgZGF0YVwiLCByZXNwb25zZS5kYXRhKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhpLCBzZWxlY3RlZEpvdXJuYWwpO1xyXG5cclxuICAgICAgICAvLyBNYWtpbmcgYWRkIG5ldyBjb250YW50IGJ1dHRvbiBhY3RpdmVcclxuICAgICAgICBjb25zdCBhZGRDb250ZW50QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGRDb250ZW50QnV0dG9uXCIpO1xyXG4gICAgICAgIGFkZENvbnRlbnRCdXR0b24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgY29uc3Qgam91cm5hbENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgXCJqb3VybmFsLWl0ZW0tY29udGFpbmVyXCJcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBqb3VybmFsQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgc2VsZWN0ZWRKb3VybmFsLmRhdGEuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgY29uc3Qgam91cm5hbEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgam91cm5hbEl0ZW0uc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBlbGVtZW50Ll9pZCk7XHJcbiAgICAgICAgICBqb3VybmFsSXRlbS5jbGFzc0xpc3QuYWRkKFwiam91cm5hbC1pdGVtXCIpO1xyXG4gICAgICAgICAgY29uc3Qgam91cm5hbEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICBqb3VybmFsQnRuLmlubmVySFRNTCA9IGVsZW1lbnQudGl0bGU7XHJcbiAgICAgICAgICB2YXIgdGV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICAgIHRleHRTcGFuLmNsYXNzTGlzdC5hZGQoXCJtYXRlcmlhbC1pY29uc1wiKTtcclxuICAgICAgICAgIHRleHRTcGFuLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0U3BhblwiKTtcclxuICAgICAgICAgIHRleHRTcGFuLmlubmVySFRNTCA9IFwiZGVsZXRlXCI7XHJcbiAgICAgICAgICBqb3VybmFsQnRuLmFwcGVuZENoaWxkKHRleHRTcGFuKTtcclxuICAgICAgICAgIGNvbnN0IGpvdXJuYWxEZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcblxyXG4gICAgICAgICAgdmFyIGVkaXRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICBlZGl0U3Bhbi5jbGFzc0xpc3QuYWRkKFwibWF0ZXJpYWwtaWNvbnNcIik7XHJcbiAgICAgICAgICBlZGl0U3Bhbi5jbGFzc0xpc3QuYWRkKFwiZWRpdFNwYW5cIik7XHJcbiAgICAgICAgICBlZGl0U3Bhbi5pbm5lckhUTUwgPSBcImVkaXRcIjtcclxuICAgICAgICAgIGpvdXJuYWxCdG4uYXBwZW5kQ2hpbGQoZWRpdFNwYW4pO1xyXG5cclxuICAgICAgICAgIGpvdXJuYWxCdG4uY2xhc3NMaXN0LmFkZChcImFjY29yZGlvblwiKTtcclxuICAgICAgICAgIGlmIChqb3VybmFsRGVzYy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHtcclxuICAgICAgICAgICAgam91cm5hbERlc2MuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgam91cm5hbERlc2MuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGpvdXJuYWxEZXNjLmlubmVySFRNTCA9IGVsZW1lbnQuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgIGpvdXJuYWxEZXNjLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgam91cm5hbEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoam91cm5hbERlc2MuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSB7XHJcbiAgICAgICAgICAgICAgam91cm5hbERlc2MuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICBqb3VybmFsRGVzYy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGpvdXJuYWxEZXNjLmlubmVySFRNTCA9IGVsZW1lbnQuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgam91cm5hbERlc2MuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZWRpdFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLWNvbnRlbnRcIik7XHJcbiAgICAgICAgICAgIGlmIChlbGVtcyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIGVsZW1zLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtY29udGVudFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmUtY29udGVudFwiKTtcclxuICAgICAgICAgICAgY29uc3QgbW9kYWxPcGVuQnV0dG9uID1cclxuICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRDb250ZW50QnV0dG9uXCIpO1xyXG4gICAgICAgICAgICBtb2RhbE9wZW5CdXR0b24uY2xpY2soKTtcclxuICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdENvbnRlbnRUaXRsZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbiAgICAgICAgICAgICkudmFsdWUgPSBlbGVtZW50LnRpdGxlO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRFZGl0b3JcIikuaW5uZXJIVE1MID1cclxuICAgICAgICAgICAgICBlbGVtZW50LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGV4dFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdGFiXCIpO1xyXG4gICAgICAgICAgICBsZXQgZGF0YUlEID0gZWxlbXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcclxuICAgICAgICAgICAgZGVsZXRlSm91cm5hbENvbnRlbnQoZGF0YUlELCBlbGVtZW50Ll9pZCk7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke2VsZW1lbnQuX2lkfVwiXWApO1xyXG4gICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IHJlc3BvbnNlLmRhdGFbaV0uZGF0YTtcclxuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQuZmlsdGVyKChjb24pID0+IGNvbi5faWQgIT0gZWxlbWVudC5faWQpO1xyXG4gICAgICAgICAgICByZXNwb25zZS5kYXRhW2ldLmRhdGEgPSBjb250ZW50O1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBqb3VybmFsSXRlbS5hcHBlbmRDaGlsZChqb3VybmFsQnRuKTtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgIGpvdXJuYWxJdGVtLmFwcGVuZENoaWxkKGpvdXJuYWxEZXNjKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGpvdXJuYWxDb250YWluZXIuYXBwZW5kQ2hpbGQoam91cm5hbEl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgc3RvcmVVc2VySm91cm5hbHMoKSB7XHJcbiAgICBjb25zdCBzYXZlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlQnV0dG9uXCIpO1xyXG5cclxuICAgIHNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGlucHV0VmFsID0gKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlJbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KVxyXG4gICAgICAgIC52YWx1ZTtcclxuICAgICAgY29uc3QgY2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFjY2VwdFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAvLyBjb25zdCBjaGVjayA9IGNiLmNoZWNrZWRcclxuICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICBiYXR0bGVJZDogdGhpcy5iYXR0bGVJZC50b1N0cmluZygpLFxyXG4gICAgICAgIG5hbWU6IGlucHV0VmFsLFxyXG4gICAgICAgIC8vIHRlbXBsYXRlOiBjaGVjayxcclxuICAgICAgfTtcclxuICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcy5iYXR0bGVJZDogJywgdGhpcy5iYXR0bGVJZCwgdHlwZW9mICh0aGlzLmJhdHRsZUlkKSk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdGcm9tIExvY2FsIFN0b3JhZ2U6ICcsIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYmF0dGxlSWRcIiksIHR5cGVvZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJiYXR0bGVJZFwiKSkpO1xyXG5cclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzdG9yZUpvdXJuYWxzKGRhdGEpO1xyXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsLXRhYnNcIik7XHJcbiAgICAgICAgam91cm5hbExpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBhd2FpdCB0aGlzLmdldFVzZXJKb3VybmFscygpO1xyXG4gICAgICAgIGxldCBidHRubjIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pZD1cIiR7cmVzcG9uc2UuZGF0YS5faWR9XCJdYCk7XHJcbiAgICAgICAgaWYgKGJ0dG5uMiBhcyBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgKGJ0dG5uMiBhcyBIVE1MRWxlbWVudCkuY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlJbnB1dFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIikgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVVc2VySm91cm5hbHMoKSB7XHJcbiAgICBjb25zdCBzYXZlQnV0dG9uRWRpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlNb2RhbDJTYXZlXCIpO1xyXG5cclxuICAgIHNhdmVCdXR0b25FZGl0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcImZyb20gc2F2ZUJ1dHRvblwiKTtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgaW5wdXRWYWwgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0MlwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KVxyXG4gICAgICAgIC52YWx1ZTtcclxuICAgICAgY29uc3QgY2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFjY2VwdFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAvLyBjb25zdCBjaGVjayA9IGNiLmNoZWNrZWRcclxuICAgICAgbGV0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtam91cm5lbFwiKTtcclxuICAgICAgY29uc3QgY29udGVudElEID0gY29udGVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xyXG4gICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgIGJhdHRsZUlkOiB0aGlzLmJhdHRsZUlkLnRvU3RyaW5nKCksXHJcbiAgICAgICAgbmFtZTogaW5wdXRWYWwsXHJcbiAgICAgICAgLy8gdGVtcGxhdGU6IGNoZWNrLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHVwZGF0ZUpvdXJuYWxzKGNvbnRlbnRJRCwgZGF0YSk7XHJcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgY29uc3Qgam91cm5hbExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWwtdGFic1wiKTtcclxuICAgICAgICBqb3VybmFsTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZ2V0VXNlckpvdXJuYWxzKCk7XHJcbiAgICAgICAgbGV0IGJ0dG5uMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWlkPVwiJHtyZXNwb25zZS5kYXRhLl9pZH1cIl1gKTtcclxuICAgICAgICBpZiAoYnR0bm4yIGFzIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAoYnR0bm4yIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0MlwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubXlNb2RhbDJDbG9zZVwiKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHN0b3JlVXNlckpvdXJuYWxDb250ZW50KCkge1xyXG4gICAgY29uc3Qgc2F2ZUNvbnRlbnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRzYXZlQnV0dG9uXCIpO1xyXG5cclxuICAgIHNhdmVDb250ZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLXRhYlwiKTtcclxuICAgICAgY29uc3QgaWQgPSBlbGVtcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xyXG4gICAgICBsZXQgY29udGVudFRpdGxlID0gKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFRpdGxlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICAgICAgKS52YWx1ZTtcclxuICAgICAgY29uc3QgaHRtbEZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRvclwiKS5pbm5lckhUTUw7XHJcbiAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgIHRpdGxlOiBjb250ZW50VGl0bGUsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGh0bWxGaWxlLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHN0b3JlSm91cm5hbENvbnRlbnQoaWQsIGRhdGEpO1xyXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsLXRhYnNcIik7XHJcbiAgICAgICAgam91cm5hbExpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBhd2FpdCB0aGlzLmdldFVzZXJKb3VybmFscygpO1xyXG4gICAgICAgIGxldCBidHRubiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcclxuICAgICAgICBpZiAoYnR0bm4gYXMgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgIChidHRubiBhcyBIVE1MRWxlbWVudCkuY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFRpdGxlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID1cclxuICAgICAgICAgIFwiXCI7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0b3JcIikuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgfVxyXG4gICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5Db250ZW50TW9kYWxDbG9zZVwiKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVVc2VySm91cm5hbENvbnRlbnQoKSB7XHJcbiAgICBjb25zdCBzYXZlQ29udGVudEJ1dHRvbjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRlbnRzYXZlQnV0dG9uMlwiKTtcclxuXHJcbiAgICBzYXZlQ29udGVudEJ1dHRvbjIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdGFiXCIpO1xyXG4gICAgICBjb25zdCBpZCA9IGVsZW1zLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XHJcbiAgICAgIGxldCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtY29udGVudFwiKTtcclxuICAgICAgY29uc3QgY29udGVudElEID0gY29udGVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xyXG4gICAgICBsZXQgY29udGVudFRpdGxlID0gKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdENvbnRlbnRUaXRsZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbiAgICAgICkudmFsdWU7XHJcbiAgICAgIGNvbnN0IGh0bWxGaWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0RWRpdG9yXCIpLmlubmVySFRNTDtcclxuICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgdGl0bGU6IGNvbnRlbnRUaXRsZSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogaHRtbEZpbGUsXHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZWRpdEpvdXJuYWxDb250ZW50KGlkLCBjb250ZW50SUQsIGRhdGEpO1xyXG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgIGNvbnN0IGpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsLXRhYnNcIik7XHJcbiAgICAgICAgam91cm5hbExpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBhd2FpdCB0aGlzLmdldFVzZXJKb3VybmFscygpO1xyXG4gICAgICAgIGxldCBidHRubiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcclxuICAgICAgICBpZiAoYnR0bm4gYXMgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgIChidHRubiBhcyBIVE1MRWxlbWVudCkuY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0Q29udGVudFRpdGxlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICAgICAgICApLnZhbHVlID0gXCJcIjtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRFZGl0b3JcIikuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgfVxyXG4gICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lZGl0Q29udGVudE1vZGFsQ2xvc2VcIikgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbkxvZ2dlZEluKCkge1xyXG4gICAgdGhpcy5pc0xvZ2dlZEluID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBlbEJ0bkxvZ291dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLWxvZ291dFwiKTtcclxuICAgIGVsQnRuTG9nb3V0LmNsYXNzTGlzdC5hZGQoXCJlbmFibGVkXCIpO1xyXG5cclxuICAgIGNvbnN0IHBqQnRuTG9naW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJidG4tcGVyc29uYWwtam91cm5hbC1vbkxvZ2dlZGluXCJcclxuICAgICk7XHJcbiAgICBwakJ0bkxvZ2luLmNsYXNzTGlzdC5hZGQoXCJlbmFibGVkXCIpO1xyXG5cclxuICAgIGNvbnN0IHBqQnRuTG9nb3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tcGVyc29uYWwtam91cm5hbFwiKTtcclxuICAgIHBqQnRuTG9nb3V0LmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcclxuXHJcbiAgICB0aGlzLmRyYXdVc2VySW5mbygpO1xyXG4gICAgdGhpcy5kcmF3U3ViUGFuZWwoKTtcclxuICAgIC8vIHRoaXMuZ2V0VXNlckpvdXJuYWxzKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xlYXJKb3VybmFsVUkoKSB7XHJcbiAgICBjb25zdCBvbGRKb3VybmFsTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbC10YWJzXCIpO1xyXG4gICAgb2xkSm91cm5hbExpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZHJhd1VzZXJJbmZvKCkge1xyXG4gICAgY29uc3QgZWxVc2VySW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1pbmZvXCIpO1xyXG4gICAgZWxVc2VySW5mby5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgaWYgKHRoaXMuaXNMb2dnZWRJbikge1xyXG4gICAgICBlbFVzZXJJbmZvLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgICBjb25zdCBlbEJhdHRsZVRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmF0dGxlLXRhZ1wiKTtcclxuICAgICAgZWxCYXR0bGVUYWcuaW5uZXJIVE1MID0gdGhpcy5iYXR0bGVUYWc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRyYXdTdWJQYW5lbCgpIHtcclxuICAgIGNvbnN0IGVsU3ViUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Yi1wYW5lbFwiKTtcclxuICAgIGVsU3ViUGFuZWwuY2xhc3NMaXN0LnJlbW92ZShcImxvZ2dlZC1pblwiKTtcclxuICAgIGlmICh0aGlzLmlzTG9nZ2VkSW4pIHtcclxuICAgICAgZWxTdWJQYW5lbC5jbGFzc0xpc3QuYWRkKFwibG9nZ2VkLWluXCIpO1xyXG4gICAgICB0aGlzLmNoYXJhY3RlckluZm8gPSBuZXcgQ2hhcmFjdGVySW5mbyh0aGlzLmNoYXJhY3RlcnMpO1xyXG4gICAgICB0aGlzLmNoYXJhY3RlckluZm8uaW5pdERyb3Bkb3duKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGluc3RhbmNlKCkge1xyXG4gICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBEZXNrdG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gIH1cclxufVxyXG5cclxuRGVza3RvcC5pbnN0YW5jZSgpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9