<template>
  <div class="h-full">
    <MessageTopBar
      :is-left-sidebar-open="isLeftSidebarOpen"
      :contact="conversationWith"
      :user-game-status="gameStatus"
      @update:is-left-sidebar-open="(val) => $emit('update:isLeftSidebarOpen', val)"
    />
    <VDivider class="mb-1" />
    <PerfectScrollbar
      ref="MessagesLogScroller"
      tag="ul"
      :options="{
        wheelPropagation: false,
        suppressScrollX: true
      }"
      class="h-4/6"
    >
      <div
        v-for="(msgGrp, index) in msgGroups"
        :key="msgGrp.senderId + String(index)"
        class="chat-group flex items-center"
        :class="[
          {
            'flex-row-reverse': msgGrp.senderId !== conversationWith.id,
            'mb-8': msgGroups.length - 1 !== index
          }
        ]"
      >
        <div
          class="chat-avatar"
          :class="msgGrp.senderId !== conversationWith.id ? 'ms-4' : 'me-4'"
        >
          <VAvatar size="38">
            <VImg
              :src="
                msgGrp.senderId === conversationWith.id
                  ? conversationWith.profile.avatar
                  : authStore.getProfile?.avatar
              "
            />
          </VAvatar>
        </div>
        <div
          class="chat-body d-inline-flex flex-column"
          :class="msgGrp.senderId !== conversationWith.id ? 'align-end' : 'align-start'"
        >
          <p
            v-for="(msgData, msgIndex) in msgGrp.messages"
            :key="msgData.time"
            class="chat-content text-sm py-3 px-4 elevation-1"
            :class="[
              msgGrp.senderId === conversationWith.id
                ? 'bg-slate-700/30 rounded-lg chat-left'
                : 'bg-slate-400/30 rounded-lg text-white chat-right',
              msgGrp.messages.length - 1 !== msgIndex ? 'mb-2' : 'mb-1'
            ]"
          >
            {{ msgData.message }}
          </p>
          <div :class="{ 'text-right': msgGrp.senderId !== conversationWith.id }">
            <span class="text-xs me-1 text-disabled">{{
              formatDate(msgGrp.messages[msgGrp.messages.length - 1].time, {
                hour: 'numeric',
                minute: 'numeric'
              })
            }}</span>
          </div>
        </div>
      </div>
    </PerfectScrollbar>
    <VDivider class="my-1" />
    <VForm @submit.prevent="sendMessage">
      <VTextField
        v-model="mpContent"
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
            Envoyer un MP
          </VBtn>
        </template>
      </VTextField>
    </VForm>
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
import useGameStore from '@/stores/GameStore'

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
  emits: ['update:isLeftSidebarOpen', 'refreshContact'],
  setup() {
    const authStore = useAuthStore()
    const messageStore = useMessageStore()
    const gameStore = useGameStore()
    return {
      messageStore,
      authStore,
      gameStore
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
      }
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
    }
  },
  watch: {
    conversationWith: {
      handler() {
        this.loadPrivateMessages()
        this.fetchGameStatus()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    refreshContact() {
      this.$emit('refreshContact')
      this.fetchGameStatus()
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
      this.loading = true
      this.messageStore.sendPrivateMessage(this.conversationWith.id, this.mpContent)
      this.mpContent = ''
      this.loading = false
      this.$nextTick(() => {
        this.scrollToBottomInChatLog()
      })
    },
    async fetchGameStatus() {
      this.gameStatus = await this.gameStore.getUserGameStatus(this.conversationWith.id)
    },
    scrollToBottomInChatLog() {
      const scrollEl = this.chatLogPS.$el
      scrollEl.scrollTop = scrollEl.scrollHeight
    },
    scrollToTopInChatLog() {
      const scrollEl = this.chatLogPS.$el
      scrollEl.scrollTop = 0
    },
    formatDate
  }
})
</script>

<style lang="scss" scoped></style>
