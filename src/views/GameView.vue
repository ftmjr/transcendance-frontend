<template>
  <div>
    <h3 class="text-white text-xl text-center mb-2">Testing Game</h3>
    <div class="flex justify-center items-center gap-1">
<!--      <div class="flex flex-col">-->
<!--        <label for="room" class="font-light text-white">Room</label>-->
<!--        <input-->
<!--          type="number"-->
<!--          id="room"-->
<!--          name="room"-->
<!--          v-model="gameData.room"-->
<!--          class="p-2 rounded border text-red-400"-->
<!--        />-->
<!--      </div>-->
<!--      <div class="flex flex-col">-->
<!--        <label for="playerType" class="font-light text-white">Player Type</label>-->
<!--        <select-->
<!--          id="playerType"-->
<!--          name="playerType"-->
<!--          v-model="gameData.playerType"-->
<!--          class="p-2 rounded border text-primary"-->
<!--        >-->
<!--          <option v-for="option in gameUserTypesOptions" :key="option.value" :value="option.value">-->
<!--            {{ option.text }}-->
<!--          </option>-->
<!--        </select>-->
<!--      </div>-->
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
<!--      <button-->
<!--        class="font-medium rounded-lg text-white text-sm px-5 py-2.5 text-center bg-orange shadow-lg hover:bg-darkBlue hover:border-2 hover:border-light/10 transition-all duration-300 ease-in-out border-2 border-orange animate-anime-in"-->
<!--        @click="gamePlayerKey++"-->
<!--      >-->
<!--        New Game Player-->
<!--      </button>-->
      <button
          class="font-medium rounded-lg text-white text-sm px-5 py-2.5 text-center bg-orange shadow-lg hover:bg-darkBlue hover:border-2 hover:border-light/10 transition-all duration-300 ease-in-out border-2 border-orange animate-anime-in"
          @click="playLocally"
      >
        Play Locally
      </button>
      <button
          class="font-medium rounded-lg text-white text-sm px-5 py-2.5 text-center bg-orange shadow-lg hover:bg-darkBlue hover:border-2 hover:border-light/10 transition-all duration-300 ease-in-out border-2 border-orange animate-anime-in"
          @click="playOnline"
      >
        Play Online
      </button>
    </div>
    <PongGamePlayer
      :key="gamePlayerKey"
      :gameData="gameData"
      :user="player"
      :debugMode="debugMode"
    />
  </div>
  <v-dialog v-model="inviteDialog" max-width="400">
    <v-card>
      <v-card-title>You received an invite to play Pong</v-card-title>
      <v-card-title>From: {{ invite.username }}</v-card-title>
      <v-card-actions>
        <v-btn color="primary" @click="acceptInvite">Accept</v-btn>
        <v-btn color="primary" @click="rejectInvite">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent} from 'vue'
import {GameDataI} from '@/Game/pong-scenes/Assets'
import {GameUser, GameUserType} from '@/Game/network/GameNetwork'
import useAuthStore from '@/stores/AuthStore'
import useGameStore from '@/stores/GameStore'
import chatSocketService from "@/utils/socketio";

const PongGamePlayer = defineAsyncComponent(() => import('@/components/PongGamePlayer.vue'))
const socket = chatSocketService
export default defineComponent({
  components: {
    PongGamePlayer
  },
  setup() {
    const authStore = useAuthStore()
    const gameStore = useGameStore()
    const socketOptions = {
      transportOptions: {
        polling: {
          extraHeaders: {
            authorization: 'Bearer ' + authStore.token
          }
        }
      }
    };
    return { authStore, gameStore, socketOptions }
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
      inviteDialog: false,
      invite: null,
      debugMode: false,
      gamePlayerKey: 0,
      player: null as unknown as GameUser,
      gameData,
      gameUserTypesOptions
    }
  },
  beforeCreate() {
    socket.connectChat(this.socketOptions)
  },
  beforeMount() {
    const currentUser = this.authStore.getUser
    if (currentUser) {
      this.player = {
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.profile.avatar
      }
    } else {
      this.$router.push({ name: 'auth' })
    }
  },
  mounted() {
    socket.socket.emit('game')
    socket.socket.on('game-invite', (user) => {
      if (this.inviteDialog == false) {
        this.showInvite(user)
      }
    })
    socket.socket.on('game-accept', () => {this.acceptInvite()})
    socket.socket.on('game-reject', () => {this.rejectInvite()})
    if (this.gameStore.getInvited == true) {
      this.gameStore.setInvited(false)
      this.playOnline()
    }
  },
  beforeUnmount() {
    socket.disconnect()
  },
  methods: {
    showInvite(user) {
      this.invite = user
      this.inviteDialog = true },
    acceptInvite() {
      socket.socket.emit('game-accept', this.invite.username)
      this.inviteDialog = false
      this.playOnline()
    },
    rejectInvite() {
      socket.socket.emit('game-reject', this.invite.username)
      this.inviteDialog = false
    },
    playLocally() {
      this.gameData.playerType = GameUserType.LocalPlayer
      this.gamePlayerKey++
    },
    playOnline() {
      this.gameData.room = 0
      this.gameData.playerType = GameUserType.Player
      this.gamePlayerKey++
    }
  }
})
</script>

<style scoped></style>
