var top = require('../top');
var tpl = require('./index.html');

module.exports = {
  listen: {
    init: function() {
      this.tpl = tpl;
      this.data = {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'};
    }
  },

  refs: {
    top: {
      el: '#content-top',
      component: top
    },
  }
};
