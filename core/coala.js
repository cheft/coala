/*
  Version: 0.0.1
  Author: Cheft
*/
var Component = require('./component');
var observable = require('./observable');

var coala = {
  observable: observable,

  mount: function(opts, el) {
    return new Component(opts).mount(el);
  },

  unmount: function(el) {
    // :TODO
  }
};

observable(coala);

module.exports = coala;
