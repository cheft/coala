function View(opts) {
  this.opts = opts;
  this.tpl = opts.tpl || {};
  this.el = opts.el;
  this.data = opts.data || {};
  this.dispatcher = opts.dispatcher;
  this.actions = opts.actions || {};
  this.parent = {};
  this.views = {};
  this._listen();
  this.onInit.call(this);
}

View.prototype.template = function() {
  return this.tpl(this.data);
};

View.prototype.mount = function(el) {
  this.el = el || this.el;
  this.update();
  this._mountViews();
  this.onMount.call(this);
};

View.prototype.update = function(data) {
  this.onUpdate.call(this);
  this.data = data || this.data;
  this.el.html(this.template());
  this._bindEvents();
  this.onUpdated.call(this);
};

View.prototype._mountViews = function() {
  if (!this.opts.views) {
    return;
  }

  for (var p in this.opts.views) {
    var view = this.opts.views[p].view;
    if (this.opts.views[p].data) {
      view.data = this.opts.views[p].data;
    }

    view.viewName = p;
    view.mount($('#' + p));
    this.views[p] = view;
  }
};

View.prototype._bindEvents = function() {
  if (!this.dispatcher) {
    return;
  }

  for (var e in this.dispatcher) {
    var actionName = this.dispatcher[e];
    var $el = $(e.split('&')[0]);
    $el.on(e.split('&')[1], this.actions[actionName]);
  }
};

View.prototype._listen = function() {
  var lifes = ['onInit', 'onMount', 'onUpdate', 'onUpdated'];
  for (var i = 0; i < lifes.length; i++) {
    var l = lifes[i];
    this[l] = this.opts[l] || function() {};
  };
};

module.exports = View;
