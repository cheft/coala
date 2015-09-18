var coala = require('../../coala');
var top = require('../homepage/top');
var form = require('./login-form');
var tpl = require('./index.html');

var login = {
  tpl: tpl,
  refs: {
    '#top': top,
    '#login': form
  }
};

coala.mount(login, '#app');
