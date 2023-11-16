<template>
  <div class="h-full">
    <ChatConversationTopBar
      :is-left-sidebar-open="isLeftSidebarOpen"
      :is-right-sidebar-open="isRightSidebarOpen"
      @update:is-left-sidebar-open="(val) => $emit('update:isLeftSidebarOpen', val)"
      @update:is-right-sidebar-open="(val) => $emit('update:isRightSidebarOpen', val)"
      :user-role="userRole"
    />
    <template v-if="currentChatRoom && !loading">
      <div class="flex-1 w-full overflow-scroll hide-scroolbar">
        <div class="h-full w-full flex flex-col gap-4">
          <PerfectScrollbar
            ref="MessagesLogScroller"
            tag="ul"
            :options="{
              wheelPropagation: false,
              suppressScrollX: true
            }"
            class="h-full"
          >
            <div
              v-for="(msgGrp, index) in msgGroups"
              :key="index"
              class="p-2"
              :class="
                msgGrp.senderId === authStore.getUser.id ? 'self-end text-right' : 'self-start'
              "
            >
              <p
                class="relative message inline-flex flex-col px-6 min-w-[75px] py-2 border shadow-sm rounded-xl drop-shadow-md after:content-[''] after:h-4 after:absolute after:top-full after:translate-x-full after:w-4 after:-z-10 after:-translate-y-1/4"
                :class="
                  msgGrp.senderId === authStore.getUser.id
                    ? 'text-left mr-0 ml-auto bg-[#1a1f3c] after:bg-[#1a1f3c]'
                    : 'text-left bg-[#343851] after:bg-[#343851]'
                "
              >
                <span v-for="msgData in msgGrp.messages" :key="msgData.time">
                  {{ msgData.message }}
                </span>
              </p>
              <p>
                <span class="text-[.5rem] text-gray-50/90 font-thin block mt-4 px-4">
                  {{
                    formatDate(msgGrp.messages[msgGrp.messages.length - 1].time, {
                      hour: 'numeric',
                      minute: 'numeric'
                    })
                  }}
                </span>
                <span class="font-thin">
                  {{
                    currentChatRoomMembers.find((member) => member.id === msgGrp.senderId).member
                      .profile.name
                  }}
                </span>
              </p>
            </div>
            <div class="h-8 shrink-0 grow-0 w-full"></div>
          </PerfectScrollbar>
        </div>
      </div>
      <p v-if="isTyping.length" class="font-weight-medium">
        {{ isTyping }}
        <span class="text-sm font-weight-light pr-1">est en train d'écrire</span>
        <VIcon :size="24" color="primary" icon="svg-spinners:3-dots-bounce" />
      </p>
      <div class="flex-0 border shadow-lg drop-shadow-lg rounded-md">
        <VForm @submit.prevent="sendMessage">
          <VTextField
            v-model="chatMessageContent"
            :disabled="!canWrite"
            variant="solo"
            placeholder="Ecrivez votre message..."
            density="default"
            autofocus
            @keyup="sendIsTyping"
          >
            <template #append-inner>
              <VBtn @click.stop.prevent="sendMessage" rounded>
                <svg
                  class="fill-current text-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"
                  />
                </svg>
              </VBtn>
            </template>
          </VTextField>
        </VForm>
      </div>
    </template>
    <div v-else-if="loading" class="flex items-center justify-center h-full">
      <v-progress-circular :size="70" :width="7" color="sky" indeterminate />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore, { ChatRoomWithMembers, MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
import ChatConversationTopBar from '@/components/chatRooms/ChatConversationTopBar.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import useAuthStore from '@/stores/AuthStore'
import { ChatMemberRole, ChatMessage } from '@/utils/chatSocket'
import { formatDate } from '@core/utils/formatters'

interface ChatMessageGroup {
  senderId: number
  messages: Array<{ id: number; message: string; time: string }>
}
export default defineComponent({
  components: { ChatConversationTopBar, PerfectScrollbar },
  props: {
    isLeftSidebarOpen: {
      type: Boolean,
      default: false
    },
    isRightSidebarOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:isLeftSidebarOpen', 'update:isRightSidebarOpen'],
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
      take: 400,
      skip: 0,
      chatMessageContent: '',
      loading: false,
      isTyping: ''
    }
  },
  computed: {
    currentChatRoom(): ChatRoomWithMembers | null {
      return this.roomStore.currentRoom
    },
    currentChatRoomMembers(): MemberRoomWithUserProfiles[] {
      return this.roomStore.currentRoomMembers
    },
    userRole(): ChatMemberRole {
      if (!this.currentChatRoom) return ChatMemberRole.BAN
      if (!this.authStore.getUser) return ChatMemberRole.BAN
      const member = this.currentChatRoomMembers.find(
        (member) => member.id === this.authStore.getUser?.id
      )
      if (!member) return ChatMemberRole.BAN
      return member.role
    },
    messages(): ChatMessage[] {
      return this.roomStore.getCurrentRoomMessages
    },
    messagesByTime(): ChatMessage[] {
      return this.messages.slice().sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      })
    },
    msgGroups(): ChatMessageGroup[] {
      if (this.messagesByTime.length === 0) return []
      const _msgGroups: ChatMessageGroup[] = []
      const messages = this.messagesByTime
      let msgSenderId = messages[0].userId
      let msgGroup: ChatMessageGroup = {
        senderId: msgSenderId,
        messages: []
      }
      messages.forEach((msg: ChatMessage, index) => {
        if (msgSenderId === msg.userId) {
          msgGroup.messages.push({ id: msg.id, message: msg.content, time: msg.timestamp })
        } else {
          msgSenderId = msg.userId
          _msgGroups.push(msgGroup)
          msgGroup = {
            senderId: msg.userId,
            messages: [
              {
                id: msg.id,
                message: msg.content,
                time: msg.timestamp
              }
            ]
          }
        }
        if (index === messages.length - 1) _msgGroups.push(msgGroup)
      })
      return _msgGroups
    },
    canWrite(): boolean {
      return this.userRole !== ChatMemberRole.BAN && this.userRole !== ChatMemberRole.MUTED
    }
  },
  watch: {
    'roomStore.getRoomMembersTyping': {
      handler() {
        if (!this.currentChatRoom) return
        const lastTypingUserInRoom = this.roomStore.getRoomMembersTyping.get(
          this.currentChatRoom.id
        )
        if (!lastTypingUserInRoom) return
        const now = new Date().getTime()
        const isTyping = now - lastTypingUserInRoom.timestamp < 5000
        if (isTyping) {
          this.isTyping = lastTypingUserInRoom.username
        } else {
          this.isTyping = ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async refreshRoomInfo() {
      // @TODO refresh this room info (members, roles, etc...)
      this.loading = true
      await this.roomStore.reloadCurrentRoomMembers()
      this.loading = false
    },
    // fetch messages
    async fetchMessages() {
      this.loading = true
      await this.roomStore.loadCurrentRoomMessages({ skip: this.skip, take: this.take })
      this.loading = false
    },
    // send message
    async sendMessage() {
      if (!this.currentChatRoom) return
      this.roomStore.sendMessage(this.currentChatRoom.id, this.chatMessageContent)
    },
    async sendIsTyping() {
      if (!this.currentChatRoom) return
      if (!this.authStore.getProfile) return
      this.roomStore.sendUserIsTypingInRoom(this.currentChatRoom.id, this.authStore.getProfile.name)
    },
    scrollToBottomInChatLog() {},
    formatDate
  }
})
</script>
