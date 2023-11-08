<template>
  <div
    :class="[
      'flex justify-between items-start gap-1 py-3 px-3 rounded-md gap-4',
      notification.status === 'READ' ? 'bg-[#343851]/30' : 'bg-green-600/30'
    ]"
  >
    <div v-if="isShort">

    </div>
    <div v-else>

    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Notification } from '@/utils/notificationSocket'

// Game invitation type
// {
// userId: number, // current user
// type: NotificationType.GAME_EVENT,
// title: 'Joined Game',
// message: message, // like `<a href="/users/show/${user.id}">${user.username}</a> a été ajouté à la partie`
// referenceId: gameId,
// }
// nothing to do only make notification read

const { notification } = defineProps({
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
