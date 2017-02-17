var coala = require('../../../coala')
// var app = require('./index.html')
var loading = require('./loading.html')
var cps = {
	'sale-list': require('./sale-list.html'),
	'sale-detail': require('./sale-detail.html'),
	// 'rent-list': require('./rent-list.html'),
	// 'rent-detail': require('./rent-detail.html')
}

var mount = function(component) {
	if (coala.cp) coala.cp.unmount()
	$('#app').html('<div class="loading">' + loading() + '</div>')
	coala.cp = coala.mount(component, '#app')
	coala.cp.on('mount', function() {
		coala.cp.$('.loading').remove()
	})
}

coala.cr = coala.router({
	routes: {
		'/': function() {
			mount(cps['sale-list'])
		},

		'/:name': function (name) {
			mount(cps[name])
		},

		'/:name/:id': function (name, id) {
			cps[name].id = id
			mount(cps[name])
		}
	}
})
