<template>
  <div v-if="userProfile" class="flex items-center gap-2">
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      :color="color"
      :bordered="bordered"
    >
      <VAvatar :variant="avatarVariant" :size="size" @click="$emit('showUserProfile')">
        <VImg
          v-if="userProfile.profile.avatar"
          :src="userProfile.profile.avatar"
          :alt="`avatar de ${userProfile.username}`"
        />
        <span v-else>{{ avatarText(userProfile.username) }}</span>
      </VAvatar>
      <slot />
    </VBadge>
    <div v-if="showName" class="text-center">
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
      <VAvatar :size="size" icon="tabler-loader" @click="$emit('showUserProfile')" />
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
    showStatus: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: Number,
      required: false,
      default: 38
    },
    bordered: {
      type: Boolean,
      required: false,
      default: false
    },
    avatarVariant: {
      type: String as PropType<'flat' | 'tonal' | 'text' | 'elevated' | 'outlined' | 'plain'>,
      required: false,
      default: () => 'flat'
    }
  },
  emits: ['showUserProfile'],
  setup() {
    const usersStore = useUserStore()
    const authStore = useAuthStore()
    return {
      usersStore,
      authStore
    }
  },
  data() {
    let userProfile = null as unknown as ShortUserProfile
    if (this.user) {
      userProfile = this.user
    }
    return {
      userProfile: userProfile
    }
  },
  computed: {
    status(): Status {
      if (this.userId === 0) {
        return Status.Online
      }
      const localValue = this.userProfile.profile.status ?? Status.Offline
      return this.usersStore.getUsersStatus.get(this.userId) ?? localValue
    },
    color(): 'success' | 'error' | 'warning' | 'secondary' {
      return this.authStore.resolveAvatarBadgeVariant(this.status)
    }
  },
  watch: {
    userId: {
      handler(value: number) {
        this.loadUser(value)
      }
    }
  },
  methods: {
    avatarText,
    async loadUser(userId: number) {
      const data = await this.usersStore.getShortUserProfile(userId)
      if (data) {
        this.userProfile = data
      }
    }
  }
})
</script>
