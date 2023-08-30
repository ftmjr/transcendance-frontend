<template>
  <v-dialog max-width="500px">
    <v-card>
      <v-card-title>Enter New Password or Leave Empty to</v-card-title>
      <v-card-text>
        <v-text-field
            label="Password"
            v-model="chatStore.joinInfo.password"
            type="password"
            :error-messages="chatStore.error"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="chatStore.joinRoom">
          Join
        </v-btn>
        <v-btn color="error" @click="chatStore.resetJoinForm">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useChatStore from "@/stores/ChatStore"

export default defineComponent({
  name: 'room-password-dialog',
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
})
</script>

<style scoped></style>
