var morphdom = require('morphdom')
var observable = require('./observable')
var scoped = require('./scoped')

function Component(opts) {
  this.opts = opts || {}
  this.listen = this.opts.listen || {}
  this.handle = this.opts.handle || {}
  observable(this)
  if ($.isFunction(opts.data)) {
    var result = opts.data.call(this)
    if (result && result.promise) {
      this.promise = result
      this.data = this.data || {}
    } else {
      this.data = result
    }
  } else {
    this.data = $.extend(true, $.isArray(opts.data) ? [] : {}, opts.data);
  }
  this._mixin()
  this._listenTo()
  this.trigger('init')
  this._initRefs()
}

Component.prototype = {
  _initRefs: function() {
    if (!this.opts.refs) return
    this.refs = {}
    for (var p in this.opts.refs) {
      var value = this.opts.refs[p]
      var c = new Component(value.component)
      if (value.data) c.data = $.isArray(value.data) ? value.data : $.extend(false, value.component.data, value.data)
      c.refOpts = value
      c.parent = this
      this.refs[p] = c
    }
  },

  _bindEvents: function() {
    if (!this.opts.events) return
    for (var e in this.opts.events) {
      var handleName = this.opts.events[e]
      var index = e.indexOf(' ')
      if (index === -1) throw 'The ' + handleName + ' event is not separated by whitespace.'
      if (!this.handle[handleName]) throw 'The ' + handleName + ' handle is not defined.'
      var selector = e.substr(index + 1, e.length)
      this.el.on(e.substr(0, index), selector, $.proxy(this.handle[handleName], this))
    }
  },

  _mixin: function() {
    if (!this.opts.mixins) return
    if (!$.isArray(this.opts.mixins)) this.opts.mixins = [this.opts.mixins]
    this.opts.mixins.unshift(this)
    this.opts.mixins.unshift(true) // 深拷贝
    $.extend.apply($, this.opts.mixins)
  },

  _listenTo: function() {
    for (var l in this.listen) {
      var fn = this.listen[l]
      this.on(l, fn)
    }
  },

  mount: function(el) {
    var _this = this
    this.trigger('update')
    if (this.promise) {
      this.promise.done(function(resource) {
        _this.data.resource = resource
        _this._mount(el)
        delete _this.promise
      })
    } else {
      this._mount(el)
    }
    return this
  },

  _mount: function(el) {
    if (el) {
      if (this.parent) {
        this.es = this.parent.es + ' ' + el
        this.el = this.parent.$(el)
      } else {
        this.es = el
        this.el = $(el)
      }
    }
    if (this.opts.tpl) {
      var dom = this.el.clone()
      dom.html(this.opts.tpl(this.data))
      scoped(dom, this.es)
      this.el.append(dom.html())
      this._bindEvents()

      for (var p in this.refs) {
        var ref = this.refs[p]
        ref.mount(ref.refOpts.el)
      }
    }
    this.trigger('updated').trigger('mount')
    return this
  },

  update: function(data) {
    if (data) $.extend(this.data, data)
    morphdom(this.el[0], this._update()[0], {
      onBeforeElUpdated: function(fromEl) {
        if (fromEl.tagName === 'STYLE') return false
        return true
      }
    })
    this._updated()
    return this
  },

  _update: function() {
    this.trigger('update')
    if (!this.opts.tpl) return ''
    var dom = this.el.clone()
    dom.html(this.opts.tpl(this.data))
    for (var p in this.refs) {
      var r = this.refs[p]
      dom.find(r.refOpts.el).html(r._update().html())
    }
    return dom
  },

  _updated: function() {
    for (var p in this.refs) this.refs[p]._updated()
    this.trigger('updated')
  },

  unmount: function() {
    this._unmount()
    this.el.empty().off()
  },

  _unmount: function() {
    for (var p in this.refs) this.refs[p]._unmount()
    this.trigger('unmount').off('*')
  },

  $: function(el) {
    return this.el.find(el)
  }
}

module.exports = Component
