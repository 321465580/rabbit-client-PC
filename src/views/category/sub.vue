<template>
  <div class="subCategory">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区域 -->
      <SubFilter />
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
export default {
  name: 'subCategory',
  components: {
    SubBread,
    SubFilter
  }
}
</script>

<style>

</style>
