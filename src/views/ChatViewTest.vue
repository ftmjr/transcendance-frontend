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
  <v-dialog v-model="dialogs.create" max-width="500px">
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
  <v-text-field bg-color='background' label="Message" v-model="message.content" @keyup.enter="sendMessage"></v-text-field>
  <v-card class="message-container" flat>
    <v-card-text ref="messageContainer" class="flex-grow-1 overflow-y-auto">
      <v-virtual-scroll :items="chatRoomMessages" height="400">
        <template v-slot:default="{ item: msg }">
          <div :class="{ 'd-flex flex-row-reverse': isMyMessage(msg) }">
            <v-hover v-slot:default="{ hover }">
              <v-chip :color="isMyMessage(msg) ? 'primary' : ''" dark style="height:auto;white-space: normal;" class="pa-4 mb-2">
                {{ msg.content }}
                <sub class="ml-2" style="font-size: 0.5rem;">{{ formatMessageDate(msg.timestamp, true) }}</sub>
                <v-icon v-if="hover" small>expand_more</v-icon>
              </v-chip>
            </v-hover>
          </div>
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>

<!--  <v-layout>-->
<!--    <v-navigation-drawer expand-on-hover rail location="right">-->
<!--      <template v-slot:prepend>-->
<!--        <v-list-item-->
<!--            v-for="member in chatRoomMembers"-->
<!--            :key="member.id"-->
<!--            lines="two"-->
<!--            :prepend-avatar="member.profile.avatar"-->
<!--            :title="member.profile.name"-->
<!--            :subtitle="member.profile.status"-->
<!--        ></v-list-item>-->
<!--      </template>-->
<!--    </v-navigation-drawer>-->
<!--    <v-main style="height: 250px"></v-main>-->
<!--  </v-layout>-->
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import useAuthStore from "@/stores/AuthStore.ts";
import axios from '@/utils/axios';
import useChatStore from "@/stores/ChatStore";
import chatSocketService from "@/utils/socketio";

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
export default defineComponent({
  name: 'ChatRoom-View',
  data() {
    return {
      select: {id: 0, name: 'General'},
      user: authStore.user,
      message: {room: '', content: ''},
      chatRooms: [],
      currentRoom: {id: 0, name: 'General'},
      oldRoom: {id: 0, name: 'General'},
      chatRoomMembers: [],
      chatRoomMessages: [],
      dialogs: {join: false, create: false, password: false},
      createRoomInfo: {ownerId: authStore.user.id, name: '', password: '', private: false, protected: false},
      joinRoomInfo: {userId: authStore.user.id, roomName: '', password: ''},
      error: ''
    }
  },
  beforeCreate() {
    socket.connectChat(socketOptions)
    socket.socket.on('message', (message: any) => {
      this.addMessage(message);}
    );
  },
  created() {
    this.getRooms()
    this.getRoomMessages()
  },
  beforeUnmount() {
    socket.disconnect()
  },
  watch: {
    select(newValue, oldValue) {
      if (newValue.name === 'General') {
        this.currentRoom = newValue
        return
      }
      this.joinRoomInfo.roomName = newValue.name
      if(newValue.protected) {
        this.openPasswordDialog()
      } else {
        this.joinRoom()
      }
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
    async getRoomMessages() {
      if (this.chatRoomMessages) {
        this.chatRoomMessages.splice(0)
      }
      try {
        const { data } = await axios.get("/chat/messages/" + this.currentRoom.id, { params: { take: 100 }})
        this.chatRoomMessages.push(...data)
      } catch (e) {
        // to think about
      }
    },
    async getRooms() {
      if (this.chatRooms) {
        this.chatRooms.splice(0)
      }
      this.chatRooms.push({id:0, name: 'General'})
      try {
        const { data } = await axios.get("/chat/rooms")
        this.chatRooms.push(...data)
      } catch (e) {
        // to think about
      }
    },
    // async setRoomMembers() {
    //   if (this.chatRooms) {
    //     this.chatRoomMembers.splice(0)
    //   }
    //   try {
    //     const { data } = await axios.get("/chat/rooms/" + this.currentRoom.id)
    //     this.chatRoomMembers.push(...data)
    //   } catch (e) {
    //     // to think about
    //   }
    // },
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
        console.log(this.createRoomInfo)
        await axios.post('/chat/new', this.createRoomInfo);
          this.currentRoom = this.createRoom.name;
          this.resetCreateForm()
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
      console.log(this.joinRoomInfo)
      if (!this.isJoinButtonClickable) {
        return;
      }
      try {
        await axios.post('/chat/join', this.joinRoomInfo);
        // this.$chatSocket.emit('joinRoom', this.joinRoom.name)
        this.currentRoom = this.joinRoom.name;
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
    },
    isMyMessage(msg: any) : boolean {return msg.userId === this.user.id;},
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


.avatar-container, .select-container {
  margin: 10px; /* Add some margin for spacing */
}
</style>