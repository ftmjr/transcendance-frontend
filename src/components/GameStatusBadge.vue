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
      Challenger
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import {GameSession} from "@/stores/GameStore";
defineProps({
  userGameStatus: {
    type: Object as PropType<{
      status: 'playing' | 'inQueue' | 'free';
      gameSession?: GameSession;
    }>,
    required: true,
  },
});
const watchGame = (gameSession: GameSession) => {
  // logic to watch game
};

const challengeUser = (user: {
  status: 'playing' | 'inQueue' | 'free';
  gameSession?: GameSession;
}) => {
  // logic to challenge user
};

</script>

