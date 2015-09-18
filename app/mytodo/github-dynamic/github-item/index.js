var tpl = require('./index.html');

module.exports = {
  tpl: tpl,
  listen: {
    updated: function() {
      // console.log(this.el.attr('id') + ' item updated');
    }
  },

  events: {
    'click [id^=img-]': 'test'
  },

  handle: {
    test: function() {
      this.data.name = 'Chefttttttttttttttt!';
      this.data.owner.avatar_url = 'https://avatars0.githubusercontent.com/u/1567209?v=3&amp;s=460';
      this.update();
    }
  }
};
