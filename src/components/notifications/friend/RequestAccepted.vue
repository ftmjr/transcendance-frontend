<template>
  <div>Request Accepted</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Notification } from '@/utils/notificationSocket'
// import useNotificationStore from '@/stores/NotificationStore'

// Friend request Accepted
// {
//  userId: number, // user receiving the notification
//  type: NotificationType.FRIEND_REQUEST,
//  title: `Demande d'ami acceptée`,
//  message: message,
//  referenceId: friendId,
// }

defineProps({
  notification: {
    type: Object as PropType<Notification>,
    required: true
  },
  isShort: {
    type: Boolean,
    default: false
  }
})

// const notificationStore = useNotificationStore()
//
// const handleDelete = () => {
//   notificationStore.deleteNotification(notification.id)
// }
//
// const handleRead = () => {
//   notificationStore.markNotificationAsRead(notification.id)
// }
</script>

<style scoped></style>
