var View = require('../../../core/view');
var tpl = require('./view.html');

module.exports = new View({
  listen: {
    init: function() {
      this.tpl = tpl;
      this.data = {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'};
    }
  }
});
