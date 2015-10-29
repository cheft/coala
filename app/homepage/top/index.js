var tpl = require('./index.html');

module.exports = {
  tpl: tpl,
  data: {name: 'Jake'},
  listen: {
    init: function() {
      console.log(' init!');
    },

    mount: function() {
      console.log(' mount!');
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
      console.log(' update!');
    },

    updated: function() {
      console.log(' updated!');
    },

    unmount: function() {
      console.log(' unmount');
    }
  },

  events: {
    'click .js-test': 'test',
    'keyup #name': 'inputName'
  },

  handle: {
    test: function(e) {
      alert(this);
    },

    inputName: function(e) {
      this.data.name = $(e.target).val();
      this.update();
    }
  }
};
