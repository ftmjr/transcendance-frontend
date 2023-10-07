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
      <RoomContact v-if="room" :room="room" :profiles="roomMembers" />
      <VSpacer />

      <div class="sm:flex items-center hidden">
        <p>Some Action button</p>
      </div>

      <VBtn variant="text" color="default" icon size="small">
        <VIcon size="22" icon="tabler-dots-vertical" />
        <VMenu activator="parent">
          <VList>
            <VListItem prepend-icon="tabler-pencil">
              <VListItemTitle> Something </VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </VBtn>
    </template>
  </div>
  <VDivider />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useRoomsStore, { ChatRoomWithMembers, MemberRoomWithUserProfiles } from '@/stores/RoomsStore'
import RoomContact from '@/components/rooms/RoomContact.vue'

export default defineComponent({
  name: 'ChatTopBar',
  components: { RoomContact },
  props: {
    isLeftSidebarOpen: {
      type: Boolean,
      required: true
    },
    room: {
      type: Object as PropType<ChatRoomWithMembers>
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
  emits: ['update:isLeftSidebarOpen', 'showUserProfile'],
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
