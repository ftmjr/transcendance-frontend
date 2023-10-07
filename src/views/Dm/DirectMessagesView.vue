<template>
  <VLayout class="bg-surface rounded border p-2 border-solid border-slate-400 shadow-sm">
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      width="370"
      :temporary="$vuetify.display.smAndDown"
      :permanent="$vuetify.display.mdAndUp"
      class="chat-list-sidebar"
    >
      <DmConversationListSideBar
        @open-chat-of-contact="openChatOfContact"
        @show-user-profile="showMyProfile"
        @close="isLeftSidebarOpen = false"
      />
    </VNavigationDrawer>
    <VMain class="chat-content-container">
      <SingleDirectMessage
        v-if="messageStore.currentConversationWith"
        :conversationWith="messageStore.currentConversationWith"
        v-model:is-left-sidebar-open="isLeftSidebarOpen"
      />
      <div v-else class="flex h-full items-center justify-center flex-column">
        <VAvatar size="109" class="elevation-3 mb-6 bg-surface">
          <VIcon size="50" class="rounded-0 text-high-emphasis" icon="tabler-message" />
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
import useMessageStore from '@/stores/MessageStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import DmConversationListSideBar from './DmConversationListSideBar.vue'
import SingleDirectMessage from '@/views/Dm/SingleDirectMessage.vue'
import useUserStore from '@/stores/UserStore'

export default defineComponent({
  components: {
    DmConversationListSideBar,
    SingleDirectMessage
  },
  setup() {
    const authStore = useAuthStore()
    const messageStore = useMessageStore()
    const userStore = useUserStore()
    const vuetifyDisplays = useDisplay()
    const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
    return {
      authStore,
      messageStore,
      userStore,
      isLeftSidebarOpen,
      vuetifyDisplays
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
      await this.userStore.loadAllMyFriends()
      this.loading = false
    },
    showMyProfile() {
      this.$router.push({
        name: 'me'
      })
    },
    openChatOfContact(id: number) {
      this.messageStore.setCurrentConversationWith(id)
    },
    startConversation() {
      if (this.vuetifyDisplays.mdAndUp) return
      this.isLeftSidebarOpen = true
    }
  }
})
</script>

<style lang="scss"></style>
