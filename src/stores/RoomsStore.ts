import { defineStore } from 'pinia'
import {
  ChatMemberRole,
  ChatMessage,
  ChatRoom,
  ChatRoomMember,
  ChatSocket,
  RoomType
} from '@/utils/chatSocket'
import axios from '@/utils/axios'
import { Profile, User } from '@/interfaces/User'
import useMessageStore, { PrivateMessage } from '@/stores/MessageStore'
import { isAxiosError } from 'axios'
export interface JoinRoom {
  userId: number
  password?: string
}
export interface CreateRoom {
  ownerId: number
  name: string
  type: RoomType
  password?: string
  avatar?: string
}

export type ChatRoomWithMembers = ChatRoom & {
  members: ChatRoomMember[]
}

export type MemberRoomWithUserProfiles = ChatRoomMember & {
  member: User & {
    profile: Profile
  }
}

export const rolePrint: Array<{
  role: ChatMemberRole
  printRole: string
  color?: string
  bgClass?: string
}> = [
  { role: ChatMemberRole.OWNER, printRole: 'Big Boss', color: 'success' },
  { role: ChatMemberRole.ADMIN, printRole: 'Administrateur', bgClass: 'info' },
  { role: ChatMemberRole.USER, printRole: 'Utilisateur', color: 'dark' },
  { role: ChatMemberRole.BAN, printRole: 'Ban', color: 'danger' }
]

