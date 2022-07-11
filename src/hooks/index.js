// 提供复用逻辑的函数(钩子)

import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
// 数据懒加载的函数
/**
 *
 * @param {element} target -- dom对象
 * @param {function} apiFn -- api函数
 */
export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  // 停止观察
  const { stop } = useIntersectionObserver(
    // 监听的目标元素
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting 是否进入可视区域
      if (isIntersecting) {
        stop()
        // 调用API函数获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    }
  )
  return { result, target }
}
