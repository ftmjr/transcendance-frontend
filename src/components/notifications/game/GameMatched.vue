<template>
  <button
    :disabled="true"
    class="relative block w-full p-4 hover:bg-[#01051e] cursor-pointer opacity-80"
  >
    <div class="relative flex w-full gap-4">
      <div :class="[isExpired ? 'opacity-85' : 'opacity-100']">
        <v-icon class="text-2xl" color="orange">tabler:device-gamepad-2</v-icon>
      </div>
      <div class="flex-col flex-1 pr-4">
        <p :class="['text-left text-sm fomt-semiBold', isExpired ? 'text-gray-400/75' : '']">
          {{ notification.title }}
        </p>
        <p :class="['text-left text-xs', isExpired ? 'text-gray-400/75' : 'text-gray-500/75']">
          {{ notification.message }}
        </p>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, PropType, ref, onBeforeUnmount } from "vue";
import { Notification as NotificationT } from '@/utils/notificationSocket'

const props = defineProps({
  notification: {
    type: Object as PropType<NotificationT>,
    required: true
  },
  isShort: {
    type: Boolean,
    default: false
  }
})

const now = ref(new Date().getTime())
const isExpired = computed(() => {
  if (!props.notification?.expiresAt) return false
  const expireTime = new Date(props.notification?.expiresAt).getTime()
  return now.value > expireTime
})
// update now every second
const interval = setInterval(() => {
  now.value = new Date().getTime()
}, 1000)

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>

</style>
