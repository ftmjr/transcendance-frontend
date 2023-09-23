<template>
  <div class="">
    <div class="flex align-center text-medium-emphasis my-1">
      <VBtn
        variant="text"
        color="default"
        icon
        size="small"
        class="d-md-none me-3"
        @click="isLeftSidebarOpenLocal = true"
      >
        <VIcon size="24" icon="tabler-menu-2" />
      </VBtn>

      <div class="flex align-center cursor-pointer" @click="showProfile">
        <VBadge
          dot
          location="bottom right"
          offset-x="3"
          offset-y="3"
          :color="authStore.resolveAvatarBadgeVariant(contact.status)"
          bordered
        >
          <VAvatar
            size="40"
            variant="tonal"
            :color="authStore.resolveAvatarBadgeVariant(contact.status)"
            class="cursor-pointer"
          >
            <VImg v-if="contact.avatar" :src="contact.avatar" :alt="contact.name" />
            <span v-else>{{ avatarText(contact.name) }}</span>
          </VAvatar>
        </VBadge>

        <div class="flex-grow-1 ms-4 overflow-hidden">
          <h6 class="font-mono font-medium">{{ contact.name }} {{ contact.lastname }}</h6>
        </div>
      </div>

      <VSpacer />

      <div class="sm:flex items-center hidden">
        <VBtn variant="text" color="primary" icon size="small">
          <VIcon size="22" icon="icon-park-solid:game-three" />
        </VBtn>
      </div>

      <VBtn variant="text" color="default" icon size="small">
        <VIcon size="22" icon="tabler-dots-vertical" />

        <VMenu activator="parent">
          <VList>
            <VListItem>
              <VListItemTitle @click="blockContact">Bloquer le contact</VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle @click="showProfile">Voir le profil</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </VBtn>
    </div>

    <VDivider />

    <PerfectScrollbar
      ref="chatLogScroller"
      tag="ul"
      :options="{ wheelPropagation: false }"
      class="flex-grow-1"
    >
      <ChatLogViewer />
    </PerfectScrollbar>
    <VForm class="chat-log-message-form mb-5 mx-5" @submit.prevent="sendMessage">
      <VTextField
        v-model="newMsgContent"
        variant="solo"
        class="chat-message-input transparent-input-box"
        placeholder="Ecrivez votre message..."
        density="default"
        autofocus
      >
        <template #append-inner>
          <VBtn @click="sendMessage"> Envoyer </VBtn>
        </template>
      </VTextField>
    </VForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ChatLogViewer from '@/components/chat/ChatLogViewer.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import type { Profile } from 'Auth'
import { avatarText } from '../../vuetify/@core/utils/formatters'
import useAuthStore, { Status } from '@/stores/AuthStore'

export default defineComponent({
  name: 'SingleChatView',
  components: {
    PerfectScrollbar,
    ChatLogViewer
  },
  props: {
    contact: {
      type: Object as PropType<Profile>,
      required: true
    },
    isLeftSidebarOpen: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  data() {
    return {
      newMsgContent: '',
      isActiveChatUserProfileSidebarOpen: false
    }
  },
  computed: {
    status: {
      get(): Status {
        return this.authStore.getUser.status
      },
      set(value: Status) {
        // code to set the status
      }
    },
    isLeftSidebarOpenLocal: {
      get(): boolean {
        return this.isLeftSidebarOpen
      },
      set(value: boolean) {
        this.$emit('update:isLeftSidebarOpen', value)
      }
    }
  },
  methods: {
    avatarText,
    sendMessage() {
      // code to send message
      console.log('try to send message')
    },
    blockContact() {
      console.log('try to block contact')
    },
    showProfile() {
      this.$router.push({
        name: 'user-profile',
        props: { userId: this.contact.userId }
      })
    }
  }
})
</script>

<style scoped></style>
