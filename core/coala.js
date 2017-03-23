/*
  Version: 1.0.0-beta.5
  Author: Cheft
*/
var Component = require('./component')
var observable = require('./observable')
var Router = require('./router')

var coala = {
  observable: observable,

  mount: function(opts, el) {
    return this.component(opts).mount(el)
  },

  component: function(opts) {
    return new Component(opts)
  },

  router: function(opts) {
    return new Router(opts).start()
  }
};

observable(coala)
module.exports = coala
