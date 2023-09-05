<template>
  <aside class="avatar-container">
    <v-avatar size="100">
      <v-img :src="avatarUrl"></v-img>
    </v-avatar>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'chat-user-avatar',
  props: {
    avatarUrl: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped></style>
