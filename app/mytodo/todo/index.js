var tpl = require('./view.html');

module.exports = {
  listen: {
    init: function() {
      // alert('初始化 ' + this.id);
      this.tpl = tpl;
      this.data = [
        {name: '做自己的前端框架', complete: true}
      ];
    },

    update: function() {
      // alert('正准备更新 ' + this.id);
    },

    updated: function() {
      // alert('已经更新 ' + this.id);
    },

    mount: function() {
      // alert('挂载 ' + this.id);
    },

    test: function(name) {
      alert(name + ' 任务已增加!');
    }
  },

  dispatcher: {
    'click #create': 'create',
    'click [id^=remove-]': 'remove',
    'click [id^=complete-]': 'toggle'
  },

  actions: {
    create: function(e) {
      var name = this.el.find('input[name="name"]').val();
      this.data.push({name: name, complete: false});
      this.update();
      this.trigger('test', name);
    },

    remove: function(e) {
      var id = e.target.id.split('-')[1];
      this.data.splice(id, 1);
      this.update();
    },

    toggle: function(e) {
      var id = e.target.id.split('-')[1];
      this.data[id].complete = !this.data[id].complete;
      this.update();
    }
  }
};
