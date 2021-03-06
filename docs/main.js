var coala = require('../coala')
var app = coala.mount(require('./layout.html'), '#app')

window.router = coala.router({
	routes: {
		'/:name': function(name) {
			app.trigger('mountContent', name)
		},
		'/': function() {
			app.trigger('mountContent', 'index')
		}
	}
})
