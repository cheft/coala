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

	module.exports = __webpack_require__(17);


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
	    return new View(opts);
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


/***/ },
/* 6 */,
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var quite = __webpack_require__(2);
	var todo = __webpack_require__(18);
	var tpl = __webpack_require__(20);

	var mytodo = {
	  tpl: tpl,
	  views: {
	    todo1: {
	      el: '#todo1',
	      view: todo
	    },

	    todo2: {
	      el: '#todo2',
	      view: todo
	    },

	    todo3: {
	      el: '#todo3',
	      view: todo
	    },

	    todo4: {
	      el: '#todo4',
	      view: todo
	    }
	  }
	};

	quite.mount(mytodo, '#app');


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(19);

	module.exports = {
	  listen: {
	    init: function() {
	      alert('初始化 ' + this.id);
	      this.tpl = tpl;
	      this.data = [
	        {name: '做自己的前端框架', complete: true}
	      ];
	    },

	    update: function() {
	      alert('正准备更新 ' + this.id);
	    },

	    updated: function() {
	      alert('已经更新 ' + this.id);
	    },

	    mount: function() {
	      alert('挂载 ' + this.id);
	    },

	    test: function(name) {
	      alert(name + ' 任务已增加!');
	    }
	  },

	  dispatcher: {
	    'click #create': 'create',
	    'click .remove': 'remove',
	    'click .todo': 'toggle'
	  },

	  actions: {
	    create: function(e) {
	      var name = this.el.find('input[name="name"]').val();
	      this.data.push({name: name, complete: false});
	      this.update();
	      this.trigger('test', name);
	    },

	    remove: function(e) {
	      var id = e.target.id.split('-')[1];
	      this.data.splice(id, 1);
	      this.update();
	    },

	    toggle: function(e) {
	      var id = e.target.id.split('-')[1];
	      this.data[id].complete = !this.data[id].complete;
	      this.update();
	    }
	  }
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> li.todo { list-style: none; } .complete { text-decoration: line-through; }</style><div> <h3>您总共有 '+( it.length)+' 条任务</h3> <input name="name" /> <button id="create">增加</button></div><ul> ';var arr1=it;if(arr1){var todo,index=-1,l1=arr1.length-1;while(index<l1){todo=arr1[index+=1];out+=' <li class="todo ';if(todo.complete){out+='complete';}out+='" id="complete-'+(index)+'"> <button class="remove" id="remove-'+(index)+'">X</button> '+(todo.name)+' </li> ';} } out+='</ul>';return out;
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> .width50 { float: left; width: 48%; margin-left: 1%; }</style><div> <div class="width50" id="todo1"></div> <div class="width50" id="todo2"></div> <div class="width50" id="todo3"></div> <div class="width50" id="todo4"></div></div>';return out;
	}

/***/ }
/******/ ]);