<template>
  <div>
    <div class="text-end mt-2">
      <VBtn v-if="$vuetify.display.smAndDown" variant="text" size="small" @click="$emit('close')">
        <VIcon :size="18" color="error" class="text-medium-emphasis"> tabler-x </VIcon>
      </VBtn>
    </div>
    <div v-if="roomStore.getCurrentRoomMembers" class="px-4">
      <h3 class="text-lg font-semibold text-center text-primary">Membres</h3>
      <PerfectScrollbar
        tag="ul"
        :options="{
          wheelPropagation: false,
          suppressScrollX: true
        }"
        class="h-full list-none"
      >
        <li
          class="flex items-center py-2 gap-2"
          v-for="m in roomStore.getCurrentRoomMembers"
          :key="m.id"
        >
          <AvatarBadge
            :user-id="m.member.id"
            :user-profile="m.member.profile"
            :show-name="true"
            :size="34"
            :bordered="true"
            avatar-variant="outlined"
          />
          <VIcon v-if="m.role === ChatMemberRole.OWNER" :size="18" color="primary">
            tabler-crown
          </VIcon>
          <VIcon v-else-if="m.role === ChatMemberRole.ADMIN" :size="18" color="secondary">
            tabler-shield-check
          </VIcon>
          <VIcon v-else-if="m.role === ChatMemberRole.BAN" :size="18" color="error">
            tabler-user-x
          </VIcon>
          <VIcon v-else-if="m.role === ChatMemberRole.MUTED" :size="18" color="warning">
            tabler-user-minus
          </VIcon>
          <VMenu activator="parent" width="380px" location="bottom end">
            <div class="bg-darkBlue/90 p-4 rounded-lg">
              <h5>Boite pour le manager</h5>
              tu as clicker pour voir {{ m.member.profile.name }}
            </div>
          </VMenu>
        </li>
      </PerfectScrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore, { MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
import useAuthStore from '@/stores/AuthStore'
import { ChatMemberRole } from '@/utils/chatSocket'
import { Status } from '@/interfaces/User'
import useUserStore from '@/stores/UserStore'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'

// @TODO: BUild this component
export default defineComponent({
  name: 'RoomAdministrationSideBar',
  components: { AvatarBadge },
  emits: ['refreshMembers'],
  setup() {
    const roomStore = useRoomsStore()
    const authStore = useAuthStore()
    const usersStore = useUserStore()
    return {
      roomStore,
      authStore,
      usersStore
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
    // current user role
    userRole(): ChatMemberRole {
      const roomMembers = this.roomStore.getCurrentRoomMembers
      if (!roomMembers) return ChatMemberRole.BAN
      const member = roomMembers.find((member) => member.member.id === this.authStore.getUser?.id)
      return member?.role ?? ChatMemberRole.USER
    },
    membersFetchedStatus(): { userId: number; status: Status }[] {
      return this.roomMembers.map((member) => {
        return {
          userId: member.member.id,
          status: member.member.profile.status
        }
      })
    },
    owner(): MemberRoomWithUserProfiles | undefined {
      return this.roomStore.getCurrentRoomMembers.find(
        (member) => member.role === ChatMemberRole.OWNER
      )
    },
    // list of admins
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
    async banWithTime(userId: number, time: number) {
      // @TODO: Build this method to ban a user with a time
      this.$emit('refreshMembers')
    },
    async ban(userId: number) {
      // @TODO: Build this method to ban a user
      this.$emit('refreshMembers')
    },
    promoteToAdmin(userId: number) {
      // @TODO: Build this method to promote a user to admin
      this.$emit('refreshMembers')
    },
    promoteToNormalUser() {
      // @TODO: Build this method to promote a user to admin
      this.$emit('refreshMembers')
    },
    getMemberLastStatus(userId: number): Status {
      // @TODO: To use only if too many caluclations is okay
      const memberStatus =
        this.membersFetchedStatus.find((member) => member.userId === userId)?.status ??
        Status.Offline
      const lastSocketStatus = this.usersStore.getUsersStatus.get(userId)
      return lastSocketStatus ?? memberStatus
    }
  }
})
</script>

<style scoped></style>
