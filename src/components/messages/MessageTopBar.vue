<template>
  <div class="flex align-center text-medium-emphasis my-1">
    <VBtn
      variant="text"
      color="default"
      icon
      size="small"
      class="d-md-none me-3"
      @click="isLeftSidebarOpenLocal = true"
    >
      <VIcon size="24" icon="tabler-menu-2" />
    </VBtn>
    <template v-if="contact">
      <div class="flex align-center cursor-pointer" @click="showProfile">
        <AvatarBadge v-if="contact.profile" :user-id="contact.id" :user="contact" />
        <div class="flex-grow-1 ms-4 overflow-hidden">
          <h6 class="font-mono font-medium">
            {{ contact.profile.name }} {{ contact.profile.lastname }}
          </h6>
        </div>
      </div>

      <VSpacer />

      <div class="flex items-center">
        <GameStatusBadge
          v-if="contact.profile"
          :status="contact.profile.status"
          :user-id="contact.id"
          :user-game-status="userGameStatus"
        />
      </div>

      <VBtn v-if="contact" variant="text" color="default" icon size="small">
        <VIcon size="22" icon="tabler-dots-vertical" />
        <VMenu activator="parent">
          <VList>
            <VListItem prepend-icon="tabler-eye" @click="showProfile">
              <VListItemTitle> Voir le profil</VListItemTitle>
            </VListItem>
            <VListItem prepend-icon="tabler-ban" @click="blockContact">
              <VListItemTitle>Bloquer</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </VBtn>
    </template>
  </div>
  <VDivider class="d-md-none" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useUserStore from '@/stores/UserStore'
import type { User } from '@/interfaces/User'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import GameStatusBadge from '@/components/game/GameStatusBadge.vue'
import { GameSession } from '@/stores/GameStore'

export default defineComponent({
  name: 'MessageTopBar',
  components: {
    GameStatusBadge,
    AvatarBadge
  },
  props: {
    isLeftSidebarOpen: {
      type: Boolean,
      required: true
    },
    contact: {
      type: Object as PropType<User>
    },
    userGameStatus: {
      type: Object as PropType<{
        status: 'playing' | 'inQueue' | 'free'
        gameSession?: GameSession
      }>,
      required: true
    }
  },
  emits: ['update:isLeftSidebarOpen'],
  setup() {
    const authStore = useAuthStore()
    const usersStore = useUserStore()
    return {
      authStore,
      usersStore
    }
  },
  computed: {
    isLeftSidebarOpenLocal: {
      get(): boolean {
        return this.isLeftSidebarOpen
      },
      set(value: boolean) {
        this.$emit('update:isLeftSidebarOpen', value)
      }
    }
  },
  methods: {
    async blockContact() {
      if (!this.contact) return
      await this.usersStore.blockUser(this.contact.id)
    },
    async showProfile() {
      if (!this.contact) return
      this.$router.push({
        name: 'user-profile',
        params: { userId: this.contact.id }
      })
    }
  }
})
</script>

<style scoped></style>
