<template>
  <v-dialog v-model="globalStore.dialogs.profile" max-width="400">
    <v-card>
      <div class="profile-avatar-container">
        <div class="status-background" :class="{ 'status-online': chatStore.getOtherProfile.status === 'Online', 'status-offline': chatStore.getOtherProfile.status !== 'Online' }">
        </div>
        <div class="avatar-container">
          <img :src="chatStore.getOtherProfile.avatar" alt="User Avatar" class="avatar-img" />
        </div>
      </div>
      <v-card-title class=text-center>{{ chatStore.getOtherMember.username }}</v-card-title>
      <v-card-title class=text-center>Role: {{ chatStore.selectedUser.role }}</v-card-title>

      <v-card-text>
        <v-alert v-if="chatStore.isError" type="error" title="Action Failed" :text="chatStore.error"></v-alert>

        <div class="profile-actions">
          <v-btn v-if="chatStore.userIsAdmin && !chatStore.selectedUserIsAdmin" @click="chatStore.muteUnmuteMember">Mute/Unmute</v-btn>
          <v-btn v-if="chatStore.userIsAdmin && !chatStore.selectedUserIsAdmin" @click="chatStore.kickMember">Kick</v-btn>
          <v-btn v-if="chatStore.userIsAdmin && !chatStore.selectedUserIsAdmin" @click="chatStore.banMember">Ban</v-btn>
        </div>

        <div class="profile-actions" v-if="chatStore.isOwner && !chatStore.selectedUserIsAdmin">
          <v-card-title> As the Owner you can</v-card-title>
          <v-btn @click="chatStore.promoteMember">Promote to admin</v-btn>
        </div>

        <div class="profile-actions">
          <v-btn v-if="chatStore.selectedUserIsNotMe" @click="usersStore.blockUser">Block User</v-btn>
          <v-btn v-if="chatStore.selectedUserIsNotMe" @click="usersStore.addFriend">Add Friend</v-btn>
          <v-btn v-if="chatStore.selectedUserIsNotMe" @click="chatStore.sendPrivateMessage">Send Message</v-btn>
          <v-btn v-if="chatStore.selectedUserIsNotMe" @click="globalStore.inviteToPlay">Invite to Play</v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="globalStore.closeProfileDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useGlobalStore from "@/stores/GlobalStore"
import useChatStore from "@/stores/ChatStore"
import useUsersStore from "@/stores/UsersStore"

export default defineComponent({
  name: 'profile-dialog',
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    const usersStore = useUsersStore()
    return { chatStore, globalStore, usersStore }
  },
})
</script>

<style scoped></style>
