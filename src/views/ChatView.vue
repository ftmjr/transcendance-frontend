<template>
  <header class="header-container">
    <aside class="avatar-container">
      <v-avatar size="100">
        <v-img :src="user.profile.avatar"></v-img>
      </v-avatar>
    </aside>
    <aside class="chatRoom-select-container">
    <v-select
        bg-color='background'
        v-model="select"
        :items="chatRooms"
        item-title="name"
        label="Select"
        persistent-hint
        return-object
        single-line
    ></v-select>
    </aside>
  </header>
  <v-dialog v-model="dialogs.password" max-width="500px">
    <v-card>
      <v-card-title>Protected Room</v-card-title>
      <v-card-text>
        <v-text-field
            label="Password"
            v-model="joinRoomInfo.password"
            type="password"
            :error-messages="error"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn :color="isJoinButtonClickable ? 'primary' : 'disabled'" @click="joinRoom" :disabled="!isJoinButtonClickable">
          Join
        </v-btn>
        <v-btn color="error" @click="resetJoinForm">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-btn color='background' variant="tonal" @click="openJoinRoomDialog">
    Join a Chat Room
  </v-btn>  <v-dialog v-model="dialogs.join" max-width="500px">
    <v-card>
      <v-card-title>Join Chat Room</v-card-title>
      <v-card-text>
        <v-text-field label="Chatroom Name" v-model="joinRoomInfo.roomName" :error-messages="error"></v-text-field>
        <v-text-field
            label="Password"
            v-model="joinRoomInfo.password"
            type="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn :color="isJoinButtonClickable ? 'primary' : 'disabled'" @click="joinRoom" :disabled="!isJoinButtonClickable">
          Join
        </v-btn>
        <v-btn color="error" @click="resetJoinForm">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-btn color='background' variant="tonal" @click="openCreateRoomDialog">
    Create Chat Room
  </v-btn>
  <v-btn v-if="currentRoom.name !== 'General'" color='background' variant="tonal" @click="leaveRoom">
    Leave room
  </v-btn>
  <v-dialog v-model="dialogs.create" max-width="500px">
    <v-card>
      <v-card-title>Create Chat Room</v-card-title>
      <v-card-text>
        <v-text-field label="Chatroom Name" v-model="createRoomInfo.name" :error-messages="error"></v-text-field>
        <v-text-field
            v-if="createRoomInfo.protected"
            label="Password"
            v-model="createRoomInfo.password"
            type="password"
        ></v-text-field>
        <v-switch v-model="createRoomInfo.protected" label="Protected" color="indigo"></v-switch>
        <v-switch v-model="createRoomInfo.private" label="Private" color="indigo"></v-switch>
      </v-card-text>
      <v-card-actions>
        <v-btn :color="isCreateButtonClickable ? 'primary' : 'disabled'" @click="createRoom" :disabled="!isCreateButtonClickable">
          Create
        </v-btn>
        <v-btn color="error" @click="resetCreateForm">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-text-field bg-color='background' label="Message" v-model="message.content" @keyup.enter="sendMessage" :disabled="isMuted()"></v-text-field>
  <v-card class="message-container" flat>
    <v-card-text ref="messageContainer" class="flex-grow-1 overflow-y-auto">
      <v-virtual-scroll :items="chatRoomMessages" height="400">
        <template v-slot:default="{ item: msg }">
          <div :class="{ 'd-flex flex-row-reverse': isMyMessage(msg) }">
            <v-hover v-slot:default="{ hover }">
              <v-chip :color="isMyMessage(msg) ? 'primary' : ''" dark style="height:auto;white-space: normal;" class="pa-4 mb-2">
                <v-avatar size="30">
                  <v-img :src="msg.user.profile.avatar"></v-img>
                </v-avatar>
                {{"&nbsp" + msg.content }}
                <sub class="ml-2" style="font-size: 0.5rem;">{{ formatMessageDate(msg.timestamp, true) }}</sub>
                <v-icon v-if="hover" small>expand_more</v-icon>
              </v-chip>
            </v-hover>
          </div>
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>
  <v-layout>
    <v-navigation-drawer expand-on-hover rail location="right">
      <template v-slot:prepend>
        <v-list-item
            v-for="member in chatRoomMembers"
            :key="member.id"
            lines="two"
            :prepend-avatar="member.member.profile.avatar"
            :title="member.member.username"
            :subtitle="member.member.profile.status"
            @click="openUserDialog(member)"
        ></v-list-item>
      </template>
    </v-navigation-drawer>
    <v-main style="height: 250px"></v-main>
  </v-layout>
