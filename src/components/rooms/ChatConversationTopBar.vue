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
    <template v-if="roomMembers">
      <div class="flex align-center cursor-pointer">
        <p>Print info about the group here or a button</p>
        <div class="v-avatar-group">
          <VAvatar
            v-for="memberData in roomMembers"
            :key="memberData.id"
            :size="32"
            :image="memberData.member.profile?.avatar"
          />
        </div>
      </div>

      <VSpacer />

      <div class="sm:flex items-center hidden">
        <p>something here</p>
      </div>

      <VBtn variant="text" color="default" icon size="small">
        <VIcon size="22" icon="tabler-dots-vertical" />

        <VMenu activator="parent">
          <div>
            <VBtn variant="text" color="default" icon size="small">
              Some button depending on the use role on this on the group
              <VIcon size="22" icon="tabler-eye" />
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
import useRoomsStore, { MemberRoomWithUserProfiles } from '@/stores/RoomsStore'

export default defineComponent({
  name: 'ChatTopBar',
  components: {},
  props: {
    isLeftSidebarOpen: {
      type: Boolean,
      required: true
    },
    roomMembers: {
      type: Array as PropType<MemberRoomWithUserProfiles[]>
    }
  },
  setup() {
    const authStore = useAuthStore()
    const roomStore = useRoomsStore()
    return {
      authStore,
      roomStore
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
    // some functions like to ban or a menu, any top bar thing
  }
})
</script>

<style scoped></style>
