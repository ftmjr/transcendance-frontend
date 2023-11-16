<template>
  <div class="flex my-1 align-center text-medium-emphasis">
    <v-btn
      variant="text"
      color="default"
      icon
      size="small"
      class="d-md-none me-3"
      @click="isLeftSidebarOpenLocal = true"
    >
      <v-icon size="24" icon="tabler-menu-2" />
    </v-btn>
    <template v-if="contact">
      <div class="flex cursor-pointer align-center" @click="showProfile">
        <avatar-badge :user-id="contact.id" :user="contact" :show-name="true" />
        <span class="pl-2 text-sm text-primary line-clamp-1"> @{{ contact.username }}</span>
      </div>
      <v-chip class="ml-2" v-if="isBlocked" append-icon="tabler-lock" color="error"> Bloqué </v-chip>
      <VSpacer />
      <div class="flex items-center">
        <game-status-badge
          v-if="contact.profile"
          :status="contact.profile.status"
          :user-id="contact.id"
          :user-game-status="userGameStatus"
        />
      </div>
      <VBtn variant="text" color="default" icon size="small">
        <v-icon size="22" icon="tabler-dots-vertical" />
        <v-menu activator="parent">
          <v-list>
            <VListItem prepend-icon="tabler-eye" @click="showProfile">
              <VListItemTitle> Voir le profil</VListItemTitle>
            </VListItem>
            <VListItem v-if="!isBlocked" prepend-icon="tabler-ban" @click="blockContact">
              <VListItemTitle>Bloquer</VListItemTitle>
            </VListItem>
          </v-list>
        </v-menu>
      </VBtn>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useUserStore from '@/stores/UserStore'
import type { User } from '@/interfaces/User'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import GameStatusBadge from '@/components/game/GameStatusBadge.vue'
import { GameSession } from '@/stores/GameStore'
import { Profile } from '@/interfaces/User'
import useMessageStore from '@/stores/MessageStore'

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
    userGameStatus: {
      type: Object as PropType<{
        status: 'playing' | 'inQueue' | 'free'
        gameSession?: GameSession
      }>,
      required: true
    },
    friendshipStatus: {
      type: String as PropType<'friend' | 'pending' | 'none'>,
      required: true
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['update:isLeftSidebarOpen', 'blocked'],
  setup() {
    const usersStore = useUserStore()
    const messageStore = useMessageStore()
    return {
      usersStore,
      messageStore
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
    },
    contact(): (User & { profile: Profile }) | null {
      return this.messageStore.currentContact
    }
  },
  methods: {
    async blockContact() {
      if (!this.contact) return
      const ret = await this.usersStore.blockUser(this.contact.id)
      if (ret) this.$emit('blocked')
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
