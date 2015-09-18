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
	module.exports = __webpack_require__(14);


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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var quite = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../quite\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var github = __webpack_require__(15);
	var githubDynamic = __webpack_require__(17);
	var tpl = __webpack_require__(21);

	var mytodo = {
	  tpl: tpl,
	  views: {
	    '#todo1': github,
	    '#todo2': githubDynamic
	  }
	};

	window.todo = quite.mount(mytodo, '#app');


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(16);

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
	        url: 'http://localhost:3000/github',
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
/* 16 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> .active { border: 1px solid red; } .avatar { width: 100px; height: 100px; }</style><div> <h3>这里所有的项是一个 view</h3> <input id="search" placeholder="enter search"/></div>';var arr1=it.items;if(arr1){var gh,index=-1,l1=arr1.length-1;while(index<l1){gh=arr1[index+=1];out+='<div> <h3>'+( gh.name)+'</h3><h5>'+( gh.owner.login)+'</h5> <img class="avatar" src="'+( gh.owner.avatar_url)+'"></div>';} } return out;
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var item = __webpack_require__(18);
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
	      _this.opts.views = {};
	      $.ajax({
	        // url: 'https://api.github.com/search/repositories?q=' + keyword + '&sort=start',
	        url: 'http://localhost:3000/github',
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var tpl = __webpack_require__(19);

	module.exports = {
	  tpl: tpl,
	  listen: {
	    updated: function() {
	      // console.log(this.el.attr('id') + ' item updated');
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
/* 19 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<div> <h3>'+(it.name)+'</h3><h5>'+( it.owner.login)+'</h5> <img class="avatar" id="img-'+( it.id )+'" src="'+( it.owner.avatar_url)+'"></div>';return out;
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> .avatar { width: 100px; height: 100px;   }</style><div> <h3>这里每一项都是一个 view</h3> <input id="search" placeholder="enter search"/> <div id="repositories"></div></div>';return out;
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function anonymous(it
	/**/) {
	var out='<style> .width50 { float: left; width: 48%; margin-left: 1%; }</style><div> <div class="width50" id="todo1"></div> <div class="width50" id="todo2"></div> <!-- <div class="width50" id="todo3"></div> --> <!-- <div class="width50" id="todo4"></div> --></div>';return out;
	}

/***/ }
/******/ ]);