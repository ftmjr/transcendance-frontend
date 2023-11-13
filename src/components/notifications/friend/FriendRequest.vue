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
      <div
        v-if="notification.status !== 'READ'"
        class="absolute h-2 w-2 right-0 top-1/2 -translate-y-1/2 rounded-full bg-green-400/50 z-50"
      ></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useRouter } from 'vue-router'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import { Notification } from '@/utils/notificationSocket'
import useNotificationStore from '@/stores/NotificationStore'

// Friend request
// {
//   // userId: number, // current user, user receiving the notification
//   type: NotificationType.FRIEND_REQUEST,
//   title: `Demande d'amitié`,
//   message: message,
//   referenceId: sourceUserId,
// }

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

const router = useRouter()

const notificationStore = useNotificationStore()
const handleDelete = (e: Event) => {
  e.preventDefault()
  notificationStore.deleteNotification(notification.id)
}

const handleRead = (e: Event) => {
  e.preventDefault()
  notificationStore.markNotificationAsRead(notification.id)
  router.push({
    name: 'user-profile',
    params: { userId: notification.referenceId }
  })
}
</script>

<style scoped></style>
