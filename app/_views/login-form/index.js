var quite = require('../../../quite');
var tpl = require('./view.html');

module.exports = quite.view({
  listen: {
    init: function() {
      this.tpl = tpl;
    }
  },

  dispatcher: {
    '#js-submit&click': 'submit'
  },

  actions: {
    submit: function(e) {
      console.log(this, e);
    }
  }
});
