import { defineStore } from 'pinia'
import axios from "@/utils/axios";

import useAuthStore from "@/stores/AuthStore";
import useGlobalStore from "@/stores/GlobalStore";
import { User } from "Auth";

const useChatStore = defineStore({
    id:'chat',
    state: () => {
        const authStore = useAuthStore()
        const globalStore = useGlobalStore()
        const dmReceiver = JSON.parse(localStorage.getItem('__dmReceiver__') ?? 'null') as User | null
        return {
            authStore,
            globalStore,
            user: authStore.getUser,
            users: [],
            dmReceiver,
            conversations: [],
            selectedUser: {},
            selectedRoom: {id: 0, name: 'General'},
            message: '',
            messages: [],
            room: {id: 0, name: 'General', protected: false},
            rooms: [],
            member: {},
            members: [],
            joinInfo: {userId: authStore.getUser.id, roomName: 'General', password: ''},
            createInfo: {ownerId: authStore.getUser.id, name: '', password: '', private: false, protected: false},
            error: ''
        }
    },
    getters:{
        getJoinInfo() { return this.joinInfo },
        getDmReceiver() { return this.dmReceiver },
        getRoom() { return this.room },
        getRooms() { return this.rooms },
        getMembers() { return this.members },
        getMessages() { return this.messages },
        getConversations() { return this.conversations },
        userIsAdmin() {
            return (this.isOwner || this.member.role ==='ADMIN')
        },
        selectedUserIsAdmin() {
            return (this.selectedUser.role === 'OWNER' || this.selectedUser.role ==='ADMIN')
        },
        selectedUserIsNotMe() {
            return (this.selectedUser.member.id !== this.user.id)
        },
        getOtherProfile() { return this.selectedUser.member.profile },
        getOtherMember() { return this.selectedUser.member },
        isError() { return this.error !== '' },
        isMuted() { return this.member.role === 'MUTED' },
        isOwner() { return this.member.role === 'OWNER'}
    },
    actions:{
        async initChat(){
            this.messages = []
            await this.setRooms()
            this.joinInfo.roomName = this.selectedRoom.name
            await this.joinRoom()
        },
        setDmReceiver(newReceiver) {
            this.dmReceiver = newReceiver
            localStorage.setItem('__dmReceiver__', JSON.stringify(newReceiver))
        },
        setSelectedUser(member) {
            this.selectedUser = member
        },
        sendMessage(){
            if (!this.message.trim()) {
                return
            }
            this.globalStore.sendChatMessage(this.message)
            this.message = '';
        },
        isMyMessage(msg: any) {
            return msg.userId === this.user.id
        },
        isMyDm(msg: any) {
            return msg.senderId === this.user.id
        },
        sendPrivateMessage() {
            this.setDmReceiver(this.selectedUser.member)
            this.$router.push('/dm')
        },
        addMessage(message) {
            this.messages.push(message)
        },
        setJoinName(name) {
            this.joinInfo.roomName = name
        },
        setRoom(room) {
            this.room = room
        },
        async setRooms() {
            this.rooms.splice(0)
            this.rooms.push({id: 0, name: 'General', protected: false})
            try {
                const {data} = await axios.get("/chat/rooms")
                this.rooms.push(...data)
            } catch (e) {
                // to think about
            }
        },
        async updateChat(room) {
            this.setRoom(room)
            await this.setRoomMembers()
            await this.setRoomMessages()
        },
        async setRoomMembers() {
            this.members.splice(0)
            try {
                const { data } = await axios.get("/chat/members/" + this.room.id)
                this.members.push(...data)
                this.member = this.members.find(member => member.memberId === this.user.id)
                if (!this.member || this.member.role === 'BAN') {
                    await this.setRooms()
                    this.select = {id: 0, name: 'General'}
                }
            } catch (e) {
                await this.setRooms()
                this.select = {id: 0, name: 'General'}
            }
        },
        async setRoomMessages() {
            this.messages.splice(0)
            try {
                const { data } = await axios.get("/chat/messages/" + this.room.id, { params: { take: 100 }})
                this.messages.push(...data)
            } catch (e) {
                // to think about
            }
        },
        async setUsers() {
            try {
                const { data } = await axios.get("/users")
                this.users.push(...data)
            } catch (e) {
                // to think about
            }
        },
        async joinRoom() {
            try {
                const { data } = await axios.post('/chat/join', this.joinInfo);
                await this.setRooms()
                await this.updateChat(this.rooms.find(member => member.name === this.joinInfo.roomName))
                this.selectedRoom = this.room
                this.member = data
                this.globalStore.socketJoinRoom(this.joinInfo.roomName)
                await this.setRoomMessages()
                this.resetJoinForm();
            } catch (error) {
                this.error = error.response ? error.response.data.message : '';
            }
        },
        async createRoom() {
            try {
                const { data } = await axios.post('/chat/new', this.createInfo);
                this.room = data
                this.selectedRoom = data
                this.globalStore.socketJoinRoom(this.room.name)
                this.resetCreateForm()
                await this.setRoomMessages()
                this.globalStore.socketRoomsUpdate()
            } catch (error) {
                if (error.response.status == 409) {
                    this.error = 'Room name is already taken'
                } else {
                    this.error = 'An error occurred while creating the room. Please try again later.';
                }
            }
        },
        async updateRoomPassword() {
            try {
                await axios.post('/chat/password/' + this.room.id, {
                    password: this.joinInfo.password
                });
                this.globalStore.closeRoomPasswordDialog()
                this.error = ''
            } catch (error) {
                this.error = error.response ? error.response.data.message : '';
            }
        },
        async leaveRoom() {
            try {
              await axios.post("/chat/leave/" + this.room.id)
              this.globalStore.socketMembersUpdate()
              this.select = {id: 0, name: 'General'}
              this.room = {id: 0, name: 'General'}
              this.globalStore.socketRoomsUpdate()
            } catch (e) {
              await this.setRooms()
              this.select = {id: 0, name: 'General'}
              this.room = {id: 0, name: 'General'}
            }
        },
        resetCreateForm() {
            this.globalStore.closeCreateDialog()
            this.createInfo = {ownerId: this.user.id, name: '', password: '', private: false, protected: false}
            this.error = ''
        },
        resetJoinForm() {
            this.globalStore.closeJoinDialog()
            this.globalStore.closePasswordDialog()
            this.joinInfo = {userId: this.user.id, roomName: '', password: ''}
            this.error = ''
        },
        muteUnmuteMember() {
            if (this.selectedUser.role === 'MUTED') {
              this.globalStore.socketUnmute(this.selectedUser.id)
            } else {
                this.globalStore.socketMute(this.selectedUser.id)
            }
            this.globalStore.socketMembersUpdate()
            this.globalStore.closeProfileDialog()
        },
        kickMember() {this.globalStore.socketKick(this.SelectedUser.id)},
        banMember() {this.globalStore.socketBan(this.selectedUser.id)},
        promoteMember() {this.globalStore.socketPromote(this.selectedUser.id)},
        formatMessageDate(date, includeTime = false) {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const options = {
                timeZone: userTimezone,
                // year: 'numeric',
                // month: 'long',
                // day: 'numeric',
            };
            if (includeTime) {
                options.hour = 'numeric';
                options.minute = 'numeric';
            }
            return new Date(date).toLocaleString('en-US', options);
        },
        async setDmMessages() {
            this.messages.splice(0)
            try {
                const { data } = await axios.get("/chat/dm/" + this.dmReceiver.id, {params: {take: 100}})
                this.messages.push(...data)
            }
            catch (e) {
                // to think about
            }
        },
        async setConversations() {
            this.conversations.splice(0)
            try {
                const { data } = await axios.get("/chat/dm")
                this.conversations.push(...data)
                this.conversations.forEach((user) => {
                    this.notifications[user.id] = user.profile.status;
                })
            } catch (e) {
                // to think about
            }
        },
        sendDm() {
            if (this.message == '') {
                return
            }
            this.globalStore.socketSendDm(this.message)
            this.message = '';
        },
        async addDmMessage(message: any) {
            if (this.isConversationMessage(message)){
                this.messages.push(message);
            } else {
                const senderInConversations = this.conversations.find(conversation => conversation.id === message.senderId);
                if (!senderInConversations) {
                    this.setConversations().then(() => {
                        this.globalStore.notifications[message.senderId] = message.text;
                    });
                } else {
                    this.globalStore.notifications[message.senderId] = message.text;
                }
            }
        },
        isConversationMessage(msg: any) : boolean
        {
            if (this.dmReceiver && this.isMyDm(msg) === true) {
                return msg.receiverId === this.dmReceiver.id;
            } else if (this.dmReceiver) {
                return msg.senderId === this.dmReceiver.id;
            }
            return false
        },
    }
})

export default useChatStore