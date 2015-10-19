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
	  Version: 0.0.6
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
	var ref = __webpack_require__(4);

	function Component(opts) {
	  this.opts = opts;
	  this.tpl = opts.tpl || function() {};

	  this.el = opts.el ? $(opts.el) : undefined;
	  this.data = opts.data || {};
	  this.listen = opts.listen || {};
	  this.events = opts.events || {};
	  this.handle = opts.handle || {};
	  this.refs = {};
	  this.id = util.uniqueId('component');
	  observable(this);
	  this._mixin(opts.mixins);
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
	  this.data = data || this.data;
	  this.trigger('update');
	  var template = this._html();
	  if (template) {
	    if (this.rid) {
	      var parentEl = this.el;
	      this.el = $(template).attr('rid', this.rid);
	      parentEl.append(this.el);
	      delete this.rid;
	    }else {
	      if (this.el.attr('rid')) {
	        this.el.empty().html($(template).html());
	        return;
	      }

	      this.el.empty().html(template);
	    }
	  }

	  this._bindEvents();
	  this._mountRefs(this);
	  this.trigger('updated');
	};

	Component.prototype.unmount = function() {
	  this.el.empty();
	  this.trigger('unmount');
	  this.off('*');
	};

	Component.prototype.$ = function(el) {
	  return this.el.find(el);
	};

	Component.prototype.ref = function(exp) {
	  return ref(this, exp);
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
	    var c = new Component(value.component);
	    c.refOpts = $.extend(false, {}, value);
	    delete c.refOpts.component;
	    delete c.refOpts.el;
	    if (value.data) {
	      c.data = $.extend(false, c.data, value.data);
	      delete c.refOpts.data;
	    }

	    if (value.rid) {
	      c.rid = value.rid;
	      delete c.refOpts.rid;
	    }

	    c.parent = parent;
	    this.refs[p] = c;
	    c.mount(value.el);
	  }
	};

	Component.prototype._bindEvents = function() {
	  for (var e in this.events) {
	    var handleName = this.events[e];
	    var index = e.indexOf(' ');
	    if (index === -1) {
	      throw 'Event separated by a space.';
	    }

	    var selector = e.substr(index + 1, e.length);
	    this.el.on(e.substr(0, index), selector, $.proxy(this.handle[handleName], this));
	  }
	};

	Component.prototype._mixin = function(arr) {
	  if (arr) {
	    arr.unshift(false);
	    var obj = $.extend.apply($, arr);
	    for (var o in obj) {
	      this[o] = obj[o];
	    }
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	function children(c, name) {
	  if (c.refs[name]) {
	    return c.refs[name];
	  }

	  for (var r in c.refs) {
	    return children(c.refs[r], name);
	  }
	};

	function root(c) {
	  if (c.parent) {
	    return root(c.parent);
	  }

	  return c;
	};

	function parent(c, deep) {
	  var obj = c.parent;
	  for (var i = 1; i < deep; i++) {
	    if (!obj) {
	      return;
	    }

	    obj = obj.parent;
	  }

	  return obj;
	};

	module.exports = function(c, exp) {
	  var legalVar = /^[a-z|A-Z|_|$]/;
	  var regExp = /(\^\d?|>|\/)/;
	  exp = exp.replace(regExp, ' $1 ').substr(1);
	  var arr = exp.split(/\s+/);
	  for (var i = 0; i < arr.length; i++) {
	    if (!c) {
	      return;
	    }

	    if (arr[i] === '/') {
	      c = root(c);
	    }else if (arr[i] === '>') {
	      if (arr[i + 1] && legalVar.test(arr[i + 1])) {
	        c = c.refs[arr[i + 1]];
	        i++;
	      }else {
	        continue;
	      }
	    }else if (arr[i].indexOf('^') !== -1) {
	      var deep = 1;
	      if (d = arr[i].substr(1)) {
	        deep = parseInt(d);
	      }

	      c = parent(c, deep);
	    }else if (legalVar.test(arr[i])) {
	      if (!c.refs) {
	        return;
	      }

	      c = children(c, arr[i]);
	    }else {
	      if (regExp.test(arr[i])) {
	        continue;
	      }else {
	        return;
	      }
	    }
	  }

	  return c;
	};



/***/ }
/******/ ])
});
;