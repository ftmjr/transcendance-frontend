import { io, Socket } from 'socket.io-client'

export interface ChatMessage {
  id: number
  chatroomId: number
  userId: number
  content: string
  timestamp: string // date
}

interface ListenEvents {
  newMessage: (message: ChatMessage) => void
  failedToSendMessage: (error: string) => void
  connectionError: (error: string) => void
}

interface EmitEvents {
  sendMessage: (data: { senderId: number; roomId: number; content: string }) => void
}

export class ChatSocket {
  socket: Socket<ListenEvents, EmitEvents> | undefined
  private readonly userId: number | undefined
  public operational: boolean = false
  public managedRoomIds: number[] = []

  constructor(
    userId: number,
    onNewMessage: (message: ChatMessage) => void,
    onFailedToSendMessage: (error: string) => void,
    onConnectionError: (error: string) => void
  ) {
    this.userId = userId
    try {
      this.socket = io('/chat', { path: '/socket.io', query: { userId } })
      this.socket.on('connect', () => {
        this.operational = true
      })
      this.socket.on('disconnect', () => {
        console.log('Disconnected from chat server')
        this.operational = false
      })
      this.socket.on('newMessage', onNewMessage)
      this.socket.on('failedToSendMessage', onFailedToSendMessage)
      this.socket.on('connectionError', onConnectionError)
    } catch (e) {
      console.error(e)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
    this.operational = false
  }

  sendMessage(roomId: number, content: string) {
    if (this.socket && this.operational) {
      this.socket.emit('sendMessage', {
        senderId: this.userId,
        roomId,
        content
      })
    }
  }
}
