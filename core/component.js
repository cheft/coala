var morphdom = require('morphdom');
var observable = require('./observable');

function Component(opts) {
  observable(this);
  this.opts = opts || {};
  if ($.isFunction(opts.data)) {
    this.data = opts.data.call(this);
  } else {
    this.data = opts.data || {};
  }
  if (this.data.$url) {
    this.resource = $.get(this.data.$url);
    delete this.data.$url
  }

  this.refs = {};
  this._mixin();
  this._listenTo();
  this.trigger('init').trigger('update');
}

Component.prototype.mount = function(el, isUpdate) {
  var _this = this
  if (this.resource) {
    this.resource.done(function(resource) {
      _this.data.resource = resource;
      _this._render(el, isUpdate);
    })
    return this
  } else {
    return this._render(el, isUpdate);
  }
};

Component.prototype._render = function(el, isUpdate) {
  this._dom();
  this._initRefs(this);
  if (el) this.el = $(el);
  this.el.append(this.dom.children());
  if (!isUpdate) {
    this._bindEvents();
    this.trigger('updated').trigger('mount');
  }
  return this
}

Component.prototype.update = function(data) {
  if (data) this.data = $.extend(false, this.data, data);
  this.trigger('update');
  this._dom();
  this._initRefs(this, true);
  var newDom = this.el[0].cloneNode(false);
  newDom.innerHTML = this.dom.html();
  morphdom(this.el[0], newDom);
  return this.trigger('updated');
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

Component.prototype._initRefs = function(parent, isUpdate) {
  if (!this.opts.refs) return;
  for (var p in this.opts.refs) {
    var value = this.opts.refs[p];
    if (value.data) value.component.data = $.extend(true, value.component.data, value.data);
    var c = new Component(value.component);
    c.refOpts = $.extend(true, {}, value);
    c.parent = parent;
    this.refs[p] = c;
    c.el = parent.dom.find(value.el);
    c.mount(undefined, isUpdate);
  }
};

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
  var obj = $.extend.apply($, this.opts.mixins);
};

Component.prototype._listenTo = function() {
  if (!this.opts.listen) return;
  for (var l in this.opts.listen) {
    var fn = this.opts.listen[l];
    this.on(l, fn);
  }
};

module.exports = Component;
