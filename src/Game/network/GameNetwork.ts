import { io } from 'socket.io-client'
import type { TRoomId } from '@/Game/network/GameMonitor'
import { GAME_EVENTS } from '@/Game/network/GameMonitor'

export enum GameUserType {
  Player,
  Viewer,
  LocalPlayer
}

export interface GameUser {
  userId: number
  username: string
  avatar?: string
}

interface JoinGameResponse {
  worked: boolean
  roomId: TRoomId
}

export class GameNetwork {
  public socket
  public operational: boolean = false
  constructor(public user: GameUser) {
    try {
      this.socket = io('/game', { path: '/socket.io' })
    } catch (e) {
      console.error(e)
    } finally {
      this.operational = true
    }
  }

  connectToAGame(
    roomId: number,
    userType: GameUserType,
    onConnected: (res: JoinGameResponse) => void
  ) {
    if (this.socket) {
      this.disconnect()
    }
    try {
      this.socket = io('/game', { path: '/socket.io' })
    } catch (e) {
      console.error(e)
    } finally {
      switch (userType) {
        case GameUserType.Viewer:
          this.socket?.emit(
            GAME_EVENTS.ViewGame,
            {
              roomId,
              user: this.user,
              userType
            },
            onConnected
          )
          break
        case GameUserType.LocalPlayer:
          this.socket?.emit(
            GAME_EVENTS.JoinGame,
            {
              roomId,
              user: this.user,
              userType
            },
            onConnected
          )
          break
        case GameUserType.Player:
        default:
          this.socket?.emit(
            GAME_EVENTS.JoinGame,
            {
              roomId,
              user: this.user,
              userType
            },
            onConnected
          )
      }
      this.operational = true
    }
  }

  emitFromGame(event: GAME_EVENTS, roomId: TRoomId, isIA: boolean, ...args: any[]) {
    const data = {
      roomId: roomId,
      user: this.user,
      isIA: isIA,
      actionData: args
    }
    this.socket?.emit(event, data)
  }

  disconnect() {
    this.socket?.disconnect()
    this.operational = false
  }
}
