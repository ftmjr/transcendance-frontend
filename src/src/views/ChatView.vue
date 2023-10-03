<template>
  <header class="header-container">
    <chat-user-avatar :avatar-url="authStore.getAvatar" />
    <room-selector :rooms="chatStore.getRooms" />
  </header>
  <BaseButton @click="globalStore.openJoinDialog">Join a Chat Room</BaseButton>
  <BaseButton @click="globalStore.openCreateDialog">Create Chat Room</BaseButton>
  <BaseButton v-if="chatStore.getRoom.name !== 'General'" @click="chatStore.leaveRoom"
    >Leave Chat Room</BaseButton
  >
  <BaseButton v-if="chatStore.isOwner" @click="globalStore.openRoomPasswordDialog"
    >Set/Change Password</BaseButton
  >

  <messages-container />

  <v-text-field
    bg-color="background"
    label="Message"
    v-model="chatStore.message"
    @keyup.enter="chatStore.sendMessage"
    :disabled="chatStore.isMuted"
  />

  <members-drawer />

  <join-dialog v-model="globalStore.dialogs.join" />
  <password-dialog v-model="globalStore.dialogs.password" />
  <room-password-dialog v-model="globalStore.dialogs.roomPassword" />
  <create-dialog v-model="globalStore.dialogs.create" />
  <profile-dialog v-if="globalStore.dialogs.profile" v-model="globalStore.dialogs.profile" />
  <waiting-dialog v-model="globalStore.dialogs.waiting" />
  <invite-dialog v-model="globalStore.dialogs.invite" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useChatStore from '@/stores/ChatStore'
import useGlobalStore from '@/stores/GlobalStore'
import InviteDialog from '@/components/chat/InviteDialog.vue'
import PasswordDialog from '@/components/chat/PasswordDialog.vue'
import ProfileDialog from '@/components/chat/ProfileDialog.vue'
import ChatUserAvatar from '@/components/chat/Avatar.vue'
import RoomSelector from '@/components/chat/RoomSelector.vue'
import BaseButton from '@/components/Button.vue'
import JoinDialog from '@/components/chat/JoinDialog.vue'
import MessagesContainer from '@/components/chat/MessagesContainer.vue'
import MembersDrawer from '@/components/chat/MembersDrawer.vue'
import WaitingDialog from '@/components/chat/WaitingDialog.vue'
import CreateDialog from '@/components/chat/CreateDialog.vue'
import RoomPasswordDialog from '@/components/chat/roomPasswordDialog.vue'

export default defineComponent({
  name: 'ChatRoom-View',
  components: {
    RoomPasswordDialog,
    CreateDialog,
    WaitingDialog,
    MembersDrawer,
    MessagesContainer,
    JoinDialog,
    BaseButton,
    RoomSelector,
    ChatUserAvatar,
    InviteDialog,
    PasswordDialog,
    ProfileDialog
  },
  setup() {
    const authStore = useAuthStore()
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    return { authStore, chatStore, globalStore }
  },
  async beforeCreate() {
    this.globalStore.connectSocket()
    await this.globalStore.setUpChat()
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

.avatar-container,
.select-container {
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
