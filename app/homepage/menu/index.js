var tpl = require('./index.html');

module.exports = {
  tpl: tpl,
  data: {menus: ['首页', '管理房源', '数据分析', '个人中心'] },
  listen: {
    init: function() {

    }
  },

  evnet: {
    'click .js-menu': 'test'
  },

  handle: {
    test: function(e) {
      alert(this);
    }
  }
};
