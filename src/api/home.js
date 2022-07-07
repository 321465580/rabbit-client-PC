// 提供首页相关API函数
import request from '@/utils/request'

// 获取品牌
// limit 品牌个数
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取广告区轮播图
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}
