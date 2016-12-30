var chai = require('chai')
global.$ = require('../mock.jquery.js')
var Component = require('../../core/component')
var assert = chai.assert
var expect = chai.expect

describe('#component', function() {
  it('component to be a function', function() {
    expect(Component).to.be.a('function')
  })
})

describe('#component', function() {
  it('component array data test', function() {
  	var opts = {
  		data: [{name: 'cheft'}]
  	}

  	var c1 = new Component(opts)
  	var c2 = new Component(opts)
  	assert.notEqual(c1, c2)

  	c1.data[0].name = 'hello'
  	assert.notEqual(c1.data[0].name, c2.data[0].name)
  })
})

describe('#component', function() {
  it('component object data test', function() {
  	var opts = {
  		data: {name: 'cheft'}
  	}

  	var c1 = new Component(opts)
  	var c2 = new Component(opts)
  	assert.notEqual(c1, c2)

  	c1.data.name = 'hello'
  	assert.notEqual(c1.data.name, c2.data.name)
  })
})

describe('#component', function() {
  it('component refs array data test', function() {
  	var child = {
  		data: [{name: 'cheft'}]
  	}

  	var opts = {
  		refs: {
  			child1: {
  				el: '#tmp1',
  				component: child,
  				data: [{
  					name: 'hello'
  				}]
  			},

  			child2: {
  				el: '#tmp2',
  				component: child
  			}
  		}
  	}

  	var c = new Component(opts)
  	assert.notEqual(c.refs.child1, c.refs.child2)
  	assert.notEqual(c.refs.child1.data[0].name, c.refs.child2.data[0].name)
  })
})

describe('#component', function() {
  it('component refs object data test', function() {
  	var child = {
  		data: {name: 'cheft'},
  	}

  	var opts = {
  		refs: {
  			child1: {
  				el: '#tmp1',
  				component: child,
  				data: {
  					name: 'hello'
  				}
  			},

  			child2: {
  				el: '#tmp2',
  				component: child
  			}
  		}
  	}

  	var c = new Component(opts)
  	assert.notEqual(c.refs.child1, c.refs.child2)
  	assert.notEqual(c.refs.child1.data.name, c.refs.child2.data.name)
  })
})
