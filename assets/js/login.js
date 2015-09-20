/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(13);


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
/* 2 */,
/* 3 */
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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(5);
	
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
/* 5 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div> 欢迎 '+( it.name)+' <button class="js-test">测试</button></div>';return out;
	}

/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var coala = __webpack_require__(3);
	var top = __webpack_require__(4);
	var form = __webpack_require__(14);
	var tpl = __webpack_require__(20);
	
	var login = {
	  tpl: tpl,
	  refs: {
	  	top: {
	  	  component: top,
	  	  el: '#top'
	  	},
	  	login: {
	  	  component: form,
	  	  el: '#login'
	  	}
	  }
	};
	
	coala.mount(login, '#app');


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(15);
	var tpl = __webpack_require__(19);
	
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(16);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(18)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(17)();
	// imports
	
	
	// module
	exports.push([module.id, ".login-form input {\n  font-size: 14px;\n  color: #eee;\n}", ""]);
	
	// exports


/***/ },
/* 17 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<form class="login-form"> <div><input /></div> <div><input type="password" name="username" /></div></form><button id="js-submit">登录</button>';return out;
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div id="top"></div><div id="login"></div>';return out;
	}

/***/ }
/******/ ]);
//# sourceMappingURL=login.js.map