<template>
  <VLayout class="bg-surface rounded border p-2 border-solid border-slate-400 shadow-sm">
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      width="370"
      :temporary="$vuetify.display.smAndDown"
      class="pt-2"
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
      <div v-else class="h-full">
        <MessageTopBar v-model:isLeftSidebarOpen="isLeftSidebarOpen" />
        <div class="flex h-full flex-col items-center justify-center mb-2">
          <VAvatar size="109" class="shadow-md mb-6 bg-slate-700">
            <VIcon size="50" class="rounded text-high-emphasis" icon="tabler-message" />
          </VAvatar>
          <p class="text-lg font-medium text-center">
            Selectionner une conversation
            <span class="font-normal text-sm">, ou faites vous des amis en leur faisant un dm</span>
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
