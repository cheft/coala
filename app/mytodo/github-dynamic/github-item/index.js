var tpl = require('./index.html');

module.exports = {
  tpl: tpl,
  listen: {
    updated: function() {
      // console.log(this.el.attr('id') + ' item updated');
    }
  },

  dispatcher: {
    'click [id^=img-]': 'test'
  },

  actions: {
    test: function() {
      this.data.name = 'Chefttttttttttttttt!';
      this.data.owner.avatar_url = 'https://avatars0.githubusercontent.com/u/1567209?v=3&amp;s=460';
      this.update();
    }
  }
};
