<template>
  <header class="header-container">
    <aside class="avatar-container">
      <v-avatar size="100">
        <v-img :src="authStore.getAvatar"></v-img>
      </v-avatar>
    </aside>
  </header>
  <v-autocomplete
    bg-color="background"
    v-model="chatStore.dmReceiver"
    label="Select/Enter Username"
    :items="usersStore.getUsers"
    item-title="username"
    return-object
  />
  <dm-container />
  <v-text-field
    bg-color="background"
    label="Message"
    v-model="chatStore.message"
    @keyup.enter="chatStore.sendDm"
  />
  <conversations-drawer />
  <invite-dialog v-model="globalStore.dialogs.invite" />
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useAuthStore from '@/stores/AuthStore'
import useChatStore from '@/stores/ChatStore'
import useGlobalStore from '@/stores/GlobalStore'
import useUsersStore from '@/stores/UsersStore'
import ConversationsDrawer from '@/components/chat/ConversationsDrawer.vue'
import DmContainer from '@/components/chat/DmContainer.vue'
import InviteDialog from '@/components/chat/InviteDialog.vue'

export default defineComponent({
  name: 'ChatRoom-View',
  components: {
    InviteDialog,
    ConversationsDrawer,
    DmContainer
  },
  setup() {
    const authStore = useAuthStore()
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    const usersStore = useUsersStore()
    const { dmReceiver } = storeToRefs(chatStore)
    watch(dmReceiver, (newReceiver) => {
      globalStore.socketAddReceiver(newReceiver)
      globalStore.notifications[newReceiver.id] = newReceiver.profile.status
      chatStore.setDmReceiver(newReceiver)
      chatStore.setDmMessages()
    })
    return { authStore, chatStore, globalStore, usersStore }
  },
  async beforeCreate() {
    this.globalStore.connectSocket()
    await this.globalStore.setUpDm()
  },
  beforeUnmount() {
    this.globalStore.disconnectSocket()
  }
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
.avatar-container,
.select-container {
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
