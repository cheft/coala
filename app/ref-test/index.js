var coala = require('../../coala');
var c2 = require('./c2');
var c7 = require('./c7');
var tpl = require('./index.html');
require('./index.css');

coala.mount({
  tpl: tpl,

  refs: {
    c2: {
      component: c2,
      el: '#c2'
    },
    c7: {
      component: c7,
      el: '#c7'
    }
  }
}, '#app');

