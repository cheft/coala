var quite = require('../../../quite');
var tpl = require('./view.html');
var topView = require('../top');

module.exports = quite.view({
  listen: {
    init: function() {
      this.tpl = tpl;
      this.data = {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'};
    }
  },

  views: {
    test: {
      el: '.layout-top',
      view: topView
    }
  }
});
