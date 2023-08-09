<template>
  <nav-bar />
  <main>
    <div class="container"></div>
  </main>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'

const NavBar = defineAsyncComponent(() => import('@/components/Header.vue'))

export default defineComponent({
  name: 'home-view',
  components: {
    NavBar
  },
  created() {
    if (!useAuthStore().isAuthenticated) this.$router.push('/auth')
  },
  data() {
    return {}
  }
})
</script>
