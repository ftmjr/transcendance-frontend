<template>
  <VCard :loading="loading" title="Pong Game">
    <PongGamePlayer
      v-if="gameData && !loading"
      :gameData="gameData"
      :user="player"
      :debugMode="true"
    />
  </VCard>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue'
import { GameUser, GameUserType } from '@/Game/network/GameNetwork'
import useAuthStore from '@/stores/AuthStore'
import useGameStore, { GameSession } from '@/stores/GameStore'
import { PongTheme } from '@/Game/pong-scenes/Assets'
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
    theme: {
      type: String as PropType<PongTheme>,
      default: 'Arcade'
    }
  },
  setup() {
    const authStore = useAuthStore()
    const gameStore = useGameStore()
    return { authStore, gameStore }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    player(): GameUser {
      return {
        userId: this.authStore.getUser.id,
        username: this.authStore.getUser.username,
        avatar: this.authStore.getProfile.avatar
      }
    },
    currentGameSession(): GameSession | null {
      return this.gameStore.currentGameSession
    },
    gameData() {
      if (!this.currentGameSession) return null
      return {
        room: this.currentGameSession.gameId,
        playerType: this.isPlayer ? GameUserType.Player : GameUserType.Viewer,
        theme: this.theme
      }
    }
  },
  beforeMount() {
    if (!this.gameId) {
      this.startAgainstBot()
    }
  },
  methods: {
    async startAgainstBot() {
      this.loading = true
      await this.gameStore.startGameAgainstBot()
      // Jaren41
      this.loading = false
    }
  }
})
</script>

<style scoped></style>
