<template>
  <div class="text-end mt-2">
    <VBtn
      v-if="$vuetify.display.smAndDown"
      variant="text"
      color="default"
      icon
      size="small"
      @click="$emit('close')"
    >
      <VIcon size="18" icon="tabler-x" color="error" class="text-medium-emphasis" />
    </VBtn>
  </div>
  <div v-if="authStore.getProfile" class="flex mb-2 px-1">
    <AvatarBadge
      :profile="authStore.getProfile"
      :username="authStore.getUser.username"
      @show-user-profile="$emit('showUserProfile')"
    />
    <VTextField
      v-model="search"
      density="compact"
      rounded
      placeholder="Chercher une conversation..."
      class="ms-4 me-1 transparent-input-box"
    >
      <template #prepend-inner>
        <VIcon size="22" icon="tabler-search" />
      </template>
    </VTextField>
  </div>
  <VDivider />
  <PerfectScrollbar tag="ul" class="chat-contacts-list px-3" :options="{ wheelPropagation: false }">
    <li class="py-4">
      <span class="chat-contact-header text-primary text-xl font-weight-medium">Conversations</span>
    </li>
    <MessageContact
      v-for="contact in messageStore.getConversingWith"
      :key="contact.id"
      class="mb-2"
      :contact="contact"
      @click="showMessages(contact.id)"
    >
      <template #firstMessage>
        <span class="text-disabled ml-1">
          {{ messageStore.getLastMessageBetween(contact.id)?.message }}
        </span>
      </template>
    </MessageContact>

    <span v-show="!messageStore.getConversingWith.length" class="no-chat-items-text text-disabled">
      Aucune Conversation
    </span>
    <li class="my-4">
      <span class="chat-contact-header text-primary text-xl font-weight-medium"> Contacts </span>
    </li>
    <MessageContact
      v-for="contact in messageStore.getContactsWithoutConversation"
      :key="contact.id"
      class="mb-2"
      :contact="contact"
      @click="showMessages(contact.id)"
    />
  </PerfectScrollbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useMessageStore from '@/stores/MessageStore'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import MessageContact from '@/components/messages/MessageContact.vue'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import useUserStore from '@/stores/UserStore'

export default defineComponent({
  components: {
    PerfectScrollbar,
    MessageContact,
    AvatarBadge
  },
  emits: ['openChatOfContact', 'showUserProfile', 'close'],
  setup() {
    const authStore = useAuthStore()
    const messageStore = useMessageStore()
    const userStore = useUserStore()
    return {
      authStore,
      userStore,
      messageStore
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    search: {
      get(): string {
        return this.messageStore.getSearchTerm
      },
      set(value: string) {
        this.messageStore.setSearchTerm(value)
      }
    }
  },
  methods: {
    showMessages(userId: number) {
      this.$emit('openChatOfContact', userId)
    }
  }
})
</script>

<style lang="scss">
.chat-contacts-list {
  --chat-content-spacing-x: 12px;

  padding-block-end: 0.75rem;

  .chat-contact-header {
    margin-block-end: 1rem;
    margin-block-start: 1.25rem;
  }

  .chat-contact-header,
  .no-chat-items-text {
    margin-inline: var(--chat-content-spacing-x);
  }
}
</style>
