var coala = require('../../coala');
var top = require('../homepage/top');
var form = require('./login-form');
var empty = require('./empty');
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
  	},
    empty: {
      component: empty,
      el: '#empty'
    }
  }
};

window.app = coala.mount(login, '#app');
