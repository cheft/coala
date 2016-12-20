function scoper(css, prefix) {
  var re = new RegExp('([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)', 'g')
  css = css.replace(re, function(g0, g1, g2) {
    if (g1.match(/^\s*(@media|@keyframes|to|from|@font-face)/)) {
      return g1 + g2
    }

    if (g1.match(/:scope/)) {
      g1 = g1.replace(/([^\s]*):scope/, function(h0, h1) {
        if (h1) return ' ' + h1
        return ' '
      })
    }

    g1 = g1.replace(/^(\s*)/, '$1' + prefix + ' ')
    return g1 + g2
  })
  return css
}

module.exports = function (dom, prefix) {
  if ('scoped' in document.createElement('style')) return
  var styles = dom.find('style[scoped]')
  if (styles.length === 0) return
  for (var i = 0; i < styles.length; i++) {
    styles[i].innerHTML = scoper(styles[i].innerHTML, prefix)
  }
}
