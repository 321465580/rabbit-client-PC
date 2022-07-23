<template>
  <div class="subCategory">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区域 -->
      <SubFilter />
      <!-- 测试 -->
      <XtxCheckbox v-model="isAllChecked">全选</XtxCheckbox>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import XtxCheckbox from '@/components/library/xtx-checkbox.vue'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
export default {
  name: 'subCategory',
  components: {
    SubBread,
    SubFilter,
    XtxCheckbox
  },
  setup () {
    const isAllChecked = ref(true)
    return { isAllChecked }
  }
}
</script>

<style>

</style>
