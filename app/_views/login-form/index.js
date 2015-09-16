var View = require('../../../core/view');
var tpl = require('./view.html');

module.exports = new View({
  onInit: function() {
    this.tpl = tpl;
  },

  dispatcher: {
    '#js-submit&click': 'submit'
  },

  actions: {
    submit: function(e) {
      console.log(this, e);
    }
  }
});
