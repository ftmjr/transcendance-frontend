<template>
  <div class="h-full">
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
      class="h-4/6"
    >
      <li v-for="message in messages" :key="message">
        {{ message }}
      </li>
    </PerfectScrollbar>
    <VDivider class="my-1" />
    <VForm @submit.prevent="sendMessage" class="mx-2">
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
          <VBtn type="submit" @click.prevent="sendMessage"> Envoyer </VBtn>
        </template>
      </VTextField>
    </VForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useRoomsStore, { ChatRoomWithMembers } from '@/stores/RoomsStore'
import ChatConversationTopBar from '@/components/rooms/ChatConversationTopBar.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import useAuthStore from '@/stores/AuthStore'

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
    const authStore = useAuthStore()
    const roomStore = useRoomsStore()
    return {
      authStore,
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
    chatLogPS(): PerfectScrollbar {
      return this.$refs.MessagesLogScroller as PerfectScrollbar
    },
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
    },
    scrollToBottomInChatLog() {
      const scrollEl = this.chatLogPS.$el
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
  }
})
</script>
