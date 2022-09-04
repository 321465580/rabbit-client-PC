// 购物车

import { getNewCartGoods } from '@/api/cart'
// import { reject, resolve } from 'core-js/fn/promise'
// import { reject, resolve } from 'core-js/fn/promise'

// 约定加入购物车字段 必须和后端保持一致
// id skuId name attrsText picture price nowPrice selected stock count isEffective
export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      // 有效商品: 库存大于0 stock 商品有效标识为true isEffective
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + parseInt(c.count) * c.price, 0)
    }
  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      // 约定加入购物车字段 必须和后端保持一致 payload 是对象
      // payload的字段 :id skuId name attrsText picture price nowPrice selected stock count isEffective
      // 插入数据规则
      // 1.先找下是否有相同的商品
      // 2.如果有相同的商品, 查询它的数量, 合并累加到payload上, 再保存最新的位置, 原来的商品需要删除
      // 3.如果没有相同商品, 保存在最新位置即可
      const sameIndex = state.list.find(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来商品
        state.list.splice(sameIndex, 1)
        // 追加新的
        state.list.unshift(payload)
      } else {
        state.list.unshift(payload)
      }
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods 商品信息 price stock isEffective
      // goods 商品对象的字段不固定 对象中有哪些字段 就改哪些字段 字段的值合理才改
      // goods 商品对象 必须有skuId
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除商品
    deleteCart (state, skuId) {
      const index = state.list.find(goods => goods.skuId === skuId)
      state.list.splice(index, 1)
    }
  },
  actions: {
    // 加入购物车
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        // 已登录 todo
        if (ctx.rootState.user.profile.token) {
          console.log('1')
        } else {
          // 未登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // todo 已登录
        } else {
          // 未登录
          // 同时发送请求(有几个商品 发几个请求) 等所有请求成功, 一并去修改本地的数据
          // promise.all(Promise数组).then((dataList)=>{}) 同时发送请求 所有请求成功 得到所有成功结果
          // promise.reject() Promose.resolve() new Promise() 都是创造Promise对象
          // Promise.race(Promise数组).then(data=>{})  同时发送请求 最快请求成功 得到成功结果
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            dataList.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            resolve()
          })
        }
      })
    },
    // 删除商品
    deleteCart (ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // todo登录
        } else {
          // 未登录
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    }
  }
}
