module.exports = {
  counter: 0,
  uniqueId: function(prefix) {
    return (prefix || '') + (++this.counter);
  }
};
