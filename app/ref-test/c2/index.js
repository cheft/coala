var c3 = require('./c3');
var c6 = require('./c6');
var tpl = require('./index.html');

module.exports = {
  tpl: tpl,

  refs: {
    c3: {
      component: c3,
      el: '#c3'
    },
    c6: {
      component: c6,
      el: '#c6'
    }
  }
};
