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
      :temporary="$vuetify.display.smAndDown"
      :permanent="$vuetify.display.mdAndUp"
    >
      <CreateRoomForm @close="showCreateRoomForm = false" />
    </VNavigationDrawer>
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

export default defineComponent({
  name: 'ChatWindowView',
  components: {
    NotificationPopUp,
    ChatLeftSideBar,
    CreateRoomForm
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
      showErrorPopUp: false
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
