<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{label}}</div>
    <div class="numbox">
      <a @click="changeNum(-1)" href="javascript:;">-</a>
      <input type="text" readonly :value="moduleValue">
      <a @click="changeNum(1)" href="javascript:;">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  props: {
    label: {
      type: String,
      default: ''
    },
    moduleValue: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    }
  },
  setup (props, { emit }) {
    // 1.绑定按钮点击事件 - 按钮 + 按钮触发 同一个事件,同一个函数,分别传减一加一
    // 2.使用vueUse 的 useVModel 做数据绑定, 修改num 通知父组件更新
    const num = useVModel(props, 'moduleValue', emit)
    const changeNum = (step) => {
      // 3.得到将要改变的值, 如果值 不合法 , 终止程序的运行
      const newValue = num.value + step
      if (newValue < props.min || newValue > props.max) return
      // 4.正常情况
      num.value = newValue
      console.log(num.value)
      // 5.提供change事件
      emit('change', newValue)
    }
    return { num, changeNum }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
