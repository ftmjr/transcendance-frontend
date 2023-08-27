import { defineStore } from 'pinia'
import type { Game } from '@Game'
import { GameDataI } from "@/Game/pong-scenes/Assets";
import { GameUserType } from "@/Game/network/GameNetwork";

const useGameStore = defineStore({
  id: 'games',
  state: (): {
    CurrentPlayingGames: Game[],
    invited: boolean
  } => {
    return {
      CurrentPlayingGames: [] as Game[],
      invited: false
    }
  },
  getters: {
    getInvited() {return this.invited},
    getCurrentPlayingGames(): Game[] {
      return this.CurrentPlayingGames
    }
  },
  actions: {
    setInvited(invite: boolean) {this.invited = invite},
    async loadPlayingGames() {
      // code to load current playing games
    }
  }
})

export default useGameStore
