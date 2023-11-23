import { io, Socket } from 'socket.io-client'
import { Status } from '@/interfaces/User'

export interface ReceivedStatusUpdate {
  userId: number
  status: Status
}

interface ListenEvents {
  statusUpdate: (data: ReceivedStatusUpdate) => void
}

interface EmitEvents {
  updateStatus: (status: Status) => void
}

export class StatusSocket {
  private static instance: StatusSocket
  private socket: Socket<ListenEvents, EmitEvents> | undefined
  public operational: boolean = false

  private constructor(
    private userId: number,
    private _onStatusUpdate: (data: ReceivedStatusUpdate) => void
  ) {
    this.connect()
  }

  public static getInstance(
    userId: number,
    onStatusUpdate: (data: ReceivedStatusUpdate) => void
  ): StatusSocket {
    if (!StatusSocket.instance) {
      StatusSocket.instance = new StatusSocket(userId, onStatusUpdate)
    }
    return StatusSocket.instance
  }

  private connect() {
    this.socket = io('/auth', {
      path: '/socket.io/',
      query: { userId: this.userId },
      // auth: { token: 'testToken' },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000
    })
    this.socket.on('connect', () => {
      this.operational = true
    })
    this.socket.on('statusUpdate', this._onStatusUpdate)
    this.socket.on('disconnect', () => {
      this.operational = false
    })
  }

  updateMyStatus(status: Status) {
    if (this.socket && this.operational) {
      this.socket.emit('updateStatus', status)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
    this.operational = false
  }

  reconnect() {
    if (this.socket) {
      if (!this.socket.connected) {
        this.socket.connect()
      }
    }
    this.operational = true
  }
}
