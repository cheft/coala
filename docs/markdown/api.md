## Observable 观察者

### coala.observable(el)

为 `el` 对象添加 `observable` 支持，如果参数为空，则创建一个观察者对象，该对象就可以触发和监听事件了

```javascript
// 使 person 成为 observable
var person = {id: 'cheft'}
coala.observable(person)
person.on('hello', function() {})
person.trigger('hello')

// 或者创建 hero 对象
var hero = coala.observable()
hero.name = '钢铁侠'
hero.on('hit', function() {})
hero.trigger('hit')
```
>  @返回值 参数对象或新的 observable 对象

#### 观察者四个方法 (on、trigger、one、off)

### on(event, fn)

监听 event 事件，事件被触发 (trigger) 时调用 fn

```Javascript
var hero = coala.observable()

// 监听单个事件
hero.on('hit', function(param1, param2) {
// param1、param2 为调用时传递的参数
})

// 监听 hero 上的所有事件
hero.on('*', function(event, param1, param2) {
// event 为调用的事件名，param1、param2 为调用时传递的参数
})
```
> @返回值 hero


### trigger(event, arg1 … argN)
触发事件；执行所有监听 event 的回调函数，可以传递任意数量的附加参数给监听器

```javascript
// hero 监听的 `hit、* ` 事件回调都会被调用
hero.trigger('hit', '坏人', '怪物')
```
> @返回值 hero


### off(event)
清除关闭参数中指定的 event 事件，则该事件再被 trigger 时不会被调用

```javascript
hero.off('hit')
hero.off('*')  // 清除 hero 上所有监听事件
```
> @返回值 hero


### one(event, fn)

监听 event 事件， 但只会执行 fn 最多一次，之后被 off 掉

```javascript
// 即使 'die' 被触发多次，也只执行回调函数一次
hero.one('die', function(param) {

})
```
> @返回值 hero


## Router 路由器
Coala 路由器是一个最小化的路由器实现，只会对 hash 地址的变更作出响应，当浏览器 URL(hash) 地址变化时，后执行相应的回调函数。它支持一些通配符，`:`  `*` ，能为我们应用提供方便。

### 配置路由器
路由表 routes 将带参数的 url 映射到路由配置函数上（或直接的函数定义）。
路由可以包含参数 `:component`，它在斜线之间匹配 URL 组件。 路由也支持通配符 `*anything`，可以匹配后面多个 URL 路径: 

* 路由 "search/:query/p:page" 能匹配#search/house/p3 , 这里传入了 "house" 和 "2" 便注入到路由对应的函数参数中。

* 路由 "file/*path"可以匹配 #file/nested/folder/file.txt，这时传入函数的参数为 "nested/folder/file.txt"。

* 路由 "docs/:section(/:subsection)"可以匹配#docs/faq 和 #docs/faq/installing，第一种情况，传入 "faq" 到路由对应的动作中去， 第二种情况，传入"faq" 和 "installing" 到路由对应的动作中去。

```javascript
coala.router({
	
  // 配置路由表，回调函数可以是函数类型，也可以是字符串的动作键值，动作则单独配置，这样会使代码清晰好读
  routes: {
    '/hello':                 'hello',      // 无参数
    '/start/:component':      'start',      // 有一个参数
    '/goto/p:page':           'gotoPage'    // 有一个参数，并且 p 开头
    '/docs/:section(/:subsection)': 'docs'  // 有两个参数，后面一个是可选的
    '/show/*anything': function(anything) { // 有一个参数，匹配后面所有路径
      // #/show/xx/xx， anything == 'xx/xx'
    }
  },
  
  hello: function() {
    // #/help
  },

  // 有一个参数
  start: function(component) {
    // #/start/todomvc, component == 'todomvc'
  },
    
  // 有一个参数，并且 p 开头
  gotoPage: function(page) {
    // #/goto/p7, page == 7
  },

  // 有两个参数，后面一个是可选的
  docs: function(section, subsection) {
    // #/docs/s1, section == s1, subsection == undefined
    // #/docs/s2/s2-1, section == s2, subsection == s2-1
  }
});
```

