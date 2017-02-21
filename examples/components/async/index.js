module.exports = {
  tpl: require('./index.html'),
  data: function() {
    var _this = this
    var promise = $.Deferred()
    setTimeout(function() {
      promise.resolve({name: 'ChefTTTTTTTTT'})
    }, 1000)
    return promise.promise()
    // return $.get('http://localhost:3000/user')
  },
  refs: {
    child: {
      el: '#child',
      component: require('./child')
    }
  },

  listen: {
    mount: function() {
      console.log('main mount')
    },

    update: function() {
      console.log('main update')
    },

    updated: function() {
      console.log('main updated')
    }
  },
  events: {
    'click #test': 'test'
  },

  handle: {
    test: function(e) {
      this.refs.child.data.resource.name = new Date()
      this.update()
    }
  }
}
