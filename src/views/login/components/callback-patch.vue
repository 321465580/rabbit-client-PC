<template>
  <VeeForm ref="formC" :validation-schema="mySchema" v-slot="{errors}" class="xtx-form" autocomplete="off">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <VeeField :class="{err:errors.account}" v-model="form.account" name="account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account" class="error">{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <VeeField  :class="{err:errors.mobile}" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <VeeField :class="{err:errors.code}" v-model="form.code" name="code" class="input" type="text" placeholder="请输入验证码" />
        <span class="code" @click="send()">{{time===0?'发送验证码':`${time}秒后发送`}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <VeeField  :class="{err:errors.password}" v-model="form.password" name="password" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <VeeField :class="{err:errors.rePassword}" v-model="form.rePassword" name="rePassword" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.rePassword" class="error" >{{errors.rePassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit()">立即提交</a>
  </VeeForm>
</template>

<script>
import { Form as VeeForm, Field as VeeField } from 'vee-validate'
import { reactive, ref, onMounted } from 'vue-demi'
import schema from '@/utils/vee-validate-schema'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
export default {
  name: 'CallbackPatch',
  props: {
    unionID: {
      type: String,
      default: ''
    }
  },
  components: {
    VeeForm,
    VeeField
  },
  setup (props) {
    // 1.表单校验  多两个校验: 用户名是否存在, 再次输入密码是否一致
    // 2.发送短信验证码: 发送接口API定义
    // 3.完善信息

    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    // 表单校验规则
    const mySchema = {
      account: schema.accounApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }

    // ------------------------------------------------
    // 发短信的代码
    const time = ref(0)
    const formC = ref(null)
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
          await userQQPatchCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败, 使用vee的错误函数, 显示错误信息 setFieldError(字段, 错误信息)
        formC.value.setFieldError('mobile', valid)
      }
    }

    const store = useStore()
    const router = useRouter()
    // 立即绑定
    const submit = async () => {
      const valid = formC.value.validate()
      if (valid) {
        userQQPatchLogin({
          unionID: props.unionID,
          ...form
        }).then(data => {
          // 实现和之前登录一样的逻辑
          // 1.存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2.跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 3.成功提示
          Message({ type: 'success', text: 'QQ完善信息成功' })
        }).catch(e => {
          Message({ type: 'error', text: '完善信息失败' })
        })
      }
    }
    return { form, mySchema, send, submit, time, formC }
  }
}
</script>

<style scoped lang='less'>
.code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;
    &:hover {
      cursor: pointer;
    }
  }
</style>
