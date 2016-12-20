# Coala 用户手册

## 前言
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

## 起步
[jsfiddle](https://jsfiddle.net/cheft/x2o19yeu/)

### 安装

#### 下载

#### npm

### starter-kit

集成 webpack、[doT](http://olado.github.io/doT/) 模板编译器

## 组件概念

## 声明一个组件

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
<!-- 以上定义了一个独立组件 -->

<!-- 外部调用挂载，供参考，实际不一定如此 -->
window.demo01 = coala.mount(opts, '#demo01')

<!-- 可在浏览器 console 中运行查看效果 -->
demo01.update({text: 'New Content'})

```
<div class="demo" id="demo01"></div>

### doT 语法了解
* {{= }}
* {{? }}
* {{~ }}
* {{! }}

### DOM 事件处理

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
<div class="demo" id="demo02"></div>

### 生命周期 / 监听事件

### 嵌入子组件
组件通信

### 混合
事件分两类：DOM 事件、监听事件


### 路由使用

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