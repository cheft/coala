var quite = require('../../../quite');
var tpl = require('./view.html');

module.exports = {
  listen: {
    init: function() {
      this.tpl = tpl;
      this.data = {menus: ['首页', '管理房源', '数据分析', '个人中心'] };
      console.log(this);
    }
  },

  dispatcher: {
    'click .js-menu': 'test'
  },

  actions: {
    test: function(e) {
      console.log(e, this);
    }
  }
};
