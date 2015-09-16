var quite = require('../../../quite');
var tpl = require('./view.html');

module.exports = {
  listen: {
    init: function() {
      console.log(' init!');
      this.tpl = tpl;
      this.data = {name: 'Jake'};
    },

    mount: function() {
      console.log(' mount!');
      var _this = this;
      $.ajax({
        url: 'http://localhost:3000/users/1',
        type: 'get',
        // async: false,
      }).done(function(user) {
        console.log(_this);
        _this.update(user);
      });
    },

    update: function() {
      console.log(' update!');
    },

    updated: function() {
      console.log(' updated!');
    }
  },

  dispatcher: {
    '.js-test&click': 'test'
  },

  actions: {
    test: function(e) {
      console.log(e, this);
    }
  }
};
