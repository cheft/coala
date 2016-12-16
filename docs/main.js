var coala = require('../coala')
var app = coala.mount(require('./layout.html'), '#app')

coala.router({
	routes: {
		'/:name': function(name) {
			app.trigger('mountContent', name)
		},
		'/': function() {
			app.trigger('mountContent', 'guide')
		}
	}
})
