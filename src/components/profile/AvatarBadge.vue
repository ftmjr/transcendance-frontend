<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" :color="color" bordered>
    <VAvatar size="38" class="cursor-pointer" @click="$emit('showUserProfile')">
      <VImg v-if="profile.avatar" :src="profile.avatar" :alt="`avatar de ${profile.name}`" />
      <span v-else-if="username">{{ avatarText(username) }}</span>
      <span v-else>{{ avatarText(profile.name) }}</span>
    </VAvatar>
  </VBadge>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Profile } from 'Auth'
import { Status } from '@/stores/AuthStore'
import { avatarText } from '@/vuetify/@core/utils/formatters'

export default defineComponent({
  props: {
    profile: {
      type: Object as PropType<Profile>,
      required: true
    },
    username: {
      type: String
    }
  },
  emits: ['showUserProfile'],
  computed: {
    color(): 'success' | 'error' | 'warning' | 'secondary' {
      const status = this.profile.status ?? Status.Offline
      if (status === Status.Online) return 'success'
      else if (status === Status.Offline) return 'error'
      else if (status === Status.Busy) return 'warning'
      return 'secondary'
    }
  },
  methods: {
    avatarText
  }
})
</script>
