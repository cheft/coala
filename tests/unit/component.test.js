var chai = require('chai')
var component = require('../../core/component')

var assert = chai.assert
var expect = chai.expect

describe('#component', function() {
  it('component to be a function', function() {
    expect(component).to.be.a('function')
  })
})