> @返回值 路由器对象

### 路由器对象方法
将 coala.router 的返回对象缓存，然后可以根据需要调用它的方法了。
```javascript
// coala.router = ...
var router = coala.router({
  ...
})

router.add('/download/*path', function(path) {
	console.log(path === 'img/123.png')
})
  
router.go('/download/image/123.png')

router.stop()


```


#### start

启动路由器，使用 coala.router 会自动启动路由器


#### stop

停止路由器，所有的回调不会触发，可调用 start 重新开启


#### add(rule, fn)

增加一条路由规则，rule 规则可参考上面，fn 为执行函数


#### remove(rule)

删除匹配的路由规则


#### go(path)

转到指定路径，浏览器 url (hash) 路径会变化，匹配的路由回调函数会执行


#### back

后退一步，浏览器会显示上一个 url (hash)，匹配的路由回调函数会执行



## Component 组件配置



### tpl

组件模板函数，可以自己实现，也可以借助第三方模板编译，doT、artTemplate、marko 等，框架默认采用 doT 模板引擎

```javascript
// 自己实现模板函数
tpl: function(data) {
  return '<h1>' + data.name + '</h1>'
}

// doT 模板，借助 webpack 与 coala-dot-loader 集成，可以实现单文件组件声明
tpl: require('./template.html')

// artTemplate 可以运行编译，也可以借助 webpack 预编译
tpl: function(data) {
  var source = '<h1>{{title}}</h1>'
  template.compile(source)(data)
}
```

>  @ 返回 html 片段，框架支持 scoped style， 格式为： <style scoped>h1 {color: red;}</style>



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

// 支持 Ajax 异步获取数据再渲染，不过数据会绑定在 `this.data.resource` 属性上
data: function() {
  this.data.other = 'test'
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

组件本身是 observable 的，listen 是 observable.on 的另一种形式，其中 init、update、updated、mount、unmount 为组件生命周期的事件，而其它事件，只要事件名不同于这些即可，所有的事件函数 `this` 为当前组件，从而可以很方便的操作当前组件，访问数据或对属性和方法进行修改。

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
   	console.log('组件即将更新，通常用于转换数据')
  },
    
  updated: function() {
    this.$('#currentTime').html(new Date())
    console.log('组件已经更新，通常用于操作 dom')
  },
    
  mount: function() {
  	this.$('#select2').select2()
    console.log('组件已经挂载，通常用于操作 dom，但只会操作一次')
  },
  
  unmount: function() {
    delete this.customProperty
    $(body).off('click.select2')
    console.log('组件即将卸载，销毁一些额外的事件等')
  },
    
  [custom]: function(args) {
    console.log(args)
    console.log('组件自定义事件监听')
  }
}
```


#### 实例化 init

在组件实例化后触发，此函数一般对组件设置一个额外属性。


#### 更新前 update

在组件更新前触发，组件挂载时也会触发此函数，此函数一般作为数据转换。



#### 更新后 updated

在组件更新后触发，组件挂载后也会触发此函数，此函数用于需要在每次组件更新后都操作某些 dom 时用。



#### 挂载后 mount

在组件挂载后触发，此函数用于组件初次挂载后操作某些 dom 时用。


#### 卸载前 unmount

在组件卸载前触发，此函数用于消毁组件的一些数据或事件。



#### 自定义监听

名称不和生命周期的事件名重复即可，当 this.trigger('custom', args) 时触发，自定义事件多用于组件之间相互通信，一般是给外部组件使用。

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


### Dom 事件 events
对当前组件上的 dom 进行事件绑定，事件名配置在前面，后面支持任意的 jquery 选择器， 值为 事件处理名，会根据名字匹配 handle，相信用 jquery 的对这个会很熟悉
```Javascript
events: {
  'click #mybtn': 'test',
  'keypress #input': 'inputText',
  'click #menu > li > a': 'routeFn',
  'dblclick li[id^=item-*]': 'editItem'
}
```


### Dom 事件处理 handle
events 会根据键名匹配到 handle 中的处理函数

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

// 如果不需要混合其它对象，只提供自身或者关联对象使用， mixins 支持声明对象的形式
mixins: {
  play: function()
  stop: function()
  next: function()
  prev: function()
  showLrc: function()
}

```
mixins 支持 listen 及 handle 

