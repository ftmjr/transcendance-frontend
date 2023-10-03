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
        <AvatarBadge :profile="contact.profile" :username="contact.username" />

        <div class="flex-grow-1 ms-4 overflow-hidden">
          <h6 class="font-mono font-medium">
            {{ contact.profile.name }} {{ contact.profile.lastname }}
          </h6>
        </div>
      </div>

      <VSpacer />

      <div class="sm:flex items-center hidden">
        <VBtn variant="text" color="primary" icon size="small" @clik="playAgainst">
          <VIcon size="22" icon="icon-park-solid:game-three" />
        </VBtn>
      </div>

      <VBtn variant="text" color="default" icon size="small">
        <VIcon size="22" icon="tabler-dots-vertical" />

        <VMenu activator="parent">
          <div>
            <VBtn variant="text" color="default" icon size="small" @click="showProfile">
              Voir le profil
              <VIcon size="22" icon="tabler-eye" />
            </VBtn>
            <VBtn variant="text" color="default" icon size="small" @click="blockContact">
              Bloquer le contact
              <VIcon size="22" icon="tabler-ban" />
            </VBtn>
          </div>
        </VMenu>
      </VBtn>
    </template>
  </div>
  <VDivider class="d-md-none" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import type { User } from 'Auth'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'

export default defineComponent({
  name: 'MessageTopBar',
  components: {
    AvatarBadge
  },
  props: {
    isLeftSidebarOpen: {
      type: Boolean,
      required: true
    },
    contact: {
      type: Object as PropType<User>
    }
  },
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  emits: ['update:isLeftSidebarOpen'],
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
    async showProfile() {},
    async playAgainst() {}
  }
})
</script>

<style scoped></style>
