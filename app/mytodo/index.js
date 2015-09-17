var quite = require('../../quite');
var github = require('./github');
var githubDynamic = require('./github-dynamic');
var tpl = require('./view.html');

var mytodo = {
  tpl: tpl,
  views: {
    '#todo1': github,
    '#todo2': githubDynamic
  }
};

window.todo = quite.mount(mytodo, '#app');
