<template>
  <Form ref="formC" :validation-schema="Myschema" v-slot="{errors}" autocomplete="off" class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" v-model="form.code" name="code" class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click="send()" >{{time===0?'发送验证码':`${time}秒后发送`}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit()">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { reactive, ref, onMounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: {
    Form,
    Field
  },
  props: {
    unionID: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const nickname = ref('null')
    const avatar = ref('null')
    // 1.准备信息: openID(unionID) QQ头像和昵称
    // 2.完成表单校验
    // 3.发送验证码(校验, 定义api, 调用, 完成倒计时)
    // 4.进行绑定(绑定成功就是登录成功)
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_1
      })
    }

    // 校验数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 校验规则对象
    const Myschema = {
      mobile: schema.mobile,
      code: schema.code
    }

    // 发送短信验证码
    // 手机号登录
    // 1.发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2 校验手机号, 成功才能发送验证码(API), 开启60s倒计时, 不能再次点击, 60s后回复原样
    // 1.3 失败, 失败的校验样式显示出来
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
      const valid = Myschema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          await userQQBindCode(form.mobile)
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
        await userQQBindLogin({
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
          Message({ type: 'success', text: 'QQ绑定成功' })
        }).catch(e => {
          Message({ type: 'error', text: '绑定失败' })
        })
      }
    }

    return { nickname, avatar, form, Myschema, send, time, formC, submit }
  }
}
</script>

<style scoped lang="less">
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
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
