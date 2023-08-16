<template>
  <header class="header-container">
    <aside class="avatar-container">
      <v-avatar size="100">
        <v-img :src="user.profile.avatar"></v-img>
      </v-avatar>
    </aside>
    <aside class="select-container">
      <v-select
          v-if="chatRooms.length"
          v-model="currentRoom.name"
          :items="chatRooms.map(room => room.name)"
          label="Select a Chat Room"
          item-text="name"
      ></v-select>
    </aside>
    <v-btn variant="tonal" @click="openCreateRoomDialog">
      Create Chat Room
    </v-btn>
    <!--    pop up create Room-->
    <v-dialog v-model="createRoomDialog" max-width="500px">
      <v-card>
        <v-card-title>Create Chat Room</v-card-title>
        <v-card-text>
          <v-text-field label="Chatroom Name" v-model="createRoomInfo.name" :error-messages="this.createRoomInfo.error"></v-text-field>
          <v-text-field
              v-if="createRoomInfo.protected"
              label="Password"
              v-model="createRoomInfo.password"
              type="password"
          ></v-text-field>
          <v-switch v-model="createRoomInfo.protected" label="Protected" color="indigo"></v-switch>
          <v-switch v-model="createRoomInfo.visibility" label="Private" color="indigo"></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-btn :color="isCreateButtonClickable ? 'primary' : 'disabled'" @click="createRoom" :disabled="!isCreateButtonClickable">
            Create
          </v-btn>
          <v-btn color="error" @click="resetCreateForm">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    End of Pop up -->
    <v-btn variant="tonal" @click="openJoinRoomDialog">
      Join a Chat Room
    </v-btn>
    <!--    Pop up join chat room -->
    <v-dialog v-model="joinRoomDialog" max-width="500px">
      <v-card>
        <v-card-title>Join Chat Room</v-card-title>
        <v-card-text>
          <v-text-field label="Chatroom Name" v-model="joinRoomInfo.name" :error-messages="joinRoomInfo.error"></v-text-field>
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
  </header>
  <v-text-field label="Message" v-model="message.content" @keyup.enter="sendMessage"></v-text-field>
  <v-card class="message-container" flat>
    <v-card-text class="flex-grow-1 overflow-y-auto">
      <template v-for="(msg, i) in chatRoomMessages" :key="i">
        <div :class="{ 'd-flex flex-row-reverse': isMyMessage(msg) }">
          <v-hover v-slot:default="{ hover }">
            <v-chip :color="isMyMessage(msg) ? 'primary' : ''" dark style="height:auto;white-space: normal;" class="pa-4 mb-2">
              {{ msg.content }}
              <sub class="ml-2" style="font-size: 0.5rem;">{{ formatMessageDate(msg.date, true) }}</sub>
              <v-icon v-if="hover" small>expand_more</v-icon>
            </v-chip>
          </v-hover>
        </div>
      </template>
    </v-card-text>
  </v-card>
  <v-layout>
    <v-navigation-drawer expand-on-hover rail location="right">
      <template v-slot:prepend>
        <v-list-item
            v-for="member in chatRoomMembers"
            :key="member.id"
            lines="two"
            :prepend-avatar="member.profile.avatar"
            :title="member.profile.name"
            :subtitle="member.profile.status"
        ></v-list-item>
      </template>
    </v-navigation-drawer>
    <v-main style="height: 250px"></v-main>
  </v-layout>
</template>

<script lang="ts">

import useAuthStore from "@/stores/AuthStore.ts";
import axios from 'axios';

