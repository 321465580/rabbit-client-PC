<template>
  <div>
    <p>{{$store.state.moduleA.username}}</p>
    <p>{{$store.getters.newName}}</p>
  <!-- namespaced  -->
    <p>{{$store.state.moduleB.username}}</p>
    <p>{{$store.getters['moduleB/newName']}}</p>
    <button @click="fn1">mutations</button>
    <button @click="fn2">action</button>
  </div>
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'App',
  setup () {
    const store = useStore()
    const fn1 = () => {
      store.commit('moduleB/updateName')
    }
    const fn2 = () => {
      store.dispatch('moduleB/updateName')
    }
    return { fn1, fn2 }
  }
}
</script>

<style>

</style>
