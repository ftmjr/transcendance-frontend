<template>
  <div
    :class="[
      'flex justify-between items-start gap-1 py-3 px-3 rounded-md gap-4',
      notification.status === 'READ' ? 'bg-[#343851]/30' : 'bg-green-600/30'
    ]"
  >
    <button v-if="isShort" class="">Votre invitation a ete accepte</button>
    <button v-else class=""></button>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Notification } from '@/utils/notificationSocket'

// Game challenge Accepted type
// {
//   // userId: number, // current user
//   type: NotificationType.GAME_INVITE,
//   title: 'Challenge Accepted',
//   message: message,
//   referenceId: gameId,
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
</script>

<style scoped></style>
