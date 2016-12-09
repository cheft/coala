var store = require('./store')

module.exports = {
  tpl: require('./index.html'),
  refs: {
    footer: {
      el: '.info',
      component: require('./footer')
    }
  },
  data: {
    title: '待办项',
    todos: store.get('todos') || [],
    visibility: 'all',
    newTodo: '',
    editTodo: {},
    todoId: 0
  },

  listen: {
    update: function() {
      var _this = this
      this.data.allDone = true
      this.data.count = 0
      $.each(this.data.todos, function(i, item) {
        if (!item.completed) {
          _this.data.allDone = false
          _this.data.count++
        }
      })
      if (this.data.visibility === 'active') {
        this.data.viewTodos = $.grep(this.data.todos, function(item) {return !item.completed})
      } else if (this.data.visibility === 'completed') {
        this.data.viewTodos = $.grep(this.data.todos, function(item) {return item.completed})
      } else {
        this.data.viewTodos = this.data.todos
      }
    },

    updated: function() {
      var $editing = this.$('.editing .edit')
      if ($editing.length > 0) $editing[0].select()
      store.set('todos', this.data.todos)
    },

    filter: function(status) {
      this.data.visibility = status
      this.update()
    }
  },

  mixins: {
    getTodo: function (id) {
      var todo
      $.each(this.data.todos, function(i, item) {
        if (item.id == id) {
          todo = item
          return false
        }
      })
      return todo
    }
  },

  events: {
    'keydown .new-todo': 'addTodo',
    'click .destroy': 'removeTodo',
    'dblclick .todo label': 'toEditTodo',
    'keydown .edit': 'editTodo',
    'blur .edit': 'cancelEdit',
    'click .toggle': 'toggleTodo',
    'click .toggle-all': 'toggleAll',
    'click .clear-completed': 'clearCompleted'
  },

  handle: {
    addTodo: function(e) {
      this.data.newTodo = e.target.value
      if (e.keyCode !== 13 || !e.target.value) return
      this.data.todos.push({id: this.data.todoId++, title: e.target.value, completed: false})
      this.data.newTodo = ''
      this.update()
    },

    removeTodo: function(e) {
      var id = $(e.target).closest('li').attr('id')
      this.data.todos = $.grep(this.data.todos, function(item) {return item.id != id})
      this.update()
    },

    toEditTodo: function(e) {
      var $li = $(e.target).closest('li')
      if ($li.hasClass('completed')) return
      this.data.editTodo = this.getTodo($li.attr('id'))
      this.update()
    },

    editTodo: function(e) {
      if (e.keyCode !== 13) return
      var id = $(e.target).closest('li').attr('id')
      this.data.editTodo = {}
      this.getTodo(id).title = $(e.target).val()
      this.update()
    },

    cancelEdit: function() {
      $('.editing').removeClass('editing')
      this.data.editTodo = {}
    },

    toggleTodo: function(e) {
      var id = $(e.target).closest('li').attr('id')
      this.getTodo(id).completed = e.target.checked
      this.update()
    },

    toggleAll: function(e) {
      $.each(this.data.todos, function(i, todo) {
        todo.completed = e.target.checked
      })
      this.update()
    },

    clearCompleted: function() {
      this.data.todos = $.grep(this.data.todos, function(item) {return !item.completed})
      this.update()
    }
  }
}