const authStore = useAuthStore()
const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        authorization: 'Bearer ' + authStore.token
      }
    }
  }
};
export default {
  name: 'ChatRoom-View',
  data() {
    return {
      user: authStore.user,
      message: {room: '', content: ''},
      chatRooms: [{name: 'General'}],
      currentRoom: {name: 'General'},
      chatRoomMembers: [],
      chatRoomMessages: [],
      createRoomDialog: false,
      createRoomInfo: {name: '', password: '', visibility: false, protected: false, error: ''},
      joinRoomDialog: false,
      joinRoomInfo: {name: '', password: '', visibility: false, protected: false, error: ''}
    }
  },
  beforeCreate() {
    // this.$chatSocket.setupSocketConnection(socketOptions)
    // this.$chatSocket.socket.on('add-member', (member: any) => {this.addMember(member);});
    // this.$chatSocket.socket.on('chat', (message: any) => {this.addMessage(message);});
  },
  created() {
    // this.$chatSocket.socket.on('chat', (message: any) => {this.addMessage(message);})
  },
  mounted() {
    this.chatRoomSetUp('General')
    this.setRooms()
  },
  beforeUnmount() {
    // send chatroomMember
    // this.$chatSocket.disconnect();
  },
  watch: {
    'currentRoom.name': function(newRoom, oldRoom) {
      this.changeRoom(newRoom, oldRoom)
    },
  },
  computed: {
    isCreateButtonClickable() {
      return !(!this.createRoom.name.trim() || (this.createRoom.protected && !this.createRoom.password.trim()))
    },
    isJoinButtonClickable() {
      return !(!this.joinRoom.name.trim())
    },
  },
  methods: {
    changeRoom(newRoom, oldRoom) {
      // this.$chatSocket.socket.emit('leaveRoom', oldRoom)
      if (newRoom === 'General') {
        // this.$chatSocket.socket.emit('joinRoom', oldRoom)
      } else {
        this.joinRoomInfo.name = newRoom
        this.openJoinRoomDialog()
      }
    },
    async setRooms() {
      try {
        const { data } = await axios.get("/api/chat/rooms")
        this.chatRooms.push(...data)
      } catch (e) {
        // to think about
      }
    },
    sendInfo(chat, clientId) {
      chat.emit('add-member', authStore.user)
    },
    addMember(newMember) {
      const index = this.chatRoomMembers.findIndex(member => member.id == newMember.id)
      if (index !== -1) {return }
      this.chatRoomMembers.push(newMember)
    },
    openCreateRoomDialog() {this.createRoomDialog = true},
    resetCreateForm() {
      this.createRoomDialog = false
      this.createRoomInfo = {ownerId: authStore.user.id, name: '', password: '', visibility: false, protected: false, error: ''}
    },
    resetJoinForm() {
      this.joinRoomDialog = false
      this.joinRoomInfo = {name: '', password: '', visibility: false, protected: false, error: ''}
    },
    async createRoom() {
      if (!this.isCreateButtonClickable) {
        return;
      }
      try {
        await axios.post('/api/chat/new', this.createRoom);
        this.currentRoom = this.createRoom.name;
        this.resetCreateForm()
      } catch (error) {
        if (error.response.status == 409) {
          this.createRoomInfo.error = ['Room name is already taken. Please choose a different name.'];
        } else {
          this.createRoomInfo.error = ['An error occurred while creating the room. Please try again later.'];
        }
      }
    },
    openJoinRoomDialog() {this.joinRoomDialog = true},
    async joinRoom() {
      if (!this.isJoinButtonClickable) {return;}
      try {
        await axios.post('/api/chat/join', this.joinRoom);
        // this.$chatSocket.emit('joinRoom', this.joinRoom.name)
        this.currentRoom = this.joinRoom.name;
        this.resetJoinForm();
      } catch (error) {
        const status = error.response.status;
        if (status === 404) {
          this.joinRoomInfo.error = ["Room doesn't exist"];
        } else if (status === 403) {
          this.joinRoomInfo.error = ["Password doesn't match"];
        } else {
          // Handle if Ban
          this.joinRoomInfo.error = ['An error occurred while joining the room. Please try again later.'];
        }
      }
    },
    async chatRoomEnd(room) {
    },
    async chatRoomSetUp(room) {
      if(room == 'General') {
        // this.$chatSocket.socket.on('general', (clientId: number) => {this.sendInfo(this.$chatSocket.socket, clientId);});
        // this.$chatSocket.socket.emit('general')
        console.log('do something special')
      }
      try {
        const { data } = await axios.get("/api/chat/room/messages/" + room)
        this.chatRoomMessages.push(...data)
      } catch (e) {
        // to think about
      }
    },
    sendMessage(){
      this.message.room = this.currentRoom.name;
      // this.$chatSocket.socket.emit('chat', this.message);
      this.message.content = '';
    },
    addMessage(message: any) {
      console.log(message)
      this.chatRoomMessages.push(message)
    },
    isMyMessage(msg: any) : boolean {return msg.username === this.user.username;},
    formatMessageDate(date, includeTime = false) {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const options = {
        timeZone: userTimezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      if (includeTime) {
        options.hour = 'numeric';
        options.minute = 'numeric';
        // options.second = 'numeric';
      }
      return new Date(date).toLocaleString('en-US', options);
    },
  },
}

</script>

<style>
.header-container {
  display: flex;
  align-items: center;
}

.avatar-container, .select-container {
  margin: 10px; /* Add some margin for spacing */
}
</style>