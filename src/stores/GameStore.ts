import { defineStore } from 'pinia'
import type { Game } from '@Game'

const useGameStore = defineStore({
  id: 'games',
  state: (): {
    CurrentPlayingGames: Game[]
  } => {
    return { CurrentPlayingGames: [] as Game[] }
  },
  getters: {
    getCurrentPlayingGames(): Game[] {
      return this.CurrentPlayingGames
    }
  },
  actions: {
    async loadPlayingGames() {
      // code to load current playing games
    }
  }
})

export default useGameStore
