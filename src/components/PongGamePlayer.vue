<template>
  <div ref="gameContainer"></div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, PropType } from 'vue'
import PongGameScene from '@/Game/pong-scenes/PongGame'
import PreloadScene, { PreloadSceneData } from '@/Game/pong-scenes/Preload'
import { GameNetwork, GameUser, GameUserType } from '@/Game/network/GameNetwork'
import { GAME_STATE, GameMonitor, NetworkUser, TRoomId } from '@/Game/network/GameMonitor'
import type { PongTheme } from '@/Game/pong-scenes/Assets'

const gameContainer = ref(null)
const props = defineProps({
  gameData: {
    type: Object as PropType<{
      theme?: PongTheme
      room?: number
      isPlaying: boolean
    }>,
    required: true
  },
  user: {
    type: Object as PropType<GameUser>,
    required: true
  }
})
let game: Phaser.Game | undefined
const gameNetwork = new GameNetwork({
  userId: props.user?.userId ?? 1,
  username: props.user?.username ?? 'Player 1',
  avatar: props.user?.avatar ?? 'https://i.imgur.com/8bXwXuU.png'
})
const gameType = props.gameData?.isPlaying ? GameUserType.LocalPlayer : GameUserType.Viewer
const onPlayersUpdated = (players: Map<string, NetworkUser>) => {
  console.log(players)
}
const onViewersUpdated = (viewers: Map<string, NetworkUser>) => {}
const onRoomIdUpdated = (roomId: number) => {}
const onScoreUpdated = (score: { player1: number; player2: number }) => {}
const onGameStateChanged = (state: GAME_STATE) => {}

const gameMonitor = new GameMonitor('pong', gameType, gameNetwork, {
  onPlayersUpdated,
  onViewersUpdated,
  onRoomIdUpdated,
  onScoreUpdated,
  onGameStateChanged
})

onMounted(() => {
  const gameData = {
    userType: gameType,
    gameMonitor,
    gameNetwork,
    theme: props.gameData?.theme ?? 'Arcade'
  } as PreloadSceneData
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
