// 扩展原有插件功能:全局组件,自定义指令,挂载原型方法,注意:没有全局过滤器
// 这就是插件
// vue2.0插件写法要素: 导出一个对象,有install函数,默认传入vue构造函数,vue基础之上扩展
// vue3.0插件写法要素: 导出一个对象,有install函数,默认传入APP实例 ,vue基础之上扩展

import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.png'
import XtxBread from './xtx-bread.vue'
import XtxBreadItem from './xtx-bread-item.vue'

export default {
  install (app) {
    // 在App上扩展,app提供component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    app.component(XtxBread.name, XtxBread)
    app.component(XtxBreadItem.name, XtxBreadItem)
    // 定义指令
    defineDirective(app)
  }
}

// 定义指令
const defineDirective = (app) => {
  // 1.图片懒加载指令 v-lazy
  // 原理:先存储图片地址,不能在src上, 当图片进入可视区, 将你存储图片的地址设置给图片元素即可
  app.directive('lazy', {
    // 配置选项
    // vue2.0 监听使用指令的DOM是否创建好, 钩子函数:inserted
    // vue3.0 的指令,拥有的钩子函数和组件一样,使用指令的DOM是否创建好, mounted
    mounted (el, binging) {
      // 2.创建一个观察对象,来观察当前使用指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 停止观察
          observe.unobserve(el)
          // 3.将你存储图片的地址设置给图片元素 binging.value就是指令的值
          // 4.图片加载失败 error 图片加载失败的事件, load图片加载成功
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binging.value
        }
      }, {
        threshold: 0
      })
      // 开启观察
      observe.observe(el)
    }
  })
}
