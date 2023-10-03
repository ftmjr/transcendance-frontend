<template>
  <div class="flex gap-2">
    <v-chip v-if="userGameStatus.status === 'playing'" color="green">
      <v-icon left>tabler:device-gamepad</v-icon>
      Joue
    </v-chip>
    <v-chip v-else-if="userGameStatus.status === 'inQueue'" color="orange">
      <v-icon left>ic:baseline-timer</v-icon>
      Dans la fille d'attente
    </v-chip>
    <v-chip v-else color="blue">
      <v-icon left>mdi-account-check-outline</v-icon>
      Libre
    </v-chip>
    <v-btn v-if="userGameStatus.gameSession" @click="watchGame(userGameStatus.gameSession)">
      <v-icon left>mdi-eye</v-icon>
      Watch Game
    </v-btn>
    <v-btn v-else variant="outlined" size="small" @click="challengeUser(userGameStatus)">
      <v-icon left>mdi-sword-cross</v-icon>
      Challenge
    </v-btn>
  </div>
  <VSnackbar
    v-model="errorSnackbar"
    transition="scale-transition"
    location="top"
    color="dark"
    :timeout="2000"
  >
    <template #actions>
      <VBtn color="error" variant="outlined" @click="errorSnackbar = false"> Fermer </VBtn>
    </template>
    <span>{{ errorMsg }}</span>
  </VSnackbar>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue'
import useGameStore, { GameSession } from '@/stores/GameStore'
const props = defineProps({
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
    type: String,
    required: true
  }
})
const watchGame = (gameSession: GameSession) => {
  // logic to watch game
}
const errorSnackbar = ref(false)
const errorMsg = ref('')
const gameStore = useGameStore()
const challengeUser = (user: {
  status: 'playing' | 'inQueue' | 'free'
  gameSession?: GameSession
}) => {
  if (user.status === 'free') {
    if (props.status !== 'Online') {
      errorSnackbar.value = true
      errorMsg.value = `Le joueur n'est pas en ligne`
    } else {
      gameStore.startGameAgainstPlayer(props.userId)
    }
  } else {
    errorSnackbar.value = true
    errorMsg.value = `Le joueur n'est pas libre`
  }
}
</script>
