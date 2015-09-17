var quite = require('../../quite');
var topView = require('../homepage/top');
var formView = require('./login-form');
var tpl = require('./view.html');

var loginView = {
  tpl: tpl,
  views: {
    top: {
      el: '#top',
      view: topView
    },
    login: {
      el: '#login',
      view: formView
    }
  }
};

quite.mount(loginView, '#app');

