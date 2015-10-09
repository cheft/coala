require('./index.css');
var tpl = require('./index.html');

module.exports = {
  listen: {
    init: function() {
      this.tpl = tpl;
    },

    mount: function() {

    }
  },

  events: {
    'click #js-submit': 'submit',
    'focus .login-form input': 'focus'
  },

  handle: {
    submit: function(e) {
      console.log(this, e);
    },

    focus: function(e) {
      console.log(e.target + ' focus.');
    }
  }
};
