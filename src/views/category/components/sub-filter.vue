<template>
<!-- 筛选区 -->
   <div class="sub-filter" v-if="filterData && filterLoading === false">
     <div class="item">
       <div class="head">品牌：</div>
       <div class="body">
         <a @click="changeBrand(item.id)" :class="{active:item.id === filterData.brands.selectedBrand}" href="javascript:;" v-for="item in filterData.brands" :key="item.id" >{{item.name}}</a>
       </div>
     </div>
     <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
       <div class="head">{{item.name}}：</div>
       <div class="body">
         <a @click="changeProp(item,prop.id)" :class="{active:prop.id === item.selectedAttr}" href="javascript:;" v-for="prop in item.properties" :key="prop.id" >{{prop.name}}</a>
       </div>
     </div>
   </div>
   <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 监听二级类目ID的变化,获取筛选的数据
    const filterData = ref({})
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      // 变化后ID有值,且处在二级类目路由下
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = true
        // 发请求获取数据
        findSubCategoryFilter(route.params.id).then(data => {
        //   每一组可选的筛选条件缺失 全部条件, 处理数据 加上全部
        // 给每一组数据, 加上选中的ID
          // 1.品牌
          data.result.brands.selectedBrand = null
          data.result.brands.unshift({ id: null, name: '全部' })
          //  2.属性
          data.result.saleProperties.forEach(item => {
            item.selectedAttr = null
            item.properties.unshift({ id: null, name: '全部' })
          })

          //   设置修改的数据
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })

    // 获取筛选参数的函数
    const getFilterParams = () => {
      const obj = {
        brandID: null,
        attrs: []
      }
      // 品牌赋值
      obj.brandID = filterData.value.brands.selectedBrand
      // 销售属性
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedAttr) {
          const prop = item.properties.find(prop => prop.id === item.selectedAttr)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })

      if (obj.attrs.length === 0) obj.attrs = null
      // 参考数据 :{brandID:'', attrs:[ {groupName:'', propertyName:''},... ] }
      return obj
    }

    // 1.记录当前选择的品牌
    const changeBrand = (brandID) => {
      if (filterData.value.brands.selectedBrand === brandID) return
      filterData.value.brands.selectedBrand = brandID
      emit('filter-change', getFilterParams())
    }
    // 2.记录当前选择的销售属性
    const changeProp = (item, propID) => {
      if (item.selectedAttr === propID) return
      item.selectedAttr = propID
      emit('filter-change', getFilterParams())
    }
    return { filterData, filterLoading, changeBrand, changeProp, getFilterParams }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
     .xtx-skeleton {
      padding: 10px 0;
    }
  }
</style>
