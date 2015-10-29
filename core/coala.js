/*
  Version: 0.1.0
  Author: Cheft
*/
var Component = require('./component');
var observable = require('./observable');

var coala = {
  observable: observable,

  mount: function(opts, el) {
    return this.component(opts).mount(el);
  },

  render: function(opts) {
    return this.mount(opts, '<div>').dom.html();
  },

  unmount: function(component) {
    component.unmount();
  },

  component: function(opts) {
    return new Component(opts);
  }
};

observable(coala);

module.exports = coala;
