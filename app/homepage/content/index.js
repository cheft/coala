var reversal = require('../reversal');
var tpl = require('./index.html');

module.exports = {
  tpl: tpl,
  data: {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'},
  listen: {
    init: function() {
    }
  },

  refs: {
    reversal: {
      el: '#reversalArea',
      component: reversal
    }
  },

  events: {
    'click #reverse': 'reverse'
  },

  handle: {
    reverse: function() {
      var timeTaken = new Date().getTime();
      this.refs.reversal.reverse();
      this.$('#time').text('- Reversing took ' + (new Date().getTime() - timeTaken) + ' ms');
    }
  }
};
