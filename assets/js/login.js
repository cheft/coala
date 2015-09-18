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

	__webpack_require__(10);
	module.exports = __webpack_require__(11);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
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
		  Version: 0.0.1
		  Author: Cheft
		*/
		var Component = __webpack_require__(1);
		var observable = __webpack_require__(3);

		var coala = {
		  observable: observable,

		  mount: function(opts, el) {
		    return new Component(opts).mount(el);
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
		    var $html = $(html).attr('rid', this.rid);
		    parentEl.append($html[0].outerHTML);
		    this.el = parentEl.find('[rid=' + this.rid + ']');
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

		Component.prototype._html = function() {
		  return this.tpl(this.data);
		};

		Component.prototype._mountRefs = function(parent) {
		  if (!this.opts.refs) {
		    return;
		  }

		  for (var p in this.opts.refs) {
		    var component;
		    var value = this.opts.refs[p];
		    if (value.component) {
		      var component = new Component(value.component);
		      if (value.data) {
		        component.data = value.data;
		      }

		      if (value.rid) {
		        component.rid = value.rid;
		      }

		      component.el = $(value.el);
		    }else {
		      component = new Component(value);
		      component.el = $(p);
		    }

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(4);

	module.exports = {
	  listen: {
	    init: function() {
	      // console.log(' init!');
	      this.tpl = tpl;
	      this.data = {name: 'Jake'};
	    },

	    mount: function() {
	      // console.log(' mount!');
	      // var _this = this;
	      // $.ajax({
	      //   url: 'http://localhost:3000/users/1',
	      //   type: 'get'
	      //   // async: false,
	      // }).done(function(user) {
	      //   console.log(_this);
	      //   _this.update(user);
	      // });
	    },

	    update: function() {
	      // console.log(' update!');
	    },

	    updated: function() {
	      // console.log(' updated!');
	    },

	    unmount: function() {
	      // console.log(' unmount');
	    }
	  },

	  events: {
	    'click .js-test': 'test'
	  },

	  handle: {
	    test: function(e) {
	      alert(this);
	    }
	  }
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div> 欢迎 '+( it.name)+' <button class="js-test">测试</button></div>';return out;
	}

/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(false) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_hash__) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {
							abort: 1,
							fail: 1
						}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}

				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}

				if(!upToDate()) {
					check();
				}

				require("./log-apply-result")(updatedModules, updatedModules);

				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}

			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function(eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var coala = __webpack_require__(2);
	var top = __webpack_require__(3);
	var form = __webpack_require__(12);
	var tpl = __webpack_require__(14);

	var login = {
	  tpl: tpl,
	  refs: {
	    '#top': top,
	    '#login': form
	  }
	};

	coala.mount(login, '#app');


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(13);

	module.exports = {
	  listen: {
	    init: function() {
	      this.tpl = tpl;
	    },

	    mount: function() {

	    }
	  },

	  events: {
	    'click #js-submit': 'submit'
	  },

	  handle: {
	    submit: function(e) {
	      console.log(this, e);
	    }
	  }
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<form> <div><input /></div> <div><input type="password" name="username" /></div></form><button id="js-submit">登录</button>';return out;
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div id="top"></div><div id="login"></div>';return out;
	}

/***/ }
/******/ ]);