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
    <VMain class="chat-content-container">
      <SingleChatView
        v-if="roomsStore.currentRoom"
        v-model:is-left-sidebar-open="isLeftSidebarOpen"
        :room="roomsStore.currentRoom"
        :room-members="roomsStore.currentRoomMembers"
        @show-admin-sidebar="isRightSidebarOpen = !isRightSidebarOpen"
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
    <NotificationPopUp v-model:visible="showErrorPopUp" :message="errorRoomAccessMsg" />
  </VLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'
import useAuthStore from '@/stores/AuthStore'
import useRoomsStore from '@/stores/RoomsStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import useUserStore from '@/stores/UserStore'
import ChatLeftSideBar from '@/views/Chat/ChatLeftSideBar.vue'
import NotificationPopUp from '@/components/notifications/NotificationPopUp.vue'
import CreateRoomForm from '@/views/Chat/CreateRoomForm.vue'
import SingleChatView from '@/views/Chat/SingleChatView.vue'
import RoomAdministrationSideBar from '@/views/Chat/RoomAdministrationSideBar.vue'

export default defineComponent({
  name: 'ChatWindowView',
  components: {
    SingleChatView,
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
      isRightSidebarOpen: false
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
      this.loading = true
      const check = await this.roomsStore.setCurrentRoom(roomId)
      if (check !== 'success') {
        this.errorRoomAccessMsg = check
        this.showErrorPopUp = true
      }
      this.loading = false
    },
    showMyProfile() {
      this.$router.push({ name: 'user.show', params: { id: this.authStore.getUser?.id } })
    }
  }
})
</script>

<style scoped></style>
