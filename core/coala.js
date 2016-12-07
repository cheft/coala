/*
  Version: 1.0.0-beta
  Author: Cheft
*/
var Component = require('./component');
var observable = require('./observable');
var Router = require('./router');

var coala = {
  observable: observable,

  mount: function(opts, el) {
    return this.component(opts).mount(el);
  },

  component: function(opts) {
    return new Component(opts);
  },

  router: function(opts) {
    return new Router(opts).start();
  },

  // :TODO 异步数据有问题，需单独实现服务端Component
  // render: function(opts) {
  //   var node = $('<div>');
  //   this.mount(opts, node);
  //   return node.html();
  // }
};

observable(coala);
module.exports = coala;
