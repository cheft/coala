var morphdom = require('morphdom');
var observable = require('./observable');
require('./scoped');

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
