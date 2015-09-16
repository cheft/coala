function Layout(opts) {
  this.el = opts.el;
  this.data = opts.data || {};
  this.tpl = opts.tpl;
  this.opts = opts;
  this.views = {};
}

Layout.prototype.mount = function(el) {
  this.el = el || this.el;
  this.el.html(this.template());
  this._mountViews();
};

Layout.prototype._mountViews = function() {
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

Layout.prototype.template = function() {
  return this.tpl(this.data);
};

module.exports = Layout;
