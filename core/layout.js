function Layout(opts) {
  this.data = opts.data || {};
  this.opts = opts;
  this.views = {};
}

Layout.prototype.mount = function(el) {
  var el = el || this.opts.el;
  el.innerHTML = this.template();
  this._mountViews();
};

Layout.prototype._mountViews = function() {
  for (var p in this.opts.views) {
    var view = this.opts.views[p].view;
    if (this.opts.views[p].data) {
      view.data = this.opts.views[p].data;
    }

    view.viewName = p;
    view.mount();
    this.views[p] = view;
  }
};

Layout.prototype.template = function() {
  return this.opts.tpl(this.data);
};

module.exports = Layout;
