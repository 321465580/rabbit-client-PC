<template>
  <div class="subCategory">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区域 -->
      <SubFilter />
      <!-- 商品面板(排序+列表) -->
      <div class="goods-list">
        <SubSort />
      </div>
      <!-- 测试 -->
      <XtxCheckbox v-model="isAllChecked">全选</XtxCheckbox>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import XtxCheckbox from '@/components/library/xtx-checkbox.vue'
import SubBread from './components/sub-bread.vue'
import SubSort from './components/sub-sort.vue'
import SubFilter from './components/sub-filter.vue'
export default {
  name: 'subCategory',
  components: {
    SubBread,
    SubFilter,
    XtxCheckbox,
    SubSort
  },
  setup () {
    const isAllChecked = ref(true)
    return { isAllChecked }
  }
}
</script>

<style>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
</style>
