import { io } from 'socket.io-client'
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
    roomGame: string,
    userType: GameUserType,
    onConnected: (worked: boolean, roomId: string) => void
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
              roomGame,
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
              roomGame,
              user: this.user,
              userType
            },
            onConnected
          )
      }
      this.operational = true
    }
  }

  emitFromGame(event: string, gameRoom: string, ...args: any[]) {
    const data = {
      room: gameRoom,
      user: this.user,
      ...args
    }
    this.socket?.emit(event, data)
  }

  disconnect() {
    this.socket?.disconnect()
    this.operational = false
  }
}
