/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/js/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	(function webpackMissingModule() { throw new Error("Cannot find module \"bundle.js\""); }());


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(3);
	var observable = __webpack_require__(5);

	var quite = {
	  observable: observable,

	  mount: function(opts, el) {
	    return this.view(opts).mount(el);
	  },

	  view: function(opts) {
	    var v = new View(opts);
	    return observable(v);
	  }
	};

	observable(quite);

	module.exports = quite;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(4);
	var observable = __webpack_require__(5);

	function View(opts) {
	  this.opts = opts;
	  this.tpl = opts.tpl || {};
	  this.el = opts.el ? $(opts.el) : undefined;
	  this.data = opts.data || {};
	  this.dispatcher = opts.dispatcher;
	  this.listen = opts.listen || {};
	  this.actions = opts.actions || {};
	  this.parent = {};
	  this.views = {};
	  this.id = util.uniqueId('view');
	  this._buildListener();
	  this.listen.init.call(this);
	}

	View.prototype.template = function() {
	  return this.tpl(this.data);
	};

	View.prototype.mount = function(el) {
	  this.el = el ? $(el) : this.el;
	  this.update();
	  this.listen.mount.call(this);
	  return this;
	};

	View.prototype.update = function(data) {
	  this.listen.update.call(this);
	  this.data = data || this.data;
	  this.el.html(this.template());
	  this._mountViews(this);
	  this._bindEvents();
	  this.listen.updated.call(this);
	};

	View.prototype._mountViews = function(parent) {
	  if (!this.opts.views) {
	    return;
	  }

	  for (var p in this.opts.views) {
	    var view = observable(new View(this.opts.views[p].view));
	    if (this.opts.views[p].data) {
	      view.data = this.opts.views[p].data;
	    }

	    view.el = $(this.opts.views[p].el);
	    view.parent = parent;
	    view.mount();
	    this.views[p] = view;
	  }
	};

	View.prototype._bindEvents = function() {
	  if (!this.dispatcher) {
	    return;
	  }

	  for (var e in this.dispatcher) {
	    var actionName = this.dispatcher[e];
	    var $el = this.el.find(e.split(' ')[1]);
	    $el.on(e.split(' ')[0], $.proxy(this.actions[actionName], this));
	  }
	};

	View.prototype._buildListener = function() {
	  var listeners = ['init', 'mount', 'update', 'updated'];
	  for (var i = 0; i < listeners.length; i++) {
	    var l = listeners[i];
	    this.listen[l] = this.listen[l] || function() {};
	  };
	};

	module.exports = View;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
	  counter: 0,
	  uniqueId: function(prefix) {
	    return (prefix || '') + (++this.counter);
	  }
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(el) {
	  el = el || {};
	  var callbacks = {};
	  var _id = 0;

	  el.on = function(events, fn) {
	    // :todo isFunction
	    if (typeof fn == 'function') {
	      if (typeof fn.id == 'undefined') {
	        fn._id = _id++;
	      }

	      events.replace(/\S+/g, function(name, pos) {
	        (callbacks[name] = callbacks[name] || []).push(fn);
	        fn.typed = pos > 0;
	      });
	    }

	    return el;
	  };

	  el.off = function(events, fn) {
	    if (events == '*') {
	      callbacks = {};
	    }else {
	      events.replace(/\S+/g, function(name) {
	        if (fn) {
	          var arr = callbacks[name];
	          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
	            if (cb._id == fn._id) {
	              arr.splice(i--, 1);
	            }
	          }
	        } else {
	          callbacks[name] = [];
	        }
	      });
	    }

	    return el;
	  };

	  // only single event supported
	  el.one = function(name, fn) {
	    function on() {
	      el.off(name, on);
	      fn.apply(el, arguments);
	    }

	    return el.on(name, on);
	  };

	  el.trigger = function(name) {
	    var args = [].slice.call(arguments, 1);
	    var fns = callbacks[name] || [];

	    for (var i = 0, fn; (fn = fns[i]); ++i) {
	      if (!fn.busy) {
	        fn.busy = 1;
	        fn.apply(el, fn.typed ? [name].concat(args) : args);
	        if (fns[i] !== fn) {
	          i--;
	        }

	        fn.busy = 0;
	      }
	    }

	    if (callbacks.all && name != 'all') {
	      el.trigger.apply(el, ['all', name].concat(args));
	    }

	    return el;
	  };

	  return el;
	};


/***/ }
/******/ ]);