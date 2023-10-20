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
export interface JoinRoom {
  userId: number
  password?: string
}
export interface CreateRoom {
  ownerId: number
  name: string
  type: RoomType
  password?: string
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
      await this.getAllMyRooms()
      await this.fetchPublicRooms()
      const messageStore = useMessageStore()
      this.socketManager = new ChatSocket(
        userId,
        (message: ChatMessage) => {
          // code for new messages from chatRooms coming from the server via socket
        },
        (message: PrivateMessage) => {
          messageStore.handleReceivedMessage(message)
        },
        (error: string) => {
          // code for failed to send message
        },
        (error: string) => {
          // code on failed connection to the socket server
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
    async createRoom(info: CreateRoom) {
      // to be implemented
    },
    // to be a member of a chat group
    async joinRoom(roomId: number, info: JoinRoom) {
      try {
        const { data } = await axios.post<ChatRoomMember>(`/chat/join-room/${roomId}`, info)
        await this.getAllMyRooms()
      } catch (error) {
        console.error(error)
      }
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
    // give more info about the room
    async setCurrentRoom(roomId: number) {
      try {
        const members = await this.getRoomMembersData(roomId)
        if (members) {
          this.currentRoomMembers = members
          this.currentReadRoomId = roomId
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getRoomMembersData(roomId: number): Promise<MemberRoomWithUserProfiles[]> {
      try {
        const { data } = await axios.get<MemberRoomWithUserProfiles[]>(`/chat/room/${roomId}`)
        return data
      } catch (error) {
        console.error(error)
      }
      return []
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
