<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>

    <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :nickname="nickname" :avatar="avatar" :unionID="unionID" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionID="unionID" />
    </div>
  </section>
    <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind.vue'
import CallbackPatch from './components/callback-patch.vue'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
export default {
  name: 'LoginCallback',
  components: {
    LoginFooter,
    LoginHeader,
    CallbackBind,
    CallbackPatch
  },
  setup () {
    const hasAccount = ref(false)
    const store = useStore()
    const router = useRouter()
    const unionID = ref(null)
    // 首先: 默认认为已经注册且绑定
    // 通过QQ的API获取openID 就是后台需要的unionID然后进行登录
    // 如果成功: 登录成功
    // 如果失败: QQ未和小兔鲜进行绑定(有账号未绑定QQ, 没账号未绑定QQ)
    const isBind = ref(true)
    // 判断QQ是否登录
    if (QC.Login.check()) {
      // 第三方的唯一标识
      QC.Login.getMe((openID) => {
        unionID.value = openID
        // 请求小兔鲜后台, 做QQ登陆
        userQQLogin(openID).then(data => {
          // 登录成功 data.result 用户信息
          // 1.存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2.跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 3.成功提示
          Message({ type: 'success', text: 'QQ登录成功' })
        }).catch(e => {
          // 登录失败: 没有和小兔鲜绑定
          isBind.value = false
        })
      })
    }

    return { hasAccount, isBind, unionID }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
    .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}

</style>
