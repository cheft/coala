## 介绍

#### 框架由来
Coala （取名于 Koala，用 c 替换 k，有 code 之意，发音也还一样，寓意着程序员们如果用 Coala 来开发，就能像树袋熊一样，每天有更多的时间睡觉了。

为什么会有这个框架，话说前端框架自 backbone 之后一发不可收拾，到目前三大主流框架 React、Vue2、Angular2。前端渐渐地趋于标准化，前端的童鞋门对三大框架争相学习、理解、模仿。这些是正面的，是好的。但是我要说说现实的，在我经历的公司里，没有一家愿意使用她们的，而是用传统 jQuery 加 模板引擎方式开发，也有些项目是没有做前后分离，用后端模板渲染的的方式开发，比如使用 Java 的 freemark，如此项目功能多，接手人多且技术参差不齐，维护和更新起来是多么的痛苦。
一个企业想要整改，将所有产品线完全使用主流框架来实现，需要很多的人力，对前端人员的要求也是相当高。作为其中一员，不得不权衡利弊为企业寻找一个折中的办法，既能实现前后端分离，组件化开发，同时又不能让现有前端同学理解起来太难，最好还是接近 jQuery + 模板的开发方式。如果能兼容旧 IE 最好，虽然我知道旧 IE 即使能运行，那也是极慢的（旧 IE 天生运行 JS 慢），但还是无耐的实现了，这不能当作一个特点，只希望国内跟着天猫的节奏把旧 IE 丢弃掉。


### 特点
Coala 框架不算是前卫的、流行的、牛逼的，但是她是比较实用的; 如果想在她身上找寻这些特点，那么可以就此止步了。 
在目前相对混乱的前端时代，还没有出现大家公认一统的实现方式，因此自 Backbone 出现之时，江湖上相继涌现出各种武功秘籍。
作者自认为是武林人士，如若逐一练习，恐会走火入魔，就目前形势，先掌握其心法，再根据需要练习使用方为上策。




#### Coala 依赖 jQuery

源于几点： 
企业中很多写前端的人还是以使用 jQuery 操作 dom 思想为主，mvvm、virtual dom 的思想只是了解、缺少完全掌控这些技术的人。
很多老项目基于 jQuery 实现，直接从老项目搬到新型框架非几人之力，惟有全新项目才可使用新型框架，对于一些老项目新增功能、需求改动用 Coala 最适合不过了。
很多组件还是基于 jQuery，想要使用它们，jQuery 必须要引入，用其它框架集成感觉要费很多事，此时 Coala 就体现出它的特长了。

#### Coala 内核很小
gzip 只有 4k，站在 jQuery 面前可以忽略不计。

##### Zepto 替代 jQuery
zepto gzip 后只有10k，加上 coala 只有14k，比起 jQuery 要小太多。如果您的项目不考虑旧 IE，用 zepto 非常适合，且 zepto 可以额外提供一些功能，如果您开发移动项目的话，很多组件也依赖于它，比如 SUI。

#### Coala 组件化
有组件的理念，并且支持组件化样式，配合 webpack 也能轻松实现文件模块化。

#### Diff DOM 更新
采用开源 morphdom 库 对比更新DOM，减少人工操作 DOM 量，使组件更新更快。

#### Coala 模板自选
自己可任意选用 doT.js、artTemplate、Handlerbars、Marko 等

#### 其它
源码少、API 简单; 理论上兼容 IE7+ 的，但是前端运行大量的脚本，就算是 IE8 跑起来，也总是会出现脚本未响应的情况，以前 Ext.js 运行在 IE8 上的，虽然牛逼，但是慢得想哭。
勾起作者当年用 YUI 做的一个大型企业项目的往事，客户强制要求炫酷效果、但必须兼容IE7、8，最终加班加点调出来了，但是结果就是慢、卡死。想想那时，还是太年轻啊!
所以说，想做好的交互、用户体验，但又不想抛弃低版本 IE，我只能说放弃吧（天猫都放弃了），不要让人生有悔恨啊。
有那么点 MVC 的概念，Coala 模范了众多框架：backbone、riot、vue，算是给用 jQuery 人的过渡框架，如果你能把 Coala 这个坑踩过了，以后在 Vue、React 等框架上会发现平顺很多，
当然如果有条件，企业允许的话还是用大厂的框架吧，至于 Coala 嘛，练练手、看看源码（总共代码 300行，核心代码100行。）还是有好处的。