const useRoomsStore = defineStore({
  id: 'roomsStore',
  state: (): {
    rooms: ChatRoomWithMembers[]
    publicRooms: ChatRoomWithMembers[]
    socketManager: ChatSocket | null
    currentReadRoomId: number | null
    currentRoomMembers: MemberRoomWithUserProfiles[]
    searchTerm: string
  } => {
    return {
      rooms: [],
      publicRooms: [],
      socketManager: null,
      currentReadRoomId: null,
      currentRoomMembers: [],
      searchTerm: ''
    }
  },
  getters: {
    socketOperational(): boolean {
      return this.socketManager?.operational ?? false
    },
    myRooms(): ChatRoomWithMembers[] {
      return this.rooms
    },
    filteredRooms(): ChatRoomWithMembers[] {
      if (!this.searchTerm) {
        return this.rooms
      }
      const term = this.searchTerm.toLowerCase()
      return this.rooms.filter((room: ChatRoomWithMembers) => {
        return room.name.toLowerCase().includes(term)
      })
    },
    AllPublic(): ChatRoomWithMembers[] {
      return this.publicRooms
    },
    publicButNotJoined(): ChatRoomWithMembers[] {
      return this.publicRooms.filter(
        (room: ChatRoomWithMembers) =>
          !this.rooms.find((r: ChatRoomWithMembers) => r.id === room.id)
      )
    },
    filteredPublic(): ChatRoomWithMembers[] {
      const publicNotAlreadyJoined = this.publicButNotJoined
      if (!this.searchTerm) {
        return publicNotAlreadyJoined
      }
      const term = this.searchTerm.toLowerCase()
      return this.publicButNotJoined.filter((room: ChatRoomWithMembers) => {
        return room.name.toLowerCase().includes(term)
      })
    },
    currentRoom(): ChatRoomWithMembers | null {
      return (
        this.rooms.find((room: ChatRoomWithMembers) => room.id === this.currentReadRoomId) ?? null
      )
    },
    getCurrentRoomMembers(): MemberRoomWithUserProfiles[] {
      return this.currentRoomMembers
    },
    getSearchTerm(): string {
      return this.searchTerm
    }
  },
  actions: {
    async init(userId: number) {
      await this.getAllMyRooms();
      const messageStore = useMessageStore()
      this.socketManager = new ChatSocket(
        userId,
        (message: ChatMessage) => {
          console.log('chat room message received', message)
        },
        (message: PrivateMessage) => {
          messageStore.handleReceivedMessage(message)
        },
        (error: string) => {
          console.log('failed sending msg', error)
        },
        (error: string) => {
          console.log('failed connecting', error)
        }
      )
      if (!this.socketManager) return
      messageStore.setSocketManager(this.socketManager as ChatSocket)
    },
    sendMessage(roomId: number, content: string) {
      if (!this.socketManager) return
      this.socketManager.sendMessage(roomId, content)
    },
    setSearchTerm(term: string) {
      this.searchTerm = term
    },
    async createRoom(info: CreateRoom): Promise<'success' | 'failed'> {
      try {
        const { data } = await axios.post<ChatRoomWithMembers>('/chat/create-room', info)
        this.rooms.unshift(data)
        await this.setCurrentRoom(data.id)
        return 'success'
      } catch (error) {
        console.error(error)
      }
      return 'failed'
    },

    /*
     * Join a room
     * @param roomId the id of the room to join
     * @param info the info to join the room (userId, password)
     * @returns ChatRoomMember if success, string if error
     */
    async joinRoom(roomId: number, info: JoinRoom): Promise<ChatRoomMember | string> {
      let errorMessage = `Vous n'êtes pas autorisé à rejoindre cette salle`
      try {
        const { data } = await axios.post<ChatRoomMember>(`/chat/join-room/${roomId}`, info)
        await this.getAllMyRooms()
        await this.setCurrentRoom(roomId)
        return data
      } catch (error) {
        if (isAxiosError(error)) {
          const status = error.response?.status
          if (status === 401 || status === 403 || status === 404) {
            errorMessage =
              error.response?.data.message ?? `Vous n'êtes pas autorisé à rejoindre cette salle`
          }
        }
      }
      return errorMessage
    },
    // start listening to a room via socket
    listenToRoom(roomId: number) {
      if (!this.socketManager) return
      if (!this.socketManager.operational) return
      this.socketManager.listenRoom(roomId)
    },
    // quit the chat group
    async leaveRoom(roomId: number, userId: number) {
      try {
        await axios.post<ChatRoomMember>('/chat/leave-room', {
          roomId,
          userId
        })
        this.rooms = this.rooms.filter((room) => room.id !== roomId)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteRoom(roomId: number) {
      try {
        const { data } = await axios.post<ChatRoom>(`/chat/delete-room/${roomId}`)
        this.rooms = this.rooms.filter((room) => room.id !== data.id)
      } catch (error) {
        console.error(error)
      }
    },
    async fetchPublicRooms() {
      try {
        const { data } = await axios.get<ChatRoomWithMembers[]>('/chat/public')
        this.publicRooms = data
      } catch (error) {
        console.error(error)
      }
    },
    /*
     * Set the current room to read
     * @param roomId the id of the room to read
     * @returns 'success' if success, string if error
     * The current room is the room that the user is currently reading
     * This will also load the members of the room
     */
    async setCurrentRoom(roomId: number): Promise<'success' | string> {
      try {
        const members = await this.getRoomMembersData(roomId)
        if (Array.isArray(members)) {
          this.currentRoomMembers = members
          this.currentReadRoomId = roomId
          return 'success'
        } else {
          return members
        }
      } catch (error) {
        console.error(error)
      }
      return 'impossible de récupérer les membres de la salle'
    },
    async getRoomMembersData(roomId: number): Promise<MemberRoomWithUserProfiles[] | string> {
      let errorMessage = `Vous n'êtes pas autorisé à voir les membres de cette salle`
      try {
        const { data } = await axios.get<MemberRoomWithUserProfiles[]>(`/chat/room/${roomId}`)
        return data
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            errorMessage =
              error.response.data.message ??
              `Vous n'êtes pas autorisé à voir les membres de cette salle`
          }
        }
      }
      return errorMessage
    },
    async getAllMyRooms() {
      try {
        const { data } = await axios.get<ChatRoomWithMembers[]>('/chat/rooms')
        this.rooms = data
        if (data.length > 0) {
          this.currentReadRoomId = data[0].id
          await this.setCurrentRoom(data[0].id)
        }
      } catch (error) {
        console.error(error)
      }
    },
    disconnect() {
      this.socketManager?.disconnect()
      this.socketManager = null
    }
  }
})

export default useRoomsStore
