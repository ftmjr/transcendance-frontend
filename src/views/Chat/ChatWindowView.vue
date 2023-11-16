<template>
  <VLayout class="bg-surface rounded border p-2 border-solid border-slate-400 shadow-sm">
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      :absolute="true"
      :touchless="true"
      location="start"
      width="370"
      :temporary="$vuetify.display.smAndDown"
      :permanent="$vuetify.display.mdAndUp"
      class="chat-list-sidebar"
    >
      <ChatLeftSideBar
        @close="isLeftSidebarOpen = false"
        @create-room="showCreateRoomForm = !showCreateRoomForm"
        @show-user-profile="showUserProfileCard"
        @show-room="changeRoom"
      />
    </VNavigationDrawer>
    <VNavigationDrawer
      v-model="showCreateRoomForm"
      :absolute="true"
      :touchless="true"
      location="start"
      width="380"
    >
      <CreateRoomForm @close="showCreateRoomForm = false" />
    </VNavigationDrawer>
    <VMain class="chat-content-container">
      <RoomChat
        v-if="roomsStore.currentRoom && currentRoomStatus.state"
        v-model:is-left-sidebar-open="isLeftSidebarOpen"
        v-model:is-right-sidebar-open="isRightSidebarOpen"
      />
      <NotMemberRoom
        v-else-if="!currentRoomStatus.state && currentRoomStatus.room"
        v-model:is-left-sidebar-open="isLeftSidebarOpen"
        :room="currentRoomStatus.room"
        @join-room="accessRoom"
      />
      <div v-else class="flex h-full items-center justify-center flex-column">
        <VAvatar size="109" class="elevation-3 mb-6 bg-surface">
          <VIcon size="50" class="rounded-0 text-high-emphasis" icon="tabler-message" />
        </VAvatar>
        <p
          class="mb-0 px-6 py-1 font-weight-medium text-lg elevation-3 rounded-xl text-high-emphasis bg-surface"
          :class="[{ 'cursor-pointer': $vuetify.display.smAndDown }]"
          @click="isLeftSidebarOpen = true"
        >
          Trouver une salle de discussion
        </p>
      </div>
    </VMain>
    <VNavigationDrawer
      v-if="roomsStore.currentRoom"
      v-model="isRightSidebarOpen"
      :absolute="true"
      :touchless="true"
      location="end"
      width="380"
      :temporary="$vuetify.display.smAndDown"
      :permanent="$vuetify.display.mdAndUp"
    >
      <RoomAdministrationSideBar @close="isRightSidebarOpen = false" />
    </VNavigationDrawer>
    <NotificationPopUp v-model:visible="showErrorPopUp" :message="errorRoomAccessMsg" />
  </VLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'
import useAuthStore from '@/stores/AuthStore'
import useRoomsStore, { ChatRoomWithMembers } from '@/stores/RoomsStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import useUserStore from '@/stores/UserStore'
import ChatLeftSideBar from '@/views/Chat/ChatLeftSideBar.vue'
import NotificationPopUp from '@/components/notifications/NotificationPopUp.vue'
import CreateRoomForm from '@/views/Chat/CreateRoomForm.vue'
import RoomAdministrationSideBar from '@/views/Chat/RoomAdministrationSideBar.vue'
import { ChatMemberRole, ChatRoom } from '@/utils/chatSocket'
import NotMemberRoom from '@/views/Chat/NotMemberRoom.vue'
import RoomChat from '@/views/Chat/RoomChat.vue'

export default defineComponent({
  name: 'ChatWindowView',
  components: {
    RoomChat,
    NotMemberRoom,
    NotificationPopUp,
    ChatLeftSideBar,
    CreateRoomForm,
    RoomAdministrationSideBar
  },
  props: {
    roomId: {
      type: Number,
      default: undefined
    }
  },
  setup() {
    const vuetifyDisplays = useDisplay()
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    const userStore = useUserStore()
    const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
    return {
      authStore,
      isLeftSidebarOpen,
      roomsStore,
      vuetifyDisplays,
      userStore
    }
  },
  data() {
    return {
      loading: false,
      errorRoomAccessMsg: '',
      showCreateRoomForm: false,
      showErrorPopUp: false,
      isRightSidebarOpen: false,
      currentRoomStatus: { state: false, role: null } as {
        state: boolean
        role: ChatMemberRole | null
        room?: ChatRoom
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'chat') {
        const id = to.params.roomId
        if (id) {
          this.accessRoom(Number(id))
        }
      }
    },
    'roomsStore.currentRoom': {
      handler(value: ChatRoomWithMembers | null) {
        if (value) {
          document.title = `${value.name} - Room | Transcendence`
        }
      },
      immediate: true
    }
  },
  beforeMount() {
    this.loadRooms()
    if (this.roomId) {
      this.accessRoom(this.roomId)
    }
  },
  methods: {
    async loadRooms() {
      this.loading = true
      await this.roomsStore.getAllMyRooms()
      await this.roomsStore.fetchPublicRooms()
      await this.userStore.loadAllMyFriends()
      await this.userStore.loadBlockedUsers()
      this.loading = false
    },
    async accessRoom(roomId: number) {
      if (!roomId) return
      this.loading = true
      this.currentRoomStatus = await this.roomsStore.checkRoomRole(roomId)
      if (this.currentRoomStatus.state) {
        // is a member of the room
        const setRoomResult = await this.roomsStore.setCurrentRoom(roomId)
        if (setRoomResult !== 'success') {
          this.errorRoomAccessMsg = setRoomResult
          this.showErrorPopUp = true
        }
      }
      this.loading = false
    },
    showUserProfileCard() {
      console.log('show user profile card')
    },
    changeRoom(roomId: number) {
      this.$router.push({ name: 'chat', params: { roomId: roomId } })
    }
  }
})
</script>

<style scoped></style>
