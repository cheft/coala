var quite = require('../../quite');
var todo = require('./todo');
var tpl = require('./view.html');

var mytodo = {
  tpl: tpl,
  views: {
    todo1: {
      el: '#todo1',
      view: todo
    },
    '#todo2': todo,
    '#todo3': todo,
    '#todo4': todo
  }
};

quite.mount(mytodo, '#app');
