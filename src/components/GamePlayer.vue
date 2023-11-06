<template>
  <div id="Game-player" ref="player"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { AUTO, Game, Scale } from 'phaser'
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
      gameMonitor: null as unknown as Monitor,
      game: null as unknown as Game
    }
  },
  mounted() {
    const gameMonitor = new Monitor(this.roomId, this.player, this.moveToHistory)
    const gameContainer = this.$refs.player as HTMLElement
    const game = new Game({
      type: AUTO,
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
      backgroundColor: '#2f2f2f',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { x: 0, y: 0 }
        }
      },
      scene: {
        create: () => {
          game.scene.add('Boot', Boot, true, {
            currentUser: this.player,
            gameMonitor,
            theme: this.theme
          })
          game.scene.add('Preload', Preload, false, {
            currentUser: this.player,
            gameMonitor,
            theme: this.theme
          })
          game.scene.add('Menu', Menu, false, {
            currentUser: this.player,
            gameMonitor,
            theme: this.theme
          })
          game.scene.add('PongScene', PongScene, false, {
            currentUser: this.player,
            gameMonitor,
            theme: this.theme
          })
        }
      }
    })
    game.scene.start('Boot', {
      currentUser: this.player,
      gameMonitor,
      theme: this.theme
    })
    this.gameMonitor = gameMonitor
    this.game = game
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
