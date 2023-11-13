<template>
  <button :disabled="isExpired"
    :class="['relative block w-full p-4 hover:bg-[#01051e] cursor-pointer', notification.status === 'READ' ? 'opacity-75' : 'opacity-100']"
    @click="handleRead">
    <div class="flex gap-4 w-full relative">
      <div :class="[isExpired ? 'opacity-50' : 'opacity-100']">
        <avatar-badge :user-id="notification.referenceId"></avatar-badge>
      </div>
      <div class="flex-1 flex-col pr-4">
        <p :class="[
          'text-left text-sm fomt-semiBold',
          isExpired ? 'text-gray-700/50' : ''
        ]">
          {{ notification.title }}
        </p>
        <p :class="[
          'text-left text-xs',
          isExpired ? 'text-gray-700/50' : 'text-gray-500/50'
        ]">
          {{ notification.message }}
        </p>
        <p v :class="[
          'text-left text-xs',
          isExpired ? 'text-gray-700/50' : 'text-gray-500/50'
        ]">
          <span v-if="!isExpired">
            Vous avez xx:xx pour rejoindre la partie
          </span>
          <span v-else>
            Cette invitation a expiré
          </span>
        </p>
        <div class="flex gap-2 mt-4">
          <button :disabled="isExpired" @click="hanleJoinGame"
            class="basis-full cursor-pointer px-8 py-2 rounded-md border border-gray-50/10 text-xs bg-green-700/50 hover:bg-green-700/60 text-gary-500 disabled:bg-gray-800/50 disabled:opacity-20">Jouer</button>
          
        </div>
      </div>
      <div v-if="notification.status !== 'READ'"
        class="absolute h-2 w-2 right-0 top-1/2 -translate-y-1/2 rounded-full bg-green-400/50 z-50"></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useRouter } from 'vue-router';
import { Notification } from '@/utils/notificationSocket'
import useNotificationStore from '@/stores/NotificationStore'
import useGameStore from '@/stores/GameStore';
import { ref, onMounted, onUnmounted, reactive } from 'vue';

// Game invitation type
// {
//   userId: number, // current user
//   type: NotificationType.GAME_INVITE,
//   title: 'Game Challenge Accepted',
//   message: message,
//   referenceId: gameId,
//   expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
// }
// invitation to a game need to more than just mark as read on click
// gamestore

const router = useRouter()
const notificationStore = useNotificationStore()
const gameStore = useGameStore()

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
  if (!e.defaultPrevented) e.preventDefault()
  notificationStore.markNotificationAsRead(notification.id)
}

const hanleJoinGame = (e: Event) => {
  e.preventDefault()
  gameStore.acceptGameInvitation(notification.referenceId)
  handleRead(e);
}

const handleReject = (e: Event) => {
  e.preventDefault()
  gameStore.refuseGameInvitation(notification.referenceId)
  handleRead(e);
}

const isExpired = (() => {
  const now = new Date().getTime();
  const expiresAt = parseInt(notification.expiresAt)
  return now >= expiresAt;
})()

onMounted(() => {
  // Update remaining time every minute
  // const intervalId = setInterval(updateRemainingTime, 60 * 1000);

  // Clear interval when component is unmounted
  // onUnmounted(() => clearInterval(intervalId));
});
</script>

<style scoped></style>
