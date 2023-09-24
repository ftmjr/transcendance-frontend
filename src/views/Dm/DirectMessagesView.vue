<template>
  <section class="message-window">
    <VLayout class="h-full">
      <VNavigationDrawer
        v-model="isLeftSidebarOpen"
        absolute
        touchless
        location="start"
        width="370"
        :temporary="$vuetify.display.smAndDown"
        class="chat-list-sidebar"
        :permanent="$vuetify.display.mdAndUp"
      >
        <DmConversationListSideBar
          @open-chat-of-contact="openChatOfContact"
          @show-user-profile="showMyProfile"
          @close="isLeftSidebarOpen = false"
        />
      </VNavigationDrawer>
      <VMain>
        <SingleDirectMessage
          v-if="messageStore.currentConversationWith"
          :conversationWith="messageStore.currentConversationWith"
          v-model:is-left-sidebar-open="isLeftSidebarOpen"
        />
        <div v-else class="h-96">
          <MessageTopBar v-model:isLeftSidebarOpen="isLeftSidebarOpen" />
          <div>
            <p>Nothing</p>
          </div>
        </div>
      </VMain>
    </VLayout>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'
import useAuthStore from '@/stores/AuthStore'
import useMessageStore from '@/stores/MessageStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import DmConversationListSideBar from './DmConversationListSideBar.vue'
import SingleDirectMessage from '@/views/Dm/SingleDirectMessage.vue'
import MessageTopBar from '@/components/Message/MessageTopBar.vue'

export default defineComponent({
  components: {
    DmConversationListSideBar,
    SingleDirectMessage,
    MessageTopBar
  },
  setup() {
    const authStore = useAuthStore()
    const messageStore = useMessageStore()
    const vuetifyDisplays = useDisplay()
    const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
    return {
      authStore,
      messageStore,
      isLeftSidebarOpen
    }
  },
  data() {
    return {
      loading: false
    }
  },
  beforeMount() {
    this.loadConversations()
  },
  methods: {
    async loadConversations() {
      this.loading = true
      await this.messageStore.getUniqueConversations()
      this.loading = false
    },
    showMyProfile() {
      this.$route.push({
        name: 'me'
      })
    },
    openChatOfContact(id: number) {
      this.messageStore.setCurrentConversationWith(id)
    }
  }
})
</script>

<style lang="scss">
.message-window {
  // & .chat-list-sidebar {
  // 	.v-navigation-drawer__content {
  // 	display: flex;
  // 	flex-direction: column;
  // 	}
  // }
}
</style>
