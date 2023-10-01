import { defineStore } from 'pinia'
import type { User } from 'Auth'
import type { AxiosError } from 'axios'
import axios from '@/utils/axios'

export interface MessageState {
  conversationsUsers: User[]
  searchTerm: string
  currentConversationUser: number | null
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
    searchTerm: ''
  }),
  getters: {
    getConversingWith(): User[] {
      if (!this.searchTerm) {
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
    nextConversationId(): number | null {
      if (this.currentConversationUser === null || this.conversationsUsers.length === 0) {
        return null
      }

      const currentIndex = this.conversationsUsers.findIndex(
        (user) => user.id === this.currentConversationUser
      )
      const nextIndex = (currentIndex + 1) % this.conversationsUsers.length
      return this.conversationsUsers[nextIndex]?.id || null
    },
    previousConversationId(): number | null {
      if (this.currentConversationUser === null || this.conversationsUsers.length === 0) {
        return null
      }

      const currentIndex = this.conversationsUsers.findIndex(
        (user) => user.id === this.currentConversationUser
      )
      const prevIndex =
        (currentIndex - 1 + this.conversationsUsers.length) % this.conversationsUsers.length
      return this.conversationsUsers[prevIndex]?.id || null
    },
    currentConversationWith(): User | null {
      if (this.currentContactId) {
        const current = this.getConversingWith.find(
          (user: User) => user.id === this.currentContactId
        )
        return current
      }
      return null
    }
  },
  actions: {
    setSearchTerm(term: string) {
      this.searchTerm = term
    },
    setCurrentConversationWith(id: number) {
      const idFound = this.conversationsUsers.findIndex((user) => (user.id = id))
      if (idFound >= 0) {
        this.currentConversationUser = this.conversationsUsers[idFound].id
      }
    },
    async getUniqueConversations() {
      try {
        const { data } = await axios.get<User[]>('/messages/conversations', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        this.conversationsUsers = data
        if (this.conversationsUsers.length) {
          this.currentConversationUser = this.conversationsUsers[0].id
        }
      } catch (error: AxiosError | any) {
        console.error('Failed to load conversations:', error.message)
      }
    },

    async getPrivateMessageBetween(info: {
      userTwoId: number
      skip: number
      take: number
    }): Promise<PrivateMessage[]> {
      const { userTwoId, skip, take } = info
      try {
        this.currentConversationUser = userTwoId
        const { data } = await axios.get(`/messages/private/${userTwoId}`, {
          params: {
            skip,
            take
          }
        })
        return data as Array<PrivateMessage>
      } catch (error: AxiosError | any) {
        console.error('Failed to load all private messages:', error.message)
      }
      return []
    },

    async sendPrivateMessage(message: MPData): Promise<PrivateMessage | null> {
      try {
        const { data } = await axios.post('messages/', message, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        return data as PrivateMessage
      } catch (error: AxiosError | any) {
        console.error('Failed to send private message:', error.message)
      }
      return null
    }
  }
})

export default useMessageStore
