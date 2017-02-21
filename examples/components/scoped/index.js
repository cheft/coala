module.exports = {
  tpl: require('./index.html'),
  data: {
    resource: {name: 'cheft11111'}
  },
  
  refs: {
    child: {
      el: '#child',
      component: require('./child')
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
