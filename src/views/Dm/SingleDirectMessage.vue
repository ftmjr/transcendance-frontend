<template>
  <MessageTopBar
    :isLeftSidebarOpen="isLeftSidebarOpen"
    :contact="conversationWith"
    @update:is-left-sidebar-open="(val) => $emit('update:isLeftSidebarOpen', val)"
  />
  <PerfectScrollbar
    ref="MessagesLogScroller"
    tag="ul"
    :options="{ wheelPropagation: false }"
    class="flex-grow-1"
  >
    <VCard class="chat-log" :loading="loading">
      <div
        v-for="(msgGrp, index) in msgGroups"
        :key="msgGrp.senderId + String(index)"
        class="chat-group d-flex align-start"
        :class="[
          {
            'flex-row-reverse': msgGrp.senderId !== conversationWith.id,
            'mb-8': msgGroups.length - 1 !== index
          }
        ]"
      >
        <div class="chat-avatar" :class="msgGrp.senderId !== conversationWith.id ? 'ms-4' : 'me-4'">
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
                ? 'bg-surface chat-left'
                : 'bg-primary text-white chat-right',
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
    </VCard>
  </PerfectScrollbar>

  <VForm class="chat-log-message-form mb-5 mx-5" @submit.prevent="sendMessage">
    <VTextField
      v-model="mpContent"
      variant="solo"
      class="transparent-input-box"
      placeholder="Ecrivez votre message..."
      density="default"
      autofocus
    >
      <template #append-inner>
        <VBtn @click="sendMessage"> Envoyer un MP </VBtn>
      </template>
    </VTextField>
  </VForm>
</template>

<script lang="ts">
import useMessageStore, { PrivateMessage } from '@/stores/MessageStore'
import { PropType, defineComponent } from 'vue'
import type { User } from 'Auth'
import MessageTopBar from '@/components/Message/MessageTopBar.vue'
import useAuthStore from '@/stores/AuthStore'
import { formatDate } from '@/vuetify/@core/utils/formatters'

interface MessageGroup {
  senderId: number
  messages: Array<{ id: number; message: string; time: string }>
}
export default defineComponent({
  components: {
    MessageTopBar
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
  setup() {
    const authStore = useAuthStore()
    const messageStore = useMessageStore()
    return {
      messageStore,
      authStore
    }
  },
  emits: ['update:isLeftSidebarOpen'],
  data() {
    return {
      loading: false,
      take: 20,
      skip: 0,
      messages: [] as PrivateMessage[],
      mpContent: ''
    }
  },
  computed: {
    msgGroups(): MessageGroup[] {
      const _msgGroups: MessageGroup[] = []
      const messages = this.messages
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
    }
  },
  methods: {
    async loadPrivateMessages() {
      this.loading = true
      const messages = (await this.messageStore.getPrivateMessageBetween({
        userTwoId: this.conversationWith.id,
        skip: this.skip,
        take: this.take
      })) as PrivateMessage[]
      messages.forEach((m: PrivateMessage) => this.messages.push(m))
      this.loading = false
    },
    async sendMessage() {
      this.loading = true
      const message = await this.messageStore.sendPrivateMessage({
        receiverId: this.conversationWith.id,
        content: this.mpContent
      })
      if (message) {
        this.messages.push(message)
      }
      this.loading = false
    },
    formatDate
  },
  watch: {
    conversationWith() {
      this.messages = []
      this.skip = 0
      this.take = 20
      this.loadConversations()
    }
  }
})
</script>

<style></style>
