var item = require('./github-item');
var tpl = require('./index.html');

module.exports = {
  tpl: tpl,
  listen: {
    mount: function() {
      this.trigger('fetch', 'react');
    },

    updated: function() {
      this.el.find('#search').focus();
    },

    fetch: function(keyword) {
      var _this = this;
      _this.opts.views = {};
      $.ajax({
        // url: 'https://api.github.com/search/repositories?q=' + keyword + '&sort=start',
        url: 'http://localhost:3000/github',
        type: 'get'
      }).done(function(data) {
        for (var i = 0; i < data.items.length; i++) {
          var v = {
            view: item,
            data: data.items[i],
            el: '#repositories',
            vid: 'item_' + data.items[i].id
          };
          _this.opts.views[v.vid] = v;
        }

        _this.update();
      });
    }
  },

  dispatcher: {
    'keypress #search': 'search'
  },

  actions: {
    search: function(e) {
      if (e.keyCode === 13) {
        this.trigger('fetch', e.target.value);
      }
    }
  }
};
