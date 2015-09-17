var View = require('./core/view');
var observable = require('./core/observable');

var quite = {
  observable: observable,

  mount: function(opts, el) {
    return this.view(opts).mount(el);
  },

  view: function(opts) {
    return new View(opts);
  }
};

observable(quite);

module.exports = quite;
