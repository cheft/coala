var chai = require('chai')
var observable = require('../../core/observable')

var assert = chai.assert
var expect = chai.expect

describe('observable', function() {
  describe('#constructor()', function() {
    it('should return obj with one on trigger off function', function() {
      expect(observable()).to.have.all.keys('on', 'off', 'one', 'trigger')
    });
  });
});

describe('observable', function() {
  describe('#constructor(el)', function() {
    it('should return obj with one on trigger off function when el', function() {
      expect(observable({})).to.have.all.keys('on', 'off', 'one', 'trigger')
    });
  });
});

describe('observable', function() {
  describe('#constructor(el)', function() {
    it('el equal observable(el)', function() {
    	var el = {}
    	var newEl = observable(el)
      assert.equal(el, newEl)
    });
  });
});

describe('observable', function() {
  describe('#trigger event', function() {
    it('trigger on', function() {
    	var el = {}
    	observable(el)
      el.on('foo', function(info) {
     		assert.equal(info, 'bar')
      })
      el.trigger('foo', 'bar')
    });
  });
});

describe('observable', function() {
  describe('#trigger event', function() {
    it('trigger any on', function() {
    	var el = {}
    	observable(el)
      el.on('*', function(event, person1, person2) {
     		assert.equal(event, 'hit')
     		assert.equal(person1, 'zhangfei')
     		assert.equal(person2, 'guanyu')
      })
      el.trigger('hit', 'zhangfei', 'guanyu')
    });
  });
});

describe('observable', function() {
  describe('#trigger event', function() {
    it('trigger one', function() {
    	var el = {}
    	observable(el)
    	var count  = 0
      el.one('oneEvent', function(num) {
     		count += num
      })
      el.trigger('oneEvent', 1)
      el.trigger('oneEvent', 1)
      assert.notEqual(count, 2)
    });
  });
});

describe('observable', function() {
  describe('#trigger off event', function() {
    it('trigger off trigger', function() {
    	var el = {}
    	observable(el)
    	var count  = 0
      el.on('event1', function(num) {
     		count += num
      })
      el.trigger('event1', 1)
      el.off('event1')
      el.trigger('event1', 1)
      assert.notEqual(count, 2)
    });
  });
});

describe('observable', function() {
  describe('#trigger off event', function() {
    it('trigger off any trigger', function() {
    	var el = {}
    	observable(el)
    	var count  = 0
      el.on('event1', function(num) {
     		count += num
      })
      el.on('event2', function(num) {
     		count += num
      })
      el.off('*')
      el.trigger('event1', 1)
      el.trigger('event2', 2)
      assert.equal(count, 0)
    });
  });
});

describe('observable', function() {
  describe('#trigger special event', function() {
    it('trigger special event', function() {
    	var el = observable()
    	var count  = 0
      el.on('a:b', function(num) {
     		count += num
      })
      el.on('c/d', function(num) {
     		count += num
      })
      el.on('e f g', function(num) {
     		count += num
      })
      el.trigger('a:b', 1)
      el.trigger('c/d', 1)
      el.trigger('e f g', 1)
      assert.equal(count, 3)
    });
  });
});

