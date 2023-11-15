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
    getConversingWith(): User[] {
      if (!this.searchTerm.trim()) {
        return this.conversationsUsers
      }
      const term = this.searchTerm.toLowerCase();
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
    currentConversationWith(): User | null {
      if (this.currentContactId) {
        const current = this.getConversingWith.find(
          (user: User) => user.id === this.currentContactId
        )
        if (current) return current
      }
      return null
    },
    getContactsWithoutConversation(): User[] {
      // get contact from UserStore getter getContacts and filter
      // out the ones that are already in conversationsUsers
      const userStore = useUserStore()
      const contacts = userStore.getContact
      return contacts.filter((contact: User) => {
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
      const idFound = this.conversationsUsers.findIndex((user) => user.id === userId)
      if (idFound >= 0) {
        this.currentConversationUser = this.conversationsUsers[idFound].id
      } else {
        // check if user is in contacts
        const userStore = useUserStore()
        const contacts = userStore.getContact
        const contactFound = contacts.findIndex((user: User) => user.id === userId)
        console.log('trying to find')
        if (contactFound >= 0) {
          console.log('found')
          this.conversationsUsers.unshift(contacts[contactFound])
          this.currentConversationUser = contacts[contactFound].id;
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
        if (this.conversationsUsers.length) {
          this.currentConversationUser = this.conversationsUsers[0].id
        }
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
    sendUserIsTyping(receiverId: number) {
      if (!this.socketManager || !this.socketManager.operational) return
      this.socketManager.mpUserIsTyping(receiverId)
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
    }
  }
})

export default useMessageStore
