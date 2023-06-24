<template>
  <PongGamePlayer :gameData="gameData" :user="player" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { PongTheme } from '@/Game/pong-scenes/Assets'

const PongGamePlayer = defineAsyncComponent(() => import('@/components/PongGamePlayer.vue'))
const gameData = {
  theme: 'Arcade' as PongTheme,
  isPlaying: true
}
const player = {
  userId: 1,
  username: 'testeur',
  avatar: 'https://i.imgur.com/8bXwXuU.png'
}
</script>

<style scoped></style>
