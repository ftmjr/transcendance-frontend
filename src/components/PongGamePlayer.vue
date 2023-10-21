<template>
  <div class="flex flex-col mt-2">
    <v-row v-if="props.debugMode">
      <!-- Received Data -->
      <v-col
        cols="12"
        md="3"
      >
        <v-card class="mx-2 p-2">
          <v-card-title>
            <h3>Props Data</h3>
          </v-card-title>
          <v-card-subtitle class="d-flex align-center">
            <v-avatar>
              <img
                :src="props.user?.avatar"
                alt=""
              >
            </v-avatar>
            {{ props.user.username }}
          </v-card-subtitle>
          <v-card-text>
            <p>GameSession ID: {{ props.gameSession.gameId }}</p>
            <p>Player type: {{ props.user.type === 1 ? 'Player' : 'Viewer' }}</p>
            <p>Theme on rule: {{ props.gameSession.rules.theme }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Network Data -->
      <v-col
        cols="12"
        md="9"
      >
        <v-card class="p-2 mr-2">
          <v-card-title>
            <h3>Network Monitor</h3>
          </v-card-title>
          <v-card-text>
            <p>Host ID: {{ gameMonitor.hostId }}</p>
            <p
              class="text-primary"
              :class="statesInfo[gameMonitorState].color"
            >
              Game Monitor State: {{ statesInfo[gameMonitorState].text }}
            </p>
            <p>Network score : {{ scoreDisplayed }}</p>
          </v-card-text>
          <VRow>
            <VCol>
              <v-list :key="playersKey">
                <v-list-subheader class="font-weight-semibold text-primary">
                  Players
                </v-list-subheader>
                <v-list-item
                  v-for="player in gameMonitor.players"
                  :key="player.userId"
                >
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
            </VCol>
            <VCol>
              <v-list :key="viewerKey">
                <v-list-subheader class="font-weight-semibold text-primary">
                  Viewers/Observers
                </v-list-subheader>
                <v-list-item
                  v-for="viewer in gameMonitor.viewers"
                  :key="viewer.userId"
                >
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
            </VCol>
          </VRow>
        </v-card>
      </v-col>
    </v-row>
    <div
      id="Game-container"
      ref="gameContainer"
      class="pongGame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, reactive, nextTick } from 'vue'
import type { PropType } from 'vue'
import Phaser, { AUTO } from 'phaser'
import PongGameScene from '@/Game/pong-scenes/PongGame'
import PreloadScene from '@/Game/pong-scenes/Preload'
import { GameNetwork, GameUserType } from '@/Game/network/GameNetwork'
import type { GameUser } from '@/Game/network/GameNetwork'
import { GameMonitor, GameMonitorState } from '@/Game/network/GameMonitor'
import { EndGame } from '@/Game/pong-scenes/EndGame'
import { avatarText } from '@core/utils/formatters'
import useGameStore, { GameSession } from '@/stores/GameStore'
import { useRouter } from 'vue-router'
const gameContainer = ref(null)
const props = defineProps({
  gameSession: {
    type: Object as PropType<GameSession>,
    required: true
  },
  user: {
    type: Object as PropType<GameUser & { type: GameUserType }>,
    required: true
  },
  debugMode: {
    type: Boolean,
    default: () => false
  }
})
let game: Phaser.Game | undefined
const gameNetwork = new GameNetwork(props?.user as GameUser & { type: GameUserType })
const scoreDisplayed = reactive({ player1: 0, player2: 0 })
const gameMonitorState = ref(GameMonitorState.InitGame)
const playersKey = ref(0)
const viewerKey = ref(0)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onPlayersUpdated = (players: GameUser[]) => {
  playersKey.value += 1
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onViewersUpdated = (viewers: GameUser[]) => {
  viewerKey.value += 1
}
const onScoreUpdated = (scores: Array<{ userId: number; score: number }>) => {
  if (scores.length !== 2) return
  scoreDisplayed.player1 = scores[0].score
  scoreDisplayed.player2 = scores[1].score
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
    await gameStore.gameEnded(props.gameSession?.gameId as number, props.user?.userId as number)
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
  props.gameSession?.gameId as number,
  props.user?.type as GameUserType,
  gameNetwork,
  {
    onPlayersUpdated,
    onViewersUpdated,
    onScoreUpdated,
    onGameMonitorStateChange
  }
)

onMounted(() => {
  const gameData: {
    currentUser: (GameUser & { type: GameUserType }) | undefined
    gameMonitor: GameMonitor
    gameSession: GameSession | undefined
  } = {
    currentUser: props?.user,
    gameMonitor,
    gameSession: props?.gameSession
  }
  const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
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
  gameMonitor.disconnect()
})
</script>

<style scoped></style>
