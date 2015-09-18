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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var coala = __webpack_require__(2);
	var top = __webpack_require__(3);
	var menu = __webpack_require__(5);
	var content = __webpack_require__(7);
	var tpl = __webpack_require__(9);

	var index = {
	  tpl: tpl,
	  refs: {
	    top: {
	      el: '.top',
	      component: top,
	      data: {name: '陈海峰'}
	    },
	    '#menu': menu,
	    '#content': content
	  }
	};

	window.index = coala.mount(index, '#app');


/***/ },
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(6);

	module.exports = {
	  listen: {
	    init: function() {
	      this.tpl = tpl;
	      this.data = {menus: ['首页', '管理房源', '数据分析', '个人中心'] };
	    }
	  },

	  evnet: {
	    'click .js-menu': 'test'
	  },

	  handle: {
	    test: function(e) {
	      alert(this);
	    }
	  }
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<ul>';var arr1=it.menus;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+=' <li><a class="js-menu" id="menu-'+(index)+'" href="#">'+(value)+'</a></li>';} } out+='</ul>';return out;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var top = __webpack_require__(3);
	var tpl = __webpack_require__(8);

	module.exports = {
	  listen: {
	    init: function() {
	      this.tpl = tpl;
	      this.data = {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'};
	    }
	  },

	  refs: {
	    '#content-top': top
	  }
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div>Hi '+( it.name)+'!</div><div>'+( it.age || '')+'</div><div>'+( 1 + 11)+'</div><div>'+( it.tt)+'</div><div class="top" id="content-top"></div>';return out;
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> .top { background-color: #2B28E2; color: #FFF; padding: 10px; text-align: center; } .menu { float: left; width: 200px; height: 1000px; background-color: #4785FF; } .menu li { list-style: none; padding: 10px; } .menu a { color: #FFF; text-decoration: none; padding: 10px; }</style><div class="top" id="top"></div><div class="menu" id="menu"></div><div class="content" id="content"></div>';return out;
	}

/***/ }
/******/ ]);