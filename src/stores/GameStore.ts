// src/stores/GameStore.ts
import { defineStore } from 'pinia'
import axios from '@/utils/axios'
import useAuthStore from '@/stores/AuthStore'
import { GameHistory } from '@/interfaces/User'
import { Theme } from '@/Game/scenes/Boot'

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

export interface GameRules {
  maxScore: number
  maxTime: number
  theme?: Theme
}
export interface GameSession {
  gameId: number
  hostId: number
  type: GameSessionType
  participants: GamerSession[]
  observers: GamerSession[]
  rules: GameRules
}

export interface CompleteGameHistory {
  gameId: number
  gameName: string
  winnerId: number
  histories: Record<number, GameHistory[]> // {opponentId: GameHistory[]}
}

export enum StartAgainst {
  Bot,
  Player
}

const useGameStore = defineStore({
  id: 'games',
  state: (): {
    joinedGameSession: GameSession | null
    myGameSessions: GameSession[]
    viewingAGame: boolean
  } => {
    return {
      joinedGameSession: null,
      myGameSessions: [],
      viewingAGame: false
    }
  },
  getters: {
    allGameSessions(): GameSession[] {
      return this.myGameSessions
    },
    currentGameSession(): GameSession | null {
      return this.joinedGameSession
    },
    isPlaying(): boolean {
      if (this.currentGameSession === null) return false
      const userId = useAuthStore().getUser?.id
      if (!userId) {
        return false
      }
      return this.currentGameSession.participants.some((p) => p.userId === userId)
    },
    isWatching(): boolean {
      if (this.currentGameSession === null) return false
      return this.viewingAGame
    },
    isPlayingWithBot(): boolean {
      return this.currentGameSession?.type === GameSessionType.Bot
    },
    isPlayingWithPlayer(): boolean {
      return this.currentGameSession?.type === GameSessionType.CompetitionGame
    },
    isPlayingWithQueList(): boolean {
      return this.currentGameSession?.type === GameSessionType.QueListGame
    },
    canStartOrAcceptGameInvitation(): boolean {
      // host can not start a game if there is game session already
      return this.currentGameSession === null
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
    async startGameAgainstPlayer(userId: number, rules: GameRules): Promise<'preparing' | string> {
      if (!this.canStartOrAcceptGameInvitation) {
        return 'Vous avez deja une session de jeu'
      }
      try {
        const { data } = await axios.post<GameSession>('/game/start', {
          againstBot: false,
          opponent: userId,
          rules
        })
        this.joinedGameSession = data
        return 'preparing'
      } catch (e) {
        console.error(e)
        return 'Une erreur est survenue'
      }
    },
    async startGameAgainstQueList(): Promise<'preparing' | string> {
      if (!this.canStartOrAcceptGameInvitation) {
        return 'Vous avez deja une session de jeu'
      }
      try {
        const { data } = await axios.post<GameSession>('/game/join-queue')
        this.joinedGameSession = data
        return 'preparing'
      } catch (e) {
        console.error(e)
        return 'Une erreur est survenue'
      }
    },
    async startViewingGame(gameId: number): Promise<'preparing' | string> {
      if (!this.canStartOrAcceptGameInvitation) {
        return 'Vous avez deja une session de jeu'
      }
      try {
        const { data } = await axios.get<GameSession>(`/game/watch-game/${gameId}`)
        this.joinedGameSession = data
        this.viewingAGame = true
        return 'preparing'
      } catch (e) {
        console.error(e)
        return 'Une erreur est survenue'
      }
    },
    stopViewingGame(): 'stopped' | string {
      if (!this.joinedGameSession) {
        return "Vous n'avez pas de session de jeu"
      }
      if (!this.viewingAGame) {
        return "Vous n'etes pas en train de regarder une partie"
      }
      this.joinedGameSession = null
      this.viewingAGame = false
      return 'stopped'
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
        if (this.myGameSessions.length > 0) {
          this.joinedGameSession = this.myGameSessions[0]
        }
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
      } catch (e) {
        console.error(e)
      }
    },
    async leaveCurrentGameSession(userId: number) {
      if (this.joinedGameSession) {
        if (this.viewingAGame) {
          this.stopViewingGame()
        } else {
          await this.gameEnded(this.joinedGameSession.gameId, userId)
        }
      }
    },
    // allow you to know witch user is currently playing or in a waiting queue
    async getUserGameStatus(
      userId: number
    ): Promise<{ status: 'playing' | 'inQueue' | 'free'; gameSession?: GameSession }> {
      const { data } = await axios.get<{
        status: 'playing' | 'inQueue' | 'free'
        gameSession?: GameSession
      }>(`/game/status/${userId}`)
      return data
    },

    // same function as getUserGameStatus but for multiple users
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
    },
    // get complete game history for a user
    async getUserCompleteGameHistory(userId: number): Promise<CompleteGameHistory[]> {
      try {
        const { data } = await axios.get<CompleteGameHistory[]>(`/game/history/${userId}`)
        return data
      } catch (e) {
        console.log('failed to get user game history')
      }
      return []
    },
    async getSimpleGameHistory(userId: number): Promise<GameHistory[]> {
      try {
        const { data } = await axios.get<GameHistory[]>(`/game/simple-history/${userId}`)
        return data
      } catch (e) {
        console.log('failed to get user game history')
      }
      return []
    }
  }
})

export default useGameStore
