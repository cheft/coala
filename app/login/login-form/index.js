require('./index.css');
var tpl = require('./index.html');
var mixin = {
  test3: function() {
    console.log(this, 3333);
  }
};

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
      this.test();
    }
  },

  mixins: [{
    test: function() {
      console.log(this);
    }
  }, {
    test2: function() {
      console.log(this, 2222);
    }
  }, mixin]
};
