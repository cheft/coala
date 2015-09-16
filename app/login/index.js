var quite = require('../../quite');
var formView = require('../_views/login-form');
var tpl = require('./view.html');

var loginView = {
  tpl: tpl,
  views: {
    login: {
      el: '#login',
      view: formView
    }
  }
};

quite.mount(loginView, '#app');

