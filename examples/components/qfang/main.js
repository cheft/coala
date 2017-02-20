var coala = require('../../../coala')
var loading = require('./loading.html')

function asyncMount (component) {
	coala.cp = coala.mount(component, '#app')
	coala.cp.on('mount', function() {
		coala.cp.$('.loading').remove()
	})
}

var mount = function(name, id) {
	if (coala.cp) coala.cp.unmount()
	$('#app').html('<div class="loading">' + loading() + '</div>')
	switch(name) {
		case 'app':
			require.ensure([], function(require) {
				var component = require('./index.html')
				asyncMount(component)
			})
			break
		case 'sale-list': 
			require.ensure([], function(require) {
				var component = require('./sale-list.html')
				asyncMount(component)
			})
			break
		case 'sale-detail': 
			require.ensure([], function(require) {
			var component = require('./sale-detail.html')
				component.id = id
				asyncMount(component)
			})
			break
		case 'rent-list': 
			require.ensure([], function(require) {
				var component = require('./rent-list.html')
				asyncMount(component)
			})
			break
		case 'rent-detail': 
			require.ensure([], function(require) {
				var component = require('./rent-detail.html')
				component.id = id
				asyncMount(component)
			})
			break
	}
}

coala.cr = coala.router({
	routes: {
		'/': function() {
			mount('sale-list')
		},

		'/:name': function (name) {
			mount(name)
		},

		'/:name/:id': function (name, id) {
			mount(name, id)
		}
	}
})
