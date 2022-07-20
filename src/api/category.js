// 定义分类相关API接口函数
import request from '@/utils/request'

/*
*
* 获取所有分类(顶级,二级,对应商品推荐)
* @return promise
*/
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * 获取顶级类目信息(children属性就是各个子分类)
 * @param {String} id - 顶级类目的id
 * @returns promise
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}

/**
 * 获取二级类目下的筛选信息
 * @param {String} id 二级类目ID
 * @returns promise
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}
