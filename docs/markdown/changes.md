## V1.0.0
* 采用 morphdom 实现对比更新 dom
* 支持组件内样式，使用 scoped css 语法
* 增加 hash 路由功能，通过 `coala.router` 使用
* data 属性支持函数形式；支持返回 promise 对象，promise 方式返回的数据会自动绑定在 `this.data.resource` 上，并且加载数据后再渲染
* mixins 支持数组和对象两种方式，并且支持直接 mixin `listen` 、`handle`
* 兼容 IE7+；若开发现代应用或移动应用建议使用 zepto，体积更小
* 通过 coala-dot-loader 实现单文件组件
* 其它：`init` 事件中可拿到子组件 `refOpts`，`unmount` 事件变更等


## V0.0.11
* 实现组件化开发方式
* 具有完整的事件系统及组件通信方式
* 集成 jQuery，兼容 IE6+
* 默认采用 dot 模板渲染