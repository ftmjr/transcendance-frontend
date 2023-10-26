<template>
  <a v-if="isShort">
    <div :class="['flex justify-between items-start gap-1 py-3 px-3 rounded-md gap-4', notification.status === 'READ' ? 'bg-[#343851]/30' : 'bg-green-600/30']">
      
    </div>
  </a>
  <a v-else href="">
    <div :class="['flex justify-between items-start gap-1 py-3 px-3 rounded-md gap-4', notification.status === 'READ' ? 'bg-[#343851]/30' : 'bg-green-600/30']"></div>
  </a>
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
</script>

<style scoped></style>
