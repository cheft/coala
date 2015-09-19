var coala = require('../../coala');
var github = require('./github');
var githubDynamic = require('./github-dynamic');
var tpl = require('./index.html');

var mytodo = {
  tpl: tpl,
  refs: {
  	todo1: {
  	  component: github,
  	  el: '#todo1'
  	},
  	todo2: {
  	  component: githubDynamic,
  	  el: '#todo2'
  	}
  }
};

window.todo = coala.mount(mytodo, '#app');
