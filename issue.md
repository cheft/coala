## issue

* [ ] #8 当没有 tpl 的时候，不操作 innerHTML，减少DOM操作次数

* [x] #7 refs 关联 component 时除了可传 data, 应该还能接收其它的参数，放到 this.refOpts 中

* [x] #6 组件的 tpl 不赋值的时候为空函数

* [x] #5 在组件实例化时，继承 refs 的组件 data，而不是直接覆盖data

* [x] #4 子组件生成加入 rid 后，再次更新后，容器内 dom 结构发生变化。 bug
 
* [x] #2 Coala next - roadmap to coala v0.0.3
  
  ```
    - [x]  增加 [__this.$__], 指向 this.el.find ，更方便查找 DOM 元素
    - [ ]  简化复杂的上下级组件查询 api
    - [x] 丢弃 refs 的 API 简化模式
    - [x] 增加 coala.component API 实例化 Component 对象
    - [x] 增加 coala.unmount API 卸载 Component 对象
    - [x] demo中 加入 css 模块加载器
    - [x] fix #4
  ```

* [x] #1 改名讨论（框架名 及 API名）

  ```
    查了一晚上，觉得框架名叫 trimer（三聚物）挺适合的，而且在github上也没有这个名字

    我们的框架 View 主要是由三个概念组成：

    listen
    dispatcher
    actions
    介于上面的名词不容易理解，欲将 View 改名为 Component，这个是内部不用暴露出来的

    三个概念：

    listen 改名为 watch 或者 on
    dispatcher 改名为 event 或者 bind
    actions 改名为 handle
     @cheft
      Owner

    或者名字叫 coala ，取自于 koala （睡神树袋熊），意旨用这个框架，大家都可以早点回家睡觉了，c 开头又有 code 的意思

    项目名 quite 改成 coala
    View 改名 Component， view => component
    views 改名 refs
    listen 依然是 listen
    dispatcher 改为 events
    actions 改为 handle
  ```