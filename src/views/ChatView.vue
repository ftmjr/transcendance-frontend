<template>
    <h1>hello from chat view</h1>

    Current chat room : {{ currentChatroom }}
  <p>Socket id is {{ socket.socket.id }}</p>

  <form>
    <base-button type="submit" name="createRoom" :value="value"/>
  </form>

  <v-checkbox label="Backroom call open a room where the user is in on mount"></v-checkbox>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useChatStore from '@/stores/ChatStore'
import BaseButton from '../components/Button.vue'
import BaseInput from '../components/Input.vue'
import { initFlowbite } from 'flowbite'
import chatSocketService from "@/utils/socketio";

const chatStore = useChatStore()
export default defineComponent({
  name: 'chat-view',
  components: {
    BaseButton,
    BaseInput
  },
  data(){
    return {
      socket: chatSocketService,
      currentChatroom: 'not in a chatroom',
    }
  },
  created() {
    this.socket.connectChat(chatStore.getSocketOptions)
    this.socket.socket.on('chat', (message) => {
      // this.addMessage(message, message.id === this.$chatSocket.socket.id)
      console.log(message)
    })
  },
})
</script>

<style lang="css"></style>
