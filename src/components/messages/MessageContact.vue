<template>
  <li
    v-if="contact"
    class="flex flex-col cursor-pointer bg-slate-700 px-2 rounded-lg hover:bg-slate-600"
    :class="{ 'bg-slate-600': isActive }"
  >
    <div class="flex items-center gap-2 p-2">
      <AvatarBadge
        :user-id="contact.id"
        :user="contact"
        :avatar-variant="isActive ? 'outlined' : 'tonal'"
      />
      <span class="font-weight-medium" :class="{ 'font-weight-bold': isActive }">
        {{ contact.profile.name }} {{ contact.profile.lastname }}
      </span>
    </div>
    <div class="flex items-center justify-center px-4">
      <slot name="firstMessage" />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useMessageStore from '@/stores/MessageStore'
import type { User } from '@/interfaces/User'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import { Profile } from '@/interfaces/User'

export default defineComponent({
  components: { AvatarBadge },
  props: {
    contact: {
      type: Object as PropType<User & { profile: Profile }>,
      required: true
    }
  },
  setup() {
    const messageStore = useMessageStore()
    return {
      messageStore
    }
  },
  computed: {
    isActive() {
      return this.messageStore.currentContactId === this.contact.id
    }
  }
})
</script>

<style scoped lang="scss"></style>
