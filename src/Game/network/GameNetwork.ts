// src/Game/network/GameNetwork.ts
import { io, Socket } from 'socket.io-client'

import {
  GAME_STATE,
  BallData,
  PadMovedData,
  GameStateDataPacket,
  PaddleEngineData
} from '@/Game/network/Monitor'

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
  ScoreChanged = 'scoreChanged',
  PadMoved = 'padMoved',
  IaPadSpeed = 'iaPadSpeed',
  BallServed = 'ballServed',
  BallMoved = 'ballMoved',
  PlayersRetrieved = 'players-retrieved',
  PlayerAdded = 'player-added',
  ViewersRetrieved = 'viewers-retrieved',
  ViewerAdded = 'viewer-added',
  reloadPlayersList = 'reloadPlayersList',
  reloadViewersList = 'reloadViewersList',
  GameObjectState = 'gameObjectState',
  PlayerLeft = 'player-left',
  ViewerLoadScore = 'viewer-load-score',
  BallPaddleCollision = 'ball-paddle-collision'
}

export interface ListenEvents {
  [GAME_EVENTS.HostChanged]: (received: { roomId: number; data: number }) => void
  [GAME_EVENTS.GameMonitorStateChanged]: (received: { roomId: number; data: GAME_STATE }) => void
  [GAME_EVENTS.PlayersRetrieved]: (received: { roomId: number; data: GameUser[] }) => void
  [GAME_EVENTS.PlayerAdded]: (received: { roomId: number; data: GameUser }) => void
  [GAME_EVENTS.ViewersRetrieved]: (received: { roomId: number; data: GameUser[] }) => void
  [GAME_EVENTS.ViewerAdded]: (received: { roomId: number; data: GameUser }) => void
  [GAME_EVENTS.ScoreChanged]: (received: {
    roomId: number
    data: Array<{ userId: number; score: number }>
  }) => void
  [GAME_EVENTS.ViewerLoadScore]: (received: {
    roomId: number
    data: Array<{ userId: number; score: number }>
  }) => void
  [GAME_EVENTS.PadMoved]: (received: { roomId: number; data: PaddleEngineData }) => void
  [GAME_EVENTS.BallServed]: (received: { roomId: number; data: BallData }) => void
  [GAME_EVENTS.BallMoved]: (received: { roomId: number; data: BallData }) => void
  [GAME_EVENTS.GameObjectState]: (received: { roomId: number; data: GameStateDataPacket }) => void
  [GAME_EVENTS.BallPaddleCollision]: (received: { roomId: number; data: number }) => void
  [GAME_EVENTS.PlayerLeft]: (received: { roomId: number; data: GameUser }) => void
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
  [GAME_EVENTS.PadMoved]: (sentData: { roomId: number; data: PadMovedData }) => void
  [GAME_EVENTS.IaPadSpeed]: (sentData: { roomId: number; data: number }) => void
  [GAME_EVENTS.BallServed]: (sentData: { roomId: number; data: BallData }) => void
  [GAME_EVENTS.reloadPlayersList]: (sentData: { roomId: number }) => void
  [GAME_EVENTS.reloadViewersList]: (sentData: { roomId: number }) => void
}

export class GameNetwork {
  private static instance: GameNetwork
  socket: Socket<ListenEvents, EmitEvents> | undefined
  public roomId: number = 0
  private joinedGame = false

  private constructor(public user: GameUser) {
    try {
      this.socket = io('/game', { path: '/socket.io' })
    } catch (e) {
      this.joinedGame = false
      this.roomId = 0
    }
  }
  connect() {
    try {
      this.socket = io('/game', { path: '/socket.io' })
    } catch (e) {
      this.joinedGame = false
      this.roomId = 0
    }
  }

  get isOperational(): boolean {
    if (!this.socket) return false
    return this.socket?.connected && this.joinedGame
  }

  public static getInstance(user: GameUser) {
    if (!GameNetwork.instance) {
      GameNetwork.instance = new GameNetwork(user)
    }
    return GameNetwork.instance
  }

  public connectToGame(roomId: number, userType: GameUserType) {
    this.socket?.emit(GAME_EVENTS.JoinGame, { roomId, user: this.user, userType }, (res) => {
      const { worked, roomId } = res
      this.roomId = roomId
      this.joinedGame = worked
    })
  }

  // all send events functions here
  sendGameState(gameState: GAME_STATE) {
    const roomId = this.roomId
    if (this.isOperational) {
      this.socket?.emit(GAME_EVENTS.GameStateChanged, { roomId, user: this.user, gameState })
    }
  }
  sendPadMove(data: PadMovedData) {
    const roomId = this.roomId
    if (this.socket) {
      this.socket?.emit(GAME_EVENTS.PadMoved, { roomId, data })
    }
  }

  sendIaPadSpeed(data: number) {
    const roomId = this.roomId
    if (this.isOperational) {
      this.socket?.emit(GAME_EVENTS.IaPadSpeed, { roomId, data })
    }
  }

  sendBallServe(data: BallData) {
    const roomId = this.roomId
    if (this.socket) {
      this.socket.emit(GAME_EVENTS.BallServed, { roomId, data })
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
  onGameMonitorStateChanged(callback: (state: GAME_STATE) => void) {
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

  onPlayerLeft(callback: (player: GameUser) => void) {
    this.socket?.on(GAME_EVENTS.PlayerLeft, (received) => {
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
  onViewerLoadScore(callback: (score: Array<{ userId: number; score: number }>) => void) {
    this.socket?.on(GAME_EVENTS.ViewerLoadScore, (received) => {
      callback(received.data)
    })
  }
  onPadMoved(callback: (data: PaddleEngineData) => void) {
    this.socket?.on(GAME_EVENTS.PadMoved, (received) => {
      callback(received.data)
    })
  }
  onBallServed(callback: (data: BallData) => void) {
    this.socket?.on(GAME_EVENTS.BallServed, (received) => {
      callback(received.data)
    })
  }
  onBallPaddleCollision(callback: (paddleUserId: number) => void) {
    this.socket?.on(GAME_EVENTS.BallPaddleCollision, (received) => {
      callback(received.data)
    })
  }

  onBallMoved(callback: (data: BallData) => void) {
    this.socket?.on(GAME_EVENTS.BallMoved, (received) => {
      callback(received.data)
    })
  }

  onObjectsStatePacket(callback: (data: GameStateDataPacket) => void) {
    this.socket?.on(GAME_EVENTS.GameObjectState, (received) => {
      callback(received.data)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
    this.roomId = 0
    this.joinedGame = false
  }

  reconnect() {
    if (!this.socket) this.connect()
    if (this.socket?.disconnected) {
      this.socket.connect()
    }
  }
}
