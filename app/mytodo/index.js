var coala = require('../../coala');
var github = require('./github');
var githubDynamic = require('./github-dynamic');
var tpl = require('./index.html');

var mytodo = {
  tpl: tpl,
  refs: {
    '#todo1': github,
    '#todo2': githubDynamic
  }
};

window.todo = coala.mount(mytodo, '#app');
