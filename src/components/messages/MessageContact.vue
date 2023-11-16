<template>
  <li
    v-if="contact"
    class="flex flex-col px-2 pb-2 rounded-lg cursor-pointer hover:bg-darkBlue"
    :class="{ 'bg-darkBlue/50': isActive }"
  >
    <div class="flex items-center gap-2 p-2">
      <AvatarBadge
        :user-id="contact.id"
        :user="contact"
        :avatar-variant="isActive ? 'outlined' : 'tonal'"
        :size="32"
      />
      <span class="font-weight-medium line-clamp-1" :class="{ 'font-weight-bold': isActive }">
        {{ contact.profile.name.split(' ').shift() }} {{ contact.profile.lastname }}
      </span>
    </div>
    <div class="flex items-center justify-center px-4">
      <slot
        v-if="(conversationWith && contact.id === conversationWith.id) || !isTyping"
        name="firstMessage"
      />
      <p
        v-else-if="conversationWith && contact.id !== conversationWith.id"
        class="w-full ml-16 -mt-2 text-xs font-light shrink-0"
      >
        {{ contact.profile.name.split(' ').shift() }}
        <span class="pr-1">est en train d'écrire</span>
        <v-icon :size="12" color="primary" icon="svg-spinners:3-dots-bounce" />
      </p>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useMessageStore from '@/stores/MessageStore'
import type { User } from '@/interfaces/User'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import { Profile } from '@/interfaces/User'
import useRoomsStore from '@/stores/RoomsStore'

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
    const roomsStore = useRoomsStore()
    return {
      messageStore,
      roomsStore
    }
  },
  data() {
    return {
      isTyping: false
    }
  },
  computed: {
    isActive() {
      return this.messageStore.currentContactId === this.contact.id
    },
    conversationWith(): (User & { profile: Profile }) | null {
      return this.messageStore.currentContact
    }
  },
  watch: {
    'roomsStore.getContactTyping': {
      handler() {
        if (!this.contact) return
        const lastTime = this.roomsStore.getContactTyping.get(this.contact.id)
        if (!lastTime) return false
        const now = new Date().getTime()
        this.isTyping = now - lastTime < 3000

        // console.log(this.conversationWith?.profile, this.contact.profile)
      },
      deep: true,
      immediate: true
    },
    isTyping: {
      handler(value) {
        // return the value to false if changed to true after 3 seconds
        if (!value) return
        setTimeout(() => {
          this.isTyping = false
        }, 1000)
      },
      deep: true,
      immediate: true
    }
  }
})
</script>

<style scoped lang="scss"></style>
