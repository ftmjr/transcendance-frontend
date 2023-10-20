<template>
  <v-dialog max-width="500px">
    <v-card>
      <v-card-title>Protected Room</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="chatStore.joinInfo.password"
          label="Password"
          type="password"
          :error-messages="chatStore.error"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          :color="isJoinable ? 'primary' : 'disabled'"
          :disabled="!isJoinable"
          @click="chatStore.joinRoom"
        >
          Join
        </v-btn>
        <v-btn
          color="error"
          @click="chatStore.resetJoinForm"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useChatStore from '@/stores/ChatStore'

export default defineComponent({
  name: 'PasswordDialog',
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
  computed: {
    isJoinable() {
      return this.chatStore.joinInfo.password !== ''
    }
  }
})
</script>

<style scoped></style>
