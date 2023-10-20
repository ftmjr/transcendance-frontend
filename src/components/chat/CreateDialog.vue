<template>
  <v-dialog
    v-model="globalStore.dialogs.create"
    max-width="500px"
  >
    <v-card>
      <v-card-title>Create Chat Room</v-card-title>
      <v-alert
        v-if="chatStore.error !== ''"
        color="error"
        icon="$error"
        title="Action Failure"
        :text="chatStore.error"
      />
      <v-card-text>
        <v-text-field
          v-model="chatStore.createInfo.name"
          label="Chatroom Name"
          :error-messages="chatStore.error"
        />
        <v-text-field
          v-if="chatStore.createInfo.protected"
          v-model="chatStore.createInfo.password"
          label="Password"
          type="password"
        />
        <v-switch
          v-model="chatStore.createInfo.protected"
          label="Protected"
          color="indigo"
        />
        <v-switch
          v-model="chatStore.createInfo.private"
          label="Private"
          color="indigo"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          :color="isCreatable ? 'primary' : 'disabled'"
          :disabled="!isCreatable"
          @click="chatStore.createRoom()"
        >
          Create
        </v-btn>
        <v-btn
          color="error"
          @click="chatStore.resetCreateForm"
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
  name: 'CreateDialog',
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    return { chatStore, globalStore }
  },
  computed: {
    isCreatable() {
      if (this.chatStore.createInfo.name === '') {
        return false
      }
      if (this.chatStore.createInfo.protected) {
        console.log(this.chatStore.createInfo.password)
        return this.chatStore.createInfo.password !== ''
      }
      return true
    }
  }
})
</script>

<style scoped></style>
