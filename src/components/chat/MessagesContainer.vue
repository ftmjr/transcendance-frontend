<template>
  <v-card
    class="message-container"
    flat
  >
    <v-card-text
      ref="messageContainer"
      class="flex-grow-1 overflow-y-auto"
    >
      <v-virtual-scroll
        :items="chatStore.getMessages"
        height="400"
      >
        <template #default="{ item: msg }">
          <div :class="{ 'd-flex flex-row-reverse': chatStore.isMyMessage(msg) }">
            <v-hover v-slot="{ hover }">
              <v-chip
                :color="chatStore.isMyMessage(msg) ? 'primary' : ''"
                dark
                style="height: auto; white-space: normal"
                class="pa-4 mb-2"
              >
                <v-avatar size="30">
                  <v-img :src="msg.user.profile.avatar" />
                </v-avatar>
                &nbsp; {{ msg.content }}
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
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useGlobalStore from '@/stores/GlobalStore'
import useChatStore from '@/stores/ChatStore'

export default defineComponent({
  name: 'MessagesContainer',
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    return { chatStore, globalStore }
  }
})
</script>

<style scoped></style>
