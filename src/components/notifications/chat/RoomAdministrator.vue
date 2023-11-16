<template>
  <div>Room administrator</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Notification } from '@/utils/notificationSocket'

// Chat room, Added to a room
// userId: number, // current user
// type: NotificationType.PRIVATE_MESSAGE,
// title: 'Added to Chat',
// message: message,
// referenceId: roomId

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
</script>

<style scoped></style>
