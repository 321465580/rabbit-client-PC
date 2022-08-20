<template>
    <div class="goods-tabs">
    <nav>
      <a @click="activeName='GoodsDetail'" :class="{active:activeName ==='GoodsDetail'}" href="javascript:;">商品详情</a>
      <a @click="activeName='GoodsComment'" :class="{active:activeName ==='GoodsComment'}" href="javascript:;">商品评价<span>({{goods.commentCount}})</span></a>
    </nav>
    <!-- 切换内容的地方 其实是两个组件 就是切换组件-->
    <!-- <GoodsDetail v-if="activeName ==='GoodsDetail'"/>
    <GoodsComment v-if="activeName ==='GoodsComment'" /> -->
    <!-- 在vue中动态切换组件 可以使用动态组件 component组件 -->
    <!-- is 属性用来决定 component 动态组件渲染为哪个组件 -->
    <component :is="activeName"></component>
  </div>
</template>

<script>
import { inject, ref } from 'vue'
import GoodsDetail from './goods-detail.vue'
import GoodsComment from './goods-comment.vue'
export default {
  name: 'GoodsTabs',
  components: {
    GoodsDetail,
    GoodsComment
  },
  setup () {
    // 商品详情 activeName的值  GoodsDetail GoodsComment
    const activeName = ref('GoodsDetail')

    const goods = inject('goods')
    return { activeName, goods }
  }
}
</script>

<style lang='less'>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
