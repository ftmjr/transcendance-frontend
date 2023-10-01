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
    <VMain class="h-96">
      <SingleChatView
        v-if="roomsStore.currentRoom"
        :room="roomsStore.currentRoom"
        v-model:is-left-sidebar-open="isLeftSidebarOpen"
      />
      <div v-else class="h-full">
        <ChatConversationTopBar
          :is-left-sidebar-open="isLeftSidebarOpen"
          @show-user-profile="showMyProfile"
        />
        <div class="flex h-full flex-col items-center justify-center mb-2">
          <VAvatar size="109" class="shadow-md mb-6 bg-slate-700">
            <VIcon size="50" class="rounded text-high-emphasis" icon="tabler-message" />
          </VAvatar>
          <p class="text-lg font-medium text-center">
            Selectionner une conversation
            <span class="font-normal text-sm">, ou rejoignez une equipe</span>
          </p>
        </div>
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
import ChatUserProfileSidebar from '@/components/rooms/ChatUserProfileSidebar.vue'
import useRoomsStore from '@/stores/RoomsStore'
import ChatConversationTopBar from '@/components/rooms/ChatConversationTopBar.vue'
export default defineComponent({
  name: 'ChatWindowView',
  components: {
    ChatConversationListSideBar,
    ChatUserProfileSidebar,
    SingleChatView,
    ChatConversationTopBar
  },
  setup() {
    const vuetifyDisplays = useDisplay()
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
    return {
      authStore,
      isLeftSidebarOpen,
      roomsStore
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
    }
  }
})
</script>

<style scoped></style>
