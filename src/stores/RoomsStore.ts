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
    userId: number
    rooms: ChatRoomWithMembers[]
    publicRooms: ChatRoomWithMembers[]
    socketManager: ChatSocket | null
    currentReadRoomId: number | null
    currentRoomMembers: MemberRoomWithUserProfiles[]
    currentRoomMessages: ChatMessage[]
    searchTerm: string
    contactTyping: Map<number, number>
    isLeftNavOpen: boolean
    isRightNavOpen: boolean
    roomsMembersTyping: Map<number, { senderId: number; username: string; timestamp: number }>
  } => {
    return {
      userId: 0,
      rooms: [],
      publicRooms: [],
      searchTerm: '',
      socketManager: null,
      currentReadRoomId: null,
      currentRoomMembers: [],
      currentRoomMessages: [],
      contactTyping: new Map<number, number>(),
      roomsMembersTyping: new Map<number, { senderId: number; username: string; timestamp: number }>(),
      isLeftNavOpen: false,
      isRightNavOpen: false
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
    getCurrentRoomMessages(): ChatMessage[] {
      return this.currentRoomMessages
    },
    getSearchTerm(): string {
      return this.searchTerm
    },
    getContactTyping(): Map<number, number> {
      return this.contactTyping
    },
    getRoomMembersTyping(): Map<number, { senderId: number; username: string; timestamp: number }> {
      return this.roomsMembersTyping
    },
    getIsLeftNavOpen(): boolean {
      return this.isLeftNavOpen
    },
    getIsRightNavOpen(): boolean {
      return this.isRightNavOpen
    }
  },
  actions: {
    async init(userId: number) {
      this.userId = userId
      await this.getAllMyRooms()
      const messageStore = useMessageStore()
      this.socketManager = ChatSocket.getInstance(
        userId,
        (message: ChatMessage) => {
          if (message.chatroomId === this.currentReadRoomId) {
            this.currentRoomMessages.push(message)
          }
        },
        (message: PrivateMessage) => {
          messageStore.handleReceivedMessage(message)
        },
        (error: string) => {
          console.log(error)
        },
        (error: string) => {
          console.log(error)
        },
        (roomId: number) => {
          // if room is the current room, reload members
          if (roomId === this.currentReadRoomId) {
            this.setCurrentRoom(roomId)
          }
        },
        (typingInfo: { senderId: number; roomId: number; username: string; timestamp: number }) => {
          this.roomsMembersTyping.set(typingInfo.roomId, typingInfo)
        },
        (senderId: number) => {
          messageStore.reloadConversation(senderId)
        },
        (senderId: number, timestamp: number) => {
          this.contactTyping.set(senderId, timestamp)
        }
      )
      if (!this.socketManager) return
      messageStore.setSocketManager(this.socketManager as ChatSocket)
    },
    setSearchTerm(term: string) {
      this.searchTerm = term
    },
    sendMessage(roomId: number, content: string) {
      if (!this.socketManager) return
      this.socketManager.sendMessage(roomId, content)
    },
    sendUserIsTypingInRoom(roomId: number, username: string) {
      if (!this.socketManager) return
      this.socketManager.userIsTypingInRoom(roomId, username)
    },

    /*
     * Join a room
     * @param roomId the id of the room to join
     * @param info the info to join the room (userId, password)
     * @returns ChatRoomMember if success, string if error
     */
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
    async joinRoom(roomId: number, info: JoinRoom): Promise<ChatRoomMember | string> {
      let errorMessage = `Vous n'êtes pas autorisé à rejoindre cette salle`
      try {
        const { data } = await axios.post<ChatRoomMember>(`/chat/join-room/${roomId}`, info)
        await this.getAllMyRooms()
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
    // Get current role if member of room or null if not a member
    async checkRoomRole(
      roomId: number
    ): Promise<{ state: boolean; role: ChatMemberRole | null; room?: ChatRoom }> {
      try {
        const { data } = await axios.get<{
          state: boolean
          role: ChatMemberRole | null
          room?: ChatRoom
        }>(`/chat/room-role/${roomId}`)
        return data
      } catch (error) {
        console.error(error)
      }
      return { state: false, role: null }
    },
    async leaveRoom(roomId: number): Promise<'success' | 'failed'> {
      try {
        await axios.get(`/chat/leave-room/${roomId}`)
        // Mise à jour du store après avoir quitté la salle
        this.rooms = this.rooms.filter((room) => room.id !== roomId)
        return 'success'
      } catch (error) {
        console.error(error)
        return 'failed'
      }
    },
    async deleteRoom(roomId: number): Promise<'success' | 'failed'> {
      try {
        // if is current room, set current room to next in array or to null
        if (this.currentReadRoomId === roomId) {
          const index = this.rooms.findIndex((room) => room.id === roomId)
          if (index !== -1) {
            const nextRoom = this.rooms[index + 1] ?? this.rooms[index - 1] ?? null
            if (nextRoom) {
              await this.setCurrentRoom(nextRoom.id)
            } else {
              this.currentReadRoomId = null
            }
          }
        }
        await axios.delete<ChatRoom>(`/chat/delete-room/${roomId}`)
        this.rooms = this.rooms.filter((room) => room.id !== roomId)
        return 'success'
      } catch (error) {
        console.error(error)
        return 'failed'
      }
    },
    async changeMemberRole(
      roomId: number,
      userId: number,
      newRole: ChatMemberRole,
      existingRole: ChatMemberRole,
      expireAt?: number // timestamp for the end of BAN role if needed
    ): Promise<'success' | 'failed'> {
      try {
        // only owner can't change his role
        if (existingRole === ChatMemberRole.OWNER) {
          return 'failed'
        }
        await axios.post(`/chat/promote/${roomId}`, { userId, role: newRole, expireAt })
        this.sendReloadRoomMembers(roomId)
        return 'success'
      } catch (error) {
        console.error(error)
        return 'failed'
      }
    },
    async updateRoomPassword(
      roomId: number,
      newPassword: string,
      currentRole: ChatMemberRole
    ): Promise<'success' | 'failed'> {
      if (currentRole !== ChatMemberRole.OWNER && currentRole !== ChatMemberRole.ADMIN) {
        return 'failed'
      }
      try {
        await axios.patch(`/chat/update-password`, { roomId, password: newPassword })
        return 'success'
      } catch (error) {
        console.error(error)
        return 'failed'
      }
    },
    /*
     * Set the current room to read, only if user is a member of the room
     * @param roomId the id of the room to read
     * @returns 'success' if success, string if error
     * The current room is the room that the user is currently reading
     * This will also load the members of the room
     */
    async setCurrentRoom(roomId: number): Promise<'success' | 'error'> {
      try {
        // Clear previous room's state if changing rooms
        if (this.currentReadRoomId !== roomId) {
          this.currentRoomMembers = []
        }
        const members = await this.getRoomMembersData(roomId)
        if (Array.isArray(members)) {
          this.currentRoomMembers = members
          this.currentReadRoomId = roomId
          this.currentRoomMessages = []
          this.listenToRoom(roomId)
          return 'success'
        } else {
          return 'error'
        }
      } catch (error) {
        console.error(error)
        return 'error'
      }
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
    async reloadCurrentRoomMembers(): Promise<'success' | 'failed'> {
      if (!this.currentReadRoomId) return 'failed'
      try {
        const members = await this.getRoomMembersData(this.currentReadRoomId)
        if (Array.isArray(members)) {
          this.currentRoomMembers = members
          return 'success'
        } else {
          return 'failed'
        }
      } catch (error) {
        console.error(error)
        return 'failed'
      }
    },
    async loadCurrentRoomMessages(info: { skip: number; take: number }): Promise<void> {
      const { skip, take } = info
      if (!this.currentReadRoomId) return
      try {
        const { data } = await axios.get<ChatMessage[]>(
          `/chat/messages/${this.currentReadRoomId}`,
          {
            params: {
              skip,
              take
            }
          }
        )
        this.currentRoomMessages = data
      } catch (error) {
        console.error('Failed to load room messages:', error)
      }
    },
    // fetch PUBLIC and PROTECTED rooms
    async fetchPublicRooms() {
      try {
        const { data } = await axios.get<ChatRoomWithMembers[]>('/chat/public')
        this.publicRooms = data
      } catch (error) {
        console.error(error)
      }
    },
    // get all rooms where user is a member and start listening to them
    async getAllMyRooms() {
      try {
        const { data } = await axios.get<ChatRoomWithMembers[]>('/chat/rooms')
        // start listening to all rooms
        data.forEach((room) => {
          // avoid listening to room if user is banned from it
          const member = room.members.find((member) => member.id === this.userId)
          if (member && member.role === ChatMemberRole.BAN) return
          this.listenToRoom(room.id)
        })
        this.rooms = data
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
    // reload room members
    sendReloadRoomMembers(roomId: number) {
      if (!this.socketManager) return
      if (!this.socketManager.operational) return
      this.socketManager.reloadRoomMembers(roomId)
    },
    disconnect() {
      this.socketManager?.disconnect()
      this.socketManager = null
    },
    toggleLeftNav() {
      this.isLeftNavOpen = !this.isLeftNavOpen
    },
    toggleRightNav() {
      this.isRightNavOpen = !this.isRightNavOpen
    }
  }
})

export default useRoomsStore