## 环境安装

### Coala 当前版本
`v1.0-beta2`

### 本地普通环境
框架依赖 jquery 或 zepto；jquery 有1、2、3 版本，API 和 支持浏览器会有不同；zepto 库文件较小，但只支持现代浏览器；请根据需求在 html 中引入依赖：

##### 引入 zepto
```html
<script src="https://unpkg.com/zepto"></script>
<script src="https://unpkg.com/zepto@1.2.0/src/callbacks.js"></script>
<script src="https://unpkg.com/zepto@1.2.0/src/deferred.js"></script>
```
> 因为框架使用了 deferred(promise) API，因此需要把 zepto 的 callbacks、deferred 模块引入，如果赚麻烦，请用 coala 提供的 zepto 包可一次引入：

```html
<script src="https://unpkg.com/coala@1.0.0-beta.2/zepto-deferred.js"></script>
```

##### 或引入 jQuery
```html
<script src="https://unpkg.com/jquery"></script>
```

##### 引入框架文件
[下载 Coala 文件](/coala.min.js), 仅 `4kb min+gzip` 大小，直接下载并用 `<script>` 标签引入，`Coala` 会暴露为一个全局变量

或采用 `unpkg`
```html
<script src="https://unpkg.com/coala"></script>
```

或采用 `npm` 安装包
```shell
npm install coala
```
```html
<script src="/node_modules/coala/coala.min.js"></script>
```

> 以上提供的 CND 地址仅供开发测试用，正式环境请根据需要更换。


