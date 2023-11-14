<template>
  <div class="flex gap-2 items-center">
    <v-chip v-if="userGameStatus.status === 'playing'" color="green" class="flex gap-2">
      <span class="flex gap-2">
        <v-icon left> tabler:device-gamepad </v-icon>
        <span> Dans une partie </span>
      </span>
    </v-chip>
    <v-chip v-else-if="userGameStatus.status === 'inQueue'" color="orange">
      <span class="flex gap-2">
        <v-icon left> ic:baseline-timer </v-icon>
        <span> En attente </span>
      </span>
    </v-chip>
    <v-chip v-else color="blue" class="rounded-md">
      <span class="flex gap-2">
        <v-icon left> mdi-account-check-outline </v-icon>
        <span> Peut jouer </span>
      </span>
    </v-chip>
    <v-btn
      v-if="userGameStatus.gameSession"
      size="small"
      color="deep-purple accent-4"
      :to="{
        name: 'game',
        params: {
          gameId: userGameStatus.gameSession.gameId
        },
        query: {
          waitingRoom: 'false',
          isPlayer: 'false'
        }
      }"
    >
      <span class="flex gap-2">
        <v-icon left> tabler-eye </v-icon>
        <span> Regardez la partie </span>
      </span>
    </v-btn>
    <challenge-modal
      v-else
      :status="liveStatus"
      :user-id="userId"
      :user-game-status="userGameStatus"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { GameSession } from '@/stores/GameStore'
import { Status } from '@/interfaces/User'
import ChallengeModal from '@/components/game/ChallengeModal.vue'
import useUserStore from '@/stores/UserStore'

const { status, userId } = defineProps({
  userGameStatus: {
    type: Object as PropType<{
      status: 'playing' | 'inQueue' | 'free'
      gameSession?: GameSession
    }>,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  status: {
    type: String as PropType<Status>,
    required: false,
    default: Status.Offline
  }
})
const usersStore = useUserStore()
const liveStatus = computed(() => {
  const localValue = status ?? Status.Offline
  return usersStore.getUsersStatus.get(userId) ?? localValue
})
</script>
