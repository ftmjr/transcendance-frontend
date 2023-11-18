<template>
  <div class="flex flex-col flex-1 h-full">
    <div class="w-full border-b h-14 text-primary">
      <div class="flex items-center justify-between w-full h-full">
        <v-btn
          @click="roomStore.toggleLeftNav()"
          icon
          color="transparent"
          class="inline-block lg:hidden"
        >
          <v-icon icon="ion:menu"></v-icon>
        </v-btn>
        <room-settings />
        <v-btn
          @click="roomStore.toggleRightNav"
          icon
          color="transparent"
          class="inline-block md:hidden"
        >
          <v-icon>heroicons:user-group-solid</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="relative flex-1 w-full pb-0 overflow-hidden">
      <div class="w-full h-full">
        <perfect-scrollbar
          tag="ul"
          :options="{
            wheelPropagation: false,
            suppressScrollX: true
          }"
          ref="MessagesLogScroller"
          id="messages-log"
          class="flex flex-col h-full gap-4 px-4 pt-6 pb-16 overflow-scroll hide-scroolbar"
        >
          <li
            :key="`message-group-${index}`"
            :class="msgGrp.senderId === authStore.getUser!.id ? 'self-end' : 'self-start'"
            v-for="(msgGrp, index) in msgGroups"
          >
            <message :is-sender="msgGrp.senderId === authStore.getUser!.id" :msg-group="msgGrp" />
          </li>
        </perfect-scrollbar>
      </div>
      <div
        class="absolute w-full px-8 py-2 h-[65px] bottom-0 bg-gradient-to-b from-cyan-900/0 to-[50%] to-cyan-950"
      >
        <form action="" class="flex items-center justify-center w-full h-full">
          <div class="w-full h-[40px] relative">
            <input
              type="text"
              placeholder="Envoyer un message dans le chat général"
              name=""
              id=""
              class="w-full h-full px-4 text-sm font-light border rounded-md"
              style="background-color: #0e1231"
            />
            <v-btn
              color="transparent"
              @click="sendMessage"
              class="absolute -translate-y-1/2 border right-2 top-1/2"
              size="26"
              icon
            >
              <v-icon color="primary" size="16" icon="mingcute:send-fill"></v-icon>
            </v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore, { ChatRoomWithMembers, MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
import ChatConversationTopBar from '@/components/chatRooms/ChatConversationTopBar.vue'
// @ts-ignore
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import Message from './Message.vue'

import useAuthStore from '@/stores/AuthStore'
import { ChatMemberRole, ChatMessage } from '@/utils/chatSocket'
import { formatDate } from '@core/utils/formatters'
import RoomSettings from './Settings.vue'

export interface ChatMessageGroup {
  senderId: number
  messages: Array<{ id: number; message: string; time: string }>
}
export default defineComponent({
  components: { ChatConversationTopBar, PerfectScrollbar, RoomSettings, Message },
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
      isTypingUserName: ''
    }
  },
  computed: {
    currentChatRoom(): ChatRoomWithMembers | null {
      return this.roomStore.currentRoom
    },
    currentChatRoomMembers(): MemberRoomWithUserProfiles[] {
      return this.roomStore.getCurrentRoomMembers
    },
    userRole(): ChatMemberRole {
      if (!this.currentChatRoomMembers) return ChatMemberRole.BAN
      if (!this.authStore.getUser) return ChatMemberRole.BAN
      const member = this.currentChatRoomMembers.find(
        (member) => member.member.id === this.authStore.getUser?.id
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
    'roomStore.currentReadRoomId': {
      handler(value) {
        if (!value) return
        this.fetchMessages()
      },
      immediate: true
    },
    'roomStore.getRoomMembersTyping': {
      handler() {
        if (!this.currentChatRoom) return
        const lastTypingUserInRoom = this.roomStore.getRoomMembersTyping.get(
          this.currentChatRoom.id
        )
        if (!lastTypingUserInRoom) return
        const now = new Date().getTime()
        const isTyping = now - lastTypingUserInRoom.timestamp < 2000
        if (isTyping) {
          this.isTypingUserName = lastTypingUserInRoom.username
          setTimeout(() => {
            this.isTypingUserName = ''
          }, 1000)
        } else {
          this.isTypingUserName = ''
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
      if (!this.chatMessageContent.trim()) return
      if (this.loading) return
      this.loading = true
      this.roomStore.sendMessage(this.currentChatRoom.id, this.chatMessageContent)
      this.chatMessageContent = ''
      this.loading = false
    },
    async sendIsTyping() {
      if (!this.currentChatRoom) return
      if (!this.authStore.getProfile) return
      this.roomStore.sendUserIsTypingInRoom(this.currentChatRoom.id, this.authStore.getProfile.name)
    },
    getNameOfMember(memberId: number): string {
      if (!this.currentChatRoomMembers) return ''
      const member = this.currentChatRoomMembers.find((member) => member.memberId === memberId)
      if (!member) return ''
      return member.member.profile.name
    },
    getMemberRole(memberId: number): ChatMemberRole {
      if (!this.currentChatRoomMembers) return ChatMemberRole.BAN
      const member = this.currentChatRoomMembers.find((member) => member.memberId === memberId)
      if (!member) return ChatMemberRole.BAN
      return member.role
    },
    getMemberColorText(memberId: number): string {
      const role = this.getMemberRole(memberId)
      switch (role) {
        case ChatMemberRole.OWNER:
          return 'text-yellow-500'
        case ChatMemberRole.ADMIN:
          return 'text-yellow-300'
        case ChatMemberRole.MUTED:
          return 'text-gray-500'
        case ChatMemberRole.BAN:
          return 'text-gray-500'
        default:
          return 'text-gray-500'
      }
    },
    formatDate
  },
  mounted() {}
})
</script>
