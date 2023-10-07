import { io, Socket } from 'socket.io-client'
import { PrivateMessage } from '@/stores/MessageStore'

export enum RoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED'
}

export enum ChatMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  USER = 'USER',
  BAN = 'BAN'
}
export interface ChatRoomMember {
  id: number
  memberId: number
  chatroomId: number
  role: ChatMemberRole
  createdAt: string
  updatedAt: string
}

export interface ChatRoom {
  id: number
  name: string
  type: RoomType
  password: string | null
  avatar: string | null
  createdAt: string
  members?: ChatRoomMember[]
}
export interface ChatMessage {
  id: number
  chatroomId: number
  userId: number
  content: string
  timestamp: string // date
}

interface ListenEvents {
  newMessage: (message: ChatMessage) => void
  newMP: (message: PrivateMessage) => void
  failedToSendMessage: (error: string) => void
  connectionError: (error: string) => void
}

interface EmitEvents {
  sendMessage: (data: { senderId: number; roomId: number; content: string }) => void
  sendPrivateMessage: (data: { senderId: number; receiverId: number; content: string }) => void
  joinRoom: (data: { roomId: number; userId: number }) => void
}

export class ChatSocket {
  socket: Socket<ListenEvents, EmitEvents> | undefined
  public userId: number | undefined
  public operational: boolean = false
  public managedRoomIds: number[] = []

  constructor(
    userId: number,
    onNewMessage: (message: ChatMessage) => void,
    onNewMp: (message: PrivateMessage) => void,
    onFailedToSendMessage: (error: string) => void,
    onConnectionError: (error: string) => void
  ) {
    this.userId = userId
    try {
      this.socket = io('/chat', {
        path: '/socket.io/',
        query: { userId },
        auth: { token: 'testToken' }
      })
      this.socket.on('connect', () => {
        this.operational = true
      })
      this.socket.on('disconnect', () => {
        console.log('Disconnected from chat server')
        this.operational = false
      })
      this.socket.on('newMessage', onNewMessage)
      this.socket.on('newMP', onNewMp)
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

  sendPrivateMessage(receiverId: number, content: string) {
    if (this.socket && this.operational) {
      this.socket.emit('sendPrivateMessage', {
        senderId: this.userId,
        receiverId,
        content
      })
    }
  }

  listenRoom(roomId: number) {
    if (this.socket && this.operational) {
      this.socket.emit('joinRoom', {
        roomId,
        userId: this.userId
      })
      this.managedRoomIds.push(roomId)
    }
  }
}
