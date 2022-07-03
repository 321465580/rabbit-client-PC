import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'

// 商品分类模块
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息,依赖topCategory重新设置,保证初始化就要数据,不至于白屏
      list: topCategory.map(item => ({ name: item }))
    }
  },
  // 修改分类函数
  mutations: {
    // paylodad: 所有的分类集合
    setList (state, paylodad) {
      state.list = paylodad
    },
    // 定义show和hide函数, 控制当前分类的二级分类显示和隐藏
    show (state, id) {
      // 找到当前分类
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },
  // 获取分类函数
  actions: {
    async getList (ctx) {
      // 获取分类数据
      const data = await findAllCategory()

      // 给每个分类加上控制二级分类显示隐藏的数据
      data.result.forEach(top => {
        top.open = false
      })

      // 修改分类数据
      ctx.commit('setList', data.result)
    }
  }
}
