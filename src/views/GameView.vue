<template>
  <VCard :loading="loading" title="Pong Game">
    <div class="flex justify-center">
      <div>
        <VAlert
          v-if="error"
          type="error"
          :text="error"
          closable
          variant="outlined"
          @close="error = null"
        />
        <VSnackbar
          v-model="showInfo"
          :timeout="2000"
          closable
          location="center"
          color="blue"
          variant="tonal"
        >
          {{ info }}
        </VSnackbar>
      </div>
    </div>
    <div class="flex justify-end items-center mr-4">
      <VBtn v-show="gameStore.currentGameSession" color="red" @click="leaveGame">
        <v-tooltip activator="parent" location="bottom">
          Quitter la partie, ou la file d'attente
        </v-tooltip>
        <VIcon>tabler-logout</VIcon>
      </VBtn>
    </div>
    <div v-if="gameStore.isPlayingWithQueList">
      <VSnackbar
        v-model="showIsInQueList"
        :timeout="3000"
        closable
        location="right"
        color="primary"
      >
        Vous êtes dans la file d'attente, veuillez patienter...
      </VSnackbar>
    </div>
    <PongGamePlayer
      v-if="currentGameSession && !loading"
      :game-session="currentGameSession"
      :user="player"
      :debug-mode="false"
    />
  </VCard>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import { GameUser, GameUserType } from '@/Game/network/GameNetwork'
import useAuthStore from '@/stores/AuthStore'
import useGameStore, { GameSession } from '@/stores/GameStore'
const PongGamePlayer = defineAsyncComponent(() => import('@/components/PongGamePlayer.vue'))

export default defineComponent({
  components: {
    PongGamePlayer
  },
  props: {
    gameId: {
      type: Number
    },
    isPlayer: {
      type: Boolean,
      default: () => true
    },
    waitingRoom: {
      type: Boolean,
      default: () => false
    }
  },
  setup() {
    const authStore = useAuthStore()
    const gameStore = useGameStore()
    return { authStore, gameStore }
  },
  data() {
    return {
      loading: false,
      error: null as unknown as string,
      info: null as unknown as string,
      showInfo: false,
      showIsInQueList: true
    }
  },
  computed: {
    player(): GameUser & { type: GameUserType } {
      return {
        userId: this.authStore.getUser.id,
        username: this.authStore.getUser.username,
        avatar: this.authStore.getProfile.avatar,
        type: this.isPlayer ? GameUserType.Player : GameUserType.Viewer
      }
    },
    currentGameSession(): GameSession | null {
      return this.gameStore.currentGameSession
    }
  },
  beforeMount() {
    if (this.currentGameSession) {
      this.info = 'Une partie est déjà en cours, elle va etre chargée'
      this.showInfo = true
    } else {
      if (!this.gameId && !this.waitingRoom) {
        this.startAgainstBot()
      } else if (this.waitingRoom) {
        this.startWaitingRoom()
      } else if (!this.isPlayer && this.gameId) {
        this.startWatchingGame()
      }
    }
  },
  methods: {
    async startAgainstBot() {
      this.loading = true
      const r = await this.gameStore.startGameAgainstBot()
      if (r !== 'preparing') {
        this.error = r
      }
      this.loading = false
    },
    async startWaitingRoom() {
      this.loading = true
      const r = await this.gameStore.startGameAgainstQueList()
      if (r !== 'preparing') {
        this.error = r
      }
      this.loading = false
    },
    async startWatchingGame() {
      this.loading = true
      if (!this.gameId) {
        throw new Error('gameId is not defined')
      }
      const r = await this.gameStore.startViewingGame(this.gameId)
      if (r !== 'preparing') {
        this.error = r
      }
      this.loading = false
    },
    async leaveGame() {
      await this.gameStore.leaveCurrentGameSession()
      this.$router.push({ name: 'dashboard' })
    }
  }
})
</script>

<style scoped></style>
