import { createStore } from 'vuex'

// 模块A
const moduleA = {
  state: {
    username: 'ma'
  },
  getters: {
    newName (state) {
      return state.username + '123'
    }

  }
}
// 模块B
const moduleB = {
  namespaced: true,
  state: {
    username: 'mb'
  },
  getters: {
    newName (state) {
      return state.username + '456'
    }
  },
  mutations: {
    updateName (state) {
      state.username = 'asdausiogdhuiga'
    }
  },
  actions: {
    updateName (ctx) {
      setTimeout(() => {
        ctx.commit('updateName')
      }, 1000)
    }
  }
}

export default createStore({
  modules: {
    moduleA,
    moduleB
  }
})

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
