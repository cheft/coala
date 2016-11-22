var morphdom = require('morphdom');
var observable = require('./observable');

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

Component.prototype.mount = function(el, isUpdate) {
  if (el) {
    this.el = $(el);
  }

  this.el.append(this.dom.children());
  if (!isUpdate) {
    this._bindEvents();
    this.trigger('updated').trigger('mount');
  }

  return this;
};

Component.prototype.update = function(data) {
  if (data) {
    this.data = $.extend(false, this.data, data);
  }
  this.trigger('update');
  this._dom();
  this._initRefs(this, true);
  var newDom = this.el[0].cloneNode(false);
  newDom.innerHTML = this.dom.html();
  morphdom(this.el[0], newDom, {
    onBeforeElUpdated: function(fromEl, toEl) {
      if (fromEl.tagName === 'TEXTAREA' || fromEl.tagName === 'INPUT') {
        toEl.checked = fromEl.checked;
        toEl.value = fromEl.value;
      } else if (fromEl.tagName === 'OPTION') {
        toEl.selected = fromEl.selected;
      }
    }
  });
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
  if (this.opts.tpl) {
    this.dom = $('<div>' + this.opts.tpl(this.data) + '</div>');
    return;
  }

  this.dom = $('<div></div>');
};

Component.prototype._initRefs = function(parent, isUpdate) {
  if (!this.opts.refs) {
    return;
  }

  for (var p in this.opts.refs) {
    var value = this.opts.refs[p];
    if (value.data) {
      value.component.data = $.extend(true, value.component.data, value.data);
    }

    var c = new Component(value.component);
    c.refOpts = $.extend(true, {}, value);
    c.parent = parent;
    this.refs[p] = c;
    c.el = parent.dom.find(value.el);
    c.mount(undefined, isUpdate);
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
