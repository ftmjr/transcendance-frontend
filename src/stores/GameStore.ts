// src/stores/GameStore.ts
import { defineStore } from 'pinia'
import axios from '@/utils/axios'
import useAuthStore from '@/stores/AuthStore'
import { GameHistory, Status } from '@/interfaces/User'
import { Theme } from '@/Game/scenes/Boot'
import { GAME_STATE } from '@/Game/network/Monitor'
import { isAxiosError } from 'axios'
import useUserStore from '@/stores/UserStore'
import {GameNetwork} from "@/Game/network/GameNetwork";

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
  state: GAME_STATE
  participants: GamerSession[]
  observers: GamerSession[]
  rules: GameRules
}

export interface WaitingGameSession {
  waitingGameId: number
  hostId: number
  type: GameSessionType.PrivateGame | GameSessionType.QueListGame
  participants: GamerSession[]
  rules: GameRules
}

export interface GameSessionQResponse {
  matchFound: boolean
  waitingSession?: WaitingGameSession
  gameSession?: GameSession
}

export interface CompleteGameHistory {
  gameId: number
  gameName: string
  winnerId: number
  histories: Record<number, GameHistory[]> // {opponentId: GameHistory[]}
}

export interface GameStatus {
  status: 'playing' | 'inQueue' | 'free'
  gameSession?: GameSession
}

export enum StartAgainst {
  Bot,
  Player
}

