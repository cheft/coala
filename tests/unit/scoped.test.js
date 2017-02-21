var chai = require('chai')
var scoped = require('../../core/scoped')

var assert = chai.assert
var expect = chai.expect

describe('#scoped', function() {
  it('scoped to be a function', function() {
  	expect(scoped).to.be.a('function')
  })
})
