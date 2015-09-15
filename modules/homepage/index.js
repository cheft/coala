var $ = require('jquery');
var Layout = require('../../core/layout');
var topView = require('../../views/top');
var menuView = require('../../views/menu');
var contentView = require('../../views/content');
var tpl = require('./layout.dot');

var indexLayout = new Layout({
  tpl: tpl,
  views: {
    top: {
      view: topView,
      data: {name: '陈海峰'}
    },
    menu: {
      view: menuView
    },
    content: {
      view: contentView
    }
  }
});


var el = document.getElementById('app');
indexLayout.mount(el);

window.indexLayout = indexLayout;
