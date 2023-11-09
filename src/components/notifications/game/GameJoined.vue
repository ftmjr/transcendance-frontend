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
// const handleRead = (e: Event) => {
//   e.preventDefault();
// }
</script>

<style scoped></style>
