var View = require('../../../core/view');
var tpl = require('./view.html');

var data = {name: 'Jake'};

var view = new View({
  tpl: tpl,
  data: data,
  dispatcher: {
    '#js-test&click': 'test'
  },

  actions: {
    test: function(e) {
      console.log(e, this);
    }
  },

  onInit: function() {
    var _this = this;
    $.ajax({
      url: 'http://localhost:3000/users/1',
      type: 'get',
      // async: false,
    }).done(function(user) {
      _this.update(user);
    });
  },

  onUpdate: function() {
    console.log(this);
    console.log('top update!');
  }

  // dispatch
  // actions
  // 

});

module.exports = view;
