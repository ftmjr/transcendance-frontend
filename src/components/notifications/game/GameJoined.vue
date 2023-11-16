<template>
  <button
    :disabled="notification.status === 'READ'"
    class="relative block w-full p-4 hover:bg-[#01051e] cursor-pointer"
    @click="handleRead"
  >
    <div class="flex gap-4 w-full relative">
      <div :class="[notification.status === 'READ' ? 'opacity-50' : 'opacity-100']">
        <avatar-badge :user-id="notification.referenceId"></avatar-badge>
      </div>
      <div class="flex-1 flex-col pr-4">
        <p
          :class="[
            'text-left text-sm fomt-semiBold',
            notification.status === 'READ' ? 'text-gray-700/50' : ''
          ]"
        >
          {{ notification.title }}
        </p>
        <p
          :class="[
            'text-left text-xs',
            notification.status === 'READ' ? 'text-gray-700/50' : 'text-gray-500/50'
          ]"
        >
          {{ notification.message }}
        </p>
        <div class="flex gap-2 mt-4">
          <button
            class="px-8 py-2 rounded-md border border-gray-50/10 text-xs bg-green-700/50 hover:bg-green-700/60 text-gary-500"
          >
            Jouer
          </button>
          <button
            class="px-4 py-2 rounded-md border border-gray-50/10 text-xs bg-red-700/50 hover:bg-red-700/60 text-gary-500"
          >
            Refuser
          </button>
        </div>
      </div>
      <div
        v-if="notification.status !== 'READ'"
        class="absolute h-2 w-2 right-0 top-1/2 -translate-y-1/2 rounded-full bg-green-400/50 z-50"
      ></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Notification } from '@/utils/notificationSocket'

const { isShort, notification } = defineProps({
  notification: {
    type: Object as PropType<Notification>,
    required: true
  },
  isShort: {
    type: Boolean,
    default: false
  }
})
const handleRead = (e: Event) => {
  e.preventDefault()
}
</script>

<style scoped></style>
