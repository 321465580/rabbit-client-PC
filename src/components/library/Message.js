// 提供一个能够显示 xtx-message 的函数
// 这个函数将来: 导入 直接使用, 也可以挂载在vue实例属性上
// 通过import Message form Message.js  使用 Message({type:"error",text:"提示文字 "})
// this.$Message({type:"error",text:"提示文字 "}) 来使用

import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器
let timer = null

export default ({ type, text }) => {
  // 渲染组件的步骤
  // 1.导入消息提示组件
  // 2.将消息提示组件 编译为虚拟节点(dom节点)
  // createVNode(组件, 属性对象(props))
  const vnode = createVNode(XtxMessage, { type, text })
  // 3.装备一个装载消息提示组件的容器
  // 4.将虚拟节点渲染在容器中
  // render(虚拟节点 , DOM容器)
  render(vnode, div)
  // 5.3s后销毁组件
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
