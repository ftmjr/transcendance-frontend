<template>
  <div>
    <p>Navbar</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavBar',
  props: {
    toggleVerticalOverlayNavActive: {
      type: Function,
      required: true
    }
  }
})
</script>

<style scoped></style>
