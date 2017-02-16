var coala = require('../../../coala')
var app = require('./index.html')
var cps = {
	'sale-list': require('./sale-list.html'),
	'sale-detail': require('./sale-detail.html'),
	'rent-list': require('./rent-list.html'),
	'rent-detail': require('./rent-detail.html')
}

coala.cr = coala.router({
	routes: {
		'/': function() {
			if (coala.cp) coala.cp.unmount()
			coala.cp = coala.mount(cps['sale-list'], '#app')
		},

		'/:name': function (name) {
			if (coala.cp) coala.cp.unmount()
			coala.cp = coala.mount(cps[name], '#app')
		},

		'/:name/:id': function (name, id) {
			if (coala.cp) coala.cp.unmount()
			cps[name].id = id
			coala.cp = coala.mount(cps[name], '#app')
		}
	}
})
