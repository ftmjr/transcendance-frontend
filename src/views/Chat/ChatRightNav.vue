<template>
  <div
    :class="[
      'absolute w-64 h-full border-l border-gray-50/10 md:relative md:right-0 transition-all duration-300 ease-in',
      roomStore.isRightNavOpen ? 'right-0' : '-right-full'
    ]"
    style="background-color: #0e1231"
  >
    <div class="flex flex-col h-full gap-0">
      <div
        class="flex items-center justify-between w-full px-2 border-b md:justify-center h-14 text-primary grow-0 shrink-0"
      >
        <v-btn
          class="md:hidden"
          icon
          color="transparent"
          size="24"
          @click="roomStore.toggleRightNav()"
        >
          <v-icon>iconamoon:close</v-icon>
        </v-btn>
        <span> Membres </span>
      </div>
      <div class="flex-1 h-full">
        <div class="h-full overflow-scroll">
          <div class="w-full h-full shrink-0 grow-0">
            <perfect-scrollbar
              tag="ul"
              :options="{
                wheelPropagation: false,
                suppressScrollX: true
              }"
              class="h-full grow-0 srink-0 hidescroolbar"
            >
              <li
                class="block px-2 py-2"
                v-for="m in roomStore.getCurrentRoomMembers"
                :key="m.id"
              >
                <chat-members-list-button :member="m" />
              </li>
            </perfect-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChatMembersListButton from './ChatMembersListButton.vue'
import { defineComponent } from 'vue'
import useRoomsStore, { MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
import useAuthStore from '@/stores/AuthStore'
import { ChatMemberRole } from '@/utils/chatSocket'
import { Status } from '@/interfaces/User'
import useUserStore from '@/stores/UserStore'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
// @ts-ignore
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

// @TODO: BUild this component
export default defineComponent({
  name: 'RoomAdministrationSideBar',
  components: { AvatarBadge, PerfectScrollbar, ChatMembersListButton },
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
  },
  mounted() {
    console.log(this.roomStore.getCurrentRoomMembers)
  }
})
</script>
