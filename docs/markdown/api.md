# Coala 框架 API



## Observable 观察者

### coala.observable(el)

为 `el` 对象添加 `Observable` 支持，如果参数为空，则创建一个空的观察者对象，该对象同样拥有以下方法：

```javascript
// 使 person 成为 observable
var person = {id: 'cheft'}
coala.observable(person)

// 或者让 hero 成为 observable
var hero = coala.observable()
hero.name = '钢铁侠'
```
>  @返回值 参数对象 或新的observable 对象



### on(names, fn)

监听用空格分隔的 names 事件列表，每次事件被触发时调用 fn

```Javascript
var hero = coala.observable()

// 监听单个事件
hero.on('hit', function(param1, param2) {
// param1、param2 为调用时传递的参数
})

// 监听多个事件,事件类型将作为回调函数的参数传递
hero.on('hit fire', function(type) {
// type 是 'hit' 或 'fire'
})

// 监听此 observable 上的所有事件
hero.on('*', function(name) {
// name 为调用的事件名
})
```
>  @返回值 hero



### one(names, fn)

监听的由空格分隔的 names 事件， 但只会执行 fn 最多一次.

```javascript
var hero = coala.observable()

// 即使 'die' 被触发多次，也只执行回调函数一次
el.one('die', function() {

})
```
@返回值 hero

### off(names)
清除参数中指定的以空格分隔的 names 的事件

```javascript
el.off('hit')
el.off('hit fire')
el.off('*')
```
> @返回值 hero



### trigger(names, args...)

触发事件。执行所有监听由空格分隔的 names 的回调函数

```javascript
hero.trigger('hit', '坏人', '怪物')
hero.trigger('fire die')
```
@返回值 hero



## Router 路由器

浏览器 hash 地址变更，路由器会相应提供了的回调函数处理这个动作。需要注意的是，路由器开启后会在浏览器 URL后加 `/#` 符号，用户所配置的地址也会同样加上这个符号。



### 路由器配置

```javascript
coala.router({
	
  // 配置路由表，回调函数可以是动作键值，也可以是函数
  routes: {
    '/hello':                 'hello',      // #/help
    '/start/:component':      'start',      // #/start/todomvc
    '/goto/p:page':           'gotoPage'    // #/goto/p7
    '/show/*anything': function(anything) { // #/show/xx/xx
      ...
    }
  },

  hello: function() {
    ...
  },

  start: function(component) {
    ...
  },
    
  goto: function(page) {
    ...
  }

});
    
```



### 路由器对象方法

```javascript
var router = coala.router({
  ...
})

router.start()

router.add('/download/*path', function(path) {
	console.log(path === 'img/123.png')
})
  
router.go('/download/image/123.png')

```



#### start

启动路由器


#### stop

停止路由器


#### add(rule, callback)

增加一条路由规则


#### remove(rule)

删除匹配路山规则


#### go(path)

路转到指定路径


#### back

后退一步



## Component 组件配置



### tpl

组件模板函数，可以自己实现，也可以借助第三方模板编译，doT、artTemplate、marko 等

```javascript
// 自己实现模板函数
tpl: function(data) {
  return '<h1>' + data.name + '</h1>'
}

// doT 模板，借助 webpack 与 dot-loader 集成
tpl: require('./template.html')

// artTemplate 可以运行编译，也可以借助 webpack 预编译
tpl: function(data) {
  var source = '<h1>{{title}}</h1>'
  template.compile(source)(data)
}
```

>  @ 返回 html 片段，支持 scoped style



### data

组件数据，可以是对象、数组，也可以是函数，并且支持返回 Promise（$.Deferred） 对象

