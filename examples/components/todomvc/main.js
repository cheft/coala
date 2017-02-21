var coala = require('../../../coala')
coala.todoMVC = coala.mount(require('./todo.html'), '#app')
coala.router({
	routes: {
		'/:status': function(status) {
			coala.todoMVC.trigger('filter', status)
		}
	}
})
