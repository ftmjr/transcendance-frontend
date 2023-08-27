<template>
  <header class="fixed w-full z-20 top-0 left-0 flex justify-center">
    <NavBar />
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import NavBar from '@/components/MainMenu.vue'

export default defineComponent({
  name: 'HeaderLayout',
  components: {
    NavBar
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  methods: {}
})
</script>
