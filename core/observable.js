module.exports = function(el) {
  el = el || {}
  var callbacks = {}

  el.on = function(event, fn) {
    if (typeof fn == 'function') (callbacks[event] = callbacks[event] || []).push(fn)
    return el
  }

  el.off = function(event, fn) {
    if (event == '*' && !fn) callbacks = {}
    else {
      if (fn) {
        var arr = callbacks[event]
        for (var i = 0, cb; cb = arr && arr[i]; ++i) {
          if (cb == fn) arr.splice(i--, 1)
        }
      } else delete callbacks[event]
    }
    return el
  }

  // only single event supported
  el.one = function(event, fn) {
    function on() {
      el.off(event, on)
      fn.apply(el, arguments)
    }
    return el.on(event, on)
  }

  el.trigger = function(event) {
    // getting the arguments
    var arglen = arguments.length - 1,
      args = new Array(arglen),
      fns,
      fn,
      i

    for (i = 0; i < arglen; i++) {
      args[i] = arguments[i + 1] // skip first argument
    }

    fns = [].slice.call(callbacks[event] || [], 0)

    for (i = 0; fn = fns[i]; ++i) {
      fn.apply(el, args)
    }

    if (callbacks['*'] && event != '*')
      el.trigger.apply(el, ['*', event].concat(args))

    return el
  }

  return el
}
