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
        <label for="playerType" class="font-light">Player Type</label>
        <select
          id="playerType"
          name="playerType"
          v-model="gameData.playerType"
          class="p-2 rounded border"
        >
          <option v-for="option in gameUserTypesOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <div class="flex flex-col">
        <label for="theme" class="font-light">Theme</label>
        <select id="theme" name="theme" v-model="gameData.theme" class="p-2 rounded border">
          <option value="Arcade">Arcade</option>
          <option value="Soccer">Soccer</option>
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

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import { GameDataI } from '@/Game/pong-scenes/Assets'
import { GameUser } from '@/Game/network/GameNetwork'
import { GameUserType } from '@/Game/network/GameNetwork'
import useAuthStore from '@/stores/AuthStore'
const PongGamePlayer = defineAsyncComponent(() => import('@/components/PongGamePlayer.vue'))

export default defineComponent({
  components: {
    PongGamePlayer
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
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
