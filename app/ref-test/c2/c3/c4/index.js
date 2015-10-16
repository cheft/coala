var c5 = require('./c5');
var tpl = require('./index.html');

module.exports = {
  tpl: tpl,

  refs: {
    c5: {
      component: c5,
      el: '#c5'
    }
  }
};
