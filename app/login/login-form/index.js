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
    'click #js-submit': 'submit'
  },

  handle: {
    submit: function(e) {
      console.log(this, e);
    }
  }
};
