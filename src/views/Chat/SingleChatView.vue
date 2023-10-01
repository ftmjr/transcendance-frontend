<template>
  <ChatConversationTopBar
    @update:is-left-sidebar-open="(val) => $emit('update:isLeftSidebarOpen', val)"
  />
  <PerfectScrollbar
    ref="MessagesLogScroller"
    tag="ul"
    :options="{ wheelPropagation: false }"
    class="flex-grow-1"
  >
    <VCard class="chat-log" :loading="loading">
      <li>Show messages here, to be implemented</li>
    </VCard>
  </PerfectScrollbar>
  <VForm class="chat-log-message-form mb-5 mx-5" @submit.prevent="sendMessage">
    <VTextField
      v-model="chatMessageContent"
      :disabled="canWrite"
      variant="solo"
      class="transparent-input-box"
      placeholder="Ecrivez votre message..."
      density="default"
      autofocus
    >
      <template #append-inner>
        <VBtn @click="sendMessage"> Envoyer</VBtn>
      </template>
    </VTextField>
  </VForm>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useRoomsStore, { ChatRoomWithMembers } from '@/stores/RoomsStore'
import ChatConversationTopBar from '@/components/rooms/ChatConversationTopBar.vue'

export default defineComponent({
  components: { ChatConversationTopBar },
  props: {
    room: {
      type: Object as PropType<ChatRoomWithMembers>,
      required: true
    },
    isLeftSidebarOpen: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const roomStore = useRoomsStore()
    return {
      roomStore
    }
  },
  data() {
    return {
      chatMessageContent: '',
      loading: false // loading messages
    }
  },
  computed: {
    canWrite(): boolean {
      // @TODO check if user can write in this room
      return false
    }
  },
  methods: {
    // fetch messages
    // send message
    async sendMessage() {
      // @TODO send chat
      // this.roomStore.sendMessage(this.room.id, this.chatMessageContent)
    }
  }
})
</script>
