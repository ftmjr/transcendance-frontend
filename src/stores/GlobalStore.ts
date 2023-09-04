import { defineStore } from 'pinia'
import chatSocketService from "@/utils/socketio"
import useChatStore from "@/stores/ChatStore"
import useGameStore from "@/stores/GameStore"
import useAuthStore from "@/stores/AuthStore"
import useUsersStore from "@/stores/UsersStore";

const useGlobalStore = defineStore({
  id: 'global',
  state: () => {
    const chatStore = useChatStore()
    const gameStore = useGameStore()
    const authStore = useAuthStore()
    const usersStore = useUsersStore()
    const socket = chatSocketService
    return {
      authStore,
      chatStore,
      gameStore,
      usersStore,
      dialogs: {
        profile: false,
        invite: false,
        waiting: false,
        password: false,
        roomPassword: false,
        join: false,
        create: false,
      },
      invite: null,
      socket: socket,
      notifications: [],
      isLoading: false,
    }
  },
  getters: {
  },
  actions: {
    async setUpChat() {
      await this.chatStore.initChat()
      this.setUpChatEvents()
    },
    async setUpDm() {
      this.chatStore.messages = []
      await this.usersStore.setUsers()
      await this.chatStore.setConversations()
      this.socket.socket.on('dm', (message: any) => {
        this.chatStore.addDmMessage(message);}
      );
      if (this.chatStore.getDmReceiver) {
        this.socketAddReceiver(this.chatStore.getDmReceiver)
        await this.chatStore.setDmMessages()
      }
    },
    setUpChatEvents() {
      this.socket.socket.on('message', (message: any) => {
        this.socket.socket.emit('filter', message)
      })
      this.socket.socket.on('filter', (message: any) => {
        this.chatStore.addMessage(message)
      })
      this.socket.socket.on('updateRooms', () => {
        this.chatStore.setRooms()
      })
      this.socket.socket.on('updateRoomMembers', () => {
        this.chatStore.setRoomMembers()
      })
    },
    openRoomPasswordDialog() { this.dialogs.roomPassword = true },
    closeRoomPasswordDialog() { this.dialogs.roomPassword = false },
    openPasswordDialog() { this.dialogs.password = true },
    closePasswordDialog() { this.dialogs.password = false },
    openWaitingDialog() { this.dialogs.waiting = true },
    closeWaitingDialog() { this.dialogs.waiting = false },
    openJoinDialog() { this.dialogs.join = true },
    closeJoinDialog() { this.dialogs.join = false },
    openCreateDialog() { this.dialogs.create = true },
    closeCreateDialog() { this.dialogs.create = false },
    openProfileDialog(member) {
      console.log(member)
      this.chatStore.setSelectedUser(member)
      this.dialogs.profile = true
    },
    closeProfileDialog() { this.dialogs.profile = false },
    openInviteDialog() { this.dialogs.invite = true },
    closeInviteDialog() { this.dialogs.invite = false },
    rejectInvite() {
      this.socket.socket.emit('game-reject', this.invite.username)
      this.closeInviteDialog()
    },
    acceptInvite() {
      this.socket.socket.emit('game-accept', this.invite.username)
      this.gameStore.setInvited(true)
      this.closeInviteDialog()
      this.$router.push('/game')
    },
    cancelInvite() {
      this.socket.socket.emit('game-reject', this.chatStore.getOtherMember.username)
      this.closeWaitingDialog()
    },
    socketMembersUpdate() {
      this.socket.socket.emit('updateRoomMembers')
    },
    socketRoomsUpdate() {
      this.socket.socket.emit('updateRooms')
    },
    socketJoinRoom(roomName: string) {
      this.socket.socket.emit('joinRoom', roomName)
      this.socketMembersUpdate()
    },
    socketMute(id: number) { this.socket.socket.emit('mute', id)},
    socketBan(id: number) {
      this.socket.socket.emit('ban', id)
      this.socketMembersUpdate()
      this.closeProfileDialog()
    },
    socketUnmute(id: number) {
      this.socket.socket.emit('unmute', id)
    },
    socketUpdateUser() {
      this.socket.socket.data.user = this.authStore.getUser
    },
    socketBlockUser(username) {
      this.socket.socket.emit('block-user', username)
    },
    socketKick(id: number) {
      this.socket.socket.emit('kick', id)
      this.socketMembersUpdate()
      this.closeProfileDialog()
    },
    socketPromote(id: number) {
      this.socket.socket.emit('promote', id)
      this.socketMembersUpdate()
      this.closeProfileDialog()
    },
    socketAddReceiver(receiver) {
      this.socket.socket.emit('addReceiver', receiver)
    },
    socketSendDm(message) {
      this.socket.socket.emit('dm', message);
    },
    inviteToPlay() {
      this.socket.socket.emit('game-invite', this.chatStore.getOtherMember.username)
      this.closeProfileDialog()
      this.openWaitingDialog()
    },
    connectSocket() {
      this.socket.connectChat(this.chatStore.user)
      this.listenGameInvite()
      this.listenBlockAction()
    },
    disconnectSocket() {
      this.socket.disconnect()
    },
    sendChatMessage(message) {
      this.socket.socket.emit('message', message)
    },
    listenGameInvite() {
      this.socket.socket.emit('game')
      this.socket.socket.on('game-invite', (user) => {
        if (this.dialogs.invite) {
          this.socket.socket.emit('game-reject')
          return
        }
        this.invite = user
        this.openInviteDialog()
      })
      this.socket.socket.on('game-accept', () => {
        this.gameStore.setInvited(true)
        this.$router.push('/game')
      })
      this.socket.socket.on('game-reject', () => {
        this.closeWaitingDialog()
        this.closeInviteDialog()
      })
    },
   listenBlockAction() {
        this.socket.socket.on('block-user', () => {
          console.log('here')
        this.authStore.refreshUser()
        this.socket.socket.emit('update-self', this.authStore.getUser)
      })
    },
    getNotification(member) {
      if (this.notifications[member.id]) {
        return this.notifications[member.id]
      }
      return member.profile.status
    },
  }
})

export default useGlobalStore
