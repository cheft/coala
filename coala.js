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
	  Version: 0.1.0
	  Author: Cheft
	*/
	var Component = __webpack_require__(1);
	var observable = __webpack_require__(3);

	var coala = {
	  observable: observable,

	  mount: function(opts, el) {
	    return this.component(opts).mount(el);
	  },

	  render: function(opts) {
	    // :TODO 单独写服务端Component
	    var node = $('<div>');
	    this.mount(opts, node);
	    return node.html();
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

	var morphdom = __webpack_require__(2);
	var observable = __webpack_require__(3);

	function Component(opts) {
	  this.opts = opts || {};
	  this.data = opts.data || {};
	  this.refs = {};
	  this._mixin();
	  observable(this);
	  this._listenTo();
	  this.trigger('init').trigger('update');
	  this._dom();
	  this._initRefs(this);
	}

	Component.prototype.mount = function(el) {
	  if (el) {
	    this.el = $(el);
	  }

	  this.el.append(this.dom.children());
	  this._bindEvents();
	  this.trigger('updated').trigger('mount');
	  return this;
	};

	Component.prototype.update = function(data) {
	  if (data) {
	    this.data = $.extend(false, this.data, data);
	  }

	  this.trigger('update');
	  this._dom();
	  this._initRefs(this);
	  if (document.createRange) {
	    var newDom = this.el[0].cloneNode(false);
	    newDom.innerHTML = this.dom.html();
	    morphdom(this.el[0], newDom, {
	      onBeforeMorphEl: function(fromEl, toEl) {
	        if (fromEl.tagName === 'TEXTAREA' || fromEl.tagName === 'INPUT') {
	          toEl.checked = fromEl.checked;
	          toEl.value = fromEl.value;
	        } else if (fromEl.tagName === 'OPTION') {
	          toEl.selected = fromEl.selected;
	        }
	      }
	    });
	  }else {
	    this.off();
	    this.el.empty().html(this.dom.html());
	    this._bindEvents();
	  }

	  this.trigger('updated');
	};

	Component.prototype.unmount = function() {
	  this.el.empty();
	  this.el.off();
	  this.trigger('unmount');
	  this.off('*');
	};

	Component.prototype.$ = function(el) {
	  return this.el.find(el);
	};

	Component.prototype._dom = function() {
	  if (this.opts.tpl) {
	    this.dom = $('<div>' + this.opts.tpl(this.data) + '</div>');
	    return;
	  }

	  this.dom = $('<div></div>');
	};

	Component.prototype._initRefs = function(parent) {
	  if (!this.opts.refs) {
	    return;
	  }

	  for (var p in this.opts.refs) {
	    var value = this.opts.refs[p];
	    if (value.data) {
	      value.component.data = $.extend(false, value.component.data, value.data);
	    }

	    var c = new Component(value.component);
	    c.refOpts = $.extend(false, {}, value);
	    c.parent = parent;
	    this.refs[p] = c;
	    c.el = parent.dom.find(value.el);
	    c.mount();
	  }
	};

	Component.prototype._bindEvents = function() {
	  if (!this.opts.events) {
	    return;
	  }

	  for (var e in this.opts.events) {
	    var handleName = this.opts.events[e];
	    var index = e.indexOf(' ');
	    var selector = e.substr(index + 1, e.length);
	    this.el.on(e.substr(0, index), selector, $.proxy(this.opts.handle[handleName], this));
	  }
	};

	Component.prototype._mixin = function() {
	  if (!this.opts.mixins) {
	    return;
	  }

	  this.opts.mixins.unshift(false);
	  var obj = $.extend.apply($, this.opts.mixins);
	  for (var o in obj) {
	    this[o] = obj[o];
	  }
	};

	Component.prototype._listenTo = function() {
	  if (!this.opts.listen) {
	    return;
	  }

	  for (var l in this.opts.listen) {
	    var fn = this.opts.listen[l];
	    this.on(l, fn);
	  }
	};

	module.exports = Component;


/***/ },
/* 2 */
/***/ function(module, exports) {

	// Create a range object for efficently rendering strings to elements.
	var range;

	function toElement(str) {
	    if (!range) {
	        range = document.createRange();
	        range.selectNode(document.body);
	    }

	    var fragment;
	    if (range.createContextualFragment) {
	        fragment = range.createContextualFragment(str);
	    } else {
	        fragment = document.createElement('body');
	        fragment.innerHTML = str;
	    }
	    return fragment.childNodes[0];
	}

	var specialElHandlers = {
	    /**
	     * Needed for IE. Apparently IE doesn't think
	     * that "selected" is an attribute when reading
	     * over the attributes using selectEl.attributes
	     */
	    OPTION: function(fromEl, toEl) {
	        if ((fromEl.selected = toEl.selected)) {
	            fromEl.setAttribute('selected', '');
	        } else {
	            fromEl.removeAttribute('selected', '');
	        }
	    },
	    /**
	     * The "value" attribute is special for the <input> element
	     * since it sets the initial value. Changing the "value"
	     * attribute without changing the "value" property will have
	     * no effect since it is only used to the set the initial value.
	     * Similar for the "checked" attribute.
	     */
	    INPUT: function(fromEl, toEl) {
	        fromEl.checked = toEl.checked;

	        if (fromEl.value != toEl.value) {
	            fromEl.value = toEl.value;
	        }

	        if (!toEl.hasAttribute('checked')) {
	            fromEl.removeAttribute('checked');
	        }

	        if (!toEl.hasAttribute('value')) {
	            fromEl.removeAttribute('value');
	        }
	    },

	    TEXTAREA: function(fromEl, toEl) {
	        var newValue = toEl.value;
	        if (fromEl.value != newValue) {
	            fromEl.value = newValue;
	        }

	        if (fromEl.firstChild) {
	            fromEl.firstChild.nodeValue = newValue;
	        }
	    }
	};

	function noop() {}

	/**
	 * Loop over all of the attributes on the target node and make sure the
	 * original DOM node has the same attributes. If an attribute
	 * found on the original node is not on the new node then remove it from
	 * the original node
	 * @param  {HTMLElement} fromNode
	 * @param  {HTMLElement} toNode
	 */
	function morphAttrs(fromNode, toNode) {
	    var attrs = toNode.attributes;
	    var i;
	    var attr;
	    var attrName;
	    var attrValue;
	    var foundAttrs = {};

	    for (i=attrs.length-1; i>=0; i--) {
	        attr = attrs[i];
	        if (attr.specified !== false) {
	            attrName = attr.name;
	            attrValue = attr.value;
	            foundAttrs[attrName] = true;

	            if (fromNode.getAttribute(attrName) !== attrValue) {
	                fromNode.setAttribute(attrName, attrValue);
	            }
	        }
	    }

	    // Delete any extra attributes found on the original DOM element that weren't
	    // found on the target element.
	    attrs = fromNode.attributes;

	    for (i=attrs.length-1; i>=0; i--) {
	        attr = attrs[i];
	        if (attr.specified !== false) {
	            attrName = attr.name;
	            if (!foundAttrs.hasOwnProperty(attrName)) {
	                fromNode.removeAttribute(attrName);
	            }
	        }
	    }
	}

	/**
	 * Copies the children of one DOM element to another DOM element
	 */
	function moveChildren(fromEl, toEl) {
	    var curChild = fromEl.firstChild;
	    while(curChild) {
	        var nextChild = curChild.nextSibling;
	        toEl.appendChild(curChild);
	        curChild = nextChild;
	    }
	    return toEl;
	}

	function morphdom(fromNode, toNode, options) {
	    if (!options) {
	        options = {};
	    }

	    if (typeof toNode === 'string') {
	        toNode = toElement(toNode);
	    }

	    var savedEls = {}; // Used to save off DOM elements with IDs
	    var unmatchedEls = {};
	    var onNodeDiscarded = options.onNodeDiscarded || noop;
	    var onBeforeMorphEl = options.onBeforeMorphEl || noop;
	    var onBeforeMorphElChildren = options.onBeforeMorphElChildren || noop;
	    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
	    var childrenOnly = options.childrenOnly === true;

	    function removeNodeHelper(node, nestedInSavedEl) {
	        var id = node.id;
	        // If the node has an ID then save it off since we will want
	        // to reuse it in case the target DOM tree has a DOM element
	        // with the same ID
	        if (id) {
	            savedEls[id] = node;
	        } else if (!nestedInSavedEl) {
	            // If we are not nested in a saved element then we know that this node has been
	            // completely discarded and will not exist in the final DOM.
	            onNodeDiscarded(node);
	        }

	        if (node.nodeType === 1) {
	            var curChild = node.firstChild;
	            while(curChild) {
	                removeNodeHelper(curChild, nestedInSavedEl || id);
	                curChild = curChild.nextSibling;
	            }
	        }
	    }

	    function walkDiscardedChildNodes(node) {
	        if (node.nodeType === 1) {
	            var curChild = node.firstChild;
	            while(curChild) {


	                if (!curChild.id) {
	                    // We only want to handle nodes that don't have an ID to avoid double
	                    // walking the same saved element.

	                    onNodeDiscarded(curChild);

	                    // Walk recursively
	                    walkDiscardedChildNodes(curChild);
	                }

	                curChild = curChild.nextSibling;
	            }
	        }
	    }

	    function removeNode(node, parentNode, alreadyVisited) {
	        if (onBeforeNodeDiscarded(node) === false) {
	            return;
	        }

	        parentNode.removeChild(node);
	        if (alreadyVisited) {
	            if (!node.id) {
	                onNodeDiscarded(node);
	                walkDiscardedChildNodes(node);
	            }
	        } else {
	            removeNodeHelper(node);
	        }
	    }

	    function morphEl(fromEl, toEl, alreadyVisited, childrenOnly) {
	        if (toEl.id) {
	            // If an element with an ID is being morphed then it is will be in the final
	            // DOM so clear it out of the saved elements collection
	            delete savedEls[toEl.id];
	        }

	        if (!childrenOnly) {
	            if (onBeforeMorphEl(fromEl, toEl) === false) {
	                return;
	            }

	            morphAttrs(fromEl, toEl);

	            if (onBeforeMorphElChildren(fromEl, toEl) === false) {
	                return;
	            }
	        }

	        if (fromEl.tagName != 'TEXTAREA') {
	            var curToNodeChild = toEl.firstChild;
	            var curFromNodeChild = fromEl.firstChild;
	            var curToNodeId;

	            var fromNextSibling;
	            var toNextSibling;
	            var savedEl;
	            var unmatchedEl;

	            outer: while(curToNodeChild) {
	                toNextSibling = curToNodeChild.nextSibling;
	                curToNodeId = curToNodeChild.id;

	                while(curFromNodeChild) {
	                    var curFromNodeId = curFromNodeChild.id;
	                    fromNextSibling = curFromNodeChild.nextSibling;

	                    if (!alreadyVisited) {
	                        if (curFromNodeId && (unmatchedEl = unmatchedEls[curFromNodeId])) {
	                            unmatchedEl.parentNode.replaceChild(curFromNodeChild, unmatchedEl);
	                            morphEl(curFromNodeChild, unmatchedEl, alreadyVisited);
	                            curFromNodeChild = fromNextSibling;
	                            continue;
	                        }
	                    }

	                    var curFromNodeType = curFromNodeChild.nodeType;

	                    if (curFromNodeType === curToNodeChild.nodeType) {
	                        var isCompatible = false;

	                        if (curFromNodeType === 1) { // Both nodes being compared are Element nodes
	                            if (curFromNodeChild.tagName === curToNodeChild.tagName) {
	                                // We have compatible DOM elements
	                                if (curFromNodeId || curToNodeId) {
	                                    // If either DOM element has an ID then we handle
	                                    // those differently since we want to match up
	                                    // by ID
	                                    if (curToNodeId === curFromNodeId) {
	                                        isCompatible = true;
	                                    }
	                                } else {
	                                    isCompatible = true;
	                                }
	                            }

	                            if (isCompatible) {
	                                // We found compatible DOM elements so transform the current "from" node
	                                // to match the current target DOM node.
	                                morphEl(curFromNodeChild, curToNodeChild, alreadyVisited);
	                            }
	                        } else if (curFromNodeType === 3) { // Both nodes being compared are Text nodes
	                            isCompatible = true;
	                            // Simply update nodeValue on the original node to change the text value
	                            curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
	                        }

	                        if (isCompatible) {
	                            curToNodeChild = toNextSibling;
	                            curFromNodeChild = fromNextSibling;
	                            continue outer;
	                        }
	                    }

	                    // No compatible match so remove the old node from the DOM and continue trying
	                    // to find a match in the original DOM
	                    removeNode(curFromNodeChild, fromEl, alreadyVisited);
	                    curFromNodeChild = fromNextSibling;
	                }

	                if (curToNodeId) {
	                    if ((savedEl = savedEls[curToNodeId])) {
	                        morphEl(savedEl, curToNodeChild, true);
	                        curToNodeChild = savedEl; // We want to append the saved element instead
	                    } else {
	                        // The current DOM element in the target tree has an ID
	                        // but we did not find a match in any of the corresponding
	                        // siblings. We just put the target element in the old DOM tree
	                        // but if we later find an element in the old DOM tree that has
	                        // a matching ID then we will replace the target element
	                        // with the corresponding old element and morph the old element
	                        unmatchedEls[curToNodeId] = curToNodeChild;
	                    }
	                }

	                // If we got this far then we did not find a candidate match for our "to node"
	                // and we exhausted all of the children "from" nodes. Therefore, we will just
	                // append the current "to node" to the end
	                fromEl.appendChild(curToNodeChild);

	                curToNodeChild = toNextSibling;
	                curFromNodeChild = fromNextSibling;
	            }

	            // We have processed all of the "to nodes". If curFromNodeChild is non-null then
	            // we still have some from nodes left over that need to be removed
	            while(curFromNodeChild) {
	                fromNextSibling = curFromNodeChild.nextSibling;
	                removeNode(curFromNodeChild, fromEl, alreadyVisited);
	                curFromNodeChild = fromNextSibling;
	            }
	        }

	        var specialElHandler = specialElHandlers[fromEl.tagName];
	        if (specialElHandler) {
	            specialElHandler(fromEl, toEl);
	        }
	    } // END: morphEl(...)

	    var morphedNode = fromNode;
	    var morphedNodeType = morphedNode.nodeType;
	    var toNodeType = toNode.nodeType;

	    if (!childrenOnly) {
	        // Handle the case where we are given two DOM nodes that are not
	        // compatible (e.g. <div> --> <span> or <div> --> TEXT)
	        if (morphedNodeType === 1) {
	            if (toNodeType === 1) {
	                if (fromNode.tagName !== toNode.tagName) {
	                    onNodeDiscarded(fromNode);
	                    morphedNode = moveChildren(fromNode, document.createElement(toNode.tagName));
	                }
	            } else {
	                // Going from an element node to a text node
	                morphedNode = toNode;
	            }
	        } else if (morphedNodeType === 3) { // Text node
	            if (toNodeType === 3) {
	                morphedNode.nodeValue = toNode.nodeValue;
	                return morphedNode;
	            } else {
	                // Text node to something else
	                morphedNode = toNode;
	            }
	        }
	    }

	    if (morphedNode === toNode) {
	        // The "to node" was not compatible with the "from node"
	        // so we had to toss out the "from node" and use the "to node"
	        onNodeDiscarded(fromNode);
	    } else {
	        morphEl(morphedNode, toNode, false, childrenOnly);

	        // Fire the "onNodeDiscarded" event for any saved elements
	        // that never found a new home in the morphed DOM
	        for (var savedElId in savedEls) {
	            if (savedEls.hasOwnProperty(savedElId)) {
	                var savedEl = savedEls[savedElId];
	                onNodeDiscarded(savedEl);
	                walkDiscardedChildNodes(savedEl);
	            }
	        }
	    }

	    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
	        // If we had to swap out the from node with a new node because the old
	        // node was not compatible with the target node then we need to
	        // replace the old DOM node in the original DOM tree. This is only
	        // possible if the original DOM node was part of a DOM tree which
	        // we know is the case if it has a parent node.
	        fromNode.parentNode.replaceChild(morphedNode, fromNode);
	    }

	    return morphedNode;
	}

	module.exports = morphdom;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(el) {
	  el = el || {};
	  var callbacks = {};
	  var _id = 0;

	  el.on = function(events, fn) {
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


/***/ }
/******/ ])
});
;