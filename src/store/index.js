import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
// 三个模块
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

export default createStore({
  modules: {
    cart,
    category,
    user
  },
  // 配置插件
  plugins: [
    createPersistedstate({
      // 本地存储名字
      key: 'erabbit-client-pc-store',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})

// 这个是分模块的用法
// // 模块A
// const moduleA = {
//   state: {
//     username: 'ma'
//   },
//   getters: {
//     newName (state) {
//       return state.username + '123'
//     }

//   }
// }
// // 模块B
// const moduleB = {
//   namespaced: true,
//   state: {
//     username: 'mb'
//   },
//   getters: {
//     newName (state) {
//       return state.username + '456'
//     }
//   },
//   mutations: {
//     updateName (state) {
//       state.username = 'asdausiogdhuiga'
//     }
//   },
//   actions: {
//     updateName (ctx) {
//       setTimeout(() => {
//         ctx.commit('updateName')
//       }, 1000)
//     }
//   }
// }

// export default createStore({
//   modules: {
//     moduleA,
//     moduleB
//   }
// })

/// /// 这个没有分模块
// vue2.0 创建仓库 new VueX.store({})
// vue3.0 创建仓库 createStore({})
// export default createStore({
//   // 状态
//   state: {
//     user: 'lauid'
//   },
//   // 写计算属性
//   getters: {
//     newName (state) {
//       return state.user + '111'
//     }
//   },
//   // 修改方法
//   mutations: {
//     updateName (state) {
//       state.user = 'qweqwe'
//     }
//   },
//   // 拿数据
//   actions: {
//     updateName (ctx) {
//       setTimeout(() => {
//         ctx.commit('updateName')
//       }, 1000)
//     }
//   },
//   // 分模块
//   modules: {
//   }
// })
