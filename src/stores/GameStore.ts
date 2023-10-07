import { defineStore } from 'pinia'
import axios from '@/utils/axios'

export enum GameSessionType {
  Bot,
  QueListGame,
  CompetitionGame,
  PrivateGame
}
export interface GamerSession {
  userId: number
  username: string
  clientId: string
  avatar?: string
  isHost?: boolean
}

export interface GameSession {
  gameId: number
  hostId: number
  type: GameSessionType
  participants: GamerSession[]
  observers: GamerSession[]
}

export enum StartAgainst {
  Bot,
  Player
}

const useGameStore = defineStore({
  id: 'games',
  state: (): { joinedGameSession: GameSession | null; myGameSessions: GameSession[] } => {
    return {
      joinedGameSession: null,
      myGameSessions: []
    }
  },
  getters: {
    currentGameSession(): GameSession | null {
      return this.joinedGameSession
    },
    allGameSessions(): GameSession[] {
      return this.myGameSessions
    },
    isPlaying(): boolean {
      return this.joinedGameSession !== null
    },
    isPlayingWithBot(): boolean {
      return this.joinedGameSession?.type === GameSessionType.Bot
    },
    isPlayingWithPlayer(): boolean {
      return this.joinedGameSession?.type === GameSessionType.CompetitionGame
    },
    isPlayingWithQueList(): boolean {
      return this.joinedGameSession?.type === GameSessionType.QueListGame
    },
    canStartOrAcceptGameInvitation(): boolean {
      // host can not start a game if there is game session already
      return this.joinedGameSession === null
    }
  },
  actions: {
    async joinAGameSessionQueue(): Promise<'preparing' | string> {
      if (!this.canStartOrAcceptGameInvitation) {
        return 'Vous avez deja une session de jeu'
      }
      try {
        const { data } = await axios.post<GameSession>('/game/join-queue', {})
        this.joinedGameSession = data
        return 'preparing'
      } catch (e) {
        console.error(e)
        return 'Une erreur est survenue'
      }
    },
    async startGameAgainstBot(): Promise<'preparing' | string> {
      if (!this.canStartOrAcceptGameInvitation) {
        return 'Vous avez deja une session de jeu'
      }
      try {
        const { data } = await axios.post<GameSession>('/game/start', {
          againstBot: true
        })
        this.joinedGameSession = data
        return 'preparing'
      } catch (e) {
        console.error(e)
        return 'Une erreur est survenue'
      }
    },
    async startGameAgainstPlayer(userId: number): Promise<'preparing' | string> {
      if (!this.canStartOrAcceptGameInvitation) {
        return 'Vous avez deja une session de jeu'
      }
      try {
        const { data } = await axios.post<GameSession>('/game/start', {
          againstBot: false,
          opponent: userId
        })
        this.joinedGameSession = data
        return 'preparing'
      } catch (e) {
        console.error(e)
        return 'Une erreur est survenue'
      }
    },
    async acceptGameInvitation(gameId: number): Promise<'preparing' | string> {
      if (!this.canStartOrAcceptGameInvitation) {
        return 'Vous avez deja une session de jeu'
      }
      try {
        const { data } = await axios.post<GameSession>('/game/accept-invitation', { gameId })
        this.joinedGameSession = data
        await this.getAllMyGameSessions()
        return 'preparing'
      } catch (e) {
        console.error(e)
        return 'Une erreur est survenue'
      }
    },
    async getAllMyGameSessions() {
      try {
        const { data } = await axios.get<GameSession[]>('/game/sessions')
        this.myGameSessions = data
      } catch (e) {
        console.error(e)
      }
    },
    async refuseGameInvitation(gameId: number) {
      try {
        await axios.post<GameSession>('/game/refuse-invitation', { gameId })
        await this.getAllMyGameSessions()
      } catch (e) {
        console.error(e)
      }
    },
    async gameEnded(gameId: number, userId: number) {
      if (this.joinedGameSession?.gameId === gameId) {
        if (this.joinedGameSession.hostId === userId) {
          await this.deleteGameSession(gameId)
        }
        this.joinedGameSession = null
      }
      await this.getAllMyGameSessions()
    },
    async deleteGameSession(gameId: number) {
      try {
        await axios.delete('/game/sessions', { data: { gameId } })
        await this.getAllMyGameSessions()
      } catch (e) {
        console.error(e)
      }
    },
    async getUserGameStatus(
      userId: number
    ): Promise<{ status: 'playing' | 'inQueue' | 'free'; gameSession?: GameSession }> {
      const { data } = await axios.get<{
        status: 'playing' | 'inQueue' | 'free'
        gameSession?: GameSession
      }>(`/game/status/${userId}`)
      return data
    },
    // allow you to know witch user is currently playing or in a waiting queue
    async getUsersGameStatus(
      userIds: number[]
    ): Promise<{ status: 'playing' | 'inQueue' | 'free'; gameSession?: GameSession }[]> {
      const { data } = await axios.post<
        {
          status: 'playing' | 'inQueue' | 'free'
          gameSession?: GameSession
        }[]
      >(`/game/status`, { userIds })
      return data
    }
  }
})

export default useGameStore
