<template>
  <button
    :disabled="isExpired"
    :class="[
      'relative block w-full p-4 hover:bg-[#01051e] cursor-pointer',
      notification.status === 'READ' ? 'opacity-75' : 'opacity-100'
    ]"
    @click="handleRead"
  >
    <div class="relative flex w-full gap-4">
      <div :class="[isExpired ? 'opacity-50' : 'opacity-100']">
        <!-- <avatar-badge :user-id="notification.referenceId"></avatar-badge> -->
        <VIcon class="text-2xl" color="orange">tabler:device-gamepad-2</VIcon>
      </div>
      <div class="flex-col flex-1 pr-4">
        <p :class="['text-left text-sm fomt-semiBold', isExpired ? 'text-gray-400/75' : '']">
          {{ notification.title }}
        </p>
        <p :class="['text-left text-xs', isExpired ? 'text-gray-400/75' : 'text-gray-200/75']">
          {{ notification.message }}
        </p>
        <p v :class="['text-left text-xs', isExpired ? 'text-gray-400/75' : 'text-gray-200/75']">
          <span v-if="!isExpired">
            Vous avez {{ formatTime(minutes) }}:{{ formatTime(secondes) }} pour rejoindre la partie
          </span>
          <span v-else> Cette invitation a expiré </span>
        </p>
        <div class="flex gap-2 mt-4">
          <button
            :disabled="isExpired"
            @click="hanleJoinGame"
            class="basis-full cursor-pointer px-8 py-2 rounded-md border border-gray-50/10 text-xs bg-green-700/50 hover:bg-green-700/60 text-gary-500 disabled:bg-gray-800/75 disabled:opacity-75 max-w-[200px]"
          >
            Jouer
          </button>
        </div>
      </div>
      <div
        v-if="notification.status !== 'READ'"
        class="absolute right-0 z-50 w-2 h-2 -translate-y-1/2 rounded-full top-1/2 bg-green-400/50"
      ></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useRouter } from 'vue-router'
import { Notification } from '@/utils/notificationSocket'
import useNotificationStore from '@/stores/NotificationStore'
import useGameStore from '@/stores/GameStore'
import { computed, ref, onBeforeUnmount, onMounted } from 'vue'

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
  handleRead(e)

  router.push({
    name: 'game',
    params: { gameId: notification.referenceId }
    // query: { isPlayer: 'true' }
  })
}

const handleReject = (e: Event) => {
  e.preventDefault()
  gameStore.refuseGameInvitation(notification.referenceId)
  handleRead(e)
}

const now = new Date().getTime()
const expiresAt = new Date(notification.expiresAt).getTime()

const isExpired = ref(now >= expiresAt)

const minutes = ref(Math.floor((expiresAt - now) / 1000 / 60))
const secondes = ref(Math.floor((expiresAt - now) / 1000) % 60)

const updateCountDown = () => {
  const now = new Date().getTime()
  const timeLeft = expiresAt - now

  isExpired.value = timeLeft <= 0

  if (timeLeft <= 0 && interval) {
    clearInterval(interval)
    return
  }

  minutes.value = Math.floor(timeLeft / 1000 / 60)
  secondes.value = Math.floor((timeLeft / 1000) % 60)
}

const formatTime = (time: number) => {
  return time < 10 ? `0${time}` : `${time}`
}

let interval: NodeJS.Timer | null = null

onMounted(() => {
  if (!isExpired.value) {
    interval = setInterval(updateCountDown, 1000)
  } else {
    if (notification.status !== 'READ') handleRead(new Event('click'))
  }
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped></style>
