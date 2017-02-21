var util = require('./util');
var observable = require('./observable');

function Component(opts) {
  this.opts = opts;
  this.tpl = opts.tpl || function() {};
  this.el = opts.el ? $(opts.el) : undefined;
  this.data = opts.data || {};
  this.data = $.extend($.isArray(opts.data) ? [] : {}, opts.data)
  this.listen = opts.listen || {};
  this.events = opts.events || {};
  this.handle = opts.handle || {};
  this.refs = {};
  this.id = util.uniqueId('component');
  observable(this);
  this._mixin(opts.mixins);
  this._listenTo();
}

Component.prototype.mount = function(el) {
  this.trigger('init');
  this.el = typeof el === 'string' ? $(el) : this.el;
  this.update();
  this.trigger('mount');
  return this;
};

Component.prototype.update = function(data) {
  this.data = data || this.data;
  this.trigger('update');
  var template = this._html();
  if (template) {
    this.el.off();
    if (this.rid) {
      var parentEl = this.el;
      this.el = $(template).attr('rid', this.rid);
      parentEl.append(this.el);
      delete this.rid;
    }else {
      if (this.el.attr('rid')) {
        this.el.empty().html($(template).html());
        return;
      }

      this.el.empty().html(template);
    }
  }

  this._bindEvents();
  this._mountRefs(this);
  this.trigger('updated');
};

Component.prototype.unmount = function() {
  this.trigger('unmount');
  this.off('*');
  this.el.empty().off();
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
    value.component.el = this.$(value.el);

    var c = new Component(value.component)
    if (value.data) c.data = $.isArray(value.data) ? value.data : $.extend(false, value.component.data, value.data)
    c.refOpts = value

    if (value.rid) {
      c.rid = value.rid;
      delete c.refOpts.rid;
    }

    c.parent = parent;
    this.refs[p] = c;
    c.mount(c.el);
  }
};

Component.prototype._bindEvents = function() {
  for (var e in this.events) {
    var handleName = this.events[e];
    var index = e.indexOf(' ');
    if (index === -1) throw 'The ' + handleName + ' event is not separated by whitespace.';
    if (!this.handle[handleName]) throw 'The ' + handleName + ' handle is not defined.';
    var selector = e.substr(index + 1, e.length);
    this.el.on(e.substr(0, index), selector, $.proxy(this.handle[handleName], this));
  }
};

Component.prototype._mixin = function(arr) {
  if (arr) {
    arr.unshift(false);
    var obj = $.extend.apply($, arr);
    for (var o in obj) {
      this[o] = obj[o];
    }
  }
};

Component.prototype._listenTo = function() {
  for (var l in this.listen) {
    var fn = this.listen[l];
    this.on(l, fn);
  }
};

module.exports = Component;
