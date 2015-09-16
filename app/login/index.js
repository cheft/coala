var View = require('../../core/view');
var formView = require('../_views/login-form');
var tpl = require('./view.html');

var loginView = new View({
  tpl: tpl,
  views: {
    login: {
      view: formView
    }
  }
});

loginView.mount($('#app'));

