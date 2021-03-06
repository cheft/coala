(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Coala"] = factory();
	else
		root["Coala"] = factory();
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
	  Version: 1.0.0
	  Author: Cheft
	*/
	var Component = __webpack_require__(1)
	var observable = __webpack_require__(3)
	var Router = __webpack_require__(5)

	var coala = {
	  observable: observable,

	  mount: function(opts, el) {
	    return this.component(opts).mount(el)
	  },

	  component: function(opts) {
	    return new Component(opts)
	  },

	  router: function(opts) {
	    return new Router(opts).start()
	  }
	};

	observable(coala)
	module.exports = coala


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var morphdom = __webpack_require__(2)
	var observable = __webpack_require__(3)
	var scoped = __webpack_require__(4)

	function Component(opts) {
	  this.opts = opts || {}
	  this.listen = this.opts.listen || {}
	  this.handle = this.opts.handle || {}
	  observable(this)
	  this._mixin()
	  this._listenTo()
	  if ($.isFunction(opts.data)) {
	    var result = opts.data.call(this)
	    if (result && result.promise) {
	      this.promise = result
	      this.data = this.data || {}
	    } else {
	      this.data = result
	    }
	  } else {
	    this.data = $.extend(true, $.isArray(opts.data) ? [] : {}, opts.data)
	  }
	  this._initRefs()
	  this.trigger('init')
	}

	Component.prototype = {
	  _initRefs: function() {
	    if (!this.opts.refs) return
	    this.refs = {}
	    for (var p in this.opts.refs) {
	      var value = this.opts.refs[p]
	      var c = new Component(value.component)
	      if (value.data) c.data = $.extend($.isArray(value.data) ? [] : {}, value.component.data, value.data)
	      c.refOpts = value
	      c.parent = this
	      this.refs[p] = c
	    }
	  },

	  _bindEvents: function() {
	    if (!this.opts.events) return
	    for (var e in this.opts.events) {
	      var handleName = this.opts.events[e]
	      var index = e.indexOf(' ')
	      if (index === -1) throw 'The ' + handleName + ' event is not separated by whitespace.'
	      if (!this.handle[handleName]) throw 'The ' + handleName + ' handle is not defined.'
	      var selector = e.substr(index + 1, e.length)
	      this.el.on(e.substr(0, index), selector, $.proxy(this.handle[handleName], this))
	    }
	  },

	  _mixin: function() {
	    if (!this.opts.mixins) return
	    if (!$.isArray(this.opts.mixins)) this.opts.mixins = [this.opts.mixins]
	    $.extend.apply($, [true, this].concat(this.opts.mixins)) // 深拷贝
	  },

	  _listenTo: function() {
	    for (var l in this.listen) {
	      var fn = this.listen[l]
	      this.on(l, fn)
	    }
	  },

	  mount: function(el) {
	    var _this = this
	    if (this.promise) {
	      this.promise.done(function(resource) {
	        _this.data.resource = resource
	        _this._mount(el)
	        delete _this.promise
	      })
	    } else {
	      this._mount(el)
	    }
	    return this
	  },

	  _mount: function(el) {
	    this.trigger('update')
	    if (el) {
	      if (this.parent) {
	        this.es = this.parent.es + ' ' + el
	        this.el = this.parent.$(el)
	      } else {
	        this.es = el
	        this.el = $(el)
	      }
	    }
	    if (this.opts.tpl) {
	      var dom = this.el.clone()
	      dom.html(this.opts.tpl(this.data))
	      scoped(dom, this.es)
	      this.el.append(dom.html())
	      this._bindEvents()

	      for (var p in this.refs) {
	        var ref = this.refs[p]
	        ref.mount(ref.refOpts.el)
	      }
	    }
	    this.trigger('updated').trigger('mount')
	    return this
	  },

	  update: function(data) {
	    if (data) $.extend(this.data, data)
	    morphdom(this.el[0], this._update()[0], {
	      onBeforeElUpdated: function(fromEl) {
	        if (fromEl.tagName === 'STYLE') return false
	        return true
	      }
	    })
	    this._updated()
	    return this
	  },

	  _update: function() {
	    this.trigger('update')
	    if (!this.opts.tpl) return ''
	    var dom = this.el.clone()
	    dom.html(this.opts.tpl(this.data))
	    for (var p in this.refs) {
	      var r = this.refs[p]
	      dom.find(r.refOpts.el).html(r._update().html())
	    }
	    return dom
	  },

	  _updated: function() {
	    for (var p in this.refs) this.refs[p]._updated()
	    this.trigger('updated')
	  },

	  unmount: function() {
	    if (this.promise) this.promise.abort()
	    this._unmount()
	    if (this.el) this.el.empty().off()
	  },

	  _unmount: function() {
	    for (var p in this.refs) this.refs[p]._unmount()
	    this.trigger('unmount').off('*')
	  },

	  $: function(el) {
	    return this.el.find(el)
	  }
	}

	module.exports = Component


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
	            // Needed for IE. Apparently IE sets the placeholder as the
	            // node value and vise versa. This ignores an empty update.
	            if (newValue === '' && fromEl.firstChild.nodeValue === fromEl.placeholder) {
	                return;
	            }

	            fromEl.firstChild.nodeValue = newValue;
	        }
	    },
	    SELECT: function(fromEl, toEl) {
	        if (!hasAttributeNS(toEl, null, 'multiple')) {
	            var selectedIndex = -1;
	            var i = 0;
	            var curChild = toEl.firstChild;
	            while(curChild) {
	                var nodeName = curChild.nodeName;
	                if (nodeName && nodeName.toUpperCase() === 'OPTION') {
	                    if (hasAttributeNS(curChild, null, 'selected')) {
	                        selectedIndex = i;
	                        break;
	                    }
	                    i++;
	                }
	                curChild = curChild.nextSibling;
	            }

	            fromEl.selectedIndex = i;
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

	                                            fromNextSibling = curFromNodeChild.nextSibling;

	                                            if (curFromNodeKey) {
	                                                // Since the node is keyed it might be matched up later so we defer
	                                                // the actual removal to later
	                                                addKeyedRemoval(curFromNodeKey);
	                                            } else {
	                                                // NOTE: we skip nested keyed nodes from being removed since there is
	                                                //       still a chance they will be matched up later
	                                                removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
	                                            }

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
	  el = el || {}
	  var callbacks = {}

	  el.on = function(event, fn) {
	    if (typeof fn == 'function') (callbacks[event] = callbacks[event] || []).push(fn)
	    return el
	  }

	  el.off = function(event, fn) {
	    if (event == '*' && !fn) callbacks = {}
	    else {
	      if (fn) {
	        var arr = callbacks[event]
	        for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	          if (cb == fn) arr.splice(i--, 1)
	        }
	      } else delete callbacks[event]
	    }
	    return el
	  }

	  // only single event supported
	  el.one = function(event, fn) {
	    function on() {
	      el.off(event, on)
	      fn.apply(el, arguments)
	    }
	    return el.on(event, on)
	  }

	  el.trigger = function(event) {
	    // getting the arguments
	    var arglen = arguments.length - 1,
	      args = new Array(arglen),
	      fns,
	      fn,
	      i

	    for (i = 0; i < arglen; i++) {
	      args[i] = arguments[i + 1] // skip first argument
	    }

	    fns = [].slice.call(callbacks[event] || [], 0)

	    for (i = 0; fn = fns[i]; ++i) {
	      fn.apply(el, args)
	    }

	    if (callbacks['*'] && event != '*')
	      el.trigger.apply(el, ['*', event].concat(args))

	    return el
	  }

	  return el
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	function scoper(css, prefix) {
	  var re = new RegExp('([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)', 'g')
	  css = css.replace(re, function(g0, g1, g2) {
	    if (g1.match(/^\s*(@media|@keyframes|to|from|@font-face)/)) {
	      return g1 + g2
	    }

	    if (g1.match(/:scope/)) {
	      g1 = g1.replace(/([^\s]*):scope/, function(h0, h1) {
	        if (h1) return ' ' + h1
	        return ' '
	      })
	    }

	    g1 = g1.replace(/^(\s*)/, '$1' + prefix + ' ')
	    return g1 + g2
	  })
	  return css
	}

	module.exports = function (dom, prefix) {
	  if ('scoped' in document.createElement('style')) return
	  var styles = dom.find('style[scoped]')
	  if (styles.length === 0) return
	  for (var i = 0; i < styles.length; i++) {
	    styles[i].innerHTML = scoper(styles[i].innerHTML, prefix)
	  }
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	var _this,
	regexps = [
	  /[\-{}\[\]+?.,\\\^$|#\s]/g,
	  /\((.*?)\)/g,
	  /(\(\?)?:\w+/g,
	  /\*\w+/g
	],
	getRegExp = function(route) {
	  route = route.replace(regexps[0], '\\$&')
	    .replace(regexps[1], '(?:$1)?')
	    .replace(regexps[2], function(match, optional) {
	      return optional ? match : '([^/?]+)'
	    }).replace(regexps[3], '([^?]*?)')
	  return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$')
	},
	extractParams = function(route, fragment) {
	  var params = route.exec(fragment).slice(1)
	  var results = [], i
	  for (i = 0; i < params.length; i++) {
	    results.push(decodeURIComponent(params[i]) || null)
	  }
	  return results
	}

	function Router(opts) {
	  _this = this
	  this.opts = opts
	  this.routes = opts.routes
	  this._emit()
	}

	Router.prototype = {
	  _exec: function(path) {
	    for (var r in this.routes) {
	      var route = getRegExp(r)
	      if (!route.test(path)) {
	        continue
	      }
	      if (typeof this.routes[r] === 'function') {
	        this.routes[r].apply(this, extractParams(route, path))
	      } else {
	        var fn = this.opts[this.routes[r]]
	        fn ? fn.apply(this, extractParams(route, path)) : void 0
	      }
	    }
	  },

	  _emit: function(e) {
	    var path = location.href.split('#')[1] || '/'
	    _this._exec(path, e)
	  },

	  start: function() {
	    window.addEventListener ? window.addEventListener('hashchange', this._emit, false) : window.attachEvent('onhashchange', this._emit)
	    return this
	  },

	  stop: function() {
	    window.removeEventListener ? window.removeEventListener('hashchange', this._emit, false) : window.detachEvent('onhashchange', this._emit)
	    return this
	  },

	  go: function(path) {
	    location.hash = path
	    return this
	  },

	  back: function() {
	    history.back()
	    return this
	  },

	  add: function(route, fn) {
	    this.routes[route] = fn
	    return this
	  },

	  remove: function(route) {
	    delete this.routes[route]
	    return this
	  }
	}

	module.exports = Router


/***/ }
/******/ ])
});
;