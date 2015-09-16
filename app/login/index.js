var quite = require('../../quite');
var formView = require('../_views/login-form');
var tpl = require('./view.html');

var loginView = quite.view({
  tpl: tpl,
  views: {
    login: {
      el: '#login',
      view: formView
    }
  }
});

loginView.mount('#app');

