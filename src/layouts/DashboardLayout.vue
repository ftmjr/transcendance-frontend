<template>
  <main>
    <!--Navbar and other component for the dashboard here -->
    <nav-bar />
    <!--Sidebar Menu and Navbar here -->
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '@/components/Header.vue'
export default defineComponent({
  components: {
    NavBar
  }
})
</script>

<style scoped></style>
