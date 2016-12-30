## 介绍

### 框架由来
Coala （取名于 Koala，用 c 替换 k，有 code 之意，发音也还一样，寓意着程序员们如果用 Coala 来开发，就能像树袋熊一样，每天有更多的时间睡觉。

为什么会有这个框架呢？话说前端框架自 backbone 之后一发不可收拾，各种技术框架如潮涌，到目前三大主流框架 React、Vue2、Angular2 渐渐地趋于成熟，前端的童鞋门争相学习、膜拜、仿制，但是每个人的学习与理解程序不一样，也就统一不起来。虽然这些技术慢慢地应用开来，但是在国内并还没有很迅速，仍然很多还是用传统 jQuery 和 模板引擎方式开发，且以完成产品功能催促进度为主要目的；有些项目也没有做前后端分离，用后端模板来书写 HTML，造成前后端人员代码混杂在一起，没有明确的界限来约束（谁会改谁改），项目功能多而复杂，经手人技术参差不齐，在如此的开发环境下，维护和功能更新就成了程序员的恶梦。

企业当然会意识到项目维护更新的压力，如果想要整改，前后端要分离，有可能要将所有产品重做，亦或者新项目用主流框架来实现；但是会面临一些问题：对前端人员的要求提高（需有 JS 面象对象的思想）；后端许多人员不能参与前端工作，后端的架构也要跟着改变；增加前后端之间联调的沟通成本。但是这些对于项目难以维护更新来讲都是可以解决的，也是值得的。

就目前前端团队的情况及项目需求考虑，有的同鞋熟练掌握css，有的同鞋掌握js，有些两者都不错，但是要改变目前项目使用习惯让大家熟悉一门全新的框架，从学习成本和项目进度来讲都是不允许的，更有项目需求是要求支持 IE7、8；而短时间内要想出一套方案来解决以下问题，并且新的项目上得到实践：

* 要实现前后端分离，后端人员不需要修改前端代码。（目前前端人员写静态页面交给后端人员写成后端模板，有一些问题会改代码，前端人员难以把控)

* 要实现模块化开发，前端代码文件便于查找，公有方法组件能更好的管理。（目前代码文件太乱，有的文件很长，有的重复功能写几遍，改一处还不行）

* 另外要统一前端编码规范，兼容 IE7、8、简化前端代码压缩方式、优化前端性能


作为前端一员，带着这些需求，考虑过很多解决方案
* 最小的变动：让前端人员学习后端 freemark（或者让后端人员集成 handlebars、mustache模板），后端只提供数据，不准动模板中的东西。放弃的原因：其实前后端还是在一个项目中，前端开发得部署 Java 环境，也很难管住后端人员不去动前端的代码，后端模板的学习成本也是有的。

* 模块化开发：采用 webpack 模块化，jquery + doT 模板方式。 放弃的原因：比较传统的方式，没有组件化的概念，一个功能可能有很多种实现方式，很难规范前端人员的代码。

* 使用 MV* 框架：研究过 backbone、avalon、mithril、regular 等框架（市面上能兼容 IE7+ 的框架）。放弃的原因：这种框架学习成本太大，出现问题难以掌控，短时间内很难实行。

* 自己开发框架：在第二种基本上，借鉴了 jquery、backbone、react、riot、vue 等框架的思想，实现前后端分离、组件化开发、组件对比更新机制，同时让现有前端同学理解起来不是太难，任何一个见到其中的 API 都会有一种似曾相识的感觉，旧 IE 还是无奈的实现了，要知道在目前这个 Web 交互炫酷的时代，IE 无疑是巨慢的（因为它根本不属于这个时代），希望企业能跟着天猫的脚步把 IE8 也尽快丢掉吧。

> 考虑 SEO 问题，需要 SEO 的项目较少，企业大多是内部应用系统，如果有这种需求，那只能用第一种方案或者其它框架（mithril、react、vue2、angular2等）的同构方案来实现

### 特点
Coala 框架不算是前卫的、流行的，但是她是比较实用的，它拥有以下一些特点：

#### 依赖 jQuery
* 前端人员熟悉它，dom 操作很多时候还是有必要的

* 老项目依赖它，很多新功能还是要在老项目上集成，很多组件不得不用

* jQuery 的组件生态强大，相信极大多的组件是有 jQuery 版的

> 很多项目实践告诉我们，虽然三大框架的组件生态已经很完善了，但难免有些需求满足不了，需要用到一些  jquery 组件，此时吧唧一下 jquery 加进来，对于我这种强迫症患者是特别的不爽，所以干脆从一开始就引入进来。

#### 内核小
gzip 后只有 4k，站在 jQuery 面前可以忽略不计。当然你会说 jQuery 很大，如果你不考虑兼容旧 IE 的话，用 Zepto(gzip 10k) 可以完全代替 jQuery，尤其是针对移动项目的开发。比如使用 SUI 组件。

#### 组件化
组件化的理念，可以将功能拆分成最小组件，并且支持组件化样式，配合 webpack 也能轻松实现文件模块化、代码异步加载。

#### Diff DOM 更新
采用 [morphdom](https://github.com/patrick-steele-idem/morphdom) 开源库 对比更新DOM，减少人工操作 DOM 的复杂度，并且组件更新得更快。

#### Coala 模板自选
自己可任意选用 doT.js、artTemplate、Handlerbars、Marko 等

> 当你掌握了此框架，说明前端面象对象编程、组件化开发有了一定的认识，这时再去尝试 vue、react 等框架时，你会发现变得很容易

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