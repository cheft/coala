var coala = require('../coala')
var app = coala.mount(require('./layout.html'), '#app')

var components = {
	index: require('./components/index.html'),
	guide: require('./components/guide.html'),
	api: require('./components/api.html'),
	examples: require('./components/examples.html'),
	librarys: require('./components/librarys.html')
};

coala.router({
	routes: {
		'/': function() {
			app.trigger('mountContent', components.index)
		},

		'/:name': function(name) {
			app.trigger('mountContent', components[name])
		}
	}
});

