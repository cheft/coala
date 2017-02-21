var morphdom = require('morphdom')

var perfMonitor = require('../dbmonster/test')

// doT
// var tpl = require('../dbmonster/index.html');

// js
var tpl = require('./render');

var app = document.getElementById('app');
app.innerHTML = tpl(ENV.generateData().toArray());

perfMonitor.startFPSMonitor();
perfMonitor.startMemMonitor();
perfMonitor.initProfiler('view update');

function redraw() {
  perfMonitor.startProfile('view update');

  // template
  // app.innerHTML = tpl(ENV.generateData().toArray());

  // morphdom
  morphdom(app, '<div id="app">' + tpl(ENV.generateData().toArray()) + '<div>');

  perfMonitor.endProfile('view update');
  setTimeout(redraw, ENV.timeout);
}

redraw();
