var chai = require('chai')
var router = require('../../core/router')

var assert = chai.assert
var expect = chai.expect

describe('#router', function() {
  it('router to be a function', function() {
  	expect(router).to.be.a('function')
  })
})
