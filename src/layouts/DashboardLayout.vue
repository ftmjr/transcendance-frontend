<template>
  <HeaderLayout />
  <main class="mt-20">
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderLayout from '@/components/Header.vue'
import useAuthStore from '@/stores/AuthStore'
export default defineComponent({
  components: {
    HeaderLayout
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
})
</script>

<style scoped></style>
