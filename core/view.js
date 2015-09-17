var util = require('./util');
var observable = require('./observable');

function View(opts) {
  this.opts = opts;
  this.tpl = opts.tpl || {};
  this.el = opts.el ? $(opts.el) : undefined;
  this.data = opts.data || {};
  this.listen = opts.listen || {};
  this.dispatcher = opts.dispatcher;
  this.actions = opts.actions || {};
  this.parent = {};
  this.views = {};
  this.id = util.uniqueId('view');

  observable(this);
  this._listenTo();
  this.trigger('init');
}

View.prototype.template = function() {
  return this.tpl(this.data);
};

View.prototype.mount = function(el) {
  this.el = el ? $(el) : this.el;
  this.update();
  this.trigger('mount');
  return this;
};

View.prototype.update = function(data) {
  this.trigger('update');
  this.data = data || this.data;
  this.el.html(this.template());
  this._mountViews(this);
  this._bindEvents();
  this.trigger('updated');
};

View.prototype._mountViews = function(parent) {
  if (!this.opts.views) {
    return;
  }

  for (var p in this.opts.views) {
    var view;
    var value = this.opts.views[p];
    if (value.view) {
      var view = new View(value.view);
      if (value.data) {
        view.data = value.data;
      }

      view.el = $(value.el);
    }else {
      view = new View(value);
      view.el = $(p);
    }

    view.parent = parent;
    view.mount();
    this.views[p] = view;
  }
};

View.prototype._bindEvents = function() {
  if (!this.dispatcher) {
    return;
  }

  for (var e in this.dispatcher) {
    var actionName = this.dispatcher[e];
    var $el = this.el.find(e.split(' ')[1]);
    $el.on(e.split(' ')[0], $.proxy(this.actions[actionName], this));
  }
};

View.prototype._listenTo = function() {
  for (var l in this.listen) {
    var fn = this.listen[l];
    this.on(l, fn);
  }
};

module.exports = View;
