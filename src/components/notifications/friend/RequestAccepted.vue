<template>
  <div>Request Accepted</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Notification } from '@/utils/notificationSocket'
import useNotificationStore from '@/stores/NotificationStore'

const { notification, isShort} = defineProps({
  notification: {
    type: Object as PropType<Notification>,
    required: true
  },
  isShort: {
    type: Boolean,
    default: false
  }
})

const notificationStore = useNotificationStore()

const handleDelete = (e: Event) => {
  e.preventDefault()
  notificationStore.deleteNotification(notification.id)
}

const handleRead = (e: Event) => {
  e.preventDefault();
  notificationStore.markNotificationAsRead(notification.id)
}
</script>

<style scoped></style>
