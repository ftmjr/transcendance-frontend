<template>
  <div class="h-full w-full flex flex-col">
    <div class="border-b border-gray-50 flex-0">
      <MessageTopBar
        :is-left-sidebar-open="isLeftSidebarOpen"
        :contact="conversationWith"
        :user-game-status="gameStatus"
        @update:is-left-sidebar-open="(val) => $emit('update:isLeftSidebarOpen', val)"
        @refresh-contact="refreshContact"
      />
    </div>
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
            :class="msgGrp.senderId !== conversationWith.id ? 'self-end text-right' : 'self-start'"
          >
            <p
              class="relative message inline-flex flex-col px-6 min-w-[75px] py-2 border shadow-sm rounded-xl drop-shadow-md after:content-[''] after:h-4 after:absolute after:top-full after:translate-x-full after:w-4 after:-z-10 after:-translate-y-1/4"
              :class="
                msgGrp.senderId !== conversationWith.id
                  ? 'text-left mr-0 ml-auto bg-[#1a1f3c] after:bg-[#1a1f3c]'
                  : 'text-left bg-[#343851] after:bg-[#343851]'
              "
            >
              <span v-for="msgData in msgGrp.messages" :key="msgData.time">
                {{ msgData.message }}
              </span>
            </p>
            <span class="text-[.5rem] text-gray-50/90 font-thin block mt-4 px-4">
              {{
                formatDate(msgGrp.messages[msgGrp.messages.length - 1].time, {
                  hour: 'numeric',
                  minute: 'numeric'
                })
              }}
            </span>
          </div>
          <div class="h-8 shrink-0 grow-0 w-full"></div>
        </PerfectScrollbar>
      </div>
    </div>
    <p class="">Test, is typing: {{ isTyping }}</p>
    <div class="flex-0 border shadow-lg drop-shadow-lg rounded-md">
      <VForm @submit.prevent="sendMessage">
        <VTextField
          v-model="mpContent"
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
  </div>
</template>

<script lang="ts">
import useMessageStore, { PrivateMessage } from '@/stores/MessageStore'
import { PropType, defineComponent } from 'vue'
import { User } from '@/interfaces/User'
import MessageTopBar from '@/components/messages/MessageTopBar.vue'
import useAuthStore from '@/stores/AuthStore'
import { formatDate } from '@/vuetify/@core/utils/formatters'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import useGameStore, { GameSession } from '@/stores/GameStore'
import useRoomsStore from '@/stores/RoomsStore'
import useUserStore, { FriendshipStatus } from '@/stores/UserStore'

interface MessageGroup {
  senderId: number
  messages: Array<{ id: number; message: string; time: string }>
}

export default defineComponent({
  components: {
    MessageTopBar,
    PerfectScrollbar
  },
  props: {
    conversationWith: {
      type: Object as PropType<User>,
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
    const messageStore = useMessageStore()
    const roomsStore = useRoomsStore()
    const gameStore = useGameStore()
    const usersStore = useUserStore()
    return {
      messageStore,
      authStore,
      gameStore,
      roomsStore,
      usersStore
    }
  },
  data() {
    return {
      loading: false,
      take: 400,
      skip: 0,
      mpContent: '',
      gameStatus: {
        status: 'free',
        gameSession: undefined
      } as { status: 'playing' | 'inQueue' | 'free'; gameSession?: GameSession },
      now: new Date().getDate(),
      interval: null as NodeJS.Timeout | null,
      friendShip: FriendshipStatus.Friends as FriendshipStatus
    }
  },
  computed: {
    messages(): PrivateMessage[] {
      return this.messageStore.currentConversationMessages
    },
    messagesByTime(): PrivateMessage[] {
      return this.messages.slice().sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      })
    },
    msgGroups(): MessageGroup[] {
      if (this.messagesByTime.length === 0) return []
      const _msgGroups: MessageGroup[] = []
      const messages = this.messagesByTime
      let msgSenderId = messages[0].senderId
      let msgGroup: MessageGroup = {
        senderId: msgSenderId,
        messages: []
      }
      messages.forEach((msg: PrivateMessage, index) => {
        if (msgSenderId === msg.senderId) {
          msgGroup.messages.push({ id: msg.id, message: msg.text, time: msg.timestamp })
        } else {
          msgSenderId = msg.senderId
          _msgGroups.push(msgGroup)
          msgGroup = {
            senderId: msg.senderId,
            messages: [
              {
                id: msg.id,
                message: msg.text,
                time: msg.timestamp
              }
            ]
          }
        }
        if (index === messages.length - 1) _msgGroups.push(msgGroup)
      })
      return _msgGroups
    },
    chatLogPS(): PerfectScrollbar {
      return this.$refs.MessagesLogScroller as PerfectScrollbar
    },
    isTyping(): boolean {
      const typingContacts = this.roomsStore.getContactTyping
      const isCurrentContactTyping = typingContacts.find(
        (contact) =>
          contact.userId === this.conversationWith.id && contact.timestamp < this.now - 2000
      )
      return !!isCurrentContactTyping
    },
    canWrite(): boolean {
      return this.friendShip === FriendshipStatus.Friends
    }
  },
  watch: {
    conversationWith: {
      handler() {
        this.loadPrivateMessages()
        this.fetchAllStatus()
      },
      deep: true,
      immediate: true
    }
  },
  onMounted() {
    // refresh time every 5s
    this.interval = setInterval(() => {
      this.now = new Date().getTime()
    }, 5000)
  },
  onUnmounted() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    refreshContact() {
      this.fetchAllStatus()
    },
    async loadPrivateMessages() {
      this.loading = true
      await this.messageStore.getPrivateMessageBetween({
        userTwoId: this.conversationWith.id,
        skip: this.skip,
        take: this.take
      })
      this.loading = false
      this.$nextTick(() => {
        this.scrollToBottomInChatLog()
      })
    },
    async sendMessage() {
      if (this.loading) return
      if (!this.mpContent.trim()) return
      this.loading = true
      this.messageStore.sendPrivateMessage(this.conversationWith.id, this.mpContent.trim())
      this.mpContent = ''
      this.loading = false
      this.$nextTick(() => {
        this.scrollToBottomInChatLog()
      })
    },
    async sendIsTyping() {
      this.messageStore.sendUserIsTyping(this.conversationWith.id)
    },
    async fetchAllStatus() {
      this.gameStatus = await this.gameStore.getUserGameStatus(this.conversationWith.id)
      const friendTest = await this.usersStore.checkFriendShip(this.conversationWith.id)
      this.friendShip = friendTest.status
    },
    scrollToBottomInChatLog() {
      const scrollEl = this.chatLogPS?.$el
      if (!scrollEl) return
      scrollEl.scrollTop = scrollEl.scrollHeight
    },
    scrollToTopInChatLog() {
      const scrollEl = this.chatLogPS?.$el
      if (!scrollEl) return
      scrollEl.scrollTop = 0
    },
    formatDate
  }
})
</script>

<style lang="scss" scoped></style>