<!--  <ProfileDialog v-if="dialogs.user"></ProfileDialog>-->
  <v-dialog v-model="dialogs.user" max-width="400">
    <v-card>
      <div class="profile-avatar-container">
        <div class="status-background" :class="{ 'status-online': selectedUser.member.profile.status === 'Online', 'status-offline': selectedUser.member.profile.status !== 'Online' }">
        </div>
        <div class="avatar-container">
          <img :src="selectedUser.member.profile.avatar" alt="User Avatar" class="avatar-img" />
        </div>
      </div>
      <v-card-title class=text-center>{{ selectedUser.member.username }}</v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" title="Action Failed" :text="error"></v-alert>
        <v-alert v-if="success" type="success" title="Action Succeeded" :text="success"></v-alert>

        <div class="profile-actions">
          <v-btn v-if="isAdminOrOwner(member) && !isAdminOrOwner(selectedUser)" @click="muteUnmuteMember">Mute/Unmute</v-btn>
          <v-btn v-if="isAdminOrOwner(member) && !isAdminOrOwner(selectedUser)" @click="kickMember">Kick</v-btn>
          <v-btn v-if="isAdminOrOwner(member) && !isAdminOrOwner(selectedUser)" @click="banMember">Ban</v-btn>
        </div>

        <div class="profile-actions">
          <v-btn v-if="isOwner(member) && !isAdminOrOwner(selectedUser)" @click="promoteMember">Promote</v-btn>
        </div>

        <div class="profile-actions">
          <v-btn v-if="isNotMe(selectedUser.member)" @click="blockUser">Block User</v-btn>
          <v-btn v-if="isNotMe(selectedUser.member)" @click="addFriend">Add Friend</v-btn>
          <v-btn v-if="isNotMe(selectedUser.member)" @click="sendPrivateMessage">Send Message</v-btn>
          <v-btn v-if="isNotMe(selectedUser.member)" @click="inviteToPlay">Invite to Play</v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closeUserDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogs.waiting" max-width="400">
    <v-card>
      <v-card-title>Waiting for the response</v-card-title>
    <v-progress-linear
        color="deep-purple-accent-4"
        indeterminate
        rounded
        height="6"
    ></v-progress-linear>
    <v-card-actions>
      <v-btn color="primary" @click="closeWaitingDialog">Cancel</v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogs.invite" max-width="400">
    <v-card>
      <v-card-title>You received an invite to play Pong</v-card-title>
      <v-card-title>From: {{ invite.username }}</v-card-title>
      <v-card-actions>
        <v-btn color="primary" @click="closeInviteDialog">Accept</v-btn>
        <v-btn color="primary" @click="closeInviteDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">

import {defineAsyncComponent, defineComponent} from 'vue'
import useAuthStore from "@/stores/AuthStore.ts";
import axios from '@/utils/axios';
import useChatStore from "@/stores/ChatStore";
import chatSocketService from "@/utils/socketio";
import useGameStore from "@/stores/GameStore";

