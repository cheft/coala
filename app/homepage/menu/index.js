var tpl = require('./index.html');

module.exports = {
  listen: {
    init: function() {
      this.tpl = tpl;
      this.data = {menus: ['首页', '管理房源', '数据分析', '个人中心'] };
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
