var c4 = require('./c4');
var tpl = require('./index.html');

module.exports = {
  tpl: tpl,

  refs: {
    c4: {
      component: c4,
      el: '#c4'
    }
  }
};
