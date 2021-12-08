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

/***/ "./src/services/overwolf.service.ts":
/*!******************************************!*\
  !*** ./src/services/overwolf.service.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dragResize = exports.getCurrentWindow = void 0;
const getCurrentWindow = () => {
    return new Promise(resolve => {
        try {
            overwolf.windows.getCurrentWindow((res) => {
                resolve(res.window);
            });
        }
        catch (e) {
            console.warn('Exception while getting current window window');
            resolve(null);
        }
    });
};
exports.getCurrentWindow = getCurrentWindow;
const dragResize = (windowId, edge) => {
    overwolf.windows.dragResize(windowId, edge);
};
exports.dragResize = dragResize;


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
  !*** ./src/in_game/in_game.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
const AppWindow_1 = __webpack_require__(/*! ../AppWindow */ "./src/AppWindow.ts");
const consts_1 = __webpack_require__(/*! ../consts */ "./src/consts.ts");
const overwolf_service_1 = __webpack_require__(/*! ../services/overwolf.service */ "./src/services/overwolf.service.ts");
const api_1 = __webpack_require__(/*! ../utils/api */ "./src/utils/api.ts");
const talentPicker_1 = __webpack_require__(/*! ../utils/talentPicker */ "./src/utils/talentPicker.ts");
const CLIENT_ID = "766b8aab7f3f4406a5d4844f5a0c6bd7";
const AUTHORIZE_ENDPOINT = "https://eu.battle.net/oauth/authorize";
const redirectUri = "https://wowme.gg/oauth/callback_overwolf";
const scope = ["wow.profile", "openid"];
const discordURL = "https://discord.gg/ryg9Czzr8Z";
class InGame extends AppWindow_1.AppWindow {
    constructor() {
        super(consts_1.windowNames.inGame);
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
        this.getUserJournals();
        this.storeUserJournals();
        this.updateUserJournals();
        this.storeUserJournalContent();
        this.updateUserJournalContent();
        this._eventsLog = document.getElementById("eventsLog");
        this._infoLog = document.getElementById("infoLog");
        this.setToggleHotkeyBehavior();
        this.setToggleHotkeyText();
        this.initDragResize();
        this._wowGameEventsListener = new overwolf_api_ts_1.OWGamesEvents({
            onInfoUpdates: this.onInfoUpdates.bind(this),
            onNewEvents: this.onNewEvents.bind(this),
        }, consts_1.interestingFeatures);
        overwolf.settings.hotkeys.onChanged.addListener((e) => {
            this.setToggleHotkeyText();
        });
        this.initWindowSizeAndPosition();
        this.talentPicker = new talentPicker_1.default();
        this.talentPicker.initComponents();
        this.initOpacityRanger();
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
        this.activeScreen();
        const pjBtnLogin = document.getElementById("btn-personal-journal-onLoggedin");
        pjBtnLogin.classList.add("disabled");
        const loginButton2 = document.getElementById("btn-personal-journal");
        loginButton2.addEventListener("click", (e) => {
            const scopesString = encodeURIComponent(scope.join(" "));
            const redirectUriString = encodeURIComponent(redirectUri);
            const authorizeUrl = `${AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&scope=${scopesString}&redirect_uri=${redirectUriString}&response_type=code`;
            overwolf.utils.openUrlInDefaultBrowser(authorizeUrl);
        });
    }
    activeScreen() {
        const personalJournalContent = document.querySelector(".personal-journal-content");
        const personalJournal = document.querySelector(".personal-journal");
        const talentPickerContent = document.querySelector(".talent-picker-content");
        const talentPicker = document.querySelector(".talent-picker");
        const menuItems = document.getElementsByClassName("menu-item");
        Array.from(menuItems).forEach((elem) => {
            elem.addEventListener("click", (e) => {
                if (elem.classList.contains("work-in-progress")) {
                    return;
                }
                else if (elem.id == "btn-personal-journal-onLoggedin") {
                    console.log("Hello");
                    personalJournalContent.classList.add("enabled");
                    personalJournalContent.classList.remove("disabled");
                    talentPickerContent.classList.remove("enabled");
                    talentPickerContent.classList.add("disabled");
                    return;
                }
                else {
                    console.log("Not Hello");
                    talentPickerContent.classList.add("enabled");
                    talentPickerContent.classList.remove("disabled");
                    personalJournalContent.classList.remove("enabled");
                    personalJournalContent.classList.add("disabled");
                    return;
                }
            });
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
    async callbackOAuth(urlscheme) {
        const overlay = document.getElementById("loading-overlay");
        overlay.classList.add("active");
        const url = new URL(decodeURIComponent(urlscheme.parameter));
        const code = url.searchParams.get("code");
        try {
            const userInfo = await api_1.getToken({ code, isOverwolf: true });
            const token = userInfo.token;
            const expiresIn = Date.now() + userInfo.expiresIn * 1000;
            const inGame = InGame.instance();
            inGame.setBattleTag(userInfo.battleTag);
            inGame.setBattleId(userInfo.battleId);
            inGame.setBattleCred(userInfo.battleCred);
            inGame.setCharacters(userInfo.characters);
            inGame.setRegion(userInfo.region);
            localStorage.setItem("token", token);
            localStorage.setItem("expiresIn", expiresIn.toString());
            localStorage.setItem("battleTag", userInfo.battleTag);
            localStorage.setItem("battleId", userInfo.battleId);
            localStorage.setItem("battleCred", userInfo.battleCred);
            localStorage.setItem("region", userInfo.region);
            inGame.onLoggedIn();
            inGame.getUserJournals();
        }
        catch (e) {
            console.log(e);
        }
        overlay.classList.remove("active");
    }
    clearJournalUI() {
        const oldJournalList = document.getElementById("journal-tabs");
        oldJournalList.innerHTML = "";
    }
    onLoggedIn() {
        this.isLoggedIn = true;
        const pjBtnLogin = document.getElementById("btn-personal-journal-onLoggedin");
        pjBtnLogin.classList.remove("disabled");
        pjBtnLogin.classList.add("enabled");
        const pjBtnLogout = document.getElementById("btn-personal-journal");
        pjBtnLogout.classList.add("disabled");
        pjBtnLogout.classList.remove("enabled");
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
    static instance() {
        if (!this._instance) {
            this._instance = new InGame();
        }
        return this._instance;
    }
    run() {
        this._wowGameEventsListener.start();
    }
    onInfoUpdates(info) {
        this.logLine(this._infoLog, info, false);
    }
    onNewEvents(e) {
        const shouldHighlight = e.events.some((event) => {
            switch (event.name) {
                case "kill":
                case "death":
                case "assist":
                case "level":
                case "matchStart":
                case "matchEnd":
                    return true;
            }
            return false;
        });
        this.logLine(this._eventsLog, e, shouldHighlight);
    }
    async setToggleHotkeyText() {
        const hotkeyText = await overwolf_api_ts_1.OWHotkeys.getHotkeyText(consts_1.hotkeys.toggle, consts_1.wowClassId);
        const hotkeyElem = document.getElementById("hotkey");
        hotkeyElem.textContent = hotkeyText;
    }
    async setToggleHotkeyBehavior() {
        const toggleInGameWindow = async (hotkeyResult) => {
            console.log(`pressed hotkey for ${hotkeyResult.name}`);
            const inGameState = await this.getWindowState();
            if (inGameState.window_state === "normal" ||
                inGameState.window_state === "maximized") {
                this.currWindow.minimize();
            }
            else if (inGameState.window_state === "minimized" ||
                inGameState.window_state === "closed") {
                this.currWindow.restore();
            }
        };
        overwolf_api_ts_1.OWHotkeys.onHotkeyDown(consts_1.hotkeys.toggle, toggleInGameWindow);
    }
    logLine(log, data, highlight) {
        console.log(data);
        if (!log)
            return;
        const line = document.createElement("pre");
        line.textContent = JSON.stringify(data);
        if (highlight) {
            line.className = "highlight";
        }
        const shouldAutoScroll = log.scrollTop + log.offsetHeight > log.scrollHeight - 10;
        log.appendChild(line);
        if (shouldAutoScroll) {
            log.scrollTop = log.scrollHeight;
        }
    }
    initOpacityRanger() {
        const elRanger = document.getElementById("opacity-range");
        elRanger.addEventListener("input", (e) => {
            const value = parseInt(e.target.value);
            const body = document.getElementsByTagName("body")[0];
            body.style.opacity = (value / 100).toString();
        });
    }
    initDragResize() {
        const elements = document.getElementsByClassName("resize");
        for (const el of elements) {
            el.addEventListener("mousedown", (e) => {
                const edge = el.getAttribute("edge");
                this.dragResize(e, edge);
            });
        }
    }
    async dragResize(event, edge) {
        if (this.maximized) {
            return;
        }
        console.log("doing drag resize", event, edge);
        const window = await overwolf_service_1.getCurrentWindow();
        overwolf_service_1.dragResize(window.id, edge);
    }
    initWindowSizeAndPosition() {
        overwolf.utils.getMonitorsList((result) => {
            let _screenWidth = 0;
            let _screenHeight = 0;
            for (const display in result.displays) {
                if (result.displays[display].is_primary) {
                    _screenWidth = result.displays[display].width;
                    _screenHeight = result.displays[display].height;
                }
            }
            overwolf.windows.getCurrentWindow((res) => {
                const _windowWidth = 805;
                const _windowHeight = Math.min(_screenHeight, 800);
                const _left = _screenWidth - _windowWidth;
                const _top = Math.round((_screenHeight - _windowHeight) / 2);
                overwolf.windows.changePosition(res.window.id, _left, _top, null);
                overwolf.windows.changeSize(res.window.id, _windowWidth, _windowHeight, null);
            });
        });
    }
}
InGame.instance().run();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctZ2FtZS1saXN0ZW5lci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLWV2ZW50cy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctaG90a2V5cy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWxpc3RlbmVyLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3Qvb3ctd2luZG93LmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9Ab3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzL2Rpc3QvdGltZXIuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYWRhcHRlcnMveGhyLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvYXhpb3MuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL2lzQ2FuY2VsLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9idWlsZEZ1bGxQYXRoLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvZGlzcGF0Y2hSZXF1ZXN0LmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9lbmhhbmNlRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9zZXR0bGUuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3RyYW5zZm9ybURhdGEuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0Fic29sdXRlVVJMLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZS5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovL3dvdy5tZS8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9zcHJlYWQuanMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvQXBwV2luZG93LnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9jb21wb25lbnRzL2Ryb3Bkb3duLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9jb21wb25lbnRzL3RhbGVudHNUYWJsZS50cyIsIndlYnBhY2s6Ly93b3cubWUvLi9zcmMvY29uc3RzLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9pbml0L2luaXREYXRhLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy9zZXJ2aWNlcy9vdmVyd29sZi5zZXJ2aWNlLnRzIiwid2VicGFjazovL3dvdy5tZS8uL3NyYy91dGlscy9hcGkudHMiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL3V0aWxzL3RhbGVudFBpY2tlci50cyIsIndlYnBhY2s6Ly93b3cubWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd293Lm1lLy4vc3JjL2luX2dhbWUvaW5fZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0Esa0NBQWtDLG9DQUFvQyxhQUFhLEVBQUUsRUFBRTtBQUN2RixDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLDZGQUFvQjtBQUN6QyxhQUFhLG1CQUFPLENBQUMsMkZBQW1CO0FBQ3hDLGFBQWEsbUJBQU8sQ0FBQyw2RUFBWTtBQUNqQyxhQUFhLG1CQUFPLENBQUMsaUZBQWM7QUFDbkMsYUFBYSxtQkFBTyxDQUFDLG1GQUFlO0FBQ3BDLGFBQWEsbUJBQU8sQ0FBQywrRUFBYTs7Ozs7Ozs7Ozs7O0FDakJyQjtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxzQkFBc0I7QUFDdEIsc0JBQXNCLG1CQUFPLENBQUMsbUZBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjs7Ozs7Ozs7Ozs7O0FDN0NUO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELHFCQUFxQjtBQUNyQixnQkFBZ0IsbUJBQU8sQ0FBQyx1RUFBUztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxT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QUFDLGFBQWEsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFN0QsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbEUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQ3pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUNiLFlBQVksRUFDWixhQUFhLEVBQ2IsSUFBSSxDQUNMLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDIiwiZmlsZSI6ImpzL2luX2dhbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWUtbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctZ2FtZXMtZXZlbnRzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWVzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWhvdGtleXNcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctbGlzdGVuZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vb3ctd2luZG93XCIpLCBleHBvcnRzKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IHZvaWQgMDtcclxuY29uc3Qgb3dfbGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL293LWxpc3RlbmVyXCIpO1xyXG5jbGFzcyBPV0dhbWVMaXN0ZW5lciBleHRlbmRzIG93X2xpc3RlbmVyXzEuT1dMaXN0ZW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSkge1xyXG4gICAgICAgIHN1cGVyKGRlbGVnYXRlKTtcclxuICAgICAgICB0aGlzLm9uR2FtZUluZm9VcGRhdGVkID0gKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXVwZGF0ZSB8fCAhdXBkYXRlLmdhbWVJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF1cGRhdGUucnVubmluZ0NoYW5nZWQgJiYgIXVwZGF0ZS5nYW1lQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1cGRhdGUuZ2FtZUluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQodXBkYXRlLmdhbWVJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZUVuZGVkKHVwZGF0ZS5nYW1lSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25SdW5uaW5nR2FtZUluZm8gPSAoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWluZm8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5mby5pc1J1bm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZChpbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLm9uR2FtZUluZm9VcGRhdGVkLmFkZExpc3RlbmVyKHRoaXMub25HYW1lSW5mb1VwZGF0ZWQpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbyh0aGlzLm9uUnVubmluZ0dhbWVJbmZvKTtcclxuICAgIH1cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMub25HYW1lSW5mb1VwZGF0ZWQucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkdhbWVJbmZvVXBkYXRlZCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVMaXN0ZW5lciA9IE9XR2FtZUxpc3RlbmVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSB2b2lkIDA7XHJcbmNvbnN0IHRpbWVyXzEgPSByZXF1aXJlKFwiLi90aW1lclwiKTtcclxuY2xhc3MgT1dHYW1lc0V2ZW50cyB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSwgcmVxdWlyZWRGZWF0dXJlcywgZmVhdHVyZVJldHJpZXMgPSAxMCkge1xyXG4gICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyA9IChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uSW5mb1VwZGF0ZXMoaW5mby5pbmZvKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub25OZXdFdmVudHMgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbk5ld0V2ZW50cyhlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICAgICAgdGhpcy5fcmVxdWlyZWRGZWF0dXJlcyA9IHJlcXVpcmVkRmVhdHVyZXM7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZVJldHJpZXMgPSBmZWF0dXJlUmV0cmllcztcclxuICAgIH1cclxuICAgIGFzeW5jIGdldEluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5nZXRJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc2V0UmVxdWlyZWRGZWF0dXJlcygpIHtcclxuICAgICAgICBsZXQgdHJpZXMgPSAxLCByZXN1bHQ7XHJcbiAgICAgICAgd2hpbGUgKHRyaWVzIDw9IHRoaXMuX2ZlYXR1cmVSZXRyaWVzKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLnNldFJlcXVpcmVkRmVhdHVyZXModGhpcy5fcmVxdWlyZWRGZWF0dXJlcywgcmVzb2x2ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBzdWNjZXNzOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHJlc3VsdC5zdXBwb3J0ZWRGZWF0dXJlcy5sZW5ndGggPiAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhd2FpdCB0aW1lcl8xLlRpbWVyLndhaXQoMzAwMCk7XHJcbiAgICAgICAgICAgIHRyaWVzKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUud2Fybignc2V0UmVxdWlyZWRGZWF0dXJlcygpOiBmYWlsdXJlIGFmdGVyICcgKyB0cmllcyArICcgdHJpZXMnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0LCBudWxsLCAyKSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uSW5mb1VwZGF0ZXMyLmFkZExpc3RlbmVyKHRoaXMub25JbmZvVXBkYXRlcyk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uTmV3RXZlbnRzLmFkZExpc3RlbmVyKHRoaXMub25OZXdFdmVudHMpO1xyXG4gICAgfVxyXG4gICAgdW5SZWdpc3RlckV2ZW50cygpIHtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25JbmZvVXBkYXRlczIucmVtb3ZlTGlzdGVuZXIodGhpcy5vbkluZm9VcGRhdGVzKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMub25OZXdFdmVudHMucmVtb3ZlTGlzdGVuZXIodGhpcy5vbk5ld0V2ZW50cyk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzdGFydCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW293LWdhbWUtZXZlbnRzXSBTVEFSVGApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnNldFJlcXVpcmVkRmVhdHVyZXMoKTtcclxuICAgICAgICBjb25zdCB7IHJlcywgc3RhdHVzIH0gPSBhd2FpdCB0aGlzLmdldEluZm8oKTtcclxuICAgICAgICBpZiAocmVzICYmIHN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25JbmZvVXBkYXRlcyh7IGluZm86IHJlcyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbb3ctZ2FtZS1ldmVudHNdIFNUT1BgKTtcclxuICAgICAgICB0aGlzLnVuUmVnaXN0ZXJFdmVudHMoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZXNFdmVudHMgPSBPV0dhbWVzRXZlbnRzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XR2FtZXMgPSB2b2lkIDA7XHJcbmNsYXNzIE9XR2FtZXMge1xyXG4gICAgc3RhdGljIGdldFJ1bm5pbmdHYW1lSW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UnVubmluZ0dhbWVJbmZvKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGNsYXNzSWRGcm9tR2FtZUlkKGdhbWVJZCkge1xyXG4gICAgICAgIGxldCBjbGFzc0lkID0gTWF0aC5mbG9vcihnYW1lSWQgLyAxMCk7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzSWQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcyhsaW1pdCA9IDMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSZWNlbnRseVBsYXllZEdhbWVzKGxpbWl0LCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQuZ2FtZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRHYW1lREJJbmZvKGdhbWVDbGFzc0lkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldEdhbWVEQkluZm8oZ2FtZUNsYXNzSWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lcyA9IE9XR2FtZXM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gdm9pZCAwO1xyXG5jbGFzcyBPV0hvdGtleXMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHN0YXRpYyBnZXRIb3RrZXlUZXh0KGhvdGtleUlkLCBnYW1lSWQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMuZ2V0KHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhvdGtleTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZUlkID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nbG9iYWxzLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQuZ2FtZXMgJiYgcmVzdWx0LmdhbWVzW2dhbWVJZF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdGtleSA9IHJlc3VsdC5nYW1lc1tnYW1lSWRdLmZpbmQoaCA9PiBoLm5hbWUgPT09IGhvdGtleUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaG90a2V5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShob3RrZXkuYmluZGluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCdVTkFTU0lHTkVEJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIG9uSG90a2V5RG93bihob3RrZXlJZCwgYWN0aW9uKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5vblByZXNzZWQuYWRkTGlzdGVuZXIoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5uYW1lID09PSBob3RrZXlJZClcclxuICAgICAgICAgICAgICAgIGFjdGlvbihyZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dIb3RrZXlzID0gT1dIb3RrZXlzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XTGlzdGVuZXIgPSB2b2lkIDA7XHJcbmNsYXNzIE9XTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUpIHtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0xpc3RlbmVyID0gT1dMaXN0ZW5lcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV1dpbmRvdyA9IHZvaWQgMDtcclxuY2xhc3MgT1dXaW5kb3cge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLl9pZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBhc3luYyByZXN0b3JlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5yZXN0b3JlKGlkLCByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuc3VjY2VzcylcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbcmVzdG9yZV0gLSBhbiBlcnJvciBvY2N1cnJlZCwgd2luZG93SWQ9JHtpZH0sIHJlYXNvbj0ke3Jlc3VsdC5lcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtaW5pbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWluaW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBtYXhpbWl6ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MubWF4aW1pemUoaWQsICgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBoaWRlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5oaWRlKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgY2xvc2UoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmdldFdpbmRvd1N0YXRlKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJlxyXG4gICAgICAgICAgICAgICAgKHJlc3VsdC53aW5kb3dfc3RhdGUgIT09ICdjbG9zZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5pbnRlcm5hbENsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGRyYWdNb3ZlKGVsZW0pIHtcclxuICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lICsgJyBkcmFnZ2FibGUnO1xyXG4gICAgICAgIGVsZW0ub25tb3VzZWRvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmRyYWdNb3ZlKHRoaXMuX25hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRXaW5kb3dTdGF0ZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0V2luZG93U3RhdGUoaWQsIHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldEN1cnJlbnRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3cocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LndpbmRvdyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb2J0YWluKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNiID0gcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIgJiYgcmVzLndpbmRvdyAmJiByZXMud2luZG93LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSByZXMud2luZG93LmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lID0gcmVzLndpbmRvdy5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcy53aW5kb3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0Q3VycmVudFdpbmRvdyhjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm9idGFpbkRlY2xhcmVkV2luZG93KHRoaXMuX25hbWUsIGNiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgYXNzdXJlT2J0YWluZWQoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0Lm9idGFpbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaW50ZXJuYWxDbG9zZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5jbG9zZShpZCwgcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLnN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XV2luZG93ID0gT1dXaW5kb3c7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVGltZXIgPSB2b2lkIDA7XHJcbmNsYXNzIFRpbWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlLCBpZCkge1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlVGltZXJFdmVudCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uVGltZXIodGhpcy5faWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIHdhaXQoaW50ZXJ2YWxJbk1TKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGludGVydmFsSW5NUyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGFydChpbnRlcnZhbEluTVMpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gc2V0VGltZW91dCh0aGlzLmhhbmRsZVRpbWVyRXZlbnQsIGludGVydmFsSW5NUyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90aW1lcklkID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXJJZCk7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UaW1lciA9IFRpbWVyO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2F4aW9zJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgc2V0dGxlID0gcmVxdWlyZSgnLi8uLi9jb3JlL3NldHRsZScpO1xudmFyIGNvb2tpZXMgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvY29va2llcycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgYnVpbGRGdWxsUGF0aCA9IHJlcXVpcmUoJy4uL2NvcmUvYnVpbGRGdWxsUGF0aCcpO1xudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9wYXJzZUhlYWRlcnMnKTtcbnZhciBpc1VSTFNhbWVPcmlnaW4gPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luJyk7XG52YXIgY3JlYXRlRXJyb3IgPSByZXF1aXJlKCcuLi9jb3JlL2NyZWF0ZUVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24geGhyQWRhcHRlcihjb25maWcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGRpc3BhdGNoWGhyUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdERhdGEgPSBjb25maWcuZGF0YTtcbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSBjb25maWcuaGVhZGVycztcblxuICAgIGlmICh1dGlscy5pc0Zvcm1EYXRhKHJlcXVlc3REYXRhKSkge1xuICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzWydDb250ZW50LVR5cGUnXTsgLy8gTGV0IHRoZSBicm93c2VyIHNldCBpdFxuICAgIH1cblxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAvLyBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uXG4gICAgaWYgKGNvbmZpZy5hdXRoKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBjb25maWcuYXV0aC51c2VybmFtZSB8fCAnJztcbiAgICAgIHZhciBwYXNzd29yZCA9IGNvbmZpZy5hdXRoLnBhc3N3b3JkID8gdW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpZy5hdXRoLnBhc3N3b3JkKSkgOiAnJztcbiAgICAgIHJlcXVlc3RIZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIGJ0b2EodXNlcm5hbWUgKyAnOicgKyBwYXNzd29yZCk7XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxQYXRoID0gYnVpbGRGdWxsUGF0aChjb25maWcuYmFzZVVSTCwgY29uZmlnLnVybCk7XG4gICAgcmVxdWVzdC5vcGVuKGNvbmZpZy5tZXRob2QudG9VcHBlckNhc2UoKSwgYnVpbGRVUkwoZnVsbFBhdGgsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKSwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IGNvbmZpZy50aW1lb3V0O1xuXG4gICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZVxuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCB8fCByZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcmVxdWVzdCBlcnJvcmVkIG91dCBhbmQgd2UgZGlkbid0IGdldCBhIHJlc3BvbnNlLCB0aGlzIHdpbGwgYmVcbiAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgLy8gd2lsbCByZXR1cm4gc3RhdHVzIGFzIDAgZXZlbiB0aG91Z2ggaXQncyBhIHN1Y2Nlc3NmdWwgcmVxdWVzdFxuICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhY29uZmlnLnJlc3BvbnNlVHlwZSB8fCBjb25maWcucmVzcG9uc2VUeXBlID09PSAndGV4dCcgPyByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc3BvbnNlRGF0YSxcbiAgICAgICAgc3RhdHVzOiByZXF1ZXN0LnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogcmVxdWVzdC5zdGF0dXNUZXh0LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZUhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiBoYW5kbGVFcnJvcigpIHtcbiAgICAgIC8vIFJlYWwgZXJyb3JzIGFyZSBoaWRkZW4gZnJvbSB1cyBieSB0aGUgYnJvd3NlclxuICAgICAgLy8gb25lcnJvciBzaG91bGQgb25seSBmaXJlIGlmIGl0J3MgYSBuZXR3b3JrIGVycm9yXG4gICAgICByZWplY3QoY3JlYXRlRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBjb25maWcsIG51bGwsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSB0aW1lb3V0XG4gICAgcmVxdWVzdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiBoYW5kbGVUaW1lb3V0KCkge1xuICAgICAgdmFyIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSAndGltZW91dCBvZiAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnO1xuICAgICAgaWYgKGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlKSB7XG4gICAgICAgIHRpbWVvdXRFcnJvck1lc3NhZ2UgPSBjb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcih0aW1lb3V0RXJyb3JNZXNzYWdlLCBjb25maWcsICdFQ09OTkFCT1JURUQnLFxuICAgICAgICByZXF1ZXN0KSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH07XG5cbiAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAvLyBUaGlzIGlzIG9ubHkgZG9uZSBpZiBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuICAgIGlmICh1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpKSB7XG4gICAgICAvLyBBZGQgeHNyZiBoZWFkZXJcbiAgICAgIHZhciB4c3JmVmFsdWUgPSAoY29uZmlnLndpdGhDcmVkZW50aWFscyB8fCBpc1VSTFNhbWVPcmlnaW4oZnVsbFBhdGgpKSAmJiBjb25maWcueHNyZkNvb2tpZU5hbWUgP1xuICAgICAgICBjb29raWVzLnJlYWQoY29uZmlnLnhzcmZDb29raWVOYW1lKSA6XG4gICAgICAgIHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICByZXF1ZXN0SGVhZGVyc1tjb25maWcueHNyZkhlYWRlck5hbWVdID0geHNyZlZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBoZWFkZXJzIHRvIHRoZSByZXF1ZXN0XG4gICAgaWYgKCdzZXRSZXF1ZXN0SGVhZGVyJyBpbiByZXF1ZXN0KSB7XG4gICAgICB1dGlscy5mb3JFYWNoKHJlcXVlc3RIZWFkZXJzLCBmdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHZhbCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGEgPT09ICd1bmRlZmluZWQnICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSAnY29udGVudC10eXBlJykge1xuICAgICAgICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgYWRkIGhlYWRlciB0byB0aGUgcmVxdWVzdFxuICAgICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMpKSB7XG4gICAgICByZXF1ZXN0LndpdGhDcmVkZW50aWFscyA9ICEhY29uZmlnLndpdGhDcmVkZW50aWFscztcbiAgICB9XG5cbiAgICAvLyBBZGQgcmVzcG9uc2VUeXBlIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKGNvbmZpZy5yZXNwb25zZVR5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRXhwZWN0ZWQgRE9NRXhjZXB0aW9uIHRocm93biBieSBicm93c2VycyBub3QgY29tcGF0aWJsZSBYTUxIdHRwUmVxdWVzdCBMZXZlbCAyLlxuICAgICAgICAvLyBCdXQsIHRoaXMgY2FuIGJlIHN1cHByZXNzZWQgZm9yICdqc29uJyB0eXBlIGFzIGl0IGNhbiBiZSBwYXJzZWQgYnkgZGVmYXVsdCAndHJhbnNmb3JtUmVzcG9uc2UnIGZ1bmN0aW9uLlxuICAgICAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25Eb3dubG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MgPT09ICdmdW5jdGlvbicgJiYgcmVxdWVzdC51cGxvYWQpIHtcbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uVXBsb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIGNvbmZpZy5jYW5jZWxUb2tlbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gb25DYW5jZWxlZChjYW5jZWwpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgICByZWplY3QoY2FuY2VsKTtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghcmVxdWVzdERhdGEpIHtcbiAgICAgIHJlcXVlc3REYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXF1ZXN0XG4gICAgcmVxdWVzdC5zZW5kKHJlcXVlc3REYXRhKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4vaGVscGVycy9iaW5kJyk7XG52YXIgQXhpb3MgPSByZXF1aXJlKCcuL2NvcmUvQXhpb3MnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vY29yZS9tZXJnZUNvbmZpZycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtBeGlvc30gQSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdENvbmZpZykge1xuICB2YXIgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgdmFyIGluc3RhbmNlID0gYmluZChBeGlvcy5wcm90b3R5cGUucmVxdWVzdCwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBheGlvcy5wcm90b3R5cGUgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBBeGlvcy5wcm90b3R5cGUsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgY29udGV4dCB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIGNvbnRleHQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8gQ3JlYXRlIHRoZSBkZWZhdWx0IGluc3RhbmNlIHRvIGJlIGV4cG9ydGVkXG52YXIgYXhpb3MgPSBjcmVhdGVJbnN0YW5jZShkZWZhdWx0cyk7XG5cbi8vIEV4cG9zZSBBeGlvcyBjbGFzcyB0byBhbGxvdyBjbGFzcyBpbmhlcml0YW5jZVxuYXhpb3MuQXhpb3MgPSBBeGlvcztcblxuLy8gRmFjdG9yeSBmb3IgY3JlYXRpbmcgbmV3IGluc3RhbmNlc1xuYXhpb3MuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gIHJldHVybiBjcmVhdGVJbnN0YW5jZShtZXJnZUNvbmZpZyhheGlvcy5kZWZhdWx0cywgaW5zdGFuY2VDb25maWcpKTtcbn07XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsJyk7XG5heGlvcy5DYW5jZWxUb2tlbiA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbFRva2VuJyk7XG5heGlvcy5pc0NhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL2lzQ2FuY2VsJyk7XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5heGlvcy5zcHJlYWQgPSByZXF1aXJlKCcuL2hlbHBlcnMvc3ByZWFkJyk7XG5cbi8vIEV4cG9zZSBpc0F4aW9zRXJyb3JcbmF4aW9zLmlzQXhpb3NFcnJvciA9IHJlcXVpcmUoJy4vaGVscGVycy9pc0F4aW9zRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuLy8gQWxsb3cgdXNlIG9mIGRlZmF1bHQgaW1wb3J0IHN5bnRheCBpbiBUeXBlU2NyaXB0XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBgQ2FuY2VsYCBpcyBhbiBvYmplY3QgdGhhdCBpcyB0aHJvd24gd2hlbiBhbiBvcGVyYXRpb24gaXMgY2FuY2VsZWQuXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgVGhlIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIENhbmNlbChtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59XG5cbkNhbmNlbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuICdDYW5jZWwnICsgKHRoaXMubWVzc2FnZSA/ICc6ICcgKyB0aGlzLm1lc3NhZ2UgOiAnJyk7XG59O1xuXG5DYW5jZWwucHJvdG90eXBlLl9fQ0FOQ0VMX18gPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENhbmNlbCA9IHJlcXVpcmUoJy4vQ2FuY2VsJyk7XG5cbi8qKlxuICogQSBgQ2FuY2VsVG9rZW5gIGlzIGFuIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlcXVlc3QgY2FuY2VsbGF0aW9uIG9mIGFuIG9wZXJhdGlvbi5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV4ZWN1dG9yIFRoZSBleGVjdXRvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsVG9rZW4oZXhlY3V0b3IpIHtcbiAgaWYgKHR5cGVvZiBleGVjdXRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfVxuXG4gIHZhciByZXNvbHZlUHJvbWlzZTtcbiAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzZUV4ZWN1dG9yKHJlc29sdmUpIHtcbiAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHZhciB0b2tlbiA9IHRoaXM7XG4gIGV4ZWN1dG9yKGZ1bmN0aW9uIGNhbmNlbChtZXNzYWdlKSB7XG4gICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgLy8gQ2FuY2VsbGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9rZW4ucmVhc29uID0gbmV3IENhbmNlbChtZXNzYWdlKTtcbiAgICByZXNvbHZlUHJvbWlzZSh0b2tlbi5yZWFzb24pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5DYW5jZWxUb2tlbi5wcm90b3R5cGUudGhyb3dJZlJlcXVlc3RlZCA9IGZ1bmN0aW9uIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gIGlmICh0aGlzLnJlYXNvbikge1xuICAgIHRocm93IHRoaXMucmVhc29uO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAqIGNhbmNlbHMgdGhlIGBDYW5jZWxUb2tlbmAuXG4gKi9cbkNhbmNlbFRva2VuLnNvdXJjZSA9IGZ1bmN0aW9uIHNvdXJjZSgpIHtcbiAgdmFyIGNhbmNlbDtcbiAgdmFyIHRva2VuID0gbmV3IENhbmNlbFRva2VuKGZ1bmN0aW9uIGV4ZWN1dG9yKGMpIHtcbiAgICBjYW5jZWwgPSBjO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0b2tlbjogdG9rZW4sXG4gICAgY2FuY2VsOiBjYW5jZWxcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNDYW5jZWwodmFsdWUpIHtcbiAgcmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLl9fQ0FOQ0VMX18pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGJ1aWxkVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9idWlsZFVSTCcpO1xudmFyIEludGVyY2VwdG9yTWFuYWdlciA9IHJlcXVpcmUoJy4vSW50ZXJjZXB0b3JNYW5hZ2VyJyk7XG52YXIgZGlzcGF0Y2hSZXF1ZXN0ID0gcmVxdWlyZSgnLi9kaXNwYXRjaFJlcXVlc3QnKTtcbnZhciBtZXJnZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWVyZ2VDb25maWcnKTtcblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQXhpb3MoaW5zdGFuY2VDb25maWcpIHtcbiAgdGhpcy5kZWZhdWx0cyA9IGluc3RhbmNlQ29uZmlnO1xuICB0aGlzLmludGVyY2VwdG9ycyA9IHtcbiAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgcmVzcG9uc2U6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKVxuICB9O1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBzcGVjaWZpYyBmb3IgdGhpcyByZXF1ZXN0IChtZXJnZWQgd2l0aCB0aGlzLmRlZmF1bHRzKVxuICovXG5BeGlvcy5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAvLyBBbGxvdyBmb3IgYXhpb3MoJ2V4YW1wbGUvdXJsJ1ssIGNvbmZpZ10pIGEgbGEgZmV0Y2ggQVBJXG4gIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgIGNvbmZpZyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcbiAgICBjb25maWcudXJsID0gYXJndW1lbnRzWzBdO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcbiAgfVxuXG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgLy8gU2V0IGNvbmZpZy5tZXRob2RcbiAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gY29uZmlnLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2UgaWYgKHRoaXMuZGVmYXVsdHMubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IHRoaXMuZGVmYXVsdHMubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnLm1ldGhvZCA9ICdnZXQnO1xuICB9XG5cbiAgLy8gSG9vayB1cCBpbnRlcmNlcHRvcnMgbWlkZGxld2FyZVxuICB2YXIgY2hhaW4gPSBbZGlzcGF0Y2hSZXF1ZXN0LCB1bmRlZmluZWRdO1xuICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShjb25maWcpO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgIGNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4ucHVzaChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgd2hpbGUgKGNoYWluLmxlbmd0aCkge1xuICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW4uc2hpZnQoKSwgY2hhaW4uc2hpZnQoKSk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkF4aW9zLnByb3RvdHlwZS5nZXRVcmkgPSBmdW5jdGlvbiBnZXRVcmkoY29uZmlnKSB7XG4gIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gIHJldHVybiBidWlsZFVSTChjb25maWcudXJsLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcikucmVwbGFjZSgvXlxcPy8sICcnKTtcbn07XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IChjb25maWcgfHwge30pLmRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxudXRpbHMuZm9yRWFjaChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2RXaXRoRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEludGVyY2VwdG9yTWFuYWdlcigpIHtcbiAgdGhpcy5oYW5kbGVycyA9IFtdO1xufVxuXG4vKipcbiAqIEFkZCBhIG5ldyBpbnRlcmNlcHRvciB0byB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdWxmaWxsZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgdGhlbmAgZm9yIGEgYFByb21pc2VgXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3RlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGByZWplY3RgIGZvciBhIGBQcm9taXNlYFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gQW4gSUQgdXNlZCB0byByZW1vdmUgaW50ZXJjZXB0b3IgbGF0ZXJcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgIGZ1bGZpbGxlZDogZnVsZmlsbGVkLFxuICAgIHJlamVjdGVkOiByZWplY3RlZFxuICB9KTtcbiAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFuIGludGVyY2VwdG9yIGZyb20gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmVqZWN0ID0gZnVuY3Rpb24gZWplY3QoaWQpIHtcbiAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgdGhpcy5oYW5kbGVyc1tpZF0gPSBudWxsO1xuICB9XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgdGhlIHJlZ2lzdGVyZWQgaW50ZXJjZXB0b3JzXG4gKlxuICogVGhpcyBtZXRob2QgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igc2tpcHBpbmcgb3ZlciBhbnlcbiAqIGludGVyY2VwdG9ycyB0aGF0IG1heSBoYXZlIGJlY29tZSBgbnVsbGAgY2FsbGluZyBgZWplY3RgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIGludGVyY2VwdG9yXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZm4pIHtcbiAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgaWYgKGggIT09IG51bGwpIHtcbiAgICAgIGZuKGgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVyY2VwdG9yTWFuYWdlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQWJzb2x1dGVVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwnKTtcbnZhciBjb21iaW5lVVJMcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY29tYmluZVVSTHMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIGJhc2VVUkwgd2l0aCB0aGUgcmVxdWVzdGVkVVJMLFxuICogb25seSB3aGVuIHRoZSByZXF1ZXN0ZWRVUkwgaXMgbm90IGFscmVhZHkgYW4gYWJzb2x1dGUgVVJMLlxuICogSWYgdGhlIHJlcXVlc3RVUkwgaXMgYWJzb2x1dGUsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aGUgcmVxdWVzdGVkVVJMIHVudG91Y2hlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVVSTCBUaGUgYmFzZSBVUkxcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0ZWRVUkwgQWJzb2x1dGUgb3IgcmVsYXRpdmUgVVJMIHRvIGNvbWJpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZEZ1bGxQYXRoKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCkge1xuICBpZiAoYmFzZVVSTCAmJiAhaXNBYnNvbHV0ZVVSTChyZXF1ZXN0ZWRVUkwpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2VuaGFuY2VFcnJvcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSwgY29uZmlnLCBlcnJvciBjb2RlLCByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgY3JlYXRlZCBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGVuaGFuY2VFcnJvcihlcnJvciwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgdHJhbnNmb3JtRGF0YSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtRGF0YScpO1xudmFyIGlzQ2FuY2VsID0gcmVxdWlyZSgnLi4vY2FuY2VsL2lzQ2FuY2VsJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbmZ1bmN0aW9uIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKSB7XG4gIGlmIChjb25maWcuY2FuY2VsVG9rZW4pIHtcbiAgICBjb25maWcuY2FuY2VsVG9rZW4udGhyb3dJZlJlcXVlc3RlZCgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgYWRhcHRlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoUmVxdWVzdChjb25maWcpIHtcbiAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gIC8vIEVuc3VyZSBoZWFkZXJzIGV4aXN0XG4gIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgLy8gVHJhbnNmb3JtIHJlcXVlc3QgZGF0YVxuICBjb25maWcuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgY29uZmlnLmRhdGEsXG4gICAgY29uZmlnLmhlYWRlcnMsXG4gICAgY29uZmlnLnRyYW5zZm9ybVJlcXVlc3RcbiAgKTtcblxuICAvLyBGbGF0dGVuIGhlYWRlcnNcbiAgY29uZmlnLmhlYWRlcnMgPSB1dGlscy5tZXJnZShcbiAgICBjb25maWcuaGVhZGVycy5jb21tb24gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNbY29uZmlnLm1ldGhvZF0gfHwge30sXG4gICAgY29uZmlnLmhlYWRlcnNcbiAgKTtcblxuICB1dGlscy5mb3JFYWNoKFxuICAgIFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJywgJ2NvbW1vbiddLFxuICAgIGZ1bmN0aW9uIGNsZWFuSGVhZGVyQ29uZmlnKG1ldGhvZCkge1xuICAgICAgZGVsZXRlIGNvbmZpZy5oZWFkZXJzW21ldGhvZF07XG4gICAgfVxuICApO1xuXG4gIHZhciBhZGFwdGVyID0gY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlcjtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEoXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuXG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICBlcnJvci5pc0F4aW9zRXJyb3IgPSB0cnVlO1xuXG4gIGVycm9yLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZVxuICAgIH07XG4gIH07XG4gIHJldHVybiBlcnJvcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICB2YXIgY29uZmlnID0ge307XG5cbiAgdmFyIHZhbHVlRnJvbUNvbmZpZzJLZXlzID0gWyd1cmwnLCAnbWV0aG9kJywgJ2RhdGEnXTtcbiAgdmFyIG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzID0gWydoZWFkZXJzJywgJ2F1dGgnLCAncHJveHknLCAncGFyYW1zJ107XG4gIHZhciBkZWZhdWx0VG9Db25maWcyS2V5cyA9IFtcbiAgICAnYmFzZVVSTCcsICd0cmFuc2Zvcm1SZXF1ZXN0JywgJ3RyYW5zZm9ybVJlc3BvbnNlJywgJ3BhcmFtc1NlcmlhbGl6ZXInLFxuICAgICd0aW1lb3V0JywgJ3RpbWVvdXRNZXNzYWdlJywgJ3dpdGhDcmVkZW50aWFscycsICdhZGFwdGVyJywgJ3Jlc3BvbnNlVHlwZScsICd4c3JmQ29va2llTmFtZScsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJywgJ29uVXBsb2FkUHJvZ3Jlc3MnLCAnb25Eb3dubG9hZFByb2dyZXNzJywgJ2RlY29tcHJlc3MnLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJywgJ21heEJvZHlMZW5ndGgnLCAnbWF4UmVkaXJlY3RzJywgJ3RyYW5zcG9ydCcsICdodHRwQWdlbnQnLFxuICAgICdodHRwc0FnZW50JywgJ2NhbmNlbFRva2VuJywgJ3NvY2tldFBhdGgnLCAncmVzcG9uc2VFbmNvZGluZydcbiAgXTtcbiAgdmFyIGRpcmVjdE1lcmdlS2V5cyA9IFsndmFsaWRhdGVTdGF0dXMnXTtcblxuICBmdW5jdGlvbiBnZXRNZXJnZWRWYWx1ZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UodGFyZ2V0LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2Uoe30sIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIHV0aWxzLmZvckVhY2godmFsdWVGcm9tQ29uZmlnMktleXMsIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcblxuICB1dGlscy5mb3JFYWNoKGRlZmF1bHRUb0NvbmZpZzJLZXlzLCBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChkaXJlY3RNZXJnZUtleXMsIGZ1bmN0aW9uIG1lcmdlKHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKHByb3AgaW4gY29uZmlnMSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBheGlvc0tleXMgPSB2YWx1ZUZyb21Db25maWcyS2V5c1xuICAgIC5jb25jYXQobWVyZ2VEZWVwUHJvcGVydGllc0tleXMpXG4gICAgLmNvbmNhdChkZWZhdWx0VG9Db25maWcyS2V5cylcbiAgICAuY29uY2F0KGRpcmVjdE1lcmdlS2V5cyk7XG5cbiAgdmFyIG90aGVyS2V5cyA9IE9iamVjdFxuICAgIC5rZXlzKGNvbmZpZzEpXG4gICAgLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSlcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIGZpbHRlckF4aW9zS2V5cyhrZXkpIHtcbiAgICAgIHJldHVybiBheGlvc0tleXMuaW5kZXhPZihrZXkpID09PSAtMTtcbiAgICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG90aGVyS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIHV0aWxzLmZvckVhY2goZm5zLCBmdW5jdGlvbiB0cmFuc2Zvcm0oZm4pIHtcbiAgICBkYXRhID0gZm4oZGF0YSwgaGVhZGVycyk7XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIG5vcm1hbGl6ZUhlYWRlck5hbWUgPSByZXF1aXJlKCcuL2hlbHBlcnMvbm9ybWFsaXplSGVhZGVyTmFtZScpO1xuXG52YXIgREVGQVVMVF9DT05URU5UX1RZUEUgPSB7XG4gICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuZnVuY3Rpb24gc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsIHZhbHVlKSB7XG4gIGlmICghdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVycykgJiYgdXRpbHMuaXNVbmRlZmluZWQoaGVhZGVyc1snQ29udGVudC1UeXBlJ10pKSB7XG4gICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0QWRhcHRlcigpIHtcbiAgdmFyIGFkYXB0ZXI7XG4gIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gRm9yIGJyb3dzZXJzIHVzZSBYSFIgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3hocicpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIC8vIEZvciBub2RlIHVzZSBIVFRQIGFkYXB0ZXJcbiAgICBhZGFwdGVyID0gcmVxdWlyZSgnLi9hZGFwdGVycy9odHRwJyk7XG4gIH1cbiAgcmV0dXJuIGFkYXB0ZXI7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgYWRhcHRlcjogZ2V0RGVmYXVsdEFkYXB0ZXIoKSxcblxuICB0cmFuc2Zvcm1SZXF1ZXN0OiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVxdWVzdChkYXRhLCBoZWFkZXJzKSB7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQWNjZXB0Jyk7XG4gICAgbm9ybWFsaXplSGVhZGVyTmFtZShoZWFkZXJzLCAnQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSWdub3JlICovIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9XG59O1xuXG5kZWZhdWx0cy5oZWFkZXJzID0ge1xuICBjb21tb246IHtcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKidcbiAgfVxufTtcblxudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB1dGlscy5tZXJnZShERUZBVUxUX0NPTlRFTlRfVFlQRSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBlbmNvZGUodmFsKSB7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgIHJlcGxhY2UoLyUyMC9nLCAnKycpLlxuICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICByZXBsYWNlKC8lNUQvZ2ksICddJyk7XG59XG5cbi8qKlxuICogQnVpbGQgYSBVUkwgYnkgYXBwZW5kaW5nIHBhcmFtcyB0byB0aGUgZW5kXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgYmFzZSBvZiB0aGUgdXJsIChlLmcuLCBodHRwOi8vd3d3Lmdvb2dsZS5jb20pXG4gKiBAcGFyYW0ge29iamVjdH0gW3BhcmFtc10gVGhlIHBhcmFtcyB0byBiZSBhcHBlbmRlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCB1cmxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWlsZFVSTCh1cmwsIHBhcmFtcywgcGFyYW1zU2VyaWFsaXplcikge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgaWYgKCFwYXJhbXMpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgdmFyIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIGlmIChwYXJhbXNTZXJpYWxpemVyKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtc1NlcmlhbGl6ZXIocGFyYW1zKTtcbiAgfSBlbHNlIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhwYXJhbXMpKSB7XG4gICAgc2VyaWFsaXplZFBhcmFtcyA9IHBhcmFtcy50b1N0cmluZygpO1xuICB9IGVsc2Uge1xuICAgIHZhciBwYXJ0cyA9IFtdO1xuXG4gICAgdXRpbHMuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWwsIGtleSkge1xuICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlscy5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAga2V5ID0ga2V5ICsgJ1tdJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IFt2YWxdO1xuICAgICAgfVxuXG4gICAgICB1dGlscy5mb3JFYWNoKHZhbCwgZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KSB7XG4gICAgICAgIGlmICh1dGlscy5pc0RhdGUodikpIHtcbiAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KHYpKSB7XG4gICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlKGtleSkgKyAnPScgKyBlbmNvZGUodikpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuICB9XG5cbiAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICB2YXIgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGhhc2htYXJrSW5kZXggIT09IC0xKSB7XG4gICAgICB1cmwgPSB1cmwuc2xpY2UoMCwgaGFzaG1hcmtJbmRleCk7XG4gICAgfVxuXG4gICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBVUkxcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZWxhdGl2ZVVSTCkge1xuICByZXR1cm4gcmVsYXRpdmVVUkxcbiAgICA/IGJhc2VVUkwucmVwbGFjZSgvXFwvKyQvLCAnJykgKyAnLycgKyByZWxhdGl2ZVVSTC5yZXBsYWNlKC9eXFwvKy8sICcnKVxuICAgIDogYmFzZVVSTDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBzdXBwb3J0IGRvY3VtZW50LmNvb2tpZVxuICAgIChmdW5jdGlvbiBzdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUobmFtZSwgdmFsdWUsIGV4cGlyZXMsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IFtdO1xuICAgICAgICAgIGNvb2tpZS5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKTtcblxuICAgICAgICAgIGlmICh1dGlscy5pc051bWJlcihleHBpcmVzKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhwYXRoKSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3BhdGg9JyArIHBhdGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1dGlscy5pc1N0cmluZyhkb21haW4pKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZG9tYWluPScgKyBkb21haW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWN1cmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBjb29raWUuam9pbignOyAnKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgICAgIHJldHVybiAobWF0Y2ggPyBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbM10pIDogbnVsbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkoKSA6XG5cbiAgLy8gTm9uIHN0YW5kYXJkIGJyb3dzZXIgZW52ICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoKSB7fSxcbiAgICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZCgpIHsgcmV0dXJuIG51bGw7IH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQWJzb2x1dGVVUkwodXJsKSB7XG4gIC8vIEEgVVJMIGlzIGNvbnNpZGVyZWQgYWJzb2x1dGUgaWYgaXQgYmVnaW5zIHdpdGggXCI8c2NoZW1lPjovL1wiIG9yIFwiLy9cIiAocHJvdG9jb2wtcmVsYXRpdmUgVVJMKS5cbiAgLy8gUkZDIDM5ODYgZGVmaW5lcyBzY2hlbWUgbmFtZSBhcyBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgYmVnaW5uaW5nIHdpdGggYSBsZXR0ZXIgYW5kIGZvbGxvd2VkXG4gIC8vIGJ5IGFueSBjb21iaW5hdGlvbiBvZiBsZXR0ZXJzLCBkaWdpdHMsIHBsdXMsIHBlcmlvZCwgb3IgaHlwaGVuLlxuICByZXR1cm4gL14oW2Etel1bYS16XFxkXFwrXFwtXFwuXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBlcnJvciB0aHJvd24gYnkgQXhpb3NcbiAqXG4gKiBAcGFyYW0geyp9IHBheWxvYWQgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBeGlvc0Vycm9yKHBheWxvYWQpIHtcbiAgcmV0dXJuICh0eXBlb2YgcGF5bG9hZCA9PT0gJ29iamVjdCcpICYmIChwYXlsb2FkLmlzQXhpb3NFcnJvciA9PT0gdHJ1ZSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKFxuICB1dGlscy5pc1N0YW5kYXJkQnJvd3NlckVudigpID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgaGF2ZSBmdWxsIHN1cHBvcnQgb2YgdGhlIEFQSXMgbmVlZGVkIHRvIHRlc3RcbiAgLy8gd2hldGhlciB0aGUgcmVxdWVzdCBVUkwgaXMgb2YgdGhlIHNhbWUgb3JpZ2luIGFzIGN1cnJlbnQgbG9jYXRpb24uXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHZhciBtc2llID0gLyhtc2llfHRyaWRlbnQpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgIHZhciB1cmxQYXJzaW5nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIHZhciBvcmlnaW5VUkw7XG5cbiAgICAgIC8qKlxuICAgICogUGFyc2UgYSBVUkwgdG8gZGlzY292ZXIgaXQncyBjb21wb25lbnRzXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgVVJMIHRvIGJlIHBhcnNlZFxuICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAqL1xuICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVSTCh1cmwpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB1cmw7XG5cbiAgICAgICAgaWYgKG1zaWUpIHtcbiAgICAgICAgLy8gSUUgbmVlZHMgYXR0cmlidXRlIHNldCB0d2ljZSB0byBub3JtYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnNldEF0dHJpYnV0ZSgnaHJlZicsIGhyZWYpO1xuICAgICAgICAgIGhyZWYgPSB1cmxQYXJzaW5nTm9kZS5ocmVmO1xuICAgICAgICB9XG5cbiAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG5cbiAgICAgICAgLy8gdXJsUGFyc2luZ05vZGUgcHJvdmlkZXMgdGhlIFVybFV0aWxzIGludGVyZmFjZSAtIGh0dHA6Ly91cmwuc3BlYy53aGF0d2cub3JnLyN1cmx1dGlsc1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhyZWY6IHVybFBhcnNpbmdOb2RlLmhyZWYsXG4gICAgICAgICAgcHJvdG9jb2w6IHVybFBhcnNpbmdOb2RlLnByb3RvY29sID8gdXJsUGFyc2luZ05vZGUucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJykgOiAnJyxcbiAgICAgICAgICBob3N0OiB1cmxQYXJzaW5nTm9kZS5ob3N0LFxuICAgICAgICAgIHNlYXJjaDogdXJsUGFyc2luZ05vZGUuc2VhcmNoID8gdXJsUGFyc2luZ05vZGUuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCAnJykgOiAnJyxcbiAgICAgICAgICBoYXNoOiB1cmxQYXJzaW5nTm9kZS5oYXNoID8gdXJsUGFyc2luZ05vZGUuaGFzaC5yZXBsYWNlKC9eIy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3RuYW1lOiB1cmxQYXJzaW5nTm9kZS5ob3N0bmFtZSxcbiAgICAgICAgICBwb3J0OiB1cmxQYXJzaW5nTm9kZS5wb3J0LFxuICAgICAgICAgIHBhdGhuYW1lOiAodXJsUGFyc2luZ05vZGUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpID9cbiAgICAgICAgICAgIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lIDpcbiAgICAgICAgICAgICcvJyArIHVybFBhcnNpbmdOb2RlLnBhdGhuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIG9yaWdpblVSTCA9IHJlc29sdmVVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAvKipcbiAgICAqIERldGVybWluZSBpZiBhIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luIGFzIHRoZSBjdXJyZW50IGxvY2F0aW9uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RVUkwgVGhlIFVSTCB0byB0ZXN0XG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBVUkwgc2hhcmVzIHRoZSBzYW1lIG9yaWdpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAgKi9cbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4ocmVxdWVzdFVSTCkge1xuICAgICAgICB2YXIgcGFyc2VkID0gKHV0aWxzLmlzU3RyaW5nKHJlcXVlc3RVUkwpKSA/IHJlc29sdmVVUkwocmVxdWVzdFVSTCkgOiByZXF1ZXN0VVJMO1xuICAgICAgICByZXR1cm4gKHBhcnNlZC5wcm90b2NvbCA9PT0gb3JpZ2luVVJMLnByb3RvY29sICYmXG4gICAgICAgICAgICBwYXJzZWQuaG9zdCA9PT0gb3JpZ2luVVJMLmhvc3QpO1xuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnZzICh3ZWIgd29ya2VycywgcmVhY3QtbmF0aXZlKSBsYWNrIG5lZWRlZCBzdXBwb3J0LlxuICAgIChmdW5jdGlvbiBub25TdGFuZGFyZEJyb3dzZXJFbnYoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaXNVUkxTYW1lT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgfSkoKVxuKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsIG5vcm1hbGl6ZWROYW1lKSB7XG4gIHV0aWxzLmZvckVhY2goaGVhZGVycywgZnVuY3Rpb24gcHJvY2Vzc0hlYWRlcih2YWx1ZSwgbmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBub3JtYWxpemVkTmFtZSAmJiBuYW1lLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbGl6ZWROYW1lLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIGhlYWRlcnNbbm9ybWFsaXplZE5hbWVdID0gdmFsdWU7XG4gICAgICBkZWxldGUgaGVhZGVyc1tuYW1lXTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG4vLyBIZWFkZXJzIHdob3NlIGR1cGxpY2F0ZXMgYXJlIGlnbm9yZWQgYnkgbm9kZVxuLy8gYy5mLiBodHRwczovL25vZGVqcy5vcmcvYXBpL2h0dHAuaHRtbCNodHRwX21lc3NhZ2VfaGVhZGVyc1xudmFyIGlnbm9yZUR1cGxpY2F0ZU9mID0gW1xuICAnYWdlJywgJ2F1dGhvcml6YXRpb24nLCAnY29udGVudC1sZW5ndGgnLCAnY29udGVudC10eXBlJywgJ2V0YWcnLFxuICAnZXhwaXJlcycsICdmcm9tJywgJ2hvc3QnLCAnaWYtbW9kaWZpZWQtc2luY2UnLCAnaWYtdW5tb2RpZmllZC1zaW5jZScsXG4gICdsYXN0LW1vZGlmaWVkJywgJ2xvY2F0aW9uJywgJ21heC1mb3J3YXJkcycsICdwcm94eS1hdXRob3JpemF0aW9uJyxcbiAgJ3JlZmVyZXInLCAncmV0cnktYWZ0ZXInLCAndXNlci1hZ2VudCdcbl07XG5cbi8qKlxuICogUGFyc2UgaGVhZGVycyBpbnRvIGFuIG9iamVjdFxuICpcbiAqIGBgYFxuICogRGF0ZTogV2VkLCAyNyBBdWcgMjAxNCAwODo1ODo0OSBHTVRcbiAqIENvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvblxuICogQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVxuICogVHJhbnNmZXItRW5jb2Rpbmc6IGNodW5rZWRcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXJzIEhlYWRlcnMgbmVlZGluZyB0byBiZSBwYXJzZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdmFyIHBhcnNlZCA9IHt9O1xuICB2YXIga2V5O1xuICB2YXIgdmFsO1xuICB2YXIgaTtcblxuICBpZiAoIWhlYWRlcnMpIHsgcmV0dXJuIHBhcnNlZDsgfVxuXG4gIHV0aWxzLmZvckVhY2goaGVhZGVycy5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IHV0aWxzLnRyaW0obGluZS5zdWJzdHIoMCwgaSkpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cihpICsgMSkpO1xuXG4gICAgaWYgKGtleSkge1xuICAgICAgaWYgKHBhcnNlZFtrZXldICYmIGlnbm9yZUR1cGxpY2F0ZU9mLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdzZXQtY29va2llJykge1xuICAgICAgICBwYXJzZWRba2V5XSA9IChwYXJzZWRba2V5XSA/IHBhcnNlZFtrZXldIDogW10pLmNvbmNhdChbdmFsXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNwcmVhZChjYWxsYmFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcChhcnIpIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJyKTtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxuLypnbG9iYWwgdG9TdHJpbmc6dHJ1ZSovXG5cbi8vIHV0aWxzIGlzIGEgbGlicmFyeSBvZiBnZW5lcmljIGhlbHBlciBmdW5jdGlvbnMgbm9uLXNwZWNpZmljIHRvIGF4aW9zXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQnVmZmVyKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwpICYmIHZhbC5jb25zdHJ1Y3RvciAhPT0gbnVsbCAmJiAhaXNVbmRlZmluZWQodmFsLmNvbnN0cnVjdG9yKVxuICAgICYmIHR5cGVvZiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgdmFsLmNvbnN0cnVjdG9yLmlzQnVmZmVyKHZhbCk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gQXJyYXlCdWZmZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXIodmFsKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEZvcm1EYXRhLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGb3JtRGF0YSh2YWwpIHtcbiAgcmV0dXJuICh0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnKSAmJiAodmFsIGluc3RhbmNlb2YgRm9ybURhdGEpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgdmlldyBvbiBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KHZhbCkge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpICYmIChBcnJheUJ1ZmZlci5pc1ZpZXcpKSB7XG4gICAgcmVzdWx0ID0gQXJyYXlCdWZmZXIuaXNWaWV3KHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gKHZhbCkgJiYgKHZhbC5idWZmZXIpICYmICh2YWwuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIFN0cmluZywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBOdW1iZXJcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgcGxhaW4gT2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWwpIHtcbiAgaWYgKHRvU3RyaW5nLmNhbGwodmFsKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbCk7XG4gIHJldHVybiBwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRGF0ZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRGF0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRmlsZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRmlsZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRmlsZSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRmlsZV0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQmxvYlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQmxvYiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQmxvYih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQmxvYl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmVhbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJlYW0odmFsKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVVJMU2VhcmNoUGFyYW1zKHZhbCkge1xuICByZXR1cm4gdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgU3RyaW5nIGZyZWVkIG9mIGV4Y2VzcyB3aGl0ZXNwYWNlXG4gKi9cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJykucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltLFxuICBzdHJpcEJPTTogc3RyaXBCT01cbn07XG4iLCJpbXBvcnQgeyBPV1dpbmRvdyB9IGZyb20gXCJAb3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzXCI7XHJcblxyXG4vLyBBIGJhc2UgY2xhc3MgZm9yIHRoZSBhcHAncyBmb3JlZ3JvdW5kIHdpbmRvd3MuXHJcbi8vIFNldHMgdGhlIG1vZGFsIGFuZCBkcmFnIGJlaGF2aW9ycywgd2hpY2ggYXJlIHNoYXJlZCBhY2Nyb3NzIHRoZSBkZXNrdG9wIGFuZCBpbi1nYW1lIHdpbmRvd3MuXHJcbmV4cG9ydCBjbGFzcyBBcHBXaW5kb3cge1xyXG4gIHByb3RlY3RlZCBjdXJyV2luZG93OiBPV1dpbmRvdztcclxuICBwcm90ZWN0ZWQgbWFpbldpbmRvdzogT1dXaW5kb3c7XHJcbiAgcHJvdGVjdGVkIG1heGltaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih3aW5kb3dOYW1lKSB7XHJcbiAgICB0aGlzLm1haW5XaW5kb3cgPSBuZXcgT1dXaW5kb3coJ2JhY2tncm91bmQnKTtcclxuICAgIHRoaXMuY3VycldpbmRvdyA9IG5ldyBPV1dpbmRvdyh3aW5kb3dOYW1lKTtcclxuXHJcbiAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZUJ1dHRvbicpO1xyXG4gICAgLy8gY29uc3QgbWF4aW1pemVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWF4aW1pemVCdXR0b24nKTtcclxuICAgIGNvbnN0IG1pbmltaXplQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21pbmltaXplQnV0dG9uJyk7XHJcblxyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlcicpO1xyXG5cclxuICAgIHRoaXMuc2V0RHJhZyhoZWFkZXIpO1xyXG5cclxuICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnY2xvc2VCdXR0b24gY2xpY2tlZCcpXHJcbiAgICAgIHRoaXMubWFpbldpbmRvdy5jbG9zZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbWluaW1pemVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdtaW5pbWl6ZUJ1dHRvbiBjbGlja2VkJylcclxuICAgICAgdGhpcy5jdXJyV2luZG93Lm1pbmltaXplKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBtYXhpbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIC8vICAgY29uc3QgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXhpbWl6ZS1pbWdcIik7XHJcbiAgICAvLyAgIGlmICghdGhpcy5tYXhpbWl6ZWQpIHtcclxuICAgIC8vICAgICB0aGlzLmN1cnJXaW5kb3cubWF4aW1pemUoKTtcclxuICAgIC8vICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnL2ltZy9pbi1nYW1lLXdpbmRvdy9idXR0b24vcmVzdG9yZS5wbmcnKTtcclxuICAgIC8vICAgfSBlbHNlIHtcclxuICAgIC8vICAgICB0aGlzLmN1cnJXaW5kb3cucmVzdG9yZSgpO1xyXG4gICAgLy8gICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcvaW1nL2luLWdhbWUtd2luZG93L2J1dHRvbi9tYXhpbWl6ZS5wbmcnKTtcclxuICAgIC8vICAgfVxyXG5cclxuICAgIC8vICAgdGhpcy5tYXhpbWl6ZWQgPSAhdGhpcy5tYXhpbWl6ZWQ7XHJcbiAgICAvLyB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbG9zZVdpbmRvdygpIHtcclxuICAgIHRoaXMubWFpbldpbmRvdy5jbG9zZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldFdpbmRvd1N0YXRlKCkge1xyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuY3VycldpbmRvdy5nZXRXaW5kb3dTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBzZXREcmFnKGVsZW0pIHtcclxuICAgIHRoaXMuY3VycldpbmRvdy5kcmFnTW92ZShlbGVtKTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGludGVyZmFjZSBEcm9wRG93bkl0ZW1JbmZvIHtcclxuICAgIGlkOiBzdHJpbmcsXHJcbiAgICB0ZXh0OiBzdHJpbmdcclxufVxyXG5cclxuaW50ZXJmYWNlIERyb3BEb3duSW5mbyB7XHJcbiAgICB2YXJpYWJsZU5hbWU6IHN0cmluZyxcclxuICAgIGRyb3BEb3duTGlzdDogRHJvcERvd25JdGVtSW5mb1tdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUN1cnJlbnRFbGVtZW50KGRyb3Bkb3duSW5mbzogRHJvcERvd25JbmZvKTpIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBkcm9wZG93bkN1cnJlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZHJvcGRvd25DdXJyZW50LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3QtYm94X19jdXJyZW50XCIpO1xyXG5cclxuICAgIGRyb3Bkb3duSW5mby5kcm9wRG93bkxpc3QuZm9yRWFjaCgoZHJvcGRvd25JdGVtSW5mbzogRHJvcERvd25JdGVtSW5mbywgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCBkcm9wZG93bkl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRyb3Bkb3duSXRlbS5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9fdmFsdWVcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3QtYm94X19pbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicmFkaW9cIik7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgZHJvcGRvd25JdGVtSW5mby5pZCk7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgZHJvcGRvd25JdGVtSW5mby50ZXh0KTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIGRyb3Bkb3duSW5mby52YXJpYWJsZU5hbWUpO1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjaGVja2VkXCIsIFwiY2hlY2tlZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRyb3Bkb3duSXRlbS5hcHBlbmRDaGlsZChpbnB1dCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICB0ZXh0LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3QtYm94X19pbnB1dC10ZXh0XCIpO1xyXG4gICAgICAgIHRleHQuaW5uZXJUZXh0ID0gZHJvcGRvd25JdGVtSW5mby50ZXh0O1xyXG5cclxuICAgICAgICBkcm9wZG93bkl0ZW0uYXBwZW5kQ2hpbGQodGV4dCk7XHJcblxyXG4gICAgICAgIGRyb3Bkb3duQ3VycmVudC5hcHBlbmRDaGlsZChkcm9wZG93bkl0ZW0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgYXJyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgaWYgKGRyb3Bkb3duSW5mby52YXJpYWJsZU5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XHJcbiAgICAgICAgYXJyb3cuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi9pbWcvZGVza3RvcC13aW5kb3cvZHJvcGRvd24tYXJyb3cuc3ZnXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhcnJvdy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCIuL2ltZy9pbi1nYW1lLXdpbmRvdy9kcm9wZG93bi9kcm9wLWRvd24tYXJyb3cucG5nXCIpO1xyXG4gICAgfVxyXG4gICAgYXJyb3cuc2V0QXR0cmlidXRlKFwiYWx0XCIsIFwiQXJyb3cgSWNvblwiKTtcclxuICAgIGFycm93LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3QtYm94X19pY29uXCIpO1xyXG5cclxuICAgIGRyb3Bkb3duQ3VycmVudC5hcHBlbmRDaGlsZChhcnJvdylcclxuXHJcbiAgICByZXR1cm4gZHJvcGRvd25DdXJyZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVMaXN0RWxlbWVudChkcm9wZG93bkluZm86IERyb3BEb3duSW5mbyk6SFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZHJvcGRvd25MaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xyXG4gICAgZHJvcGRvd25MaXN0LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3QtYm94X19saXN0XCIpO1xyXG5cclxuICAgIGRyb3Bkb3duSW5mby5kcm9wRG93bkxpc3QuZm9yRWFjaCgoZHJvcGRvd25JdGVtSW5mbzogRHJvcERvd25JdGVtSW5mbykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LWJveF9fb3B0aW9uXCIpO1xyXG4gICAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBkcm9wZG93bkl0ZW1JbmZvLmlkKTtcclxuICAgICAgICBsYWJlbC5pbm5lclRleHQgPSBkcm9wZG93bkl0ZW1JbmZvLnRleHQ7XHJcblxyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKGxhYmVsKTtcclxuXHJcbiAgICAgICAgZHJvcGRvd25MaXN0LmFwcGVuZENoaWxkKGxpKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICByZXR1cm4gZHJvcGRvd25MaXN0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ3VzdG9tRHJvcERvd24oZHJvcGRvd25JbmZvOiBEcm9wRG93bkluZm8pOkhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGRyb3Bkb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3QtYm94XCIpO1xyXG4gICAgZHJvcGRvd24uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIxXCIpO1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnQgPSBjcmVhdGVDdXJyZW50RWxlbWVudChkcm9wZG93bkluZm8pO1xyXG4gICAgLy8gaWYgKGRyb3Bkb3duSW5mby52YXJpYWJsZU5hbWUgPT09ICdyYWlkX2R1bmdlb24nKSB7XHJcbiAgICAvLyAgICAgY3VycmVudC5jbGFzc0xpc3QuYWRkKCdmb2N1c3NlZCcpO1xyXG4gICAgLy8gfVxyXG4gICAgZHJvcGRvd24uYXBwZW5kQ2hpbGQoY3VycmVudCk7XHJcblxyXG4gICAgY29uc3QgbGlzdCA9IGNyZWF0ZUxpc3RFbGVtZW50KGRyb3Bkb3duSW5mbyk7XHJcbiAgICBkcm9wZG93bi5hcHBlbmRDaGlsZChsaXN0KTtcclxuXHJcbiAgICBjdXJyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBjdXJyZW50LmNsYXNzTGlzdC50b2dnbGUoJ2ZvY3Vzc2VkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkcm9wZG93bi5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKGUpID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGN1cnJlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXNzZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkcm9wZG93bjtcclxufVxyXG4iLCJpbnRlcmZhY2UgVGFsZW50SXRlbSB7XHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBpY29uOiBzdHJpbmcsXHJcbiAgICBjb3VudDogbnVtYmVyLFxyXG4gICAgcGVyY2VudDogbnVtYmVyLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGJvb2xlYW5cclxufVxyXG5cclxuaW50ZXJmYWNlIFRhbGVudExldmVsIHtcclxuICAgIGxldmVsOiBudW1iZXIsXHJcbiAgICB0YWxlbnRJdGVtTGlzdDogVGFsZW50SXRlbVtdLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGJvb2xlYW5cclxufVxyXG5cclxuaW50ZXJmYWNlIFRhbGVudFRhYmxlIHtcclxuICAgIHRhbGVudExldmVsTGlzdDogVGFsZW50TGV2ZWxbXVxyXG59XHJcblxyXG5jb25zdCBnZXRDb2xvckZvclBlcmNlbnRhZ2UgPSBmdW5jdGlvbihwY3Q6IG51bWJlcikge1xyXG4gICAgY29uc3QgcGN0VXBwZXIgPSAocGN0IDwgNTAgPyBwY3QgOiBwY3QgLSA1MCkgLyA1MDtcclxuICAgIGNvbnN0IHBjdExvd2VyID0gMSAtIHBjdFVwcGVyO1xyXG4gICAgY29uc3QgciA9IE1hdGguZmxvb3IoMjIyICogcGN0TG93ZXIgKyAocGN0IDwgNTAgPyAyMjIgOiAwKSAqIHBjdFVwcGVyKTtcclxuICAgIGNvbnN0IGcgPSBNYXRoLmZsb29yKChwY3QgPCA1MCA/IDAgOiAyMjIpICogcGN0TG93ZXIgKyAyMjIgKiBwY3RVcHBlcik7XHJcbiAgICByZXR1cm4gXCIjXCIgKyAoKDEgPDwgMjQpIHwgKHIgPDwgMTYpIHwgKGcgPDwgOCkgfCAweDAwKS50b1N0cmluZygxNikuc2xpY2UoMSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVRhbGVudFJvd0VsZW1lbnQodGFsZW50TGV2ZWw6IFRhbGVudExldmVsLCB0cmVlTW9kZTogYm9vbGVhbik6SFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgdGFsZW50TGV2ZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRhbGVudExldmVsRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGFsZW50LXJvd1wiKTtcclxuICAgIHRhbGVudExldmVsRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNlbGVjdGVkXCIsIHRhbGVudExldmVsLmlzX3NlbGVjdGVkID8gXCJ5ZXNcIiA6IFwibm9cIik7XHJcblxyXG4gICAgY29uc3QgbGV2ZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV2ZWwuY2xhc3NMaXN0LmFkZChcIm91dGVyXCIpO1xyXG5cclxuICAgIGNvbnN0IGxldmVsSW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV2ZWxJbm5lci5jbGFzc0xpc3QuYWRkKFwiaW5uZXJcIik7XHJcbiAgICBsZXZlbElubmVyLmlubmVyVGV4dCA9IGAke3RhbGVudExldmVsLmxldmVsfWA7XHJcblxyXG4gICAgbGV2ZWwuYXBwZW5kQ2hpbGQobGV2ZWxJbm5lcik7XHJcbiAgICBcclxuICAgIHRhbGVudExldmVsRWxlbWVudC5hcHBlbmRDaGlsZChsZXZlbCk7XHJcblxyXG4gICAgdGFsZW50TGV2ZWwudGFsZW50SXRlbUxpc3QuZm9yRWFjaCh0YWxlbnRJdGVtID0+IHtcclxuICAgICAgICBjb25zdCB0YWxlbnRJdGVtRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGFsZW50SXRlbUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm91dGVyXCIpO1xyXG4gICAgICAgIHRhbGVudEl0ZW1FbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc2VsZWN0ZWRcIiwgdGFsZW50SXRlbS5pc19zZWxlY3RlZCA/IFwieWVzXCIgOiBcIm5vXCIpO1xyXG4gICAgXHJcbiAgICAgICAgY29uc3QgSW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIElubmVyLmNsYXNzTGlzdC5hZGQoXCJpbm5lclwiKTtcclxuXHJcbiAgICAgICAgaWYgKCF0cmVlTW9kZSkge1xyXG4gICAgICAgICAgICBjb25zdCBwZXJjZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgIHBlcmNlbnQuY2xhc3NMaXN0LmFkZCgncGVyY2VudCcpO1xyXG4gICAgICAgICAgICBwZXJjZW50LnN0eWxlWydjb2xvciddID0gZ2V0Q29sb3JGb3JQZXJjZW50YWdlKHRhbGVudEl0ZW0ucGVyY2VudCk7XHJcbiAgICAgICAgICAgIHBlcmNlbnQuaW5uZXJUZXh0ID0gYCR7dGFsZW50SXRlbS5wZXJjZW50fWA7XHJcbiAgICAgICAgICAgIElubmVyLmFwcGVuZENoaWxkKHBlcmNlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xyXG4gICAgICAgIGljb24uY2xhc3NMaXN0LmFkZChcInRhbGVudC1pY29uXCIpO1xyXG4gICAgICAgIGljb24uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgvaW1nL2luLWdhbWUtd2luZG93L3RhbGVudHMvJHt0YWxlbnRJdGVtLmljb259KWA7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0ZXh0LmlubmVyVGV4dCA9IHRhbGVudEl0ZW0ubmFtZTtcclxuXHJcbiAgICAgICAgSW5uZXIuYXBwZW5kQ2hpbGQoaWNvbik7XHJcbiAgICAgICAgSW5uZXIuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGFsZW50SXRlbUVsZW1lbnQuYXBwZW5kQ2hpbGQoSW5uZXIpO1xyXG4gICAgICAgIHRhbGVudExldmVsRWxlbWVudC5hcHBlbmRDaGlsZCh0YWxlbnRJdGVtRWxlbWVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGFsZW50TGV2ZWxFbGVtZW50O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGFsZW50c1RhYmxlKHRhbGVudFRhYmxlOiBUYWxlbnRUYWJsZSwgdHJlZU1vZGU6IGJvb2xlYW4pOkhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHRhbGVudHNUYWJsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGFsZW50c1RhYmxlRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGFsZW50LXRhYmxlXCIpO1xyXG5cclxuICAgIHRhbGVudFRhYmxlLnRhbGVudExldmVsTGlzdC5mb3JFYWNoKHRhbGVudExldmVsID0+IHtcclxuICAgICAgICBjb25zdCB0YWxlbnRMZXZlbEVsZW1lbnQgPSBjcmVhdGVUYWxlbnRSb3dFbGVtZW50KHRhbGVudExldmVsLCB0cmVlTW9kZSk7XHJcbiAgICAgICAgdGFsZW50c1RhYmxlRWxlbWVudC5hcHBlbmRDaGlsZCh0YWxlbnRMZXZlbEVsZW1lbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRhbGVudHNUYWJsZUVsZW1lbnQ7XHJcbn0iLCIvLyBjb25zdCBmb3J0bml0ZUNsYXNzSWQgPSAyMTIxNjtcclxuY29uc3Qgd293Q2xhc3NJZCA9IDc2NTtcclxuXHJcbmNvbnN0IGludGVyZXN0aW5nRmVhdHVyZXMgPSBbXHJcbiAgJ2NvdW50ZXJzJyxcclxuICAnZGVhdGgnLFxyXG4gICdpdGVtcycsXHJcbiAgJ2tpbGwnLFxyXG4gICdraWxsZWQnLFxyXG4gICdraWxsZXInLFxyXG4gICdsb2NhdGlvbicsXHJcbiAgJ21hdGNoX2luZm8nLFxyXG4gICdtYXRjaCcsXHJcbiAgJ21lJyxcclxuICAncGhhc2UnLFxyXG4gICdyYW5rJyxcclxuICAncmV2aXZlZCcsXHJcbiAgJ3Jvc3RlcicsXHJcbiAgJ3RlYW0nXHJcbl07XHJcblxyXG5jb25zdCB3aW5kb3dOYW1lcyA9IHtcclxuICBpbkdhbWU6ICdpbl9nYW1lJyxcclxuICBkZXNrdG9wOiAnZGVza3RvcCdcclxufTtcclxuXHJcbmNvbnN0IGhvdGtleXMgPSB7XHJcbiAgdG9nZ2xlOiAnc2hvd2hpZGUnXHJcbn07XHJcblxyXG5leHBvcnQge1xyXG4gIHdvd0NsYXNzSWQsXHJcbiAgaW50ZXJlc3RpbmdGZWF0dXJlcyxcclxuICB3aW5kb3dOYW1lcyxcclxuICBob3RrZXlzXHJcbn0iLCJleHBvcnQgY29uc3QgdGVzdENsYXNzTGlzdCA9IFtcclxuICB7IGlkOiBcImRlYXRoLWtuaWdodFwiLCB0ZXh0OiBcIkRlYXRoIEtuaWdodFwiIH0sXHJcbiAgeyBpZDogXCJkZW1vbi1odW50ZXJcIiwgdGV4dDogXCJEZW1vbiBIdW50ZXJcIiB9LFxyXG4gIHsgaWQ6IFwiZHJ1aWRcIiwgdGV4dDogXCJEcnVpZFwiIH0sXHJcbiAgeyBpZDogXCJodW50ZXJcIiwgdGV4dDogXCJIdW50ZXJcIiB9LFxyXG4gIHsgaWQ6IFwibWFnZVwiLCB0ZXh0OiBcIk1hZ2VcIiB9LFxyXG4gIHsgaWQ6IFwibW9ua1wiLCB0ZXh0OiBcIk1vbmtcIiB9LFxyXG4gIHsgaWQ6IFwicGFsYWRpblwiLCB0ZXh0OiBcIlBhbGFkaW5cIiB9LFxyXG4gIHsgaWQ6IFwicHJpZXN0XCIsIHRleHQ6IFwiUHJpZXN0XCIgfSxcclxuICB7IGlkOiBcInJvZ3VlXCIsIHRleHQ6IFwiUm9ndWVcIiB9LFxyXG4gIHsgaWQ6IFwic2hhbWFuXCIsIHRleHQ6IFwiU2hhbWFuXCIgfSxcclxuICB7IGlkOiBcIndhcmxvY2tcIiwgdGV4dDogXCJXYXJsb2NrXCIgfSxcclxuICB7IGlkOiBcIndhcnJpb3JcIiwgdGV4dDogXCJXYXJyaW9yXCIgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB0ZXN0U3BlY3NMaXN0ID0gW1xyXG4gIHsgaWQ6IFwiYmxvb2RcIiwgdGV4dDogXCJCbG9vZFwiIH0sXHJcbiAgeyBpZDogXCJmcm9zdFwiLCB0ZXh0OiBcIkZyb3N0XCIgfSxcclxuICB7IGlkOiBcInVuaG9seVwiLCB0ZXh0OiBcIlVuaG9seVwiIH0sXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdGVzdER1bmdlb25MaXN0ID0gW1xyXG4gIHsgaWQ6IFwiZGUtb3RoZXItc2lkZVwiLCB0ZXh0OiBcImRlIG90aGVyIHNpZGVcIiB9LFxyXG4gIHsgaWQ6IFwiaGFsbHMtb2YtYXRvbmVtZW50XCIsIHRleHQ6IFwiaGFsbHMgb2YgYXRvbmVtZW50XCIgfSxcclxuICB7IGlkOiBcIm1pc3RzLW9mLXRpcm5hLXNjaXRoZVwiLCB0ZXh0OiBcIm1pc3RzIG9mIHRpcm5hIHNjaXRoZVwiIH0sXHJcbiAgeyBpZDogXCJwbGFndWVmYWxsXCIsIHRleHQ6IFwicGxhZ3VlZmFsbFwiIH0sXHJcbiAgeyBpZDogXCJzYW5ndWluZS1kZXB0aHNcIiwgdGV4dDogXCJzYW5ndWluZSBkZXB0aHNcIiB9LFxyXG4gIHsgaWQ6IFwic3BpcmVzLW9mLWFzY2Vuc2lvblwiLCB0ZXh0OiBcInNwaXJlcyBvZiBhc2NlbnNpb25cIiB9LFxyXG4gIHsgaWQ6IFwidGhlLW5lY3JvdGljLXdha2VcIiwgdGV4dDogXCJ0aGUgbmVjcm90aWMgd2FrZVwiIH0sXHJcbiAgeyBpZDogXCJ0aGVhdGVyLW9mLXBhaW5cIiwgdGV4dDogXCJ0aGVhdGVyIG9mIHBhaW5cIiB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRlc3RSYWlkTGlzdCA9IFtcclxuICB7IGlkOiBcImFudG9ydXMtdGhlLWJ1cm5pbmctdGhyb25lXCIsIHRleHQ6IFwiQW50b3J1cywgdGhlIEJ1cm5pbmcgVGhyb25lXCIgfSxcclxuICB7IGlkOiBcImJhdHRsZS1vZi1kYXphcmFsb3JcIiwgdGV4dDogXCJCYXR0bGUgb2YgRGF6YXInYWxvclwiIH0sXHJcbiAgeyBpZDogXCJjYXN0bGUtbmF0aHJpYVwiLCB0ZXh0OiBcIkNhc3RsZSBOYXRocmlhXCIgfSxcclxuICB7IGlkOiBcImNydWNpYmxlLW9mLXN0b3Jtc1wiLCB0ZXh0OiBcIkNydWNpYmxlIG9mIFN0b3Jtc1wiIH0sXHJcbiAgeyBpZDogXCJueWFsdGhhLXRoZS13YWtpbmctY2l0eVwiLCB0ZXh0OiBcIk55J2FsdGhhLCB0aGUgV2FraW5nIENpdHlcIiB9LFxyXG4gIHsgaWQ6IFwidGhlLWVtZXJhbGQtbmlnaHRtYXJlXCIsIHRleHQ6IFwiVGhlIEVtZXJhbGQgTmlnaHRtYXJlXCIgfSxcclxuICB7IGlkOiBcInRoZS1ldGVybmFsLXBhbGFjZVwiLCB0ZXh0OiBcIlRoZSBFdGVybmFsIFBhbGFjZVwiIH0sXHJcbiAgeyBpZDogXCJ0aGUtbmlnaHRob2xkXCIsIHRleHQ6IFwiVGhlIE5pZ2h0aG9sZFwiIH0sXHJcbiAgeyBpZDogXCJ0b21iLW9mLXNhcmdlcmFzXCIsIHRleHQ6IFwiVG9tYiBvZiBTYXJnZXJhc1wiIH0sXHJcbiAgeyBpZDogXCJ0cmlhbC1vZi12YWxvclwiLCB0ZXh0OiBcIlRyaWFsIG9mIFZhbG9yXCIgfSxcclxuICB7IGlkOiBcInVsZGlyXCIsIHRleHQ6IFwiVWxkaXJcIiB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRlc3RLZXlMZXZlbExpc3QgPSBbXHJcbiAgeyBpZDogXCJteXRoaWNcIiwgdGV4dDogXCJNeXRoaWNcIiB9LFxyXG4gIHsgaWQ6IFwiaGVyb2ljXCIsIHRleHQ6IFwiSGVyb2ljXCIgfSxcclxuICB7IGlkOiBcIm5vcm1hbFwiLCB0ZXh0OiBcIk5vcm1hbFwiIH0sXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdGVzdFJhaWRCb3NzTGlzdCA9IFtcclxuICB7IGlkOiBcImFnZ3JhbWFyXCIsIHRleHQ6IFwiQWdncmFtYXJcIiB9LFxyXG4gIHsgaWQ6IFwiYW50b3Jhbi1oaWdoLWNvbW1hbmRcIiwgdGV4dDogXCJBbnRvcmFuIEhpZ2ggQ29tbWFuZFwiIH0sXHJcbiAgeyBpZDogXCJhcmd1cy10aGUtdW5tYWtlclwiLCB0ZXh0OiBcIkFyZ3VzIHRoZSBVbm1ha2VyXCIgfSxcclxuICB7IGlkOiBcImVvbmFyLXRoZS1saWZlLWJpbmRlclwiLCB0ZXh0OiBcIkVvbmFyIHRoZSBMaWZlLUJpbmRlclwiIH0sXHJcbiAgeyBpZDogXCJmZWxob3VuZHMtb2Ytc2FyZ2VyYXNcIiwgdGV4dDogXCJGZWxob3VuZHMgb2YgU2FyZ2VyYXNcIiB9LFxyXG4gIHsgaWQ6IFwiZ2Fyb3RoaS13b3JsZGJyZWFrZXJcIiwgdGV4dDogXCJHYXJvdGhpIFdvcmxkYnJlYWtlclwiIH0sXHJcbiAgeyBpZDogXCJpbW9uYXItdGhlLXNvdWxodW50ZXJcIiwgdGV4dDogXCJJbW9uYXIgdGhlIFNvdWxodW50ZXJcIiB9LFxyXG4gIHsgaWQ6IFwia2luJ2dhcm90aFwiLCB0ZXh0OiBcIktpbidnYXJvdGhcIiB9LFxyXG4gIHsgaWQ6IFwicG9ydGFsLWtlZXBlci1oYXNhYmVsXCIsIHRleHQ6IFwiUG9ydGFsIEtlZXBlciBIYXNhYmVsXCIgfSxcclxuICB7IGlkOiBcInRoZS1jb3Zlbi1vZi1zaGl2YXJyYVwiLCB0ZXh0OiBcIlRoZSBDb3ZlbiBvZiBTaGl2YXJyYVwiIH0sXHJcbiAgeyBpZDogXCJ2YXJpbWF0aHJhc1wiLCB0ZXh0OiBcIlZhcmltYXRocmFzXCIgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB0ZXN0VGFsZW50c0luZm8gPSBbXHJcbiAge1xyXG4gICAgbGV2ZWw6IDE1LFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiSGVhcnRicmVha2VyXCIsXHJcbiAgICAgICAgaWNvbjogXCJzcGVsbF9kZWF0aGtuaWdodF9kZWF0aHN0cmlrZS5qcGdcIixcclxuICAgICAgICBjb3VudDogMjczMCxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiQmxvb2Rkcmlua2VyXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2FuaW11c2RyYXcuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDQwMCxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiVG9tYnN0b25lXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2ZpZWduZGVhZC5qcGdcIixcclxuICAgICAgICBjb3VudDogODMsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIF0sXHJcbiAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiAyNSxcclxuICAgIHRhbGVudEl0ZW1MaXN0OiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlJhcGlkIERlY29tcG9zaXRpb25cIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfZGVhdGhrbmlnaHRfZGVhdGhzaXBob24yLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA1NCxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiSGVtb3N0YXNpc1wiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9kZWF0aHdpbmdfYmxvb2Rjb3JydXB0aW9uX2VhcnRoLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAzMTQ0LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJDb25zdW1wdGlvblwiLFxyXG4gICAgICAgIGljb246IFwiaW52X2F4ZV8yaF9hcnRpZmFjdG1hd19kXzAxLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAxNSxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbGV2ZWw6IDMwLFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiRm91bCBCdWx3YXJrXCIsXHJcbiAgICAgICAgaWNvbjogXCJpbnZfYXJtb3Jfc2hpZWxkX25heHhyYW1hc19kXzAyLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA2MDcsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlJlbGlzaCBpbiBCbG9vZFwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9kZWF0aGtuaWdodF9yb2lsaW5nYmxvb2QuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDE2MTMsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkJsb29kIFRhcFwiLFxyXG4gICAgICAgIGljb246IFwic3BlbGxfZGVhdGhrbmlnaHRfYmxvb2R0YXAuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDk5MyxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbGV2ZWw6IDM1LFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiV2lsbCBvZiB0aGUgTmVjcm9wb2xpc1wiLFxyXG4gICAgICAgIGljb246IFwiYWNoaWV2ZW1lbnRfYm9zc19rZWx0aHV6YWRfMDEuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDMxMTMsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIkFudGktTWFnaWMgQmFycmllclwiLFxyXG4gICAgICAgIGljb246IFwic3BlbGxfc2hhZG93X2FudGltYWdpY3NoZWxsLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA5MixcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiTWFyayBvZiBCbG9vZFwiLFxyXG4gICAgICAgIGljb246IFwiYWJpbGl0eV9odW50ZXJfcmFwaWRraWxsaW5nLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiA4LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgfSxcclxuICB7XHJcbiAgICBsZXZlbDogNDAsXHJcbiAgICB0YWxlbnRJdGVtTGlzdDogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJHcmlwIG9mIHRoZSBEZWFkXCIsXHJcbiAgICAgICAgaWNvbjogXCJhYmlsaXR5X2NyZWF0dXJlX2Rpc2Vhc2VfMDUuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDIzNjksXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIlRpZ2h0ZW5pbmcgR3Jhc3BcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfZGVhdGhrbmlnaHRfYW9lZGVhdGhncmlwLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAxODUsXHJcbiAgICAgICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcIldyYWl0aCBXYWxrXCIsXHJcbiAgICAgICAgaWNvbjogXCJpbnZfaGVsbV9wbGF0ZV9yYWlkZGVhdGhrbmlnaHRfcF8wMS5qcGdcIixcclxuICAgICAgICBjb3VudDogNjU5LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaXNfc2VsZWN0ZWQ6IGZhbHNlXHJcbiAgfSxcclxuICB7XHJcbiAgICBsZXZlbDogNDUsXHJcbiAgICB0YWxlbnRJdGVtTGlzdDogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJWb3JhY2lvdXNcIixcclxuICAgICAgICBpY29uOiBcImFiaWxpdHlfaXJvbm1haWRlbnNfd2hpcmxvZmJsb29kLmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAxOTk2LFxyXG4gICAgICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJEZWF0aCBQYWN0XCIsXHJcbiAgICAgICAgaWNvbjogXCJzcGVsbF9zaGFkb3dfZGVhdGhwYWN0LmpwZ1wiLFxyXG4gICAgICAgIGNvdW50OiAxNyxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiQmxvb2R3b3Jtc1wiLFxyXG4gICAgICAgIGljb246IFwic3BlbGxfc2hhZG93X3NvdWxsZWVjaC5qcGdcIixcclxuICAgICAgICBjb3VudDogMTIwMCxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gIH0sXHJcbiAge1xyXG4gICAgbGV2ZWw6IDUwLFxyXG4gICAgdGFsZW50SXRlbUxpc3Q6IFtcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiUHVyZ2F0b3J5XCIsXHJcbiAgICAgICAgaWNvbjogXCJpbnZfbWlzY19zaGFkb3dlZ2cuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDY2MSxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiUmVkIFRoaXJzdFwiLFxyXG4gICAgICAgIGljb246IFwic3BlbGxfZGVhdGhrbmlnaHRfYmxvb2RwcmVzZW5jZS5qcGdcIixcclxuICAgICAgICBjb3VudDogMTY2OSxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6IFwiQm9uZXN0b3JtXCIsXHJcbiAgICAgICAgaWNvbjogXCJhY2hpZXZlbWVudF9ib3NzX2xvcmRtYXJyb3dnYXIuanBnXCIsXHJcbiAgICAgICAgY291bnQ6IDg4MyxcclxuICAgICAgICBpc19zZWxlY3RlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIGlzX3NlbGVjdGVkOiBmYWxzZVxyXG4gIH1cclxuXTsiLCJcclxuZXhwb3J0IGNvbnN0IGdldEN1cnJlbnRXaW5kb3cgPSAoKTogUHJvbWlzZTxhbnk+ID0+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2U8YW55PihyZXNvbHZlID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIG92ZXJ3b2xmLndpbmRvd3MuZ2V0Q3VycmVudFdpbmRvdygocmVzOiBhbnkpID0+IHtcclxuICAgICAgICByZXNvbHZlKHJlcy53aW5kb3cpO1xyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdFeGNlcHRpb24gd2hpbGUgZ2V0dGluZyBjdXJyZW50IHdpbmRvdyB3aW5kb3cnKTtcclxuICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRyYWdSZXNpemUgPSAod2luZG93SWQ6IHN0cmluZywgZWRnZTogb3ZlcndvbGYud2luZG93cy5lbnVtcy5XaW5kb3dEcmFnRWRnZSkgPT4ge1xyXG4gIG92ZXJ3b2xmLndpbmRvd3MuZHJhZ1Jlc2l6ZSh3aW5kb3dJZCwgZWRnZSk7XHJcbn1cclxuIiwiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xyXG5cclxuY29uc3QgYXBpID0gYXhpb3MuY3JlYXRlKHtcclxuICAvLyAgIGJhc2VVUkw6IGBodHRwOi8vbG9jYWxob3N0OjUwMDAvYXBpYCxcclxuICBiYXNlVVJMOiBgaHR0cHM6Ly93b3dtZS5nZy9hcGlgLFxyXG4gIGhlYWRlcnM6IHtcclxuICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNldEF1dGhUb2tlbiA9ICh0b2tlbikgPT4ge1xyXG4gIGRlbGV0ZSBhcGkuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bXCJ4LWF1dGgtdG9rZW5cIl07XHJcblxyXG4gIGlmICh0b2tlbikge1xyXG4gICAgYXBpLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uW1wieC1hdXRoLXRva2VuXCJdID0gdG9rZW47XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNwZWNMaXN0ID0gYXN5bmMgKGNsYXNzX25hbWUpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkuZ2V0KGAvZ2V0X3NwZWNfbGlzdGAsIHtcclxuICAgICAgcGFyYW1zOiB7IGNsYXNzOiBjbGFzc19uYW1lIH0sXHJcbiAgICB9KTtcclxuICAgIGlmIChyZXNwb25zZS5kYXRhLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEuc3BlY0xpc3Q7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG4gIHJldHVybiBbXTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXREdW5nZW9uTGlzdCA9IGFzeW5jIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhcGkuZ2V0KGAvZ2V0X2R1bmdlb25fbGlzdGAsIHtcclxuICAgICAgcGFyYW1zOiB7IG1pbjogbWluLCBtYXg6IG1heCB9LFxyXG4gICAgfSk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLmR1bmdlb25MaXN0O1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtdO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJhaWRMaXN0ID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5nZXQoYC9nZXRfcmFpZF9saXN0YCk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJhaWRMaXN0O1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtdO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJhaWRCb3NzTGlzdCA9IGFzeW5jIChyYWlkKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLmdldChgL2dldF9yYWlkX2Jvc3NfbGlzdGAsIHtcclxuICAgICAgcGFyYW1zOiB7IHJhaWQ6IHJhaWQgfSxcclxuICAgIH0pO1xyXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEuc3RhdHVzID09PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yYWlkQm9zc0xpc3Q7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW107XHJcbn07XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRhbGVudEluZm9SZXNwb25zZSB7XHJcbiAgdGFsZW50VGFibGVJbmZvOiBhbnlbXTtcclxuICBsb2dDb3VudDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VGFsZW50VGFibGVJbmZvID0gYXN5bmMgKFxyXG4gIHBhcmFtc1xyXG4pOiBQcm9taXNlPFRhbGVudEluZm9SZXNwb25zZT4gPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5nZXQoYC9nZXRfdGFsZW50X3RhYmxlX2luZm9gLCB7XHJcbiAgICAgIHBhcmFtczogcGFyYW1zLFxyXG4gICAgfSk7XHJcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFsZW50VGFibGVJbmZvOiByZXNwb25zZS5kYXRhLmZhbW91c1RhbGVudEluZm8sXHJcbiAgICAgICAgbG9nQ291bnQ6IHJlc3BvbnNlLmRhdGEubG9nQ291bnQsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGFsZW50VGFibGVJbmZvOiBbXSxcclxuICAgIGxvZ0NvdW50OiAwLFxyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0VG9rZW4gPSBhc3luYyAocGFyYW1zKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5wb3N0KFwiL2F1dGgvYm5ldF90b2tlblwiLCBwYXJhbXMpO1xyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xyXG4gICAgICBzZXRBdXRoVG9rZW4ocmVzLmRhdGEudG9rZW4pO1xyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRDaGFyYWN0ZXJzID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXMgPSBhd2FpdCBhcGkucG9zdChcIi9nZXRfY2hhcmFjdGVyc1wiKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEpvdXJuYWxzID0gYXN5bmMgKGJhdHRsZUlkKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5nZXQoYC9qb3VybmFscz9iYXR0bGVJZD0ke2JhdHRsZUlkfWApO1xyXG4gICAgLy8gY29uc29sZS5sb2cocmVzKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBzdG9yZUpvdXJuYWxzID0gYXN5bmMgKGRhdGEpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLnBvc3QoXCIvam91cm5hbHNcIiwgZGF0YSk7XHJcbiAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlSm91cm5hbHMgPSBhc3luYyAoam91cm5lbElELCBkYXRhKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5wdXQoYC9qb3VybmFscy8ke2pvdXJuZWxJRH1gLCBkYXRhKTtcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiZWRpdGVkIGNhbGwgZnJvbSBhcGlcIik7XHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0b3JlSm91cm5hbENvbnRlbnQgPSBhc3luYyAoaWQsIGRhdGEpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLnBvc3QoYC9qb3VybmFscy8ke2lkfS9jb250ZW50YCwgZGF0YSk7XHJcbiAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlSm91cm5hbENvbnRlbnQgPSBhc3luYyAoam91cm5lbElELCBjb250ZW50SUQpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLmRlbGV0ZShgL2pvdXJuYWxzLyR7am91cm5lbElEfS9jb250ZW50LyR7Y29udGVudElEfWApO1xyXG4gICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpXHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBlZGl0Sm91cm5hbENvbnRlbnQgPSBhc3luYyAoam91cm5lbElELCBjb250ZW50SUQsIGRhdGEpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgYXBpLnB1dChgL2pvdXJuYWxzLyR7am91cm5lbElEfS9jb250ZW50LyR7Y29udGVudElEfWAsIGRhdGEpO1xyXG4gICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgaWYgKHJlcy5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpXHJcbiAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUpvdXJuYWwgPSBhc3luYyAoam91cm5lbElEKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaS5kZWxldGUoYC9qb3VybmFscy8ke2pvdXJuZWxJRH1gKTtcclxuICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxyXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuIiwiaW1wb3J0IHsgY3JlYXRlQ3VzdG9tRHJvcERvd24sIERyb3BEb3duSXRlbUluZm8gfSBmcm9tICcuLi9jb21wb25lbnRzL2Ryb3Bkb3duJztcclxuaW1wb3J0IHsgY3JlYXRlVGFsZW50c1RhYmxlIH0gZnJvbSAnLi4vY29tcG9uZW50cy90YWxlbnRzVGFibGUnO1xyXG5cclxuaW1wb3J0IHsgdGVzdENsYXNzTGlzdCwgdGVzdEtleUxldmVsTGlzdCwgdGVzdFJhaWRCb3NzTGlzdCwgdGVzdER1bmdlb25MaXN0LCB0ZXN0UmFpZExpc3QsIHRlc3RTcGVjc0xpc3QsIHRlc3RUYWxlbnRzSW5mbyB9IGZyb20gJy4uL2luaXQvaW5pdERhdGEnO1xyXG5cclxuaW1wb3J0IHsgZ2V0U3BlY0xpc3QsIGdldER1bmdlb25MaXN0LCBnZXRSYWlkTGlzdCwgZ2V0UmFpZEJvc3NMaXN0LCBnZXRUYWxlbnRUYWJsZUluZm8gfSBmcm9tICcuL2FwaSc7XHJcblxyXG5pbnRlcmZhY2UgU2VhcmNoQ29uZGl0aW9uIHtcclxuICBjbGFzczogc3RyaW5nLFxyXG4gIHNwZWNzOiBzdHJpbmcsXHJcbiAgaXNfZHVuZ2VvbjogYm9vbGVhbixcclxuICByYWlkX2R1bmdlb246IHN0cmluZyxcclxuICBrZXlfbGV2ZWw6IHN0cmluZyxcclxuICByYWlkX2Jvc3M6IHN0cmluZyxcclxuICBrZXlfc3RvbmVfbGV2ZWxfbWluOiBudW1iZXIsXHJcbiAga2V5X3N0b25lX2xldmVsX21heDogbnVtYmVyLFxyXG4gIGFkdmFuY2VkX2ZpbHRlcnM6IGJvb2xlYW4sXHJcbiAgdHJlZV9tb2RlOiBib29sZWFuXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYWxlbnRQaWNrZXIge1xyXG4gIHByaXZhdGUgc2VhcmNoQ29uZGl0aW9uOiBTZWFyY2hDb25kaXRpb247XHJcbiAgcHJpdmF0ZSBmYW1vdXNUYWxlbnRJbmZvOiBhbnk7XHJcbiAgcHJpdmF0ZSBzZWxlY3RlZFRhbGVudFRyZWVJbmRleDogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uID0ge1xyXG4gICAgICBjbGFzczogJ0RlbW9uIEh1bnRlcicsXHJcbiAgICAgIHNwZWNzOiAnSGF2b2MnLFxyXG4gICAgICBpc19kdW5nZW9uOiB0cnVlLFxyXG4gICAgICByYWlkX2R1bmdlb246ICdDYXN0bGUgTmF0aHJpYScsXHJcbiAgICAgIGtleV9sZXZlbDogJ015dGhpYycsXHJcbiAgICAgIHJhaWRfYm9zczogJ1Nocmlla3dpbmcnLFxyXG4gICAgICBrZXlfc3RvbmVfbGV2ZWxfbWluOiAxLFxyXG4gICAgICBrZXlfc3RvbmVfbGV2ZWxfbWF4OiA0NSxcclxuICAgICAgYWR2YW5jZWRfZmlsdGVyczogZmFsc2UsXHJcbiAgICAgIHRyZWVfbW9kZTogZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmZhbW91c1RhbGVudEluZm8gPSB0ZXN0VGFsZW50c0luZm87XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW5pdENvbXBvbmVudHMoKSB7XHJcbiAgICB0aGlzLmluaXREcm9wZG93bnMoKTtcclxuICAgIHRoaXMuaW5pdEtleVN0b25lTGV2ZWxSYW5nZSgpO1xyXG4gICAgdGhpcy5pbml0U3dpdGNoKCk7XHJcblxyXG4gICAgdGhpcy5pbml0VGFsZW50c1RhYmxlKHRoaXMuZmFtb3VzVGFsZW50SW5mbywgMCk7XHJcblxyXG4gICAgdGhpcy5pbml0SW5Qcm9ncmVzc0V2ZW50KCk7XHJcbiAgICB0aGlzLmluaXRUcmVlTW9kZUFjdGlvblBhbmVsRXZlbnQoKTtcclxuXHJcbiAgICAvLyB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0RHJvcERvd25FdmVudExpc3RuZXIobmFtZTogc3RyaW5nKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShuYW1lKS5mb3JFYWNoKGVsZW0gPT4ge1xyXG4gICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uW25hbWVdID0gKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS52YWx1ZTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xyXG4gICAgICAgICAgdGhpcy5yZWxvYWRTcGVjRHJvcGRvd24oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICdyYWlkX2R1bmdlb24nKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2Vvbikge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yZWxvYWRSYWlkQm9zc0Ryb3Bkb3duKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgaW5pdFNlbGVjdCh0aXRsZTogc3RyaW5nLCBwYXJlbnRfaWQ6IHN0cmluZywgZHJvcGRvd25MaXN0OiBEcm9wRG93bkl0ZW1JbmZvW10sIHZhcmlhYmxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXJlbnRfaWQpO1xyXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG4gIFxyXG4gICAgY29uc3QgZWxUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XHJcbiAgICBlbFRpdGxlLmlubmVyVGV4dCA9IHRpdGxlO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsVGl0bGUpO1xyXG4gIFxyXG4gICAgY29uc3QgZWxEcm9wZG93biA9IGNyZWF0ZUN1c3RvbURyb3BEb3duKHtcclxuICAgICAgdmFyaWFibGVOYW1lOiB2YXJpYWJsZU5hbWUsXHJcbiAgICAgIGRyb3BEb3duTGlzdDogZHJvcGRvd25MaXN0XHJcbiAgICB9KTtcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbERyb3Bkb3duKTtcclxuICBcclxuICAgIHRoaXMuaW5pdERyb3BEb3duRXZlbnRMaXN0bmVyKHZhcmlhYmxlTmFtZSk7XHJcbiAgICB0aGlzLnNlYXJjaENvbmRpdGlvblt2YXJpYWJsZU5hbWVdID0gZHJvcGRvd25MaXN0WzBdLnRleHQ7XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgaW5pdERyb3Bkb3ducygpIHtcclxuICAgIHRoaXMuaW5pdFNlbGVjdChcIkNsYXNzXCIsIFwiY2xhc3Mtc2VsZWN0LWJveF9fY29udGFpbmVyXCIsIHRlc3RDbGFzc0xpc3QsICdjbGFzcycpO1xyXG4gICAgdGhpcy5pbml0U2VsZWN0KFwiU3BlY3NcIiwgXCJzcGVjcy1zZWxlY3QtYm94X19jb250YWluZXJcIiwgdGVzdFNwZWNzTGlzdCwgJ3NwZWNzJyk7XHJcbiAgICB0aGlzLmluaXRTZWxlY3QoXCJEdW5nZW9uIExpc3RcIiwgXCJyYWlkX2R1bmdlb24tc2VsZWN0LWJveF9fY29udGFpbmVyXCIsIHRlc3REdW5nZW9uTGlzdCwgJ3JhaWRfZHVuZ2VvbicpO1xyXG4gICAgdGhpcy5pbml0U2VsZWN0KFwiUmFpZCBMZXZlbFwiLCBcImtleV9sZXZlbC1zZWxlY3QtYm94X19jb250YWluZXJcIiwgdGVzdEtleUxldmVsTGlzdCwgJ2tleV9sZXZlbCcpO1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGFzeW5jIHJlbG9hZFNwZWNEcm9wZG93bigpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBzcGVjTGlzdCA9IGF3YWl0IGdldFNwZWNMaXN0KHRoaXMuc2VhcmNoQ29uZGl0aW9uLmNsYXNzKTtcclxuICAgICAgc3BlY0xpc3QgPSBzcGVjTGlzdC5sZW5ndGggPiAwID8gc3BlY0xpc3QgOiB0ZXN0U3BlY3NMaXN0O1xyXG4gICAgICB0aGlzLmluaXRTZWxlY3QoXCJTcGVjc1wiLCBcInNwZWNzLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiLCBzcGVjTGlzdCwgJ3NwZWNzJyk7XHJcbiAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLnNwZWNzID0gc3BlY0xpc3RbMF0udGV4dDtcclxuICBcclxuICAgICAgY29uc3QgYW5pbVBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGVudC1hbmltLXBhbmVsJyk7XHJcbiAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlSW4nKTtcclxuICAgICAgaWYgKCFhbmltUGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdmYWRlT3V0JykpIHtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZU91dCcpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGFzeW5jIHJlbG9hZFJhaWREdW5nZW9uRHJvcGRvd24oKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBhbmltUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFsZW50LWFuaW0tcGFuZWwnKTtcclxuICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVJbicpO1xyXG4gICAgICBpZiAoIWFuaW1QYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZhZGVPdXQnKSkge1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0Jyk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgbGV0IHJhaWREdW5nZW9uTGlzdCA9IFtdO1xyXG4gICAgICBpZiAodGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2Vvbikge1xyXG4gICAgICAgIHJhaWREdW5nZW9uTGlzdCA9IGF3YWl0IGdldER1bmdlb25MaXN0KHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW4sIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXgpO1xyXG4gICAgICAgIHJhaWREdW5nZW9uTGlzdCA9IHJhaWREdW5nZW9uTGlzdC5sZW5ndGggPiAwID8gcmFpZER1bmdlb25MaXN0IDogdGVzdER1bmdlb25MaXN0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJhaWREdW5nZW9uTGlzdCA9IGF3YWl0IGdldFJhaWRMaXN0KCk7XHJcbiAgICAgICAgcmFpZER1bmdlb25MaXN0ID0gcmFpZER1bmdlb25MaXN0Lmxlbmd0aCA+IDAgPyByYWlkRHVuZ2Vvbkxpc3QgOiB0ZXN0UmFpZExpc3Q7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pbml0U2VsZWN0KFxyXG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmlzX2R1bmdlb24gPyBcIkR1bmdlb24gTGlzdFwiIDogXCJSYWlkIExpc3RcIiwgXHJcbiAgICAgICAgXCJyYWlkX2R1bmdlb24tc2VsZWN0LWJveF9fY29udGFpbmVyXCIsIFxyXG4gICAgICAgIHJhaWREdW5nZW9uTGlzdCwgXHJcbiAgICAgICAgJ3JhaWRfZHVuZ2VvbidcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24ucmFpZF9kdW5nZW9uID0gcmFpZER1bmdlb25MaXN0WzBdLnRleHQ7XHJcbiAgXHJcbiAgICAgIGlmICh0aGlzLnNlYXJjaENvbmRpdGlvbi5pc19kdW5nZW9uKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbG9hZFJhaWRCb3NzRHJvcGRvd24oKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBhc3luYyByZWxvYWRSYWlkQm9zc0Ryb3Bkb3duKCkge1xyXG4gICAgY29uc3QgYW5pbVBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGVudC1hbmltLXBhbmVsJyk7XHJcbiAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZUluJyk7XHJcbiAgICBpZiAoIWFuaW1QYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZhZGVPdXQnKSkge1xyXG4gICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZU91dCcpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgbGV0IHJhaWRCb3NzTGlzdCA9IGF3YWl0IGdldFJhaWRCb3NzTGlzdCh0aGlzLnNlYXJjaENvbmRpdGlvbi5yYWlkX2R1bmdlb24pO1xyXG4gICAgcmFpZEJvc3NMaXN0ID0gcmFpZEJvc3NMaXN0Lmxlbmd0aCA+IDAgPyByYWlkQm9zc0xpc3QgOiB0ZXN0UmFpZEJvc3NMaXN0O1xyXG4gIFxyXG4gICAgdGhpcy5pbml0U2VsZWN0KFwiUmFpZCBCb3NzXCIsIFwicmFpZF9ib3NzLXNlbGVjdC1ib3hfX2NvbnRhaW5lclwiLCAgcmFpZEJvc3NMaXN0LCAncmFpZF9ib3NzJyk7XHJcbiAgICB0aGlzLnNlYXJjaENvbmRpdGlvbi5yYWlkX2Jvc3MgPSByYWlkQm9zc0xpc3RbMF0udGV4dDtcclxuICBcclxuICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgYXN5bmMgZHJhd1RhbGVudFRhYmxlKG5vQW5pbT86IGJvb2xlYW4pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGFuaW1QYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxlbnQtYW5pbS1wYW5lbCcpO1xyXG4gICAgICBpZiAoIW5vQW5pbSAmJiAhYW5pbVBhbmVsLmNsYXNzTGlzdC5jb250YWlucygnZmFkZU91dCcpKSB7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXQnKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGdldFRhbGVudFRhYmxlSW5mbyh7XHJcbiAgICAgICAgY2xhc3NfbmFtZTogdGhpcy5zZWFyY2hDb25kaXRpb24uY2xhc3MsIFxyXG4gICAgICAgIHNwZWM6IHRoaXMuc2VhcmNoQ29uZGl0aW9uLnNwZWNzLFxyXG4gICAgICAgIHR5cGU6IHRoaXMuc2VhcmNoQ29uZGl0aW9uLmlzX2R1bmdlb24gPyAnZHVuZ2VvbicgOiAncmFpZCcsXHJcbiAgICAgICAgcmFpZF9kdW5nZW9uOiB0aGlzLnNlYXJjaENvbmRpdGlvbi5yYWlkX2R1bmdlb24sIFxyXG4gICAgICAgIHJhaWRfYm9zczogdGhpcy5zZWFyY2hDb25kaXRpb24ucmFpZF9ib3NzLFxyXG4gICAgICAgIHJhaWRfbGV2ZWw6IHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9sZXZlbCxcclxuICAgICAgICBkdW5nZW9uX21pbl9sZXZlbDogdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbixcclxuICAgICAgICBkdW5nZW9uX21heF9sZXZlbDogdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heCxcclxuICAgICAgICB0cmVlX21vZGU6IHRoaXMuc2VhcmNoQ29uZGl0aW9uLnRyZWVfbW9kZSA/ICd0cmVlJyA6ICdub3JtYWwnXHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICBpZiAodGhpcy5zZWFyY2hDb25kaXRpb24udHJlZV9tb2RlKSB7XHJcbiAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvID0gcmVzcG9uc2UudGFsZW50VGFibGVJbmZvLmxlbmd0aCA+IDAgPyByZXNwb25zZS50YWxlbnRUYWJsZUluZm8gOiBbe3BpY2tfcmF0ZTogMCwgdGFsZW50X3RyZWU6IHRlc3RUYWxlbnRzSW5mb31dO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuaW5pdFRhbGVudHNUYWJsZSh0aGlzLmZhbW91c1RhbGVudEluZm9bMF0udGFsZW50X3RyZWUsIHJlc3BvbnNlLmxvZ0NvdW50LCAwLCB0aGlzLmZhbW91c1RhbGVudEluZm9bMF0ucGlja19yYXRlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm8gPSByZXNwb25zZS50YWxlbnRUYWJsZUluZm8ubGVuZ3RoID4gMCA/IHJlc3BvbnNlLnRhbGVudFRhYmxlSW5mbyA6IHRlc3RUYWxlbnRzSW5mbztcclxuICAgICAgICB0aGlzLmluaXRUYWxlbnRzVGFibGUodGhpcy5mYW1vdXNUYWxlbnRJbmZvLCByZXNwb25zZS5sb2dDb3VudCk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgaWYgKCFub0FuaW0pIHtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZU91dCcpO1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlSW4nKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0S2V5U3RvbmVMZXZlbFJhbmdlKCkge1xyXG4gICAgY29uc3QgZWxlbU1pbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwia2V5LXN0b25lLWxldmVsLW1pblwiKTtcclxuICAgIGNvbnN0IGVsZW1NYXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImtleS1zdG9uZS1sZXZlbC1tYXhcIik7XHJcbiAgICBjb25zdCBlbGVtVGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwia2V5LXN0b25lLWxldmVsLXRleHRcIik7XHJcbiAgXHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZWxlbU1pbikudmFsdWUgPSBgJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWlufWA7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZWxlbU1heCkudmFsdWUgPSBgJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWF4fWA7XHJcbiAgICBlbGVtVGV4dC5pbm5lclRleHQgPSBgJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWlufSAtICR7dGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heH1gO1xyXG4gIFxyXG4gICAgZWxlbU1pbi5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcclxuICAgICAgbGV0IHZhbHVlOm51bWJlciA9IHBhcnNlSW50KCg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCkudmFsdWUpO1xyXG4gICAgICBpZiAodmFsdWUgPj0gdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heCkge1xyXG4gICAgICAgIHZhbHVlID0gdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heCAtIDE7XHJcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmUudGFyZ2V0KS52YWx1ZSA9IGAke3ZhbHVlfWA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbiA9IHZhbHVlO1xyXG4gICAgICBlbGVtVGV4dC5pbm5lclRleHQgPSBgJHt0aGlzLnNlYXJjaENvbmRpdGlvbi5rZXlfc3RvbmVfbGV2ZWxfbWlufSAtICR7dGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21heH1gO1xyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBlbGVtTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMuZHJhd1RhbGVudFRhYmxlKCk7XHJcbiAgICB9KTtcclxuICBcclxuICAgIGVsZW1NYXguYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChlKSA9PiB7XHJcbiAgICAgIGxldCB2YWx1ZTpudW1iZXIgPSBwYXJzZUludCgoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpLnZhbHVlKTtcclxuICAgICAgaWYgKHZhbHVlIDw9IHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW4pIHtcclxuICAgICAgICB2YWx1ZSA9IHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9taW4gKyAxO1xyXG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCkudmFsdWUgPSBgJHt2YWx1ZX1gO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXggPSB2YWx1ZTtcclxuICAgICAgZWxlbVRleHQuaW5uZXJUZXh0ID0gYCR7dGhpcy5zZWFyY2hDb25kaXRpb24ua2V5X3N0b25lX2xldmVsX21pbn0gLSAke3RoaXMuc2VhcmNoQ29uZGl0aW9uLmtleV9zdG9uZV9sZXZlbF9tYXh9YDtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgZWxlbU1heC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoZSkgPT4ge1xyXG4gICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgaW5pdFRhbGVudHNUYWJsZSh0YWxlbnRzSW5mbywgbG9nQ291bnQ6IG51bWJlciwgdHJlZV9pbmRleD86IG51bWJlciwgcGlja19yYXRlPzogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBlbFRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YWxlbnQtcGFuZWwtdGl0bGVcIik7XHJcbiAgICBjb25zdCBlbFRyZWVBY3Rpb25QYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJlZV9tb2RlX2FjdGlvbl9wYW5lbFwiKTtcclxuICBcclxuICAgIGlmICh0aGlzLnNlYXJjaENvbmRpdGlvbi50cmVlX21vZGUpIHtcclxuICAgICAgaWYgKGxvZ0NvdW50ID4gMCkge1xyXG4gICAgICAgIGVsVGl0bGUuaW5uZXJUZXh0ID0gYE1vc3QgcG9wdWxhciB0YWxlbnQgdHJlZXNgO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVsVGl0bGUuaW5uZXJUZXh0ID0gYFdlIHN0aWxsIGRvbid0IGhhdmUgYW55IHJ1bnMgc2Nhbm5lZCBmb3IgdGhpc2A7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgY29uc3QgcGlja1JhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBpY2tfcmF0ZVwiKTtcclxuICAgICAgY29uc3QgdHJlZUluZGV4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmVlX2luZGV4XCIpO1xyXG4gIFxyXG4gICAgICBpZiAoIWVsVHJlZUFjdGlvblBhbmVsLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICBlbFRyZWVBY3Rpb25QYW5lbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBwaWNrUmF0ZS5pbm5lclRleHQgPSBgUGljayBSYXRlIDogJHtwaWNrX3JhdGUgPyBwaWNrX3JhdGUgOiAwfSVgO1xyXG4gICAgICB0cmVlSW5kZXguaW5uZXJUZXh0ID0gYCR7KHRyZWVfaW5kZXggPyB0cmVlX2luZGV4IDogMCkgKyAxfSAvICR7dGhpcy5mYW1vdXNUYWxlbnRJbmZvLmxlbmd0aH1gO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGxvZ0NvdW50ID4gMCkge1xyXG4gICAgICAgIGVsVGl0bGUuaW5uZXJUZXh0ID0gYE1vc3QgcG9wdWxhciB0YWxlbnQgdHJlZXMgZm9yICR7dGhpcy5zZWFyY2hDb25kaXRpb24uc3BlY3N9ICR7dGhpcy5zZWFyY2hDb25kaXRpb24uY2xhc3N9IGluICR7dGhpcy5zZWFyY2hDb25kaXRpb24ucmFpZF9kdW5nZW9ufWA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxUaXRsZS5pbm5lclRleHQgPSBgV2Ugc3RpbGwgZG9uJ3QgaGF2ZSBhbnkgcnVucyBzY2FubmVkIGZvciB0aGlzYDtcclxuICAgICAgfVxyXG4gICAgICBlbFRyZWVBY3Rpb25QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgIH1cclxuICBcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFsZW50LXRhYmxlLWNvbnRhaW5lclwiKTtcclxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuICAgIGNvbnN0IHRhbGVudHNUYWJsZSA9IGNyZWF0ZVRhbGVudHNUYWJsZSh7IHRhbGVudExldmVsTGlzdDogdGFsZW50c0luZm8gfSwgdGhpcy5zZWFyY2hDb25kaXRpb24udHJlZV9tb2RlICk7XHJcbiAgXHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGFsZW50c1RhYmxlKTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0SW5Qcm9ncmVzc0V2ZW50KCkge1xyXG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3b3JrLWluLXByb2dyZXNzJyk7XHJcbiAgICBjb25zdCBtZXNzYWdlUGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZScpO1xyXG4gIFxyXG4gICAgZm9yIChjb25zdCBlbCBvZiBlbGVtZW50cykge1xyXG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGVsLmdldEF0dHJpYnV0ZShcIm1lc3NhZ2VcIik7XHJcbiAgICAgICAgbWVzc2FnZVBhbmVsLmlubmVySFRNTCA9IGA8ZGl2PiR7bWVzc2FnZX08L2Rpdj5gO1xyXG4gICAgICAgIG1lc3NhZ2VQYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbiAgICAgICAgdm9pZCBtZXNzYWdlUGFuZWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgbWVzc2FnZVBhbmVsLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgaW5pdFRyZWVNb2RlQWN0aW9uUGFuZWxFdmVudCgpIHtcclxuICAgIGNvbnN0IGVsVHJlZU1vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV9tb2RlJyk7XHJcbiAgXHJcbiAgICBlbFRyZWVNb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XHJcbiAgICAgIGlmICgoPEhUTUxJbnB1dEVsZW1lbnQ+KGUudGFyZ2V0KSkuY2hlY2tlZCkge1xyXG4gICAgICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLnRyZWVfbW9kZSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDb25kaXRpb24udHJlZV9tb2RlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kcmF3VGFsZW50VGFibGUoKTtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgY29uc3QgZWxQcmV2QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5fcHJldlwiKTtcclxuICBcclxuICAgIGVsUHJldkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4ID4gMCkge1xyXG4gICAgICAgIGNvbnN0IGFuaW1QYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWxlbnQtYW5pbS1wYW5lbCcpO1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlSW4nKTtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZU91dCcpO1xyXG4gIFxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXgtLTtcclxuICAgICAgICB0aGlzLmluaXRUYWxlbnRzVGFibGUoXHJcbiAgICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm9bdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleF0udGFsZW50X3RyZWUsIFxyXG4gICAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvW3RoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXhdLnBpY2tfcmF0ZSwgXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4LCBcclxuICAgICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mb1t0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4XS5waWNrX3JhdGVcclxuICAgICAgICApO1xyXG4gIFxyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlT3V0Jyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5hZGQoJ2ZhZGVJbicpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICBcclxuICAgIGNvbnN0IGVsTmV4dEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuX25leHRcIik7XHJcbiAgXHJcbiAgICBlbE5leHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleCA8IHRoaXMuZmFtb3VzVGFsZW50SW5mby5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgY29uc3QgYW5pbVBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhbGVudC1hbmltLXBhbmVsJyk7XHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVJbicpO1xyXG4gICAgICAgIGFuaW1QYW5lbC5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0Jyk7XHJcbiAgXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleCsrO1xyXG4gICAgICAgIHRoaXMuaW5pdFRhbGVudHNUYWJsZShcclxuICAgICAgICAgIHRoaXMuZmFtb3VzVGFsZW50SW5mb1t0aGlzLnNlbGVjdGVkVGFsZW50VHJlZUluZGV4XS50YWxlbnRfdHJlZSwgXHJcbiAgICAgICAgICB0aGlzLmZhbW91c1RhbGVudEluZm9bdGhpcy5zZWxlY3RlZFRhbGVudFRyZWVJbmRleF0ucGlja19yYXRlLCBcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXgsIFxyXG4gICAgICAgICAgdGhpcy5mYW1vdXNUYWxlbnRJbmZvW3RoaXMuc2VsZWN0ZWRUYWxlbnRUcmVlSW5kZXhdLnBpY2tfcmF0ZVxyXG4gICAgICAgICk7XHJcbiAgXHJcbiAgICAgICAgYW5pbVBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVPdXQnKTtcclxuICAgICAgICBhbmltUGFuZWwuY2xhc3NMaXN0LmFkZCgnZmFkZUluJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIFxyXG4gICAgY29uc3QgZWxSZWZyZXNoQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG5fcmVmcmVzaFwiKTtcclxuICAgIGlmIChlbFJlZnJlc2hCdXR0b24pIHtcclxuICAgICAgZWxSZWZyZXNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmRyYXdUYWxlbnRUYWJsZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBzZXRTd2l0Y2hWYWx1ZShpc19kdW5nZW9uOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhaWRfZHVuZ2Vvbi1zd2l0Y2hfX2NvbnRhaW5lclwiKTtcclxuICAgIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmlzX2R1bmdlb24gPSBpc19kdW5nZW9uO1xyXG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YScsIHRoaXMuc2VhcmNoQ29uZGl0aW9uLmlzX2R1bmdlb24gPyAnZHVuZ2VvbicgOiAncmFpZCcpO1xyXG4gICAgdGhpcy5yZWxvYWRSYWlkRHVuZ2VvbkRyb3Bkb3duKCk7XHJcbiAgXHJcbiAgICBjb25zdCByYW5nZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmdlcl9fY29udGFpbmVyXCIpO1xyXG4gICAgY29uc3QgcmFpZExldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJrZXlfbGV2ZWwtc2VsZWN0LWJveF9fY29udGFpbmVyXCIpO1xyXG4gICAgY29uc3QgcmFpZEJvc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhaWRfYm9zcy1zZWxlY3QtYm94X19jb250YWluZXJcIik7XHJcbiAgXHJcbiAgICByYW5nZXIuc3R5bGUuZGlzcGxheSA9IGlzX2R1bmdlb24gPyAnYmxvY2snIDogJ25vbmUnO1xyXG4gICAgcmFpZExldmVsLnN0eWxlLmRpc3BsYXkgPSBpc19kdW5nZW9uID8gJ25vbmUnIDogJ2Jsb2NrJztcclxuICAgIHJhaWRCb3NzLnN0eWxlLmRpc3BsYXkgPSBpc19kdW5nZW9uID8gJ25vbmUnIDogJ2Jsb2NrJztcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBpbml0U3dpdGNoKCkge1xyXG4gICAgdGhpcy5zZXRTd2l0Y2hWYWx1ZSh0cnVlKTtcclxuICBcclxuICAgIGNvbnN0IGVsU3dpdGNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYWlkX2R1bmdlb24tc3dpdGNoXCIpO1xyXG4gICAgY29uc3QgZWxTd2l0Y2hEdW5nZW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzd2l0Y2hfZHVuZ2VvblwiKTtcclxuICAgIGNvbnN0IGVsU3dpdGNoUmFpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3dpdGNoX3JhaWRcIik7XHJcbiAgXHJcbiAgICBlbFN3aXRjaC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5zZXRTd2l0Y2hWYWx1ZSghdGhpcy5zZWFyY2hDb25kaXRpb24uaXNfZHVuZ2Vvbik7XHJcbiAgICB9KTtcclxuICBcclxuICAgIGVsU3dpdGNoRHVuZ2Vvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5zZXRTd2l0Y2hWYWx1ZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgZWxTd2l0Y2hSYWlkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnNldFN3aXRjaFZhbHVlKGZhbHNlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgT1dHYW1lc0V2ZW50cywgT1dIb3RrZXlzIH0gZnJvbSBcIkBvdmVyd29sZi9vdmVyd29sZi1hcGktdHNcIjtcclxuaW1wb3J0IHsgQXBwV2luZG93IH0gZnJvbSBcIi4uL0FwcFdpbmRvd1wiO1xyXG5pbXBvcnQge1xyXG4gIGhvdGtleXMsXHJcbiAgaW50ZXJlc3RpbmdGZWF0dXJlcyxcclxuICB3aW5kb3dOYW1lcyxcclxuICB3b3dDbGFzc0lkLFxyXG59IGZyb20gXCIuLi9jb25zdHNcIjtcclxuaW1wb3J0IHsgZHJhZ1Jlc2l6ZSwgZ2V0Q3VycmVudFdpbmRvdyB9IGZyb20gXCIuLi9zZXJ2aWNlcy9vdmVyd29sZi5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7XHJcbiAgZGVsZXRlSm91cm5hbCxcclxuICBkZWxldGVKb3VybmFsQ29udGVudCxcclxuICBlZGl0Sm91cm5hbENvbnRlbnQsXHJcbiAgZ2V0Q2hhcmFjdGVycyxcclxuICBnZXRKb3VybmFscyxcclxuICBnZXRUb2tlbixcclxuICBzZXRBdXRoVG9rZW4sXHJcbiAgc3RvcmVKb3VybmFsQ29udGVudCxcclxuICBzdG9yZUpvdXJuYWxzLFxyXG4gIHVwZGF0ZUpvdXJuYWxzLFxyXG59IGZyb20gXCIuLi91dGlscy9hcGlcIjtcclxuaW1wb3J0IENoYXJhY3RlckluZm8gZnJvbSBcIi4uL3V0aWxzL2NoYXJhY3RlckluZm9cIjtcclxuaW1wb3J0IFRhbGVudFBpY2tlciBmcm9tIFwiLi4vdXRpbHMvdGFsZW50UGlja2VyXCI7XHJcbmltcG9ydCBXaW5kb3dTdGF0ZSA9IG92ZXJ3b2xmLndpbmRvd3MuV2luZG93U3RhdGVFeDtcclxuXHJcbi8vIFRoZSB3aW5kb3cgZGlzcGxheWVkIGluLWdhbWUgd2hpbGUgYSBXT1cgZ2FtZSBpcyBydW5uaW5nLlxyXG4vLyBJdCBsaXN0ZW5zIHRvIGFsbCBpbmZvIGV2ZW50cyBhbmQgdG8gdGhlIGdhbWUgZXZlbnRzIGxpc3RlZCBpbiB0aGUgY29uc3RzLnRzIGZpbGVcclxuLy8gYW5kIHdyaXRlcyB0aGVtIHRvIHRoZSByZWxldmFudCBsb2cgdXNpbmcgPHByZT4gdGFncy5cclxuLy8gVGhlIHdpbmRvdyBhbHNvIHNldHMgdXAgQ3RybCtGIGFzIHRoZSBtaW5pbWl6ZS9yZXN0b3JlIGhvdGtleS5cclxuLy8gTGlrZSB0aGUgYmFja2dyb3VuZCB3aW5kb3csIGl0IGFsc28gaW1wbGVtZW50cyB0aGUgU2luZ2xldG9uIGRlc2lnbiBwYXR0ZXJuLlxyXG5jb25zdCBDTElFTlRfSUQgPSBcIjc2NmI4YWFiN2YzZjQ0MDZhNWQ0ODQ0ZjVhMGM2YmQ3XCI7XHJcbmNvbnN0IEFVVEhPUklaRV9FTkRQT0lOVCA9IFwiaHR0cHM6Ly9ldS5iYXR0bGUubmV0L29hdXRoL2F1dGhvcml6ZVwiO1xyXG4vLyBjb25zdCByZWRpcmVjdFVyaSA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvb2F1dGgvY2FsbGJhY2tfb3ZlcndvbGYnO1xyXG5jb25zdCByZWRpcmVjdFVyaSA9IFwiaHR0cHM6Ly93b3dtZS5nZy9vYXV0aC9jYWxsYmFja19vdmVyd29sZlwiO1xyXG5jb25zdCBzY29wZSA9IFtcIndvdy5wcm9maWxlXCIsIFwib3BlbmlkXCJdO1xyXG5cclxuY29uc3QgZGlzY29yZFVSTCA9IFwiaHR0cHM6Ly9kaXNjb3JkLmdnL3J5ZzlDenpyOFpcIjtcclxuXHJcbmNsYXNzIEluR2FtZSBleHRlbmRzIEFwcFdpbmRvdyB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2luc3RhbmNlOiBJbkdhbWU7XHJcbiAgcHJpdmF0ZSBfd293R2FtZUV2ZW50c0xpc3RlbmVyOiBPV0dhbWVzRXZlbnRzO1xyXG4gIHByaXZhdGUgX2V2ZW50c0xvZzogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBfaW5mb0xvZzogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSB0YWxlbnRQaWNrZXI6IFRhbGVudFBpY2tlcjtcclxuICBwcml2YXRlIGlzTG9nZ2VkSW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwcml2YXRlIGJhdHRsZVRhZzogc3RyaW5nO1xyXG4gIHByaXZhdGUgYmF0dGxlSWQ6IHN0cmluZztcclxuICBwcml2YXRlIGJhdHRsZUNyZWQ6IHt9O1xyXG4gIHByaXZhdGUgY2hhcmFjdGVyczogW107XHJcbiAgcHJpdmF0ZSByZWdpb246IHN0cmluZztcclxuICBwcml2YXRlIGNoYXJhY3RlckluZm86IENoYXJhY3RlckluZm87XHJcblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcih3aW5kb3dOYW1lcy5pbkdhbWUpO1xyXG5cclxuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcclxuICAgIGNvbnN0IGV4cGlyZXNJbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZXhwaXJlc0luXCIpO1xyXG5cclxuICAgIGlmICh0b2tlbiAmJiBwYXJzZUludChleHBpcmVzSW4pID4gRGF0ZS5ub3coKSkge1xyXG4gICAgICB0aGlzLmJhdHRsZVRhZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYmF0dGxlVGFnXCIpO1xyXG4gICAgICB0aGlzLmJhdHRsZUlkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJiYXR0bGVJZFwiKTtcclxuICAgICAgdGhpcy5yZWdpb24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInJlZ2lvblwiKTtcclxuXHJcbiAgICAgIHNldEF1dGhUb2tlbih0b2tlbik7XHJcbiAgICAgIHRoaXMuZ2V0VXNlckNoYXJhY3RlckluZm8oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidG9rZW5cIik7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZXhwaXJlc0luXCIpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImJhdHRsZVRhZ1wiKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJiYXR0bGVJZFwiKTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJyZWdpb25cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0QnV0dG9uRXZlbnRzKCk7XHJcbiAgICBvdmVyd29sZi5leHRlbnNpb25zLm9uQXBwTGF1bmNoVHJpZ2dlcmVkLmFkZExpc3RlbmVyKHRoaXMuY2FsbGJhY2tPQXV0aCk7XHJcblxyXG4gICAgdGhpcy50YWxlbnRQaWNrZXIgPSBuZXcgVGFsZW50UGlja2VyKCk7XHJcbiAgICB0aGlzLnRhbGVudFBpY2tlci5pbml0Q29tcG9uZW50cygpO1xyXG4gICAgLy8gdGhpcy5pbml0U2V0dGluZ3NQYW5lbCgpO1xyXG4gICAgdGhpcy5nZXRVc2VySm91cm5hbHMoKTtcclxuICAgIHRoaXMuc3RvcmVVc2VySm91cm5hbHMoKTtcclxuICAgIHRoaXMudXBkYXRlVXNlckpvdXJuYWxzKCk7XHJcbiAgICB0aGlzLnN0b3JlVXNlckpvdXJuYWxDb250ZW50KCk7XHJcbiAgICB0aGlzLnVwZGF0ZVVzZXJKb3VybmFsQ29udGVudCgpO1xyXG4gICAgdGhpcy5fZXZlbnRzTG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJldmVudHNMb2dcIik7XHJcbiAgICB0aGlzLl9pbmZvTG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvTG9nXCIpO1xyXG5cclxuICAgIHRoaXMuc2V0VG9nZ2xlSG90a2V5QmVoYXZpb3IoKTtcclxuICAgIHRoaXMuc2V0VG9nZ2xlSG90a2V5VGV4dCgpO1xyXG5cclxuICAgIHRoaXMuaW5pdERyYWdSZXNpemUoKTtcclxuXHJcbiAgICB0aGlzLl93b3dHYW1lRXZlbnRzTGlzdGVuZXIgPSBuZXcgT1dHYW1lc0V2ZW50cyhcclxuICAgICAge1xyXG4gICAgICAgIG9uSW5mb1VwZGF0ZXM6IHRoaXMub25JbmZvVXBkYXRlcy5iaW5kKHRoaXMpLFxyXG4gICAgICAgIG9uTmV3RXZlbnRzOiB0aGlzLm9uTmV3RXZlbnRzLmJpbmQodGhpcyksXHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyZXN0aW5nRmVhdHVyZXNcclxuICAgICk7XHJcblxyXG4gICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGUpID0+IHtcclxuICAgICAgdGhpcy5zZXRUb2dnbGVIb3RrZXlUZXh0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5zZXRTY2FsZSk7XHJcbiAgICAvLyB0aGlzLnNldFNjYWxlKG51bGwpO1xyXG4gICAgdGhpcy5pbml0V2luZG93U2l6ZUFuZFBvc2l0aW9uKCk7XHJcblxyXG4gICAgdGhpcy50YWxlbnRQaWNrZXIgPSBuZXcgVGFsZW50UGlja2VyKCk7XHJcbiAgICB0aGlzLnRhbGVudFBpY2tlci5pbml0Q29tcG9uZW50cygpO1xyXG5cclxuICAgIHRoaXMuaW5pdE9wYWNpdHlSYW5nZXIoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRCYXR0bGVUYWcoYmF0dGxlVGFnKSB7XHJcbiAgICB0aGlzLmJhdHRsZVRhZyA9IGJhdHRsZVRhZztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRCYXR0bGVJZChiYXR0bGVJZCkge1xyXG4gICAgdGhpcy5iYXR0bGVJZCA9IGJhdHRsZUlkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldEJhdHRsZUNyZWQoYmF0dGxlQ3JlZCkge1xyXG4gICAgdGhpcy5iYXR0bGVDcmVkID0gYmF0dGxlQ3JlZDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRDaGFyYWN0ZXJzKGNoYXJhY3RlcnMpIHtcclxuICAgIHRoaXMuY2hhcmFjdGVycyA9IGNoYXJhY3RlcnM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0UmVnaW9uKHJlZ2lvbikge1xyXG4gICAgdGhpcy5yZWdpb24gPSByZWdpb247XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRCdXR0b25FdmVudHMoKSB7XHJcbiAgICB0aGlzLmFjdGl2ZVNjcmVlbigpO1xyXG4gICAgY29uc3QgcGpCdG5Mb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImJ0bi1wZXJzb25hbC1qb3VybmFsLW9uTG9nZ2VkaW5cIlxyXG4gICAgKTtcclxuICAgIHBqQnRuTG9naW4uY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xyXG5cclxuICAgIGNvbnN0IGxvZ2luQnV0dG9uMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLXBlcnNvbmFsLWpvdXJuYWxcIik7XHJcbiAgICBsb2dpbkJ1dHRvbjIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNjb3Blc1N0cmluZyA9IGVuY29kZVVSSUNvbXBvbmVudChzY29wZS5qb2luKFwiIFwiKSk7XHJcbiAgICAgIGNvbnN0IHJlZGlyZWN0VXJpU3RyaW5nID0gZW5jb2RlVVJJQ29tcG9uZW50KHJlZGlyZWN0VXJpKTtcclxuICAgICAgY29uc3QgYXV0aG9yaXplVXJsID0gYCR7QVVUSE9SSVpFX0VORFBPSU5UfT9jbGllbnRfaWQ9JHtDTElFTlRfSUR9JnNjb3BlPSR7c2NvcGVzU3RyaW5nfSZyZWRpcmVjdF91cmk9JHtyZWRpcmVjdFVyaVN0cmluZ30mcmVzcG9uc2VfdHlwZT1jb2RlYDtcclxuICAgICAgb3ZlcndvbGYudXRpbHMub3BlblVybEluRGVmYXVsdEJyb3dzZXIoYXV0aG9yaXplVXJsKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGFjdGl2ZVNjcmVlbigpIHtcclxuICAgIGNvbnN0IHBlcnNvbmFsSm91cm5hbENvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcIi5wZXJzb25hbC1qb3VybmFsLWNvbnRlbnRcIlxyXG4gICAgKTtcclxuICAgIGNvbnN0IHBlcnNvbmFsSm91cm5hbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGVyc29uYWwtam91cm5hbFwiKTtcclxuICAgIGNvbnN0IHRhbGVudFBpY2tlckNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcIi50YWxlbnQtcGlja2VyLWNvbnRlbnRcIlxyXG4gICAgKTtcclxuICAgIGNvbnN0IHRhbGVudFBpY2tlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFsZW50LXBpY2tlclwiKTtcclxuXHJcbiAgICBjb25zdCBtZW51SXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibWVudS1pdGVtXCIpO1xyXG4gICAgQXJyYXkuZnJvbShtZW51SXRlbXMpLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICBpZiAoZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoXCJ3b3JrLWluLXByb2dyZXNzXCIpKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtLmlkID09IFwiYnRuLXBlcnNvbmFsLWpvdXJuYWwtb25Mb2dnZWRpblwiKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvXCIpO1xyXG5cclxuICAgICAgICAgIHBlcnNvbmFsSm91cm5hbENvbnRlbnQuY2xhc3NMaXN0LmFkZChcImVuYWJsZWRcIik7XHJcbiAgICAgICAgICBwZXJzb25hbEpvdXJuYWxDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgIHRhbGVudFBpY2tlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZShcImVuYWJsZWRcIik7XHJcbiAgICAgICAgICB0YWxlbnRQaWNrZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IEhlbGxvXCIpO1xyXG4gICAgICAgICAgdGFsZW50UGlja2VyQ29udGVudC5jbGFzc0xpc3QuYWRkKFwiZW5hYmxlZFwiKTtcclxuICAgICAgICAgIHRhbGVudFBpY2tlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgcGVyc29uYWxKb3VybmFsQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZW5hYmxlZFwiKTtcclxuICAgICAgICAgIHBlcnNvbmFsSm91cm5hbENvbnRlbnQuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgYXN5bmMgc2V0Q3VycmVudEhvdGtleVRvSW5wdXQoKSB7XHJcbiAgICBjb25zdCBlbElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3RrZXktZWRpdG9yXCIpO1xyXG4gICAgY29uc3QgaG90a2V5VGV4dCA9IGF3YWl0IE9XSG90a2V5cy5nZXRIb3RrZXlUZXh0KFxyXG4gICAgICBob3RrZXlzLnRvZ2dsZSxcclxuICAgICAgd293Q2xhc3NJZFxyXG4gICAgKTtcclxuICAgIGVsSW5wdXQuaW5uZXJUZXh0ID0gaG90a2V5VGV4dDtcclxuICAgIHJldHVybiBob3RrZXlUZXh0O1xyXG4gIH1cclxuICBwcml2YXRlIGluaXRIb3RrZXlJbnB1dCgpIHtcclxuICAgIHRoaXMuc2V0Q3VycmVudEhvdGtleVRvSW5wdXQoKTtcclxuXHJcbiAgICBjb25zdCBlbElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3RrZXktZWRpdG9yXCIpO1xyXG4gICAgY29uc3QgZWxDbG9zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG90a2V5LWNsb3NlXCIpO1xyXG5cclxuICAgIGxldCBrZXlzID0gW1wiXCIsIFwiXCIsIFwiXCIsIFwiXCJdO1xyXG5cclxuICAgIGVsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlKSA9PiB7XHJcbiAgICAgIGVsSW5wdXQuaW5uZXJUZXh0ID0gXCJDaG9vc2UgS2V5XCI7XHJcbiAgICAgIGtleXMgPSBbXCJcIiwgXCJcIiwgXCJcIiwgXCJcIl07XHJcbiAgICB9KTtcclxuXHJcbiAgICBlbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c291dFwiLCAoZSkgPT4ge1xyXG4gICAgICB0aGlzLnNldEN1cnJlbnRIb3RrZXlUb0lucHV0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBlbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwia2V5ZG93blwiLCBlLmtleSwgZS5tZXRhS2V5LCBlLnNoaWZ0S2V5LCBlLmFsdEtleSwgZS5jdHJsS2V5KTtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoZS5rZXkgPT09IFwiU2hpZnRcIikge1xyXG4gICAgICAgIGtleXNbMl0gPSBcIlNoaWZ0K1wiO1xyXG4gICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBcIkFsdFwiKSB7XHJcbiAgICAgICAga2V5c1swXSA9IFwiQWx0K1wiO1xyXG4gICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBcIkNvbnRyb2xcIikge1xyXG4gICAgICAgIGtleXNbMV0gPSBcIkN0cmwrXCI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAga2V5c1szXSA9IGUua2V5O1xyXG4gICAgICAgIGNvbnN0IG5ld0hvdGtleSA9IHtcclxuICAgICAgICAgIG5hbWU6IGhvdGtleXMudG9nZ2xlLFxyXG4gICAgICAgICAgZ2FtZUlkOiA3NjUsXHJcbiAgICAgICAgICB2aXJ0dWFsS2V5OiBlLmtleUNvZGUsXHJcbiAgICAgICAgICBtb2RpZmllcnM6IHtcclxuICAgICAgICAgICAgY3RybDogZS5jdHJsS2V5LFxyXG4gICAgICAgICAgICBzaGlmdDogZS5zaGlmdEtleSxcclxuICAgICAgICAgICAgYWx0OiBlLmFsdEtleSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICBlbENsb3NlLmZvY3VzKCk7XHJcbiAgICAgICAgb3ZlcndvbGYuc2V0dGluZ3MuaG90a2V5cy5hc3NpZ24obmV3SG90a2V5LCAoZSkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJhc3NpZ246IFwiLCBuZXdIb3RrZXksIGUpO1xyXG4gICAgICAgICAgdGhpcy5zZXRDdXJyZW50SG90a2V5VG9JbnB1dCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsSW5wdXQuaW5uZXJUZXh0ID0ga2V5cy5qb2luKFwiXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBjb25zb2xlLmxvZyhcImtleXVwXCIsIGUua2V5LCBlLm1ldGFLZXksIGUuc2hpZnRLZXksIGUuYWx0S2V5LCBlLmN0cmxLZXkpO1xyXG4gICAgICBpZiAoZS5rZXkgPT09IFwiU2hpZnRcIikge1xyXG4gICAgICAgIGtleXNbMl0gPSBcIlwiO1xyXG4gICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBcIkFsdFwiKSB7XHJcbiAgICAgICAga2V5c1swXSA9IFwiXCI7XHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IFwiQ29udHJvbFwiKSB7XHJcbiAgICAgICAga2V5c1sxXSA9IFwiXCI7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgc3RySG90a2V5ID0ga2V5cy5qb2luKFwiXCIpO1xyXG4gICAgICBlbElucHV0LmlubmVyVGV4dCA9IHN0ckhvdGtleSA9PT0gXCJcIiA/IFwiQ2hvb3NlIEtleVwiIDogc3RySG90a2V5O1xyXG4gICAgfSk7XHJcblxyXG4gICAgZWxDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgY29uc3QgaG90a2V5ID0ge1xyXG4gICAgICAgIG5hbWU6IGhvdGtleXMudG9nZ2xlLFxyXG4gICAgICAgIGdhbWVJZDogNzY1LFxyXG4gICAgICB9O1xyXG4gICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLnVuYXNzaWduKGhvdGtleSwgKGUpID0+IHtcclxuICAgICAgICB0aGlzLnNldEN1cnJlbnRIb3RrZXlUb0lucHV0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgYXN5bmMgZ2V0VXNlckNoYXJhY3RlckluZm8oKSB7XHJcbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLW92ZXJsYXlcIik7XHJcbiAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBnZXRDaGFyYWN0ZXJzKCk7XHJcblxyXG4gICAgdGhpcy5yZWdpb24gPSByZXNwb25zZS5yZWdpb247XHJcbiAgICB0aGlzLmNoYXJhY3RlcnMgPSByZXNwb25zZS5jaGFyYWN0ZXJzO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5jaGFyYWN0ZXJzKTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmVnaW9uXCIsIHRoaXMucmVnaW9uKTtcclxuICAgIHRoaXMub25Mb2dnZWRJbigpO1xyXG5cclxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgY2FsbGJhY2tPQXV0aCh1cmxzY2hlbWUpIHtcclxuICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmctb3ZlcmxheVwiKTtcclxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuXHJcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGRlY29kZVVSSUNvbXBvbmVudCh1cmxzY2hlbWUucGFyYW1ldGVyKSk7XHJcbiAgICBjb25zdCBjb2RlID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJjb2RlXCIpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHVzZXJJbmZvID0gYXdhaXQgZ2V0VG9rZW4oeyBjb2RlLCBpc092ZXJ3b2xmOiB0cnVlIH0pO1xyXG4gICAgICBjb25zdCB0b2tlbiA9IHVzZXJJbmZvLnRva2VuO1xyXG4gICAgICBjb25zdCBleHBpcmVzSW4gPSBEYXRlLm5vdygpICsgdXNlckluZm8uZXhwaXJlc0luICogMTAwMDtcclxuXHJcbiAgICAgIGNvbnN0IGluR2FtZSA9IEluR2FtZS5pbnN0YW5jZSgpO1xyXG5cclxuICAgICAgaW5HYW1lLnNldEJhdHRsZVRhZyh1c2VySW5mby5iYXR0bGVUYWcpO1xyXG4gICAgICBpbkdhbWUuc2V0QmF0dGxlSWQodXNlckluZm8uYmF0dGxlSWQpO1xyXG4gICAgICBpbkdhbWUuc2V0QmF0dGxlQ3JlZCh1c2VySW5mby5iYXR0bGVDcmVkKTtcclxuICAgICAgaW5HYW1lLnNldENoYXJhY3RlcnModXNlckluZm8uY2hhcmFjdGVycyk7XHJcbiAgICAgIGluR2FtZS5zZXRSZWdpb24odXNlckluZm8ucmVnaW9uKTtcclxuXHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9rZW5cIiwgdG9rZW4pO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImV4cGlyZXNJblwiLCBleHBpcmVzSW4udG9TdHJpbmcoKSk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYmF0dGxlVGFnXCIsIHVzZXJJbmZvLmJhdHRsZVRhZyk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYmF0dGxlSWRcIiwgdXNlckluZm8uYmF0dGxlSWQpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJhdHRsZUNyZWRcIiwgdXNlckluZm8uYmF0dGxlQ3JlZCk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicmVnaW9uXCIsIHVzZXJJbmZvLnJlZ2lvbik7XHJcblxyXG4gICAgICBpbkdhbWUub25Mb2dnZWRJbigpO1xyXG4gICAgICBpbkdhbWUuZ2V0VXNlckpvdXJuYWxzKCk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG5cclxuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbGVhckpvdXJuYWxVSSgpIHtcclxuICAgIGNvbnN0IG9sZEpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsLXRhYnNcIik7XHJcbiAgICBvbGRKb3VybmFsTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uTG9nZ2VkSW4oKSB7XHJcbiAgICB0aGlzLmlzTG9nZ2VkSW4gPSB0cnVlO1xyXG5cclxuICAgIC8vIGNvbnN0IGVsQnRuTG9nb3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbG9nb3V0XCIpO1xyXG4gICAgLy8gZWxCdG5Mb2dvdXQuY2xhc3NMaXN0LmFkZChcImVuYWJsZWRcIik7XHJcblxyXG4gICAgY29uc3QgcGpCdG5Mb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImJ0bi1wZXJzb25hbC1qb3VybmFsLW9uTG9nZ2VkaW5cIlxyXG4gICAgKTtcclxuICAgIHBqQnRuTG9naW4uY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gICAgcGpCdG5Mb2dpbi5jbGFzc0xpc3QuYWRkKFwiZW5hYmxlZFwiKTtcclxuXHJcbiAgICBjb25zdCBwakJ0bkxvZ291dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLXBlcnNvbmFsLWpvdXJuYWxcIik7XHJcbiAgICBwakJ0bkxvZ291dC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcbiAgICBwakJ0bkxvZ291dC5jbGFzc0xpc3QucmVtb3ZlKFwiZW5hYmxlZFwiKTtcclxuXHJcbiAgICAvLyB0aGlzLmRyYXdVc2VySW5mbygpO1xyXG4gICAgLy8gdGhpcy5kcmF3U3ViUGFuZWwoKTtcclxuXHJcbiAgICAvLyB0aGlzLmdldFVzZXJKb3VybmFscygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBnZXRVc2VySm91cm5hbHMoKSB7XHJcbiAgICBsZXQgcmVzcG9uc2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJhdHRsZUlkXCIpXHJcbiAgICAgID8gYXdhaXQgZ2V0Sm91cm5hbHModGhpcy5iYXR0bGVJZC50b1N0cmluZygpKVxyXG4gICAgICA6IG51bGw7XHJcbiAgICBjb25zdCBqb3VybmFsTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbC10YWJzXCIpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzcG9uc2U/LmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc29sZS5sb2coXCJsb29wIHN0YXJ0ZWRcIiwgaSk7XHJcbiAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGJ0bi5pbm5lckhUTUwgPSByZXNwb25zZS5kYXRhW2ldLm5hbWU7XHJcbiAgICAgIGJ0bi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIHJlc3BvbnNlLmRhdGFbaV0uX2lkKTtcclxuICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoXCJ0YWItbGlua1wiKTtcclxuICAgICAgbGV0IGRlbGV0ZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZGVsZXRlU3Bhbi5jbGFzc0xpc3QuYWRkKFwibWF0ZXJpYWwtaWNvbnNcIik7XHJcbiAgICAgIGRlbGV0ZVNwYW4uY2xhc3NMaXN0LmFkZChcInRleHRTcGFuMlwiKTtcclxuICAgICAgZGVsZXRlU3Bhbi5pbm5lckhUTUwgPSBcImRlbGV0ZVwiO1xyXG4gICAgICBqb3VybmFsTGlzdC5hcHBlbmRDaGlsZChidG4pO1xyXG4gICAgICBidG4uYXBwZW5kQ2hpbGQoZGVsZXRlU3Bhbik7XHJcblxyXG4gICAgICB2YXIgZWRpdEpvdXJuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZWRpdEpvdXJuZWwuY2xhc3NMaXN0LmFkZChcIm1hdGVyaWFsLWljb25zXCIpO1xyXG4gICAgICBlZGl0Sm91cm5lbC5jbGFzc0xpc3QuYWRkKFwiZWRpdFNwYW4yXCIpO1xyXG4gICAgICBlZGl0Sm91cm5lbC5pbm5lckhUTUwgPSBcImVkaXRcIjtcclxuICAgICAgYnRuLmFwcGVuZENoaWxkKGVkaXRKb3VybmVsKTtcclxuXHJcbiAgICAgIGVkaXRKb3VybmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnQ7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXQtam91cm5lbFwiKTtcclxuICAgICAgICBpZiAoZWxlbXMgIT09IG51bGwpIHtcclxuICAgICAgICAgIGVsZW1zLmNsYXNzTGlzdC5yZW1vdmUoXCJlZGl0LWpvdXJuZWxcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJlZGl0LWpvdXJuZWxcIik7XHJcbiAgICAgICAgY29uc3QgZWRpdE1vZGFsT3BlbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlCdG5FZGl0XCIpO1xyXG4gICAgICAgIGVkaXRNb2RhbE9wZW5CdXR0b24uY2xpY2soKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIiwgcmVzcG9uc2UuZGF0YVtpXS5uYW1lKTtcclxuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0MlwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9XHJcbiAgICAgICAgICByZXNwb25zZS5kYXRhW2ldLm5hbWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvYmplY3RcIiwgcmVzcG9uc2UuZGF0YVtpXSk7XHJcbiAgICAgICAgY29uc3QgY2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFjY2VwdFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgIGNiLnZhbHVlID0gcmVzcG9uc2UuZGF0YVtpXS50ZW1wbGF0ZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZWxldGVTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgZGVsZXRlSm91cm5hbChyZXNwb25zZS5kYXRhW2ldLl9pZCk7XHJcbiAgICAgICAgdGhpcy5jbGVhckpvdXJuYWxVSSgpO1xyXG4gICAgICAgIC8vIGNvbnN0IG9sZEpvdXJuYWxMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pvdXJuYWwtdGFicycpO1xyXG4gICAgICAgIC8vIG9sZEpvdXJuYWxMaXN0LmlubmVySFRNTCA9ICcnO1xyXG4gICAgICAgIHJlc3BvbnNlLmRhdGEgPSBbXTtcclxuICAgICAgICB0aGlzLmdldFVzZXJKb3VybmFscygpO1xyXG5cclxuICAgICAgICBjb25zdCBqb3VybmFsQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICBcImpvdXJuYWwtaXRlbS1jb250YWluZXJcIlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgam91cm5hbENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xyXG4gICAgICAgIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLXRhYlwiKTtcclxuICAgICAgICBpZiAoZWxlbXMgIT09IG51bGwpIHtcclxuICAgICAgICAgIGVsZW1zLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtdGFiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZS10YWJcIik7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRKb3VybmFsID0gcmVzcG9uc2UuZGF0YVtpXTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJlc3BvbnNlIGRhdGFcIiwgcmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coaSwgc2VsZWN0ZWRKb3VybmFsKTtcclxuICAgICAgICBjb25zdCBqb3VybmFsQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICBcImpvdXJuYWwtaXRlbS1jb250YWluZXJcIlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGpvdXJuYWxDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBzZWxlY3RlZEpvdXJuYWwuZGF0YS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBqb3VybmFsSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICBqb3VybmFsSXRlbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGVsZW1lbnQuX2lkKTtcclxuICAgICAgICAgIGpvdXJuYWxJdGVtLmNsYXNzTGlzdC5hZGQoXCJqb3VybmFsLWl0ZW1cIik7XHJcbiAgICAgICAgICBjb25zdCBqb3VybmFsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgIGpvdXJuYWxCdG4uaW5uZXJIVE1MID0gZWxlbWVudC50aXRsZTtcclxuICAgICAgICAgIHZhciB0ZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgdGV4dFNwYW4uY2xhc3NMaXN0LmFkZChcIm1hdGVyaWFsLWljb25zXCIpO1xyXG4gICAgICAgICAgdGV4dFNwYW4uY2xhc3NMaXN0LmFkZChcInRleHRTcGFuXCIpO1xyXG4gICAgICAgICAgdGV4dFNwYW4uaW5uZXJIVE1MID0gXCJkZWxldGVcIjtcclxuICAgICAgICAgIGpvdXJuYWxCdG4uYXBwZW5kQ2hpbGQodGV4dFNwYW4pO1xyXG4gICAgICAgICAgY29uc3Qgam91cm5hbERlc2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuXHJcbiAgICAgICAgICB2YXIgZWRpdFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICAgIGVkaXRTcGFuLmNsYXNzTGlzdC5hZGQoXCJtYXRlcmlhbC1pY29uc1wiKTtcclxuICAgICAgICAgIGVkaXRTcGFuLmNsYXNzTGlzdC5hZGQoXCJlZGl0U3BhblwiKTtcclxuICAgICAgICAgIGVkaXRTcGFuLmlubmVySFRNTCA9IFwiZWRpdFwiO1xyXG4gICAgICAgICAgam91cm5hbEJ0bi5hcHBlbmRDaGlsZChlZGl0U3Bhbik7XHJcblxyXG4gICAgICAgICAgam91cm5hbEJ0bi5jbGFzc0xpc3QuYWRkKFwiYWNjb3JkaW9uXCIpO1xyXG4gICAgICAgICAgaWYgKGpvdXJuYWxEZXNjLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSkge1xyXG4gICAgICAgICAgICBqb3VybmFsRGVzYy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICBqb3VybmFsRGVzYy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgam91cm5hbERlc2MuaW5uZXJIVE1MID0gZWxlbWVudC5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgam91cm5hbERlc2MuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBqb3VybmFsQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChqb3VybmFsRGVzYy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHtcclxuICAgICAgICAgICAgICBqb3VybmFsRGVzYy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgIGpvdXJuYWxEZXNjLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgam91cm5hbERlc2MuaW5uZXJIVE1MID0gZWxlbWVudC5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICBqb3VybmFsRGVzYy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBlZGl0U3Bhbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgRWxlbWVudDtcclxuICAgICAgICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtY29udGVudFwiKTtcclxuICAgICAgICAgICAgaWYgKGVsZW1zICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgZWxlbXMuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZS1jb250ZW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZS1jb250ZW50XCIpO1xyXG4gICAgICAgICAgICBjb25zdCBtb2RhbE9wZW5CdXR0b24gPVxyXG4gICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdENvbnRlbnRCdXR0b25cIik7XHJcbiAgICAgICAgICAgIG1vZGFsT3BlbkJ1dHRvbi5jbGljaygpO1xyXG4gICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0Q29udGVudFRpdGxlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICAgICAgICAgICAgKS52YWx1ZSA9IGVsZW1lbnQudGl0bGU7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdEVkaXRvclwiKS5pbm5lckhUTUwgPVxyXG4gICAgICAgICAgICAgIGVsZW1lbnQuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0ZXh0U3Bhbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZS10YWJcIik7XHJcbiAgICAgICAgICAgIGxldCBkYXRhSUQgPSBlbGVtcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIpO1xyXG4gICAgICAgICAgICBkZWxldGVKb3VybmFsQ29udGVudChkYXRhSUQsIGVsZW1lbnQuX2lkKTtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1pZD1cIiR7ZWxlbWVudC5faWR9XCJdYCk7XHJcbiAgICAgICAgICAgIGl0ZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gcmVzcG9uc2UuZGF0YVtpXS5kYXRhO1xyXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5maWx0ZXIoKGNvbikgPT4gY29uLl9pZCAhPSBlbGVtZW50Ll9pZCk7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLmRhdGFbaV0uZGF0YSA9IGNvbnRlbnQ7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGpvdXJuYWxJdGVtLmFwcGVuZENoaWxkKGpvdXJuYWxCdG4pO1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgam91cm5hbEl0ZW0uYXBwZW5kQ2hpbGQoam91cm5hbERlc2MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgam91cm5hbENvbnRhaW5lci5hcHBlbmRDaGlsZChqb3VybmFsSXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBzdG9yZVVzZXJKb3VybmFscygpIHtcclxuICAgIGNvbnN0IHNhdmVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmVCdXR0b25cIik7XHJcblxyXG4gICAgc2F2ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgaW5wdXRWYWwgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpXHJcbiAgICAgICAgLnZhbHVlO1xyXG4gICAgICBjb25zdCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWNjZXB0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgIC8vIGNvbnN0IGNoZWNrID0gY2IuY2hlY2tlZFxyXG4gICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgIGJhdHRsZUlkOiB0aGlzLmJhdHRsZUlkLnRvU3RyaW5nKCksXHJcbiAgICAgICAgbmFtZTogaW5wdXRWYWwsXHJcbiAgICAgICAgLy8gdGVtcGxhdGU6IGNoZWNrLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzLmJhdHRsZUlkOiAnLCB0aGlzLmJhdHRsZUlkLCB0eXBlb2YgKHRoaXMuYmF0dGxlSWQpKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ0Zyb20gTG9jYWwgU3RvcmFnZTogJywgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJiYXR0bGVJZFwiKSwgdHlwZW9mIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJhdHRsZUlkXCIpKSk7XHJcblxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHN0b3JlSm91cm5hbHMoZGF0YSk7XHJcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgY29uc3Qgam91cm5hbExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWwtdGFic1wiKTtcclxuICAgICAgICBqb3VybmFsTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZ2V0VXNlckpvdXJuYWxzKCk7XHJcbiAgICAgICAgbGV0IGJ0dG5uMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWlkPVwiJHtyZXNwb25zZS5kYXRhLl9pZH1cIl1gKTtcclxuICAgICAgICBpZiAoYnR0bm4yIGFzIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAoYnR0bm4yIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZVVzZXJKb3VybmFscygpIHtcclxuICAgIGNvbnN0IHNhdmVCdXR0b25FZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteU1vZGFsMlNhdmVcIik7XHJcblxyXG4gICAgc2F2ZUJ1dHRvbkVkaXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiZnJvbSBzYXZlQnV0dG9uXCIpO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBpbnB1dFZhbCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXQyXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpXHJcbiAgICAgICAgLnZhbHVlO1xyXG4gICAgICBjb25zdCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWNjZXB0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgIC8vIGNvbnN0IGNoZWNrID0gY2IuY2hlY2tlZFxyXG4gICAgICBsZXQgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC1qb3VybmVsXCIpO1xyXG4gICAgICBjb25zdCBjb250ZW50SUQgPSBjb250ZW50LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgYmF0dGxlSWQ6IHRoaXMuYmF0dGxlSWQudG9TdHJpbmcoKSxcclxuICAgICAgICBuYW1lOiBpbnB1dFZhbCxcclxuICAgICAgICAvLyB0ZW1wbGF0ZTogY2hlY2ssXHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdXBkYXRlSm91cm5hbHMoY29udGVudElELCBkYXRhKTtcclxuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcclxuICAgICAgICBjb25zdCBqb3VybmFsTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbC10YWJzXCIpO1xyXG4gICAgICAgIGpvdXJuYWxMaXN0LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5nZXRVc2VySm91cm5hbHMoKTtcclxuICAgICAgICBsZXQgYnR0bm4yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke3Jlc3BvbnNlLmRhdGEuX2lkfVwiXWApO1xyXG4gICAgICAgIGlmIChidHRubjIgYXMgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgIChidHRubjIgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXQyXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gXCJcIjtcclxuICAgICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5teU1vZGFsMkNsb3NlXCIpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXN5bmMgc3RvcmVVc2VySm91cm5hbENvbnRlbnQoKSB7XHJcbiAgICBjb25zdCBzYXZlQ29udGVudEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudHNhdmVCdXR0b25cIik7XHJcblxyXG4gICAgc2F2ZUNvbnRlbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdGFiXCIpO1xyXG4gICAgICBjb25zdCBpZCA9IGVsZW1zLmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XHJcbiAgICAgIGxldCBjb250ZW50VGl0bGUgPSAoXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50VGl0bGVcIikgYXMgSFRNTElucHV0RWxlbWVudFxyXG4gICAgICApLnZhbHVlO1xyXG4gICAgICBjb25zdCBodG1sRmlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdG9yXCIpLmlubmVySFRNTDtcclxuICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgdGl0bGU6IGNvbnRlbnRUaXRsZSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogaHRtbEZpbGUsXHJcbiAgICAgIH07XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc3RvcmVKb3VybmFsQ29udGVudChpZCwgZGF0YSk7XHJcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgY29uc3Qgam91cm5hbExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWwtdGFic1wiKTtcclxuICAgICAgICBqb3VybmFsTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZ2V0VXNlckpvdXJuYWxzKCk7XHJcbiAgICAgICAgbGV0IGJ0dG5uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xyXG4gICAgICAgIGlmIChidHRubiBhcyBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgKGJ0dG5uIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50VGl0bGVcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPVxyXG4gICAgICAgICAgXCJcIjtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRvclwiKS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB9XHJcbiAgICAgIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLkNvbnRlbnRNb2RhbENsb3NlXCIpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZVVzZXJKb3VybmFsQ29udGVudCgpIHtcclxuICAgIGNvbnN0IHNhdmVDb250ZW50QnV0dG9uMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudHNhdmVCdXR0b24yXCIpO1xyXG5cclxuICAgIHNhdmVDb250ZW50QnV0dG9uMi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZS10YWJcIik7XHJcbiAgICAgIGNvbnN0IGlkID0gZWxlbXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcclxuICAgICAgbGV0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZS1jb250ZW50XCIpO1xyXG4gICAgICBjb25zdCBjb250ZW50SUQgPSBjb250ZW50LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XHJcbiAgICAgIGxldCBjb250ZW50VGl0bGUgPSAoXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0Q29udGVudFRpdGxlXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICAgICAgKS52YWx1ZTtcclxuICAgICAgY29uc3QgaHRtbEZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRFZGl0b3JcIikuaW5uZXJIVE1MO1xyXG4gICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICB0aXRsZTogY29udGVudFRpdGxlLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBodG1sRmlsZSxcclxuICAgICAgfTtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBlZGl0Sm91cm5hbENvbnRlbnQoaWQsIGNvbnRlbnRJRCwgZGF0YSk7XHJcbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgY29uc3Qgam91cm5hbExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWwtdGFic1wiKTtcclxuICAgICAgICBqb3VybmFsTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZ2V0VXNlckpvdXJuYWxzKCk7XHJcbiAgICAgICAgbGV0IGJ0dG5uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xyXG4gICAgICAgIGlmIChidHRubiBhcyBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgKGJ0dG5uIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAoXHJcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRDb250ZW50VGl0bGVcIikgYXMgSFRNTElucHV0RWxlbWVudFxyXG4gICAgICAgICkudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdEVkaXRvclwiKS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB9XHJcbiAgICAgIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRDb250ZW50TW9kYWxDbG9zZVwiKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBpbnN0YW5jZSgpIHtcclxuICAgIGlmICghdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgSW5HYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJ1bigpIHtcclxuICAgIHRoaXMuX3dvd0dhbWVFdmVudHNMaXN0ZW5lci5zdGFydCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkluZm9VcGRhdGVzKGluZm8pIHtcclxuICAgIHRoaXMubG9nTGluZSh0aGlzLl9pbmZvTG9nLCBpbmZvLCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICAvLyBTcGVjaWFsIGV2ZW50cyB3aWxsIGJlIGhpZ2hsaWdodGVkIGluIHRoZSBldmVudCBsb2dcclxuICBwcml2YXRlIG9uTmV3RXZlbnRzKGUpIHtcclxuICAgIGNvbnN0IHNob3VsZEhpZ2hsaWdodCA9IGUuZXZlbnRzLnNvbWUoKGV2ZW50KSA9PiB7XHJcbiAgICAgIHN3aXRjaCAoZXZlbnQubmFtZSkge1xyXG4gICAgICAgIGNhc2UgXCJraWxsXCI6XHJcbiAgICAgICAgY2FzZSBcImRlYXRoXCI6XHJcbiAgICAgICAgY2FzZSBcImFzc2lzdFwiOlxyXG4gICAgICAgIGNhc2UgXCJsZXZlbFwiOlxyXG4gICAgICAgIGNhc2UgXCJtYXRjaFN0YXJ0XCI6XHJcbiAgICAgICAgY2FzZSBcIm1hdGNoRW5kXCI6XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmxvZ0xpbmUodGhpcy5fZXZlbnRzTG9nLCBlLCBzaG91bGRIaWdobGlnaHQpO1xyXG4gIH1cclxuXHJcbiAgLy8gRGlzcGxheXMgdGhlIHRvZ2dsZSBtaW5pbWl6ZS9yZXN0b3JlIGhvdGtleSBpbiB0aGUgd2luZG93IGhlYWRlclxyXG4gIHByaXZhdGUgYXN5bmMgc2V0VG9nZ2xlSG90a2V5VGV4dCgpIHtcclxuICAgIGNvbnN0IGhvdGtleVRleHQgPSBhd2FpdCBPV0hvdGtleXMuZ2V0SG90a2V5VGV4dChcclxuICAgICAgaG90a2V5cy50b2dnbGUsXHJcbiAgICAgIHdvd0NsYXNzSWRcclxuICAgICk7XHJcbiAgICBjb25zdCBob3RrZXlFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3RrZXlcIik7XHJcbiAgICBob3RrZXlFbGVtLnRleHRDb250ZW50ID0gaG90a2V5VGV4dDtcclxuICB9XHJcblxyXG4gIC8vIFNldHMgdG9nZ2xlSW5HYW1lV2luZG93IGFzIHRoZSBiZWhhdmlvciBmb3IgdGhlIEN0cmwrRiBob3RrZXlcclxuICBwcml2YXRlIGFzeW5jIHNldFRvZ2dsZUhvdGtleUJlaGF2aW9yKCkge1xyXG4gICAgY29uc3QgdG9nZ2xlSW5HYW1lV2luZG93ID0gYXN5bmMgKFxyXG4gICAgICBob3RrZXlSZXN1bHQ6IG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMuT25QcmVzc2VkRXZlbnRcclxuICAgICk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhgcHJlc3NlZCBob3RrZXkgZm9yICR7aG90a2V5UmVzdWx0Lm5hbWV9YCk7XHJcbiAgICAgIGNvbnN0IGluR2FtZVN0YXRlID0gYXdhaXQgdGhpcy5nZXRXaW5kb3dTdGF0ZSgpO1xyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIGluR2FtZVN0YXRlLndpbmRvd19zdGF0ZSA9PT0gV2luZG93U3RhdGUuTk9STUFMIHx8XHJcbiAgICAgICAgaW5HYW1lU3RhdGUud2luZG93X3N0YXRlID09PSBXaW5kb3dTdGF0ZS5NQVhJTUlaRURcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyV2luZG93Lm1pbmltaXplKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgaW5HYW1lU3RhdGUud2luZG93X3N0YXRlID09PSBXaW5kb3dTdGF0ZS5NSU5JTUlaRUQgfHxcclxuICAgICAgICBpbkdhbWVTdGF0ZS53aW5kb3dfc3RhdGUgPT09IFdpbmRvd1N0YXRlLkNMT1NFRFxyXG4gICAgICApIHtcclxuICAgICAgICB0aGlzLmN1cnJXaW5kb3cucmVzdG9yZSgpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIE9XSG90a2V5cy5vbkhvdGtleURvd24oaG90a2V5cy50b2dnbGUsIHRvZ2dsZUluR2FtZVdpbmRvdyk7XHJcbiAgfVxyXG5cclxuICAvLyBBcHBlbmRzIGEgbmV3IGxpbmUgdG8gdGhlIHNwZWNpZmllZCBsb2dcclxuICBwcml2YXRlIGxvZ0xpbmUobG9nOiBIVE1MRWxlbWVudCwgZGF0YSwgaGlnaGxpZ2h0KSB7XHJcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgIGlmICghbG9nKSByZXR1cm47XHJcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcclxuICAgIGxpbmUudGV4dENvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHJcbiAgICBpZiAoaGlnaGxpZ2h0KSB7XHJcbiAgICAgIGxpbmUuY2xhc3NOYW1lID0gXCJoaWdobGlnaHRcIjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzaG91bGRBdXRvU2Nyb2xsID1cclxuICAgICAgbG9nLnNjcm9sbFRvcCArIGxvZy5vZmZzZXRIZWlnaHQgPiBsb2cuc2Nyb2xsSGVpZ2h0IC0gMTA7XHJcblxyXG4gICAgbG9nLmFwcGVuZENoaWxkKGxpbmUpO1xyXG5cclxuICAgIGlmIChzaG91bGRBdXRvU2Nyb2xsKSB7XHJcbiAgICAgIGxvZy5zY3JvbGxUb3AgPSBsb2cuc2Nyb2xsSGVpZ2h0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0T3BhY2l0eVJhbmdlcigpIHtcclxuICAgIGNvbnN0IGVsUmFuZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGFjaXR5LXJhbmdlXCIpO1xyXG4gICAgZWxSYW5nZXIuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHZhbHVlOiBudW1iZXIgPSBwYXJzZUludCgoPEhUTUxJbnB1dEVsZW1lbnQ+ZS50YXJnZXQpLnZhbHVlKTtcclxuICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXTtcclxuICAgICAgYm9keS5zdHlsZS5vcGFjaXR5ID0gKHZhbHVlIC8gMTAwKS50b1N0cmluZygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXREcmFnUmVzaXplKCkge1xyXG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicmVzaXplXCIpO1xyXG5cclxuICAgIGZvciAoY29uc3QgZWwgb2YgZWxlbWVudHMpIHtcclxuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGVkZ2UgPSBlbC5nZXRBdHRyaWJ1dGUoXCJlZGdlXCIpO1xyXG4gICAgICAgIHRoaXMuZHJhZ1Jlc2l6ZSg8TW91c2VFdmVudD5lLCBlZGdlKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGRyYWdSZXNpemUoZXZlbnQ6IE1vdXNlRXZlbnQsIGVkZ2UpIHtcclxuICAgIGlmICh0aGlzLm1heGltaXplZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJkb2luZyBkcmFnIHJlc2l6ZVwiLCBldmVudCwgZWRnZSk7XHJcbiAgICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBjb25zdCB3aW5kb3cgPSBhd2FpdCBnZXRDdXJyZW50V2luZG93KCk7XHJcbiAgICBkcmFnUmVzaXplKHdpbmRvdy5pZCwgZWRnZSk7XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIHNldFNjYWxlKGV2ZW50KSB7XHJcbiAgLy8gICBjb25zb2xlLmxvZyh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuICAvLyAgIGNvbnN0IGRlZmF1bHRXaWR0aCA9IDgwNTtcclxuICAvLyAgIGNvbnN0IGRlZmF1bHRIZWlnaHQgPSA4MDA7XHJcbiAgLy8gICBjb25zdCBzY2FsZVggPSAod2luZG93LmlubmVyV2lkdGggLSAzMCkgLyAoZGVmYXVsdFdpZHRoIC0gMzApO1xyXG4gIC8vICAgY29uc3Qgc2NhbGVZID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIDQwKSAvIChkZWZhdWx0SGVpZ2h0IC0gNDApO1xyXG4gIC8vICAgY29uc3Qgc2NhbGUgPSBNYXRoLm1pbihzY2FsZVgsIHNjYWxlWSk7XHJcblxyXG4gIC8vICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2FsZScpO1xyXG4gIC8vICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtzY2FsZX0pYDtcclxuICAvLyB9XHJcblxyXG4gIHByaXZhdGUgaW5pdFdpbmRvd1NpemVBbmRQb3NpdGlvbigpIHtcclxuICAgIG92ZXJ3b2xmLnV0aWxzLmdldE1vbml0b3JzTGlzdCgocmVzdWx0KSA9PiB7XHJcbiAgICAgIGxldCBfc2NyZWVuV2lkdGggPSAwO1xyXG4gICAgICBsZXQgX3NjcmVlbkhlaWdodCA9IDA7XHJcbiAgICAgIGZvciAoY29uc3QgZGlzcGxheSBpbiByZXN1bHQuZGlzcGxheXMpIHtcclxuICAgICAgICBpZiAocmVzdWx0LmRpc3BsYXlzW2Rpc3BsYXldLmlzX3ByaW1hcnkpIHtcclxuICAgICAgICAgIF9zY3JlZW5XaWR0aCA9IHJlc3VsdC5kaXNwbGF5c1tkaXNwbGF5XS53aWR0aDtcclxuICAgICAgICAgIF9zY3JlZW5IZWlnaHQgPSByZXN1bHQuZGlzcGxheXNbZGlzcGxheV0uaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3coKHJlcykgPT4ge1xyXG4gICAgICAgIGNvbnN0IF93aW5kb3dXaWR0aCA9IDgwNTtcclxuICAgICAgICBjb25zdCBfd2luZG93SGVpZ2h0ID0gTWF0aC5taW4oX3NjcmVlbkhlaWdodCwgODAwKTtcclxuICAgICAgICBjb25zdCBfbGVmdCA9IF9zY3JlZW5XaWR0aCAtIF93aW5kb3dXaWR0aDtcclxuICAgICAgICBjb25zdCBfdG9wID0gTWF0aC5yb3VuZCgoX3NjcmVlbkhlaWdodCAtIF93aW5kb3dIZWlnaHQpIC8gMik7XHJcblxyXG4gICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuY2hhbmdlUG9zaXRpb24ocmVzLndpbmRvdy5pZCwgX2xlZnQsIF90b3AsIG51bGwpO1xyXG4gICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuY2hhbmdlU2l6ZShcclxuICAgICAgICAgIHJlcy53aW5kb3cuaWQsXHJcbiAgICAgICAgICBfd2luZG93V2lkdGgsXHJcbiAgICAgICAgICBfd2luZG93SGVpZ2h0LFxyXG4gICAgICAgICAgbnVsbFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5JbkdhbWUuaW5zdGFuY2UoKS5ydW4oKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==