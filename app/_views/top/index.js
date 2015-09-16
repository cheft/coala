var View = require('../../../core/view');
var tpl = require('./view.html');

var view = new View({
  listen: {
    init: function() {
      console.log(this, ' init!');
      this.tpl = tpl;
      this.data = {name: 'Jake'};
    },

    mount: function() {
      console.log(this, ' mount!');
      var _this = this;
      $.ajax({
        url: 'http://localhost:3000/users/1',
        type: 'get',
        // async: false,
      }).done(function(user) {
        _this.update(user);
      });
    },

    update: function() {
      console.log(this, ' update!');
    },

    updated: function() {
      console.log(this, ' updated!');
    }
  },

  dispatcher: {
    '#js-test&click': 'test'
  },

  actions: {
    test: function(e) {
      console.log(e, this);
    }
  }
});

module.exports = view;
