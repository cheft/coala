function children(c, name) {
  if (c.refs[name]) {
    return c.refs[name];
  }

  for (var r in c.refs) {
    return children(c.refs[r], name);
  }
};

function root(c) {
  if (c.parent) {
    return root(c.parent);
  }

  return c;
};

function parent(c, deep) {
  var obj = c.parent;
  for (var i = 1; i < deep; i++) {
    if (!obj) {
      return;
    }

    obj = obj.parent;
  }

  return obj;
};

module.exports = function(c, exp) {
  var legalVar = /^[a-z|A-Z|_|$]/;
  var regExp = /(\^\d?|>|\/)/;
  exp = exp.replace(regExp, ' $1 ').substr(1);
  var arr = exp.split(/\s+/);
  for (var i = 0; i < arr.length; i++) {
    if (!c) {
      return;
    }

    if (arr[i] === '/') {
      c = root(c);
    }else if (arr[i] === '>') {
      if (arr[i + 1] && legalVar.test(arr[i + 1])) {
        c = c.refs[arr[i + 1]];
        i++;
      }else {
        continue;
      }
    }else if (arr[i].indexOf('^') !== -1) {
      var deep = 1;
      if (d = arr[i].substr(1)) {
        deep = parseInt(d);
      }

      c = parent(c, deep);
    }else if (legalVar.test(arr[i])) {
      if (!c.refs) {
        return;
      }

      c = children(c, arr[i]);
    }else {
      if (regExp.test(arr[i])) {
        continue;
      }else {
        return;
      }
    }
  }

  return c;
};

