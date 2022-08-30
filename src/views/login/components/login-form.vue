<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <VeeForm ref="formC" class="form" :validation-schema="schema" autocomplete="off" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <VeeField :class="{error:errors.account}" v-model="form.account" name="account" type="text" placeholder="请输入用户名或手机号" />
          </div>
            <div v-if="errors.account" class="error">
            <i class="iconfont icon-warning" />{{errors.account}}
            </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <VeeField :class="{error:errors.password}" v-model="form.password" name="password" type="password" placeholder="请输入密码" />
          </div>
          <div v-if="errors.password" class="error">
            <i class="iconfont icon-warning" />{{errors.password}}
            </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <VeeField :class="{error:errors.mobile}" v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
          </div>
          <div v-if="errors.mobile" class="error">
            <i class="iconfont icon-warning" />{{errors.mobile}}
            </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <VeeField :class="{error:errors.code}" v-model="form.code" name="code" type="text" placeholder="请输入验证码" />
            <span @click="send()" class="code">{{time === 0? '发送验证码':`${time}秒后发送`}}</span>
          </div>
          <div v-if="errors.code" class="error">
            <i class="iconfont icon-warning" />{{errors.code}}
            </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <VeeField as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div v-if="errors.isAgree" class="error">
            <i class="iconfont icon-warning" />{{errors.isAgree}}
        </div>
      </div>
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </VeeForm>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import { Form as VeeForm, Field as VeeField } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { userAccountLogin, userMobileLogin, userMobileLoginMsg } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/shared'
export default {
  name: 'LoginForm',
  components: {
    VeeForm,
    VeeField
  },
  setup () {
    // 是否短信登录
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })

    // vee-validate 校验基本步骤
    // 1.导入 Form Field 组件 将form 和 input  进行替换, 需要加上name 用来指定将来校验规则函数的
    // 2.Filed需要进行数据绑定, 字段的名称最好和后台接口需要的一致
    // 3.编写Field的name 属性 对应的校验规则函数 form 的:validation-schema接受定义好的校验规则, 是对象
    // 4.自定义组件需要校验必须支持 v-model 然后field使用as指定组件名称
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 监听isMsgLogin 重置表单(数据+清楚校验结果)
    const formC = ref(null)
    watch(isMsgLogin, () => {
      // 重置数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      //  如果没有销毁Field组件, 之前的校验结果是不会清楚的, 例如 v-show的切换
      // form组件提供了一个resetform函数清楚校验结果
      formC.value.resetForm()
    })

    // setup中获取组件实例 proxy
    // const { proxy } = getCurrentInstance()

    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // 需要在点击登录的时候, 对整体表单进行校验
    const login = async () => {
      // form组件提供了一个 validate 函数 作为整体表单校验, 返回的是一个promise
      const validate = await formC.value.validate()
      // console.log(validate)
      // Message({ type: 'error', text: '用户名或者密码错误' })

      // proxy.$message({ type: 'error', text: '用户名或者密码错误' })

      if (validate) {
        try {
          let data = null
          if (isMsgLogin.value) {
            //  ****进行手机号登录
            // 3.1.准备一个API做账号登录
            // 3.2.调用API函数
            // 3.3.成功: 存储用户信息 + 跳转至来源页或者首页 + 消息提示
            // 3.4.失败:消息提示
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code }).then()
          } else {
            // 1.准备一个API做账号登录
            // 2.调用API函数
            // 3.成功: 存储用户信息 + 跳转至来源页或者首页 + 消息提示
            // 4.失败:消息提示
            const { account, password } = form
            data = await userAccountLogin({ account, password })
            // const { account, password } = form
            // userAccountLogin({ account, password }).then(data => {
            // // 存储用户信息
            //   const { id, account, avatar, mobile, nickname, token } = data.result
            //   store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            //   // 进行跳转
            //   router.push(route.query.redirectUrl || '/')
            //   // 消息提示
            //   Message({ type: 'success', text: '登录成功' })
            // }).catch(e => {
            // // 失败提示
            //   if (e.response.data) {
            //     Message({ type: 'error', text: e.response.data.message || '登录失败' })
            //   }
            // })
          }
          // 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 进行跳转
          router.push(route.query.redirectUrl || '/')
          // 消息提示
          Message({ type: 'success', text: '登录成功' })
        } catch (e) {
          if (e.response.data) {
            Message({ type: 'error', text: e.response.data.message || '登录失败' })
          }
        }
      }
    }

    // 手机号登录
    // 1.发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2 校验手机号, 成功才能发送验证码(API), 开启60s倒计时, 不能再次点击, 60s后回复原样
    // 1.3 失败, 失败的校验样式显示出来
    const time = ref(0)
    // pause 暂停
    // resume 开始
    // useIntervalFn(回调函数,执行间隔, 是否开启)
    // const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, { immediate: false })
    onMounted(() => {
      pause()
    })

    // 发送短信
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          await userMobileLoginMsg(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败, 使用vee的错误函数, 显示错误信息 setFieldError(字段, 错误信息)
        formC.value.setFieldError('mobile', valid)
      }
    }

    return { isMsgLogin, form, schema: mySchema, formC, login, send, time }
  }
}
</script>

<style scoped lang="less">
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
