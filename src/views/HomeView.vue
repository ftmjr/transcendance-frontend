<template>
  <nav-bar />
  <main>
    <div class="container"></div>
  </main>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'

const NavBar = defineAsyncComponent(() => import('@/components/Header.vue'))

export default defineComponent({
  name: 'home-view',
  components: {
    NavBar
  },
  data() {
    return {}
  }
})
</script>
