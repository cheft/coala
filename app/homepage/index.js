var quite = require('../../quite');
var topView = require('../_views/top');
var menuView = require('../_views/menu');
var contentView = require('../_views/content');
var tpl = require('./view.html');

var indexView = quite.view({
  tpl: tpl,
  views: {
    top: {
      el: '.top',
      view: topView,
      data: {name: '陈海峰'}
    },
    menu: {
      el: '#menu',
      view: menuView
    },
    content: {
      el: '#content',
      view: contentView
    }
  }
});

indexView.mount('#app');

window.indexView = indexView;
