require('../../server');

var coala = require('../../coala');
var github = require('./github');
var tpl = require('./index.html');

var mytodo = {
  tpl: tpl,
  refs: {
    todo1: {
      component: github,
      el: '#todo1'
    }
  }
};

var html = coala.render(mytodo);
console.log(html);
