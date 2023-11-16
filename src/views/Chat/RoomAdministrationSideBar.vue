<template>
  <div>
    <div class="text-end mt-2">
      <VBtn v-if="$vuetify.display.smAndDown" variant="text" size="small" @click="$emit('close')">
        <VIcon :size="18" color="error" class="text-medium-emphasis"> tabler-x </VIcon>
      </VBtn>
    </div>
    <div v-if="roomStore.getCurrentRoomMembers">
      <h6 class="h3 text-lg text-center">Room Reglages</h6>
      <div v-if="owner" class="mt-4">
        <h6 class="h6 text-sm text-center">Boss</h6>
        <div class="mt-2">
          <VAvatar size="30" :src="owner.member.profile.avatar" />
          <span class="ms-2">{{ owner.member.username }}</span>
        </div>
      </div>
      <div class="mt-4">
        <h6 class="h6 text-sm text-center">Admins</h6>
        <div class="mt-2">
          <div v-for="admin in admins" :key="admin.member.id" class="d-flex align-items-center">
            <VAvatar size="30" :src="admin.member.profile.avatar" />
            <span class="ms-2">{{ admin.member.username }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore, { MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
import useAuthStore from '@/stores/AuthStore'
import { ChatMemberRole } from '@/utils/chatSocket'

// @TODO: BUild this component
export default defineComponent({
  name: 'RoomAdministrationSideBar',
  setup() {
    const roomStore = useRoomsStore()
    const authStore = useAuthStore()
    return {
      roomStore,
      authStore
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ChatMemberRole() {
      return ChatMemberRole
    },
    roomMembers(): MemberRoomWithUserProfiles[] {
      return this.roomStore.getCurrentRoomMembers
    },
    userRole(): ChatMemberRole {
      const roomMembers = this.roomStore.getCurrentRoomMembers
      if (!roomMembers) return ChatMemberRole.BAN
      const member = roomMembers.find((member) => member.member.id === this.authStore.getUser?.id)
      return member?.role ?? ChatMemberRole.USER
    },
    owner(): MemberRoomWithUserProfiles | undefined {
      return this.roomStore.getCurrentRoomMembers.find(
        (member) => member.role === ChatMemberRole.OWNER
      )
    },
    admins(): MemberRoomWithUserProfiles[] {
      return this.roomStore.getCurrentRoomMembers.filter(
        (member) => member.role === ChatMemberRole.ADMIN
      )
    },
    bans(): MemberRoomWithUserProfiles[] {
      return this.roomStore.getCurrentRoomMembers.filter(
        (member) => member.role === ChatMemberRole.BAN
      )
    },
    muted(): MemberRoomWithUserProfiles[] {
      return this.roomStore.getCurrentRoomMembers.filter(
        (member) => member.role === ChatMemberRole.MUTED
      )
    }
  },
  methods: {
    async banWithTime() {
      // @TODO: Build this method to ban a user with a time
    },
    async ban() {
      // @TODO: Build this method to ban a user
    },
    promoteToAdmin() {
      // @TODO: Build this method to promote a user to admin
    },
    promoteToNormalUser() {
      // @TODO: Build this method to promote a user to admin
    }
  }
})
</script>

<style scoped></style>
