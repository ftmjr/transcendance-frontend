<template>
  <button
    :disabled="notification.status === 'READ'"
    class="relative block w-full p-4 hover:bg-[#01051e] cursor-pointer"
    @click="handleRead"
  >
    <div class="relative flex w-full gap-4">
      <div :class="[notification.status === 'READ' ? 'opacity-75' : 'opacity-100']">
        <avatar-badge :user-id="notification.referenceId"></avatar-badge>
      </div>
      <div class="flex-col flex-1 pr-4">
        <p
          :class="[
            'text-left text-sm fomt-semiBold',
            notification.status === 'READ' ? 'text-gray-400/75' : ''
          ]"
        >
          {{ notification.title }}
        </p>
        <p
          :class="[
            'text-left text-xs',
            notification.status === 'READ' ? 'text-gray-400/75' : 'text-gray-200/75'
          ]"
        >
          {{ notification.message }}
        </p>
      </div>
      <div
        v-if="notification.status !== 'READ'"
        class="absolute right-0 z-50 w-2 h-2 -translate-y-1/2 rounded-full top-1/2 bg-green-400/75"
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

// Friend request Rejected
// {
//   // userId: number, // current user, user receiving the notification
//   type: NotificationType.FRIEND_REQUEST,
//     title: `Demande d'ami refusée`,
//   message: message,
//   referenceId: friendId,
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

const handleRead = (e: Event) => {
  e.preventDefault()
  console.log('handleRead', notification)
  notificationStore.markNotificationAsRead(notification.id)
}
</script>

<style scoped></style>
