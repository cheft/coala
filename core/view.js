function View(opts) {
  this.opts = opts;
  this.data = opts.data || {};
  this.events = opts.events;
  this._buildLifes();
  this.onInit.call(this);
}

View.prototype.template = function() {
  return this.opts.tpl(this.data);
};

View.prototype.mount = function() {
  this.update();
  this._bindEvents();
  this.onMount.call(this);
};

View.prototype.update = function(data) {
  this.onUpdate.call(this);
  this.data = data || this.data;
  document.getElementById(this.viewName).innerHTML = this.opts.tpl(this.data);
  this.onUpdated.call(this);
};

View.prototype._bindEvents = function() {
  if (!this.events) {
    return;
  }

  for (var e in this.events) {
    var evt = e.split(' ')[1];
    var emit = this.events[e];
    setTimeout(function() {
      var ele = document.getElementById(e.split(' ')[0]);
      ele.addEventListener ? ele.addEventListener(evt, emit, false) : ele.attachEvent('on' + evt, emit);
    }, 100);
  }
};

View.prototype._buildLifes = function() {
  var lifes = ['onInit', 'onMount', 'onUpdate', 'onUpdated'];
  for (var i = 0; i < lifes.length; i++) {
    var l = lifes[i];
    this[l] = this.opts[l] || function() {};
  };
};

module.exports = View;
