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
        <AvatarBadge
          v-if="contact.profile"
          :profile="contact.profile"
          :username="contact.username"
        />

        <div class="flex-grow-1 ms-4 overflow-hidden">
          <h6 class="font-mono font-medium">
            {{ contact.profile.name }} {{ contact.profile.lastname }}
          </h6>
        </div>
      </div>

      <VSpacer />

      <div class="flex items-center">
        <GameStatusBadge
          :status="contact.profile.status"
          :user-id="contact.id"
          :user-game-status="userGameStatus"
        />
      </div>

      <VBtn variant="text" color="default" icon size="small">
        <VIcon size="22" icon="tabler-dots-vertical" />
        <VMenu activator="parent">
          <VList>
            <VListItem prepend-icon="tabler-eye">
              <VBtn @click="showProfile">
                <VListItemTitle> Voir le profil</VListItemTitle>
              </VBtn>
            </VListItem>
            <VListItem prepend-icon="tabler-ban">
              <VBtn @click="blockContact">
                <VListItemTitle>Bloquer</VListItemTitle>
              </VBtn>
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
    return {
      authStore
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
    async blockContact() {},
    async showProfile() {}
  }
})
</script>

<style scoped></style>
