var View = require('../../core/view');
var tpl = require('./view.dot');

var data = {menus: ['首页', '管理房源', '数据分析', '个人中心'] };

module.exports = new View({
  tpl: tpl,
  data: data
});
