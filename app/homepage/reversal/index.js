var reversal = require('../reversal');
var tpl = require('./index.html');

module.exports = {
  tpl: tpl,
  listen: {
    mount: function() {
      this.trigger('fill');
    },

    updated: function() {
    },

    fill: function() {
      this.data.items = [];
      for (var i = 0; i < 1000; i++) {
        this.data.items.push(i);
      }

      this.update();
    },

    reverse: function() {
      this.data.items = this.data.items.reverse();
      this.update();
    }
  },

  // events: {
  //   'click .line': 'clickline'
  // },

  handle: {
    clickline: function(e) {
      console.log(e.target.innerHTML);
    }
  },

  mixins: [{
    reverse: function() {
      this.data.items = this.data.items.reverse();
      this.update();
    }
  }]
};
