<template>
  <section class="w-100 bg-red-400">
    <p>DashBoard vue</p>
  </section>
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
