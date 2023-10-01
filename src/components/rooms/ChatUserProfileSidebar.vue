<template>
  <div class="pt-2 me-2 text-end">
    <VBtn variant="text" color="error" icon size="small" @click="$emit('close')">
      <VIcon size="18" class="text-medium-emphasis" icon="tabler-x" />
    </VBtn>
  </div>
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
  <div class="text-center px-6">
    <VBadge
      location="bottom right"
      offset-x="7"
      offset-y="4"
      bordered
      :color="authStore.resolveAvatarBadgeVariant(this.authStore.getProfile.status)"
      class="chat-user-profile-badge mb-5"
    >
      <VAvatar
        size="84"
        variant="tonal"
        :class="`text-${authStore.resolveAvatarBadgeVariant(this.authStore.getProfile.status)}`"
      >
        <VImg v-if="profile.avatar" :src="profile.avatar" />
        <span v-else class="text-3xl">{{ avatarText(authStore.getUser.username) }}</span>
      </VAvatar>
    </VBadge>
    <h2 class="mb-1 text-high-emphasis font-weight-medium text-base">
      {{ authStore.getUser.username }}
    </h2>
    <h6>{{ authStore.getProfile.name }} {{ authStore.getProfile.lastname }}</h6>
  </div>
  <div v-if="this.roomsStore.currentRoom" class="mb-5 w-full">
    <p class="text-md text-center font-weight-bold py-2">STATUS</p>
    <p class="text-center font-weight-semibold" :class="`text-${printedRole.bgClass}`">
      {{ printedRole.printRole }}
      sur le groupe selectionné
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore, { Status } from '@/stores/AuthStore'
import type { Profile } from 'Auth'
import { avatarText } from '@core/utils/formatters'
import useRoomsStore, { rolePrint } from '@/stores/RoomsStore'
import { ChatMemberRole } from '@/utils/chatSocket'

export default defineComponent({
  name: 'ChatUserProfileSidebar',
  emits: ['close'],
  setup() {
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    return {
      authStore,
      roomsStore
    }
  },
  data() {
    return {
      userStatusOptions: [
        { title: 'En ligne', value: Status.Online, color: 'success' },
        { title: 'Away', value: Status.Away, color: 'warning' },
        { title: 'Ne pas déranger', value: Status.Busy, color: 'error' },
        { title: 'Hors ligne', value: Status.Offline, color: 'secondary' }
      ]
    }
  },
  computed: {
    profile(): Profile {
      return this.authStore.getProfile
    },
    status: {
      get(): Status {
        return this.profile.status ?? Status.Offline
      },
      set(value: Status) {
        this.authStore.changeMyStatus(value)
      }
    },
    role(): ChatMemberRole {
      const room = this.roomsStore.currentRoom
      if (room) {
        return room.members.find((member) => member.memberId === this.authStore.getUser.id)?.role
      }
      return ChatMemberRole.USER
    },
    printedRole(): { role: ChatMemberRole; printRole: string; color?: string; bgClass?: string } {
      return rolePrint.find((role) => role.role === this.role)
    }
  },
  methods: {
    avatarText
  }
})
</script>

<style scoped></style>