```js
// common.js
mixins: {
  listen: {
    toggleStatus: function() {
      ...
    }
  },

  handle: {
    toggle: function() {
      this.trigger('toggleStatus')
    }
  }
}

// music.js
mixins: require('./common.js'),

events: {
  'click #toggerBtn': 'toggle'
}

```
> 当点击toggerBtn时， toggle、toggleStatus 都会被执行



## Component 对象



### 配置属性 opts

获取到所有组件配置，实际上也可以修改这些配置，我们并没有做任何限制，但是不建议这样做，除非其它 api 实现不了的功能才会使用到它。



### 数据 data

获取或修改组件数据，一般针对于静态数据修改，如果 data 是 function ，建议直接在 function 中处理数据，不建议修改。



### 节点 el

获取当前组件所挂载的 jquery 节点，只读，不允许修改。

### 当前节点选择器字符串 es
es 为节点 el 的上下文 selector，比如当前组件是mount在 '#child' 上，它的父组件是 mount 在 '#app' 上，那么它的 es 为 '#app #child'

### 父组件 parent

获取当前组件的父组件对象，如果有的话，一般组件间通信会用到它



### 子组件 refs

获取当前组件关联的子组件对象集，如果获取单个子组件，通过子组件名称获取，如: `this.refs.sexSelect`，一般组件间通信会用到它



### 子组件额外属性 refOpts

获取子组件的额外属性，如: `this.refs.sexSelect.refOpts.key`



### $(el) 组件 dom 查询方法

相当于 `this.el.find(el)`，在当前组件的 dom 下查询指定 dom 节点

> @返回值 查询到的 jquery 节点



### 组件实例化方法 Component(opts)

opts 为组件配置，一般只有最大的那个组件需要实例化，子组件都是框架负责，方法暴露在 coala 下，参考 coala 的 component 方法

> @返回值 组件实例



### 组件挂载方法 mount(el)

el 为 jquery 选择器，一般只有最大的那个组件需要挂载，子组件都是框架负责， 方法暴露在 coala 下，参考 coala 的 mount 方法

> @返回值 组件实例



### 组件更新方法 update(data)

当组件数据发生变化时，需要手动调用此方法对组件进行更新，在更新前会触发 update 监听事件，更新完成后会触发 updated 事件，如果有子组件一并更新，先更新子组件再更新组件本身。

```javascript
// 当数据变动大，需要将 this.data 覆盖，用这种方式比较简洁
this.update({label: '请选择你的爱好', items: ['男生', '女生']})

// 当某些属性，不需要将整个 data 覆盖，用这种方式
this.data.label = '请选择性别'
this.update()
```

> @返回值 组件实例



### 组件卸载方法 umount()

卸载当前组件，它的 dom 及所有事件都会被销毁，如果有子组件也一并销毁；销毁前会触发当前组件及子组件的 unmount 监听事件



## Coala 框架对象

coala 对象本身也是 observable，它有 component、mount、observable、router 四个方法



### 创建组件 component(opts)

opts 为组件配置，coala.component 方法一般用于创建一些独立的组件，再手动设置组件的关系。

> @返回值 组件实例



### 挂载组件 mount(opts, el)

opts 为组件配置，el 是 jquery 选择器，coala 会实例化并挂载此组件

```javascript
var coala = require('coala');
var component = require('./todomvc');
coala.mount(component, 'body');
```

> @返回值 组件实例



### 观察者方法 observable(el)

为 `obj` 对象添加 `Observable` 支持，如果参数为空，则创建一个空的观察者对象

> @返回值 参数对象 或新的observable 对象



### 创建路由器 router(opts)

创建路由器并且启动，详细参考路由器部分

> @返回值 路由器对象
