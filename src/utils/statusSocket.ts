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
  private socket: Socket<ListenEvents, EmitEvents> | undefined
  public operational: boolean = false

  constructor(
    private userId: number,
    private _onStatusUpdate: (data: ReceivedStatusUpdate) => void
  ) {
    this.connect()
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
}
