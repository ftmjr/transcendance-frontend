<template>
  <div class="h-full">
    <ChatConversationTopBar
      :is-left-sidebar-open="isLeftSidebarOpen"
      :room="room"
      :room-members="roomMembers"
      :user-role="userRole"
      @update:is-left-sidebar-open="(val) => $emit('update:isLeftSidebarOpen', val)"
      @show-admin-sidebar="$emit('showAdminSidebar')"
    />
    <PerfectScrollbar
      ref="MessagesLogScroller"
      tag="ul"
      :options="{ wheelPropagation: false }"
      class="h-4/6"
    >
      <li
        v-for="message in messages"
        :key="message"
      >
        {{ message }}
      </li>
    </PerfectScrollbar>
    <VDivider class="my-1" />
    <VForm
      class="mx-2"
      @submit.prevent="sendMessage"
    >
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
          <VBtn
            type="submit"
            @click.prevent="sendMessage"
          >
            Envoyer
          </VBtn>
        </template>
      </VTextField>
    </VForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useRoomsStore, { ChatRoomWithMembers, MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
import ChatConversationTopBar from '@/components/chatRooms/ChatConversationTopBar.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import useAuthStore from '@/stores/AuthStore'
import { ChatMemberRole } from '@/utils/chatSocket'

export default defineComponent({
  components: { ChatConversationTopBar, PerfectScrollbar },
  props: {
    isLeftSidebarOpen: {
      type: Boolean,
      default: false
    },
    room: {
      type: Object as PropType<ChatRoomWithMembers>,
      required: true
    },
    roomMembers: {
      type: Array as PropType<MemberRoomWithUserProfiles[]>,
      required: true,
      default: () => []
    }
  },
  emits: ['update:isLeftSidebarOpen', 'showAdminSidebar'],
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
    userRole(): ChatMemberRole {
      const roomMembers = this.roomStore.getCurrentRoomMembers
      const member = roomMembers.find((member) => member.member.id === this.authStore.getUser?.id)
      return member?.role ?? ChatMemberRole.USER
    },
    chatLogPS(): PerfectScrollbar {
      return this.$refs.MessagesLogScroller as PerfectScrollbar
    },
    canWrite(): boolean {
      return this.userRole !== ChatMemberRole.BAN
    }
  },
  watch: {},
  methods: {
    // fetch messages
    async fetchMessages() {
      // @TODO fetch messages on this room
    },
    // send message
    async sendMessage() {
      // @TODO send chat
    },
    scrollToBottomInChatLog() {
      const scrollEl = this.chatLogPS.$el
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
  }
})
</script>
