<template>
  <div>
    <div class="flex justify-center items-center gap-1">
      <div class="flex flex-col">
        <label for="room" class="font-light">Room</label>
        <input
          type="number"
          id="room"
          name="room"
          v-model="gameData.room"
          class="p-2 rounded border"
        />
      </div>
      <div class="flex flex-col">
        <label for="user" class="font-light">User</label>
        <select id="user" name="user" v-model="player" class="p-2 rounded border">
          <option v-for="user in AvailableUsers" :key="user.userId" :value="user">
            {{ user.username }}
          </option>
        </select>
      </div>
      <div class="flex flex-col">
        <label for="playerType" class="font-light">Player Type</label>
        <select
          id="playerType"
          name="playerType"
          v-model="gameData.playerType"
          class="p-2 rounded border"
        >
          <option :value="GameUserType.LocalPlayer">Local Player</option>
          <option :value="GameUserType.Player">Online Player</option>
          <option :value="GameUserType.Viewer">Viewer</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label for="theme" class="font-light">Theme</label>
        <select id="theme" name="theme" v-model="gameData.theme" class="p-2 rounded border">
          <option value="Arcade">Arcade</option>
          <option value="Space">Space</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label>Debug Mode</label>
        <input type="checkbox" id="debugMode" name="debugMode" v-model="debugMode" />
      </div>
    </div>
    <div class="flex items-center justify-center">
      <button class="p-2 rounded border bg-amber-600 text-white" @click="gamePlayerKey++">
        New Game Player
      </button>
    </div>
    <PongGamePlayer
      :key="gamePlayerKey"
      :gameData="gameData"
      :user="player"
      :debugMode="debugMode"
    />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, ref, toRefs } from 'vue'
import type { GameDataI } from '@/Game/pong-scenes/Assets'
import type { GameUser } from '@/Game/network/GameNetwork'
import { GameUserType } from '@/Game/network/GameNetwork'

const PongGamePlayer = defineAsyncComponent(() => import('@/components/PongGamePlayer.vue'))
const gameData = reactive<GameDataI>({
  room: 0,
  playerType: GameUserType.LocalPlayer,
  theme: 'Arcade'
})

const AvailableUsers: GameUser[] = [
  {
    userId: 1,
    username: 'gamer1',
    avatar: 'https://i.imgur.com/8bXwXuU.png'
  },
  {
    userId: 2,
    username: 'gamer2',
    avatar: 'https://i.imgur.com/8bXwXuU.png'
  }
]
const player = reactive<GameUser>(AvailableUsers[0])
const debugMode = ref(false)
const gamePlayerKey = ref(0)
</script>

<style scoped></style>
