import { defineStore } from 'pinia'
import useAuthStore from '@/stores/AuthStore'
import type { ChatState, Role, Status, ChatroomMember, ChatroomMessage, Chatroom } from 'Chat'
import chatSocketService from '../utils/socketio'

const authStore = useAuthStore()

const useChatStore = defineStore({
  id: 'chat',
  state: (): ChatState => {
    const socket = chatSocketService
    const socketOptions = {
      extraHeaders: {
        Authorization: `Bearer ${authStore.getToken}`
      }
    }
    const chatroomMessages = []
    const chatrooms = []
    const chatroomMembers = []
    //const chatrooms = JSON.parse(localStorage.getItem('__chatrooms__') ?? 'null') as Chatrooms | null;
    return {
      socket,
      socketOptions,
      chatrooms,
      chatroomMessages,
      chatroomMembers,
      error: {
        state: false,
        message: ''
      }
    }
  },
  getters: {
    getChatrooms(): Chatrooms | null {
      return this.chatrooms
    },
    getChatroomMessages(): ChatroomMessage[] | null {
      return this.chatroomMessages
    },
    getChatroomMembers(): ChatroomMember[] | null {
      return this.chatroomMembers
    },
    getSocketOptions() {
      return this.socketOptions
    }
  },
  actions: {
    initUser() {
      this.socket.connectChat()
    },
    setChatrooms(chatrooms: Chatroom[]) {
      if (this.chatrooms) this.chatrooms.clear()
      chatrooms.forEach((chatroom) => {
        this.chatrooms.push(chatroom)
      })
    },
    setMessages(chatroomMessages: ChatroomMessage[]) {
      if (this.chatroomMessages) this.chatroomMessages.clear()
      chatroomMessages.forEach((chatroomMessage) => {
        this.chatroomMessages.push(chatroomMessage)
      })
    }
  },
  setChatroomMembers(chatroomMembers: ChatroomMember[]) {
    if (this.chatroomMembers) this.chatroomMembers.clear()
    chatroomMembers.forEach((chatroomMember) => {
      this.chatroomMembers.push(chatroomMember)
    })
  }
})

export default useChatStore
