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
          Vous Jouez dans la file d'attente, veuillez patienter...
        </VSnackbar>
      </div>
      <v-alert
        v-model="alertGameAlreadyJoined"
        border="start"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="secondary"
        title="Partie en cours"
      >
        Vous avez deja une session, veuillez patienter... Vous avez deja une partie en cours, elle
        va etre chargée. Quand la partie sera terminée, vous serez redirigé vers la page de
        résultat.
      </v-alert>
      <GamePlayer v-if="player" :room-id="roomId" :player="player" :theme="theme" />
    </template>
    <div v-else-if="loading" class="h-full flex items-center justify-center">
      <v-progress-circular indeterminate color="deep-purple-accent-4" />
    </div>
    <div class="flex justify-center" v-if="!gameStore.isPlaying && !gameStore.isWatching">
      <p class="w-1/2 text-center">Aucune partie en cours</p>
      <VIcon color="orange" :size="128">tabler:device-gamepad-2</VIcon>
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
  components: {
    GamePlayer: defineAsyncComponent(() => import('@/Game/GamePlayer.vue'))
  },
  props: {
    gameId: {
      type: Number,
      default: () => 0
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
    roomId(): number | undefined {
      if (this.gameStore.getCurrentGameSession) {
        return this.gameStore.getCurrentGameSession.gameId
      }
      if (this.gameStore.getCurrentWatchingGameSession) {
        return this.gameStore.getCurrentWatchingGameSession.gameId
      }
      return undefined
    },
    player(): (GameUser & { userType: GameUserType }) | undefined {
      if (this.gameStore.getCurrentGameSession) {
        // check if current user is in participants
        const user = this.gameStore.getCurrentGameSession.participants.find(
          (user) => user.userId === this.authStore.getUser?.id
        )
        if (user) {
          return {
            userId: user.userId,
            username: user.username,
            avatar: this.authStore.getProfile?.avatar ?? '',
            userType: GameUserType.Player
          }
        }
      }
      if (this.gameStore.getCurrentWatchingGameSession) {
        const user = this.gameStore.getCurrentWatchingGameSession.observers.find(
          (user) => user.userId === this.authStore.getUser?.id
        )
        if (user) {
          return {
            userId: user.userId,
            username: user.username,
            avatar: this.authStore.getProfile?.avatar ?? '',
            userType: GameUserType.Viewer
          }
        }
      }
      return undefined
    },
    theme(): Theme {
      if (this.gameStore.getCurrentGameSession) {
        return this.gameStore.getCurrentGameSession.rules.theme ?? Theme.Classic
      }
      if (this.gameStore.getCurrentWatchingGameSession) {
        return this.gameStore.getCurrentWatchingGameSession.rules.theme ?? Theme.Classic
      }
      return Theme.Classic
    }
  },
  watch: {
    'gameStore.getCurrentGameSession': {
      handler() {
        this.moveToCurrentGame()
      }
    },
    'gameStore.getCurrentWatchingGameSession': {
      handler() {
        this.moveToCurrentGame()
      },
      immediate: true
    }
  },
  async beforeMount() {
    this.loading = true
    await this.gameStore.getAllGameSessions()
    if (!this.gameId) {
      this.startAgainstBot()
    }
    this.loading = false
  },
  beforeUnmount() {
    if (this.roomId && this.roomId === this.gameId) {
      if (this.player) {
        if (this.player.userType === GameUserType.Player) {
          this.gameStore.quitCurrentGameSession(this.roomId)
        }
      }
    }
  },
  methods: {
    moveToCurrentGame() {
      if (this.gameStore.getCurrentGameSession) {
        if (this.gameId !== this.gameStore.getCurrentGameSession.gameId) {
          this.$router.push({
            name: 'game',
            params: { gameId: this.gameStore.getCurrentGameSession.gameId }
          })
        }
      }
      if (this.gameStore.getCurrentWatchingGameSession) {
        if (this.gameId !== this.gameStore.getCurrentWatchingGameSession.gameId) {
          this.$router.push({
            name: 'game',
            params: { gameId: this.gameStore.getCurrentWatchingGameSession.gameId }
          })
        }
      }
    },
    async startAgainstBot() {
      const r = await this.gameStore.startGameAgainstBot()
      if (r !== 'jeu en preparation') {
        console.log(r)
      }
    }
  }
})
</script>

<style scoped></style>
