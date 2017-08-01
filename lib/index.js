
/**
 * generateVideo v0.0.4
 * (c) 2017 yandeqiang
 * Released under ISC
 */

'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Object$defineProperty = _interopDefault(require('babel-runtime/core-js/object/define-property'));
var _Object$getOwnPropertyDescriptor = _interopDefault(require('babel-runtime/core-js/object/get-own-property-descriptor'));
var _Object$getPrototypeOf = _interopDefault(require('babel-runtime/core-js/object/get-prototype-of'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _get = _interopDefault(require('babel-runtime/helpers/get'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var chimeeHelper = require('chimee-helper');
var _Map = _interopDefault(require('babel-runtime/core-js/map'));
var _toConsumableArray = _interopDefault(require('babel-runtime/helpers/toConsumableArray'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var toxicDecorators = require('toxic-decorators');
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _defineProperty = _interopDefault(require('babel-runtime/helpers/defineProperty'));
var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _Number$isNaN = _interopDefault(require('babel-runtime/core-js/number/is-nan'));
var babelRuntime_coreJs_number_isInteger = _interopDefault(require('babel-runtime/core-js/number/is-integer'));
var babelRuntime_coreJs_number_parseFloat = _interopDefault(require('babel-runtime/core-js/number/parse-float'));
var _Array$from = _interopDefault(require('babel-runtime/core-js/array/from'));
var chimeePopup = _interopDefault(require('chimee-plugin-popup'));

var defaultConfig = {
  type: 'vod',
  autoPlay: false,
  box: 'native',
  lockInternalProperty: false,
  debug: true
};

/**
 * mp4解码器
 *
 * @export
 * @class Native
 */

var Native = function (_CustEvent) {
    _inherits(Native, _CustEvent);

    /**
     * Creates an instance of Native.
     * @param {any} videodom video dom对象
     * @param {any} config 配置
     * @memberof Native
     */
    function Native(videodom, config) {
        _classCallCheck(this, Native);

        var _this2 = _possibleConstructorReturn(this, (Native.__proto__ || _Object$getPrototypeOf(Native)).call(this));

        _this2.video = videodom;
        _this2.box = 'Native';
        _this2.config = defaultConfig;
        chimeeHelper.deepAssign(_this2.config, config);
        _this2.bindEvents();
        return _this2;
    }

    _createClass(Native, [{
        key: 'internalPropertyHandle',
        value: function internalPropertyHandle() {
            if (!_Object$getOwnPropertyDescriptor) {
                return;
            }
            var _this = this;
            var time = _Object$getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');

            Object.defineProperty(this.video, 'currentTime', {
                get: function get() {
                    return time.get.call(_this.video);
                },
                set: function set(t) {
                    if (!_this.currentTimeLock) {
                        throw new Error('can not set currentTime by youself');
                    } else {
                        return time.set.call(_this.video, t);
                    }
                }
            });
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            var _this3 = this;

            if (this.video && this.config.lockInternalProperty) {
                this.video.addEventListener('canplay', function () {
                    _this3.internalPropertyHandle();
                });
            }
        }
    }, {
        key: 'load',
        value: function load(src) {
            this.config.src = src || this.config.src;
            this.video.src = this.config.src;
        }
    }, {
        key: 'unload',
        value: function unload() {
            this.video.src = '';
            this.video.removeAttribute('src');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.video) {
                this.unload();
            }
        }
    }, {
        key: 'play',
        value: function play() {
            return this.video.play();
        }
    }, {
        key: 'pause',
        value: function pause() {
            return this.video.pause();
        }
    }, {
        key: 'attachMedia',
        value: function attachMedia() {}
    }, {
        key: 'seek',
        value: function seek(seconds) {
            this.currentTimeLock = true;
            this.video.currentTime = seconds;
            this.currentTimeLock = false;
        }
    }]);

    return Native;
}(chimeeHelper.CustEvent);

var Kernel = function (_CustEvent) {
	_inherits(Kernel, _CustEvent);

	/**
  * 创建核心解码器
  * @param {any} wrap 父层容器
  * @param {any} option 整合参数
  * @class kernel
  */
	function Kernel(videoElement, config) {
		_classCallCheck(this, Kernel);

		var _this = _possibleConstructorReturn(this, (Kernel.__proto__ || _Object$getPrototypeOf(Kernel)).call(this));

		_this.tag = 'kernel';
		_this.config = config;
		_this.video = videoElement;
		_this.videokernel = _this.selectKernel();
		_this.bindEvents(_this.videokernel, _this.video);
		_this.timer = null;
		return _this;
	}

	/**
  * 绑定事件
  * @memberof kernel
  */


	_createClass(Kernel, [{
		key: 'bindEvents',
		value: function bindEvents(videokernel, video) {
			var _this2 = this;

			if (videokernel) {
				videokernel.on('mediaInfo', function (mediaInfo) {
					_this2.emit('mediaInfo', mediaInfo);
				});

				video.addEventListener('canplay', function () {
					clearTimeout(_this2.timer);
					_this2.timer = null;
				});
			}
		}

		/**
   * 选择解码器
   * @memberof kernel
   */

	}, {
		key: 'selectKernel',
		value: function selectKernel() {
			var config = this.config;

			var box = config.box ? config.box : config.src.indexOf('.flv') !== -1 ? 'flv' : config.src.indexOf('.m3u8') !== -1 ? 'hls' : 'native';

			if (box === 'native') {
				return new Native(this.video, config);
			} else if (box === 'flv') {
				return new config.preset[box](this.video, config);
			} else if (box === 'hls') {
				return new config.preset[box](this.video, config);
			} else {
				chimeeHelper.Log.error(this.tag, 'not mactch any player, please check your config');
				return null;
			}
		}
	}, {
		key: 'attachMedia',
		value: function attachMedia() {
			if (this.videokernel) {
				this.videokernel.attachMedia();
			} else {
				chimeeHelper.Log.error(this.tag, 'video player is not already, must init player');
			}
		}

		/**
   * 启动加载
   * @param {string} src 媒体资源地址
   * @memberof kernel
   */

	}, {
		key: 'load',
		value: function load(src) {
			var _this3 = this;

			this.config.src = src || this.config.src;
			if (this.videokernel && this.config.src) {
				this.videokernel.load(src);
				if (!this.timer) {
					this.timer = setTimeout(function () {
						_this3.timer = null;
						_this3.pause();
						_this3.refresh();
					}, 1000);
				}
			} else {
				chimeeHelper.Log.error(this.tag, 'video player is not already, must init player');
			}
		}
		/**
   * 销毁kernel
   * @memberof kernel
   */

	}, {
		key: 'destroy',
		value: function destroy() {
			if (this.videokernel) {
				this.videokernel.destroy();
			} else {
				chimeeHelper.Log.error(this.tag, 'player is not exit');
			}
		}
		/**
   * to play
   * @memberof kernel
   */

	}, {
		key: 'play',
		value: function play() {
			if (this.videokernel) {
				this.videokernel.play();
			} else {
				chimeeHelper.Log.error(this.tag, 'video player is not already, must init player');
			}
		}
		/**
   * pause
   * @memberof kernel
   */

	}, {
		key: 'pause',
		value: function pause() {
			if (this.videokernel && this.config.src) {
				this.videokernel.pause();
			} else {
				chimeeHelper.Log.error(this.tag, 'video player is not already, must init player');
			}
		}
		/**
   * get video currentTime
   * @memberof kernel
   */

	}, {
		key: 'seek',

		/**
   * seek to a point
   * @memberof kernel
   */
		value: function seek(seconds) {
			if (!chimeeHelper.isNumber(seconds)) {
				chimeeHelper.Log.error(this.tag, 'seek params must be a number');
				return;
			}
			return this.videokernel.seek(seconds);
		}
	}, {
		key: 'refresh',
		value: function refresh() {
			this.videokernel.refresh();
		}
		/**
   * get video duration
   * @memberof kernel
   */

	}, {
		key: 'currentTime',
		get: function get() {
			if (this.videokernel) {
				return this.video.currentTime;
			}
			return 0;
		}
	}, {
		key: 'duration',
		get: function get() {
			return this.video.duration;
		}
		/**
   * get video volume
   * @memberof kernel
   */

	}, {
		key: 'volume',
		get: function get() {
			return this.video.volume;
		}
		/**
  * set video volume
  * @memberof kernel
  */
		,
		set: function set(value) {
			this.video.volume = value;
		}
		/**
   * get video muted
   * @memberof kernel
   */

	}, {
		key: 'muted',
		get: function get() {
			return this.video.muted;
		}
		/**
   * set video muted
   * @memberof kernel
   */
		,
		set: function set(muted) {
			this.video.muted = muted;
		}
		/**
  * get video buffer
  * @memberof kernel
  */

	}, {
		key: 'buffered',
		get: function get() {
			return this.video.buffered;
		}
	}]);

	return Kernel;
}(chimeeHelper.CustEvent);

/**
 * chimee v0.2.2
 * (c) 2017 toxic-johann
 * Released under MIT
 */

var videoEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'encrypted', 'ended', 'error', 'interruptbegin', 'interruptend', 'loadeddata', 'loadedmetadata', 'loadstart', 'mozaudioavailable', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting'];
var videoReadOnlyProperties = ['buffered', 'currentSrc', 'duration', 'error', 'ended', 'networkState', 'paused', 'readyState', 'seekable', 'sinkId', 'controlsList', 'tabIndex', 'dataset', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth'];
var domEvents = ['beforeinput', 'blur', 'click', 'compositionend', 'compositionstart', 'compositionupdate', 'dblclick', 'focus', 'focusin', 'focusout', 'input', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'wheel', 'fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange', 'contextmenu'];
var selfProcessorEvents = ['silentLoad', 'fullScreen'];
var kernelMethods = ['play', 'pause', 'seek'];
var dispatcherMethods = ['load'];

var domMethods = ['focus', 'fullScreen', 'requestFullScreen', 'exitFullScreen'];
var videoMethods = ['canPlayType', 'captureStream', 'setSinkId'];

var secondaryReg = /^(before|after|_)/;
/**
 * <pre>
 * event Bus class. Bus take charge of commuication between plugins and user.
 * Some of the event may trigger the kernel to do some task.
 * An event will run in four lifecycle
 * before -> processor -> main -> after -> side effect(_)
 * -------------------- emit period ----------------
 * before: once an event emit, it will run through plugins in bubble to know is it possible to run.
 * processor: if sth need to be done on kernel. It will tell kernel. If kernel will trigger event later, it will break down here. Else will run into trigger period
 * -------------------- trigger period -----------------
 * main: this procedure will trigger the main event in bubble, which means it can be stop in one plugin.
 * after: once event run through all events. It will trigger after event. This event will be trigger in broadcast way.
 * side effect(_): This events will always trigger once we bump into trigger period. So that you can know if the events been blocked. But it's not advice to listen on this effect.
 * </pre>
 */

var Bus = function () {
  /**
   * @param {Dispatcheer} dispatcher bus rely on dispatcher, so you mush pass dispatcher at first when you generate Bus.
   * @return {Bus}
   */

  /**
   * the handler set of all events
   * @type {Object}
   * @member events
   */
  function Bus(dispatcher) {
    _classCallCheck(this, Bus);

    this.events = {};
    this.onceMap = {};

    /**
     * the referrence to dispatcher
     * @type {Dispatcher}
     */
    this.__dispatcher = dispatcher;
  }
  /**
   * [Can only be called in dispatcher]bind event on bus.
   * @param  {string} id plugin's id
   * @param  {string} key event's name
   * @param  {fn} handler function
   */


  _createClass(Bus, [{
    key: 'on',
    value: function on(id, key, fn) {
      var _getEventStage2 = this._getEventStage(key),
          stage = _getEventStage2.stage,
          eventName = _getEventStage2.key;

      this._addEvent([eventName, stage, id], fn);
    }
    /**
     * [Can only be called in dispatcher]remove event off bus. Only suggest one by one.
     * @param  {string} id plugin's id
     * @param  {string} key event's name
     * @param  {fn} handler function
     */

  }, {
    key: 'off',
    value: function off(id, key, fn) {
      var _getEventStage3 = this._getEventStage(key),
          stage = _getEventStage3.stage,
          eventName = _getEventStage3.key;

      var keys = [eventName, stage, id];
      var deleted = this._removeEvent(keys, fn);
      if (deleted) return;
      var handler = this._getHandlerFromOnceMap(keys, fn);
      if (chimeeHelper.isFunction(handler)) {
        this._removeEvent(keys, handler) && this._removeFromOnceMap(keys, fn, handler);
      }
    }
    /**
     * [Can only be called in dispatcher]bind event on bus and remove it once event is triggered.
     * @param  {string} id plugin's id
     * @param  {string} key event's name
     * @param  {Function} fn handler function
     */

  }, {
    key: 'once',
    value: function once(id, key, fn) {
      var _getEventStage4 = this._getEventStage(key),
          stage = _getEventStage4.stage,
          eventName = _getEventStage4.key;

      var bus = this;
      var keys = [eventName, stage, id];
      var handler = function handler() {
        // keep the this so that it can run
        chimeeHelper.bind(fn, this).apply(undefined, arguments);
        bus._removeEvent(keys, handler);
        bus._removeFromOnceMap(keys, fn, handler);
      };
      this._addEvent(keys, handler);
      this._addToOnceMap(keys, fn, handler);
    }
    /**
     * [Can only be called in dispatcher]emit an event, which will run before -> processor period.
     * It may stop in before period.
     * @param  {string}    key event's name
     * @param  {anything} args other argument will be passed into handler
     * @return {Promise}  this promise maybe useful if the event would not trigger kernel event. In that will you can know if it runs successful. But you can know if the event been stopped by the promise.
     */

  }, {
    key: 'emit',
    value: function emit(key) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (key.match(secondaryReg)) {
        chimeeHelper.Log.warn('bus', 'Secondary Event could not be emit');
        return;
      }
      var event = this.events[key];
      if (chimeeHelper.isEmpty(event)) {
        if (selfProcessorEvents.indexOf(key) > -1) return _Promise.resolve();
        return this._eventProcessor.apply(this, [key, { sync: false }].concat(_toConsumableArray(args)));
      }
      var beforeQueue = this._getEventQueue(event.before, this.__dispatcher.order);
      return chimeeHelper.runRejectableQueue.apply(undefined, [beforeQueue].concat(_toConsumableArray(args))).then(function () {
        if (selfProcessorEvents.indexOf(key) > -1) return;
        return _this._eventProcessor.apply(_this, [key, { sync: false }].concat(_toConsumableArray(args)));
      }).catch(function (error) {
        if (chimeeHelper.isError(error)) _this.__dispatcher.throwError(error);
        return _Promise.reject(error);
      });
    }
    /**
     * [Can only be called in dispatcher]emit an event, which will run before -> processor period synchronize.
     * It may stop in before period.
     * @param  {string}    key event's name
     * @param  {anything} args other argument will be passed into handler
     * @return {Promise}  this promise maybe useful if the event would not trigger kernel event. In that will you can know if it runs successful. But you can know if the event been stopped by the promise.
     */

  }, {
    key: 'emitSync',
    value: function emitSync(key) {
      if (key.match(secondaryReg)) {
        chimeeHelper.Log.warn('bus', 'Secondary Event could not be emit');
        return false;
      }
      var event = this.events[key];

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (chimeeHelper.isEmpty(event)) {
        if (selfProcessorEvents.indexOf(key) > -1) return true;
        return this._eventProcessor.apply(this, [key, { sync: true }].concat(_toConsumableArray(args)));
      }
      var beforeQueue = this._getEventQueue(event.before, this.__dispatcher.order);
      return chimeeHelper.runStoppableQueue.apply(undefined, [beforeQueue].concat(_toConsumableArray(args))) && (selfProcessorEvents.indexOf(key) > -1 || this._eventProcessor.apply(this, [key, { sync: true }].concat(_toConsumableArray(args))));
    }
    /**
     * [Can only be called in dispatcher]trigger an event, which will run main -> after -> side effect period
     * @param  {string}    key event's name
     * @param  {anything} args
     * @return {Promise|undefined}    you can know if event trigger finished~ However, if it's unlegal
     */

  }, {
    key: 'trigger',
    value: function trigger(key) {
      var _this2 = this;

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      if (key.match(secondaryReg)) {
        chimeeHelper.Log.warn('bus', 'Secondary Event could not be emit');
        return;
      }
      var event = this.events[key];
      if (chimeeHelper.isEmpty(event)) {
        return _Promise.resolve(true);
      }
      var mainQueue = this._getEventQueue(event.main, this.__dispatcher.order);
      return chimeeHelper.runRejectableQueue.apply(undefined, [mainQueue].concat(_toConsumableArray(args))).then(function () {
        var afterQueue = _this2._getEventQueue(event.after, _this2.__dispatcher.order);
        return chimeeHelper.runRejectableQueue.apply(undefined, [afterQueue].concat(_toConsumableArray(args)));
      }).then(function () {
        return _this2._runSideEffectEvent.apply(_this2, [key, _this2.__dispatcher.order].concat(_toConsumableArray(args)));
      }).catch(function (error) {
        if (chimeeHelper.isError(error)) _this2.__dispatcher.throwError(error);
        return _this2._runSideEffectEvent.apply(_this2, [key, _this2.__dispatcher.order].concat(_toConsumableArray(args)));
      });
    }
    /**
    * [Can only be called in dispatcher]trigger an event, which will run main -> after -> side effect period in synchronize
    * @param  {string}    key event's name
    * @param  {anything} args
    * @return {boolean}    you can know if event trigger finished~ However, if it's unlegal
    */

  }, {
    key: 'triggerSync',
    value: function triggerSync(key) {
      if (key.match(secondaryReg)) {
        chimeeHelper.Log.warn('bus', 'Secondary Event could not be emit');
        return false;
      }
      var event = this.events[key];
      if (chimeeHelper.isEmpty(event)) {
        return true;
      }
      var mainQueue = this._getEventQueue(event.main, this.__dispatcher.order);
      var afterQueue = this._getEventQueue(event.after, this.__dispatcher.order);

      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      var result = chimeeHelper.runStoppableQueue.apply(undefined, [mainQueue].concat(_toConsumableArray(args))) && chimeeHelper.runStoppableQueue.apply(undefined, [afterQueue].concat(_toConsumableArray(args)));
      this._runSideEffectEvent.apply(this, [key, this.__dispatcher.order].concat(_toConsumableArray(args)));
      return result;
    }
    /**
     * destroy hook which will be called when object destroy
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      delete this.events;
      delete this.__dispatcher;
    }
    /**
     * add event into bus
     * @private
     * @param {Array} keys keys map pointing to position to put event handler
     * @param {function} fn handler to put
     */

  }, {
    key: '_addEvent',
    value: function _addEvent(keys, fn) {
      keys = chimeeHelper.deepClone(keys);
      var id = keys.pop();
      var target = keys.reduce(function (target, key) {
        target[key] = target[key] || {};
        return target[key];
      }, this.events);
      // events will store like {play: {main: {plugin: []}}}
      target[id] = target[id] || [];
      target[id].push(fn);
    }
    /**
     * remove event from bus
     * @private
     * @param {Array} keys keys map pointing to position to get event handler
     * @param {function} fn handler to put
     */

  }, {
    key: '_removeEvent',
    value: function _removeEvent(keys, fn) {
      keys = chimeeHelper.deepClone(keys);
      var id = keys.pop();
      var target = this.events;
      for (var i = 0, len = keys.length; i < len; i++) {
        var son = target[keys[i]];
        // if we can't find the event binder, just return
        if (chimeeHelper.isEmpty(son)) return;
        target = son;
      }
      var queue = target[id] || [];
      var index = queue.indexOf(fn);
      var hasFn = index > -1;
      // if we found handler remove it
      if (hasFn) {
        queue.splice(index, 1);
      }
      // if this plugin has no event binding, we remove this event session, which make us perform faster in emit & trigger period.
      if (queue.length < 1) {
        delete target[id];
      }
      return hasFn;
    }
  }, {
    key: '_addToOnceMap',
    value: function _addToOnceMap(keys, fn, handler) {
      var key = keys.join('-');
      var map = this.onceMap[key] = this.onceMap[key] || new _Map();
      if (!map.has(fn)) map.set(fn, []);
      var handlers = map.get(fn);
      // $FlowFixMe: flow do not understand map yet
      handlers.push(handler);
    }
  }, {
    key: '_removeFromOnceMap',
    value: function _removeFromOnceMap(keys, fn, handler) {
      var key = keys.join('-');
      var map = this.onceMap[key];
      // do not need to check now
      // if(isVoid(map) || !map.has(fn)) return;
      var handlers = map.get(fn);
      var index = handlers.indexOf(handler);
      handlers.splice(index, 1);
      if (chimeeHelper.isEmpty(handlers)) map.delete(fn);
    }
  }, {
    key: '_getHandlerFromOnceMap',
    value: function _getHandlerFromOnceMap(keys, fn) {
      var key = keys.join('-');
      var map = this.onceMap[key];
      if (chimeeHelper.isVoid(map) || !map.has(fn)) return;
      var handlers = map.get(fn);
      return handlers[0];
    }
    /**
     * get event stage by evnet key name
     * @private
     * @param  {key} key event's name
     * @return {stage}  event stage
     */

  }, {
    key: '_getEventStage',
    value: function _getEventStage(key) {
      var secondaryCheck = key.match(secondaryReg);
      var stage = secondaryCheck && secondaryCheck[0] || 'main';
      if (secondaryCheck) {
        key = chimeeHelper.camelize(key.replace(secondaryReg, ''));
      }
      return { stage: stage, key: key };
    }
    /**
     * get event handlers queue to run
     * @private
     * @param  {Object} handlerSet the object include all handler
     * @param  {Array} Array form of plugin id
     * @return {Array<Function>} event handler in queue to run
     */

  }, {
    key: '_getEventQueue',
    value: function _getEventQueue(handlerSet, order) {
      var _this3 = this;

      order = chimeeHelper.isArray(order) ? order.concat(['_vm']) : ['_vm'];
      return chimeeHelper.isEmpty(handlerSet) ? [] : order.reduce(function (queue, id) {
        if (chimeeHelper.isEmpty(handlerSet[id]) || !chimeeHelper.isArray(handlerSet[id]) ||
        // in case plugins is missed
        // _vm indicate the user. This is the function for user
        !_this3.__dispatcher.plugins[id] && id !== '_vm') {
          return queue;
        }
        return queue.concat(handlerSet[id].map(function (fn) {
          // bind context for plugin instance
          return chimeeHelper.bind(fn, _this3.__dispatcher.plugins[id] || _this3.__dispatcher.vm);
        }));
      }, []);
    }
    /**
     * event processor period. If event needs call kernel function.
     * I will called here.
     * If kernel will reponse. I will stop here.
     * Else I will trigger next period.
     * @param  {string}    key event's name
     * @param  {boolean}  options.sync we will take triggerSync if true, otherwise we will run trigger. default is false
     * @param  {anything} args
     * @return {Promise|undefined}
     */

  }, {
    key: '_eventProcessor',
    value: function _eventProcessor(key, _ref) {
      var sync = _ref.sync;

      var isKernelMethod = kernelMethods.indexOf(key) > -1;
      var isDomMethod = domMethods.indexOf(key) > -1;
      var isDispatcherMethod = dispatcherMethods.indexOf(key) > -1;

      for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      if (isKernelMethod || isDomMethod || isDispatcherMethod) {
        if (isDispatcherMethod) {
          var _dispatcher;

          (_dispatcher = this.__dispatcher)[key].apply(_dispatcher, _toConsumableArray(args));
        } else {
          var _dispatcher2;

          (_dispatcher2 = this.__dispatcher[isKernelMethod ? 'kernel' : 'dom'])[key].apply(_dispatcher2, _toConsumableArray(args));
        }
        if (videoEvents.indexOf(key) > -1 || domEvents.indexOf(key) > -1) return true;
      }
      // $FlowFixMe: flow do not support computed sytax on classs, but it's ok here
      return this[sync ? 'triggerSync' : 'trigger'].apply(this, [key].concat(_toConsumableArray(args)));
    }
    /**
     * run side effect period
     * @param  {string}    key event's name
     * @param  {args} args
     */

  }, {
    key: '_runSideEffectEvent',
    value: function _runSideEffectEvent(key, order) {
      for (var _len6 = arguments.length, args = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
        args[_key6 - 2] = arguments[_key6];
      }

      var event = this.events[key];
      if (chimeeHelper.isEmpty(event)) {
        return;
      }
      var queue = this._getEventQueue(event['_'], order);
      queue.forEach(function (run) {
        return run.apply(undefined, _toConsumableArray(args));
      });
      return true;
    }
  }]);

  return Bus;
}();

/**
 * checker for on, off, once function
 * @param {string} key
 * @param {Function} fn
 */
function eventBinderCheck(key, fn) {
  if (!chimeeHelper.isString(key)) throw new TypeError('key parameter must be String');
  if (!chimeeHelper.isFunction(fn)) throw new TypeError('fn parameter must be Function');
}
/**
 * checker for attr or css function
 */
function attrAndStyleCheck() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length > 2) {
    return ['set'].concat(args);
  }
  if (args.length === 2) {
    if (['video', 'container', 'wrapper', 'videoElement'].indexOf(args[0]) > -1) {
      return ['get'].concat(args);
    }
    return ['set', 'container'].concat(args);
  }
  return ['get', 'container'].concat(args);
}

var _dec$4;
var _dec2$2;
var _class$4;
var _descriptor$1;
var _descriptor2$1;
var _descriptor3$1;
var _descriptor4;
var _descriptor5;
var _descriptor6;
var _descriptor7;

function _initDefineProp$1(target, property, descriptor, context) {
  if (!descriptor) return;

  _Object$defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$3(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function stringOrVoid(value) {
  return chimeeHelper.isString(value) ? value : undefined;
}

function accessorVideoProperty(property) {
  return toxicDecorators.accessor({
    get: function get(value) {
      return this.dispatcher.videoConfigReady && this.inited ? this.dom.videoElement[property] : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      this.dom.videoElement[property] = value;
      return value;
    }
  });
}

function accessorVideoAttribute(attribute) {
  var _ref = chimeeHelper.isObject(attribute) ? attribute : {
    set: attribute,
    get: attribute,
    isBoolean: false
  },
      _set = _ref.set,
      _get$$1 = _ref.get,
      isBoolean$$1 = _ref.isBoolean;

  return toxicDecorators.accessor({
    get: function get(value) {
      return this.dispatcher.videoConfigReady && this.inited ? this.dom.videoElement[_get$$1] : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var val = isBoolean$$1 ? value ? '' : undefined : value === null ? undefined : value;
      this.dom.setAttr('video', _set, val);
      return value;
    }
  });
}

function accessorCustomAttribute(attribute, isBoolean$$1) {
  return toxicDecorators.accessor({
    get: function get(value) {
      var attrValue = this.dom.getAttr('video', attribute);
      return this.dispatcher.videoConfigReady && this.inited ? isBoolean$$1 ? !!attrValue : attrValue : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var val = isBoolean$$1 ? value || undefined : value === null ? undefined : value;
      this.dom.setAttr('video', attribute, val);
      return value;
    }
  });
}

function accessorWidthAndHeight(property) {
  return toxicDecorators.accessor({
    get: function get(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var attr = this.dom.getAttr('video', property);
      var prop = this.dom.videoElement[property];
      if (chimeeHelper.isNumeric(attr) && chimeeHelper.isNumber(prop)) return prop;
      return attr || undefined;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      var val = void 0;
      if (value === undefined || chimeeHelper.isNumber(value)) {
        val = value;
      } else if (chimeeHelper.isString(value) && !_Number$isNaN(parseFloat(value))) {
        val = value;
      }
      this.dom.setAttr('video', property, val);
      return val;
    }
  });
}

var accessorMap = {
  src: [toxicDecorators.alwaysString(), toxicDecorators.accessor({
    set: function set(val) {
      // must check val !== this.src here
      // as we will set config.src in the video
      // the may cause dead lock
      if (this.dispatcher.readySync && this.autoload && val !== this.src) this.needToLoadSrc = true;
      return val;
    }
  }), toxicDecorators.accessor({
    set: function set(val) {
      if (this.needToLoadSrc) {
        // unlock it at first, to avoid deadlock
        this.needToLoadSrc = false;
        this.dispatcher.bus.emit('load', val);
      }
      return val;
    }
  }, { preSet: false })],
  autoload: toxicDecorators.alwaysBoolean(),
  autoplay: [toxicDecorators.alwaysBoolean(), accessorVideoProperty('autoplay')],
  controls: [toxicDecorators.alwaysBoolean(), accessorVideoProperty('controls')],
  width: [accessorWidthAndHeight('width')],
  height: [accessorWidthAndHeight('height')],
  crossOrigin: [toxicDecorators.accessor({ set: stringOrVoid }), accessorVideoAttribute({ set: 'crossorigin', get: 'crossOrigin' })],
  loop: [toxicDecorators.alwaysBoolean(), accessorVideoProperty('loop')],
  defaultMuted: [toxicDecorators.alwaysBoolean(), accessorVideoAttribute({ get: 'defaultMuted', set: 'muted', isBoolean: true })],
  muted: [toxicDecorators.alwaysBoolean(), accessorVideoProperty('muted')],
  preload: [toxicDecorators.accessor({ set: stringOrVoid }), accessorVideoAttribute('preload')],
  poster: [toxicDecorators.accessor({ set: stringOrVoid }), accessorVideoAttribute('poster')],
  playsInline: [toxicDecorators.accessor({
    get: function get(value) {
      var playsInline = this.dom.videoElement.playsInline;
      return this.dispatcher.videoConfigReady && this.inited ? playsInline === undefined ? value : playsInline : value;
    },
    set: function set(value) {
      if (!this.dispatcher.videoConfigReady) return value;
      this.dom.videoElement.playsInline = value;
      var val = value ? '' : undefined;
      this.dom.setAttr('video', 'playsinline', val);
      this.dom.setAttr('video', 'webkit-playsinline', val);
      this.dom.setAttr('video', 'x5-video-player-type', value ? 'h5' : undefined);
      return value;
    }
  }), toxicDecorators.alwaysBoolean()],
  x5VideoPlayerFullScreen: [toxicDecorators.accessor({
    set: function set(value) {
      return !!value;
    },
    get: function get(value) {
      return !!value;
    }
  }), accessorCustomAttribute('x5-video-player-fullscreen', true)],
  x5VideoOrientation: [toxicDecorators.accessor({ set: stringOrVoid }), accessorCustomAttribute('x5-video-orientation')],
  xWebkitAirplay: [toxicDecorators.accessor({
    set: function set(value) {
      return !!value;
    },
    get: function get(value) {
      return !!value;
    }
  }), accessorCustomAttribute('x-webkit-airplay', true)],
  playbackRate: [toxicDecorators.alwaysNumber(1), accessorVideoProperty('playbackRate')],
  defaultPlaybackRate: [accessorVideoProperty('defaultPlaybackRate'), toxicDecorators.alwaysNumber(1)],
  disableRemotePlayback: [toxicDecorators.alwaysBoolean(), accessorVideoProperty('disableRemotePlayback')],
  volume: [toxicDecorators.alwaysNumber(1), accessorVideoProperty('volume')]
};

var VideoConfig = (_dec$4 = toxicDecorators.initBoolean(), _dec2$2 = toxicDecorators.initString(function (str) {
  return str.toLocaleLowerCase();
}), (_class$4 = function () {
  _createClass(VideoConfig, [{
    key: 'lockKernelProperty',
    value: function lockKernelProperty() {
      toxicDecorators.applyDecorators(this, {
        isLive: toxicDecorators.lock,
        box: toxicDecorators.lock,
        preset: toxicDecorators.lock
      }, { self: true });
    }
  }]);

  function VideoConfig(dispatcher, config) {
    _classCallCheck(this, VideoConfig);

    _initDefineProp$1(this, 'needToLoadSrc', _descriptor$1, this);

    _initDefineProp$1(this, 'changeWatchable', _descriptor2$1, this);

    _initDefineProp$1(this, 'inited', _descriptor3$1, this);

    this.src = '';

    _initDefineProp$1(this, 'isLive', _descriptor4, this);

    _initDefineProp$1(this, 'box', _descriptor5, this);

    this.preset = {};
    this.autoload = true;
    this.autoplay = false;
    this.controls = false;
    this.width = undefined;
    this.height = undefined;
    this.crossOrigin = undefined;
    this.loop = false;
    this.defaultMuted = false;
    this.muted = false;
    this.preload = 'auto';
    this.poster = undefined;
    this.playsInline = false;
    this.x5VideoPlayerFullScreen = false;
    this.x5VideoOrientation = undefined;
    this.xWebkitAirplay = false;
    this.playbackRate = 1;
    this.defaultPlaybackRate = 1;
    this.disableRemotePlayback = false;
    this.volume = 1;

    _initDefineProp$1(this, '_kernelProperty', _descriptor6, this);

    _initDefineProp$1(this, '_realDomAttr', _descriptor7, this);

    toxicDecorators.applyDecorators(this, accessorMap, { self: true });
    Object.defineProperty(this, 'dispatcher', {
      value: dispatcher,
      enumerable: false,
      writable: false,
      configurable: false
    });
    Object.defineProperty(this, 'dom', {
      value: dispatcher.dom,
      enumerable: false,
      writable: false,
      configurable: false
    });
    chimeeHelper.deepAssign(this, config);
  }

  _createClass(VideoConfig, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this._realDomAttr.forEach(function (key) {
        // $FlowFixMe: we have check the computed here
        _this[key] = _this[key];
      });
      this.inited = true;
    }
  }]);

  return VideoConfig;
}(), (_descriptor$1 = _applyDecoratedDescriptor$3(_class$4.prototype, 'needToLoadSrc', [toxicDecorators.nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor2$1 = _applyDecoratedDescriptor$3(_class$4.prototype, 'changeWatchable', [toxicDecorators.nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor3$1 = _applyDecoratedDescriptor$3(_class$4.prototype, 'inited', [toxicDecorators.nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor4 = _applyDecoratedDescriptor$3(_class$4.prototype, 'isLive', [_dec$4, toxicDecorators.configurable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor$3(_class$4.prototype, 'box', [_dec2$2, toxicDecorators.configurable], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor6 = _applyDecoratedDescriptor$3(_class$4.prototype, '_kernelProperty', [toxicDecorators.frozen], {
  enumerable: true,
  initializer: function initializer() {
    return ['isLive', 'box', 'preset'];
  }
}), _descriptor7 = _applyDecoratedDescriptor$3(_class$4.prototype, '_realDomAttr', [toxicDecorators.frozen], {
  enumerable: true,
  initializer: function initializer() {
    return ['src', 'controls', 'width', 'height', 'crossOrigin', 'loop', 'muted', 'preload', 'poster', 'autoplay', 'playsInline', 'x5VideoPlayerFullScreen', 'x5VideoOrientation', 'xWebkitAirplay', 'playbackRate', 'defaultPlaybackRate', 'autoload', 'disableRemotePlayback', 'defaultMuted', 'volume'];
  }
})), _class$4));

var _dec$3;
var _dec2$1;
var _dec3$1;
var _dec4$1;
var _dec5$1;
var _dec6;
var _dec7;
var _dec8;
var _dec9;
var _dec10;
var _dec11;
var _dec12;
var _dec13;
var _dec14;
var _dec15;
var _dec16;
var _dec17;
var _class$3;
var _class2$1;

function _applyDecoratedDescriptor$2(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function propertyAccessibilityWarn(property) {
  chimeeHelper.Log.warn('chimee', 'You are trying to obtain ' + property + ', we will return you the DOM node. It\'s not a good idea to handle this by yourself. If you have some requirement, you can tell use by https://github.com/Chimeejs/chimee/issues');
}
var VideoWrapper = (_dec$3 = toxicDecorators.autobindClass(), _dec2$1 = toxicDecorators.alias('silentLoad'), _dec3$1 = toxicDecorators.alias('fullScreen'), _dec4$1 = toxicDecorators.alias('emit'), _dec5$1 = toxicDecorators.alias('emitSync'), _dec6 = toxicDecorators.alias('on'), _dec7 = toxicDecorators.alias('addEventListener'), _dec8 = toxicDecorators.before(eventBinderCheck), _dec9 = toxicDecorators.alias('off'), _dec10 = toxicDecorators.alias('removeEventListener'), _dec11 = toxicDecorators.before(eventBinderCheck), _dec12 = toxicDecorators.alias('once'), _dec13 = toxicDecorators.before(eventBinderCheck), _dec14 = toxicDecorators.alias('css'), _dec15 = toxicDecorators.before(attrAndStyleCheck), _dec16 = toxicDecorators.alias('attr'), _dec17 = toxicDecorators.before(attrAndStyleCheck), _dec$3(_class$3 = (_class2$1 = function () {
  function VideoWrapper() {
    _classCallCheck(this, VideoWrapper);

    this.__events = {};
    this.__unwatchHandlers = [];
  }

  _createClass(VideoWrapper, [{
    key: '__wrapAsVideo',
    value: function __wrapAsVideo(videoConfig) {
      var _this = this;

      // bind video read only properties on instance, so that you can get info like buffered
      videoReadOnlyProperties.forEach(function (key) {
        _Object$defineProperty(_this, key, {
          get: function get() {
            return this.__dispatcher.dom.videoElement[key];
          },

          set: undefined,
          configurable: false,
          enumerable: false
        });
      });
      // bind videoMethods like canplaytype on instance
      videoMethods.forEach(function (key) {
        _Object$defineProperty(_this, key, {
          get: function get() {
            var video = this.__dispatcher.dom.videoElement;
            return chimeeHelper.bind(video[key], video);
          },

          set: undefined,
          configurable: false,
          enumerable: false
        });
      });
      // bind video config properties on instance, so that you can just set src by this
      var props = videoConfig._realDomAttr.concat(videoConfig._kernelProperty).reduce(function (props, key) {
        props[key] = [toxicDecorators.accessor({
          get: function get() {
            // $FlowFixMe: support computed key here
            return videoConfig[key];
          },
          set: function set(value) {
            // $FlowFixMe: support computed key here
            videoConfig[key] = value;
            return value;
          }
        }), toxicDecorators.nonenumerable];
        return props;
      }, {});
      toxicDecorators.applyDecorators(this, props, { self: true });
      kernelMethods.forEach(function (key) {
        _Object$defineProperty(_this, key, {
          value: function value() {
            var _this2 = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return new _Promise(function (resolve, reject) {
              var _dispatcher$bus;

              _this2.__dispatcher.bus.once(_this2.__id, '_' + key, resolve);
              (_dispatcher$bus = _this2.__dispatcher.bus)[/^(seek)$/.test(key) ? 'emitSync' : 'emit'].apply(_dispatcher$bus, [key].concat(_toConsumableArray(args)));
            });
          },

          configurable: true,
          enumerable: false,
          writable: true
        });
      });
      domMethods.forEach(function (key) {
        if (key === 'fullScreen') return;
        _Object$defineProperty(_this, key, {
          value: function value() {
            var _dispatcher$dom;

            return (_dispatcher$dom = this.__dispatcher.dom)[key].apply(_dispatcher$dom, arguments);
          },

          configurable: true,
          enumerable: false,
          writable: true
        });
      });
    }
  }, {
    key: '$watch',
    value: function $watch(key, handler) {
      var _this3 = this;

      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          deep = _ref.deep,
          _ref$diff = _ref.diff,
          diff = _ref$diff === undefined ? true : _ref$diff,
          other = _ref.other,
          _ref$proxy = _ref.proxy,
          proxy = _ref$proxy === undefined ? false : _ref$proxy;

      if (!chimeeHelper.isString(key) && !chimeeHelper.isArray(key)) throw new TypeError('$watch only accept string and Array<string> as key to find the target to spy on, but not ' + key + ', whose type is ' + (typeof key === 'undefined' ? 'undefined' : _typeof(key)));
      var watching = true;
      var watcher = function watcher() {
        if (watching && (!(this instanceof VideoConfig) || this.dispatcher.changeWatchable)) chimeeHelper.bind(handler, this).apply(undefined, arguments);
      };
      var unwatcher = function unwatcher() {
        watching = false;
        var index = _this3.__unwatchHandlers.indexOf(unwatcher);
        if (index > -1) _this3.__unwatchHandlers.splice(index, 1);
      };
      var keys = chimeeHelper.isString(key) ? key.split('.') : key;
      var property = keys.pop();
      var videoConfig = this.__dispatcher.videoConfig;
      var target = keys.length === 0 && !other && videoConfig._realDomAttr.indexOf(property) > -1 ? videoConfig : ['isFullScreen', 'fullScreenElement'].indexOf(property) > -1 ? this.__dispatcher.dom : chimeeHelper.getDeepProperty(other || this, keys, { throwError: true });
      toxicDecorators.applyDecorators(target, _defineProperty({}, property, toxicDecorators.watch(watcher, { deep: deep, diff: diff, proxy: proxy })), { self: true });
      this.__unwatchHandlers.push(unwatcher);
      return unwatcher;
    }
  }, {
    key: '$set',
    value: function $set(obj, property, value) {
      if (!chimeeHelper.isObject(obj) && !chimeeHelper.isArray(obj)) throw new TypeError('$set only support Array or Object, but not ' + obj + ', whose type is ' + (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)));
      // $FlowFixMe: we have custom this function
      if (!chimeeHelper.isFunction(obj.__set)) {
        chimeeHelper.Log.warn('chimee', _JSON$stringify(obj) + ' has not been deep watch. There is no need to use $set.');
        // $FlowFixMe: we support computed string on array here
        obj[property] = value;
        return;
      }
      obj.__set(property, value);
    }
  }, {
    key: '$del',
    value: function $del(obj, property) {
      if (!chimeeHelper.isObject(obj) && !chimeeHelper.isArray(obj)) throw new TypeError('$del only support Array or Object, but not ' + obj + ', whose type is ' + (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)));
      // $FlowFixMe: we have custom this function
      if (!chimeeHelper.isFunction(obj.__del)) {
        chimeeHelper.Log.warn('chimee', _JSON$stringify(obj) + ' has not been deep watch. There is no need to use $del.');
        // $FlowFixMe: we support computed string on array here
        delete obj[property];
        return;
      }
      obj.__del(property);
    }
  }, {
    key: 'load',
    value: function load() {
      var _this4 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return new _Promise(function (resolve, reject) {
        var _dispatcher$bus2;

        _this4.__dispatcher.bus.once(_this4.__id, '_load', resolve);
        (_dispatcher$bus2 = _this4.__dispatcher.bus).emit.apply(_dispatcher$bus2, ['load'].concat(args));
      });
    }
  }, {
    key: '$silentLoad',
    value: function $silentLoad() {
      var _this5 = this;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.__dispatcher.bus.emit('silentLoad').then(function () {
        var _dispatcher;

        return (_dispatcher = _this5.__dispatcher).silentLoad.apply(_dispatcher, args);
      }).then(function (result) {
        _this5.__dispatcher.bus.trigger('silentLoad', result);
      });
    }

    /**
     * call fullscreen api on some specific element
     * @param {boolean} flag true means fullscreen and means exit fullscreen
     * @param {string} element the element you want to fullscreen, default it's container, you can choose from video | container | wrapper
     */

  }, {
    key: '$fullScreen',
    value: function $fullScreen() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'container';

      if (!this.__dispatcher.bus.emitSync('fullScreen', flag, element)) return false;
      var result = this.__dispatcher.dom.fullScreen(flag, element);
      this.__dispatcher.bus.triggerSync('fullScreen', flag, element);
      return result;
    }

    /**
     * emit an event
     * @param  {string}    key event's name
     * @param  {...args} args
     */

  }, {
    key: '$emit',
    value: function $emit(key) {
      var _dispatcher$bus3;

      if (!chimeeHelper.isString(key)) throw new TypeError('emit key parameter must be String');
      if (domEvents.indexOf(key.replace(/^\w_/, '')) > -1) {
        chimeeHelper.Log.warn('plugin', 'You are try to emit ' + key + ' event. As emit is wrapped in Promise. It make you can\'t use event.preventDefault and event.stopPropagation. So we advice you to use emitSync');
      }

      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      (_dispatcher$bus3 = this.__dispatcher.bus).emit.apply(_dispatcher$bus3, [key].concat(_toConsumableArray(args)));
    }

    /**
     * emit a sync event
     * @param  {string}    key event's name
     * @param  {...args} args
     */

  }, {
    key: '$emitSync',
    value: function $emitSync(key) {
      var _dispatcher$bus4;

      if (!chimeeHelper.isString(key)) throw new TypeError('emitSync key parameter must be String');

      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      return (_dispatcher$bus4 = this.__dispatcher.bus).emitSync.apply(_dispatcher$bus4, [key].concat(_toConsumableArray(args)));
    }

    /**
     * bind event handler through this function
     * @param  {string} key event's name
     * @param  {Function} fn event's handler
     */

  }, {
    key: '$on',
    value: function $on(key, fn) {
      this.__dispatcher.bus.on(this.__id, key, fn);
      // set on __events as mark so that i can destroy it when i destroy
      this.__addEvents(key, fn);
    }
    /**
     * remove event handler through this function
     * @param  {string} key event's name
     * @param  {Function} fn event's handler
     */

  }, {
    key: '$off',
    value: function $off(key, fn) {
      this.__dispatcher.bus.off(this.__id, key, fn);
      this.__removeEvents(key, fn);
    }
    /**
     * bind one time event handler
     * @param {string} key event's name
     * @param {Function} fn event's handler
     */

  }, {
    key: '$once',
    value: function $once(key, fn) {
      var self = this;
      var boundFn = function boundFn() {
        chimeeHelper.bind(fn, this).apply(undefined, arguments);
        self.__removeEvents(key, boundFn);
      };
      self.__addEvents(key, boundFn);
      this.__dispatcher.bus.once(this.__id, key, boundFn);
    }

    /**
     * set style
     * @param {string} element optional, default to be video, you can choose from video | container | wrapper
     * @param {string} attribute the atrribue name
     * @param {any} value optional, when it's no offer, we consider you want to get the attribute's value. When it's offered, we consider you to set the attribute's value, if the value you passed is undefined, that means you want to remove the value;
     */

  }, {
    key: '$css',
    value: function $css(method) {
      var _dispatcher$dom2;

      for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }

      return (_dispatcher$dom2 = this.__dispatcher.dom)[method + 'Style'].apply(_dispatcher$dom2, args);
    }

    /**
     * set attr
     * @param {string} element optional, default to be video, you can choose from video | container | wrapper
     * @param {string} attribute the atrribue nameß
     * @param {any} value optional, when it's no offer, we consider you want to get the attribute's value. When it's offered, we consider you to set the attribute's value, if the value you passed is undefined, that means you want to remove the value;
     */

  }, {
    key: '$attr',
    value: function $attr(method) {
      var _dispatcher$dom3;

      for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        args[_key7 - 1] = arguments[_key7];
      }

      if (method === 'set' && /video/.test(args[0])) {
        if (!this.__dispatcher.videoConfigReady) {
          chimeeHelper.Log.warn('chimee', this.__id + ' is tring to set attribute on video before video inited. Please wait until the inited event has benn trigger');
          return args[2];
        }
        if (this.__dispatcher.videoConfig._realDomAttr.indexOf(args[1]) > -1) {
          var key = args[1],
              val = args[2];

          this.__dispatcher.videoConfig[key] = val;
          return val;
        }
      }
      return (_dispatcher$dom3 = this.__dispatcher.dom)[method + 'Attr'].apply(_dispatcher$dom3, args);
    }
  }, {
    key: '__addEvents',
    value: function __addEvents(key, fn) {
      this.__events[key] = this.__events[key] || [];
      this.__events[key].push(fn);
    }
  }, {
    key: '__removeEvents',
    value: function __removeEvents(key, fn) {
      if (chimeeHelper.isEmpty(this.__events[key])) return;
      var index = this.__events[key].indexOf(fn);
      if (index < 0) return;
      this.__events[key].splice(index, 1);
      if (chimeeHelper.isEmpty(this.__events[key])) delete this.__events[key];
    }
  }, {
    key: '__destroy',
    value: function __destroy() {
      var _this6 = this;

      this.__unwatchHandlers.forEach(function (unwatcher) {
        return unwatcher();
      });
      _Object$keys(this.__events).forEach(function (key) {
        if (!chimeeHelper.isArray(_this6.__events[key])) return;
        _this6.__events[key].forEach(function (fn) {
          return _this6.$off(key, fn);
        });
      });
      delete this.__events;
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.__dispatcher.kernel.currentTime;
    },
    set: function set(second) {
      this.__dispatcher.bus.emitSync('seek', second);
    }
  }, {
    key: '$plugins',
    get: function get() {
      return this.__dispatcher.plugins;
    }
  }, {
    key: '$pluginOrder',
    get: function get() {
      return this.__dispatcher.order;
    }
  }, {
    key: '$wrapper',
    get: function get() {
      propertyAccessibilityWarn('wrapper');
      return this.__dispatcher.dom.wrapper;
    }
  }, {
    key: '$container',
    get: function get() {
      propertyAccessibilityWarn('container');
      return this.__dispatcher.dom.container;
    }
  }, {
    key: '$video',
    get: function get() {
      propertyAccessibilityWarn('video');
      return this.__dispatcher.dom.videoElement;
    }
  }, {
    key: 'isFullScreen',
    get: function get() {
      return this.__dispatcher.dom.isFullScreen;
    }
  }, {
    key: 'fullScreenElement',
    get: function get() {
      return this.__dispatcher.dom.fullScreenElement;
    }
  }]);

  return VideoWrapper;
}(), (_applyDecoratedDescriptor$2(_class2$1.prototype, '$silentLoad', [_dec2$1], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$silentLoad'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$fullScreen', [_dec3$1], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$fullScreen'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$emit', [_dec4$1], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$emit'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$emitSync', [_dec5$1], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$emitSync'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$on', [_dec6, _dec7, _dec8], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$on'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$off', [_dec9, _dec10, _dec11], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$off'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$once', [_dec12, _dec13], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$once'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$css', [_dec14, _dec15], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$css'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$attr', [_dec16, _dec17], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$attr'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$plugins', [toxicDecorators.nonenumerable, toxicDecorators.nonextendable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$plugins'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$pluginOrder', [toxicDecorators.nonenumerable, toxicDecorators.nonextendable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$pluginOrder'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$wrapper', [toxicDecorators.nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$wrapper'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$container', [toxicDecorators.nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$container'), _class2$1.prototype), _applyDecoratedDescriptor$2(_class2$1.prototype, '$video', [toxicDecorators.nonenumerable], _Object$getOwnPropertyDescriptor(_class2$1.prototype, '$video'), _class2$1.prototype)), _class2$1)) || _class$3);

var _dec$2;
var _class$2;

/**
 * <pre>
 * Plugin is the class for plugin developer.
 * When we use a plugin, we will generate an instance of plugin.
 * Developer can do most of things base on this plugin
 * </pre>
 */
var Plugin = (_dec$2 = toxicDecorators.autobindClass(), _dec$2(_class$2 = function (_VideoWrapper) {
  _inherits(Plugin, _VideoWrapper);

  /**
   * <pre>
   * to create a plugin, we need three parameter
   * 1. the config of a plugin
   * 2. the dispatcher
   * 3. this option for plugin to read
   * this is the plugin base class, which you can get on Chimee
   * You can just extends it and then install
   * But in that way you must remember to pass the arguments to super()
   * </pre>
   * @param  {string}  PluginConfig.id        camelize from plugin's name or class name.
   * @param  {string}  PluginConfig.name      plugin's name or class name
   * @param  {Number}  PluginConfig.level     the level of z-index
   * @param  {Boolean} PluginConfig.operable  to tell if the plugin can be operable, if not, we will add pointer-events: none on it.
   * @param  {Function}  PluginConfig.create  the create function which we will called when plugin is used. sth like constructor in object style.
   * @param  {Function}  PluginConfig.destroy   function to be called when we destroy a plugin
   * @param  {Object}  PluginConfig.events    You can set some events handler in this object, we will bind it once you use the plugin.
   * @param  {Object}  PluginConfig.data      dataset we will bind on data in object style
   * @param  {Object<{get: Function, set: Function}}  PluginConfig.computed  dataset we will handle by getter and setter
   * @param  {Object<Function>}  PluginConfig.methods   some function we will bind on plugin
   * @param  {string|HTMLElment}  PluginConfig.el  can be string or HTMLElement, we will use this to create the dom for plugin
   * @param  {boolean} PluginConfig.penetrate boolean to let us do we need to forward the dom events for this plugin.
   * @param  {Dispatcher}  dispatcher referrence of dispatcher
   * @param  {Object}  option  PluginOption that will pass to the plugin
   * @return {Plugin}  plugin instance
   */
  function Plugin() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        id = _ref.id,
        name = _ref.name,
        _ref$level = _ref.level,
        level = _ref$level === undefined ? 0 : _ref$level,
        _ref$operable = _ref.operable,
        operable = _ref$operable === undefined ? true : _ref$operable,
        beforeCreate = _ref.beforeCreate,
        create = _ref.create,
        init = _ref.init,
        inited = _ref.inited,
        destroy = _ref.destroy,
        _ref$events = _ref.events,
        events = _ref$events === undefined ? {} : _ref$events,
        _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data,
        _ref$computed = _ref.computed,
        computed = _ref$computed === undefined ? {} : _ref$computed,
        _ref$methods = _ref.methods,
        methods = _ref$methods === undefined ? {} : _ref$methods,
        el = _ref.el,
        _ref$penetrate = _ref.penetrate,
        penetrate = _ref$penetrate === undefined ? false : _ref$penetrate,
        _ref$inner = _ref.inner,
        inner = _ref$inner === undefined ? true : _ref$inner,
        autoFocus = _ref.autoFocus,
        className = _ref.className;

    var dispatcher = arguments[1];
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { name: name };

    _classCallCheck(this, Plugin);

    var _this = _possibleConstructorReturn(this, (Plugin.__proto__ || _Object$getPrototypeOf(Plugin)).call(this));

    _this.destroyed = false;
    _this.VERSION = '0.2.2';
    _this.__operable = true;
    _this.__level = 0;

    if (chimeeHelper.isEmpty(dispatcher)) {
      chimeeHelper.Log.error('Dispatcher.plugin', 'lack of dispatcher. Do you forget to pass arguments to super in plugin?');
      throw new TypeError('lack of dispatcher');
    }
    if (!chimeeHelper.isString(id)) {
      throw new TypeError('id of PluginConfig must be string');
    }
    _this.__id = id;
    _this.__dispatcher = dispatcher;
    _this.$videoConfig = _this.__dispatcher.videoConfig;
    _this.__wrapAsVideo(_this.$videoConfig);
    _this.beforeCreate = _this.beforeCreate || beforeCreate;
    try {
      chimeeHelper.isFunction(_this.beforeCreate) && _this.beforeCreate({
        events: events,
        data: data,
        computed: computed,
        methods: methods
      }, option);
    } catch (error) {
      _this.$throwError(error);
    }
    // bind plugin methods into instance
    if (!chimeeHelper.isEmpty(methods) && chimeeHelper.isObject(methods)) {
      _Object$keys(methods).forEach(function (key) {
        var fn = methods[key];
        if (!chimeeHelper.isFunction(fn)) throw new TypeError('plugins methods must be Function');
        _Object$defineProperty(_this, key, {
          value: chimeeHelper.bind(fn, _this),
          writable: true,
          enumerable: false,
          configurable: true
        });
      });
    }
    // hook plugin events on bus
    if (!chimeeHelper.isEmpty(events) && chimeeHelper.isObject(events)) {
      _Object$keys(events).forEach(function (key) {
        if (!chimeeHelper.isFunction(events[key])) throw new TypeError('plugins events hook must bind with Function');
        _this.$on(key, events[key]);
      });
    }
    // bind data into plugin instance
    if (!chimeeHelper.isEmpty(data) && chimeeHelper.isObject(data)) {
      chimeeHelper.deepAssign(_this, data);
    }
    // set the computed member by getter and setter
    if (!chimeeHelper.isEmpty(computed) && chimeeHelper.isObject(computed)) {
      var props = _Object$keys(computed).reduce(function (props, key) {
        var val = computed[key];
        if (chimeeHelper.isFunction(val)) {
          props[key] = toxicDecorators.accessor({ get: val });
          return props;
        }
        if (chimeeHelper.isObject(val) && (chimeeHelper.isFunction(val.get) || chimeeHelper.isFunction(val.set))) {
          props[key] = toxicDecorators.accessor(val);
          return props;
        }
        chimeeHelper.Log.warn('Dispatcher.plugin', 'Wrong computed member \'' + key + '\' defination in Plugin ' + name);
        return props;
      }, {});
      toxicDecorators.applyDecorators(_this, props, { self: true });
    }
    /**
     * the create Function of plugin
     * @type {Function}
     */
    _this.create = _this.create || create;
    /**
     * this init Function of plugin
     * which will be called when we start to create the video player
     * the plugin can handle some config here
     * @type {Function}
     */
    _this.init = _this.init || init;
    /**
     * this inited Function of plugin
     * which will be called when we have created the video player
     * @type {Function}
     */
    _this.inited = _this.inited || inited;
    /**
     * the destroy Function of plugin
     * @type {Function}
     */
    _this.destroy = _this.destroy || destroy;
    /**
     * the dom node of whole plugin
     * @type {HTMLElement}
     */
    _this.$dom = _this.__dispatcher.dom.insertPlugin(_this.__id, el, { penetrate: penetrate, inner: inner, autoFocus: autoFocus, className: className });
    // now we can frozen inner, autoFocus and penetrate
    _this.$inner = inner;
    _this.$autoFocus = autoFocus;
    _this.$penetrate = penetrate;
    toxicDecorators.applyDecorators(_this, {
      $inner: toxicDecorators.frozen,
      $autoFocus: toxicDecorators.frozen,
      $penetrate: toxicDecorators.frozen
    }, { self: true });
    /**
     * to tell us if the plugin can be operable, can be dynamic change
     * @type {boolean}
     */
    _this.$operable = chimeeHelper.isBoolean(option.operable) ? option.operable : operable;
    _this.__level = chimeeHelper.isInteger(option.level) ? option.level : level;
    /**
     * pluginOption, so it's easy for plugin developer to check the config
     * @type {Object}
     */
    _this.$config = option;
    try {
      chimeeHelper.isFunction(_this.create) && _this.create();
    } catch (error) {
      _this.$throwError(error);
    }
    return _this;
  }
  /**
   * call for init lifecycle hook, which mainly handle the original config of video and kernel.
   * @param {VideoConfig} videoConfig the original config of the videoElement or Kernel
   */


  _createClass(Plugin, [{
    key: '__init',
    value: function __init(videoConfig) {
      try {
        chimeeHelper.isFunction(this.init) && this.init(videoConfig);
      } catch (error) {
        this.$throwError(error);
      }
    }
    /**
     * call for inited lifecycle hook, which just to tell the plugin we have inited.
     */

  }, {
    key: '__inited',
    value: function __inited() {
      var _this2 = this;

      var result = void 0;
      try {
        result = chimeeHelper.isFunction(this.inited) && this.inited();
      } catch (error) {
        this.$throwError(error);
      }
      this.readySync = !chimeeHelper.isPromise(result);
      this.ready = this.readySync ? _Promise.resolve()
      // $FlowFixMe: it's promise now
      : result.then(function (ret) {
        _this2.readySync = true;
        return ret;
      }).catch(function (error) {
        if (chimeeHelper.isError(error)) return _this2.$throwError(error);
        return _Promise.reject(error);
      });
      return this.readySync || this.ready;
    }

    /**
     * set the plugin to be the top of all plugins
     */

  }, {
    key: '$bumpToTop',
    value: function $bumpToTop() {
      var topLevel = this.__dispatcher._getTopLevel(this.$inner);
      this.$level = topLevel + 1;
    }
  }, {
    key: '$throwError',
    value: function $throwError(error) {
      this.__dispatcher.throwError(error);
    }
    /**
     * officail destroy function for plugin
     * we will call user destory function in this method
     */

  }, {
    key: '$destroy',
    value: function $destroy() {
      chimeeHelper.isFunction(this.destroy) && this.destroy();
      _get(Plugin.prototype.__proto__ || _Object$getPrototypeOf(Plugin.prototype), '__destroy', this).call(this);
      this.__dispatcher.dom.removePlugin(this.__id);
      delete this.__dispatcher;
      delete this.$dom;
      this.destroyed = true;
    }
    /**
     * to tell us if the plugin can be operable, can be dynamic change
     * @type {boolean}
     */

  }, {
    key: '$operable',
    set: function set(val) {
      if (!chimeeHelper.isBoolean(val)) return;
      this.$dom.style.pointerEvents = val ? 'auto' : 'none';
      this.__operable = val;
    },
    get: function get() {
      return this.__operable;
    }
    /**
     * the z-index level, higher when you set higher
     * @type {boolean}
     */

  }, {
    key: '$level',
    set: function set(val) {
      if (!chimeeHelper.isInteger(val)) return;
      this.__level = val;
      this.__dispatcher._sortZIndex();
    },
    get: function get() {
      return this.__level;
    }
  }]);

  return Plugin;
}(VideoWrapper)) || _class$2);

var _dec$5;
var _dec2$3;
var _dec3$2;
var _dec4$2;
var _dec5$2;
var _dec6$1;
var _class$5;

function _applyDecoratedDescriptor$4(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function targetCheck(target) {
  if (target === 'video') target = 'videoElement';
  if (!chimeeHelper.isElement(this[target])) throw new TypeError('Your target ' + target + ' is not a legal HTMLElement');

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [target].concat(args);
}
function attrOperationCheck(target, attr, val) {
  if (!chimeeHelper.isString(attr)) throw new TypeError("to handle dom's attribute or style, your attr parameter must be string");
  if (!chimeeHelper.isString(target)) throw new TypeError("to handle dom's attribute or style, your target parameter must be string");
  return [target, attr, val];
}
/**
 * <pre>
 * Dom work for Dispatcher.
 * It take charge of dom management of Dispatcher.
 * </pre>
 */
var Dom = (_dec$5 = toxicDecorators.waituntil('__dispatcher.videoConfigReady'), _dec2$3 = toxicDecorators.before(attrOperationCheck, targetCheck), _dec3$2 = toxicDecorators.before(attrOperationCheck, targetCheck), _dec4$2 = toxicDecorators.before(attrOperationCheck, targetCheck), _dec5$2 = toxicDecorators.before(attrOperationCheck, targetCheck), _dec6$1 = toxicDecorators.before(targetCheck), (_class$5 = function () {
  /**
   * to mark is the mouse in the video area
   * @type {boolean}
   * @member __mouseInVideo
   */

  /**
   * Array to store all video dom event handler
   * @type {Array}
   * @member wrapperDomEventHandlerList
   */

  /**
   * Array to store all video dom event handler
   * @type {Array}
   * @member videoDomEventHandlerList
   */

  /**
   * the html to restore when we are destroyed
   * @type {HTMLString}
   */
  function Dom(wrapper, dispatcher) {
    var _this = this;

    _classCallCheck(this, Dom);

    this.plugins = {};
    this.originHTML = '';
    this.videoEventHandlerList = [];
    this.videoDomEventHandlerList = [];
    this.containerDomEventHandlerList = [];
    this.wrapperDomEventHandlerList = [];
    this.__domEventHandlerList = {};
    this.__mouseInVideo = false;
    this.__videoExtendedNodes = [];
    this.isFullScreen = false;
    this.fullScreenElement = undefined;

    this.__dispatcher = dispatcher;
    if (!chimeeHelper.isElement(wrapper) && !chimeeHelper.isString(wrapper)) throw new TypeError('Illegal wrapper');
    var $wrapper = chimeeHelper.$(wrapper);
    if ($wrapper.length === 0) {
      throw new TypeError('Can not get dom node accroding wrapper. Please check your wrapper');
    }
    /**
     * the referrence of the dom wrapper of whole Chimee
     * @type {Element}
     */
    this.wrapper = $wrapper[0];
    this.originHTML = this.wrapper.innerHTML;
    // if we find video element inside wrapper
    // we use it
    // or we create a video element by ourself.
    var videoElement = $wrapper.find('video')[0];
    if (!videoElement) {
      videoElement = document.createElement('video');
    }
    /**
     * referrence of video's dom element
     * @type {Element}
     */
    this.installVideo(videoElement);
    domEvents.forEach(function (key) {
      var cfn = function cfn() {
        var _dispatcher$bus;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return (_dispatcher$bus = _this.__dispatcher.bus).triggerSync.apply(_dispatcher$bus, ['c_' + key].concat(args));
      };
      _this.containerDomEventHandlerList.push(cfn);
      chimeeHelper.addEvent(_this.container, key, cfn);
      var wfn = function wfn() {
        var _dispatcher$bus2;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return (_dispatcher$bus2 = _this.__dispatcher.bus).triggerSync.apply(_dispatcher$bus2, ['w_' + key].concat(args));
      };
      _this.wrapperDomEventHandlerList.push(wfn);
      chimeeHelper.addEvent(_this.wrapper, key, wfn);
    });
    this._bindFullScreen();
  }
  /**
   * Object to store different plugin's dom event handlers
   * @type {Object}
   * @member __domEventHandlerList
   */

  /**
   * Array to store all container dom event handler
   * @type {Array}
   * @member containerDomEventHandlerList
   */

  /**
   * Array to store all video event handler
   * @type {Array}
   * @member videoEventHandlerList
   */

  /**
   * @param  {string|Element} wrapper the wrapper of Chimee. All dom including videoElement will build in it.
   * @return {Dom}
   */
  /**
   * all plugin's dom element set
   * @type {Object}
   * @member plugins
   */


  _createClass(Dom, [{
    key: 'installVideo',
    value: function installVideo(videoElement) {
      var _this2 = this;

      this.__videoExtendedNodes.push(videoElement);
      chimeeHelper.setAttr(videoElement, 'tabindex', -1);
      this._autoFocusToVideo(videoElement);
      if (!chimeeHelper.isElement(this.container)) {
        // create container
        if (videoElement.parentElement && chimeeHelper.isElement(videoElement.parentElement) && videoElement.parentElement !== this.wrapper) {
          this.container = videoElement.parentElement;
        } else {
          this.container = document.createElement('container');
          chimeeHelper.$(this.container).append(videoElement);
        }
      } else {
        var container = this.container;
        if (container.childNodes.length === 0) {
          container.appendChild(videoElement);
        } else {
          container.insertBefore(videoElement, container.childNodes[0]);
        }
      }
      // check container.position
      if (this.container.parentElement !== this.wrapper) {
        chimeeHelper.$(this.wrapper).append(this.container);
      }
      videoEvents.forEach(function (key) {
        var fn = function fn() {
          var _dispatcher$bus3;

          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return (_dispatcher$bus3 = _this2.__dispatcher.bus).trigger.apply(_dispatcher$bus3, [key].concat(args));
        };
        _this2.videoEventHandlerList.push(fn);
        chimeeHelper.addEvent(videoElement, key, fn);
      });
      domEvents.forEach(function (key) {
        var fn = _this2._getEventHandler(key, { penetrate: true });
        _this2.videoDomEventHandlerList.push(fn);
        chimeeHelper.addEvent(videoElement, key, fn);
      });
      this.videoElement = videoElement;
      return videoElement;
    }
  }, {
    key: 'removeVideo',
    value: function removeVideo() {
      var _this3 = this;

      var videoElement = this.videoElement;
      this._autoFocusToVideo(this.videoElement, false);
      videoEvents.forEach(function (key, index) {
        chimeeHelper.removeEvent(_this3.videoElement, key, _this3.videoEventHandlerList[index]);
      });
      domEvents.forEach(function (key, index) {
        chimeeHelper.removeEvent(_this3.videoElement, key, _this3.videoDomEventHandlerList[index]);
      });
      chimeeHelper.$(videoElement).remove();
      delete this.videoElement;
      return videoElement;
    }
    /**
     * <pre>
     * each plugin has its own dom node, this function will create one or them.
     * we support multiple kind of el
     * 1. Element, we will append this dom node on wrapper straight
     * 2. HTMLString, we will create dom based on this HTMLString and append it on wrapper
     * 3. string, we will transfer this string into hypen string, then we create a custom elment called by this and bind it on wrapper
     * 4. nothing, we will create a div and bind it on the wrapper
     * </pre>
     * @param  {string} id plugin's id
     * @param  {string|Element} el(optional) the el can be custom dom element or html string to insert
     * @param  {boolean} inner if it's true, we will put it into conatiner, else we would put it into outer
     * @return {Node}
     */

  }, {
    key: 'insertPlugin',
    value: function insertPlugin(id, el) {
      var _this4 = this;

      var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!chimeeHelper.isString(id)) throw new TypeError('insertPlugin id parameter must be string');
      if (chimeeHelper.isElement(this.plugins[id])) {
        chimeeHelper.Log.warn('Dispatcher.dom', 'Plugin ' + id + ' have already had a dom node. Now it will be replaced');
        this.removePlugin(id);
      }
      if (chimeeHelper.isString(el)) {
        if (chimeeHelper.isHTMLString(el)) {
          var outer = document.createElement('div');
          outer.innerHTML = el;
          el = outer.children[0];
        } else {
          el = document.createElement(chimeeHelper.hypenate(el));
        }
      } else if (chimeeHelper.isObject(el)) {
        option = el;
      }
      var _option = option,
          inner = _option.inner,
          penetrate = _option.penetrate,
          autoFocus = _option.autoFocus;
      var _option2 = option,
          className = _option2.className;

      var node = el && chimeeHelper.isElement(el) ? el : document.createElement('div');
      if (chimeeHelper.isArray(className)) {
        className = className.join(' ');
      }
      if (chimeeHelper.isString(className)) {
        chimeeHelper.addClassName(node, className);
      }
      this.plugins[id] = node;
      var outerElement = inner ? this.container : this.wrapper;
      var originElement = inner ? this.videoElement : this.container;
      if (chimeeHelper.isBoolean(autoFocus) ? autoFocus : inner) this._autoFocusToVideo(node);
      // auto forward the event if this plugin can be penetrate
      if (penetrate) {
        this.__domEventHandlerList[id] = this.__domEventHandlerList[id] || [];
        domEvents.forEach(function (key) {
          var fn = _this4._getEventHandler(key, { penetrate: penetrate });
          chimeeHelper.addEvent(node, key, fn);
          _this4.__domEventHandlerList[id].push(fn);
        });
        this.__videoExtendedNodes.push(node);
      }
      if (outerElement.lastChild === originElement) {
        outerElement.appendChild(node);
        return node;
      }
      outerElement.insertBefore(node, originElement.nextSibling);
      return node;
    }
    /**
     * remove plugin's dom
     * @param  {string} id
     */

  }, {
    key: 'removePlugin',
    value: function removePlugin(id) {
      var _this5 = this;

      if (!chimeeHelper.isString(id)) return;
      var dom = this.plugins[id];
      if (chimeeHelper.isElement(dom)) {
        dom.parentNode && dom.parentNode.removeChild(dom);
        this._autoFocusToVideo(dom, true);
      }
      if (!chimeeHelper.isEmpty(this.__domEventHandlerList[id])) {
        domEvents.forEach(function (key, index) {
          chimeeHelper.removeEvent(_this5.plugins[id], key, _this5.__domEventHandlerList[id][index]);
        });
        delete this.__domEventHandlerList[id];
      }
      delete this.plugins[id];
    }
    /**
     * Set zIndex for a plugins list
     * @param {Array<string>} plugins
     */

  }, {
    key: 'setPluginsZIndex',
    value: function setPluginsZIndex(plugins) {
      var _this6 = this;

      // $FlowFixMe: there are videoElment and container here
      plugins.forEach(function (key, index) {
        return chimeeHelper.setStyle(key.match(/^(videoElement|container)$/) ? _this6[key] : _this6.plugins[key], 'z-index', ++index);
      });
    }
    /**
     * set attribute on our dom
     * @param {string} attr attribute's name
     * @param {anything} val attribute's value
     * @param {string} target the HTMLElemnt string name, only support video/wrapper/container now
     */

  }, {
    key: 'setAttr',
    value: function setAttr$$1(target, attr, val) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      chimeeHelper.setAttr(this[target], attr, val);
    }
  }, {
    key: 'getAttr',
    value: function getAttr$$1(target, attr) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      return chimeeHelper.getAttr(this[target], attr);
    }
  }, {
    key: 'setStyle',
    value: function setStyle$$1(target, attr, val) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      chimeeHelper.setStyle(this[target], attr, val);
    }
  }, {
    key: 'getStyle',
    value: function getStyle$$1(target, attr) {
      // $FlowFixMe: flow do not support computed property/element on class, which is silly here.
      return chimeeHelper.getStyle(this[target], attr);
    }
  }, {
    key: 'requestFullScreen',
    value: function requestFullScreen(target) {
      var methods = ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen'];
      for (var i = 0, len = methods.length; i < len; i++) {
        // $FlowFixMe: flow do not support computed property/element on document, which is silly here.
        if (chimeeHelper.isFunction(this[target][methods[i]])) {
          // $FlowFixMe: flow do not support computed property/element on document, which is silly here.
          this[target][methods[i]]();
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'exitFullScreen',
    value: function exitFullScreen() {
      var methods = ['exitFullscreen', 'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'];
      for (var i = 0, len = methods.length; i < len; i++) {
        // $FlowFixMe: flow do not support computed property/element on document, which is silly here.
        if (chimeeHelper.isFunction(document[methods[i]])) {
          // $FlowFixMe: flow do not support computed property/element on document, which is silly here.
          document[methods[i]]();
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'fullScreen',
    value: function fullScreen() {
      var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'container';

      for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      return request ? this.requestFullScreen.apply(this, [target].concat(_toConsumableArray(args))) : this.exitFullScreen.apply(this, _toConsumableArray(args));
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.videoElement.focus();
    }
    /**
     * function called when we distory
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this7 = this;

      this.removeVideo();
      domEvents.forEach(function (key, index) {
        chimeeHelper.removeEvent(_this7.container, key, _this7.containerDomEventHandlerList[index]);
        chimeeHelper.removeEvent(_this7.wrapper, key, _this7.wrapperDomEventHandlerList[index]);
      });
      this._bindFullScreen(true);
      this.wrapper.innerHTML = this.originHTML;
      delete this.wrapper;
      delete this.plugins;
    }
  }, {
    key: '_autoFocusToVideo',
    value: function _autoFocusToVideo(element) {
      var remove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      (remove ? chimeeHelper.removeEvent : chimeeHelper.addEvent)(element, 'mouseup', this._focusToVideo, false, true);
      (remove ? chimeeHelper.removeEvent : chimeeHelper.addEvent)(element, 'touchend', this._focusToVideo, false, true);
    }
  }, {
    key: '_focusToVideo',
    value: function _focusToVideo(evt) {
      var x = window.scrollX;
      var y = window.scrollY;
      chimeeHelper.isFunction(this.videoElement.focus) && this.videoElement.focus();
      window.scrollTo(x, y);
    }
  }, {
    key: '_fullScreenMonitor',
    value: function _fullScreenMonitor() {
      var element = ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'].reduce(function (element, key) {
        // $FlowFixMe: support computed element on document
        return element || document[key];
      }, null);
      if (!element || !chimeeHelper.isPosterityNode(this.wrapper, element) && element !== this.wrapper) {
        this.isFullScreen = false;
        this.fullScreenElement = undefined;
        return;
      }
      this.isFullScreen = true;
      this.fullScreenElement = this.wrapper === element ? 'wrapper' : this.container === element ? 'container' : this.videoElement === element ? 'video' : element;
    }
  }, {
    key: '_bindFullScreen',
    value: function _bindFullScreen(remove) {
      var _this8 = this;

      if (!remove) this._fullScreenMonitor();
      ['webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange', 'fullscreenchange'].forEach(function (key) {
        // $FlowFixMe: support computed element on document
        document[(remove ? 'remove' : 'add') + 'EventListener'](key, _this8._fullScreenMonitor);
      });
    }
    /**
     * get the event handler for dom to bind
     */

  }, {
    key: '_getEventHandler',
    value: function _getEventHandler(key, _ref) {
      var _this9 = this;

      var penetrate = _ref.penetrate;

      if (!penetrate || ['mouseenter', 'mouseleave'].indexOf(key) < 0) {
        return function () {
          var _dispatcher$bus4;

          for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          (_dispatcher$bus4 = _this9.__dispatcher.bus).triggerSync.apply(_dispatcher$bus4, [key].concat(args));
        };
      }
      var insideVideo = function insideVideo(node) {
        return _this9.__videoExtendedNodes.indexOf(node) > -1 || _this9.__videoExtendedNodes.reduce(function (flag, video) {
          if (flag) return flag;
          return chimeeHelper.isPosterityNode(video, node);
        }, false);
      };
      return function () {
        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }

        var _args$ = args[0],
            toElement = _args$.toElement,
            currentTarget = _args$.currentTarget,
            relatedTarget = _args$.relatedTarget,
            type = _args$.type;

        var to = toElement || relatedTarget;
        if (_this9.__mouseInVideo && type === 'mouseleave' && !insideVideo(to)) {
          var _dispatcher$bus5;

          _this9.__mouseInVideo = false;
          return (_dispatcher$bus5 = _this9.__dispatcher.bus).triggerSync.apply(_dispatcher$bus5, ['mouseleave'].concat(args));
        }
        if (!_this9.__mouseInVideo && type === 'mouseenter' && insideVideo(currentTarget)) {
          var _dispatcher$bus6;

          _this9.__mouseInVideo = true;
          return (_dispatcher$bus6 = _this9.__dispatcher.bus).triggerSync.apply(_dispatcher$bus6, ['mouseenter'].concat(args));
        }
      };
    }
  }]);

  return Dom;
}(), (_applyDecoratedDescriptor$4(_class$5.prototype, 'setAttr', [_dec$5, _dec2$3], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'setAttr'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, 'getAttr', [_dec3$2], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'getAttr'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, 'setStyle', [_dec4$2], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'setStyle'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, 'getStyle', [_dec5$2], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'getStyle'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, 'requestFullScreen', [_dec6$1], _Object$getOwnPropertyDescriptor(_class$5.prototype, 'requestFullScreen'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, '_focusToVideo', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$5.prototype, '_focusToVideo'), _class$5.prototype), _applyDecoratedDescriptor$4(_class$5.prototype, '_fullScreenMonitor', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$5.prototype, '_fullScreenMonitor'), _class$5.prototype)), _class$5));

var _dec$1;
var _dec2;
var _dec3;
var _dec4;
var _dec5;
var _class$1;

function _applyDecoratedDescriptor$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var pluginConfigSet = {};
function convertNameIntoId(name) {
  if (!chimeeHelper.isString(name)) throw new Error("Plugin's name must be a string");
  return chimeeHelper.camelize(name);
}
function checkPluginConfig(config) {
  if (chimeeHelper.isFunction(config)) {
    if (!(config.prototype instanceof Plugin)) {
      throw new TypeError('If you pass a function as plugin config, this class must extends from Chimee.plugin');
    }
    return;
  }
  if (!chimeeHelper.isObject(config) || chimeeHelper.isEmpty(config)) throw new TypeError("plugin's config must be an Object");
  var name = config.name;

  if (!chimeeHelper.isString(name) || name.length < 1) throw new TypeError('plugin must have a legal name');
}
/**
 * <pre>
 * Dispatcher is the hub of plugins, user, and video kernel.
 * It take charge of plugins install, use and remove
 * It also offer a bridge to let user handle video kernel.
 * </pre>
 */
var Dispatcher = (_dec$1 = toxicDecorators.before(convertNameIntoId), _dec2 = toxicDecorators.before(checkPluginConfig), _dec3 = toxicDecorators.before(convertNameIntoId), _dec4 = toxicDecorators.before(convertNameIntoId), _dec5 = toxicDecorators.before(convertNameIntoId), (_class$1 = function () {
  /**
   * @param  {UserConfig} config UserConfig for whole Chimee player
   * @param  {Chimee} vm referrence of outer class
   * @return {Dispatcher}
   */

  /**
   * the z-index map of the dom, it contain some important infomation
   * @type {Object}
   * @member zIndexMap
   */

  /**
   * plugin's order
   * @type {Array<string>}
   * @member order
   */
  function Dispatcher(config, vm) {
    var _this = this;

    _classCallCheck(this, Dispatcher);

    this.plugins = {};
    this.order = [];
    this.readySync = false;
    this.zIndexMap = {
      inner: [],
      outer: []
    };
    this.changeWatchable = true;

    if (!chimeeHelper.isObject(config)) throw new TypeError('UserConfig must be an Object');
    /**
     * dom Manager
     * @type {Dom}
     */
    this.dom = new Dom(config.wrapper, this);
    /**
     * eventBus
     * @type {Bus}
     */
    this.bus = new Bus(this);
    /**
     * Chimee's referrence
     * @type {[type]}
     */
    this.vm = vm;
    /**
     * tell user have Chimee installed finished
     * @type {Promises}
     */
    this.videoConfigReady = false;
    // create the videoconfig
    this.videoConfig = new VideoConfig(this, config);
    this._initUserPlugin(config.plugin);
    this.order.forEach(function (key) {
      return _this.plugins[key].__init(_this.videoConfig);
    });
    this.videoConfig.lockKernelProperty();
    this.videoConfigReady = true;
    this.videoConfig.init();
    /**
     * video kernel
     * @type {Kernel}
     */
    this.kernel = new Kernel(this.dom.videoElement, this.videoConfig);
    // trigger auto load event
    var asyncInitedTasks = [];
    this.order.forEach(function (key) {
      var ready = _this.plugins[key].__inited();
      if (chimeeHelper.isPromise(ready)) {
        asyncInitedTasks.push(ready);
      }
    });
    this.readySync = asyncInitedTasks.length === 0;
    // tell them we have inited the whold player
    this.ready = this.readySync ? _Promise.resolve() : _Promise.all(asyncInitedTasks).then(function () {
      _this.readySync = true;
      _this.bus.trigger('ready');
      _this._autoloadVideoSrcAtFirst();
    });
    if (this.readySync) this._autoloadVideoSrcAtFirst();
  }
  /**
   * use a plugin, which means we will new a plugin instance and include int this Chimee instance
   * @param  {Object|string} option you can just set a plugin name or plugin config
   * @return {Promise}
   */

  /**
   * the synchronous ready flag
   * @type {boolean}
   * @member readySync
   */

  /**
   * all plugins instance set
   * @type {Object}
   * @member plugins
   */


  _createClass(Dispatcher, [{
    key: 'use',
    value: function use(option) {
      if (chimeeHelper.isString(option)) option = { name: option, alias: undefined };
      if (!chimeeHelper.isObject(option) || chimeeHelper.isObject(option) && !chimeeHelper.isString(option.name)) {
        throw new TypeError('pluginConfig do not match requirement');
      }
      if (!chimeeHelper.isString(option.alias)) option.alias = undefined;
      var _option = option,
          name = _option.name,
          alias$$1 = _option.alias;

      option.name = alias$$1 || name;
      delete option.alias;
      var key = chimeeHelper.camelize(name);
      var id = chimeeHelper.camelize(alias$$1 || name);
      var pluginOption = option;
      var pluginConfig = Dispatcher.getPluginConfig(key);
      if (chimeeHelper.isEmpty(pluginConfig)) throw new TypeError('You have not installed plugin ' + key);
      if (chimeeHelper.isObject(pluginConfig)) {
        pluginConfig.id = id;
      }
      var plugin = chimeeHelper.isFunction(pluginConfig) ? new pluginConfig({ id: id }, this, pluginOption) // eslint-disable-line 
      : new Plugin(pluginConfig, this, pluginOption);
      this.plugins[id] = plugin;
      _Object$defineProperty(this.vm, id, {
        value: plugin,
        configurable: true,
        enumerable: false,
        writable: false
      });
      this.order.push(id);
      this._sortZIndex();
      if (this.videoConfigReady) plugin.__inited();
      return plugin.ready;
    }
    /**
     * unuse an plugin, we will destroy the plugin instance and exlude it
     * @param  {string} name plugin's name
     */

  }, {
    key: 'unuse',
    value: function unuse(id) {
      var plugin = this.plugins[id];
      if (!chimeeHelper.isObject(plugin) || !chimeeHelper.isFunction(plugin.$destroy)) {
        delete this.plugins[id];
        return;
      }
      plugin.$destroy();
      var orderIndex = this.order.indexOf(id);
      if (orderIndex > -1) {
        this.order.splice(orderIndex, 1);
      }
      delete this.plugins[id];
      delete this.vm[id];
    }
  }, {
    key: 'throwError',
    value: function throwError(error) {
      this.vm.__throwError(error);
    }
  }, {
    key: 'silentLoad',
    value: function silentLoad(src) {
      var _this2 = this;

      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _option$duration = option.duration,
          duration = _option$duration === undefined ? 3 : _option$duration,
          _option$bias = option.bias,
          bias = _option$bias === undefined ? 0 : _option$bias,
          _option$repeatTimes = option.repeatTimes,
          repeatTimes = _option$repeatTimes === undefined ? 0 : _option$repeatTimes,
          _option$increment = option.increment,
          increment = _option$increment === undefined ? 0 : _option$increment,
          _option$isLive = option.isLive,
          isLive = _option$isLive === undefined ? this.videoConfig.isLive : _option$isLive,
          _option$box = option.box,
          box = _option$box === undefined ? this.videoConfig.box : _option$box,
          _option$preset = option.preset,
          preset = _option$preset === undefined ? this.videoConfig.preset : _option$preset;
      // form the base config for kernel
      // it should be the same as the config now

      var config = { isLive: isLive, box: box, src: src, preset: preset };
      // build tasks accroding repeat times
      var tasks = new Array(repeatTimes + 1).fill(1).map(function (value, index) {
        return function () {
          return new _Promise(function (resolve, reject) {
            // if abort, give up and reject
            if (option.abort) reject({ error: true, message: 'user abort the mission' });
            var video = document.createElement('video');
            var idealTime = _this2.kernel.currentTime + duration + increment * index;
            video.muted = true;
            var newVideoReady = false;
            // bind time update on old video
            // when we bump into the switch point and ready
            // we switch
            var oldVideoTimeupdate = function oldVideoTimeupdate(evt) {
              var currentTime = _this2.kernel.currentTime;
              if (bias <= 0 && currentTime >= idealTime || bias > 0 && (Math.abs(idealTime - currentTime) <= bias && newVideoReady || currentTime - idealTime > bias)) {
                chimeeHelper.removeEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
                chimeeHelper.removeEvent(video, 'error', videoError, true);
                if (!newVideoReady) {
                  chimeeHelper.removeEvent(video, 'canplay', videoCanplay, true);
                  chimeeHelper.removeEvent(video, 'loadedmetadata', videoLoadedmetadata, true);
                  kernel.destroy();
                  return resolve();
                }
                return reject({
                  error: false,
                  video: video,
                  kernel: kernel
                });
              }
            };
            var videoCanplay = function videoCanplay(evt) {
              newVideoReady = true;
              // you can set it immediately run by yourself
              if (option.immediate) {
                chimeeHelper.removeEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
                chimeeHelper.removeEvent(video, 'error', videoError, true);
                return reject({
                  error: false,
                  video: video,
                  kernel: kernel
                });
              }
            };
            var videoLoadedmetadata = function videoLoadedmetadata(evt) {
              kernel.seek(idealTime);
            };
            var videoError = function videoError(evt) {
              chimeeHelper.removeEvent(video, 'canplay', videoCanplay, true);
              chimeeHelper.removeEvent(video, 'loadedmetadata', videoLoadedmetadata, true);
              chimeeHelper.removeEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
              var error = !chimeeHelper.isEmpty(video.error) ? new Error(video.error.message) : new Error('unknow video error');
              chimeeHelper.Log.error("chimee's silentload", error.message);
              kernel.destroy();
              return index === repeatTimes ? reject(error) : resolve(error);
            };
            chimeeHelper.addEvent(video, 'canplay', videoCanplay, true);
            chimeeHelper.addEvent(video, 'loadedmetadata', videoLoadedmetadata, true);
            chimeeHelper.addEvent(video, 'error', videoError, true);
            chimeeHelper.addEvent(_this2.dom.videoElement, 'timeupdate', oldVideoTimeupdate);
            var kernel = new Kernel(video, config);
            kernel.load();
          });
        };
      });
      return chimeeHelper.runRejectableQueue(tasks).then(function () {
        var message = 'The silentLoad for ' + src + ' timed out. Please set a longer duration or check your network';
        chimeeHelper.Log.warn("chimee's silentLoad", message);
        return _Promise.reject(new Error(message));
      }).catch(function (data) {
        if (chimeeHelper.isError(data)) {
          return _Promise.reject(data);
        }
        if (data.error) {
          chimeeHelper.Log.warn("chimee's silentLoad", data.message);
          return _Promise.reject(new Error(data.message));
        }
        var video = data.video,
            kernel = data.kernel;

        if (option.abort) {
          kernel.destroy();
          return _Promise.reject(new Error('user abort the mission'));
        }
        var paused = _this2.dom.videoElement.paused;
        _this2.switchKernel({ video: video, kernel: kernel, config: config });
        if (!paused) _this2.dom.videoElement.play();
        return _Promise.resolve();
      });
    }
  }, {
    key: 'load',
    value: function load(src) {
      var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!chimeeHelper.isEmpty(option)) {
        var videoConfig = this.videoConfig;

        var _option$isLive2 = option.isLive,
            _isLive = _option$isLive2 === undefined ? videoConfig.isLive : _option$isLive2,
            _option$box2 = option.box,
            _box = _option$box2 === undefined ? videoConfig.box : _option$box2,
            _option$preset2 = option.preset,
            _preset = _option$preset2 === undefined ? videoConfig.preset : _option$preset2;

        var video = document.createElement('video');
        var config = { isLive: _isLive, box: _box, preset: _preset, src: src };
        var _kernel = new Kernel(video, config);
        this.switchKernel({ video: video, kernel: _kernel, config: config });
      }
      this.kernel.load(src);
    }
  }, {
    key: 'switchKernel',
    value: function switchKernel(_ref) {
      var _this3 = this;

      var video = _ref.video,
          kernel = _ref.kernel,
          config = _ref.config;

      var oldKernel = this.kernel;
      var originVideoConfig = chimeeHelper.deepClone(this.videoConfig);
      this.dom.removeVideo();
      this.dom.installVideo(video);
      // as we will reset the currentVideoConfig on the new video
      // it will trigger the watch function as they maybe differnet
      // so we need to stop them
      this.videoConfig.changeWatchable = false;
      this.videoConfig.autoload = false;
      this.videoConfig.src = config.src;
      this.videoConfig._realDomAttr.forEach(function (key) {
        // $FlowFixMe: support computed key here
        if (key !== 'src') _this3.videoConfig[key] = originVideoConfig[key];
      });
      this.videoConfig.changeWatchable = true;
      // bind the new config in new kernel to the videoConfig
      toxicDecorators.applyDecorators(config, {
        src: toxicDecorators.accessor({
          get: function get(value) {
            return _this3.videoConfig.src;
          },
          set: function set(value) {
            _this3.videoConfig.src = value;
            return value;
          }
        })
      }, { self: true });
      // the kernel's inner config would not be change according what we do
      // so we have to load that
      // applyDecorators(kernel.__proto__, {
      //   load: before(src => {
      //     return [src || this.videoConfig.src];
      //   })
      // }, {self: true});
      this.kernel = kernel;
      oldKernel.destroy();
    }
    /**
     * destroy function called when dispatcher destroyed
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      for (var key in this.plugins) {
        this.unuse(key);
      }
      this.bus.destroy();
      delete this.bus;
      this.dom.destroy();
      delete this.dom;
      this.kernel.destroy();
      delete this.kernel;
      delete this.vm;
      delete this.plugins;
      delete this.order;
    }
    /**
     * use a set of plugin
     * @param  {Array<UserPluginConfig>}  configs  a set of plugin config
     * @return {Array<Promise>}   a set of Promise indicate the plugin install stage
     */

  }, {
    key: '_initUserPlugin',
    value: function _initUserPlugin() {
      var _this4 = this;

      var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!chimeeHelper.isArray(configs)) {
        chimeeHelper.Log.warn('Dispatcher', 'UserConfig.plugin can only by an Array');
        configs = [];
      }
      return configs.map(function (config) {
        return _this4.use(config);
      });
    }
    /**
     * sort zIndex of plugins to make plugin display in order
     */

  }, {
    key: '_sortZIndex',
    value: function _sortZIndex() {
      var _this5 = this;

      var _order$reduce = this.order.reduce(function (levelSet, key) {
        var plugin = _this5.plugins[key];
        if (chimeeHelper.isEmpty(plugin)) return levelSet;
        var set = levelSet[plugin.$inner ? 'inner' : 'outer'];
        var level = plugin.$level;
        set[level] = set[level] || [];
        set[level].push(key);
        return levelSet;
      }, { inner: {}, outer: {} }),
          inner = _order$reduce.inner,
          outer = _order$reduce.outer;

      inner[0] = inner[0] || [];
      inner[0].unshift('videoElement');
      outer[0] = outer[0] || [];
      outer[0].unshift('container');
      var innerOrderArr = chimeeHelper.transObjectAttrIntoArray(inner);
      var outerOrderArr = chimeeHelper.transObjectAttrIntoArray(outer);
      this.dom.setPluginsZIndex(innerOrderArr);
      this.dom.setPluginsZIndex(outerOrderArr);
      this.zIndexMap.inner = innerOrderArr;
      this.zIndexMap.outer = outerOrderArr;
    }
    /**
     * get the top element's level
     * @param {boolean} inner get the inner array or the outer array
     */

  }, {
    key: '_getTopLevel',
    value: function _getTopLevel(inner) {
      var arr = this.zIndexMap[inner ? 'inner' : 'outer'];
      var plugin = this.plugins[arr[arr.length - 1]];
      return chimeeHelper.isEmpty(plugin) ? 0 : plugin.$level;
    }
  }, {
    key: '_autoloadVideoSrcAtFirst',
    value: function _autoloadVideoSrcAtFirst() {
      if (this.videoConfig.autoload) this.bus.emit('load', this.videoConfig.src);
    }
    /**
     * static method to install plugin
     * we will store the plugin config
     * @type {string} plugin's id
     */

  }], [{
    key: 'install',
    value: function install(config) {
      var name = config.name;

      var id = chimeeHelper.camelize(name);
      if (!chimeeHelper.isEmpty(pluginConfigSet[id])) {
        chimeeHelper.Log.warn('Dispatcher', 'You have installed ' + name + ' again. And the older one will be replaced');
      }
      var pluginConfig = chimeeHelper.isFunction(config) ? config : chimeeHelper.deepAssign({ id: id }, config);
      pluginConfigSet[id] = pluginConfig;
      return id;
    }
  }, {
    key: 'hasInstalled',
    value: function hasInstalled(id) {
      return !chimeeHelper.isEmpty(pluginConfigSet[id]);
    }
  }, {
    key: 'uninstall',
    value: function uninstall(id) {
      delete pluginConfigSet[id];
    }
    /**
     * get Plugin config based on plugin's id
     * @type {[type]}
     */

  }, {
    key: 'getPluginConfig',
    value: function getPluginConfig(id) {
      return pluginConfigSet[id];
    }
  }]);

  return Dispatcher;
}(), (_applyDecoratedDescriptor$1(_class$1.prototype, 'unuse', [_dec$1], _Object$getOwnPropertyDescriptor(_class$1.prototype, 'unuse'), _class$1.prototype), _applyDecoratedDescriptor$1(_class$1, 'install', [_dec2], _Object$getOwnPropertyDescriptor(_class$1, 'install'), _class$1), _applyDecoratedDescriptor$1(_class$1, 'hasInstalled', [_dec3], _Object$getOwnPropertyDescriptor(_class$1, 'hasInstalled'), _class$1), _applyDecoratedDescriptor$1(_class$1, 'uninstall', [_dec4], _Object$getOwnPropertyDescriptor(_class$1, 'uninstall'), _class$1), _applyDecoratedDescriptor$1(_class$1, 'getPluginConfig', [_dec5], _Object$getOwnPropertyDescriptor(_class$1, 'getPluginConfig'), _class$1)), _class$1));

var _class$6;
var _descriptor$2;

function _initDefineProp$2(target, property, descriptor, context) {
  if (!descriptor) return;

  _Object$defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor$5(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var GlobalConfig = (_class$6 = function () {
  _createClass(GlobalConfig, [{
    key: 'silent',
    get: function get() {
      return this._silent;
    },
    set: function set(val) {
      var _this = this;

      val = !!val;
      this._silent = val;
      _Object$keys(this.log).forEach(function (key) {
        _this.log[key] = !val;
      });
    }
  }]);

  function GlobalConfig() {
    _classCallCheck(this, GlobalConfig);

    this.log = {
      error: true,
      info: true,
      warn: true,
      debug: true,
      verbose: true
    };

    _initDefineProp$2(this, '_silent', _descriptor$2, this);

    this.errorHandler = undefined;

    var props = _Object$keys(this.log).reduce(function (props, key) {
      props[key] = toxicDecorators.accessor({
        get: function get() {
          // $FlowFixMe: we have check the keys
          return chimeeHelper.Log['ENABLE_' + key.toUpperCase()];
        },
        set: function set(val) {
          // $FlowFixMe: we have check the keys
          chimeeHelper.Log['ENABLE_' + key.toUpperCase()] = val;
          if (val === true) this.silent = false;
          return val;
        }
      });
      return props;
    }, {});
    toxicDecorators.applyDecorators(this.log, props, { self: true });
  }

  return GlobalConfig;
}(), (_descriptor$2 = _applyDecoratedDescriptor$5(_class$6.prototype, '_silent', [toxicDecorators.nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
})), _class$6);

var _dec;
var _class;
var _class2;
var _descriptor;
var _descriptor2;
var _descriptor3;
var _init;
var _init2;
var _init3;
var _init4;
var _init5;
var _init6;
var _class3;
var _temp;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;

  _Object$defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var Chimee = (_dec = toxicDecorators.autobindClass(), _dec(_class = (_class2 = (_temp = _class3 = function (_VideoWrapper) {
  _inherits(Chimee, _VideoWrapper);

  function Chimee(config) {
    _classCallCheck(this, Chimee);

    var _this = _possibleConstructorReturn(this, (Chimee.__proto__ || _Object$getPrototypeOf(Chimee)).call(this));

    _this.destroyed = false;

    _initDefineProp(_this, '__id', _descriptor, _this);

    _initDefineProp(_this, 'version', _descriptor2, _this);

    _initDefineProp(_this, 'config', _descriptor3, _this);

    if (chimeeHelper.isString(config) || chimeeHelper.isElement(config)) {
      config = {
        wrapper: config,
        controls: true
      };
    } else if (chimeeHelper.isObject(config)) {
      if (!config.wrapper) throw new Error('You must pass in an legal object');
    } else {
      throw new Error('You must pass in an Object containing wrapper or string or element to new a Chimee');
    }
    _this.__dispatcher = new Dispatcher(config, _this);
    _this.__dispatcher.kernel.on('error', _this.__throwError);
    _this.ready = _this.__dispatcher.ready;
    _this.readySync = _this.__dispatcher.readySync;
    _this.__wrapAsVideo(_this.__dispatcher.videoConfig);
    return _this;
  }

  _createClass(Chimee, [{
    key: 'destroy',
    value: function destroy() {
      _get(Chimee.prototype.__proto__ || _Object$getPrototypeOf(Chimee.prototype), '__destroy', this).call(this);
      this.__dispatcher.destroy();
      this.destroyed = true;
    }
  }, {
    key: 'use',
    value: function use(option) {
      this.__dispatcher.use(option);
    }
  }, {
    key: 'unuse',
    value: function unuse(name) {
      this.__dispatcher.unuse(name);
    }
  }, {
    key: '__throwError',
    value: function __throwError(error) {
      if (chimeeHelper.isString(error)) error = new Error(error);
      var errorHandler = this.config.errorHandler || Chimee.config.errorHandler;
      if (chimeeHelper.isFunction(errorHandler)) return errorHandler(error);
      if (Chimee.config.silent) return;
      throw error;
    }
  }]);

  return Chimee;
}(VideoWrapper), _class3.plugin = Plugin, _class3.config = new GlobalConfig(), _class3.install = Dispatcher.install, _class3.uninstall = Dispatcher.uninstall, _class3.hasInstalled = Dispatcher.hasInstalled, _class3.getPluginConfig = Dispatcher.getPluginConfig, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, '__id', [toxicDecorators.frozen], {
  enumerable: true,
  initializer: function initializer() {
    return '_vm';
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'version', [toxicDecorators.frozen], {
  enumerable: true,
  initializer: function initializer() {
    return '0.2.2';
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'config', [toxicDecorators.frozen], {
  enumerable: true,
  initializer: function initializer() {
    return {
      errorHandler: undefined
    };
  }
}), _applyDecoratedDescriptor(_class2, 'plugin', [toxicDecorators.frozen], (_init = _Object$getOwnPropertyDescriptor(_class2, 'plugin'), _init = _init ? _init.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'config', [toxicDecorators.frozen], (_init2 = _Object$getOwnPropertyDescriptor(_class2, 'config'), _init2 = _init2 ? _init2.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init2;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'install', [toxicDecorators.frozen], (_init3 = _Object$getOwnPropertyDescriptor(_class2, 'install'), _init3 = _init3 ? _init3.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init3;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'uninstall', [toxicDecorators.frozen], (_init4 = _Object$getOwnPropertyDescriptor(_class2, 'uninstall'), _init4 = _init4 ? _init4.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init4;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'hasInstalled', [toxicDecorators.frozen], (_init5 = _Object$getOwnPropertyDescriptor(_class2, 'hasInstalled'), _init5 = _init5 ? _init5.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init5;
  }
}), _class2), _applyDecoratedDescriptor(_class2, 'getPluginConfig', [toxicDecorators.frozen], (_init6 = _Object$getOwnPropertyDescriptor(_class2, 'getPluginConfig'), _init6 = _init6 ? _init6.value : undefined, {
  enumerable: true,
  configurable: true,
  writable: true,
  initializer: function initializer() {
    return _init6;
  }
}), _class2)), _class2)) || _class);

/**
 * chimee-plugin-controlbar v0.1.3
 * (c) 2017 yandeqiang
 * Released under ISC
 */

function __$styleInject$1(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

__$styleInject$1("chimee-clarity-list,chimee-progressbar-tip,chimee-screen-full,chimee-screen-small{display:none}chimee-control.full chimee-screen-full,chimee-control.small chimee-screen-small{display:inline-block;width:2em;height:100%}chimee-control{display:block;height:100%;line-height:2em;font-size:14px;user-select:none;overflow:hidden;font-family:Roboto,Arial,Helvetica,sans-serif;transition:visibility .5s ease}chimee-control,chimee-control-wrap{position:absolute;bottom:0;left:0;width:100%}chimee-control-wrap{height:2em;display:table;background:rgba(0,0,0,.5);transition:bottom .5s ease;pointer-events:auto}.chimee-component{display:table-cell;height:2em;padding:.3em .3em .2em;box-sizing:border-box;vertical-align:top;cursor:pointer;width:1%;line-height:1em;white-space:nowrap}chimee-control-state.chimee-component{width:3em;text-align:right}chimee-control-state .left,chimee-control-state .right{transition:all .2s ease-in-out}chimee-control-state svg{width:2em;height:1.4em}chimee-progressbar.chimee-component{width:auto;position:relative}chimee-progressbar.two-line chimee-progressbar-wrap{top:-1.6em;height:1.6em}chimee-progressbar-wrap{display:inline-block;height:100%;position:absolute;left:1em;right:1em;top:0}chimee-progressbar.two-line .chimee-progressbar-line{top:.8em}.chimee-progressbar-line{position:absolute;top:.9em;left:0;display:inline-block;height:3px}chimee-progressbar-bg{width:100%;background:#4c4c4c}chimee-progressbar-buffer{width:0;background:#6f6f6f}chimee-progressbar-all{background:#de698c}chimee-progressbar-ball{content:\"\";position:absolute;right:-.8em;top:-.3em;display:inline-block;width:.8em;height:.8em;border-radius:.8em;background:#fff;pointer-events:none}chimee-progressbar-tip{position:absolute;bottom:.5em;top:-1.5em;left:0;z-index:1;padding:0 .5em;height:1.5em;background:#fff;line-height:1.5em;border-radius:4px;color:#000;text-align:center}chimee-progresstime.chimee-component{color:#fff;font-weight:400;text-align:center;white-space:nowrap;padding:.5em}chimee-progresstime-pass,chimee-progresstime-total{display:inline}chimee-volume.chimee-component{cursor:pointer;padding:0;line-height:2em}chimee-volume-state{width:3em;vertical-align:6px}chimee-volume-state svg{width:2em;height:1.4em}chimee-volume .line,chimee-volume .ring1,chimee-volume .ring2{stroke-dasharray:150;stroke-dashoffset:150;transition:stroke-dashoffset .7s ease-in-out}chimee-volume.high .ring1,chimee-volume.high .ring2,chimee-volume.low .ring2,chimee-volume.mute .line,chimee-volume.mute .ring1,chimee-volume.mute .ring2{stroke-dashoffset:0}chimee-volume-bar{position:relative;display:inline-block;width:4em;height:100%;margin:0 .5em}chimee-volume-bar-all,chimee-volume-bar-bg{position:absolute;top:.9em;left:0;display:inline-block;height:3px}chimee-volume-bar-bg{width:100%;background:#4c4c4c}chimee-volume-bar-all{background:#de698c}chimee-volume-bar-all:after{content:\"\";position:absolute;right:-.2em;top:-.3em;display:inline-block;width:.8em;height:.8em;border-radius:.8em;background:#fff}chimee-screen.chimee-component{width:3em;text-align:left}chimee-screen-small{background:url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjYxcHgiIGhlaWdodD0iNjJweCIgdmlld0JveD0iMCAwIDYxIDYyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4xICgzOTAxMikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuNzU2MzA4LCAzMC42MjE4NjcpIHJvdGF0ZSg0NS4wMDAwMDApIHRyYW5zbGF0ZSgtMzAuNzU2MzA4LCAtMzAuNjIxODY3KSB0cmFuc2xhdGUoMTUuNzU2MzA4LCAtMTIuMzc4MTMzKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBwb2ludHM9IjExLjUxOTA3ODYgNDYuOTQzMTc3OCAxMS43MjEwMDkzIDcwLjc5MTM3NzMgMC41NjUxODA1MjcgNzAuNzkxMzc3MyAxNS40Njc0NDU1IDg1LjgzNTMxMjUgMjkuMzcwMjA5NiA3MC43OTEzNzczIDE4LjU1NzMyNDcgNzAuNzcwMjE1NiAxOC41NTczMjQ3IDQ2Ljk0MzE3NzgiPjwvcG9seWdvbj4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0Ljk2NzY5NSwgMTkuNzIwMTk4KSByb3RhdGUoMTgwLjAwMDAwMCkgdHJhbnNsYXRlKC0xNC45Njc2OTUsIC0xOS43MjAxOTgpICIgcG9pbnRzPSIxMS41MTkwNzg2IDAuMjc0MTMwMjc4IDExLjcyMTAwOTMgMjQuMTIyMzI5OCAwLjU2NTE4MDUyNyAyNC4xMjIzMjk4IDE1LjQ2NzQ0NTUgMzkuMTY2MjY0OSAyOS4zNzAyMDk2IDI0LjEyMjMyOTggMTguNTU3MzI0NyAyNC4xMDExNjgxIDE4LjU1NzMyNDcgMC4yNzQxMzAyNzgiPjwvcG9seWdvbj4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);background-repeat:no-repeat;background-size:contain;background-position:50%}chimee-screen-full{background:url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjY3cHgiIGhlaWdodD0iNjZweCIgdmlld0JveD0iMCAwIDY3IDY2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4xICgzOTAxMikgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzY3JlZW4tc21hbGwiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMzLjc1NjMwOCwgMzIuNjIxODY3KSByb3RhdGUoNDUuMDAwMDAwKSB0cmFuc2xhdGUoLTMzLjc1NjMwOCwgLTMyLjYyMTg2NykgdHJhbnNsYXRlKDE4Ljc1NjMwOCwgLTEwLjM3ODEzMykiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICA8cG9seWdvbiBpZD0iUGF0aCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQuOTY3Njk1LCA2Ni4zODkyNDUpIHJvdGF0ZSgxODAuMDAwMDAwKSB0cmFuc2xhdGUoLTE0Ljk2NzY5NSwgLTY2LjM4OTI0NSkgIiBwb2ludHM9IjExLjUxOTA3ODYgNDYuOTQzMTc3OCAxMS43MjEwMDkzIDcwLjc5MTM3NzMgMC41NjUxODA1MjcgNzAuNzkxMzc3MyAxNS40Njc0NDU1IDg1LjgzNTMxMjUgMjkuMzcwMjA5NiA3MC43OTEzNzczIDE4LjU1NzMyNDcgNzAuNzcwMjE1NiAxOC41NTczMjQ3IDQ2Ljk0MzE3NzgiPjwvcG9seWdvbj4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIHBvaW50cz0iMTEuNTE5MDc4NiAwLjI3NDEzMDI3OCAxMS43MjEwMDkzIDI0LjEyMjMyOTggMC41NjUxODA1MjcgMjQuMTIyMzI5OCAxNS40Njc0NDU1IDM5LjE2NjI2NDkgMjkuMzcwMjA5NiAyNC4xMjIzMjk4IDE4LjU1NzMyNDcgMjQuMTAxMTY4MSAxOC41NTczMjQ3IDAuMjc0MTMwMjc4Ij48L3BvbHlnb24+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);background-repeat:no-repeat;background-size:contain;background-position:50%}chimee-clarity.chimee-component{position:relative;color:#fff;padding:0;padding-right:1em;padding-left:1em;text-align:center;vertical-align:middle;font-size:16px}chimee-clarity-list{position:absolute;left:-1em;line-height:2em;width:6em;padding-bottom:1.5em;opacity:.8;box-sizing:content-box}chimee-clarity-list ul{margin:0;padding:1em 0;background:#292929}chimee-clarity-list li{list-style-type:none}chimee-clarity-list li.active,chimee-clarity-list li:hover{color:#57b0f6}", undefined);

/**
 * bind the function with some context. we have some fallback strategy here
 * @param {function} fn the function which we need to bind the context on
 * @param {any} context the context object
 */
function bind$1(fn, context) {
  if (fn.bind) {
    return fn.bind(context);
  } else if (fn.apply) {
    return function __autobind__() {
      for (var _len2 = arguments.length, args = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return fn.apply(context, args);
    };
  } else {
    return function __autobind__() {
      for (var _len3 = arguments.length, args = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return fn.call.apply(fn, [context].concat(_toConsumableArray(args)));
    };
  }
}

var Base = function () {
  function Base(parent) {
    _classCallCheck(this, Base);

    this.parent = parent;
  }

  _createClass(Base, [{
    key: 'create',
    value: function create() {
      this.createEl();
      this.addAllEvent();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeAllEvent();
      this.parent.$wrap.removeChild(this.$dom);
    }
  }, {
    key: 'createEl',
    value: function createEl() {
      this.$dom = document.createElement(this.option.tag);
      this.$dom.innerHTML = this.option.defaultHtml || this.option.html;
      this.parent.$wrap.appendChild(this.$dom);
    }
  }, {
    key: 'addAllEvent',
    value: function addAllEvent() {
      var _this = this;

      this.option.defaultEvent && _Object$keys(this.option.defaultEvent).forEach(function (item) {
        var key = _this.option.defaultEvent[item];
        _this[key] = bind$1(_this[key], _this);
        chimeeHelper.addEvent(_this.$dom, item, _this[key], false, false);
      });
      this.option.event && _Object$keys(this.option.event).forEach(function (item) {
        var key = '__' + item;
        _this[key] = _this.option.event[item];
        chimeeHelper.addEvent(_this.$dom, item, _this[key], false, false);
      });
    }
  }, {
    key: 'removeAllEvent',
    value: function removeAllEvent() {
      var _this2 = this;

      this.option.defaultEvent && _Object$keys(this.option.defaultEvent).forEach(function (item) {
        chimeeHelper.removeEvent(_this2.$dom, item, _this2[_this2.option.defaultEvent[item]], false, false);
      });
      this.option.event && _Object$keys(this.option.event).forEach(function (item) {
        var key = '__' + item;
        // this[key] = this.option.event[item];
        chimeeHelper.removeEvent(_this2.$dom, item, _this2[key], false, false);
      });
    }
  }]);

  return Base;
}();

/**
 * 自定义组件配置
 */

var Component = function (_Base) {
  _inherits(Component, _Base);

  function Component(parent, option) {
    _classCallCheck(this, Component);

    var _this = _possibleConstructorReturn(this, (Component.__proto__ || _Object$getPrototypeOf(Component)).call(this, parent));

    _this.option = option;
    _this.init();
    return _this;
  }

  _createClass(Component, [{
    key: 'init',
    value: function init() {
      _get(Component.prototype.__proto__ || _Object$getPrototypeOf(Component.prototype), 'create', this).call(this);
      chimeeHelper.addClassName(this.$dom, 'chimee-component');
      // 用户自定义配置
      var width = this.option.width || '2em';
      chimeeHelper.setStyle(this.$dom, 'width', width);
    }
  }]);

  return Component;
}(Base);

/**
 * play 配置
 */

var defaultOption = {
  tag: 'chimee-control-state',
  defaultHtml: '\n    <svg viewBox="0 0 206 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n      <g fill="#ffffff" stroke="#ffffff">\n        <path class="left"></path>\n        <path class="right"></path>\n      </g>\n    </svg>\n  ',
  defaultEvent: {
    click: 'click'
  }
};

var Play = function (_Base) {
  _inherits(Play, _Base);

  function Play(parent, option) {
    _classCallCheck(this, Play);

    var _this = _possibleConstructorReturn(this, (Play.__proto__ || _Object$getPrototypeOf(Play)).call(this, parent));

    _this.option = chimeeHelper.deepAssign(defaultOption, chimeeHelper.isObject(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(Play, [{
    key: 'init',
    value: function init() {
      _get(Play.prototype.__proto__ || _Object$getPrototypeOf(Play.prototype), 'create', this).call(this);
      if (this.option.icon) {
        this.$dom.innerHTML = '';
        chimeeHelper.setStyle(this.$dom, {
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: this.option.width + ' ' + this.option.height
        });
      }
      chimeeHelper.addClassName(this.$dom, 'chimee-component');
      this.$left = chimeeHelper.$(this.$dom).find('.left');
      this.$right = chimeeHelper.$(this.$dom).find('.right');
      // 用户自定义配置
      this.option.width && chimeeHelper.setStyle(this.$dom, 'width', this.option.width);
      this.changeState('pause');
    }
  }, {
    key: 'changeState',
    value: function changeState(state) {
      var nextState = state === 'play' ? 'pause' : 'play';
      this.state = state;
      chimeeHelper.addClassName(this.parent.$dom, nextState);
      chimeeHelper.removeClassName(this.parent.$dom, state);
      if (this.option.icon) {
        chimeeHelper.setStyle(this.$dom, {
          backgroundImage: 'url(' + this.option.icon[nextState] + ')'
        });
      } else {
        this.setPath(nextState);
      }
    }
  }, {
    key: 'click',
    value: function click(e) {
      console.log(e);
      var nextState = this.state === 'play' ? 'pause' : 'play';
      this.changeState(nextState);
      this.parent.$emit(nextState);
    }
  }, {
    key: 'setPath',
    value: function setPath(state) {
      var _this2 = this;

      this.$left.attr('d', 'M0.921875,0.265625L0.921875,197.074852L79.3611755,172.829747L79.3611755,26.9775543Z');
      this.$right.attr('d', 'M126.921875,22.56643L126.921875,182.056305L205.361168,144.776862L205.361168,56.6476783Z');
      setTimeout(function () {
        if (state === 'play') {
          _this2.$left.attr('d', 'M0.921875,0.265625L0.921875,197.074852L95.7890625,149L96.2929688,49Z');
          _this2.$right.attr('d', 'M90.3142151,45.9315226L90.3142151,151.774115L201.600944,99.9938782L201.600944,98.0237571Z');
        } else {
          _this2.$left.attr('d', 'M0.921875,1.265625L0.921875,198.074852L79.3611677,198.074852L79.3611677,0.258923126Z');
          _this2.$right.attr('d', 'M126.921875,1.265625L126.921875,198.074852L205.361168,198.074852L205.361168,0.258923126Z');
        }
      }, 140);
    }
  }]);

  return Play;
}(Base);

var _class$1$1;

function _applyDecoratedDescriptor$1$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

/**
 * Volume 配置
 */

var defaultOption$1 = {
  tag: 'chimee-volume',
  defaultHtml: '\n    <chimee-volume-state>\n      <svg viewBox="0 0 107 101" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n        <g class="volume" stroke="#ffffff">\n          <polygon class="horn" fill="#ffffff" points="0.403399942 30 27.3842118 30 56.8220589 2.84217094e-14 57.9139815 100 27.3842118 70 0.403399942 70"></polygon>\n          <path class="ring1" d="M63,5.00975239 C69.037659,4.78612057 75.9178585,8.40856146 83.6405984,15.877075 C95.2247083,27.0798454 100,34.7975125 100,50.9608558 C100,67.1241991 95.3628694,73.7907482 83.6405984,83.8306724 C75.8257511,90.5239552 68.9455516,94.0320644 63,94.355" stroke-width="10"></path>\n          <path class="ring2" d="M65.2173913,29.4929195 C67.8779343,29.3931169 70.9097496,31.0097416 74.3128371,34.3427934 C79.4174684,39.3423712 81.5217391,42.7866154 81.5217391,50 C81.5217391,57.2133846 79.4783502,60.1885354 74.3128371,64.6691576 C70.8691617,67.656239 67.8373465,69.2218397 65.2173913,69.3659595" stroke-width="10"></path>\n          <path class="line" d="M4.19119202,3.65220497 L102,96" stroke-width="10"></path>\n        </g>\n    </svg>\n    </chimee-volume-state>\n    <chimee-volume-bar>\n      <chimee-volume-bar-bg></chimee-volume-bar-bg>\n      <chimee-volume-bar-all></chimee-volume-bar-all>\n      <chimee-volume-bar-track></chimee-volume-bar-track>\n    </chimee-volume-bar>\n  ',
  defaultEvent: {
    mousedown: 'mousedown'
  }
};

var getElementPath = function getElementPath(elem) {
  var path = [];
  if (elem === null) return path;
  path.push(elem);
  while (elem.parentNode !== null) {
    elem = elem.parentNode;
    path.push(elem);
  }
  return path;
};

var Volume = (_class$1$1 = function (_Base) {
  _inherits(Volume, _Base);

  function Volume(parent, option) {
    _classCallCheck(this, Volume);

    var _this = _possibleConstructorReturn(this, (Volume.__proto__ || _Object$getPrototypeOf(Volume)).call(this, parent));

    _this.parent.preVolume = 0;
    _this.option = chimeeHelper.deepAssign(defaultOption$1, chimeeHelper.isObject(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(Volume, [{
    key: 'inited',
    value: function inited() {
      this.update();
    }
  }, {
    key: 'init',
    value: function init() {
      _get(Volume.prototype.__proto__ || _Object$getPrototypeOf(Volume.prototype), 'create', this).call(this);
      this.$state = chimeeHelper.$('chimee-volume-state', this.$dom);
      if (this.option.icon) {
        this.$state.html('');
        this.$state.css({
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: this.option.width + ' ' + this.option.height
        });
      }
      this.$bar = chimeeHelper.$('chimee-volume-bar', this.$dom);
      this.$all = chimeeHelper.$('chimee-volume-bar-all', this.$dom);
      this.$bg = chimeeHelper.$('chimee-volume-bar-bg', this.$dom);
      chimeeHelper.addClassName(this.$dom, 'chimee-component');
      this.changeState();
      // 用户自定义配置
      this.option.width && chimeeHelper.setStyle(this.$dom, 'width', this.option.width);
    }
  }, {
    key: 'changeState',
    value: function changeState() {
      if (this.parent.volume === 0) {
        this.state = 'mute';
      } else if (this.parent.volume > 0 && this.parent.volume <= 0.5) {
        this.state = 'low';
      } else if (this.parent.volume > 0.5 && this.parent.volume <= 1) {
        this.state = 'high';
      }
      chimeeHelper.removeClassName(this.$dom, 'mute low high');
      chimeeHelper.addClassName(this.$dom, this.state);
      if (this.option.icon) {
        this.$state.css({
          backgroundImage: 'url(' + this.option.icon[this.state] + ')'
        });
      }
    }
  }, {
    key: 'click',
    value: function click(e) {
      var path = e.path || getElementPath(e.target);
      if (path.indexOf(this.$state[0]) !== -1) {
        this.stateClick(e);
      } else if (path.indexOf(this.$bar[0]) !== -1) {
        this.barClick(e);
      }
    }
  }, {
    key: 'stateClick',
    value: function stateClick() {
      var currentVolume = this.parent.volume;
      this.parent.volume = currentVolume === 0 ? this.parent.preVolume : 0;
      this.parent.preVolume = currentVolume;
      this.changeState();
    }
  }, {
    key: 'barClick',
    value: function barClick(e) {
      var volume = e.layerX / this.$bg[0].offsetWidth;
      this.parent.volume = volume < 0 ? 0 : volume > 1 ? 1 : volume;
      this.update();
    }
  }, {
    key: 'mousedown',
    value: function mousedown(e) {
      this.click(e);
      this.startX = e.clientX;
      this.startVolume = this.parent.volume;
      chimeeHelper.addEvent(window, 'mousemove', this.draging);
      chimeeHelper.addEvent(window, 'mouseup', this.dragEnd);
      chimeeHelper.addEvent(window, 'contextmenu', this.dragEnd);
    }

    /**
     * 更新声音条
     */

  }, {
    key: 'update',
    value: function update() {
      this.changeState();
      this.$all.css('width', this.parent.volume * 100 + '%');
    }

    /**
     * 开始拖拽
     * @param {EventObject} e 鼠标事件
     */

  }, {
    key: 'draging',
    value: function draging(e) {
      this.endX = e.clientX;
      var dragVolume = (this.endX - this.startX) / this.$bg[0].offsetWidth;
      var dragAfterVolume = +(this.startVolume + dragVolume).toFixed(2);
      this.parent.volume = dragAfterVolume < 0 ? 0 : dragAfterVolume > 1 ? 1 : dragAfterVolume;
    }

    /**
     * 结束拖拽
     */

  }, {
    key: 'dragEnd',
    value: function dragEnd() {
      this.startX = 0;
      this.startVolume = 0;
      chimeeHelper.removeEvent(window, 'mousemove', this.draging);
      chimeeHelper.removeEvent(window, 'mouseup', this.dragEnd);
      chimeeHelper.removeEvent(window, 'contextmenu', this.dragEnd);
    }
  }]);

  return Volume;
}(Base), (_applyDecoratedDescriptor$1$1(_class$1$1.prototype, 'draging', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$1$1.prototype, 'draging'), _class$1$1.prototype), _applyDecoratedDescriptor$1$1(_class$1$1.prototype, 'dragEnd', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$1$1.prototype, 'dragEnd'), _class$1$1.prototype)), _class$1$1);

var _class$1$2;

function _applyDecoratedDescriptor$1$2(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var defaultOption$2 = {
  tag: 'chimee-progressbar',
  defaultHtml: '\n    <chimee-progressbar-wrap>\n      <chimee-progressbar-bg class="chimee-progressbar-line"></chimee-progressbar-bg>\n      <chimee-progressbar-buffer class="chimee-progressbar-line"></chimee-progressbar-buffer>\n      <chimee-progressbar-all class="chimee-progressbar-line">\n        <chimee-progressbar-ball></chimee-progressbar-ball>\n      </chimee-progressbar-all>\n      <chimee-progressbar-tip></chimee-progressbar-tip>\n    </chimee-progressbar-wrap>\n  ',
  defaultEvent: {}
};

var ProgressBar = (_class$1$2 = function (_Base) {
  _inherits(ProgressBar, _Base);

  function ProgressBar(parent, option) {
    _classCallCheck(this, ProgressBar);

    var _this = _possibleConstructorReturn(this, (ProgressBar.__proto__ || _Object$getPrototypeOf(ProgressBar)).call(this, parent));

    _this.option = chimeeHelper.deepAssign(defaultOption$2, chimeeHelper.isObject(option) ? option : {});
    _this.visiable = option !== false;
    _this.init();
    return _this;
  }

  _createClass(ProgressBar, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      _get(ProgressBar.prototype.__proto__ || _Object$getPrototypeOf(ProgressBar.prototype), 'create', this).call(this);
      this.$wrap = chimeeHelper.$('chimee-progressbar-wrap', this.$dom);
      this.$buffer = chimeeHelper.$('chimee-progressbar-buffer', this.$dom);
      this.$all = chimeeHelper.$('chimee-progressbar-all', this.$dom);
      this.$tip = chimeeHelper.$('chimee-progressbar-tip', this.$dom);
      this.$track = chimeeHelper.$('chimee-progressbar-track', this.$dom);
      this.$line = chimeeHelper.$('.chimee-progressbar-line', this.$dom);
      this.$ball = chimeeHelper.$('chimee-progressbar-ball', this.$dom);
      chimeeHelper.addClassName(this.$dom, 'chimee-component');

      // css 配置
      !this.visiable && chimeeHelper.setStyle(this.$dom, 'visibility', 'hidden');
      // this.$line.css({
      //   top: this.$wrap.
      // });
      // 进度条居中布局，还是在上方
      if (this.option.layout === 'two-line') {
        chimeeHelper.addClassName(this.$dom, 'two-line');
        this.$wrap.css({
          left: -this.$dom.offsetLeft + 'px',
          // top: -this.$ball[0].offsetHeight * 2 + 'px',
          width: this.parent.$dom.offsetWidth + 'px'
          // height: this.$ball[0].offsetHeight * 2 + 'px'
        });
        // this.$line.css({
        //   top: this.$ball[0].offsetHeight + 'px'
        // }) 
        chimeeHelper.setStyle(this.parent.$wrap, 'paddingTop', this.$ball[0].offsetHeight + 'px');
        this.watch_screen = this.parent.$watch('isFullScreen', function () {
          _this2.$wrap.css({
            width: _this2.parent.$dom.offsetWidth + 'px'
          });
        });
      } else {
        // this.$line.css({
        //   top: this.$wrap[0].offsetHeight / 2 + 'px'
        // }) 
      }
      this.addWrapEvent();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.removeWrapEvent();
      _get(ProgressBar.prototype.__proto__ || _Object$getPrototypeOf(ProgressBar.prototype), 'destroy', this).call(this);
      this.watch_screen();
    }
  }, {
    key: 'addWrapEvent',
    value: function addWrapEvent() {
      this.$wrap.on('mousedown', this.mousedown);
      this.$wrap.on('mouseenter', this.mouseenter);
    }
  }, {
    key: 'removeWrapEvent',
    value: function removeWrapEvent() {
      this.$wrap.off('mousedown', this.mousedown);
      this.$wrap.off('mouseenter', this.mouseenter);
    }

    /**
     * 缓存进度条更新 progress 事件
     */

  }, {
    key: 'progress',
    value: function progress() {
      var buffer = 0;
      try {
        buffer = this.parent.buffered.end(0);
      } catch (e) {}
      var bufferWidth = buffer / this.parent.duration * 100 + '%';
      this.$buffer.css('width', bufferWidth);
    }

    /**
     * requestAnimationFrame 来更新进度条, timeupdate 事件
     */

  }, {
    key: 'update',
    value: function update() {
      var allWidth = this.$wrap[0].offsetWidth - this.$ball[0].offsetWidth;
      var time = this._currentTime !== undefined ? this._currentTime : this.parent.currentTime;
      var timePer = time ? time / this.parent.duration : 0;
      var timeWidth = timePer * allWidth;
      this.$all.css('width', timeWidth);
    }
  }, {
    key: 'mousedown',
    value: function mousedown(e) {
      if (e.target === this.$tip[0]) return;
      this._currentTime = this.parent.currentTime = e.layerX / this.$wrap[0].offsetWidth * this.parent.duration;
      this.update();
      this.startX = e.clientX;
      this.startTime = this.parent.currentTime;
      chimeeHelper.addEvent(window, 'mousemove', this.draging);
      chimeeHelper.addEvent(window, 'mouseup', this.dragEnd);
      chimeeHelper.addEvent(window, 'contextmenu', this.dragEnd);
    }

    /**
     * 开始拖拽
     * @param {EventObject} e 鼠标事件
     */

  }, {
    key: 'draging',
    value: function draging(e) {
      this.endX = e.clientX;
      var dragTime = (this.endX - this.startX) / this.$wrap[0].offsetWidth * this.parent.duration;
      var dragAfterTime = +(this.startTime + dragTime).toFixed(2);
      this._currentTime = dragAfterTime < 0 ? 0 : dragAfterTime > this.parent.duration ? this.parent.duration : dragAfterTime;
      this.update();
    }

    /**
     * 结束拖拽
     */

  }, {
    key: 'dragEnd',
    value: function dragEnd() {
      this.startX = 0;
      this.startTime = 0;
      this.parent.currentTime = this._currentTime;
      this._currentTime = undefined;
      chimeeHelper.removeEvent(window, 'mousemove', this.draging);
      chimeeHelper.removeEvent(window, 'mouseup', this.dragEnd);
      chimeeHelper.removeEvent(window, 'contextmenu', this.dragEnd);
    }
  }, {
    key: 'mouseenter',
    value: function mouseenter() {
      this.$wrap.on('mousemove', this.tipShow);
      this.$wrap.on('mouseleave', this.tipEnd);
    }
  }, {
    key: 'tipShow',
    value: function tipShow(e) {
      if (e.target === this.$tip[0]) return;
      var time = e.layerX / this.$wrap[0].offsetWidth * this.parent.duration;
      time = time < 0 ? 0 : time > this.parent.duration ? this.parent.duration : time;
      var tipContent = chimeeHelper.formatTime(time);
      var left = e.layerX - this.$tip[0].offsetWidth / 2;
      var leftBound = this.$wrap[0].offsetWidth - this.$tip[0].offsetWidth;
      left = left < 0 ? 0 : left > leftBound ? leftBound : left;
      this.$tip.text(tipContent);
      this.$tip.css('display', 'inline-block');
      this.$tip.css('left', left + 'px');
    }
  }, {
    key: 'tipEnd',
    value: function tipEnd() {
      this.$wrap.off('mousemove', this.tipShow);
      this.$wrap.off('mouseleave', this.tipEnd);
      this.$tip.css('display', 'none');
    }
  }]);

  return ProgressBar;
}(Base), (_applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'mousedown', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'mousedown'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'draging', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'draging'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'dragEnd', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'dragEnd'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'mouseenter', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'mouseenter'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'tipShow', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'tipShow'), _class$1$2.prototype), _applyDecoratedDescriptor$1$2(_class$1$2.prototype, 'tipEnd', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$1$2.prototype, 'tipEnd'), _class$1$2.prototype)), _class$1$2);

/**
 * progressTime 配置
 */

var defaultOption$3 = {
  tag: 'chimee-progresstime',
  defaultHtml: '\n    <chimee-progresstime-pass>00:00</chimee-progresstime-pass\n    ><chimee-progresstime-total\n      ><span>/</span\n      ><chimee-progresstime-total-value>00:00</chimee-progresstime-total-value>\n    </chimee-progresstime-total>\n  ',
  defaultEvent: {}
};

var ProgressTime = function (_Base) {
  _inherits(ProgressTime, _Base);

  function ProgressTime(parent, option) {
    _classCallCheck(this, ProgressTime);

    var _this = _possibleConstructorReturn(this, (ProgressTime.__proto__ || _Object$getPrototypeOf(ProgressTime)).call(this, parent));

    _this.option = chimeeHelper.deepAssign(defaultOption$3, chimeeHelper.isObject(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(ProgressTime, [{
    key: 'init',
    value: function init() {
      _get(ProgressTime.prototype.__proto__ || _Object$getPrototypeOf(ProgressTime.prototype), 'create', this).call(this);
      this.$total = chimeeHelper.$('chimee-progresstime-total-value', this.$dom);
      this.$pass = chimeeHelper.$('chimee-progresstime-pass', this.$dom);
      chimeeHelper.addClassName(this.$dom, 'chimee-component');

      // 用户自定义配置
      // this.option.width && setStyle(this.$dom, 'width', this.option.width);
    }
  }, {
    key: 'updatePass',
    value: function updatePass() {
      this.$pass.text(chimeeHelper.formatTime(this.parent.currentTime));
    }
  }, {
    key: 'updateTotal',
    value: function updateTotal() {
      this.$total.text(chimeeHelper.formatTime(this.parent.duration));
    }
  }]);

  return ProgressTime;
}(Base);

var _class$2$1;

function _applyDecoratedDescriptor$2$1(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var screenEvent = '';
var currentScreenElement = '';

if (document.webkitCancelFullScreen) {
  screenEvent = 'webkitfullscreenchange';
  currentScreenElement = 'webkitFullscreenElement';
} else if (document.mozCancelFullScreen) {
  screenEvent = 'mozfullscreenchange';
  currentScreenElement = 'mozFullScreenElement';
} else if (document.msExitFullscreen) {
  screenEvent = 'msfullscreenchange';
  currentScreenElement = 'msFullscreenElement';
} else if (document.exitFullscreen) {
  screenEvent = 'fullscreenchange';
  currentScreenElement = 'fullscreenElement';
}

/**
 * Screen 配置
 */

var defaultOption$4 = {
  tag: 'chimee-screen',
  defaultHtml: '\n    <chimee-screen-full></chimee-screen-full>\n    <chimee-screen-small></chimee-screen-small>\n  ',
  defaultEvent: {
    click: 'click'
  }
};

var Screen = (_class$2$1 = function (_Base) {
  _inherits(Screen, _Base);

  function Screen(parent, option) {
    _classCallCheck(this, Screen);

    var _this = _possibleConstructorReturn(this, (Screen.__proto__ || _Object$getPrototypeOf(Screen)).call(this, parent));

    _this.state = 'small';
    _this.option = chimeeHelper.deepAssign(defaultOption$4, chimeeHelper.isObject(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(Screen, [{
    key: 'init',
    value: function init() {
      _get(Screen.prototype.__proto__ || _Object$getPrototypeOf(Screen.prototype), 'create', this).call(this);
      if (this.option.icon) {
        this.$dom.innerHTML = '';
        chimeeHelper.setStyle(this.$dom, {
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: this.option.width + ' ' + this.option.height
        });
      }
      this.changeState(this.state);
      // addClassName(this.$dom, 'flex-item');
      chimeeHelper.addClassName(this.$dom, 'chimee-component');
      // 用户自定义配置
      this.option.width && chimeeHelper.setStyle(this.$dom, 'width', this.option.width);
    }
  }, {
    key: 'changeState',
    value: function changeState(state) {
      var removeState = state === 'small' ? 'full' : 'small';
      chimeeHelper.addClassName(this.parent.$dom, state);
      chimeeHelper.removeClassName(this.parent.$dom, removeState);
      if (this.option.icon) {
        chimeeHelper.setStyle(this.$dom, {
          backgroundImage: 'url(' + this.option.icon[state] + ')'
        });
      }
    }
  }, {
    key: 'click',
    value: function click() {
      var full = false;
      if (this.state === 'small') {
        this.state = 'full';
        full = true;
      } else {
        this.state = 'small';
        full = false;
      }
      this.changeState(this.state);
      this.parent.$fullScreen(full, 'container');
      if (full) {
        chimeeHelper.addEvent(document, screenEvent, this.screenChange);
      } else {
        chimeeHelper.removeEvent(document, screenEvent, this.screenChange);
      }
    }
  }, {
    key: 'screenChange',
    value: function screenChange() {
      if (document[currentScreenElement]) return;
      this.state = 'small';
      this.changeState('small');
      this.parent.$fullScreen(false, 'container');
    }
  }]);

  return Screen;
}(Base), (_applyDecoratedDescriptor$2$1(_class$2$1.prototype, 'screenChange', [toxicDecorators.autobind], _Object$getOwnPropertyDescriptor(_class$2$1.prototype, 'screenChange'), _class$2$1.prototype)), _class$2$1);

function getComputedStyleNum(elem, prop) {
  return parseInt(getComputedStyle(elem)[prop]);
}

/**
 * play 配置
 */

var defaultOption$5 = {
  tag: 'chimee-clarity',
  width: '2em',
  defaultHtml: '\n    <chimee-clarity-text></chimee-clarity-text>\n    <chimee-clarity-list>\n      <ul></ul>\n      <i class="chimee-clarity-list-arrow">\n        <svg viewBox="0 0 115 6"  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n          <g id="Group-3-Copy" fill="#57B0F6">\n            <polygon id="Path-2" points="0.0205224145 0.0374249581 0.0205224145 2.12677903 53.9230712 2.12677903 57.1127727 5.3468462 60.2283558 2.12677903 113.820935 2.12677903 113.820935 0.0374249581"></polygon>\n          </g>\n        </svg>\n      </i>\n    </chimee-clarity-list>\n  ',
  defaultEvent: {
    mouseenter: 'mouseenter',
    mouseleave: 'mouseleave',
    click: 'click'
  }
};

var Clarity = function (_Base) {
  _inherits(Clarity, _Base);

  function Clarity(parent, option) {
    _classCallCheck(this, Clarity);

    var _this = _possibleConstructorReturn(this, (Clarity.__proto__ || _Object$getPrototypeOf(Clarity)).call(this, parent));

    _this.option = chimeeHelper.deepAssign(defaultOption$5, chimeeHelper.isObject(option) ? option : {});
    _this.init();
    return _this;
  }

  _createClass(Clarity, [{
    key: 'init',
    value: function init() {
      _get(Clarity.prototype.__proto__ || _Object$getPrototypeOf(Clarity.prototype), 'create', this).call(this);
      chimeeHelper.addClassName(this.$dom, 'chimee-component');

      this.$text = chimeeHelper.$(this.$dom).find('chimee-clarity-text');
      this.$list = chimeeHelper.$(this.$dom).find('chimee-clarity-list');
      this.$listUl = this.$list.find('ul');

      // 用户自定义配置
      this.option.width && chimeeHelper.setStyle(this.$dom, 'width', this.option.width);

      this.initTextList();
      // 读当前 css 设置去配置
      var lineHeight = getComputedStyleNum(this.$listUl.find('li')[0], 'lineHeight');
      var listPaddingBottom = getComputedStyleNum(this.$list[0], 'paddingBottom');
      var listFontSize = getComputedStyleNum(this.$list[0], 'fontSize');
      var ulPaddingTop = getComputedStyleNum(this.$listUl[0], 'paddingTop');
      var ulPaddingBottom = getComputedStyleNum(this.$listUl[0], 'paddingBottom');
      // css
      this.$list.css({
        top: listFontSize / 2 - listPaddingBottom - ulPaddingTop - ulPaddingBottom - this.option.list.length * lineHeight + 'px'
      });
    }
  }, {
    key: 'initTextList',
    value: function initTextList() {
      var _this2 = this;

      this.option.list.forEach(function (item) {
        var li = chimeeHelper.$(document.createElement('li'));
        li.attr('data-url', item.src);
        li.text(item.name);
        if (item.src === _this2.parent.$videoConfig.src) {
          _this2.$text.text(item.name);
          li.addClass('active');
        }
        _this2.$listUl.append(li);
      });
    }
  }, {
    key: 'mouseenter',
    value: function mouseenter(e) {
      this.$list.css('display', 'inline-block');
    }
  }, {
    key: 'mouseleave',
    value: function mouseleave(e) {
      this.$list.css('display', 'none');
    }
  }, {
    key: 'click',
    value: function click(e) {
      var elem = e.target;
      if (elem.tagName === 'LI') {
        _Array$from(elem.parentElement.children).map(function (item) {
          chimeeHelper.removeClassName(item, 'active');
        });
        var url = elem.getAttribute('data-url') || '';
        chimeeHelper.addClassName(e.target, 'active');
        this.$text.text(e.target.textContent);
        this.switchClarity(url);
      }
    }
  }, {
    key: 'switchClarity',
    value: function switchClarity(url) {
      var _this3 = this;

      if (this.loadOption) {
        this.loadOption.abort = true;
      }
      this.loadOption = {
        abort: false,
        repeatTimes: 3,
        increment: 1
      };
      var currentTime = this.parent.currentTime;
      this.parent.$silentLoad(url, this.loadOption).then(function () {
        _this3.parent.currentTime = currentTime;
        _this3.loadOption = undefined;
      }).catch(function (e) {});
      this.mouseleave();
    }
  }]);

  return Clarity;
}(Base);

function hundleChildren(plugin) {
  var childConfig = {};
  if (!plugin.$config.children) {
    childConfig = plugin.isLive ? {
      play: true, // 底部播放暂停按钮
      progressTime: false, // 播放时间
      progressBar: false, // 播放进度控制条
      volume: true, // 声音控制
      screen: true // 全屏控制
    } : {
      play: true, // 底部播放暂停按钮
      progressTime: true, // 播放时间
      progressBar: true, // 播放进度控制条
      volume: true, // 声音控制
      screen: true // 全屏控制
    };
  } else {
    childConfig = plugin.$config.children;
  }

  return childConfig;
}

/**
 * 1. 将所有的 ui component 输出到 html 结构中
 * 2. 为这些 component 绑定响应的事件
 * @param {*} dom 所有 ui 节点的子容器
 * @param {*} config 关于 ui 的一些列设置
 * @return {Array} 所有子节点
 */

function createChild(plugin) {
  var childConfig = plugin.config.children = hundleChildren(plugin);
  var children = {};
  if (!childConfig) {
    children.play = new Play(plugin);
    children.progressTime = new ProgressTime(plugin);
    children.progressBar = new ProgressBar(plugin);
    children.volume = new Volume(plugin);
    children.screen = new Screen(plugin);
  } else {
    _Object$keys(childConfig).forEach(function (item) {
      switch (item) {
        case 'play':
          if (childConfig.play) {
            children.play = new Play(plugin, childConfig.play);
          }
          break;
        case 'progressTime':
          if (childConfig.progressTime) {
            children.progressTime = new ProgressTime(plugin, childConfig.progressTime);
          }
          break;
        case 'progressBar':
          children.progressBar = new ProgressBar(plugin, childConfig.progressBar);
          break;
        case 'volume':
          if (childConfig.volume) {
            children.volume = new Volume(plugin, childConfig.volume);
          }
          break;
        case 'screen':
          if (childConfig.screen) {
            children.screen = new Screen(plugin, childConfig.screen);
          }
          break;
        case 'clarity':
          if (childConfig.clarity && Array.isArray(childConfig.clarity.list)) {
            children.screen = new Clarity(plugin, childConfig.clarity);
          }
          break;
        default:
          children[item] = new Component(plugin, childConfig[item]);
          break;
      }
    });
  }

  return children;
}

/**
 * 插件默认配置
 */
var defaultConfig$1 = {};

var chimeeControl = {
  name: 'chimeeControl',
  el: 'chimee-control',
  data: {
    children: {}
  },
  level: 99,
  operable: false,
  penetrate: false,
  create: function create() {},
  init: function init(videoConfig) {
    if (videoConfig.controls === false) return;
    this.show = true;
    videoConfig.controls = false;
    var _this = this;
    toxicDecorators.applyDecorators(videoConfig, {
      controls: toxicDecorators.accessor({
        get: function get() {
          return _this.show;
        },
        set: function set(value) {
          _this.show = Boolean(value);
          _this._display();
          return false;
        }
      }, { preSet: true })
    }, { self: true });
    this.config = chimeeHelper.isObject(this.$config) ? chimeeHelper.deepAssign(defaultConfig$1, this.$config) : defaultConfig$1;
    this.$dom.innerHTML = '<chimee-control-wrap></chimee-control-wrap>';
    this.$wrap = this.$dom.querySelector('chimee-control-wrap');
    this.children = createChild(this);
  },
  destroy: function destroy() {
    for (var i in this.children) {
      this.children[i].destroy();
    }
    this.$dom.parentNode.removeChild(this.$dom);
    window.clearTimeout(this.timeId);
  },
  inited: function inited() {
    for (var i in this.children) {
      this.children[i].inited && this.children[i].inited();
    }
  },

  events: {
    play: function play() {
      this.children.play && this.children.play.changeState('play');
      this._hideItself();
    },
    pause: function pause() {
      this.children.play && this.children.play.changeState('pause');
      this._showItself();
    },
    load: function load() {},
    c_mousemove: function c_mousemove() {
      this._mousemove();
    },
    durationchange: function durationchange() {
      this.children.progressTime && this.children.progressTime.updateTotal();
    },
    timeupdate: function timeupdate() {
      this._progressUpdate();
    },
    progress: function progress() {
      this.children.progressBar && this.children.progressBar.progress();
    },
    volumechange: function volumechange() {
      this.children.volume && this.children.volume.update();
    },
    keydown: function keydown(e) {
      e.stopPropagation();
      switch (e.keyCode) {
        case 32:
          {
            e.preventDefault();
            this.children.play && this.children.play.click(e);
            break;
          }
        case 37:
          {
            e.preventDefault();
            var reduceTime = this.currentTime - 10;
            this.currentTime = reduceTime < 0 ? 0 : reduceTime;
            this._mousemove();
            break;
          }
        case 39:
          {
            e.preventDefault();
            var raiseTime = this.currentTime + 10;
            this.currentTime = raiseTime > this.duration ? this.duration : raiseTime;
            this._mousemove();
            break;
          }
        case 38:
          {
            e.preventDefault();
            var raiseVolume = this.volume + 0.1;
            this.volume = raiseVolume > 1 ? 1 : raiseVolume;
            this._mousemove();
            break;
          }
        case 40:
          {
            e.preventDefault();
            var reduceVolume = this.volume - 0.1;
            this.volume = reduceVolume < 0 ? 0 : reduceVolume;
            this._mousemove();
            break;
          }
      }
    },
    click: function click(e) {
      this.children.play && this.children.play.click(e);
    },
    dblclick: function dblclick(e) {
      this.dblclick = true;
      this.children.screen && this.children.screen.click();
    }
  },
  methods: {
    _progressUpdate: function _progressUpdate() {
      this.children.progressBar && this.children.progressBar.update();
      this.children.progressTime && this.children.progressTime.updatePass();
    },
    _hideItself: function _hideItself() {
      var _this2 = this;

      window.clearTimeout(this.timeId);
      this.timeId = setTimeout(function () {
        var bottom = _this2.$wrap.offsetHeight;
        bottom = _this2.children.progressBar ? _this2.children.progressBar.$wrap[0].offsetTop - bottom : -bottom;
        chimeeHelper.setStyle(_this2.$wrap, {
          bottom: bottom
        });
        chimeeHelper.setStyle(_this2.$dom, {
          visibility: 'hidden'
        });
      }, 2000);
    },
    _showItself: function _showItself() {
      window.clearTimeout(this.timeId);
      chimeeHelper.setStyle(this.$wrap, {
        bottom: '0'
      });
      chimeeHelper.setStyle(this.$dom, {
        visibility: 'visible'
      });
    },
    _display: function _display() {
      var display = this.show ? 'table' : 'none';
      chimeeHelper.setStyle(this.$dom, {
        display: display
      });
    },
    _mousemove: function _mousemove(e) {
      if (this.paused) return;
      this._showItself();
      this._hideItself();
    }
  }
};

__$styleInject("#wrapper{width:768px;height:432px}container,video{display:block;width:100%;height:100%;background:#000}container{position:relative}chimee-center-state{position:absolute}chimee-center-state-correct,chimee-center-state-error,chimee-center-state-loading,chimee-center-state-tip{display:none}chimee-center-state.correct chimee-center-state-correct,chimee-center-state.error chimee-center-state-error,chimee-center-state.loading chimee-center-state-loading,chimee-center-state.tip chimee-center-state-tip{display:inline-block}chimee-center-state-correct{width:56px;height:56px}chimee-center-state-tip{position:absolute;left:0;bottom:0;width:56px;height:56px;border-radius:28px;background:rgba(0,0,0,.5)}chimee-center-state.play span{background-image:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzNXB4IiB2aWV3Qm94PSIwIDAgMzIgMzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ1LjIgKDQzNTE0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuaSreaUvm5vcm1hbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMDAwMDAwLCAtMy4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTM1LDE3IEwxMyw0IEwxMyw0IEMxMi42MDMxMjczLDMuNzAxNzMxMjUgMTAuOTE0NzQ0NiwzIDksMyBDNi4wMTA5MjE3NiwzIDQsNS4wODAwOTE3MiA0LDggTDQsMzQgTDQsMzQgQzQuNjA0MzgzMzQsMzUuNjQ4NzM4OCA2LjE4MDYzMjA3LDM4IDksMzggQzEwLjAxMjk3NjksMzggMTAuOTY5NzQ5NSwzNy43NDg3NTQ1IDEyLDM3IEwzNCwyNSBMMzQsMjUgQzM1LjM0Njk5MTIsMjMuNjY2NTE0NCAzNi45NTU2NjE2LDIxLjAwMDUyMSAzNSwxOCBMMzUsMTciPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==\")}chimee-center-state.pause span{background-image:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjhweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMjggMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ1LjIgKDQzNTE0KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuaaguWBnG5vcm1hbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYuMDAwMDAwLCAtMy4wMDAwMDApIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTQiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsNy4wMDAyMTIzNiBDNiw0Ljc5MDk1NjA4IDcuNzk1MzU2MTUsMyAxMCwzIEMxMi4yMDkxMzksMyAxNCw0Ljc5MjAzMTkzIDE0LDcuMDAwMjEyMzYgTDE0LDMyLjk5OTc4NzYgQzE0LDM1LjIwOTA0MzkgMTIuMjA0NjQzOCwzNyAxMCwzNyBDNy43OTA4NjEsMzcgNiwzNS4yMDc5NjgxIDYsMzIuOTk5Nzg3NiBMNiw3LjAwMDIxMjM2IFogTTI2LDcuMDAwMjEyMzYgQzI2LDQuNzkwOTU2MDggMjcuNzk1MzU2MiwzIDMwLDMgQzMyLjIwOTEzOSwzIDM0LDQuNzkyMDMxOTMgMzQsNy4wMDAyMTIzNiBMMzQsMzIuOTk5Nzg3NiBDMzQsMzUuMjA5MDQzOSAzMi4yMDQ2NDM4LDM3IDMwLDM3IEMyNy43OTA4NjEsMzcgMjYsMzUuMjA3OTY4MSAyNiwzMi45OTk3ODc2IEwyNiw3LjAwMDIxMjM2IFoiIGlkPSLmmoLlgZwiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+\")}chimee-center-state-tip span{display:inline-block;width:24px;height:24px;margin:16px}chimee-center-state-loading,chimee-center-state-tip span{background-origin:content-box;background-size:auto 100%;background-repeat:no-repeat;background-position:50%}chimee-center-state-loading{width:52px;height:52px;background-image:url(\"data:image/gif;base64,R0lGODlhPAA8APcAAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTlhYWGpqaoeHh56enra2tsjIyNbW1t7e3uPj4+Xl5ebm5ufn5+fn5+fn5+fn5+jo6Ojo6Ojo6Ojo6Ojo6Ojo6Onp6enp6enp6erq6urq6uvr6+vr6+zs7Ozs7Ozs7O3t7e3t7e7u7u7u7u/v7/Dw8PDw8PHx8fHx8fHx8fHx8fLy8vLy8vLy8vPz8/Pz8/Pz8/T09PT09PX19fb29vb29vf39/j4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAwDBACwAAAAAPAA8AAAI7gCDCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDVmzlkijDTiyRNlSqkunCSUZRtrr0sJBKqw8TRS3ZylFEQijBRkzktaSjRBP5OAXZKU/FOiThVmwrMs9aiY7cfswzKeMkOVsxdoLTV+Pgwhgnwbl7sRWcPIEjtsoDGKSgNH8o/kkjaGQrPmnyoG2YKE8aPic7/VnjBc4fQYkutWo1KZGgP3C8rPnDmOSlP27OeBlO/IybP1Rldpo0qbfQ59B3BgQAIfkECQMA4AAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vfn5+kZGRrq6uw8PD0tLS29vb4ODg5OTk5eXl5ubm5+fn5+fn5+fn5+fn6Ojo6Ojo6Ojo6Ojo6enp6enp6enp6urq6urq6urq6+vr6+vr7Ozs7e3t7e3t7u7u7u7u7+/v7+/v7+/v7+/v8PDw8PDw8PDw8fHx8vLy8vLy8/Pz8/Pz9PT09PT09PT09fX19fX19fX19vb29/f39/f39/f39/f3+Pj4+Pj4+Pj4+Pj4+fn5+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/f39/f39/f39/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////COUAwQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+ociWunq52zgO7sqTOoTlVDf+00tXSnKqU6PakkBtEU0ZNUIWZCCRViKKYliWWNOOmqSKQTiTUaCzKURVePRLq9uGkS242bulrMpEgvRmKWzF4UhehnxlmX7mJ0VWiS34jENkn9SCyToK0SIz8yGvLXI0GTwDI0NWkR2pK4NinyMykU54G4SCO6ZFjlL0+PEPnZvVuQIkunY+JyJXin8ePILQYEACH5BAkDAM4ALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqanp6eo6Ojp6enrOzs8LCwszMzNXV1dvb2+Dg4OPj4+Xl5efn5+jo6Ojo6Onp6enp6erq6urq6urq6urq6urq6urq6uvr6+vr6+vr6+zs7Ozs7Ozs7O3t7e3t7e7u7u7u7u7u7u7u7u/v7+/v7/Dw8PDw8PHx8fHx8fLy8vLy8vLy8vPz8/Pz8/Pz8/Pz8/T09PT09PT09PX19fX19fb29vb29vb29vf39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fn5+fn5+fr6+vr6+vr6+vv7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjoAJ0JHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmz5sNeNgvSyklwJ0+BuH4CFerM589VREklXSq0E1FNRFchFWqJaCSin5QKTUTU0tSTxCASI4QybERNV4Ue0jrSaMRee3CK/DrxEyG5H3GZrTgpUFCPey9qyuM241+Nn+5AzUiscMZYgQLRnYgLr8dJdxodhig18EfIdwhpspxwlaZOnudGyhM6UqdVf3Gt+mQpUaNOpE+SsvToUKA7d/YcemSJVGqiyJMrX94wIAAh+QQJAwDfACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqamp6enqIiIiVlZWgoKCurq68vLzGxsbS0tLZ2dnf39/i4uLk5OTm5ubn5+fo6Ojo6Ojp6enp6enp6enq6urq6urq6urr6+vr6+vr6+vr6+vs7Ozs7Ozt7e3t7e3t7e3t7e3u7u7u7u7v7+/v7+/v7+/v7+/w8PDw8PDw8PDx8fHx8fHx8fHy8vLy8vLy8vLz8/Pz8/P09PT09PT09PT09PT09PT19fX19fX19fX19fX29vb29vb29vb29vb39/f39/f39/f4+Pj4+Pj4+Pj5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz9/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v79/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I5AC/CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlxR/wVwoc6ZNiTVvGuylc2fOngJrAS0odOjAV0YHpkoqsBTTX0uT/nIqlRPTb5GuNrpKiWfSUlGN1qJ01c/VSFTFBrq6CGnSV4W0anrqx63RV35+AqVUSG/PRoG8Gm3kR1dHwRkj7Ql78ZfhjpzyLHpcMRblw43yWJ3IqhTij6z87InEyiHUUJ9FvqLkR/KlUrH0xkqVyq7KWKEoHQq0JxClUKFSpb5KvLjx4w4DAgAh+QQJAwDcACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhxcXGAgICOjo6fn5+tra24uLjCwsLLy8vV1dXe3t7j4+Pm5ubn5+fo6Ojp6enq6urq6urq6urr6+vr6+vr6+vr6+vs7Ozs7Ozs7Ozs7Ozt7e3t7e3t7e3u7u7u7u7u7u7u7u7v7+/v7+/v7+/w8PDw8PDw8PDx8fHx8fHx8fHy8vLy8vLy8vLy8vLz8/Pz8/Pz8/Pz8/P09PT09PT09PT19fX19fX19fX29vb29vb29vb39/f39/f39/f4+Pj4+Pj5+fn5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I8AC5CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhB/koZERZLiKxWvmz4y+XMhqxuNoQlU6fCVD4X6rIZFCGpogqPIj3IatbSg56eHtwk1eClqgR/XcUqEBZVrtxYfeXKahJYbrAgndWl6Cy3PW7x6DrbSClXT2rBzrLTE6uhsVhP4YlrF+smuGB/7cnLFZYdoGA3yT1raM9csIos08XjFGyjO6HOksIzqDPWX5PsXLocsW/IWZPuKDr1UJdrkqQG4YEUiujAWalSNb35i1WoS40ubSLFPKfb59CjS6cYEAAh+QQJAwDmACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb293d3d/f3+NjY2enp6wsLC+vr7IyMjS0tLa2trg4ODk5OTm5ubo6Ojo6Ojp6enp6enq6urq6urr6+vr6+vs7Ozt7e3t7e3t7e3t7e3t7e3u7u7u7u7u7u7u7u7u7u7u7u7v7+/v7+/v7+/w8PDw8PDx8fHx8fHy8vLy8vLy8vLy8vLz8/Pz8/Pz8/Pz8/P09PT09PT19fX19fX19fX29vb29vb29vb29vb39/f39/f39/f39/f39/f39/f39/f4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn5+fn6+vr5+fn5+fn6+vr6+vr6+vr7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f38/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////8I7gDNCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJMiG3kihTDlSmUuKwlhF1wYQIjOXMhtxk3myIamfDWjZ9KiQldOGwV0UVfkpqchNThKiQPjVY6eTUgpCuFlSWVevAWpO8Dnx1SaxAVE7NkiqrNqzZWoTMmuPGR645QDrFKiJq9pIiubr4BPUqKK1YUoDs+umpFpBVvW7FKvMj9bAfYHIv+XnZFxBnsZs8y0XMV7IiRYO1ogJ0KfVUbqQITcLskJvrkbomQdr06rYyYLpo3xyG9hOpV7VqBX9st7nz59AjBgQAIfkECQMA3wAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tfX19i4uLmJiYp6entLS0wcHBy8vL0tLS2dnZ4ODg5eXl5+fn6Ojo6enp6urq6urq6urq6+vr6+vr6+vr6+vr6+vr7Ozs7Ozs7Ozs7Ozs7Ozs7e3t7e3t7e3t7u7u7+/v7+/v8PDw8PDw8fHx8fHx8vLy8vLy8vLy8/Pz8/Pz8/Pz8/Pz9PT09PT09PT09fX19fX19fX19fX19fX19vb29vb29vb29/f39/f39/f3+Pj4+Pj4+Pj4+fn5+fn5+fn5+fn5+fn5+vr6+vr6+vr6+vr6+vr6+/v7+/v7+/v7+/v7/Pz8/Pz8/Pz8/Pz8/f39/f39/f39/f39/f39/f39/f39/f39/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CO4AvwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48EixUDibFXL5IlUV48qdJirZYWV8GsiGomRVE2J6LKlTNiLU09IRZjFBSiplJFHxJK6rATUKYM/4yEqnBVI6oLLXXCqjARLK4J94BFCCvR2IOiHp01qCnS2oKWJr0laEntXIGdiN79JsrsXlhi9xbTw3PvH5x7I+m9C4vw3m9/LD3uxOfxYMR3Le2ZepeQ27259HzdW0rqY1GEOM/t+5jv4rurGL0UPEnuY1iRMN/tJaqU6rmwasEaffB30mKrVrE03rq58+fQIwYEACH5BAkDANkALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWWNjY2xsbHx8fIuLi5eXl6KiorCwsL6+vsnJydLS0tnZ2d7e3uLi4uTk5Obm5ufn5+jo6Onp6enp6erq6urq6urq6urq6urq6uvr6+vr6+vr6+zs7Ozs7Ozs7Ozs7Ozs7O3t7e3t7e3t7e3t7e7u7u7u7u/v7+/v7/Dw8PDw8PDw8PDw8PHx8fHx8fHx8fLy8vLy8vPz8/Pz8/Pz8/T09PT09PT09PT09PT09PX19fX19fX19fb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjxALMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mix40Fir4h5zKgq5EiMpEKdxPgKk62VFzmphGnRkSqaFW0Zeolz4itBIntKJKYnqNCIgEgdlThp0dKItto8jZho0tSHxKRedVh1a8OsXhti8hOWoSFHZRe2UZoW4Ss1RtsW5FRHLkJMeuwenERWb0FHgPwWTCRIMEFHfQ1nw6RVsSo1PA0TU3NTcTY5Vi0bymv5cWTDejIrxmtZYB22juWUzpYIrWVicj4LVpVYManApUMVzp1ota1Er1Zb4uSbU+XXoY5bfmVLtuTV0KNLn94xIAAh+QQJAwDVACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlycnJ6enqJiYmbm5upqam2trbAwMDKysrS0tLX19fd3d3i4uLk5OTm5ubn5+fo6Ojo6Ojp6enq6urq6urq6urq6urr6+vr6+vs7Ozs7Ozs7Ozt7e3t7e3u7u7u7u7v7+/v7+/v7+/v7+/v7+/v7+/w8PDw8PDw8PDw8PDx8fHx8fHy8vLy8vLz8/Pz8/Pz8/Pz8/Pz8/P09PT09PT09PT19fX19fX19fX29vb29vb29vb29vb29vb39/f39/f39/f39/f4+Pj4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gCrCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatyo8NYpTqdmAeNIEdktXciQkbyI7NWtkSsxfhIVM6OoSTBrVkR26JTOi7oEzfppcZUgXUQrvuKTM2lEXXuGOpWIDJDPqRITTcIq8dUelVwhCvoUFuKqr2UfAuKU1uGsPE3bJuQkSG7DQ5fsLkSWR6pehF7/KjwFSHBCUXUNH+R0SPHBS48cG+SUSHLBU4ktC5zFR/NAvmA970HquVqiVaWrrYqcunPqSahL62Jd+hJpz8hoez51tfSk0J4rpa6GjG1qYDSPx069Kq7lWX5xnxxebfpwYCmpa9/Ovbt3igEBACH5BAkDAMAALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1lZWWNjY21tbXZ2doWFhZiYmKenp7S0tMHBwcrKytLS0tra2t/f3+Pj4+Xl5efn5+jo6Ojo6Onp6enp6enp6erq6urq6urq6uvr6+vr6+vr6+zs7Ozs7O3t7e7u7u/v7+/v7/Dw8PDw8PHx8fHx8fHx8fLy8vLy8vLy8vLy8vLy8vPz8/Pz8/Pz8/Pz8/T09PT09PT09PT09PT09PX19fX19fX19fX19fX19fb29vb29vb29vb29vf39/f39/f39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fr6+vr6+vr6+vv7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjsAIEJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3KgQVCJCnThaVDUpk6paBmvVOimyoao9hDK1xKjKzhxVMy/WsvOGVM6LoMok+nkxU5mQRCsmWoMzKUWjKJ1OJCUGlNSJtco0ujoxjh2uEoOCldiG0FiIk8SchYjmz1qHpMA0fbuQ0Bq6Dd3swbuwFhikfBF2AhNYYdrCCZciRkjozeKDf74+LthozuSCnRxfHqjq7uaBZT4PbCNaYMzSqiyXdlMa2GnRO1snslpatehOk2TP/Ty09dbStWijbg0sKvHjyJMrX868uXPmAQEAIfkECQMA7gAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxeXl5gYGBiIiIj4+Pm5ubpqamsrKyvb29x8fH0NDQ1tbW29vb39/f4uLi5OTk5ubm5+fn5+fn5+fn6Ojo6Ojo6Ojo6Ojo6enp6enp6urq6urq6+vr6+vr6+vr7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7e3t7e3t7e3t7e3t7u7u7u7u7u7u7+/v7+/v7+/v7+/v8PDw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/v7///////////////////////////////////////////////////////////////////////////////////////////////////////8I/gDNCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatxYEJsuVZ8sMUJkSBKmU7CMcYyo65MhRJtQtYKlq+bHTyNBAVupEJsqSYxQDWO4rBUjSa2w8Sw4TNKmWRJhWUIEa6nAVpZ2VpzFCJTSlaBUZcQGipFWjadUbuSqSyOqrxyNSRp6URXclXKXWZx1l6cxTBWN9V0KTOxEulYJolILsW1ig6MiLtP7uCCwsw0ZVyZY9SHlzQR1DUb4GTRBqA1LmxboeOFo09hUH3xtWvZqh7ZvE9UtkTZvhL5/GwwuvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+CbAgcEACH5BAkDAOsALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e4KCgo+Pj5+fn62trbe3t8PDw8vLy9PT09ra2t/f3+Li4uXl5ebm5ufn5+jo6Ojo6Ojo6Ojo6Ojo6Onp6enp6enp6enp6erq6urq6urq6urq6uvr6+vr6+zs7O3t7e3t7e7u7u7u7u7u7u/v7+/v7+/v7/Dw8PDw8PDw8PHx8fHx8fLy8vLy8vPz8/Pz8/Pz8/Pz8/T09PT09PX19fX19fX19fb29vb29vb29vf39/f39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////wj+ANcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Hhwmq5UnC4penQp06dX0zhG1FWK06dUtX790lXrFUhFii69CqdSYbFSmnYyLJbq0aNUKXsSDCeqVLGI4V5NUtRKqcBan5pZlPVIU1KOrWRlZPpIF0eUHH9NEptRqMppl8xelMVTKdynFfFaXdfskjKK0+ruXVfsEuDBBEvVkqgV8cBwmSIGdkywJsSvlAWWgig48zpdfz1PrCpa4qvSjBujfqh3dcPWrhfCjp1wNu2DoW8rVK0bYefeBn8DXzrcd/GDwo8nH778uPPn0KNLn069uvXr2LNr3869u/fv4LsCBwQAIfkECQMA+wAsAAAAADwAPACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQUVFRUlJSU1NTVFRUVVVVVlZWV1dXWFhYWVlZWlpaW1tbXFxcXV1dXl5eX19fYGBgYWFhYmJiY2NjZGRkZWVlZmZmZ2dnaGhoaWlpampqa2trbGxsbW1tbm5ub29vcHBwcXFxcnJyc3NzdHR0dXV1dnZ2d3d3eHh4eXl5enp6e3t7fHx8fX19fn5+f39/gICAgYGBgoKCg4OD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LAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+foWFhZKSkp2dnaioqLS0tL6+vsnJydPT09vb2+Hh4eTk5Obm5ufn5+jo6Ojo6Onp6enp6enp6enp6erq6urq6urq6urq6urq6urq6uvr6+vr6+zs7Ozs7O3t7e7u7u7u7u/v7+/v7+/v7/Dw8PDw8PHx8fHx8fHx8fHx8fLy8vLy8vPz8/Pz8/Pz8/T09PT09PX19fX19fX19fb29vb29vb29vb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vr6+vr6+vr6+vv7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjuAMcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Kgw2CtZxTherAatWjWDJH3tgiaypa9Xqli23AiNFCqZMzMi+6TqZM6MsiSF/IkxmCRfRDEi0yQr6UhMSJ1WLOYImdSKtzD5vCoRFSmuFIWClfiq01iJjnadhahK09qH0BhZfdtQ0yu6DVWZxbswGKOtfA9WYxQssEJHUQ0f1HRLMcJOdx0bJNVK8uTGlgl+Kpx5oCacnSV1Jrh3tK+mo8eRApz5U+pxL1+jYi25GOrRX1Pv4twZ2u3OvzNjHj10NO3XyJMrX868ufPn0NcGBAAh+QQJAwDkACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXmAgICIiIiPj4+VlZWgoKCqqqq2tra/v7/JycnR0dHZ2dng4ODj4+Pl5eXm5ubn5+fo6Ojo6Ojp6enp6enp6enq6urq6urr6+vr6+vs7Ozs7Ozt7e3t7e3t7e3u7u7u7u7v7+/v7+/v7+/w8PDw8PDw8PDx8fHx8fHy8vLy8vLy8vLz8/Pz8/P09PT09PT09PT19fX19fX19fX19fX19fX29vb29vb29vb29vb39/f39/f39/f39/f4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn6+vr6+vr6+vr6+vr6+vr7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////8I+QDJCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatyI8JivWadmHeNIkmC1aseGVStJktkwXytZbnz1SuZGZqBq2sw4C1PMnRZ9TRoJ1OKxSbqKWmTGyJfSir4YMXtKUVWkn1QhgtKUVWI1Rkm7QjxVSSzEr7fMPjw1Sa1DZoqGuW046dRchqUw3V2oSxHWvQYVOQWMMNIswggn6URcEJMqxgY1lYJcUJNdygMnHcYskJFczuT8gj7GCDS5W1xBd0oL+pHpWaBMdyKK+dhk1a9ZY64WG7Qo06f+Mn41lfOs4pSZ6abs6zNlj8IBp9x90rT169iza58YEAAh+QQJAwDeACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGIiIiPj4+WlpacnJynp6ewsLC3t7fDw8POzs7W1tbd3d3i4uLl5eXn5+fo6Ojp6enp6enq6urq6urr6+vr6+vr6+vr6+vs7Ozs7Ozs7Ozt7e3t7e3u7u7u7u7v7+/w8PDw8PDx8fHx8fHx8fHx8fHy8vLy8vLy8vLz8/Pz8/Pz8/Pz8/P09PT09PT19fX19fX19fX29vb29vb39/f39/f4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn6+vr6+vr6+vr7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I9gC9CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsSPFacumeew4rVixkR11BUO5cVmtkywz3roVM6MvVzUxLhslMmfFaaFg+pw4jVPPoRJ1gUJKURUsphMnHYXqENYpqhGlYn3oStVWh9O0fmXoqdZYhq5GnV3oq9LahZCEvjVYSddchJnM3jXoadZeg6Bw/iUYyuvggZwEH/Y2iebiZZBWLvYFaepfV24Xe8t09XFcza44ad6s97CuTKMrST7sqvPhZZkPF1092BPtv6F8aT5l93CxU8sW3/J72Net4IN96bL8dtkyuXenMR9Nvbr16xMDAgAh+QQJAwDgACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISLi4uSkpKenp6srKy7u7vGxsbOzs7X19fe3t7j4+Pl5eXn5+fo6Ojp6enp6enq6urr6+vs7Ozs7Ozt7e3t7e3t7e3u7u7u7u7u7u7u7u7u7u7u7u7v7+/v7+/v7+/w8PDw8PDw8PDx8fHx8fHy8vLy8vLz8/P09PT09PT09PT19fX19fX19fX29vb29vb29vb29vb29vb39/f39/f39/f39/f4+Pj4+Pj5+fn5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I7QDBCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjxapUQPJcdkykhtHotR4ciVGYi4x9op5cRdNi7duUjyWU6dEVjB9RtykUqjDW6yMQqyk9CGrV00bUmMalWGomVUVslqVVSGwTV0VSgqbEBMwsgdDyUJr8FRStgRPcYU7kNRcuuA2QcULDlNPvJLO4iUWiS84WVTxbjrFd1kkwXRXWTJMaS9dWZGKsqUm6S3dU5j4ApPUEu7Uv5straVLDdNquq4HX2WdKhVeWacgk6V2S1bpsMCAEdNtVKXKZb16aTbMvLnz5xUDAgAh+QQJAwDfACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaMjIydnZ2rq6u2trbExMTNzc3W1tbc3Nzh4eHk5OTm5ubo6Ojo6Ojp6enp6enq6urq6urq6urr6+vr6+vs7Ozt7e3t7e3u7u7u7u7v7+/v7+/w8PDw8PDx8fHx8fHy8vLy8vLz8/Pz8/P09PT09PT19fX19fX29vb29vb29vb29vb29vb29vb29vb39/f39/f39/f39/f4+Pj4+Pj5+fn5+fn5+fn5+fn5+fn5+fn6+vr6+vr6+vr6+vr6+vr6+vr6+vr7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I8gC/CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqRJjNVOVnymkiKzlhODwYz4DNlMiLtS3nToaqfDZzJ9MuwpdGGul0UVqkqqEJVOpgZz1YJ6sBopqgdBYTXo6enWb6KCfv1GKtdYgaamnjVFdKwotWMzif0qySvWYJbOfmOl9awnVGefSZqLFdUmvZTgbq1F6Ww1Sm23ivJ0Nhclll+RQR7LjJIpzp45W1r61ZWlyFCfeQKFmeozU5YUh6xmVyEyUJtQk0QWDFlrgs9yoQIV1mc13rt25XKlClUtpHqjS59O3WJAACH5BAkDAPMALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi5ycnLKyssTExM/Pz9jY2N7e3uLi4uXl5efn5+jo6Ojo6Ojo6Onp6erq6urq6urq6uvr6+vr6+zs7Ozs7O3t7e7u7u/v7+/v7/Dw8PDw8PDw8PHx8fHx8fLy8vLy8vLy8vLy8vPz8/Pz8/Pz8/T09PT09PT09PX19fX19fb29vb29vb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////wjwAOcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXClwGcuH21y+bLhs28yGxG4yjKlzYbCeCpdlA5owF1GERo8ajJZTacFZTgvCikqwFdWBrWxehRXt6jxYTammChuVlEyqoYZezeQ1GievuUh5JVXr6rZKaqPCEuU100+qudhS3ZYJKtVTb6n2qnRWaTZMhp1m48Q36uTKTqNlkhu1FqZTUaOBypT04zatEbOlqpQKdchteRn2CoUpVdeTTIMFu01wWa1TmUCVZkksl3FYrUi1qkXMtdfn0KNLnxgQACH5BAkDAMoALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaHBwcICAgJKSkqqqqr6+vs/Pz9nZ2eDg4OXl5efn5+jo6Onp6enp6enp6erq6urq6urq6urq6urq6uvr6+vr6+zs7Ozs7O3t7e3t7e7u7u7u7u/v7+/v7+/v7/Dw8PDw8PDw8PDw8PDw8PHx8fLy8vPz8/Pz8/T09PT09PX19fX19fX19fX19fb29vb29vb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pn5+fn5+fr6+vr6+vr6+vv7+/v7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjkAJUJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnOlSF82Dsm4a1JVTJ0FTPn8GHRhqqEBNRpUhNWopqSSbQx1BDXooqSCjshgZ1dR0KCOgQ+8wrTqUD6uhnq4O9VM0aCNCQ0PdmXpTF522OnX5aRRUFh+4GelmZHUHsEZWgitqokOWI6tRF1kJmgMJpCxLnihCmkOoZ0hZkjQlRujpEB0+mU3qCqVJE2SCukZZajT5DiO8Ki9bgsSIz2lBjCS9Tkq8uPHjEAMCACH5BAkDAM0ALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra4GBgZmZma+vr8TExNLS0tra2t/f3+Pj4+Xl5ebm5ufn5+jo6Ojo6Ojo6Onp6enp6enp6enp6erq6urq6uvr6+vr6+vr6+vr6+vr6+zs7Ozs7Ozs7O3t7e3t7e3t7e7u7u/v7/Dw8PDw8PDw8PHx8fHx8fHx8fLy8vLy8vLy8vPz8/Pz8/Pz8/Pz8/Pz8/T09PT09PT09PT09PT09PX19fX19fb29vb29vf39/f39/f39/f39/j4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fr6+vv7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjlAJsJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzpk2EvW4ShKVzIM+ezXIBDTr0Z89XQ1ElXQoU1NBNQFkh7WlpKCSgqEQBXYQVqs5hgIb1bOQ14tSRqBBRHMZqZC8/OdcKBdmrEKmLw8R6zAVoksa5G2HpKZsRll6Mlu5o7ZgLMEVWgACd7ci2rcRcjO74HTkM1CbLC3ttKnRH8sleoBYtsiSK1dxcrEBBIq0HEuiUw1BZaoTIz53SiBpZUjq0uPHjyCMGBAAh+QQJAwDGACwAAAAAPAA8AIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NsbGx7e3ufn5+3t7fJycnV1dXc3Nzh4eHk5OTl5eXn5+fn5+fo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojp6enp6enp6enp6enq6urq6urq6urr6+vs7Ozt7e3u7u7u7u7v7+/v7+/v7+/w8PDw8PDx8fHx8fHy8vLy8vLz8/Pz8/P09PT09PT09PT19fX19fX29vb29vb29vb39/f39/f39/f39/f39/f4+Pj4+Pj4+Pj4+Pj4+Pj5+fn5+fn5+fn5+fn6+vr6+vr6+vr6+vr7+/v7+/v7+/v7+/v7+/v8/Pz8/Pz8/Pz8/Pz9/f39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I5gCNCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tx5EdbOUz+D6mQlNOcnnbCI5tS0k2lOWKMe5lIJCeJUlKycPvR5cpFEWFdJapI0UatIVoUqkhWZC1DYiZVEFopqEVajj7kE3cXI6tBbjLD8eNWYK5FSjKP0xO3YCNLfiLAK6aHr8ZSgqhJzLbKz6HHHT38KmVWoqZAdQVxLjkrUR/ThgaMkFYLzp9FrlJ8O+bEDp3fvPpdTx2Q16jbP48iTRwwIACH5BAkDAMEALAAAAAA8ADwAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTlhYWGpqaoeHh56enra2tsjIyNbW1t7e3uPj4+Xl5ebm5ufn5+fn5+fn5+fn5+jo6Ojo6Ojo6Ojo6Ojo6Ojo6Onp6enp6enp6erq6urq6uvr6+vr6+zs7Ozs7Ozs7O3t7e3t7e7u7u7u7u/v7/Dw8PDw8PHx8fHx8fHx8fHx8fLy8vLy8vLy8vPz8/Pz8/Pz8/T09PT09PX19fb29vb29vf39/j4+Pj4+Pj4+Pj4+Pn5+fn5+fn5+fn5+fn5+fr6+vr6+vr6+vr6+vr6+vv7+/v7+/v7+/v7+/z8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjuAIMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQINWbOWSKMNOLJE2VKqS6cJJRlG2uvSwkEqrDxNFLdnKUURCKMFGTOS1pKNEE/k4BdkpT8U6JOFWbCsyz1qJjtx+zDMp4yQ5WzF2gtNX4+DCGCfBuXuxFZw8gSO2ygMYpKA0fyj+SSNoZCs+afKgbZgoTxo+Jzv9WeMFzh9BiS61ajUpkaA/cLys+cOY5KU/bs54GU78jJs/VGV2mjSpt9Dn0HcGBAA7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=\")}chimee-center-state-error{display:none;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:180px;font-size:16px;z-index:1;color:#ffcf00;text-shadow:0 0 3px red;font-weight:100}chimee-control-wrap{background:linear-gradient(0deg,#000,transparent)}.chimee-component{height:3.2em}chimee-control-state.chimee-component{padding-left:2.4em;padding-right:2.4em}chimee-progressbar.chimee-component{position:relative;width:auto}chimee-progressbar-ball{content:\"\";position:absolute;right:-2em;top:-1em;display:inline-block;width:2em;height:2em;border-radius:1em;background:#fff;pointer-events:none}chimee-progresstime.chimee-component{height:100%;color:#fff;font-weight:400;text-align:center;white-space:nowrap;padding:0;line-height:2.75em;vertical-align:bottom;font-size:16px}chimee-progresstime-pass,chimee-progresstime-total{display:inline}chimee-volume.chimee-component{line-height:3.2em;vertical-align:middle}chimee-volume-state{display:inline-block;width:2em;height:1.6em;margin-right:1em}chimee-volume-bar{margin-right:1em}chimee-volume-bar-all,chimee-volume-bar-bg{top:2em}chimee-volume-bar-bg{background:#d8d8d8}chimee-volume-bar-all{background:#57b0f6}chimee-screen.chimee-component{padding-right:2em;padding-left:2em}chimee-clarity.chimee-component{height:100%;line-height:2.75em}chimee-clarity-list{left:-2em;width:8em;padding-bottom:2em}", undefined);

Chimee.install(chimeeControl);

Chimee.install(chimeePopup({
  name: 'chimeeCenterState',
  tagName: 'chimee-center-state',
  html: '\n    <chimee-center-state-correct>\n      <chimee-center-state-loading></chimee-center-state-loading>\n      <chimee-center-state-tip>\n        <span></span>\n      </chimee-center-state-tip>\n    </chimee-center-state-correct>\n    <chimee-center-state-error>\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5</chimee-center-state-error>\n  ',
  offset: '50%',
  hide: false,
  create: function create() {},

  penetrate: true,
  operable: false,
  destroy: function destroy() {
    this.clearTimeout();
  },

  events: {
    pause: function pause() {
      this.showTip('play');
      this.showLoading(false);
    },
    play: function play() {
      this.showTip('pause');
    },
    canplay: function canplay() {
      this.playing();
    },
    playing: function playing() {
      this.playing();
    },
    waiting: function waiting() {
      this.waiting();
    },

    // 卡顿(FLV|HLS加载异常待内部特供事件)
    // stalled () {
    //   this.showLoading();
    // },
    timeupdate: function timeupdate() {
      this.clearTimeout();
    },
    c_mousemove: function c_mousemove() {
      !this.paused && this.showTip('pause');
    }
  },
  methods: {
    playing: function playing() {
      this.clearTimeout();
      this.showLoading(false);
      this.showError(false);
    },
    waiting: function waiting() {
      var _this = this;

      this.clearTimeout();
      // 加载超过20秒则超时显示异常
      this._timeout = setTimeout(function () {
        return _this.showError();
      }, 3e4);
      !this.paused && this.showLoading();
    },
    clearTimeout: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }),
    showTip: function showTip(cls) {
      var _this2 = this;

      var clss = 'correct tip play pause';
      this.$domWrap.removeClass(clss).addClass('correct tip ' + cls);
      clearTimeout(this.tipId);
      if (cls === 'pause') {
        this.tipId = setTimeout(function () {
          _this2.$domWrap.removeClass('correct tip ' + cls);
        }, 2000);
      }
    },
    showLoading: function showLoading(status) {
      if (status === false) {
        this.$domWrap.removeClass('loading');
      } else {
        this.$domWrap.addClass('correct loading');
      }
    },
    showError: function showError(status) {
      if (status === false) {
        this.$domWrap.removeClass('error');
      } else {
        this.$domWrap[0].className = '';
        this.$domWrap.addClass('error');
      }
    }
  }
}));

function generateVideo(config) {
  return new Chimee(config);
}

module.exports = generateVideo;
