import { io, Socket } from 'socket.io-client'

export enum NotificationType {
  GAME_INVITE = 'GAME_INVITE',
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  GAME_EVENT = 'GAME_EVENT',
  PRIVATE_MESSAGE = 'PRIVATE_MESSAGE'
}
export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ'
}

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  status: NotificationStatus
  title: string
  message: string
  referenceId: number
  createdAt: string
  updatedAt: string
  expiresAt: string
}
interface ListenEvents {
  notification: (data: Notification) => void
}

interface EmitEvents {
  join: (room: string) => void
}
export class NotificationSocket {
  socket: Socket<ListenEvents, EmitEvents> | undefined
  public operational: boolean = false
  constructor(userId: number, onNotification: (data: Notification) => void) {
    try {
      this.socket = io('/notification', { path: '/socket.io/' })
      this.socket.on('connect', () => {
        this.socket?.emit('join', userId.toString())
      })
      this.socket.on('notification', onNotification)
    } catch (e) {
      console.error(e)
    } finally {
      this.operational = true
    }
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
    this.operational = false
  }
}
