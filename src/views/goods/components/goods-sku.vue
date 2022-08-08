<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
            <img :class="{selected:val.selected,disabled:val.disabled}" @click="changeSku(item,val)" v-if="val.picture" :src="val.picture" :title="val.name">
            <span :class="{selected:val.selected,disabled:val.disabled}" @click="changeSku(item,val)" v-else>{{val.name}}</span>
        </template>
        <img class="disabled" src="https://yanxuan-item.nosdn.127.net/d77c1f9347d06565a05e606bd4f949e0.png" alt="">
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set'
const star = '★'
// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1.得到所有的sku集合 props.goods.skus
  // 2.从所有的sku中 筛选出有效的sku
  // 3.根据有效的sku使用power-set得到子集
  // 4.根据子集往路径字典对象中存储 key-value

  // 路径字典
  const pathMap = {}
  skus.forEach(sku => {
    // 2
    if (sku.inventory > 0) {
      // 计算当前有库存的sku 的子集
    //   例如: [1,2,3] = [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
    // 可选值 数组
      const valueArr = sku.specs.map(val => val.valueName)
      //   console.log(valueArr)
      // 可选值数组 子集
      const valueArrPowerSet = powerSet(valueArr)
      //   console.log(valueArrPowerSet)
      // 遍历子集, 往pathMap插入数据
      valueArrPowerSet.forEach((arr) => {
        // 根据arr得到字符串的key,约定key是:['蓝色','美国'] ==> '蓝色★美国'
        const key = arr.join(star)
        //  给pathMap设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })

  return pathMap
}

const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach((item) => {
    // 选中的按钮对象
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 1.约定每一个按钮的状态由本身的disabled数据来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach((val) => {
      // 2.判断当前是否选中, 是选中就不用判断
      if (val.selected) return
      // 3.如果不是选中, 就拿着当前的值, 按照顺序套入选中值的数组
      selectedValues[i] = val.name
      // 4.剔除undefined数据, 按照分隔符拼接key
      const key = selectedValues.filter(value => value).join(star)
      // 5.拿着key, 去路径字典中查找,是否有数据, 有可以点击, 没有就禁用
      val.disabled = !pathMap[key]
    })
  })
}

// 初始化选中状态 默认选中
const initSelectedStatus = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((spec, i) => {
      const value = sku.specs[i].valueName
      spec.values.forEach(val => {
        val.selected = val.name === value
      })
    })
  }
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuID: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)

    // 根据skuID初始化选中
    initSelectedStatus(props.goods, props.skuId)

    // 组件初始化:更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)

    // 1.选中与取消选中,约定在每一个按钮都拥有自己的选中状态数据: selected
    // 1.1 点击的是 已选中的, 只需要取消当前的选中
    // 1.2 点击的是 未选中的, 把同一个规格的按钮改成未选中, 当前点击的改成选中
    const changeSku = (item, val) => {
      // 当按钮是禁用的, 阻止程序运行
      if (val.disabled) return
      // 如果不是禁用 执行其他逻辑
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      // 点击按钮时,更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将你选择的信息通知父组件 {skuID, price, oldPrice, inventory, specsText}
      // 1.选择完整的sku组合按钮, 才能拿到这些信息, 提交父组件
      // 2.不是完整的sku组合按钮, 提交空对象父组件
      const ValidselectedValues = getSelectedValues(props.goods.specs)
      if (ValidselectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[ValidselectedValues.join(star)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}:${n.valueName}`, '').replace(' ', '')
        })
      } else {
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