const useGameStore = defineStore({
  id: 'games',
  state: (): {
    currentGameSession: GameSession | undefined
    currentWatchingGameSession: GameSession | undefined
    myGameSessions: GameSession[]
    endedGames: number[],
    gameNetwork: GameNetwork | undefined
  } => {
    return {
      currentGameSession: undefined,
      currentWatchingGameSession: undefined,
      myGameSessions: [],
      endedGames: []
    }
  },
  getters: {
    isPlaying(): boolean {
      return !!this.currentGameSession
    },
    isWatching(): boolean {
      return !!this.currentWatchingGameSession
    },
    canStartGame(): boolean {
      return !this.currentGameSession && !this.currentWatchingGameSession
    },
    canStartWatching(): boolean {
      return !this.currentGameSession && !this.currentWatchingGameSession
    },
    currentGameId(): number | undefined {
      return this.currentGameSession?.gameId
    },
    currentGameRules(): GameRules | undefined {
      return this.currentGameSession?.rules
    },
    currentGameType(): GameSessionType | undefined {
      return this.currentGameSession?.type
    },
    getCurrentGameSession(): GameSession | undefined {
      return this.currentGameSession
    },
    getCurrentWatchingGameSession(): GameSession | undefined {
      return this.currentWatchingGameSession
    },
    isPlayingWithQueList(): boolean {
      return this.currentGameSession?.type === GameSessionType.QueListGame
    }
  },
  actions: {
    async initSocket(){
      const authStore = useAuthStore();
      const user = authStore.getUser;
      if (!user) return;
      this.gameNetwork = GameNetwork.getInstance({
        userId: user.id ?? 0,
        username: user.username ?? '',
        avatar: user.profile.avatar ?? '',
      })
    },
    disconnectSocket(){
        this.gameNetwork?.disconnect();
    },
    async getAllGameSessions() {
      try {
        const { data } = await axios.get<GameSession[]>('/game/sessions', {
          headers: { Accept: 'application/json' }
        })
        this.myGameSessions = data
        if (this.currentGameSession) return
        if (data.length) {
          const gameSession = data.find((gs) => gs.state !== GAME_STATE.Ended)
          if (gameSession) this.currentGameSession = gameSession
        }
      } catch (e) {
        this.myGameSessions = []
      }
    },
    async getAGameSession(gameId: number): Promise<GameSession | undefined> {
      // load my game sessions
      if (!this.myGameSessions.length) {
        await this.getAllGameSessions()
      }
      const gameSession = this.myGameSessions.find((gs) => gs.gameId === gameId)
      if (gameSession) {
        const userStore = useUserStore()
        userStore.statusSocketManager?.updateMyStatus(Status.Busy)
        return gameSession
      }
    },
    async enterAGameSession(gameId: number): Promise<string> {
      if (this.currentGameSession)
        return 'Vous avez deja une session de jeu, en cours ou en attente'
      const gameSession = await this.getAGameSession(gameId)
      if (!gameSession) return 'Impossible de rejoindre la partie'
      this.currentGameSession = gameSession
      return 'success'
    },
    async quitCurrentGameSession(gameId: number): Promise<void> {
      const userStore = useUserStore()
      userStore.statusSocketManager?.updateMyStatus(Status.Online)
      if (!this.currentGameSession) return
      if (this.currentGameSession.gameId !== gameId) return
      this.currentGameSession = undefined
      try {
        await axios.delete(`/game/sessions`, {
          headers: { Accept: 'application/json' },
          data: { gameId }
        })
        this.currentGameSession = undefined
      } catch (e) {
        this.currentGameSession = undefined
      }
    },
    async quitGameSession(gameId: number): Promise<void> {
      await axios.delete(`/game/sessions`, {
        headers: { Accept: 'application/json' },
        data: { gameId }
      })
      const userStore = useUserStore()
      userStore.statusSocketManager?.updateMyStatus(Status.Online)
    },

    async startGameAgainstBot(): Promise<GameSession | string> {
      try {
        if (this.currentGameSession)
          return 'Vous avez deja une session de jeu, en cours ou en attente'
        const { data } = await axios.post<GameSession>('/game/start', { againstBot: true })
        this.currentGameSession = data
        this.myGameSessions.push(data)
        const userStore = useUserStore();
        userStore.statusSocketManager?.updateMyStatus(Status.Busy)
        return data;
      } catch (e) {
        return 'Une erreur est survenue'
      }
    },
    async challengeAPlayer(userId: number, rules: GameRules): Promise<'challenge' | string> {
      try {
        await axios.post<WaitingGameSession>('/game/start', {
          againstBot: false,
          opponent: {
            maxScore: rules.maxScore,
            maxTime: rules.maxTime,
            theme: rules.theme,
          },
          rules
        })
        return 'challenge'
      } catch (e) {
        return 'Impossible de lancer le challenge'
      }
    },

    // waiting queue
    async enterInQueList(): Promise<GameSessionQResponse> {
      try {
        if (this.currentGameSession) return { matchFound: false }
        const { data } = await axios.post<GameSessionQResponse>('/game/start', {
          againstBot: false
        })
        if (data.matchFound && data.gameSession) {
          this.currentGameSession = data.gameSession
          this.myGameSessions.push(data.gameSession)
        }
        return data
      } catch (e) {
        return { matchFound: false }
      }
    },
    async quitQueList(): Promise<'success' | string> {
      try {
        await axios.get('/game/quit-waiting-queue')
        return 'success'
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            return error.response.data.message ?? 'Une erreur est survenue'
          }
        }
      }
      return 'Une erreur est survenue'
    },
    async isSomeoneInQueList(): Promise<boolean> {
      try {
        const { data } = await axios.get<boolean>('/game/is-someone-in-queue', {
          headers: { Accept: 'application/json' }
        })
        return data
      } catch (e) {
        return false
      }
    },

    //  viewing a game
    async startViewingGame(gameId: number): Promise<'preparing' | string> {
      try {
        if (this.currentWatchingGameSession) return 'Vous regardez deja une partie'
        const { data } = await axios.get<GameSession>(`/watch-game/:${gameId}`, {
          headers: { Accept: 'application/json' }
        })
        this.currentWatchingGameSession = data
        return 'preparing'
      } catch (error) {
        if (isAxiosError(error)) {
          if (
            error.response &&
            (error.response.status === 403 ||
              error.response.status === 401 ||
              error.response.status === 404)
          ) {
            return error.response.data.message ?? 'Impossible de rejoindre la partie'
          }
        }
      }
      return 'Impossible de rejoindre la partie'
    },

    // accept or reject game challenge
    async acceptGameChallenge(challengeId: number): Promise<GameSession | string> {
      if (this.currentGameSession) {
        return 'Vous avez deja une session de jeu'
      }
      try {
        const { data } = await axios.post<GameSession>('/game/accept-invitation', { challengeId })
        this.myGameSessions.push(data)
        return data
      } catch (error) {
        if (isAxiosError(error)) {
          if (
            error.response &&
            (error.response.status === 403 ||
              error.response.status === 401 ||
              error.response.status === 404)
          ) {
            return error.response.data.message ?? 'Impossible de rejoindre la partie'
          }
        }
      }
      return 'Impossible de rejoindre la partie'
    },
    async rejectGameChallenge(challengeId: number): Promise<void> {
      try {
        await axios.post('/game/reject-invitation', { challengeId })
      } catch (error) {
        if (isAxiosError(error)) {
          if (
            error.response &&
            (error.response.status === 403 ||
              error.response.status === 401 ||
              error.response.status === 404)
          ) {
            console.log(error.response.data.message ?? 'Impossible de rejeter la partie')
          }
        }
      }
    },

    // allow you to know witch user is currently playing or in a waiting queue
    async getUserGameStatus(userId: number): Promise<GameStatus> {
      try {
        const { data } = await axios.get<{
          status: 'playing' | 'inQueue' | 'free'
          gameSession?: GameSession
        }>(`/game/status/${userId}`, { headers: { Accept: 'application/json' } })
        return data
      } catch (e) {
        return { status: 'free', gameSession: undefined }
      }
    },
    // same function as getUserGameStatus but for multiple users
    async getUsersGameStatus(userIds: number[]): Promise<GameStatus[]> {
      try {
        const { data } = await axios.post<
          {
            status: 'playing' | 'inQueue' | 'free'
            gameSession?: GameSession
          }[]
        >(`/game/status`, { userIds })
        return data
      } catch (e) {
        return userIds.map((id) => ({ status: 'free', gameSession: undefined }))
      }
    },
    // get complete game history for a user
    async getUserCompleteGameHistory(userId: number): Promise<CompleteGameHistory[]> {
      try {
        const { data } = await axios.get<CompleteGameHistory[]>(`/game/history/${userId}`, {
          headers: { Accept: 'application/json' }
        })
        return data
      } catch (e) {
        console.log('failed to get user game history')
      }
      return []
    },
    async getSimpleGameHistory(userId: number): Promise<GameHistory[]> {
      try {
        const { data } = await axios.get<GameHistory[]>(`/game/simple-history/${userId}`, {
          headers: { Accept: 'application/json' }
        })
        return data
      } catch (e) {
        console.log('failed to get user game history')
      }
      return []
    }
  }
})

export default useGameStore
