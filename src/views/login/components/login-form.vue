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
            <span class="code">发送验证码</span>
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
import { ref, reactive, watch } from 'vue'
import { Form as VeeForm, Field as VeeField } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
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

    // 需要在点击登录的时候, 对整体表单进行校验
    const login = async () => {
      // form组件提供了一个 validate 函数 作为整体表单校验, 返回的是一个promise
      const validate = await formC.value.validate()
      console.log(validate)
    }
    return { isMsgLogin, form, schema: mySchema, formC, login }
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
