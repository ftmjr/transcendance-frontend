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
  <v-layout>
    <v-navigation-drawer expand-on-hover rail location="right">
      <template v-slot:prepend>
        <v-list-item
            v-for="member in conversations"
            :key="member.id"
            :class="{
            'pale-green-background': member.profile.status === 'Online',
            'received-message': true
          }"
            lines="two"
            :prepend-avatar="member.profile.avatar"
            :title="member.username"
            :subtitle="getNotification(member)"
            @click="selectReceiver(member)"
        >
          <div v-if="getNotification(member) != member.profile.status" class="status-circle"></div>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-main style="height: 250px"></v-main>
  </v-layout>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import useAuthStore from "@/stores/AuthStore.ts";
import axios from '@/utils/axios';
import useChatStore from "@/stores/ChatStore";
import chatSocketService from "@/utils/socketio";

const chatStore = useChatStore()
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
      chat: chatStore,
      receiver: null,
      messages: [],
      conversations: [],
      notifications: [],
      user: authStore.user,
      selectedUser: null,
      message: {room: '', content: ''},
      error: ''
    }
  },
  async created() {
    await socket.connectChat(socketOptions)
  },
  async mounted() {
    this.receiver = this.chat.dmReceiver
    socket.socket.emit('joinUsers')
    socket.socket.on('dm', (message: any) => {
      this.addMessage(message);}
    );
    await this.getAllUsers()
    await this.getConversations()
  },
  beforeUnmount() {
    socket.disconnect()
  },
  watch: {
    async receiver(newValue, oldValue) {
      this.messages = []
      socket.socket.emit('addReceiver', newValue)
      this.notifications[newValue.id] = newValue.profile.status;
      this.chat.setDmReceiver(newValue)
      await this.getMessages()
    },
  },
  computed: {
  },
  methods: {
    getNotification(member) {
      if (this.notifications[member.id]) {
        return this.notifications[member.id];
      }
      return member.profile.status; // Fallback to status if no notification
    },
    async selectReceiver(member) {
      this.receiver = member;
    },
    async getAllUsers() {
      try {
        const { data } = await axios.get("/users")
        this.users.push(...data)
      } catch (e) {
        // to think about
      }
    },
    async getConversations() {
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
    sendMessage(){
      if (!this.message.content) {
        return
      }
      socket.socket.emit('dm', this.message.content);
      this.message.content = '';
    },
    async addMessage(message: any) {
      if (this.isConversationMessage(message)){
        this.messages.push(message);
      } else {
        const senderInConversations = this.conversations.find(conversation => conversation.id === message.senderId);
        if (!senderInConversations) {
          this.getConversations().then(() => {
            this.notifications[message.senderId] = message.text;
          });
        } else {
          this.notifications[message.senderId] = message.text;
        }
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
    isMyMessage(msg: any) : boolean {return msg && msg.senderId === this.user.id;},
    isConversationMessage(msg: any) : boolean
    {
      if (this.receiver && this.isMyMessage(msg) === true) {
        return msg.receiverId === this.receiver.id;
      } else if (this.receiver) {
        return msg.senderId === this.receiver.id;
      }
      return false
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
.pale-green-background {
  background-color: palegreen;
}
.status-circle {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>