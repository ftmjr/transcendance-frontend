<template>
  <div class="flex flex-col">
    <div
      v-if="props.debugMode === true"
      class="grid grid-cols-2 gap-4 p-4 bg-gray-200 overflow-auto"
    >
      <!-- Received Data -->
      <div class="bg-white rounded-lg shadow px-5 py-4">
        <h3 class="text-xl font-bold mb-2">Props Data</h3>
        <div class="flex items-center space-x-2 mb-4">
          <img class="h-8 w-8 rounded-full" :src="props.user.avatar" alt="" />
          <div class="text-sm font-medium text-gray-900">{{ props.user.username }}</div>
        </div>
        <div class="text-sm text-gray-500">
          <p class="mb-2">Room ID: {{ props.gameData.room ?? 0 }}</p>
          <p class="mb-2">Game Type: {{ props.gameData.playerType }}</p>
          <p class="mb-2">Game Theme: {{ props.gameData.theme }}</p>
        </div>
      </div>
      <!-- Network Data -->
      <div class="bg-white rounded-lg shadow px-5 py-4">
        <h3 class="text-xl font-bold mb-2">Network Monitor</h3>
        <p class="mb-2">Room ID: {{ roomIdDisplayed }}</p>
        <div class="flex justify-evenly">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Players
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="[id, player] in gameMonitor.players"
                  :key="id"
                  :class="player.isHost ? 'bg-green-200' : ''"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img class="h-8 w-8 rounded-full" :src="player.avatar" alt="" />
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ player.username }}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Viewers / Observers
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="[id, viewer] in gameMonitor.viewers" :key="id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img class="h-8 w-8 rounded-full" :src="viewer.avatar" alt="" />
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ viewer.username }}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div ref="gameContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue'
import type { PropType } from 'vue'
import Phaser from 'phaser'
import PongGameScene from '@/Game/pong-scenes/PongGame'
import PreloadScene, { PreloadSceneData } from '@/Game/pong-scenes/Preload'
import { GameNetwork, GameUser, GameUserType } from '@/Game/network/GameNetwork'
import { GAME_STATE, GameMonitor, NetworkUser, TRoomId } from '@/Game/network/GameMonitor'
import type { GameDataI } from '@/Game/pong-scenes/Assets'

const gameContainer = ref(null)
const props = defineProps({
  gameData: {
    type: Object as PropType<GameDataI>,
    required: true,
    default: () => ({
      room: 0,
      playerType: GameUserType.LocalPlayer,
      theme: 'Arcade'
    })
  },
  user: {
    type: Object as PropType<GameUser>,
    required: true,
    default: () => ({
      userId: 1,
      username: 'gamer1',
      avatar: 'https://i.imgur.com/8bXwXuU.png'
    })
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

const roomIdDisplayed = ref(props.gameData?.room ?? 0)
const onPlayersUpdated = (players: Map<string, NetworkUser>) => {}
const onViewersUpdated = (viewers: Map<string, NetworkUser>) => {}
const onRoomIdUpdated = (roomId: number) => {
  roomIdDisplayed.value = roomId
}
const onScoreUpdated = (score: { player1: number; player2: number }) => {}
const onGameStateChanged = (state: GAME_STATE) => {}

const gameMonitor = new GameMonitor('pong', props.gameData.playerType, gameNetwork, {
  onPlayersUpdated,
  onViewersUpdated,
  onRoomIdUpdated,
  onScoreUpdated,
  onGameStateChanged
})

onMounted(() => {
  const gameData: PreloadSceneData = {
    userType: props.gameData.playerType,
    gameMonitor,
    gameNetwork,
    theme: props.gameData.theme
  }
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      parent: 'Game-container',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
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
