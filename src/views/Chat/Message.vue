<template>
  <div :class="weAreBlocked ? 'blur-xl pointer-events-none' : ''">
    <div class="flex flex-col" :class="[isSender ? 'justify-end items-end' : 'order-2 text-left']">
      <div
        :class="[
          'relative inline-block max-w-xs px-4 py-4 text-sm rounded-md shadow-lg drop-shadow-lg mb-2',
          isSender ? 'reply order-2' : 'sender order-1'
        ]"
        style="background-color: #272b47"
      >
        <p v-for="(msg, index) in msgGroup.messages" :key="index" class="my-2 text-sm">
          {{ msg.message }}
        </p>
      </div>
      <div
        class="items-center inline-block w-48 h-auto gap-4 text-xs font-light grow-0 shrink-0"
        :class="[isSender ? 'order-2 text-right' : 'order-2 text-left']"
      >
        <span class="text-xs text-gray-400">
          {{
            formatDate(msgGroup.messages[msgGroup.messages.length - 1].time, {
              hour: 'numeric',
              minute: 'numeric'
            })
          }}
        </span>
        <div class="flex items-center gap-2" :class="[isSender ? 'justify-end' : 'justify-start']">
          <span class="line-clamp-1">{{ sender.member.username.split(' ').shift() }}</span>
          <VIcon v-if="sender.role === ChatMemberRole.OWNER" :size="16" color="primary">
            tabler-crown
          </VIcon>
          <VIcon v-else-if="sender.role === ChatMemberRole.ADMIN" :size="16" color="secondary">
            tabler-shield-check
          </VIcon>
          <VIcon v-else-if="sender.role === ChatMemberRole.BAN" :size="16" color="gray">
            tabler-user-x
          </VIcon>
          <VIcon v-else-if="sender.role === ChatMemberRole.MUTED" :size="16" color="gray">
            tabler-user-minus
          </VIcon>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatDate } from '@core/utils/formatters'
import useRoomsStore, { MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
import { BlockedStatus } from '@/stores/UserStore'
import { ChatMemberRole } from '@/utils/chatSocket'

interface ChatMessageGroup {
  senderId: number
  messages: Array<{ id: number; message: string; time: string }>
}

export default defineComponent({
  props: {
    msgGroup: {
      type: Object as PropType<ChatMessageGroup>,
      required: true
    },
    isSender: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const roomStore = useRoomsStore()
    return {
      roomStore
    }
  },
  computed: {
    ChatMemberRole() {
      return ChatMemberRole
    },
    sender(): MemberRoomWithUserProfiles | undefined {
      return this.roomStore.getCurrentRoomMembers.find(
        (member) => member.member.id === this.msgGroup.senderId
      )
    },
    isBan(): boolean {
      if (!this.sender) return true
      return this.sender.member.role === 'BAN'
    },
    isAdmin(): boolean {
      if (!this.sender) return false
      return this.sender.member.role === 'ADMIN'
    },
    isOwner(): boolean {
      if (!this.sender) return false
      return this.sender.member.role === 'OWNER'
    },
    weAreBlocked(): boolean {
      if (!this.sender) return true
      const blockStatus = this.roomStore.getCurrentRoomBlockedStatus.find(
        (block) => block.userId === this.sender?.member.id
      )
      return blockStatus?.status !== BlockedStatus.None
    }
  },
  methods: {
    formatDate
  }
})
</script>
<style lang="scss">
.sender::before {
  display: block;
  clear: both;
  content: '';
  position: absolute;
  top: -6px;
  left: -7px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 12px 15px 12px;
  border-color: transparent transparent #272b47 transparent;
  -webkit-transform: rotate(-37deg);
  -ms-transform: rotate(-37deg);
  transform: rotate(-37deg);
}
.reply::before {
  display: block;
  clear: both;
  content: '';
  position: absolute;
  bottom: -5px;
  right: -7.5px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 12px 15px 12px;
  border-color: transparent transparent #272b47 transparent;
  -webkit-transform: rotate(37deg);
  -ms-transform: rotate(37deg);
  transform: rotate(37deg);
}
</style>
