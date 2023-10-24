// src/Game/network/GameNetwork.ts
import { io, Socket } from 'socket.io-client'
import {
  BallServedData,
  GAME_STATE,
  GameMonitorState,
  PadMovedData
} from '@/Game/network/GameMonitor'

export enum GameUserType {
  Player,
  Viewer
}

export interface GameUser {
  userId: number
  username: string
  avatar: string
}

export enum GAME_EVENTS {
  JoinGame = 'joinGame',
  HostChanged = 'hostChanged',
  GameMonitorStateChanged = 'gameMonitorStateChanged',
  GameStateChanged = 'gameStateChanged',
  Scored = 'scored',
  ScoreChanged = 'scoreChanged',
  PadMoved = 'padMoved',
  BallServed = 'ballServed',
  PlayersRetrieved = 'players-retrieved',
  PlayerAdded = 'player-added',
  ViewersRetrieved = 'viewers-retrieved',
  ViewerAdded = 'viewer-added',
  reloadPlayersList = 'reloadPlayersList',
  reloadViewersList = 'reloadViewersList'
}

export interface ListenEvents {
  [GAME_EVENTS.HostChanged]: (received: { roomId: number; data: number }) => void
  [GAME_EVENTS.GameMonitorStateChanged]: (received: {
    roomId: number
    data: GameMonitorState
  }) => void
  [GAME_EVENTS.PlayersRetrieved]: (received: { roomId: number; data: GameUser[] }) => void
  [GAME_EVENTS.PlayerAdded]: (received: { roomId: number; data: GameUser }) => void
  [GAME_EVENTS.ViewersRetrieved]: (received: { roomId: number; data: GameUser[] }) => void
  [GAME_EVENTS.ViewerAdded]: (received: { roomId: number; data: GameUser }) => void
  [GAME_EVENTS.ScoreChanged]: (received: {
    roomId: number
    data: Array<{ userId: number; score: number }>
  }) => void
  [GAME_EVENTS.PadMoved]: (received: { roomId: number; data: PadMovedData }) => void
  [GAME_EVENTS.BallServed]: (received: { roomId: number; data: BallServedData }) => void
}

export interface EmitEvents {
  [GAME_EVENTS.JoinGame]: (
    sentData: { roomId: number; user: GameUser; userType: GameUserType },
    callback: (res: { worked: boolean; roomId: number }) => void
  ) => void
  [GAME_EVENTS.GameStateChanged]: (sentData: {
    roomId: number
    user: GameUser
    gameState: GAME_STATE
  }) => void
  [GAME_EVENTS.Scored]: (sentData: { roomId: number; user: GameUser; isIa: boolean }) => void
  [GAME_EVENTS.PadMoved]: (sentData: { roomId: number; data: PadMovedData }) => void
  [GAME_EVENTS.BallServed]: (sentData: { roomId: number; data: BallServedData }) => void
  [GAME_EVENTS.reloadPlayersList]: (sentData: { roomId: number }) => void
  [GAME_EVENTS.reloadViewersList]: (sentData: { roomId: number }) => void
}

export class GameNetwork {
  public socket: Socket<ListenEvents, EmitEvents> | undefined
  // roomId is the gameSessionId, or gameId. If 0 then there is no gameSessionId
  public roomId: number = 0
  private joinedGame = false

  constructor(public user: GameUser) {
    try {
      this.socket = io('/game', { path: '/socket.io' })
    } catch (e) {
      console.error(e)
    }
  }

  get isOperational() {
    if (!this.socket) return false
    return this.socket.connected && this.joinedGame
  }

  connectToGame(roomId: number, userType: GameUserType) {
    if (this.socket) {
      this.disconnect()
    }
    try {
      this.socket = io('/game', { path: '/socket.io' })
    } catch (e) {
      console.error(e)
    } finally {
      this.socket?.emit(GAME_EVENTS.JoinGame, { roomId, user: this.user, userType }, (res) => {
        const { worked, roomId } = res
        this.roomId = roomId
        this.joinedGame = worked
      })
    }
  }

  // all send events functions here
  sendGameState(gameState: GAME_STATE) {
    const roomId = this.roomId
    if (this.isOperational) {
      this.socket?.emit(GAME_EVENTS.GameStateChanged, { roomId, user: this.user, gameState })
    }
  }
  sendScored(isIa: boolean) {
    const roomId = this.roomId
    if (this.isOperational) {
      this.socket?.emit(GAME_EVENTS.Scored, { roomId, user: this.user, isIa })
    }
  }
  sendPadMove(data: PadMovedData) {
    const roomId = this.roomId
    if (this.isOperational) {
      this.socket?.emit(GAME_EVENTS.PadMoved, { roomId, data })
    }
  }
  sendBallServe(data: BallServedData) {
    const roomId = this.roomId
    if (this.isOperational) {
      this.socket?.emit(GAME_EVENTS.BallServed, { roomId, data })
    }
  }
  reloadPlayersList() {
    const roomId = this.roomId
    if (this.isOperational) {
      this.socket?.emit(GAME_EVENTS.reloadPlayersList, { roomId })
    }
  }
  reloadViewersList() {
    const roomId = this.roomId
    if (this.isOperational) {
      this.socket?.emit(GAME_EVENTS.reloadViewersList, { roomId })
    }
  }

  // All receive events functions here
  onHostChanged(callback: (hostId: number) => void) {
    this.socket?.on(GAME_EVENTS.HostChanged, (data) => {
      callback(data.data)
    })
  }
  onGameMonitorStateChanged(callback: (state: GameMonitorState) => void) {
    this.socket?.on(GAME_EVENTS.GameMonitorStateChanged, (data) => {
      callback(data.data)
    })
  }
  onPlayersRetrieved(callback: (players: GameUser[]) => void) {
    this.socket?.on(GAME_EVENTS.PlayersRetrieved, (received) => {
      callback(received.data)
    })
  }
  onPlayerAdded(callback: (player: GameUser) => void) {
    this.socket?.on(GAME_EVENTS.PlayerAdded, (received) => {
      callback(received.data)
    })
  }
  onViewersRetrieved(callback: (viewers: GameUser[]) => void) {
    this.socket?.on(GAME_EVENTS.ViewersRetrieved, (received) => {
      callback(received.data)
    })
  }
  onViewerAdded(callback: (viewer: GameUser) => void) {
    this.socket?.on(GAME_EVENTS.ViewerAdded, (received) => {
      callback(received.data)
    })
  }
  onScoreChanged(callback: (score: Array<{ userId: number; score: number }>) => void) {
    this.socket?.on(GAME_EVENTS.ScoreChanged, (received) => {
      callback(received.data)
    })
  }
  onPadMoved(callback: (data: PadMovedData) => void) {
    this.socket?.on(GAME_EVENTS.PadMoved, (received) => {
      callback(received.data)
    })
  }
  onBallServed(callback: (data: BallServedData) => void) {
    this.socket?.on(GAME_EVENTS.BallServed, (received) => {
      callback(received.data)
    })
  }

  disconnect() {
    this.socket?.disconnect()
    this.joinedGame = false
  }
}
