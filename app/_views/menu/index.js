var quite = require('../../../quite');
var tpl = require('./view.html');

module.exports = quite.view({
  listen: {
    init: function() {
      this.tpl = tpl;
      this.data = {menus: ['首页', '管理房源', '数据分析', '个人中心'] };
    }
  },

  dispatcher: {
    '.js-menu&click': 'test'
  },

  actions: {
    test: function(e) {
      console.log(e, this);
    }
  }
});
