<template>
  <div id="Game-player" ref="player" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { WEBGL, Game, Scale } from 'phaser'
import Boot, { Theme } from '@/Game/scenes/Boot'
import Preload from '@/Game/scenes/Preload'
import Menu from '@/Game/scenes/Menu'
import PongScene from '@/Game/scenes/PongScene'
import { GameUser, GameUserType } from '@/Game/network/GameNetwork'
import Monitor from '@/Game/network/Monitor'

export default defineComponent({
  props: {
    player: {
      type: Object as PropType<GameUser & { userType: GameUserType }>,
      required: true
    },
    roomId: {
      type: Number,
      required: true,
      default: () => 0
    },
    theme: {
      type: String as PropType<Theme>,
      required: true,
      default: () => Theme.Classic
    }
  },
  data() {
    return {
      gameMonitor: null as unknown as Monitor
    }
  },
  mounted() {
    const gameMonitor = new Monitor(this.roomId, this.player, this.moveToHistory)
    const gameContainer = this.$refs.player as HTMLElement
    const dataInit = {
      currentUser: this.player,
      gameMonitor,
      theme: this.theme
    }
    console.log('gameMonitor', gameMonitor);
    this.gameMonitor = gameMonitor
    const game = new Game({
      type: WEBGL,
      scale: {
        mode: Scale.FIT,
        parent: gameContainer,
        autoCenter: Scale.CENTER_BOTH,
        width: 1334,
        height: 750,
        max: {
          width: 1333,
          height: 750
        }
      },
      backgroundColor: 'rgba(12,12,23,0.76)',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { x: 0, y: 0 }
        }
      }
    })
    game.scene.add('PongGame', PongScene, false, dataInit)
    game.scene.add('Menu', Menu, false, dataInit)
    game.scene.add('Preload', Preload, false, dataInit)
    game.scene.add('Boot', Boot, true, dataInit)
  },
  beforeUnmount() {
    this.gameMonitor?.quitGame()
  },
  methods: {
    moveToHistory() {
      this.$router.push({ name: 'me', params: { tab: 'history' } })
    }
  }
})
</script>

<style scoped></style>
