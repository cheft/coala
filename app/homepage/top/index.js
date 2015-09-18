var tpl = require('./index.html');

module.exports = {
  listen: {
    init: function() {
      // console.log(' init!');
      this.tpl = tpl;
      this.data = {name: 'Jake'};
    },

    mount: function() {
      // console.log(' mount!');
      // var _this = this;
      // $.ajax({
      //   url: 'http://localhost:3000/users/1',
      //   type: 'get'
      //   // async: false,
      // }).done(function(user) {
      //   console.log(_this);
      //   _this.update(user);
      // });
    },

    update: function() {
      // console.log(' update!');
    },

    updated: function() {
      // console.log(' updated!');
    },

    unmount: function() {
      console.log(' unmount');
    }
  },

  events: {
    'click .js-test': 'test'
  },

  handle: {
    test: function(e) {
      console.log(e, this);
    }
  }
};
