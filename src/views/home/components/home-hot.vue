<template>
  <div ref="target" class="hone-hot">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <!-- 面板 -->
    <Transition name="fade">
        <ul v-if="goods.length" class="goods-list">
        <li  v-for="item in goods" :key="item.id">
            <RouterLink to="/">
            <img :src="item.picture" alt="">
            <p class="name">{{item.title}}</p>
            <p class="desc">{{item.alt}}</p>
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
import { ref } from 'vue'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { findHot } from '@/api/home'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeHot',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    // const goods = ref([])
    // findHot().then(data => {
    //   goods.value = data.result
    // })
    const target = ref(null)
    const goods = useLazyData(target, findHot)
    return { goods, target }
  }
}
</script>

<style scoped lang='less'>
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
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
