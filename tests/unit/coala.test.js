var chai = require('chai')
var coala = require('../../core/coala')

var assert = chai.assert
var expect = chai.expect

describe('observable', function() {
  describe('#constructor()', function() {
    it('have observable mount component router function', function() {
      expect(coala).to.have.any.keys('observable', 'mount', 'component', 'router')
    });
  });
});

describe('observable', function() {
  describe('#constructor()', function() {
    it('have many function', function() {
      expect(coala).to.have.all.keys('observable', 'mount', 'component', 'router', 'on', 'off', 'trigger', 'one')
    });
  });
});
