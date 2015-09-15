var $ = require('jquery');
var View = require('../../core/view');
var tpl = require('./view.dot');

var data = {name: 'Jake'};

var view = new View({
  tpl: tpl,
  data: data,
  events: {
    'js-test click': function(e) {
      console.log('click', e);
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
});

module.exports = view;
