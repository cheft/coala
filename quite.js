var counter = 0;
var quite = {
  uniqueId: function(prefix) {
    return (prefix || '') + (++counter);
  },

  mount: function(opts, el) {
    return this.view(opts).mount(el);
  },

  view: function(opts) {
    return new View(opts);
  }
};

function View(opts) {
  this.opts = opts;
  this.tpl = opts.tpl || {};
  this.el = opts.el ? $(opts.el) : undefined;
  this.data = opts.data || {};
  this.dispatcher = opts.dispatcher;
  this.listen = opts.listen || {};
  this.actions = opts.actions || {};
  this.parent = {};
  this.views = {};
  this._buildListener();
  this.id = quite.uniqueId('view');
  this.listen.init.call(this);
}

View.prototype.template = function() {
  return this.tpl(this.data);
};

View.prototype.mount = function(el) {
  this.el = el ? $(el) : this.el;
  this.update();
  this.listen.mount.call(this);
  return this;
};

View.prototype.update = function(data) {
  this.listen.update.call(this);
  this.data = data || this.data;
  this.el.html(this.template());
  this._mountViews(this);
  this._bindEvents();
  this.listen.updated.call(this);
};

View.prototype._mountViews = function(parent) {
  if (!this.opts.views) {
    return;
  }

  for (var p in this.opts.views) {
    var view = new View(this.opts.views[p].view);
    if (this.opts.views[p].data) {
      view.data = this.opts.views[p].data;
    }

    view.el = $(this.opts.views[p].el);
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

View.prototype._buildListener = function() {
  var listeners = ['init', 'mount', 'update', 'updated'];
  for (var i = 0; i < listeners.length; i++) {
    var l = listeners[i];
    this.listen[l] = this.listen[l] || function() {};
  };
};

module.exports = quite;
