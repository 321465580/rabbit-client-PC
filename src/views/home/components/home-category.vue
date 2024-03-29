<template>
  <div class='home-category' @mouseleave="categoryID=null">
    <!-- 轮播图左侧分类 -->
    <ul class="menu">
      <li :class="{active:categoryID===item.id}" v-for="item in menuList" :key="item.id" @mouseenter="categoryID=item.id">
        <RouterLink :to="`/category/${item.id}`">{{item.name}}</RouterLink>
        <template v-if="item.children">
        <RouterLink
            v-for="sub in item.children"
            :key="sub.id"
            :to="`/category/sub/${sub.id}`">{{sub.name}}</RouterLink>
        </template>
        <!-- 骨架 -->
        <template v-else>
            <XtxSkeleton width="60px" height="18px" style="margin-right:5px" bg="rgba(255,255,255,0.2)"  />
            <XtxSkeleton width="50px" height="18px" bg="rgba(255,255,255,0.2)" />
        </template>
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer">
      <h4>{{currentCategory && currentCategory.id=='brand'?'品牌':'分类'}}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <!-- 商品 -->
      <ul v-if="currentCategory && currentCategory.goods">
        <li v-for="item in currentCategory.goods" :key="item.id">
          <RouterLink to="/">
            <img v-lazy="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌 -->
      <ul v-if="currentCategory && currentCategory.brands">
        <li class="brand" v-for="brand in currentCategory.brands" :key="brand.id">
            <RouterLink to="/">
            <img :src="brand.pircture" alt="">
            <div class="info">
                <p class="place"><i class="iconfont icon-dingwei"></i>{{brand.place}}</p>
                <p class="name ellipsis">{{brand.name}}</p>
                <p class="desc ellipsis-2">{{brand.desc}}</p>
            </div>
            </RouterLink>
        </li>
</ul>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { findBrand } from '@/api/home'
import xtxSkeleton from '@/components/library/xtx-skeleton.vue'
export default {
  components: { xtxSkeleton },
  name: 'HomeCategory',
  setup () {
    const store = useStore()
    // 最终使用的数据 = 9个分类+1个品牌
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-childern', name: '品牌推荐' }],
      // 品牌列表
      brands: []
    })
    const menuList = computed(() => {
      // 得到9个分类, 且每个一级分类下的子分类只有两个
      const list = store.state.category.list.map(item => {
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0, 2),
          goods: item.goods
        }
      })
      list.push(brand)
      return list
    })

    // 得到弹出层的推荐商品数据
    const categoryID = ref(null)
    const currentCategory = computed(() => {
      return menuList.value.find(item => item.id === categoryID.value)
    })

    // 获取品牌数据
    findBrand().then(data => {
      brand.brands = data.result
    })

    return { menuList, categoryID, currentCategory }
  }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0,0,0,0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,&.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
    // 弹层样式
    .layer {
    width: 990px;
    height: 500px;
    background: rgba(255,255,255,0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        // 品牌的样式
        &li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
              width: 95px;
              height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
// 骨架动画
.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}

</style>
