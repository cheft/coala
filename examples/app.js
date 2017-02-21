var coala = require('../coala')
var hello = require('./components/hello.html')

var components = {
	hello: require('./components/hello.html'),
	todomvc: require('./components/todomvc'),
	scoped: require('./components/scoped'),
	async: require('./components/async'),
};

coala.router({
	routes: {
		'/': function() {
			this.go('/hello');
		},

		'/:name': function(name) {
			if (!components[name]) return;
			if (coala.currentComponent) coala.currentComponent.unmount();
			coala.currentComponent = coala.mount(components[name], '#app');
		},

		'/todomvc/:status': function(status) {
			coala.currentComponent.trigger('filter', status)
		}
	}
});
