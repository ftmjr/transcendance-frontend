import { defineStore } from 'pinia'
import type { Profile, User } from '@/interfaces/User'
import axios from '@/utils/axios'
import useUserStore from '@/stores/UserStore'
import { ChatSocket } from '@/utils/chatSocket'
import { isAxiosError } from 'axios'

export interface MessageState {
  conversationsUsers: Array<User & { profile: Profile }>
  searchTerm: string
  currentConversationUser: number | null
  socketManager: ChatSocket | null
  messages: Map<number, PrivateMessage[]>
}

export interface MPData {
  receiverId: number
  content: string
}

export interface PrivateMessage {
  id: number
  text: string
  senderId: number
  receiverId: number
  timestamp: string
}

const useMessageStore = defineStore({
  id: 'message',
  state: (): MessageState => ({
    conversationsUsers: [],
    currentConversationUser: null,
    searchTerm: '',
    socketManager: null,
    messages: new Map<number, PrivateMessage[]>()
  }),
  getters: {
    conversesWithContacts(): Array<User & { profile: Profile }> {
      if (!this.searchTerm.trim()) {
        return this.conversationsUsers
      }
      const term = this.searchTerm.toLowerCase()
      return this.conversationsUsers.filter((user) => {
        // Check username, email, and profile name and lastname
        return (
          user.username.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.profile && user.profile.name.toLowerCase().includes(term)) ||
          (user.profile && user.profile.lastname.toLowerCase().includes(term))
        )
      })
    },
    getSearchTerm(): string {
      return this.searchTerm
    },
    currentContactId(): number | null {
      return this.currentConversationUser
    },
    currentContact(): (User & { profile: Profile }) | null {
      if (this.currentContactId) {
        const current = this.conversesWithContacts.find(
          (user: User) => user.id === this.currentContactId
        )
        if (current) return current
      }
      return null
    },
    contacts(): Array<User & { profile: Profile }> {
      const userStore = useUserStore()
      return userStore.contacts
    },
    contactsWithoutConversations(): Array<User & { profile: Profile }> {
      return this.contacts.filter((contact: User) => {
        return !this.conversationsUsers.some((user: User) => user.id === contact.id)
      })
    },
    currentConversationMessages(): PrivateMessage[] {
      if (!this.currentConversationUser) {
        return []
      }
      return this.messages.get(this.currentConversationUser) || []
    }
  },
  actions: {
    setSearchTerm(term: string) {
      this.searchTerm = term
    },
    setSocketManager(socketManager: ChatSocket) {
      this.socketManager = socketManager
    },
    setCurrentConversationWith(userId: number) {
      const foundUser = this.conversationsUsers.find((user) => user.id === userId)
      if (foundUser) {
        this.currentConversationUser = foundUser.id
      } else {
        // check if user is in contacts
        const contactFound = this.contacts.find((user) => user.id === userId)
        if (contactFound) {
          this.conversationsUsers.unshift(contactFound)
          this.currentConversationUser = contactFound.id
        }
      }
    },
    // on mounted
    async getUniqueConversations() {
      try {
        const { data } = await axios.get<Array<User & { profile: Profile }>>('/messages', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        this.conversationsUsers = data
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response) {
            console.error('Failed to load conversations:', error.response.data.message)
          }
        } else {
          console.error('Failed to load conversations:')
        }
      }
    },
    async getPrivateMessageBetween(info: {
      userTwoId: number
      skip: number
      take: number
    }): Promise<void> {
      const { userTwoId, skip, take } = info
      try {
        this.currentConversationUser = userTwoId
        const { data } = await axios.get(`/messages/${userTwoId}`, {
          params: {
            skip,
            take
          }
        })
        this.messages.set(userTwoId, data)
      } catch (error) {
        console.error('Failed to load all private messages:', error)
      }
    },
    async sendPrivateMessageViaHttp(message: MPData): Promise<PrivateMessage | null> {
      try {
        const { data } = await axios.post('/messages', message, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        return data as PrivateMessage
      } catch (error) {
        console.error('Failed to send private message:', error)
      }
      return null
    },
    sendPrivateMessage(friendId: number, content: string) {
      if (!this.socketManager || !this.socketManager.operational) return
      this.socketManager.sendPrivateMessage(friendId, content)
    },
    sendUserTyping(receiverId: number) {
      if (!this.socketManager || !this.socketManager.operational) return
      this.socketManager.mpUserIsTyping(receiverId)
    },
    sendUserReload(receiverId: number) {
        if (!this.socketManager || !this.socketManager.operational) return
        this.socketManager.reloadMpConversation(receiverId);
    },
    async handleReceivedMessage(message: PrivateMessage) {
      const userId =
        message.senderId === this.socketManager?.userId ? message.receiverId : message.senderId
      const userMessages = this.messages.get(userId) || []
      userMessages.push(message)
      this.messages.set(userId, userMessages)
    },
    getLastMessageBetween(userId: number): PrivateMessage | null {
      const userMessages = this.messages.get(userId) || []
      if (userMessages.length === 0) {
        return null
      }
      return userMessages[userMessages.length - 1]
    },
    reloadConversation(userId: number) {
      if (this.currentContactId === userId) {
        this.currentConversationUser = null;
        this.currentConversationUser = userId;
      }
    }
  }
})

export default useMessageStore
