var util = require('./util');
var observable = require('./observable');

function Component(opts) {
  this.opts = opts;
  this.tpl = opts.tpl || {};
  this.el = opts.el ? $(opts.el) : undefined;
  this.data = opts.data || {};
  this.on = opts.on || {};
  this.events = opts.events || {};
  this.handle = opts.handle || {};
  this.refs = {};
  this.id = util.uniqueId('component');

  observable(this);
  this._listen();
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
    var $html = $(html).attr('rid', this.rid);
    parentEl.append($html[0].outerHTML);
    this.el = parentEl.find('[rid=' + this.rid + ']');
    delete this.rid;
  }else {
    this.el.empty().html(this._html());
  }

  this._mountRefs(this);
  this._bindEvents();
  this.trigger('updated');
};

Component.prototype._html = function() {
  return this.tpl(this.data);
};

Component.prototype._mountRefs = function(parent) {
  if (!this.opts.refs) {
    return;
  }

  for (var p in this.opts.refs) {
    var component;
    var value = this.opts.refs[p];
    if (value.component) {
      var component = new Component(value.component);
      if (value.data) {
        component.data = value.data;
      }

      if (value.rid) {
        component.rid = value.rid;
      }

      component.el = $(value.el);
    }else {
      component = new Component(value);
      component.el = $(p);
    }

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

Component.prototype._listen = function() {
  for (var l in this.on) {
    var fn = this.on[l];
    this.on(l, fn);
  }
};

module.exports = Component;
