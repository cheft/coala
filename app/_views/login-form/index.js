var quite = require('../../../quite');
var tpl = require('./view.html');

module.exports = {
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
};
