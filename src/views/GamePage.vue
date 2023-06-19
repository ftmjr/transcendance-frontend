<template>
  <PongGamePlayer :competition="competition" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const PongGamePlayer = defineAsyncComponent(() => import('@/components/PongGamePlayer.vue'));
const competition = {
  player: 'player1',
  room: 'room1',
  theme: 'default'
}
</script>

<style scoped>

</style>