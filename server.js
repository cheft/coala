var fs = require('fs');
var dot = require('dot');
var _ = require('lodash');
root.$ = require('cheerio');

root.$.extend = function() {
  var args, current, tmpTarget, options, name, src, copy, copyIsArray, clone,
  target = arguments[0] || {},
  stack = [],
  i = 1,
  length = arguments.length,
  deep = false;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};

    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !_.isFunction(target)) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if (length === i) {
    target = this;
    --i;
  }

  args = Array.prototype.slice.call(arguments, i);
  stack.push(args.shift());
  tmpTarget = target;
  while (stack.length) {
    current = stack.pop();
    if (typeof current !== 'undefined') {
      for (var prop in current) {
        src = tmpTarget[ prop ];
        copy = current[ prop ];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            tmpTarget[name] = src && isArray(src) ? src : [];
          } else {
            tmpTarget[name] = src && isPlainObject(src) ? src : {};
          }

          stack.push(copy);
          tmpTarget = tmpTarget[name];

        // Don't bring in undefined values
        } else if (typeof copy !== 'undefined') {
          tmpTarget[ name ] = copy;
          continue;
        }
      }
    }

    if (args.length && stack.length == 0) stack.push(args.shift());
  }

  // Return the modified object
  return target;
};

require.extensions['.html'] = function(module, filename) {
  var src = dot.compile(fs.readFileSync(filename, 'utf8'));
  module._compile('module.exports = ' + src, filename);
};

require.extensions['.css'] = function(module, filename) {
  module._compile('module.exports = {}', filename);
};
