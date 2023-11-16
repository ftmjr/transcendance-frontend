<template>
  <VLayout
    v-show="!loading"
    class="p-2 border border-solid rounded shadow-sm bg-surface border-slate-400"
  >
    <v-navigation-drawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      width="370"
      :temporary="$vuetify.display.smAndDown"
      :permanent="$vuetify.display.mdAndUp"
      class="chat-list-sidebar"
    >
      <dm-conversation-list-side-bar
        @open-chat-of-contact="openChatOfContact"
        @show-user-profile="showMyProfile"
        @close="isLeftSidebarOpen = false"
      />
    </v-navigation-drawer>
    <VMain class="chat-content-container">
      <single-direct-message
          v-if="!!messageStore.currentContact"
          v-model:is-left-sidebar-open="isLeftSidebarOpen"
      />
      <div v-else class="flex items-center justify-center h-full flex-column">
        <VAvatar size="109" class="mb-6 elevation-3 bg-surface">
          <VIcon size="50" class="rounded-0 text-high-emphasis" icon="tabler-message" />
        </VAvatar>
        <p
            class="px-6 py-1 mb-0 text-lg font-weight-medium elevation-3 rounded-xl text-high-emphasis bg-surface"
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
  props: {
    friendId: {
      type: Number,
      required: false
    }
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
  watch: {
    $route(to, from) {
      if (to.name === 'dm') {
        const id = to.params.friendId
        if (id) {
          this.setConversation(Number(id))
        }
      }
    },
    'messageStore.currentContact': {
      handler(value) {
        if (value) {
          document.title = `${value.profile?.name} - Message | Transcendence`
        }
      },
      immediate: true
    }
  },
  created() {
    this.userStore.loadAllMyFriends()
  },
  async beforeMount() {
    await this.messageStore.getUniqueConversations()
    if (this.friendId) {
      await this.setConversation(this.friendId)
    }
  },
  methods: {
    async setConversation(friendId?: number) {
      this.loading = true
      if (friendId) {
        await this.messageStore.setCurrentConversationWith(friendId)
      }
      this.loading = false
    },
    showMyProfile() {
      this.$router.push({
        name: 'me'
      })
    },
    async openChatOfContact(id: number) {
      await this.$router.push({
        name: 'dm',
        params: { friendId: id }
      })
    },
    startConversation() {
      if (this.vuetifyDisplays.mdAndUp) return
      this.isLeftSidebarOpen = true
    }
  }
})
</script>

<style lang="scss"></style>
