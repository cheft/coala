(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Version: 0.0.3
	  Author: Cheft
	*/
	var Component = __webpack_require__(1);
	var observable = __webpack_require__(3);

	var coala = {
	  observable: observable,

	  mount: function(opts, el) {
	    return this.component(opts).mount(el);
	  },

	  unmount: function(component) {
	  	component.unmount();
	  },

	  component: function(opts) {
	  	return new Component(opts);
	  }
	};

	observable(coala);

	module.exports = coala;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var observable = __webpack_require__(3);

	function Component(opts) {
	  this.opts = opts;
	  this.tpl = opts.tpl || {};
	  this.el = opts.el ? $(opts.el) : undefined;
	  this.data = opts.data || {};
	  this.listen = opts.listen || {};
	  this.events = opts.events || {};
	  this.handle = opts.handle || {};
	  this.refs = {};
	  this.id = util.uniqueId('component');
	  observable(this);
	  this._listenTo();
	  this.trigger('init');
	}

	Component.prototype.mount = function(el) {
	  this.el = el ? $(el) : this.el;
	  this.update();
	  this.trigger('mount');
	  return this;
	};

	Component.prototype.update = function(data) {
	  this.trigger('update');
	  this.data = data || this.data;
	  if (this.rid) {
	    var parentEl = this.el;
	    var html = this._html();
	    this.el = $(html).attr('rid', this.rid);
	    parentEl.append(this.el);
	    delete this.rid;
	  }else {
	    this.el.empty().html(this._html());
	  }

	  this._mountRefs(this);
	  this._bindEvents();
	  this.trigger('updated');
	};

	Component.prototype.unmount = function() {
	  this.el.empty();
	  this.trigger('unmount');
	};

	Component.prototype.$ = function(el) {
	  return this.el.find(el);
	};

	Component.prototype._html = function() {
	  return this.tpl(this.data);
	};

	Component.prototype._mountRefs = function(parent) {
	  if (!this.opts.refs) {
	    return;
	  }

	  for (var p in this.opts.refs) {
	    var value = this.opts.refs[p];
	    var component = new Component(value.component);
	    if (value.data) {
	      component.data = value.data;
	    }

	    if (value.rid) {
	      component.rid = value.rid;
	    }

	    component.el = $(value.el);
	    component.parent = parent;
	    component.mount();
	    this.refs[p] = component;
	  }
	};

	Component.prototype._bindEvents = function() {
	  for (var e in this.events) {
	    var handleName = this.events[e];
	    var $el = this.el.find(e.split(' ')[1]);
	    $el.on(e.split(' ')[0], $.proxy(this.handle[handleName], this));
	  }
	};

	Component.prototype._listenTo = function() {
	  for (var l in this.listen) {
	    var fn = this.listen[l];
	    this.on(l, fn);
	  }
	};

	module.exports = Component;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
	  counter: 0,
	  uniqueId: function(prefix) {
	    return (prefix || '') + (++this.counter);
	  },

	  isUndefined: function(obj) {
	    return typeof obj == 'undefined';
	  },

	  isFunction: function(obj) {
	    return typeof obj == 'function';
	  }
	};



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);

	module.exports = function(el) {
	  el = el || {};
	  var callbacks = {};
	  var _id = 0;

	  el.on = function(events, fn) {
	    if (util.isFunction(fn)) {
	      if (util.isUndefined(fn.id)) {
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
/******/ ])
});
;