var c8 = require('./c8');
var tpl = require('./index.html');

module.exports = {
  tpl: tpl,

  refs: {
    c8: {
      component: c8,
      el: '#c8'
    }
  }
};
