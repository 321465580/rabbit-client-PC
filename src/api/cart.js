// 封装购物车相关的API接口
import request from '@/utils/request'

/**
 * 获取商品的 最新价格 和 库存 是否有效
 * @param {String} skuId
 * @returns
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}
