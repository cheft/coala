## V1.0.0
* 增加对比更新 dom，采用 morphdom 实现
* 增加组件内样式功能，采用 scoped css 语法
* 增加 hash 路由功能，通过 `coala.router` 使用
* data 属性支持函数形式；返回 promise 对象时自动绑定在 `this.data.resource` 上，且先加载数据后渲染
* mixins 属性支持数组和对象两种方式，并支持直接合并 `listen` 和 `handle`
* 兼容 IE7+，若开发现代应用或移动应用建议使用 zepto，体积更小
* 默认采用 dot 模板渲染, 通过 coala-dot-loader webpack插件可实现单文件组件
* 其它：增加 `this.es` api， `update` 事件中可拿到子组件 `refOpts`，`unmount` 事件变更，`coala` 对象中方法变更及很多细节等


## V0.0.11
* 实现组件化开发方式
* 具有完整的事件系统及组件通信方式
* 集成 jQuery，兼容 IE6+
* 默认采用 dot 模板渲染
