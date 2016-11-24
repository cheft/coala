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
	  Version: 1.0.0-beta
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
	__webpack_require__(4);

	function Component(opts) {
	  observable(this);
	  this.opts = opts || {};
	  this.data = opts.data || {};
	  if ($.isFunction(opts.data)) {
	    var result = opts.data.call(this);
	    if (result && result.promise) {
	      this.promise = result;
	    } else {
	      this.data = result;
	    }
	  }
	  if (this.data.$url) {
	    this.promise = $.get(this.data.$url);
	    delete this.data.$url;
	  }
	  this.refs = {};
	  this._mixin();
	  this._listenTo();
	}

	Component.prototype.mount = function(el) {
	  var _this = this
	  this.trigger('init');
	  this.trigger('update');
	  if (this.promise) {
	    this.promise.done(function(resource) {
	      _this.data.resource = resource;
	      _this._render(el);
	      delete _this.promise;
	    })
	    return this;
	  } else {
	    return this._render(el);
	  }
	};

	Component.prototype._render = function(el) {
	  if (el) this.el = $(el);
	  this._dom();
	  this._initRefs();
	  this.el.append(this.dom.children());
	  this._bindEvents();
	  this.trigger('updated').trigger('mount');
	  this.$('style[scoped]').scopedPolyFill();
	  return this
	}

	Component.prototype.update = function(data) {
	  if (data) this.data = $.extend(false, this.data, data);
	  this.trigger('update');
	  this._dom();
	  var newDom = this.el[0].cloneNode(false);
	  newDom.innerHTML = this.dom.html();
	  morphdom(this.el[0], newDom);
	  this.trigger('updated');
	  this.$('style[scoped]').scopedPolyFill();
	  this._updateRefs();
	  return this
	};

	Component.prototype.unmount = function() {
	  this.el.empty().off();
	  this.trigger('unmount').off('*');
	};

	Component.prototype.$ = function(el) {
	  return this.el.find(el);
	};

	Component.prototype._dom = function() {
	  if (this.opts.tpl) return this.dom = $('<div>' + this.opts.tpl(this.data) + '</div>');
	  this.dom = $('<div></div>');
	};

	Component.prototype._initRefs = function() {
	  if (!this.opts.refs) return;
	  for (var p in this.opts.refs) {
	    var value = this.opts.refs[p];
	    if (value.data) value.component.data = $.extend(true, value.component.data, value.data);
	    var c = new Component(value.component);
	    c.refOpts = $.extend(true, {}, value);
	    c.parent = this;
	    this.refs[p] = c;
	    c.el = this.dom.find(value.el);
	    c.mount();
	  }
	};

	Component.prototype._updateRefs = function() {
	  if (!this.refs) return;
	  for (var p in this.refs) {
	    this.refs[p].update()
	  }
	}

	Component.prototype._bindEvents = function() {
	  if (!this.opts.events) return;
	  for (var e in this.opts.events) {
	    var handleName = this.opts.events[e];
	    var index = e.indexOf(' ');
	    var selector = e.substr(index + 1, e.length);
	    this.el.on(e.substr(0, index), selector, $.proxy(this.opts.handle[handleName], this));
	  }
	};

	Component.prototype._mixin = function() {
	  if (!this.opts.mixins) return;
	  if (!$.isArray(this.opts.mixins)) this.opts.mixins = [this.opts.mixins]
	  this.opts.mixins.unshift(this);
	  $.extend.apply($, this.opts.mixins);
	};

	Component.prototype._listenTo = function() {
	  if (!this.opts.listen) return;
	  for (var l in this.opts.listen) {
	    var fn = this.opts.listen[l];
	    this.on(l, fn);
	  }
	};

	module.exports = Component;


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	// Create a range object for efficently rendering strings to elements.
	var range;

	var doc = typeof document !== 'undefined' && document;

	var testEl = doc ?
	    doc.body || doc.createElement('div') :
	    {};

	var NS_XHTML = 'http://www.w3.org/1999/xhtml';

	var ELEMENT_NODE = 1;
	var TEXT_NODE = 3;
	var COMMENT_NODE = 8;

	// Fixes <https://github.com/patrick-steele-idem/morphdom/issues/32>
	// (IE7+ support) <=IE7 does not support el.hasAttribute(name)
	var hasAttributeNS;

	if (testEl.hasAttributeNS) {
	    hasAttributeNS = function(el, namespaceURI, name) {
	        return el.hasAttributeNS(namespaceURI, name);
	    };
	} else if (testEl.hasAttribute) {
	    hasAttributeNS = function(el, namespaceURI, name) {
	        return el.hasAttribute(name);
	    };
	} else {
	    hasAttributeNS = function(el, namespaceURI, name) {
	        return !!el.getAttributeNode(name);
	    };
	}

	function toElement(str) {
	    if (!range && doc.createRange) {
	        range = doc.createRange();
	        range.selectNode(doc.body);
	    }

	    var fragment;
	    if (range && range.createContextualFragment) {
	        fragment = range.createContextualFragment(str);
	    } else {
	        fragment = doc.createElement('body');
	        fragment.innerHTML = str;
	    }
	    return fragment.childNodes[0];
	}

	function syncBooleanAttrProp(fromEl, toEl, name) {
	    if (fromEl[name] !== toEl[name]) {
	        fromEl[name] = toEl[name];
	        if (fromEl[name]) {
	            fromEl.setAttribute(name, '');
	        } else {
	            fromEl.removeAttribute(name, '');
	        }
	    }
	}

	var specialElHandlers = {
	    /**
	     * Needed for IE. Apparently IE doesn't think that "selected" is an
	     * attribute when reading over the attributes using selectEl.attributes
	     */
	    OPTION: function(fromEl, toEl) {
	        syncBooleanAttrProp(fromEl, toEl, 'selected');
	    },
	    /**
	     * The "value" attribute is special for the <input> element since it sets
	     * the initial value. Changing the "value" attribute without changing the
	     * "value" property will have no effect since it is only used to the set the
	     * initial value.  Similar for the "checked" attribute, and "disabled".
	     */
	    INPUT: function(fromEl, toEl) {
	        syncBooleanAttrProp(fromEl, toEl, 'checked');
	        syncBooleanAttrProp(fromEl, toEl, 'disabled');

	        if (fromEl.value !== toEl.value) {
	            fromEl.value = toEl.value;
	        }

	        if (!hasAttributeNS(toEl, null, 'value')) {
	            fromEl.removeAttribute('value');
	        }
	    },

	    TEXTAREA: function(fromEl, toEl) {
	        var newValue = toEl.value;
	        if (fromEl.value !== newValue) {
	            fromEl.value = newValue;
	        }

	        if (fromEl.firstChild) {
	            fromEl.firstChild.nodeValue = newValue;
	        }
	    }
	};

	function noop() {}

	/**
	 * Returns true if two node's names are the same.
	 *
	 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
	 *       nodeName and different namespace URIs.
	 *
	 * @param {Element} a
	 * @param {Element} b The target element
	 * @return {boolean}
	 */
	function compareNodeNames(fromEl, toEl) {
	    var fromNodeName = fromEl.nodeName;
	    var toNodeName = toEl.nodeName;

	    if (fromNodeName === toNodeName) {
	        return true;
	    }

	    if (toEl.actualize &&
	        fromNodeName.charCodeAt(0) < 91 && /* from tag name is upper case */
	        toNodeName.charCodeAt(0) > 90 /* target tag name is lower case */) {
	        // If the target element is a virtual DOM node then we may need to normalize the tag name
	        // before comparing. Normal HTML elements that are in the "http://www.w3.org/1999/xhtml"
	        // are converted to upper case
	        return fromNodeName === toNodeName.toUpperCase();
	    } else {
	        return false;
	    }
	}

	/**
	 * Create an element, optionally with a known namespace URI.
	 *
	 * @param {string} name the element name, e.g. 'div' or 'svg'
	 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
	 * its `xmlns` attribute or its inferred namespace.
	 *
	 * @return {Element}
	 */
	function createElementNS(name, namespaceURI) {
	    return !namespaceURI || namespaceURI === NS_XHTML ?
	        doc.createElement(name) :
	        doc.createElementNS(namespaceURI, name);
	}

	/**
	 * Loop over all of the attributes on the target node and make sure the original
	 * DOM node has the same attributes. If an attribute found on the original node
	 * is not on the new node then remove it from the original node.
	 *
	 * @param  {Element} fromNode
	 * @param  {Element} toNode
	 */
	function morphAttrs(fromNode, toNode) {
	    if (toNode.assignAttributes) {
	        toNode.assignAttributes(fromNode);
	    } else {
	        var attrs = toNode.attributes;
	        var i;
	        var attr;
	        var attrName;
	        var attrNamespaceURI;
	        var attrValue;
	        var fromValue;

	        for (i = attrs.length - 1; i >= 0; --i) {
	            attr = attrs[i];
	            attrName = attr.name;
	            attrNamespaceURI = attr.namespaceURI;
	            attrValue = attr.value;

	            if (attrNamespaceURI) {
	                attrName = attr.localName || attrName;
	                fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

	                if (fromValue !== attrValue) {
	                    fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
	                }
	            } else {
	                fromValue = fromNode.getAttribute(attrName);

	                if (fromValue !== attrValue) {
	                    fromNode.setAttribute(attrName, attrValue);
	                }
	            }
	        }

	        // Remove any extra attributes found on the original DOM element that
	        // weren't found on the target element.
	        attrs = fromNode.attributes;

	        for (i = attrs.length - 1; i >= 0; --i) {
	            attr = attrs[i];
	            if (attr.specified !== false) {
	                attrName = attr.name;
	                attrNamespaceURI = attr.namespaceURI;

	                if (attrNamespaceURI) {
	                    attrName = attr.localName || attrName;

	                    if (!hasAttributeNS(toNode, attrNamespaceURI, attrName)) {
	                        fromNode.removeAttributeNS(attrNamespaceURI, attrName);
	                    }
	                } else {
	                    if (!hasAttributeNS(toNode, null, attrName)) {
	                        fromNode.removeAttribute(attrName);
	                    }
	                }
	            }
	        }
	    }
	}

	/**
	 * Copies the children of one DOM element to another DOM element
	 */
	function moveChildren(fromEl, toEl) {
	    var curChild = fromEl.firstChild;
	    while (curChild) {
	        var nextChild = curChild.nextSibling;
	        toEl.appendChild(curChild);
	        curChild = nextChild;
	    }
	    return toEl;
	}

	function defaultGetNodeKey(node) {
	    return node.id;
	}

	function morphdom(fromNode, toNode, options) {
	    if (!options) {
	        options = {};
	    }

	    if (typeof toNode === 'string') {
	        if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
	            var toNodeHtml = toNode;
	            toNode = doc.createElement('html');
	            toNode.innerHTML = toNodeHtml;
	        } else {
	            toNode = toElement(toNode);
	        }
	    }

	    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
	    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
	    var onNodeAdded = options.onNodeAdded || noop;
	    var onBeforeElUpdated = options.onBeforeElUpdated || noop;
	    var onElUpdated = options.onElUpdated || noop;
	    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
	    var onNodeDiscarded = options.onNodeDiscarded || noop;
	    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
	    var childrenOnly = options.childrenOnly === true;

	    // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
	    var fromNodesLookup = {};
	    var keyedRemovalList;

	    function addKeyedRemoval(key) {
	        if (keyedRemovalList) {
	            keyedRemovalList.push(key);
	        } else {
	            keyedRemovalList = [key];
	        }
	    }

	    function walkDiscardedChildNodes(node, skipKeyedNodes) {
	        if (node.nodeType === ELEMENT_NODE) {
	            var curChild = node.firstChild;
	            while (curChild) {

	                var key = undefined;

	                if (skipKeyedNodes && (key = getNodeKey(curChild))) {
	                    // If we are skipping keyed nodes then we add the key
	                    // to a list so that it can be handled at the very end.
	                    addKeyedRemoval(key);
	                } else {
	                    // Only report the node as discarded if it is not keyed. We do this because
	                    // at the end we loop through all keyed elements that were unmatched
	                    // and then discard them in one final pass.
	                    onNodeDiscarded(curChild);
	                    if (curChild.firstChild) {
	                        walkDiscardedChildNodes(curChild, skipKeyedNodes);
	                    }
	                }

	                curChild = curChild.nextSibling;
	            }
	        }
	    }

	    /**
	     * Removes a DOM node out of the original DOM
	     *
	     * @param  {Node} node The node to remove
	     * @param  {Node} parentNode The nodes parent
	     * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
	     * @return {undefined}
	     */
	    function removeNode(node, parentNode, skipKeyedNodes) {
	        if (onBeforeNodeDiscarded(node) === false) {
	            return;
	        }

	        if (parentNode) {
	            parentNode.removeChild(node);
	        }

	        onNodeDiscarded(node);
	        walkDiscardedChildNodes(node, skipKeyedNodes);
	    }

	    // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
	    // function indexTree(root) {
	    //     var treeWalker = document.createTreeWalker(
	    //         root,
	    //         NodeFilter.SHOW_ELEMENT);
	    //
	    //     var el;
	    //     while((el = treeWalker.nextNode())) {
	    //         var key = getNodeKey(el);
	    //         if (key) {
	    //             fromNodesLookup[key] = el;
	    //         }
	    //     }
	    // }

	    // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
	    //
	    // function indexTree(node) {
	    //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
	    //     var el;
	    //     while((el = nodeIterator.nextNode())) {
	    //         var key = getNodeKey(el);
	    //         if (key) {
	    //             fromNodesLookup[key] = el;
	    //         }
	    //     }
	    // }

	    function indexTree(node) {
	        if (node.nodeType === ELEMENT_NODE) {
	            var curChild = node.firstChild;
	            while (curChild) {
	                var key = getNodeKey(curChild);
	                if (key) {
	                    fromNodesLookup[key] = curChild;
	                }

	                // Walk recursively
	                indexTree(curChild);

	                curChild = curChild.nextSibling;
	            }
	        }
	    }

	    indexTree(fromNode);

	    function handleNodeAdded(el) {
	        onNodeAdded(el);

	        var curChild = el.firstChild;
	        while (curChild) {
	            var nextSibling = curChild.nextSibling;

	            var key = getNodeKey(curChild);
	            if (key) {
	                var unmatchedFromEl = fromNodesLookup[key];
	                if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
	                    curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
	                    morphEl(unmatchedFromEl, curChild);
	                }
	            }

	            handleNodeAdded(curChild);
	            curChild = nextSibling;
	        }
	    }

	    function morphEl(fromEl, toEl, childrenOnly) {
	        var toElKey = getNodeKey(toEl);
	        var curFromNodeKey;

	        if (toElKey) {
	            // If an element with an ID is being morphed then it is will be in the final
	            // DOM so clear it out of the saved elements collection
	            delete fromNodesLookup[toElKey];
	        }

	        if (toNode.isSameNode && toNode.isSameNode(fromNode)) {
	            return;
	        }

	        if (!childrenOnly) {
	            if (onBeforeElUpdated(fromEl, toEl) === false) {
	                return;
	            }

	            morphAttrs(fromEl, toEl);
	            onElUpdated(fromEl);

	            if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
	                return;
	            }
	        }

	        if (fromEl.nodeName !== 'TEXTAREA') {
	            var curToNodeChild = toEl.firstChild;
	            var curFromNodeChild = fromEl.firstChild;
	            var curToNodeKey;

	            var fromNextSibling;
	            var toNextSibling;
	            var matchingFromEl;

	            outer: while (curToNodeChild) {
	                toNextSibling = curToNodeChild.nextSibling;
	                curToNodeKey = getNodeKey(curToNodeChild);

	                while (curFromNodeChild) {
	                    fromNextSibling = curFromNodeChild.nextSibling;

	                    if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
	                        curToNodeChild = toNextSibling;
	                        curFromNodeChild = fromNextSibling;
	                        continue outer;
	                    }

	                    curFromNodeKey = getNodeKey(curFromNodeChild);

	                    var curFromNodeType = curFromNodeChild.nodeType;

	                    var isCompatible = undefined;

	                    if (curFromNodeType === curToNodeChild.nodeType) {
	                        if (curFromNodeType === ELEMENT_NODE) {
	                            // Both nodes being compared are Element nodes

	                            if (curToNodeKey) {
	                                // The target node has a key so we want to match it up with the correct element
	                                // in the original DOM tree
	                                if (curToNodeKey !== curFromNodeKey) {
	                                    // The current element in the original DOM tree does not have a matching key so
	                                    // let's check our lookup to see if there is a matching element in the original
	                                    // DOM tree
	                                    if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
	                                        if (curFromNodeChild.nextSibling === matchingFromEl) {
	                                            // Special case for single element removals. To avoid removing the original
	                                            // DOM node out of the tree (since that can break CSS transitions, etc.),
	                                            // we will instead discard the current node and wait until the next
	                                            // iteration to properly match up the keyed target element with its matching
	                                            // element in the original tree
	                                            isCompatible = false;
	                                        } else {
	                                            // We found a matching keyed element somewhere in the original DOM tree.
	                                            // Let's moving the original DOM node into the current position and morph
	                                            // it.

	                                            // NOTE: We use insertBefore instead of replaceChild because we want to go through
	                                            // the `removeNode()` function for the node that is being discarded so that
	                                            // all lifecycle hooks are correctly invoked
	                                            fromEl.insertBefore(matchingFromEl, curFromNodeChild);

	                                            if (curFromNodeKey) {
	                                                // Since the node is keyed it might be matched up later so we defer
	                                                // the actual removal to later
	                                                addKeyedRemoval(curFromNodeKey);
	                                            } else {
	                                                // NOTE: we skip nested keyed nodes from being removed since there is
	                                                //       still a chance they will be matched up later
	                                                removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);

	                                            }
	                                            fromNextSibling = curFromNodeChild.nextSibling;
	                                            curFromNodeChild = matchingFromEl;
	                                        }
	                                    } else {
	                                        // The nodes are not compatible since the "to" node has a key and there
	                                        // is no matching keyed node in the source tree
	                                        isCompatible = false;
	                                    }
	                                }
	                            } else if (curFromNodeKey) {
	                                // The original has a key
	                                isCompatible = false;
	                            }

	                            isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
	                            if (isCompatible) {
	                                // We found compatible DOM elements so transform
	                                // the current "from" node to match the current
	                                // target DOM node.
	                                morphEl(curFromNodeChild, curToNodeChild);
	                            }

	                        } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
	                            // Both nodes being compared are Text or Comment nodes
	                            isCompatible = true;
	                            // Simply update nodeValue on the original node to
	                            // change the text value
	                            curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
	                        }
	                    }

	                    if (isCompatible) {
	                        // Advance both the "to" child and the "from" child since we found a match
	                        curToNodeChild = toNextSibling;
	                        curFromNodeChild = fromNextSibling;
	                        continue outer;
	                    }

	                    // No compatible match so remove the old node from the DOM and continue trying to find a
	                    // match in the original DOM. However, we only do this if the from node is not keyed
	                    // since it is possible that a keyed node might match up with a node somewhere else in the
	                    // target tree and we don't want to discard it just yet since it still might find a
	                    // home in the final DOM tree. After everything is done we will remove any keyed nodes
	                    // that didn't find a home
	                    if (curFromNodeKey) {
	                        // Since the node is keyed it might be matched up later so we defer
	                        // the actual removal to later
	                        addKeyedRemoval(curFromNodeKey);
	                    } else {
	                        // NOTE: we skip nested keyed nodes from being removed since there is
	                        //       still a chance they will be matched up later
	                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
	                    }

	                    curFromNodeChild = fromNextSibling;
	                }

	                // If we got this far then we did not find a candidate match for
	                // our "to node" and we exhausted all of the children "from"
	                // nodes. Therefore, we will just append the current "to" node
	                // to the end
	                if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
	                    fromEl.appendChild(matchingFromEl);
	                    morphEl(matchingFromEl, curToNodeChild);
	                } else {
	                    var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
	                    if (onBeforeNodeAddedResult !== false) {
	                        if (onBeforeNodeAddedResult) {
	                            curToNodeChild = onBeforeNodeAddedResult;
	                        }

	                        if (curToNodeChild.actualize) {
	                            curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
	                        }
	                        fromEl.appendChild(curToNodeChild);
	                        handleNodeAdded(curToNodeChild);
	                    }
	                }

	                curToNodeChild = toNextSibling;
	                curFromNodeChild = fromNextSibling;
	            }

	            // We have processed all of the "to nodes". If curFromNodeChild is
	            // non-null then we still have some from nodes left over that need
	            // to be removed
	            while (curFromNodeChild) {
	                fromNextSibling = curFromNodeChild.nextSibling;
	                if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
	                    // Since the node is keyed it might be matched up later so we defer
	                    // the actual removal to later
	                    addKeyedRemoval(curFromNodeKey);
	                } else {
	                    // NOTE: we skip nested keyed nodes from being removed since there is
	                    //       still a chance they will be matched up later
	                    removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
	                }
	                curFromNodeChild = fromNextSibling;
	            }
	        }

	        var specialElHandler = specialElHandlers[fromEl.nodeName];
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
	        if (morphedNodeType === ELEMENT_NODE) {
	            if (toNodeType === ELEMENT_NODE) {
	                if (!compareNodeNames(fromNode, toNode)) {
	                    onNodeDiscarded(fromNode);
	                    morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
	                }
	            } else {
	                // Going from an element node to a text node
	                morphedNode = toNode;
	            }
	        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
	            if (toNodeType === morphedNodeType) {
	                morphedNode.nodeValue = toNode.nodeValue;
	                return morphedNode;
	            } else {
	                // Text node to something else
	                morphedNode = toNode;
	            }
	        }
	    }

	    if (morphedNode === toNode) {
	        // The "to node" was not compatible with the "from node" so we had to
	        // toss out the "from node" and use the "to node"
	        onNodeDiscarded(fromNode);
	    } else {
	        morphEl(morphedNode, toNode, childrenOnly);

	        // We now need to loop over any keyed nodes that might need to be
	        // removed. We only do the removal if we know that the keyed node
	        // never found a match. When a keyed node is matched up we remove
	        // it out of fromNodesLookup and we use fromNodesLookup to determine
	        // if a keyed node has been matched up or not
	        if (keyedRemovalList) {
	            for (var i=0, len=keyedRemovalList.length; i<len; i++) {
	                var elToRemove = fromNodesLookup[keyedRemovalList[i]];
	                if (elToRemove) {
	                    removeNode(elToRemove, elToRemove.parentNode, false);
	                }
	            }
	        }
	    }

	    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
	        if (morphedNode.actualize) {
	            morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
	        }
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	var scopedPolyFill = (function (doc, undefined) {

	    // check for support of scoped and certain option
	    var compat = (function () {
	        var check = doc.createElement('style')
	        , DOMStyle = 'undefined' !== typeof check.sheet ? 'sheet' : 'undefined' !== typeof check.getSheet ? 'getSheet' : 'styleSheet'
	        , scopeSupported = undefined !== check.scoped
	        , testSheet
	        , DOMRules
	        , testStyle
	        ;

	        // we need to append it to the DOM because the DOM element at least FF keeps NULL as a sheet utill appended
	        // and we can't check for the rules / cssRules and changeSelectorText untill we have that
	        doc.body.appendChild(check);
	        testSheet = check[DOMStyle];

	        // add a test styleRule to be able to test selectorText changing support
	        // IE doesn't allow inserting of '' as a styleRule
	        testSheet.addRule ? testSheet.addRule('c', 'blink') : testSheet.insertRule('c{}', 0);

	        // store the way to get to the list of rules
	        DOMRules = testSheet.rules ? 'rules' : 'cssRules';

	        // cache the test rule (its allways the first since we didn't add any other thing inside this <style>
	        testStyle = testSheet[DOMRules][0];

	        // try catch it to prevent IE from throwing errors
	        // can't check the read-only flag since IE just throws errors when setting it and Firefox won't allow setting it (and has no read-only flag
	        try {
	            testStyle.selectorText = 'd';
	        } catch (e) { }

	        // check if the selectorText has changed to the value we tried to set it to
	        // toLowerCase() it to account for browsers who change the text
	        var changeSelectorTextAllowed = 'd' === testStyle.selectorText.toLowerCase();

	        // remove the <style> to clean up
	        check.parentNode.removeChild(check);

	        // return the object with the appropriate flags
	        return {
	            scopeSupported: scopeSupported
	        , rules: DOMRules
	        , sheet: DOMStyle
	        , changeSelectorTextAllowed: changeSelectorTextAllowed
	        };
	    })();

	    // scope is supported? just return a function which returns "this" when scoped support is found to make it chainable for jQuery
	    if (compat.scopeSupported)
	        return function () { return this };

	    //window.console && console.log( "No support for <style scoped> found, commencing jumping through hoops in 3, 2, 1..." );

	    // this was called so we "scope" all the <style> nodes which need to be scoped now
	    var scopedSheets
	    , i
	    , idCounter = 0
	    ;

	    if (doc.querySelectorAll) {

	        scopedSheets = doc.querySelectorAll('style[scoped]');

	    } else {

	        var tempSheets = [], scopedAttr;
	        scopedSheets = doc.getElementsByTagName('style');
	        i = scopedSheets.length;

	        while (i--) {
	            scopedAttr = scopedSheets[i].getAttribute('scoped');

	            if ("scoped" === scopedAttr || "" === scopedAttr)
	                tempSheets.push(scopedSheets[i]);
	            // Array.prototype.apply doen't work in the browsers this is eecuted for so we have to use array.push()

	        }

	        scopedSheets = tempSheets;

	    }

	    i = scopedSheets.length;
	    while (i--)
	        scopeIt(scopedSheets[i]);

	    // make a function so we can return it to enable the "scoping" of other <styles> which are inserted later on for instance
	    function scopeIt(styleNode, jQueryItem) {

	        // catch the second argument if this was called via the $.each
	        if (jQueryItem)
	            styleNode = jQueryItem;

	        // check if we received a <style> node
	        // if not chcek if it's a jQuery object and go from there
	        // if no <style> and no jQuery? return to avoid errors
	        if (!styleNode.nodeName) {

	            if (!styleNode.jquery)
	                return;
	            else
	                return styleNode.each(scopeIt);

	        }

	        if ('STYLE' !== styleNode.nodeName)
	            return;

	        // init some vars
	        var parentSheet = styleNode[compat.sheet]
	        , allRules = parentSheet[compat.rules]
	        , par = styleNode.parentNode
	        , id = par.id || (par.id = 'coala_scoped_' + ++idCounter)
	        , glue = ''
	        , index = allRules.length || 0
	        , rule
	        ;

	        // get al the ids from the parents so we are as specific as possible
	        // if no ids are found we always have the id which is placed on the <style>'s parentNode
	        while (par) {

	            if (par.id)
	                //if id begins with a number, we have to apply css escaping
	                if (parseInt(par.id.slice(0, 1))) {
	                    glue = '#\\3' + par.id.slice(0, 1) + ' ' + par.id.slice(1) + ' ' + glue;
	                } else {
	                    glue = '#' + par.id + ' ' + glue;
	                }

	            par = par.parentNode;

	        }

	        // iterate over the collection from the end back to account for IE's inability to insert a styleRule at a certain point
	        // it can only add them to the end...
	        while (index--) {

	            rule = allRules[index];
	            processCssRules(rule, index);

	        }

	        //recursively process cssRules
	        function processCssRules(parentRule, index) {
	            var sheet = parentRule.cssRules ? parentRule : parentSheet
	            , allRules = parentRule.cssRules || [parentRule]
	            , i = allRules.length || 0
	            , ruleIndex = parentRule.cssRules ? i : index
	            , rule
	            , selector
	            , styleRule
	            ;

	            // iterate over the collection from the end back to account for IE's inability to insert a styleRule at a certain point
	            // it can only add them to the end...
	            while (i--) {

	                rule = allRules[i];
	                if (rule.selectorText) {

	                    selector = glue + ' ' + rule.selectorText.split(',').join(', ' + glue);

	                    // replace :root by the scoped element
	                    selector = selector.replace(/[\ ]+:root/gi, '');

	                    // we can just change the selectorText for this one
	                    if (compat.changeSelectorTextAllowed) {

	                        rule.selectorText = selector;

	                    } else {// or we need to remove the rule and add it back in if we cant edit the selectorText

	                        /*
	                         * IE only adds the normal rules to the array (no @imports, @page etc)
	                         * and also does not have a type attribute so we check if that exists and execute the old IE part if it doesn't
	                         * all other browsers have the type attribute to show the type
	                         *  1 : normal style rules  <---- use these ones
	                         *  2 : @charset
	                         *  3 : @import
	                         *  4 : @media
	                         *  5 : @font-face
	                         *  6 : @page rules
	                         *
	                         */
	                        if (!rule.type || 1 === rule.type) {

	                            styleRule = rule.style.cssText;
	                            // IE doesn't allow inserting of '' as a styleRule
	                            if (styleRule) {
	                                sheet.removeRule ? sheet.removeRule(ruleIndex) : sheet.deleteRule(ruleIndex);
	                                sheet.addRule ? sheet.addRule(selector, styleRule, ruleIndex) : sheet.insertRule(selector + '{' + styleRule + '}', ruleIndex);
	                            }
	                        }
	                    }
	                } else if (rule.cssRules) {
	                    processCssRules(rule, ruleIndex);
	                }
	            }
	            
	        }
	    }

	    // Expose it as a jQuery function for convenience
	    if (typeof jQuery === "function" && typeof jQuery.fn === "object") {
	        jQuery.fn.scopedPolyFill = function () {
	            return this.each(scopeIt);
	        }
	    }

	    return scopeIt;

	})(document);

/***/ }
/******/ ])
});
;