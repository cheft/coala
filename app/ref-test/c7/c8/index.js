var tpl = require('./index.html');

module.exports = {
  tpl: tpl,

  listen: {
    mount: function() {
      this.testRef();
      this.test();
    }
  },

  mixins: [{
      testRef: function() {
        var x = new Date().getTime();
        for (var i = 0; i < 100000; i++) {
          // var c5 = this.ref('^2 > c2 > c3 >c4> c5');
          var c5 = this.ref('/c5');
          // console.log(c5);
        }

        console.log('testRef: ' + (new Date().getTime() - x) + ' ms');
      }
    },

    {
      test: function() {
        var x = new Date().getTime();
        for (var i = 0; i < 1000000; i++) {
          var c5 = this.parent.parent.refs.c2.refs.c3.refs.c4.refs.c5;
          // console.log(c5);
        }

        console.log('test: ' + (new Date().getTime() - x) + ' ms');
      }
    }
  ]
};
