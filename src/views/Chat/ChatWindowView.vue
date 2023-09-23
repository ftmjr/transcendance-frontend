<template>
  <VLayout>
    <VNavigationDrawer
      v-model="isUserProfileSidebarOpen"
      temporary
      touchless
      absolute
      class="user-profile-sidebar"
      location="start"
      width="370"
    >
      <ChatUserProfileSide />
    </VNavigationDrawer>
    <VMain>
      <SingleChatView :contact="contactTest" v-model:is-left-sidebar-open="isLeftSidebarOpen" />
    </VMain>
  </VLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChatUserProfileSide from '@/components/chat/ChatUserProfileSide.vue'
import { useDisplay } from 'vuetify'
import useAuthStore from '@/stores/AuthStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import SingleChatView from '@/views/Chat/SingleChatView.vue'

export default defineComponent({
  name: 'ChatWindowView',
  components: {
    SingleChatView,
    ChatUserProfileSide
  },
  setup() {
    const vuetifyDisplays = useDisplay()
    const authStore = useAuthStore()
    const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
    return {
      authStore,
      isLeftSidebarOpen
    }
  },
  data() {
    return {
      isUserProfileSidebarOpen: false,
      contactTest: {
        id: 0,
        userId: 0,
        name: 'John',
        lastname: 'Doe',
        bio: 'Test Bio',
        status: 1
      }
    }
  }
})
</script>

<style scoped></style>
