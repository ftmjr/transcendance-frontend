<template>
  <v-dialog
    :v-model="globalStore.dialogs.join"
    max-width="500px"
  >
    <v-card>
      <v-card-title>Join Chat Room</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="chatStore.joinInfo.roomName"
          label="Chatroom Name"
          :error-messages="chatStore.error"
        />
        <v-text-field
          v-model="chatStore.joinInfo.password"
          label="Password"
          type="password"
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
import useGlobalStore from '@/stores/GlobalStore'
import useChatStore from '@/stores/ChatStore'

export default defineComponent({
  name: 'JoinDialog',
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    return { chatStore, globalStore }
  },
  computed: {
    isJoinable() {
      if (this.chatStore.joinInfo.roomName === '') {
        return false
      }
      if (this.chatStore.selectedRoom.protected) {
        return this.chatStore.joinInfo.password !== ''
      }
      return true
    }
  }
})
</script>

<style scoped></style>
