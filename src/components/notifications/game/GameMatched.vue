<template>
  <div
    @click="handleRead"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, PropType, ref } from 'vue'
import { Notification as NotificationT } from '@/utils/notificationSocket'
import useNotificationStore from '@/stores/NotificationStore'

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
const notificationStore = useNotificationStore()
const now = ref(new Date().getTime())
const expireTime = ref(new Date(props.notification?.expiresAt).getTime())
const isExpired = computed(() => {
  if (!props.notification?.expiresAt) return false
  return now.value > expireTime.value
})

// update now every second
const interval = setInterval(() => {
  now.value = new Date().getTime()
}, 1000)

onBeforeUnmount(() => {
  clearInterval(interval)
})

const handleRead = async () => {
  await notificationStore.markNotificationAsRead(props.notification.id)
}
</script>

<style scoped></style>