```javascript
// 支持对象、数组
data: [{title: '1234', desc: '1111'}, {title: '5678', desc: '2222'}]

// 支持函数
data: function() {
    var todos = []
    for (var i = 0; i < 10; i++) {
      todos.push('todo' + i)
    }
    return todos
}

// 支持 Ajax 异步获取数据再渲染，数据会绑定在 this.data.resource 属性上
data: function() {
    return $.get('http://localhost:3000/user')
}

// 自己返回 Promise（$.Deferred） 对象
data: function() {
    var promise = $.Deferred()
    setTimeout(function() {
      promise.resolve({name: 'cheft'})
    }, 1000)
    return promise
}
```



### listen 生命周期/事件监听

组件本身是 observable 的，listen 是 observable.on 的另一种形式，只是 init、update、updated、mount、unmount 为组件生命周期的事件，而其它事件，只要事件名不同于这些即可，所有的事件函数自动绑定 `this` 上下文到组件中，因此你可以访问数据，对属性和方法进行修改。

```Javascript
listen: {
  init: function() {
    this.customProperty = 'hello'
    this.one('other', function() {
      console.log('单次监听事件在这里绑定')
    })
    console.log('组件被实例化')
  },
    
  update: function() {
	this.data.price = this.data.price.toFixed(2)
   	console.log('组件即将更新')
  },
    
  updated: function() {
    this.$('#currentTime').html(new Date())
    console.log('组件已经更新')
  },
    
  mount: function() {
  	this.$('#select2').select2()
    console.log('组件已经挂载')
  },
  
  unmount: function() {
    delete this.customProperty
    $(body).off('click.select2')
    console.log('组件即将卸载')
  },
    
  [custom]: function(args) {
    console.log(args)
    console.log('组件自定义事件触发')
  }
}
```



#### 实例化 init

在组件实例化后触发，此函数一般对组件设置一个额外属性。

> Source



#### 更新前 update

在组件更新前触发，组件挂载时也会触发此函数，此函数一般作为数据转换。

> Source



#### 更新后 updated

在组件更新后触发，组件挂载后也会触发此函数，此函数用于需要在每次组件更新后都操作某些 dom。

> Source



#### 挂载后 mount

在组件挂载后触发，此函数用于组件初次挂载后操作某些 dom。

> Source



#### 卸载前 unmount

在组件卸载前触发，此函数用于消毁组件的一些数据或事件。



#### 自定义监听

名称不同于以上，在 this.trigger('custom', args) 调用时触发，自定义事件多用于组件之间相互通信，一般是给外部组件使用。

```Javascript
module.exports = {
  listen: {
    tellme: function(info) {
      console.log(info)
    }
  },
  
  refs: {
    comp2: {
      ...
    }
  }
}

comp2.parent.trigger('tellme', 'I was your child')
```



### refs 子组件配置

当前组件的子组件配置

```javascript
refs: {
  sexSelect: {
    component: require('./coala-select'),
    el: '#select-area1',
    data: {
      label: '性别'
      items: ['男', '女']
    }
    key: 'sex'
  },
    
  eduSelect: {
    component: require('./coala-select'),
    el: '#select-area1',
    data: {
      label: '学历'
      items: ['本科', '大专', '高中']
    }
    key: 'edu'
  }
},
  
listen: {
  mount: function() {
    // 访问组件
    this.refs.sexSelect              // coala-select Component
    this.refs.eduSelect.refOpts.key  // edu
  }
}
```



#### component

子组件的配置，跟当前组件的配置类似;



#### el

指定当前组件的某个 dom 节点的 jquery 选择器，表示子组件挂载于此 dom 节点上



#### data

指定子组件的数据，只能为静态数据，会以继承覆盖组件配置上的静态 `data`，如果子组件为异步数据，此配置无效。



#### 自定义属性

额外的一些属性，用于应用时作为区分，会绑定在组件的 refOpts 上


### 混合 mixins
mixins 同时支持数组和对象，将所有函数以继承到 this 组件下，也可以自己定义一些函数在此，一般用于内部使用。

