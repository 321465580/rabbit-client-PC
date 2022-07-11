<template>
   <!-- 首页入口(分类+广告) -->
  <div class="container">
   <div class="home-entry">
    <!-- 左侧分类 -->
    <HomeCategory />
    <!-- 轮播图 -->
    <HomeBanner />
   </div>
  </div>
  <!-- 新鲜好物 -->
  <HomeNew></HomeNew>
  <!-- 人气推荐 -->
  <HomeHot></HomeHot>
  <!-- 品牌组件 -->
  <HomeBrand></HomeBrand>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand
  }
}
</script>

<style scoped lang="less">
</style>
