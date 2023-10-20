<template>
  <div
    class="w-24 h-24 rounded-full shadow-md relative before:content-[' '] before:absolute before:h-2 before:w-2 before:bg-green-600 before:rounded-full before:right-3 before:top-[8%]"
  >
    <img
      class="w-24 h-24 rounded-full shadow-md"
      :src="avatar"
      alt="Bonne image"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ProfileImage',
  props: {
    avatar: {
      type: String,
      required: true
    }
  }
})
</script>
