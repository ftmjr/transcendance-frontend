<template>
  <v-dialog max-width="500px">
    <v-card>
      <v-card-title>Enter New Password or Leave Empty to</v-card-title>
      <v-card-text>
        <v-alert
          v-if="chatStore.isError"
          type="error"
          title="Action Failed"
          :text="chatStore.error"
        />
        <v-text-field
          v-model="chatStore.joinInfo.password"
          label="Password"
          type="password"
          :error-messages="chatStore.error"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn @click="chatStore.updateRoomPassword">
          Update
        </v-btn>
        <v-btn
          color="error"
          @click="globalStore.closeRoomPasswordDialog"
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
import globalStore from '@/stores/GlobalStore'

export default defineComponent({
  name: 'RoomPasswordDialog',
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
  methods: { globalStore }
})
</script>

<style scoped></style>
