// 用户相关的接口

import request from '@/utils/request'

/**
 * 账号密码登录
 * @param {String} account 账号
 * @param {String} password 密码
 * @returns promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/**
 *  手机号的短信验证码获取
 * @param {String} mobile 手机号
 * @returns promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

/**
 * 手机号登录
 * @param {String}  mobile 手机号
 * @param {String}  code 短信验证码
 * @returns promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 *
 * @param {String} unionId  QQ唯一标识, openID
 * @param {String} source  后端类型 1pc
 * @returns promise
 */
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}

/**
 *  获取QQ绑定的时候 短信验证码
 * @param {String} mobile 手机号
 * @returns promise
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * QQ登录 绑定账号
 * @param {String} unionId qq唯一标识
 * @param {String} mobile 手机号
 * @param {String} code 验证码
 * @returns
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * 校验用户名是否唯一
 * @param {String} account 账号
 * @returns Promise
 */
export const userAccountCheck = (account) => {
  return request('/register/check', 'get', { account })
}

/**
 * 获取QQ完善信息的时候 短信验证码
 * @param {String} mobile 手机号
 * @returns
 */
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

/**
 * QQ注册 完善信息
 * @param {String} unionId qq唯一标识
 * @param {String} mobile 手机号
 * @param {String} code 验证码
 * @param {String} account 账号
 * @param {String} password 密码
 * @returns
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request('/login/social/:unionId/complement', 'post', { unionId, mobile, code, account, password })
}
