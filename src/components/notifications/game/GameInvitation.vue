<template>
  <button
    :disabled="notification.status === 'READ'"
    class="relative block w-full p-4 hover:bg-[#01051e] cursor-pointer"
    @click="handleRead"
  >
    <div class="flex gap-4 w-full relative">
      <div :class="[notification.status === 'READ' ? 'opacity-50' : 'opacity-100']">
        <avatar-badge :user-id="notification.referenceId"></avatar-badge>
      </div>
      <div class="flex-1 flex-col pr-4">
        <p
          :class="[
            'text-left text-sm fomt-semiBold',
            notification.status === 'READ' ? 'text-gray-700/50' : ''
          ]"
        >
          {{ notification.title }}
        </p>
        <p
          :class="[
            'text-left text-xs',
            notification.status === 'READ' ? 'text-gray-700/50' : 'text-gray-500/50'
          ]"
        >
          {{ notification.message }}
        </p>
      </div>
      <div>
        <button class="p-4 rounded-md border border-gray-50/10">Jouer</button>
        <button class="p-4 rounded-md border border-gray-50/10">Refuser</button>
      </div>
      <div
        v-if="notification.status !== 'READ'"
        class="absolute h-2 w-2 right-0 top-1/2 -translate-y-1/2 rounded-full bg-green-400/50 z-50"
      ></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Notification } from '@/utils/notificationSocket'
import useNotificationStore from '@/stores/NotificationStore'

// Game invitation type
// {
//   userId: number, // current user
//   type: NotificationType.GAME_INVITE,
//   title: 'Game Invite',
//   message: message,
//   referenceId: gameId,
//   expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
// }
// invitation to a game need to more than just mark as read on click
// gamestore

const notificationStore = useNotificationStore()

const { isShort, notification } = defineProps({
  notification: {
    type: Object as PropType<Notification>,
    required: true
  },
  isShort: {
    type: Boolean,
    default: false
  }
})

const handleRead = (e: Event) => {
  e.preventDefault()
  notificationStore.markNotificationAsRead(notification.id)
}

const hanleJoinGame = (e: Event) => {
  e.preventDefault()
}

const handleReject = (e: Event) => {
  e.preventDefault()
}
</script>

<style scoped></style>
