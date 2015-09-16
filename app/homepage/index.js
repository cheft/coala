var quite = require('../../quite');
var topView = require('../_views/top');
var menuView = require('../_views/menu');
var contentView = require('../_views/content');
var tpl = require('./view.html');

var indexView = {
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
};

window.indexView = quite.mount(indexView, '#app');
