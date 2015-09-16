var tpl = require('./view.html');

module.exports = {
  listen: {
    init: function() {
      this.tpl = tpl;
    },

    mount: function() {
      console.log(pwd);
    }
  },

  dispatcher: {
    'click #js-submit': 'submit'
  },

  actions: {
    submit: function(e) {
      console.log(this, e);
    }
  }
};
