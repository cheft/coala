var tpl = require('./view.html');
var topView = require('../top');

module.exports = {
  listen: {
    init: function() {
      this.tpl = tpl;
      this.data = {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'};
    }
  },

  views: {
    test: {
      el: '#content-top',
      view: topView
    }
  }
};
