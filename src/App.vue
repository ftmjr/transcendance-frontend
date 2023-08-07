<script lang="ts">
import Header from './components/Header.vue'
import { RouterView } from 'vue-router'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  components: {
    RouterView
  }
})
</script>

<template>
  <router-view />
</template>
