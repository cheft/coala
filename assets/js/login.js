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

	module.exports = __webpack_require__(10);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	var counter = 0;
	var quite = {
	  uniqueId: function(prefix) {
	    return (prefix || '') + (++counter);
	  },

	  mount: function(opts, el) {
	    return new View(opts).mount(el);
	  }
	};

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
	  this._buildListener();
	  this.listen.init.call(this);
	  this.id = quite.uniqueId('view');
	}

	View.prototype.template = function() {
	  return this.tpl(this.data);
	};

	View.prototype.mount = function(el) {
	  this.el = el ? $(el) : this.el;
	  this.update();
	  this._mountViews(this);
	  this.listen.mount.call(this);
	  return this;
	};

	View.prototype.update = function(data) {
	  this.listen.update.call(this);
	  this.data = data || this.data;
	  this._replaceId();
	  this.el.html(this.template());
	  this._bindEvents();
	  this.listen.updated.call(this);
	};

	View.prototype._mountViews = function(parent) {
	  if (!this.opts.views) {
	    return;
	  }

	  for (var p in this.opts.views) {
	    var view = new View(this.opts.views[p].view);
	    if (this.opts.views[p].data) {
	      view.data = this.opts.views[p].data;
	    }

	    view.el = $(this.opts.views[p].el);
	    view.parent = parent;
	    view.mount();
	    this.views[p] = view;
	  }
	};

	View.prototype._replaceId = function() {
	  var elId = this.el.attr('id');
	  if (elId) {
	    this.el.attr('id', this.id + '-' + elId.replace(this.id + '-', ''));
	  };
	};

	View.prototype._bindEvents = function() {
	  if (!this.dispatcher) {
	    return;
	  }

	  for (var e in this.dispatcher) {
	    var actionName = this.dispatcher[e];
	    var $el = $(e.split(' ')[1]);
	    var _this = this;
	    $el.on(e.split(' ')[0], function(e) {
	      _this.actions[actionName].call(_this, e);
	    });
	  }
	};

	View.prototype._buildListener = function() {
	  var listeners = ['init', 'mount', 'update', 'updated'];
	  for (var i = 0; i < listeners.length; i++) {
	    var l = listeners[i];
	    this.listen[l] = this.listen[l] || function() {};
	  };
	};

	module.exports = quite;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var quite = __webpack_require__(2);
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
	      var _this = this;
	      $.ajax({
	        url: 'http://localhost:3000/users/1',
	        type: 'get'
	        // async: false,
	      }).done(function(user) {
	        console.log(_this);
	        _this.update(user);
	      });
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

	var quite = __webpack_require__(2);
	var topView = __webpack_require__(3);
	var formView = __webpack_require__(11);
	var tpl = __webpack_require__(13);

	var loginView = {
	  tpl: tpl,
	  views: {
	    top: {
	      el: '#top',
	      view: topView
	    },
	    login: {
	      el: '#login',
	      view: formView
	    }
	  }
	};

	quite.mount(loginView, '#app');



/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var quite = __webpack_require__(2);
	var tpl = __webpack_require__(12);

	module.exports = {
	  listen: {
	    init: function() {
	      this.tpl = tpl;
	    }
	  },

	  dispatcher: {
	    'click #js-submit': 'submit'
	  },

	  actions: {
	    submit: function(e) {
	      console.log(this, e);
	    }
	  }
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<form> <div><input /></div> <div><input type="password" /></div></form><button id="js-submit">登录</button>';return out;
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div id="top"></div><div id="login"></div>';return out;
	}

/***/ }
/******/ ]);