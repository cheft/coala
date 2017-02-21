var chai = require('chai')
var coala = require('../../core/coala')
var coala2 = require('../../core/coala')

var assert = chai.assert
var expect = chai.expect

describe('#coala functions', function() {
  it('have function', function() {
    expect(coala).to.have.any.keys('observable', 'mount', 'component', 'router')
    expect(coala).to.have.all.keys('observable', 'mount', 'component', 'router', 'on', 'off', 'trigger', 'one')
  })
})

describe('#coala', function() {
  it('single coala', function() {
    assert.equal(coala, coala2)
    coala.count = 1
    coala.on('counter', function(num) {
      this.count += num
    })
    coala2.trigger('counter', 2)
    assert.equal(coala2.count, 3)
  })
})
