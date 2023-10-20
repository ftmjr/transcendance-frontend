<template>
  <v-card
    class="messages"
    flat
  >
    <v-card-text
      class="flex-grow-1 overflow-y-auto"
      style="height: 400px"
    >
      <div
        v-for="msg in chatStore.messages"
        :key="msg.id"
        :class="{ 'd-flex flex-row-reverse': chatStore.isMyDm(msg) }"
      >
        <v-hover v-slot="{ hover }">
          <v-avatar size="30">
            <v-img :src="msg.sender.profile.avatar" />
          </v-avatar>
          <v-chip
            :color="chatStore.isMyDm(msg) ? 'primary' : ''"
            dark
            style="height: auto; white-space: normal"
            class="pa-4 mb-2"
          >
            <span
              v-if="msg.sender"
              class="font-bold"
            >{{ msg.sender.username }}:</span>
            &nbsp; {{ msg.text }}
            <sub
              class="ml-2"
              style="font-size: 0.5rem"
            >{{
              chatStore.formatMessageDate(msg.timestamp, true)
            }}</sub>
            <v-icon
              v-if="hover"
              small
            >
              expand_more
            </v-icon>
          </v-chip>
        </v-hover>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useGlobalStore from '@/stores/GlobalStore'
import useChatStore from '@/stores/ChatStore'

export default defineComponent({
  name: 'DmContainer',
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    return { chatStore, globalStore }
  }
})
</script>

<style scoped></style>
