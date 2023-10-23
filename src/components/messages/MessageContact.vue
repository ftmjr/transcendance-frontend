<template>
  <li
    class="cursor-pointer"
    :class="{ 'chat-contact-active': isActive }"
  >
    <div class="flex items-center contact">
      <VBadge
        v-if="contact.profile?.status"
        dot
        location="bottom right"
        offset-x="3"
        offset-y="3"
        :color="authStore.resolveAvatarBadgeVariant(contact.profile.status)"
        bordered
      >
        <VAvatar
          size="40"
          variant="tonal"
          :color="authStore.resolveAvatarBadgeVariant(contact.profile.status)"
        >
          <VImg
            v-if="contact.profile.avatar"
            :src="contact.profile.avatar"
            :alt="contact.username"
          />
          <span v-else>{{ avatarText(contact.profile.name) }}</span>
        </VAvatar>
      </VBadge>

      <div class="flex ms-4 overflow-hidden">
        <span>{{ contact.profile?.name }} {{ contact.profile?.lastname }}</span>
      </div>
    </div>
    <div>
      <slot name="firstMessage" />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useMessageStore from '@/stores/MessageStore'
import type { User } from '@/interfaces/User'
import { avatarText } from '@core/utils/formatters'

export default defineComponent({
  props: {
    contact: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup() {
    const authStore = useAuthStore()
    const messageStore = useMessageStore()
    return {
      authStore,
      messageStore
    }
  },
  computed: {
    isActive() {
      return this.messageStore.currentContactId === this.contact.id
    }
  },
  methods: {
    avatarText
  }
})
</script>

<style scoped lang="scss">
.contact {
  &.chat-contact-active {
    .v-avatar {
      background: #fff;
      outline: 2px solid #fff;
    }
  }
}
</style>
