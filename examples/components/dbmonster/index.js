var coala = require('coala')
var perfMonitor = require('./test')
var tpl = require('./index.html')

// var opts = {
//   tpl: tpl,
//   data: ENV.generateData().toArray(),
//   listen: {
//   	updated: function() {
//   		var _this = this;
//   		setTimeout(function() {
//   			perfMonitor.startProfile('view update');
// 				_this.update(ENV.generateData().toArray());
// 				perfMonitor.endProfile('view update');
//   		}, ENV.timeout);
//   	},

//     mount: function() {
//       // this.redraw();
//     }
//   },
//   mixins: {
//     redraw: function() {
//       var _this = this
//       perfMonitor.startProfile('view update');
//       _this.update(ENV.generateData().toArray());
//       perfMonitor.endProfile('view update');
//       setTimeout(function() {
//         _this.redraw()
//       }, ENV.timeout);
//     }
//   }
// }

coala.mount(tpl, '#app');

perfMonitor.startFPSMonitor();
perfMonitor.startMemMonitor();
perfMonitor.initProfiler('view update');
