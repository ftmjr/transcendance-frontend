<template>
  <div class="text-end">
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
  <div class="flex mb-2 px-1" v-if="authStore.getProfile">
    <AvatarBadge :profile="authStore.getProfile" @show-user-profile="$emit('showUserProfile')" />
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
  <PerfectScrollbar tag="ul" class="px-3" :options="{ wheelPropagation: false }">
    <li class="py-4">
      <span class="text-primary text-xl font-weight-medium">Message privee</span>
    </li>
    <MessageContact
      v-for="contact in messageStore.getConversingWith"
      :key="contact.id"
      :contact="contact"
      @clik="showMessages(contact.id)"
    />
    <span v-show="!messageStore.getConversingWith.length" class="text-disabled">
      Aucune Conversation
    </span>
  </PerfectScrollbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useMessageStore from '@/stores/MessageStore'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import MessageContact from '@/components/Message/MessageContact.vue'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'

export default defineComponent({
  components: {
    PerfectScrollbar,
    MessageContact,
    AvatarBadge
  },
  setup() {
    const authStore = useAuthStore()
    const messageStore = useMessageStore()
    return {
      authStore,
      messageStore
    }
  },
  emits: ['openChatOfContact', 'showUserProfile', 'close'],
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
