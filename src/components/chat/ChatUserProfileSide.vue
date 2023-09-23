<template>
  <div class="pt-2 me-2 text-end">
    <VBtn variant="text" color="default" icon size="small" @click="$emit('close')">
      <VIcon size="24" class="text-medium-emphasis" icon="tabler-x" />
    </VBtn>
  </div>
  <div class="text-center px-6">
    <VBadge
      location="bottom right"
      offset-x="7"
      offset-y="4"
      bordered
      :color="authStore.resolveAvatarBadgeVariant(profile.status)"
      class="chat-user-profile-badge mb-5"
    >
      <VAvatar
        size="84"
        variant="tonal"
        :class="`text-${authStore.resolveAvatarBadgeVariant(profile.status)}`"
      >
        <VImg v-if="profile.avatar" :src="profile.avatar" />
        <span v-else class="text-3xl">{{ avatarText(authStore.getUser.username) }}</span>
      </VAvatar>
    </VBadge>
    <h2 class="mb-1 text-high-emphasis font-weight-medium text-base">
      {{ authStore.getUser.username }}
    </h2>
  </div>
  <div class="mb-5">
    <span class="text-sm text-disabled">STATUS</span>
    <VRadioGroup v-model="status" class="mt-1">
      <VRadio
        v-for="radioOption in userStatusOptions"
        :key="radioOption.title"
        :label="radioOption.title"
        :value="radioOption.value"
        :color="radioOption.color"
      />
    </VRadioGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore, { Status } from '@/stores/AuthStore'
import type { Profile } from 'Auth'
import { avatarText } from '../../vuetify/@core/utils/formatters'
export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
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
        // this.authStore.updateProfileStatus({ status: value })
      }
    }
  },
  methods: {
    avatarText
  }
})
</script>

<style scoped></style>
