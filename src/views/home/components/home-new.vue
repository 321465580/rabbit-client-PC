<template>
  <div ref="target" class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template #right><XtxMore path="/" /></template>
      <!-- 面板内容 -->
      <Transition name="fade">
        <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
                <img v-lazy="item.picture" alt="">
                <p class="name ellipsis">{{item.name}}</p>
                <p class="price">&yen;{{item.price}}</p>
            </RouterLink>
            </li>
        </ul>
        <!-- 骨架 -->
        <HomeSkeleton bg="#f0f9f4" v-else />
      </Transition>
    </HomePanel>
  </div>
</template>
<script>
// import { ref } from 'vue'
import HomePanel from './home-panel'
import HomeSkeleton from './home-skeleton.vue'
import { findNew } from '@/api/home'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // const goods = ref([])
    // findNew().then(data => {
    //   goods.value = data.result
    // })
    // const target = ref(null)
    const { result, target } = useLazyData(findNew)
    return { goods: result, target }
  }
}
</script>
<style scoped lang="less">
// 离开时
.fade{
  &-leave {
    &-active {
      position: absolute;
      width: 100%;
      transition: opacity .5s .2s;
      z-index: 1;
    }
    &-to {
      opacity: 0;
    }
  }
}
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
