var tpl = require('./view.html');

module.exports = {
  listen: {
    init: function() {
      console.log('初始化 view' + this.id);
      this.tpl = tpl;
      this.data = [
        {name: '做自己的前端框架', complete: true}
      ];
    },

    update: function() {
      console.log('正准备更新 view' + this.id);
    },

    updated: function() {
      console.log('已经更新 view' + this.id);
    },

    mount: function() {
      console.log('挂载 view' + this.id);
    }
  },

  dispatcher: {
    'click #create': 'create',
    'click .remove': 'remove',
    'click .todo': 'toggle'
  },

  actions: {
    create: function(e) {
      var view = e.data.view;
      var name = view.el.find('input[name="name"]').val();
      view.data.push({name: name, complete: false});
      view.update();
    },

    remove: function(e) {
      var view = e.data.view;
      var id = e.target.id.split('-')[1];
      view.data.splice(id, 1);
      view.update();
    },

    toggle: function(e) {
      var view = e.data.view;
      var id = e.target.id.split('-')[1];
      view.data[id].complete = !view.data[id].complete;
      view.update();
    }
  }
};
