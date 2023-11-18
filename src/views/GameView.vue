<template>
  <div class="h-full">
    <template v-if="!loading">
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
      <v-alert
        v-model="alertGameAlreadyJoined"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="deep-purple-accent-4"
        title="Partie en cours"
      >
        Vous avez deja une session, veuillez patienter... Vous avez deja une partie en cours, elle
        va etre chargée. Quand la partie sera terminée, vous serez redirigé vers la page de
        résultat.
      </v-alert>
      <GamePlayer
        v-if="gameStore.currentGameSession"
        :room-id="gameStore.currentGameSession.gameId"
        :player="player"
        :theme="theme"
      />
    </template>
    <div v-else class="h-full flex items-center justify-center">
      <v-progress-circular indeterminate color="deep-purple-accent-4" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useGameStore from '@/stores/GameStore'
import { GameUser, GameUserType } from '@/Game/network/GameNetwork'
import { Theme } from '@/Game/scenes/Boot'

export default defineComponent({
  name: 'GameUpgrade',
  components: {
    GamePlayer: defineAsyncComponent(() => import('@/Game/GamePlayer.vue'))
  },
  props: {
    gameId: {
      type: Number,
      default: () => 0
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
    return {
      authStore,
      gameStore
    }
  },
  data() {
    return {
      loading: false,
      error: null as unknown as string,
      alertGameAlreadyJoined: false,
      showIsInQueList: true
    }
  },
  computed: {
    player(): GameUser & { userType: GameUserType } {
      return {
        userId: this.authStore.getUser?.id ?? 0,
        username: this.authStore.getUser?.username ?? '',
        avatar: this.authStore.getProfile?.avatar ?? '',
        userType: this.gameStore.isWatching ? GameUserType.Viewer : GameUserType.Player
      }
    },
    theme(): Theme {
      if (!this.gameStore.currentGameSession) return Theme.Classic
      return this.gameStore.currentGameSession?.rules.theme ?? Theme.Classic
    }
  },
  beforeMount() {
    if (this.gameStore.currentGameSession) {
      this.alertGameAlreadyJoined = true
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
  beforeUnmount() {
    this.leaveGame()
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
      if (!this.gameStore.currentGameSession) return
      if (!this.authStore.getUser) return
      await this.gameStore.leaveCurrentGameSession(this.authStore.getUser.id)
    }
  }
})
</script>

<style scoped></style>