const chatStore = useChatStore()
const gameStore = useGameStore()
const authStore = useAuthStore()
const socket = chatSocketService
const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        authorization: 'Bearer ' + authStore.token
      }
    }
  }
};
const chatMessageContainer = document.querySelector('.message-container')
export default defineComponent({
  name: 'ChatRoom-View',
  data() {
    return {
      select: {id: 0, name: 'General'},
      invite: null,
      user: authStore.user,
      game: gameStore,
      chat: chatStore,
      selectedUser: null,
      member: {},
      message: {room: '', content: ''},
      chatRooms: [],
      currentRoom: {id: 0, name: 'General', protected: false},
      oldRoom: {id: 0, name: 'General'},
      chatRoomMembers: [],
      chatRoomMessages: [],
      dialogs: {join: false, create: false, password: false, user: false, waiting: false, invite: false},
      createRoomInfo: {ownerId: authStore.user.id, name: '', password: '', private: false, protected: false},
      joinRoomInfo: {userId: authStore.user.id, roomName: 'General', password: ''},
      error: '',
      success: '',
      blockedUsers: [],
    }
  },
  beforeCreate() {
    socket.connectChat(socketOptions)
    socket.socket.on('message', (message: any) => {
      socket.socket.emit('filter', message);}
    );
    socket.socket.on('filter', (message: any) => {
      this.addMessage(message);}
    );
    socket.socket.on('updateRooms', () => {
      this.getRooms()
    })
    socket.socket.on('updateRoomMembers', () => {
      this.getRoomMembers()
    })
  },
  async mounted() {
    socket.socket.emit('game')
    socket.socket.on('game-invite', (user) => {
      this.invite = user
      this.dialogs.invite = true;}
    );
    await this.getRooms()
    await this.joinRoom()
    await this.getRoomMembers()
    await this.getRoomMessages()
  },
  beforeUnmount() {
    socket.disconnect()
  },
  watch: {
    select(newValue, oldValue) {
      this.joinRoomInfo.roomName = newValue.name
      if(newValue.protected) {
        this.openPasswordDialog()
      } else {
        this.joinRoom()
      }
      this.currentRoom = newValue
      this.getRoomMembers()
    }
  },
  computed: {
    isCreateButtonClickable() {
      return !(!this.createRoom.name.trim() || (this.createRoom.protected && !this.createRoom.password.trim()))
    },
    isJoinButtonClickable() {
      if (this.currentRoom.protected && !this.joinRoomInfo.password) {
        return false;
      }
      return !(!this.joinRoom.name.trim())
    },
  },
  methods: {
    openInviteDialog() {this.dialogs.invite = true},
    closeInviteDialog() {this.dialogs.invite = false},
    openWaitingDialog() {this.dialogs.waiting = true},
    closeWaitingDialog() {this.dialogs.waiting = false},
    inviteToPlay() {
      socket.socket.emit('game-invite', this.selectedUser.member.username)
      this.closeUserDialog()
      this.openWaitingDialog()
    },
    isNotMe(member) {
      return member.id !== this.user.id
    },
    async blockUser() {
      this.error = ''
      this.success = ''
      try {
        await axios.post("/users/block/" + this.selectedUser.memberId)
        await this.getRoomMembers()
        await this.getRoomMessages()
        this.closeUserDialog()
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async addFriend() {
      try {
        await axios.post("/friends/" + this.selectedUser.memberId)
        this.closeUserDialog()
      } catch (error) {
        if (error.response.status === 409) {
          this.error = 'Request already sent'
        } else {
          this.error = error.response.data.message;
        }
      }
    },
    muteUnmuteMember() {
      if (this.selectedUser.role === 'MUTED') {
        socket.socket.emit('unmute', this.selectedUser.id)
      } else {
        socket.socket.emit('mute', this.selectedUser.id)
      }
      socket.socket.emit('updateRoomMembers')
      this.closeUserDialog()
    },
    kickMember() {
      socket.socket.emit('kick', this.selectedUser.id)
      socket.socket.emit('updateRoomMembers')
      this.closeUserDialog()
    },
    banMember() {
      socket.socket.emit('ban', this.selectedUser.id)
      socket.socket.emit('updateRoomMembers')
      this.closeUserDialog()
    },
    promoteMember() {
      socket.socket.emit('promote', this.selectedUser.id)
      socket.socket.emit('updateRoomMembers')
      this.closeUserDialog()
    },
    isOwner(member) {
      return (member.role === 'OWNER')
    },
    isAdminOrOwner(member) {
      return (member.role === 'OWNER' || member.role ==='ADMIN')
    },
    openUserDialog(user) {
      this.selectedUser = user;
      this.dialogs.user = true;
    },
    closeUserDialog() {
      this.dialogs.user = false;
    },
    isMuted() {
      return this.member.role === 'MUTED';
    },
    async getRoomMessages() {
      this.chatRoomMessages.splice(0)
      try {
        const { data } = await axios.get("/chat/messages/" + this.currentRoom.id, { params: { take: 100 }})
        this.chatRoomMessages.push(...data)
      } catch (e) {
        // to think about
      }
    },
    async getRooms() {
      this.chatRooms.splice(0)
      this.chatRooms.push({id:0, name: 'General', protected: false})
      try {
        const { data } = await axios.get("/chat/rooms")
        this.chatRooms.push(...data)
      } catch (e) {
        // to think about
      }
    },
    async getRoomMembers() {
      if (this.chatRoomMembers) {
        this.chatRoomMembers.splice(0)
      }
      try {
        const { data } = await axios.get("/chat/members/" + this.currentRoom.id)
        this.chatRoomMembers.push(...data)
        this.member = this.chatRoomMembers.find(member => member.memberId === this.user.id)
        if (!this.member || this.member.role === 'BAN') {
          await this.getRooms()
          this.select = {id: 0, name: 'General'}
        }
      } catch (e) {
        await this.getRooms()
        this.select = {id: 0, name: 'General'}
      }
    },
    async leaveRoom() {
      try {
        await axios.post("/chat/leave/" + this.currentRoom.id)
        socket.socket.emit('updateRoomMembers')
        this.select = {id: 0, name: 'General'}
        this.currentRoom = {id: 0, name: 'General'}
        socket.socket.emit('updateRooms')
      } catch (e) {
        // await this.getRooms()
        // this.select = {id: 0, name: 'General'}
        // this.currentRoom = {id: 0, name: 'General'}
      }
    },
    openCreateRoomDialog() {this.dialogs.create = true},
    resetCreateForm() {
      this.dialogs.create = false
      this.createRoomInfo = {ownerId: authStore.user.id, name: '', password: '', private: false, protected: false}
      this.error = ''
    },
    async createRoom() {
      if (!this.isCreateButtonClickable) {
        return;
      }
      try {
        const { data } = await axios.post('/chat/new', this.createRoomInfo);
        this.currentRoom = data
        this.resetCreateForm()
        socket.socket.emit('updateRooms')
      } catch (error) {
        if (error.response.status == 409) {
          this.error = ['Room name is already taken. Please choose a different name.'];
        } else {
          this.error = ['An error occurred while creating the room. Please try again later.'];
        }
      }
    },
    openPasswordDialog() {this.dialogs.password = true},
    openJoinRoomDialog() {this.dialogs.join = true},
    resetJoinForm() {
      this.dialogs.password = false
      this.dialogs.join = false
      this.joinRoomInfo = {userId: authStore.user.id, roomName: '', password: ''}
      this.error = ''
    },
    async joinRoom() {
      try {
        const { data } = await axios.post('/chat/join', this.joinRoomInfo);
        await this.getRooms()
        this.member = data
        socket.socket.emit('joinRoom', this.joinRoomInfo.roomName)
        socket.socket.emit('updateRoomMembers')
        await this.getRoomMessages()
        this.resetJoinForm();
      } catch (error) {
        this.error = [error.response.data.message];
      }
    },
    sendMessage(){
      if (!this.message.content) {
        return
      }
      socket.socket.emit('message', this.message.content);
      this.message.content = '';
    },
    addMessage(message: any) {
      this.chatRoomMessages.push(message)
      this.$nextTick(() => {
        // Get the messageContainer element using the ref
        const messageContainer = this.$refs.messageContainer;

        // Scroll to the bottom of the message container
        messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
      });
    },
    isMyMessage(msg: any) : boolean {return msg.userId === this.user.id;},
    sendPrivateMessage() {
      this.chat.setDmReceiver(this.selectedUser.member)
      this.$router.push('/dm')
    },
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
  },
})
</script>

<style>
.header-container {
  display: flex;
  align-items: center;
}
.message-container {
  height: 400px;
}
.profile-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-label {
  font-weight: bold;
  margin-right: 8px;
}

.profile-actions {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}

.profile-actions v-btn {
  margin-bottom: 8px;
}

.avatar-container, .select-container {
  margin: 10px; /* Add some margin for spacing */
}
.profile-avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}

.avatar-container {
  position: relative;
  z-index: 1;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.status-background {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  z-index: 0;
}

.status-online {
  background-color: green;
}

.status-offline {
  background-color: red;
}

.text-center {
  text-align: center;
}
</style>