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

    todo2: {
      el: '#todo2',
      view: todo
    },

    todo3: {
      el: '#todo3',
      view: todo
    },

    todo4: {
      el: '#todo4',
      view: todo
    }
  }
};

quite.mount(mytodo, '#app');
