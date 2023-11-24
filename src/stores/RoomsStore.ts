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
import useUserStore, { BlockedStatus } from '@/stores/UserStore'

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
    currentRoomId: number | null // id of the room that the user is currently reading
    currentRoomStatus: { state: boolean; role: ChatMemberRole | null; room?: ChatRoom } // current room status
    currentRoomMembers: MemberRoomWithUserProfiles[]
    currentRoomMessages: ChatMessage[]
    currentRoomBlockedStatus: { userId: number; status: BlockedStatus }[]
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
      currentRoomId: null,
      currentRoomStatus: { state: false, role: null },
      currentRoomMembers: [],
      currentRoomMessages: [],
      currentRoomBlockedStatus: [],
      contactTyping: new Map<number, number>(),
      roomsMembersTyping: new Map<
        number,
        { senderId: number; username: string; timestamp: number }
      >(),
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
    allPublic(): ChatRoomWithMembers[] {
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
      return this.rooms.find((room: ChatRoomWithMembers) => room.id === this.currentRoomId) ?? null
    },
    getCurrentRoomStatus(): { state: boolean; role: ChatMemberRole | null; room?: ChatRoom } {
      return this.currentRoomStatus
    },
    getCurrentRoomMembers(): MemberRoomWithUserProfiles[] {
      return this.currentRoomMembers
    },
    getCurrentRoomMessages(): ChatMessage[] {
      return this.currentRoomMessages
    },
    getCurrentRoomBlockedStatus(): { userId: number; status: BlockedStatus }[] {
      return this.currentRoomBlockedStatus
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
          if (message.chatroomId === this.currentRoomId) {
            this.currentRoomMessages.push(message)
          }
        },
        (message: PrivateMessage) => {
          messageStore.handleReceivedMessage(message)
        },
        (error: string) => {
          console.log('message packet not sent')
        },
        (error: string) => {
          console.log('chat socket connection error', error)
        },
        (roomId: number) => {
          // if room is the current room, reload members
          if (roomId === this.currentRoomId) {
            this.selectRoom(roomId)
          }
        },
        (typingInfo: { senderId: number; roomId: number; username: string; timestamp: number }) => {
          this.roomsMembersTyping.set(typingInfo.roomId, typingInfo)
        },
        (senderId: number) => {
          // no more
        },
        (senderId: number, timestamp: number) => {
          this.contactTyping.set(senderId, timestamp)
        }
      )
      if (!this.socketManager) return
      if (!this.socketManager.operational) {
        this.socketManager.connect()
      }
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
        await this.selectRoom(data.id)
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
        await this.selectRoom(data.chatroomId)
        await this.getAllMyRooms()
        return data
      } catch (error) {
        if (isAxiosError(error)) {
          errorMessage =
            error.response?.data.message ?? `Vous n'êtes pas autorisé à rejoindre cette salle`
        }
      }
      return errorMessage
    },
    async quitRoom(roomId: number): Promise<'success' | 'failed'> {
      try {
        await axios.get(`/chat/leave-room/${roomId}`)
        //effacer la room si elle est vide
        if (this.currentRoomMembers.length === 1) {
          await axios.delete<ChatRoom>(`/chat/delete-room/${roomId}`)
        }
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
        if (this.currentRoomId === roomId) {
          const index = this.rooms.findIndex((room) => room.id === roomId)
          if (index !== -1) {
            const nextRoom = this.rooms[index + 1] ?? this.rooms[index - 1] ?? null
            if (nextRoom) {
              await this.selectRoom(nextRoom.id)
            } else {
              this.currentRoomId = null
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
      member: ChatRoomMember,
      promoteTo: ChatMemberRole,
      expireAt?: number // timestamp for the end of MUTED role if needed
    ): Promise<'success' | 'failed'> {
      try {
        // cannot chnage role of owner
        if (member.role === ChatMemberRole.OWNER) {
          return 'failed'
        }
        await axios.post(`/chat/promote/${roomId}`, {
          userId: member.memberId,
          role: promoteTo,
          expireAt
        })
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

    async selectRoom(roomId: number): Promise<void> {
      const usersStore = useUserStore()
      this.currentRoomId = roomId
      this.currentRoomStatus = await this.checkRoomRole(roomId)
      this.currentRoomMembers = []
      this.currentRoomMembers = await this.getRoomMembersData(roomId)
      this.currentRoomBlockedStatus = await usersStore.checkBlockedForMany(
        this.currentRoomMembers.map((member) => member.member.id)
      )
      this.currentRoomMessages = []
    },
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
    async getRoomMembersData(roomId: number): Promise<MemberRoomWithUserProfiles[]> {
      try {
        const { data } = await axios.get<MemberRoomWithUserProfiles[]>(`/chat/room/${roomId}`)
        return data
      } catch (error) {
        return []
      }
    },
    async reloadCurrentRoomMembers(): Promise<'success' | 'failed'> {
      if (!this.currentRoomId) return 'failed'
      try {
        const members = await this.getRoomMembersData(this.currentRoomId)
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
      if (!this.currentRoomId) return
      try {
        const { data } = await axios.get<ChatMessage[]>(`/chat/messages/${this.currentRoomId}`, {
          params: {
            skip,
            take
          }
        })
        this.listenToRoom(this.currentRoomId)
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
    },

    /**
     * @name kickMember
     * @description kick a member from a room
     * @param roomId the id of the room
     * @param userId the id of the user to kick
     * @returns 'success' if success, 'failed' if failed
     */
    async kickMember(roomId: number, memberId: number): Promise<'success' | 'failed'> {
      try {
        await axios.post(`/chat/remove-member/${roomId}`, {
          roomId,
          userId: memberId
        }),
          // Mise à jour du store après avoir kické un membre
          (this.currentRoomMembers = this.currentRoomMembers.filter(
            (member) => member.memberId !== memberId
          ))
        return 'success'
      } catch (error) {
        console.error(error)
        return 'failed'
      }
    }
  }
})

export default useRoomsStore
