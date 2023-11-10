<template>
  <div
    :class="[
      'flex justify-between items-start gap-1 py-3 px-3 rounded-md gap-4',
      notification.status === 'READ' ? 'bg-[#343851]/30' : 'bg-green-600/30'
    ]"
  >
    <div v-if="isShort" />
    <div v-else />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Notification } from '@/utils/notificationSocket'

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
