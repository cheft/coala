var View = require('./core/view');
var observable = require('./core/observable');

var quite = {
  observable: observable,

  mount: function(opts, el) {
    return new View(opts).mount(el);
  }
};

observable(quite);

module.exports = quite;
