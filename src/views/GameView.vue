<template>
  <div>
    <h3 class="text-white text-xl text-center mb-2">Testing Game</h3>
    <div class="flex justify-center items-center gap-1">
      <div class="flex flex-col">
        <label for="room" class="font-light text-white">Room</label>
        <input
          type="number"
          id="room"
          name="room"
          v-model="gameData.room"
          class="p-2 rounded border text-red-400"
        />
      </div>
      <div class="flex flex-col">
        <label for="playerType" class="font-light text-white">Player Type</label>
        <select
          id="playerType"
          name="playerType"
          v-model="gameData.playerType"
          class="p-2 rounded border text-primary"
        >
          <option v-for="option in gameUserTypesOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <div class="flex flex-col">
        <label for="theme" class="font-light text-white">Theme</label>
        <select id="theme" name="theme" v-model="gameData.theme" class="p-2 rounded border">
          <option value="Arcade">Arcade</option>
          <option value="Soccer">Soccer</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label class="text-white text-sm">Debug Mode</label>
        <input type="checkbox" id="debugMode" name="debugMode" v-model="debugMode" />
      </div>
    </div>
    <div class="flex items-center justify-center my-0.5">
      <button
        class="font-medium rounded-lg text-white text-sm px-5 py-2.5 text-center bg-orange shadow-lg hover:bg-darkBlue hover:border-2 hover:border-light/10 transition-all duration-300 ease-in-out border-2 border-orange animate-anime-in"
        @click="gamePlayerKey++"
      >
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

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import { GameDataI } from '@/Game/pong-scenes/Assets'
import { GameUser } from '@/Game/network/GameNetwork'
import { GameUserType } from '@/Game/network/GameNetwork'
import useAuthStore from '@/stores/AuthStore'
import useGameStore from '@/stores/GameStore'
const PongGamePlayer = defineAsyncComponent(() => import('@/components/PongGamePlayer.vue'))

export default defineComponent({
  components: {
    PongGamePlayer
  },
  setup() {
    const authStore = useAuthStore()
    const gameStore = useGameStore()
    return { authStore, gameStore }
  },
  data() {
    const gameData: GameDataI = {
      room: 0,
      playerType: GameUserType.LocalPlayer,
      theme: 'Arcade'
    }
    const gameUserTypesOptions = Object.keys(GameUserType).map((key) => {
      return {
        text: key,
        value: GameUserType[key]
      }
    })
    return {
      debugMode: false,
      gamePlayerKey: 0,
      player: null as unknown as GameUser,
      gameData,
      gameUserTypesOptions
    }
  },
  beforeMount() {
    const currentUser = this.authStore.getUser
    console.log(currentUser)
    if (currentUser) {
      this.player = {
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar
      }
    } else {
      this.$router.push({ name: 'auth' })
    }
  }
})
</script>

<style scoped></style>
