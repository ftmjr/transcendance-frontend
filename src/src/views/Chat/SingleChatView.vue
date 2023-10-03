<template>
  <ChatConversationTopBar
    :isLeftSidebarOpen="isLeftSidebarOpen"
    @update:is-left-sidebar-open="(val) => $emit('update:isLeftSidebarOpen', val)"
    :room="room"
    :room-members="roomStore.getCurrentRoomMembers"
  />
  <PerfectScrollbar
    ref="MessagesLogScroller"
    tag="ul"
    :options="{ wheelPropagation: false }"
    class="flex-grow-1"
  >
    <li v-for="message in messages" :key="message">
      {{ message }}
    </li>
  </PerfectScrollbar>
  <VDivider class="" />
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
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

export default defineComponent({
  components: { ChatConversationTopBar, PerfectScrollbar },
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
  emits: ['update:isLeftSidebarOpen'],
  setup() {
    const roomStore = useRoomsStore()
    return {
      roomStore
    }
  },
  data() {
    return {
      chatMessageContent: '',
      loading: false,
      messages: []
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
    async fetchMessages() {
      // @TODO fetch messages
      // fake messages to test
      this.messages = [
        'Hello',
        'How are you ?',
        "I'm fine and you ?",
        "I'm fine too",
        'What are you doing ?',
        "I'm working on a new project",
        'Oh nice, what is it about ?',
        "It's a new social network",
        'Oh nice, what is it called ?',
        "It's called Socialize",
        "Oh nice, I'll check it out",
        'Ok, see you later'
      ]
    },
    // send message
    async sendMessage() {
      // @TODO send chat
      // this.roomStore.sendMessage(this.room.id, this.chatMessageContent)
    }
  }
})
</script>
