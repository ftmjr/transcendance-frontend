<template>
  <div>
    <div class="text-end mt-2">
      <VBtn v-if="$vuetify.display.smAndDown" variant="text" size="small" @click="$emit('close')">
        <VIcon :size="18" color="error" class="text-medium-emphasis"> tabler-x </VIcon>
      </VBtn>
    </div>
    <div v-if="roomStore.getCurrentRoomMembers.length">
      <h6 class="h3 text-lg text-center">Reglages</h6>
      <VCard title="Admins">
        <VTable>
          <thead>
            <tr>
              <th scope="col">Utilisateur</th>
              <th scope="col" class="flex justify-end align-center">
                <VIcon :size="18">tabler-dots-vertical</VIcon>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in admins" :key="member.member.id">
              <td>
                <AvatarBadge
                  :user-id="member.member.id"
                  :user="member.member"
                  @show-user-profile="$emit('showUserProfile')"
                />
              </td>
              <td class="flex justify-end align-center">
<<<<<<< HEAD
                <VBtn variant="text" size="small" @click="$emit('showUserProfile')">
                  <VIcon :size="18" color="error"> tabler-trash </VIcon>
=======
                <VBtn
                  variant="text"
                  size="small"
                  @click="$emit('showUserProfile')"
                >
                  <VIcon
                    :size="18"
                    color="error"
                  >
                    tabler-trash
                  </VIcon>
>>>>>>> origin/feature/chat-and-game
                </VBtn>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
      <VCard title="Muted"></VCard>
      <VCard title="Bans"></VCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
<<<<<<< HEAD
import useRoomsStore, { MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
=======
import useRoomsStore, { MemberRoomWithUserProfiles } from "@/stores/RoomsStore";
>>>>>>> origin/feature/chat-and-game
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
    userRole(): ChatMemberRole {
      const roomMembers = this.roomStore.getCurrentRoomMembers
      const member = roomMembers.find((member) => member.member.id === this.authStore.getUser?.id)
      return member?.role ?? ChatMemberRole.USER
    },
    admins(): MemberRoomWithUserProfiles[] {
<<<<<<< HEAD
      return this.roomStore.getCurrentRoomMembers.filter(
        (member) => member.role === ChatMemberRole.ADMIN
      )
    },
    bans(): MemberRoomWithUserProfiles[] {
      return this.roomStore.getCurrentRoomMembers.filter(
        (member) => member.role === ChatMemberRole.BAN
      )
    }
=======
      return this.roomStore.getCurrentRoomMembers.filter((member) => member.role === ChatMemberRole.ADMIN)
    },
    bans(): MemberRoomWithUserProfiles[] {
      return this.roomStore.getCurrentRoomMembers.filter((member) => member.role === ChatMemberRole.BAN)
    },
>>>>>>> origin/feature/chat-and-game
  }
})
</script>

<style scoped></style>
