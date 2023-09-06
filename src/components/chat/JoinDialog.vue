<template>
  <v-dialog :v-model="globalStore.dialogs.join" max-width="500px">
    <v-card>
      <v-card-title>Join Chat Room</v-card-title>
      <v-card-text>
        <v-text-field
          label="Chatroom Name"
          v-model="chatStore.joinInfo.roomName"
          :error-messages="chatStore.error"
        />
        <v-text-field
          label="Password"
          v-model="chatStore.joinInfo.password"
          type="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :color="isJoinable ? 'primary' : 'disabled'"
          @click="chatStore.joinRoom"
          :disabled="!isJoinable"
        >
          Join
        </v-btn>
        <v-btn color="error" @click="chatStore.resetJoinForm">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useGlobalStore from '@/stores/GlobalStore'
import useChatStore from '@/stores/ChatStore'

export default defineComponent({
  name: 'join-dialog',
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
