var reversal = require('../reversal');
var tpl = require('./index.html');

module.exports = {
  listen: {
    init: function() {
      this.tpl = tpl;
      this.data = {name:'Jake', age:31, tt: '<div style="color:red">sdfsdf</div>'};
    }
  },

  refs: {
    reversal: {
      el: '#reversalArea',
      component: reversal
    },
  },

  events: {
    'click #reverse': 'reverse'
  },

  handle: {
    reverse: function() {
      this.refs.reversal.trigger('reverse');
    }
  }
};
