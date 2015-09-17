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

	module.exports = __webpack_require__(18);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(4);
	var observable = __webpack_require__(6);

	var quite = {
	  observable: observable,

	  mount: function(opts, el) {
	    return new View(opts).mount(el);
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
	  this.dispatcher = opts.dispatcher || {};
	  this.actions = opts.actions || {};
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
	  if (this.vid) {
	    var parentEl = this.el;
	    var template = this.template();
	    var $template = $(template).attr('vid', this.vid);
	    parentEl.append($template[0].outerHTML);
	    this.el = parentEl.find('[vid=' + this.vid + ']');
	    delete this.vid;
	  }else {
	    this.el.empty().html(this.template());
	  }

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

	      if (value.vid) {
	        view.vid = value.vid;
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
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var quite = __webpack_require__(3);
	var github = __webpack_require__(19);
	var githubDynamic = __webpack_require__(21);
	var tpl = __webpack_require__(22);

	var mytodo = {
	  tpl: tpl,
	  views: {
	    '#todo1': github,
	    '#todo2': githubDynamic
	  }
	};

	window.todo = quite.mount(mytodo, '#app');


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(20);

	module.exports = {
	  tpl: tpl,
	  listen: {
	    mount: function() {
	      this.trigger('fetch', 'react');
	    },

	    updated: function() {
	      this.el.find('#search').focus();
	    },

	    fetch: function(keyword) {
	      var _this = this;
	      $.ajax({
	        // url: 'https://api.github.com/search/repositories?q=' + keyword + '&sort=start',
	        url: 'http://172.16.0.135:3000/github',
	        type: 'get'
	      }).done(function(data) {
	        _this.data = data;
	        _this.update();
	      });
	    }
	  },

	  dispatcher: {
	    'keypress #search': 'search'
	  },

	  actions: {
	    search: function(e) {
	      if (e.keyCode === 13) {
	        this.trigger('fetch', e.target.value);
	      }
	    }
	  }
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> .active { border: 1px solid red; } .avatar { width: 100px; height: 100px; }</style><div> <h3>这里所有的项是一个 view</h3> <input id="search" placeholder="enter search"/></div>';var arr1=it.items;if(arr1){var gh,index=-1,l1=arr1.length-1;while(index<l1){gh=arr1[index+=1];out+='<div> <h3>'+( gh.name)+'</h3><h5>'+( gh.owner.login)+'</h5> <img class="avatar" src="'+( gh.owner.avatar_url)+'"></div>';} } return out;
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var item = __webpack_require__(23);
	var tpl = __webpack_require__(25);

	module.exports = {
	  tpl: tpl,
	  listen: {
	    mount: function() {
	      this.trigger('fetch', 'react');
	    },

	    updated: function() {
	      this.el.find('#search').focus();
	    },

	    fetch: function(keyword) {
	      var _this = this;
	      _this.opts.views = {};
	      $.ajax({
	        // url: 'https://api.github.com/search/repositories?q=' + keyword + '&sort=start',
	        url: 'http://172.16.0.135:3000/github',
	        type: 'get'
	      }).done(function(data) {
	        for (var i = 0; i < data.items.length; i++) {
	          var v = {
	            view: item,
	            data: data.items[i],
	            el: '#repositories',
	            vid: 'item_' + data.items[i].id
	          };
	          _this.opts.views[v.vid] = v;
	        }

	        _this.update();
	      });
	    }
	  },

	  dispatcher: {
	    'keypress #search': 'search'
	  },

	  actions: {
	    search: function(e) {
	      if (e.keyCode === 13) {
	        this.trigger('fetch', e.target.value);
	      }
	    }
	  }
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> .width50 { float: left; width: 48%; margin-left: 1%; }</style><div> <div class="width50" id="todo1"></div> <div class="width50" id="todo2"></div> <!-- <div class="width50" id="todo3"></div> --> <!-- <div class="width50" id="todo4"></div> --></div>';return out;
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(24);

	module.exports = {
	  tpl: tpl,
	  listen: {
	    updated: function() {
	      console.log(this.el.attr('id') + ' item updated');
	    }
	  },

	  dispatcher: {
	    'click [id^=img-]': 'test'
	  },

	  actions: {
	    test: function() {
	      this.data.name = 'Chefttttttttttttttt!';
	      this.data.owner.avatar_url = 'https://avatars0.githubusercontent.com/u/1567209?v=3&amp;s=460';
	      this.update();
	    }
	  }
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div> <h3>'+(it.name)+'</h3><h5>'+( it.owner.login)+'</h5> <img class="avatar" id="img-'+( it.id )+'" src="'+( it.owner.avatar_url)+'"></div>';return out;
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> .avatar { width: 100px; height: 100px;   }</style><div> <h3>这里每一项都是一个 view</h3> <input id="search" placeholder="enter search"/> <div id="repositories"></div></div>';return out;
	}

/***/ }
/******/ ]);