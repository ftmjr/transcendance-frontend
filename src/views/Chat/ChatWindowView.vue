<template>
  <VLayout class="bg-surface rounded border p-2 border-solid border-slate-400 shadow-sm">
    <VNavigationDrawer
      v-model="isUserProfileSidebarOpen"
      temporary
      touchless
      absolute
      class=""
      location="start"
      width="370"
    >
      <ChatUserProfileSidebar @close="isUserProfileSidebarOpen = false" />
    </VNavigationDrawer>
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      width="370"
      :temporary="$vuetify.display.smAndDown"
      :permanent="$vuetify.display.mdAndUp"
      class="pt-2"
    >
      <ChatConversationListSideBar
        @open-chat-of-contact="openChatOfRoom"
        @show-user-profile="showMyProfile"
        @close="isLeftSidebarOpen = false"
      />
    </VNavigationDrawer>
    <VMain>
      <SingleChatView
        v-if="roomsStore.currentRoom"
        v-model:is-left-sidebar-open="isLeftSidebarOpen"
        :room="roomsStore.currentRoom"
      />
      <div
        v-else
        class="flex h-full items-center justify-center flex-column"
      >
        <VAvatar
          size="109"
          class="elevation-3 mb-6 bg-surface"
        >
          <VIcon
            size="50"
            class="rounded-0 text-high-emphasis"
            icon="tabler-message"
          />
        </VAvatar>
        <p
          class="mb-0 px-6 py-1 font-weight-medium text-lg elevation-3 rounded-xl text-high-emphasis bg-surface"
          :class="[{ 'cursor-pointer': $vuetify.display.smAndDown }]"
          @click="startConversation"
        >
          Commencez une conversation
        </p>
      </div>
    </VMain>
  </VLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'
import useAuthStore from '@/stores/AuthStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import SingleChatView from '@/views/Chat/SingleChatView.vue'
import ChatConversationListSideBar from '@/views/Chat/ChatConversationListSideBar.vue'
import ChatUserProfileSidebar from '@/components/chatRooms/ChatUserProfileSidebar.vue'
import useRoomsStore from '@/stores/RoomsStore'

export default defineComponent({
  name: 'ChatWindowView',
  components: {
    ChatConversationListSideBar,
    ChatUserProfileSidebar,
    SingleChatView
  },
  setup() {
    const vuetifyDisplays = useDisplay()
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
    return {
      authStore,
      isLeftSidebarOpen,
      roomsStore,
      vuetifyDisplays
    }
  },
  data() {
    return {
      isUserProfileSidebarOpen: false
    }
  },
  beforeMount() {
    this.roomsStore.getAllMyRooms()
    this.roomsStore.fetchPublicRooms()
  },
  methods: {
    openChatOfRoom(roomId: number) {
      this.roomsStore.setCurrentRoom(roomId)
    },
    showMyProfile() {
      this.isUserProfileSidebarOpen = true
    },
    startConversation() {
      if (this.vuetifyDisplays.mdAndUp) return
      this.isLeftSidebarOpen = true
    }
  }
})
</script>

<style scoped></style>
