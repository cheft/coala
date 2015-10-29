require('../../server');

var coala = require('../../coala');
var top = require('../homepage/top');
var form = require('./login-form');
var tpl = require('./index.html');

var login = {
  tpl: tpl,
  refs: {
    top: {
      component: top,
      el: '#top'
    },
    login: {
      component: form,
      el: '#login'
    }
  }
};

var html = coala.render(login);
console.log(html);
