//  提供商品相关的API函数

import request from '@/utils/request'

/**
 * 获取商品详情
 * @param {String} id - 商品ID
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/**
 *  获取推荐商品 ||猜你喜欢
 * @param {String} id 商品ID 传入相关推荐,不传猜你喜欢
 * @param {Integer} limit 商品数量
 * @returns
 */
export const findRelGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 *
 * @param {String} id 商品ID
 * @param {Integer} limit 商品数量
 * @param {Integer} type - 热销类型 1为24小时 2 为周榜 3为总榜
 * @returns
 */
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}
