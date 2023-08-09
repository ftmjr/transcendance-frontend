<template>
  <div class="container"></div>
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
