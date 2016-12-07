var _this,
regexps = [
  /[\-{}\[\]+?.,\\\^$|#\s]/g,
  /\((.*?)\)/g,
  /(\(\?)?:\w+/g,
  /\*\w+/g,
],
getRegExp = function(route) {
  route = route.replace(regexps[0], '\\$&')
    .replace(regexps[1], '(?:$1)?')
    .replace(regexps[2], function(match, optional) {
      return optional ? match : '([^/?]+)'
    }).replace(regexps[3], '([^?]*?)');
  return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
},
extractParams = function(route, fragment) {
  var params = route.exec(fragment).slice(1);
  var results = [],
    i;
  for (i = 0; i < params.length; i++) {
    results.push(decodeURIComponent(params[i]) || null);
  }
  return results;
};

function Router(opts) {
  _this = this
  this.opts = opts;
  this.routes = opts.routes;
  this.go(location.pathname);
}

Router.prototype._exec = function(path, e) {
  for (var r in this.routes) {
    var route = getRegExp(r);
    if (!route.test(path)) {
      continue;
    }
    if (typeof this.routes[r] === 'function') {
      this.routes[r].apply(this, extractParams(route, path));
    } else {
      var fn = this.opts[this.routes[r]];
      fn ? fn.apply(this, extractParams(route, path)) : void 0;
    }
  }
};

Router.prototype._emit = function(e) {
  var path = location.href.split('#')[1] || '';
  _this._exec(path, e);
}

Router.prototype.start = function() {
  window.addEventListener ? window.addEventListener('hashchange', this._emit, false) : window.attachEvent('onhashchange', this._emit);
  return this;
};

Router.prototype.stop = function() {
  window.removeEventListener ? window.removeEventListener('hashchange', this._emit, false) : window.detachEvent('onhashchange', this._emit);
};

Router.prototype.go = function(path) {
  location.hash = path;
  this._emit();
  return this;
};

Router.prototype.back = function() {
  history.back();
  return this;
};

Router.prototype.add = function(route, fn) {
  this.routes[route] = fn
  return this;
};

Router.prototype.remove = function(route) {
  delete this.routes[route]
  return this;
};

module.exports = Router;
