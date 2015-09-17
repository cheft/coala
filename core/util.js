module.exports = {
  counter: 0,
  uniqueId: function(prefix) {
    return (prefix || '') + (++this.counter);
  },

  isUndefined: function(obj) {
    return typeof obj == 'undefined';
  },

  isFunction: function(obj) {
    return typeof obj == 'function';
  }
};

