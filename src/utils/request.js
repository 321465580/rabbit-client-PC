// 1. 创建一个新的axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 响应拦截器：1. 剥离无效数据  2. 处理token失效
// 4. 导出一个函数，调用当前的axios实例发请求，返回值promise
import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基准地址,原因:其他地方不是通过axios发出请求的地方上用基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

// 1. 创建一个新的axios实例
const instance = axios.create({
  // axios的配置
  baseURL,
  timeout: 5000
})

// 2.请求拦截器
instance.interceptors.request.use(config => {
  // 拦截的业务逻辑
  // 进行请求配置的修改
  // 如果本地有token在头部携带
  const { profile } = store.state.user
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 3. 响应拦截器：1. 剥离无效数据  2. 处理token失效
instance.interceptors.response.use(res => {
  return res.data
}, err => {
  if (err.response && err.response.status === 401) {
    // 1.清空本地无效用户信息
    store.commit('user/setUser', {})

    // 2.跳转登录页面
    // 3.跳转需要传参(当前路由地址)给登陆页

    // 当前路由地址
    // 组件里面拿到当前路由地址: `/user?a=10` $router.path='/user' $router.fullpath='/user?a=10'
    // js模块中拿到当前路由地址: router.currentRoute.value.fullpath
    const fullpath = encodeURIComponent(router.currentRoute.value.fullPath)
    // encodeURIComponent转换uri编码,防止地址出现问题
    router.push('/login?redirectUrl=' + fullpath)
  }
  return Promise.reject(err)
})

// 4. 导出一个函数，调用当前的axios实例发请求，返回值promise
export default (url, method, submitData) => {
  // 负责发请求,请求地址,请求方式,提交的数据
  return instance({
    url,
    method,
    // 1.如果是get请求, 需要用params来传递submitData
    // 2.如果不是post请求, 需要使用data来传递submitData
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
    // []设置一个动态的key, 写js表达式, js表达式的执行结果当作key
  })
}
