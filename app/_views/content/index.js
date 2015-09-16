var View = require('../../../core/view');
var tpl = require('./view.html');

var data = {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'};

module.exports = new View({
  tpl: tpl,
  data: data
});
