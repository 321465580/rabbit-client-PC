import { userAccountCheck } from '@/api/user'

// 给vee-validate提供校验函数
export default {
// 校验函数有规则: 返回true 就是校验成功,返回字符串就是失败, 字符串就是错误提示信息
// 用户名校验
  account (value) {
    if (!value) return '请输入用户名'
    // 规则: 字母开头6-20字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20字符'
    return true
  },
  // 用户校验且唯一性
  async accounApi (value) {
    if (!value) return '请输入用户名'
    // 规则: 字母开头6-20字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20字符'
    // 去服务器端校验
    const data = await userAccountCheck(value)
    if (data.result.valid) return '用户名已存在'
    return true
  },
  password (value) {
    if (!value) return '请输入密码'
    // 规则:6-24字符
    if (!/^\w{6,24}$/.test(value)) return '密码格式6-24字符'
    return true
  },
  rePassword (value, { form }) {
    if (!value) return '请输入密码'
    // 规则:6-24字符
    if (!/^\w{6,24}$/.test(value)) return '密码格式6-24字符'
    // form是表单数据对象
    if (value !== form.password) {
      return '确认密码需要和密码保持一致'
    }
    return true
  },
  mobile (value) {
    if (!value) return '请输入手机号码'
    // 规则: 1开头 3-9之间 9个数字
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式不对'
    return true
  },
  code (value) {
    if (!value) return '请输入验证码'
    // 规则
    if (!/^\d{6}$/.test(value)) return '验证码不对'
    return true
  },
  isAgree (value) {
    if (!value) return '请勾选用户协议'
    return true
  }
}
