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

	var quite = __webpack_require__(2);
	var topView = __webpack_require__(3);
	var menuView = __webpack_require__(5);
	var contentView = __webpack_require__(7);
	var tpl = __webpack_require__(9);

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var quite = __webpack_require__(2);
	var tpl = __webpack_require__(6);

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
/* 6 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<ul>';var arr1=it.menus;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+=' <li><a class="js-menu" id="menu-'+(index)+'" href="#">'+(value)+'</a></li>';} } out+='</ul>';return out;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var quite = __webpack_require__(2);
	var tpl = __webpack_require__(8);
	var topView = __webpack_require__(3);

	module.exports = {
	  listen: {
	    init: function() {
	      this.tpl = tpl;
	      this.data = {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'};
	    }
	  },

	  views: {
	    test: {
	      el: '#top',
	      view: topView
	    }
	  }
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div>Hi '+( it.name)+'!</div><div>'+( it.age || '')+'</div><div>'+( 1 + 11)+'</div><div>'+( it.tt)+'</div><div class="top" id="top"></div>';return out;
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