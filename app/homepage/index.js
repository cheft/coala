var View = require('../../core/view');
var topView = require('../_views/top');
var menuView = require('../_views/menu');
var contentView = require('../_views/content');
var tpl = require('./view.html');

var indexView = new View({
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

indexView.mount($('#app'));

window.indexView = indexView;
