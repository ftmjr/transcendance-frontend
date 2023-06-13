<template>
  <nav-bar />
  <main>
    <div class="container">Welcome home</div>
  </main>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'

const NavBar = defineAsyncComponent(() => import('@/components/Header.vue'))

export default defineComponent({
  name: 'HomeView',
  components: {
    NavBar
  },
  data() {
    return {}
  }
})
</script>
