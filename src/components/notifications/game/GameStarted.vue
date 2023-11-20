<template>
  <div
    :class="[
      'relative block w-full p-4 hover:bg-[#01051e]',
      notification.status === 'READ' ? 'opacity-75' : 'opacity-100'
    ]"
    @click.prevent="handleRead"
  >
    <div class="relative flex w-full gap-4">
      <div :class="[isExpired ? 'opacity-50' : 'opacity-100']">
        <v-icon class="text-2xl" color="orange">tabler:device-gamepad-2</v-icon>
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
          <span v-else> Le delais a expiré </span>
        </p>
        <div class="flex gap-2">
          <v-btn
            :disabled="isExpired"
            @click.prevent.stop="hanleJoinGame"
            color="secondary"
            size="small"
          >
            Jouer
          </v-btn>
          <v-btn
           @click.prevent.stop="refuseToPlay"
           color="error"
           size="small"
          >
            Refuser
          </v-btn>
        </div>
      </div>
      <div
        v-if="notification.status !== 'READ'"
        class="absolute right-0 z-50 w-2 h-2 -translate-y-1/2 rounded-full top-1/2 bg-green-400/50"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { Notification as NotificationT } from '@/utils/notificationSocket'
import useGameStore from "@/stores/GameStore";
import useNotificationStore from "@/stores/NotificationStore";

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
const gameStore = useGameStore()
const notificationStore = useNotificationStore();
const router = useRouter();
const now = ref(new Date().getTime())
const expireTime = ref(new Date(props.notification?.expiresAt).getTime())
const isExpired = computed(() => {
  if (!props.notification?.expiresAt) return false
  return now.value > expireTime.value
})
const formatTime = (time: number) => {
  return time < 10 ? `0${time}` : time
}
const minutes = computed(() => {
  if (!props.notification?.expiresAt) return 0;
  const diff = expireTime.value - now.value
  return Math.floor(diff / 1000 / 60)
})
const secondes = computed(() => {
  if (!props.notification?.expiresAt) return 0;
  const diff = expireTime.value - now.value
  return Math.floor((diff / 1000) % 60)
})

// update now every second
const interval = setInterval(() => {
  now.value = new Date().getTime()
}, 1000)

onBeforeUnmount(() => {
  clearInterval(interval)
})

const handleRead = async () => {
  await notificationStore.markNotificationAsRead(props.notification.id);
}

const refuseToPlay = async () => {
  await handleRead();
  await gameStore.quitGameSession(props.notification.id);
}
const hanleJoinGame = async () => {
  await handleRead();
  const gameSession = await gameStore.getAGameSession(props.notification.referenceId);
  if (gameSession) {
    await router.push({
      name: 'game',
      params: { gameId: gameSession.gameId },
    })
  }
}
</script>

<style scoped></style>
