<template>
  <div class="flex gap-2 items-center">
    <v-chip
      v-if="userGameStatus.status === 'playing'"
      color="green"
    >
      <v-icon left>
        tabler:device-gamepad
      </v-icon>
      Joue
    </v-chip>
    <v-chip
      v-else-if="userGameStatus.status === 'inQueue'"
      color="orange"
    >
      <v-icon left>
        ic:baseline-timer
      </v-icon>
      Dans la fille d'attente
    </v-chip>
    <v-chip
      v-else
      color="blue"
    >
      <v-icon left>
        mdi-account-check-outline
      </v-icon>
      Libre
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
      <v-icon left>
        tabler-eye
      </v-icon>
      Watch Game
    </v-btn>
    <challenge-modal
      v-else
      :status="status"
      :user-id="userId"
      :user-game-status="userGameStatus"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { GameSession } from '@/stores/GameStore'
import { Status } from '@/interfaces/User'
import ChallengeModal from '@/components/game/ChallengeModal.vue'

defineProps({
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
    required: true
  }
})
</script>
