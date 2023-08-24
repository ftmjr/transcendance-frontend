<template>
  <header class="header-container">
    <aside class="avatar-container">
      <v-avatar size="100">
        <v-img :src="user.profile.avatar"></v-img>
      </v-avatar>
    </aside>
  </header>
  <v-autocomplete
      bg-color="background"
      v-model="receiver"
      label="Select/Enter Username"
      :items="users"
      item-title="username"
      return-object
  ></v-autocomplete>
  <v-card class="messages" flat>
    <v-card-text class="flex-grow-1 overflow-y-auto" style="height: 400px;">
      <div v-for="msg in messages" :key="msg.id" :class="{ 'd-flex flex-row-reverse': isMyMessage(msg) }">
        <v-hover v-slot:default="{ hover }">
          <v-avatar size="30">
            <v-img :src="msg.sender.profile.avatar"></v-img>
          </v-avatar>
          <v-chip :color="isMyMessage(msg) ? 'primary' : ''" dark style="height:auto;white-space: normal;" class="pa-4 mb-2">
            <span v-if="msg.sender" class="font-bold">{{ msg.sender.username }}:</span> {{ msg.text }}
            <sub class="ml-2" style="font-size: 0.5rem;">{{ formatMessageDate(msg.timestamp, true) }}</sub>
            <v-icon v-if="hover" small>expand_more</v-icon>
          </v-chip>
        </v-hover>
      </div>
    </v-card-text>
  </v-card>
  <v-text-field bg-color='background' label="Message" v-model="message.content" @keyup.enter="sendMessage"></v-text-field>
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
      users: [],
      receiver: null,
      messages: [],
      user: authStore.user,
      selectedUser: null,
      message: {room: '', content: ''},
      error: ''
    }
  },
  async beforeCreate() {
    await socket.connectChat(socketOptions)
    socket.socket.emit('joinUsers')
    socket.socket.on('dm', (message: any) => {
      this.addMessage(message);}
    );

    // old methods
    socket.socket.on('updateRooms', () => {
      this.getRooms()
    })
    socket.socket.on('updateRoomMembers', () => {
      this.getRoomMembers()
    })
  },
  async created() {
    await this.getAllUsers()
  },
  beforeUnmount() {
    socket.disconnect()
  },
  watch: {
    async receiver(newValue, oldValue) {
      this.messages.splice(0)
      socket.socket.emit('addReceiver', newValue.id)
      await this.getMessages()
    },
  },
  computed: {
  },
  methods: {
    async getAllUsers() {
      try {
        const { data } = await axios.get("/users")
        this.users.push(...data)
      } catch (e) {
        // to think about
      }
    },
    sendMessage(){
      if (!this.message.content) {
        return
      }
      socket.socket.emit('dm', this.message.content);
      this.message.content = '';
    },
    addMessage(message: any) {
      console.log(message.sender)
      if (this.isConversationMessage(message)){
        this.messages.push(message);
      }
    },
    async getMessages() {
      this.messages.splice(0)
      try {
        const { data } = await axios.get("/chat/dm/" + this.receiver.id, {params: {take: 100}})
        this.messages.push(...data)
      }
      catch (e) {
        // to think about
      }
    },
    isAdminOrOwner(member) {
      return (member.role === 'OWNER' || member.role ==='ADMIN')
    },
    openUserDialog(user) {
      this.selectedUser = user;
      console.log(this.selectedUser)
      this.dialogs.user = true;
    },
    closeUserDialog() {
      this.dialogs.user = false;
    },
    isMyMessage(msg: any) : boolean {return msg.senderId === this.user.id;},
    isConversationMessage(msg: any) : boolean
    {
      if (this.isMyMessage(msg) === true)
      {
        return msg.receiverId === this.receiver.id;
      }
      else
      {
        return msg.senderId === this.receiver.id;
      }
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
.avatar-container, .select-container {
  margin: 10px; /* Add some margin for spacing */
}
.messages {
  height: 400px;
  overflow: auto;
}
.messages::-webkit-scrollbar-track {
  background: aqua;
}
.messages::-webkit-scrollbar-thumb {
  background: aqua;
}
</style>