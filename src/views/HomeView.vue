<template>
  <div class="container">
    <p class="text-white text-md">Dashboard home view</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'

export default defineComponent({
  name: 'DashBoard',
  components: {},
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {}
  }
})
</script>
