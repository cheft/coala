var morphdom = require('morphdom');
var observable = require('./observable');
var scoped = require('./scoped');

function Component(opts) {
  this.opts = opts || {};
  observable(this);
  if ($.isFunction(opts.data)) {
    var result = opts.data.call(this);
    if (result && result.promise) {
      this.promise = result;
      this.data = {};
    } else {
      this.data = result;
    }
  } else {
    this.data = opts.data || {};
  }
  this._mixin();
  this._listenTo();
  this.trigger('init');
  this._initRefs();
}

Component.prototype._initRefs = function() {
  if (!this.opts.refs) return;
  this.refs = {}
  for (var p in this.opts.refs) {
    var value = this.opts.refs[p];
    if (value.data) value.component.data = $.extend(true, value.component.data, value.data);
    var c = new Component(value.component);
    c.refOpts = $.extend(true, {}, value);
    c.parent = this;
    this.refs[p] = c;
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
  $.extend.apply($, this.opts.mixins);
};

Component.prototype._listenTo = function() {
  if (!this.opts.listen) return;
  for (var l in this.opts.listen) {
    var fn = this.opts.listen[l];
    this.on(l, fn);
  }
};

Component.prototype.mount = function(el) {
  var _this = this
  this.trigger('update');
  if (this.promise) {
    this.promise.done(function(resource) {
      _this.data.resource = resource;
      _this._mount(el);
      delete _this.promise;
    })
  } else {
    this._mount(el);
  }
  
  return this;
};

Component.prototype._mount = function(el) {
  if (el) this.el = (el instanceof $) ? el : $(el)
  if (this.opts.tpl) {
    var dom = this.el.clone()
    dom.html(this.opts.tpl(this.data))
    scoped(dom, this.el.selector)
    this.el.append(dom.html());
    this._bindEvents();

    for (var p in this.refs) {
      var ref = this.refs[p]
      ref.mount(ref.refOpts.el)
    }
  }
  this.trigger('updated').trigger('mount');
  return this
}

Component.prototype.update = function(data) {
  if (data) $.extend(this.data, data);
  morphdom(this.el[0], this._update()[0], {
    onBeforeElUpdated: function(fromEl, toEl) {
      if (fromEl.tagName === 'STYLE') return false
      return true;
    }
  });
  this._updated();
  return this;
};

Component.prototype._update = function() {
  this.trigger('update');
  if (!this.opts.tpl) return '';
  var dom = this.el.clone()
  dom.html(this.opts.tpl(this.data))
  for (var p in this.refs) {
    var r = this.refs[p];
    dom.find(r.refOpts.el).html(r._update().html());
  }
  return dom
}

Component.prototype._updated = function() {
  for (var p in this.refs) this.refs[p]._updated()
  this.trigger('updated');
}

Component.prototype.unmount = function() {
  this.el.empty().off();
  this.trigger('unmount').off('*');
};

Component.prototype.$ = function(el) {
  return this.el.find(el);
};

module.exports = Component;
