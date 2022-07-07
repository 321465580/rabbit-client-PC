// 扩展原有插件功能:全局组件,自定义指令,挂载原型方法,注意:没有全局过滤器
// 这就是插件
// vue2.0插件写法要素: 导出一个对象,有install函数,默认传入vue构造函数,vue基础之上扩展
// vue3.0插件写法要素: 导出一个对象,有install函数,默认传入APP实例 ,vue基础之上扩展

import XtxSkeleton from './xtx-skeleton.vue'

export default {
  install (app) {
    // 在App上扩展,app提供component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component(XtxSkeleton.name, XtxSkeleton)
  }
}