```Javascript
// common.js
module.exports = {
  play: function() {
     this.status = 'play'
     console.log('music play ...')
  },
  
  stop: function() {
    this.status = 'stop'
    console.log('music stop ...')
  },
}

// music.js
mixins: [
  {
    showLrc: function() {

    }
  },
  require('./common.js')
],

events: {
  'click #toggerBtn': 'toggle'
},
  
handle: {
  toggle: function() {
    if (this.status === 'play') {
      this.stop()
    } else {
      this.play()
    }
  }
}

// 如果不需要混合其它对象，只提供自身或者关联对象使用， mixins 支持声明对象形式
mixins: {
  play: function()
  stop: function()
  next: function()
  prev: function()
  showLrc: function()
}

```



### Dom 事件 events

```Javascript
events: {
  'click #mybtn': 'test',
  'keypress #input': 'inputText',
  'click #menu > li > a': 'routeFn',
  'dblclick li[id^=item-*]': 'editItem'
}
```


### Dom 事件处理 handle

```Javascript
handle: {
  test: function(e) {
    console.log('btn clicked')
  },
    
  inputText: function(e) {
    console.log('input keypress ...')
  },
    
  routeFn: function(e) {
    console.log('menu route')
  },
    
  edit: function(e) {
    var id = e.currentTarget.id.split('-')[1]
    console.log('edit item\'s id is' + id)
  }
}
```



## Component 对象



### 配置属性 opts

获取到所有组件配置，实际上也可以修改这些配置，我们并没有做任何限制，但是不建议这样做。



### 数据 data

获取或修改组件数据，一般针对于静态数据修改，如果 data 是 function ，建议直接在 function 中处理。



### 节点 el

获取当前组件所挂载的 jquery 节点，不要修改。



### 父组件 parent

获取当前组件的父组件对象，如果有的话



### 子组件 refs

获取当前组件关联的子组件对象集，如果获取单个子组件，通过子组件名称获取，如: `this.refs.sexSelect`



### 子组件额外属性 refOpts

获取子组件的额外属性，如: `this.refs.sexSelect.refOpts.key`



### 组件 dom 节点查询 $(el)

相当于 `this.el.find(el)`，在当前组件 dom 下查询某些节点

> @返回值 查询到的 jquery 节点



### 组件实例化方法 Component(opts)

opts 为组件配置，一般只有最大的那个组件需要实例化，子组件都是框架负责，方法暴露在 coala 下，参考 coala 的 component 方法

> @返回值 组件实例



### 组件挂载方法 mount(el)

el 为 jquery 选择器，一般只有最大的那个组件需要挂载，子组件都是框架负责， 方法暴露在 coala 下，参考 coala 的 mount 方法

> @返回值 组件实例



### 组件更新方法 update(data)

当组件数据发生变化时，需要手动调用此方法对组件进行更新

```javascript
// 当数据变动大，需要将 this.data 覆盖，用这种方式比较简洁
this.update({label: '请选择你的爱好', items: ['男生', '女生']})

// 当某些属性，不需要将整个 data 覆盖，用这种方式
this.data.label = '请选择性别'
this.update()
```

> @返回值 组件实例



### 组件卸载方法 umount()

卸载当前组件，它的 dom 及所有事件都会被销毁



## Coala 框架对象

coala 对象本身也是 observable



### 创建组件 component(opts)

opts 为组件配置，coala.component 方法一般用于创建一些独立的组件，再手动设置组件的关系。

> @返回值 组件实例



### 挂载组件 mount(opts, el)

传入组件配置，及挂载的节点 jquery 选择器，框架会实例化并挂载

```javascript
var coala = require('coala');
var component = require('./todomvc');
coala.mount(component, $('body'));
```

> @返回值 组件实例



### 观察者方法 observable(obj)

为 `obj` 对象添加 `Observable` 支持，如果参数为空，则创建一个空的观察者对象

> @返回值 参数对象 或新的observable 对象



### 创建路由器 router(opts)

创建路由器，详细参考路由器

