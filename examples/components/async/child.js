module.exports = {
  tpl: require('./child.html'),
  data: function() {
    var _this = this
    var promise = $.Deferred()
    setTimeout(function() {
      promise.resolve({name: 'HHHHHHHHHHHHH'})
    }, 1000)
    return promise.promise()
    // return $.get('http://localhost:3000/user')
  },
  listen: {
  	mount: function() {
  		console.log('child mount')
  	},

    update: function() {
      console.log('child update')
    },

  	updated: function() {
  		console.log('child updated')
  	}
  }
}
