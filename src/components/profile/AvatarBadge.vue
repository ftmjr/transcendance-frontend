<template>
  <div
    v-if="userProfile"
    class="flex items-center gap-2"
  >
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      :color="color"
      :bordered="true"
    >
      <VAvatar
        :size="size"
        @click="$emit('showUserProfile')"
      >
        <VImg
          v-if="userProfile.profile.avatar"
          :src="userProfile.profile.avatar"
          :alt="`avatar de ${userProfile.username}`"
        />
        <span v-else>{{ avatarText(userProfile.username) }}</span>
      </VAvatar>
    </VBadge>
    <div
      v-if="showName"
      class="text-center"
    >
      <span class="text-sm">{{ userProfile.profile.name }} {{ userProfile.profile.lastname }}</span>
    </div>
  </div>
  <div v-else>
    <!-- a loader badge or a circular loader -->
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      color="error"
      :bordered="true"
      class="animate-pulse"
    >
      <VAvatar
        :size="size"
        icon="tabler-loader"
        @click="$emit('showUserProfile')"
      />
    </VBadge>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { avatarText } from '@core/utils/formatters'
import useUserStore, { ShortUserProfile } from '@/stores/UserStore'
import useAuthStore from '@/stores/AuthStore'
import { Status } from '@/interfaces/User'

export default defineComponent({
  props: {
    userId: {
      type: Number,
      required: true
    },
    user: {
      type: Object as PropType<ShortUserProfile>,
      required: false,
      default: undefined
    },
    showName: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: Number,
      required: false,
      default: 38
    }
  },
  emits: ['showUserProfile'],
  setup() {
    const userStore = useUserStore()
    const authStore = useAuthStore()
    return {
      userStore,
      authStore
    }
  },
  data() {
    let userProfile = null as unknown as ShortUserProfile
    if (this.user) {
      userProfile = this.user
    }
    return {
      userProfile,
      intervalId: null as unknown as number
    }
  },
  computed: {
    color(): 'success' | 'error' | 'warning' | 'secondary' {
      if (!this.userProfile) {
        return this.authStore.resolveAvatarBadgeVariant(Status.Offline)
      }
      const status = this.userProfile.profile?.status ?? Status.Offline
      return this.authStore.resolveAvatarBadgeVariant(status)
    }
  },
  beforeMount() {
    this.intervalId = setInterval(this.loadUser, 5 * 60 * 1000)
    if (!this.userProfile) {
      this.loadUser()
    }
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    avatarText,
    async loadUser() {
      const data = await this.userStore.getShortUserProfile(this.userId)
      if (data) {
        this.userProfile = data
      }
    }
  }
})
</script>
