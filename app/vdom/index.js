var coala = require('../../coala');
var test = require('./test');
var tpl = require('./index.html');

coala.mount({
  refs: {
    test1: test
  },
  tpl: tpl
}, '#app');
