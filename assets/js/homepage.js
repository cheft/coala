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

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var quite = __webpack_require__(3);
	var topView = __webpack_require__(7);
	var menuView = __webpack_require__(9);
	var contentView = __webpack_require__(11);
	var tpl = __webpack_require__(13);

	var indexView = {
	  tpl: tpl,
	  views: {
	    top: {
	      el: '.top',
	      view: topView,
	      data: {name: '陈海峰'}
	    },
	    menu: {
	      el: '#menu',
	      view: menuView
	    },
	    content: {
	      el: '#content',
	      view: contentView
	    }
	  }
	};

	window.indexView = quite.mount(indexView, '#app');


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(4);
	var observable = __webpack_require__(6);

	var quite = {
	  observable: observable,

	  mount: function(opts, el) {
	    return this.view(opts).mount(el);
	  },

	  view: function(opts) {
	    return new View(opts);
	  }
	};

	observable(quite);

	module.exports = quite;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(5);
	var observable = __webpack_require__(6);

	function View(opts) {
	  this.opts = opts;
	  this.tpl = opts.tpl || {};
	  this.el = opts.el ? $(opts.el) : undefined;
	  this.data = opts.data || {};
	  this.listen = opts.listen || {};
	  this.dispatcher = opts.dispatcher;
	  this.actions = opts.actions || {};
	  this.parent = {};
	  this.views = {};
	  this.id = util.uniqueId('view');

	  observable(this);
	  this._listenTo();
	  this.trigger('init');
	}

	View.prototype.template = function() {
	  return this.tpl(this.data);
	};

	View.prototype.mount = function(el) {
	  this.el = el ? $(el) : this.el;
	  this.update();
	  this.trigger('mount');
	  return this;
	};

	View.prototype.update = function(data) {
	  this.trigger('update');
	  this.data = data || this.data;
	  this.el.html(this.template());
	  this._mountViews(this);
	  this._bindEvents();
	  this.trigger('updated');
	};

	View.prototype._mountViews = function(parent) {
	  if (!this.opts.views) {
	    return;
	  }

	  for (var p in this.opts.views) {
	    var view;
	    var value = this.opts.views[p];
	    if (value.view) {
	      var view = new View(value.view);
	      if (value.data) {
	        view.data = value.data;
	      }

	      view.el = $(value.el);
	    }else {
	      view = new View(value);
	      view.el = $(p);
	    }

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

	View.prototype._listenTo = function() {
	  for (var l in this.listen) {
	    var fn = this.listen[l];
	    this.on(l, fn);
	  }
	};

	module.exports = View;


/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(5);

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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(8);

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
	    }
	  },

	  dispatcher: {
	    'click .js-test': 'test'
	  },

	  actions: {
	    test: function(e) {
	      console.log(e, this);
	    }
	  }
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div> 欢迎 '+( it.name)+' <button class="js-test">测试</button></div>';return out;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var quite = __webpack_require__(3);
	var tpl = __webpack_require__(10);

	module.exports = {
	  listen: {
	    init: function() {
	      this.tpl = tpl;
	      this.data = {menus: ['首页', '管理房源', '数据分析', '个人中心'] };
	      console.log(this);
	    }
	  },

	  dispatcher: {
	    'click .js-menu': 'test'
	  },

	  actions: {
	    test: function(e) {
	      console.log(e, this);
	    }
	  }
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<ul>';var arr1=it.menus;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+=' <li><a class="js-menu" id="menu-'+(index)+'" href="#">'+(value)+'</a></li>';} } out+='</ul>';return out;
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(12);
	var topView = __webpack_require__(7);

	module.exports = {
	  listen: {
	    init: function() {
	      this.tpl = tpl;
	      this.data = {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'};
	    }
	  },

	  views: {
	    test: {
	      el: '#content-top',
	      view: topView
	    }
	  }
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div>Hi '+( it.name)+'!</div><div>'+( it.age || '')+'</div><div>'+( 1 + 11)+'</div><div>'+( it.tt)+'</div><div class="top" id="content-top"></div>';return out;
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> .top { background-color: #2B28E2; color: #FFF; padding: 10px; text-align: center; } .menu { float: left; width: 200px; height: 1000px; background-color: #4785FF; } .menu li { list-style: none; padding: 10px; } .menu a { color: #FFF; text-decoration: none; padding: 10px; }</style><div class="top" id="top"></div><div class="menu" id="menu"></div><div class="content" id="content"></div>';return out;
	}

/***/ }
/******/ ]);