### 在线 JSFiddle
[Hello World example](https://jsfiddle.net/cheft/x2o19yeu/)
> 如果嫌上面麻烦，使用 JSFiddle 尝下鲜，但最好的是下面的 webpack 方式

### <span style="color: red;">*</span> Webpack 环境
推荐使用我们提供的 [coala-starter-kit](https://github.com/cheft/coala-starter-kit)，快速搭建开发环境。

> 集成了 webpack、coala-dot-loader（将 dot-loader 的dot varname 设置为 'data', 并实现单文件组件）


## 入门

### 最简 hello world 组件

``` html
<div class="text">{{=data.text}}</div>

<script>
module.exports = {
  data: {
    text: 'Hello Coala!'
  }
}
</script>

<style scoped>
	.text {
		color: #d14;
	}
</style>
<!-- 以上定义了一个很简单的组件模块 -->

<!-- 外部调用挂载，供参考，实际不一定如此 -->
window.demo01 = coala.mount(opts, '#demo01')

<!-- 可在浏览器 console 中运行查看更新效果 -->
demo01.update({text: 'New Content'})

```
<div class="demo" id="demo01"></div>

你所看到的是 coala 最简单的一个 hello world 示例，我相信有点前端基础的人都能看懂，就是将一个字符串通过模板渲染到 dom 中，但 coala 使代码变得更清晰，并且提供一些 API 来处理这个组件。接下来通过另一个例子来感受一下：

### 相比复杂的 todo 组件
```html
<input placeholder="输入并按回车确定">
<ol>
  {{~data :item :idx}}
  <li data-idx="{{=idx}}"{{?item.completed}} class="completed"{{?}}>
    {{=item.title}}
    <a href="javascript:;">&times;</a>
  </li>
  {{~}}
</ol>
<style scoped>
  ol { margin: 0;}
  .completed { text-decoration:line-through; }
</style>
<script>
  module.exports = {
    data: [{title: '学习 Coala 框架！'}],
    events: {
      'keyup input': 'addTodo',
      'click ol > li': 'toggleComplete',
      'click ol > li > a': 'removeTodo',
    },

    handle: {
      addTodo: function(e) {
        if (e.keyCode !== 13) return
        this.data.push({title: e.target.value})
        this.update()
      },

      toggleComplete: function(e) {
        var idx = $(e.target).data('idx')
        this.data[idx].completed = !this.data[idx].completed
        this.update()
      },

      removeTodo: function(e) {
        var idx = $(e.target).parent().data('idx')
        this.data.splice(idx, 1)
        this.update()
        // 阻止事件冒泡，防止冒泡执行 toggleComplete
        e.stopPropagation()
      }
    }
  }
</script>

```
<div class="demo" id="demo02"></div>


看到上面例子是不是感觉事件绑定和处理跟 jQuery 实现方式很相似，没错，这就是 coala 的特点，接下来让我们更深入的学习 Coala 的使用吧。

## Coala 使用
```js
var coala = require('coala')


coala.mount
coala.component
coala.router
coala.on('test')
coala.trigger('test')
```

## 组件
单文件结构
```html
  <div class="content">
    <ul>
      <li>item1<li>
      <li>item2<li>
    </ul>
  </div>

  <style scoped>
    :scope {
      font-size: 16px;
    };

    ul {
      list-style: none;
      margin: 0;
    }
  </style>

  <script></script>
```

模板分离结构

```html
// template.html
<div class="content">
  <ul>
    <li>item1<li>
    <li>item2<li>
  </ul>
</div>

<style scoped>
  :scope {
    font-size: 16px;
  };

  ul {
    list-style: none;
    margin: 0;
  }
</style>
```

```js
  // component.js
  module.exports = {
    tpl: require('./template.html')
  }
```

组件配置
```js
  // component.js
  module.exports = {
    tpl: ...,
    data: ...,
    refs: {
      child1: {
        el: '#htmlDivId',
        component: require('./child'),
        data: {...},
        ...
      }
    },
    listen: {
      init: function() {...},
      update: function() {...},
      updated: function() {...},
      mount: function() {...},
      unmount: function() {...},
      ...
    },
    mixins: [
      {
        ...: function() {}
      },
      require('./help')
    ],
    events: {
      'click #mybutton': 'clickHandle',
      ...
    },
    handle: {
      clickHandle: function(e) {...},
      ...
    }
  }
```

## 数据

配置对象或数组

```js
module.exports = {
  data: {name: 'cheft', email: 'm@cheft.cn'}
}

module.exports = {
  [{title: '1234', desc: '1111'}, {title: '5678', desc: '2222'}]
}
```

支持函数动态返回数据

```js
module.exports = {
  data: function() {
    var items = []
    for (var i = 0; i < 10; i++) {
      items.push({title: '123' + i, desc: 'content' + i})
    }
    return items;
  }
}
```

异步获取到数据再渲染，不过需要注意的是，组件数据会绑定在 `this.data.resource` 属性上

```js
// 返回异步 ajax 对象
module.exports = {
  data: function() {
    this.data.otherProp = {name: 'cheft', email: 'm@cheft.cn'} // 在这里可以设置其它数据
    return $.get('http://localhost:3000/user')
  }
}

// 自己处理 Promise（$.Deferred）
module.exports = {
  data: function() {
    var promise = $.Deferred()
    setTimeout(function() {
      promise.resolve({name: 'cheft', email: 'm@cheft.cn'})
    }, 1000)
    return promise
  }
```

## 模版 / doT
模板中可以嵌入脚本作为单文件组件，也可以作为模板供 js 组件引入

### doT 语法
> 框架默认采用 doT 模板来实现 Demo，因此着重讲一下 doT 的语法，其它模与之对照

* JS 执行表达式  {{ }}
* 数据输出表达式 {{= }}
* 数据判断表达式 {{? }}
* 数据循环表达式 {{~ }}
* 数据编码输出表达式 {{! }}

### 局部样式
采用 HTML5 标准，目前只有 firefox 默认支持，如果不支持就采用框架内键的 polyfill 实现


## 监听 / 生命周期
### 初始化
![init](/docs/assets/img/init.png)

### 挂载
![mount](/docs/assets/img/mount.png)

### 更新
![update](/docs/assets/img/update.png)

### 卸载
![unmount](/docs/assets/img/unmount.png)


## 事件 / 处理

```html
<div class="text">{{=data.text}}</div>
<button id="reverseText">reverseText</button>

<script>
module.exports = {
  data: {
    text: 'Hello Coala!'
  },
  events: {
  	'click #reverseText': 'reverseText'
  },

  handle: {
  	reverseText: function(e) {
  		this.data.text = this.data.text.split('').reverse().join('')
  		this.update()
  	}
  }
}
</script>
```
<div class="demo" id="demo03"></div>

## 子组件 / 通信
组件通信

## 混合
listen
handle

## 路由使用

```js
var coala = require('coala')
coala.router({
  routes: {
    '/': 'goHome'
  },

  goHome: function() {
    console.log(1111)
  }
})
```