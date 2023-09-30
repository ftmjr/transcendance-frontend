<template>
  <div class="flex flex-col">
    <v-row v-if="props.debugMode" class="pa-4">
      <!-- Received Data -->
      <v-col cols="12" md="6" class="pa-4">
        <v-card class="pa-5">
          <v-card-title>
            <h3>Props Data</h3>
          </v-card-title>
          <v-card-subtitle class="d-flex align-center">
            <v-avatar>
              <img :src="props.user.avatar" alt="" />
            </v-avatar>
            {{ props.user.username }}
          </v-card-subtitle>
          <v-card-text>
            <p>Room ID: {{ props.gameData.room ?? 0 }}</p>
            <p>Game Type: {{ props.gameData.playerType ? 'Viewer' : 'Player' }}</p>
            <p>Game Theme: {{ props.gameData.theme }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Network Data -->
      <v-col cols="12" md="6" class="pa-4">
        <v-card class="pa-5">
          <v-card-title>
            <h3>Network Monitor</h3>
          </v-card-title>
          <v-card-text>
            <p>Room ID: {{ props.gameData.room }}</p>
            <p class="text-primary" :class="statesInfo[gameMonitorState].color">
              Game Monitor State: {{ statesInfo[gameMonitorState].text }}
            </p>
            <p>Network score : {{ scoreDisplayed }}</p>
          </v-card-text>
          <div class="flex justify-evenly">
            <v-list>
              <v-list-subheader class="font-weight-semibold text-primary">Players</v-list-subheader>
              <v-list-item v-for="[id, player] in gameMonitor.players" :key="id">
                <VAvatar size="38">
                  <VImg
                    v-if="player.avatar"
                    :src="player.avatar"
                    :alt="`avatar de ${player.username}`"
                  />
                  <span v-else-if="player.username">{{ avatarText(player.username) }}</span>
                </VAvatar>
                {{ player.username }}
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-subheader class="font-weight-semibold text-primary"
                >Viewers/Observers</v-list-subheader
              >
              <v-list-item v-for="[id, viewer] in gameMonitor.viewers" :key="id">
                <VAvatar size="38">
                  <VImg
                    v-if="viewer.avatar"
                    :src="viewer.avatar"
                    :alt="`avatar de ${viewer.username}`"
                  />
                  <span v-else-if="viewer.username">{{ avatarText(viewer.username) }}</span>
                </VAvatar>
                {{ viewer.username }}
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <div class="pongGame" id="Game-container" ref="gameContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, reactive, nextTick } from 'vue'
import type { PropType } from 'vue'
import Phaser from 'phaser'
import PongGameScene from '@/Game/pong-scenes/PongGame'
import PreloadScene from '@/Game/pong-scenes/Preload'
import type { PreloadSceneData } from '@/Game/pong-scenes/Preload'
import { GameNetwork } from '@/Game/network/GameNetwork'
import type { GameUser } from '@/Game/network/GameNetwork'
import { GameMonitor, GameMonitorState } from '@/Game/network/GameMonitor'
import type { NetworkUser } from '@/Game/network/GameMonitor'
import type { GameDataI } from '@/Game/pong-scenes/Assets'
import { EndGame } from '@/Game/pong-scenes/EndGame'
import { avatarText } from '../vuetify/@core/utils/formatters'
import useGameStore from '@/stores/GameStore'
import { useRouter } from 'vue-router'
const gameContainer = ref(null)
const props = defineProps({
  gameData: {
    type: Object as PropType<GameDataI>,
    required: true
  },
  user: {
    type: Object as PropType<GameUser>,
    required: true
  },
  debugMode: {
    type: Boolean,
    default: () => false
  }
})
let game: Phaser.Game | undefined
const gameNetwork = new GameNetwork({
  userId: props.user.userId,
  username: props.user.username,
  avatar: props.user.avatar
})

const scoreDisplayed = reactive({ player1: 0, player2: 0 })
const gameMonitorState = ref(GameMonitorState.InitGame)
const onPlayersUpdated = (players: Map<string, NetworkUser>) => {}
const onViewersUpdated = (viewers: Map<string, NetworkUser>) => {}
const onScoreUpdated = (score: { player1: number; player2: number }) => {
  scoreDisplayed.player1 = score.player1
  scoreDisplayed.player2 = score.player2
}

const statesInfo = {
  [GameMonitorState.Waiting]: { text: 'InitGame', color: 'bg-gray-200' },
  [GameMonitorState.Ready]: { text: 'Ready', color: 'bg-yellow-200' },
  [GameMonitorState.InitGame]: { text: 'Init Game command', color: 'bg-green-200' },
  [GameMonitorState.PlayingSceneLoaded]: {
    text: 'Playing scene, start order',
    color: 'bg-blue-200'
  },
  [GameMonitorState.Ended]: { text: 'Game ended', color: 'bg-red-200' }
}

const gameStore = useGameStore()
const router = useRouter()
const handleGameEnd = async () => {
  await nextTick()
  setTimeout(async () => {
    await gameStore.gameEnded(props.gameData.room, props.user.userId)
    await router.push({ name: 'me', params: { tab: 'history' } })
  }, 2000)
}
const onGameMonitorStateChange = (state: GameMonitorState) => {
  gameMonitorState.value = state
  if (state === GameMonitorState.Ended) {
    handleGameEnd()
  }
}
const gameMonitor = new GameMonitor(
  'pong',
  props.gameData.playerType,
  gameNetwork,
  {
    onPlayersUpdated,
    onViewersUpdated,
    onScoreUpdated,
    onGameMonitorStateChange
  },
  props.gameData.room
)

onMounted(() => {
  const gameData: PreloadSceneData = {
    userType: props.gameData.playerType,
    gameMonitor,
    theme: props.gameData.theme
  }
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      parent: 'Game-container',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 540,
      max: {
        width: 960,
        height: 540
      }
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { x: 0, y: 0 }
      }
    },
    scene: {
      create: () => {
        game?.scene.add('PreloadScene', PreloadScene, true, gameData)
        game?.scene.add('PongGame', PongGameScene, false, gameData)
        game?.scene.add('EndGame', EndGame, false, gameData)
      }
    }
  }
  game = new Phaser.Game(config)
})

onBeforeUnmount(() => {
  game?.destroy(true)
  gameNetwork?.disconnect()
})
</script>

<style scoped></style>
