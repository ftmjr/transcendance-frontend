<template>
  <div class="text-end">
    <VBtn
      v-if="$vuetify.display.smAndDown"
      variant="text"
      color="default"
      icon
      size="small"
      @click="$emit('close')"
    >
      <VIcon size="18" icon="tabler-x" color="error" class="text-medium-emphasis" />
    </VBtn>
  </div>
  <div class="flex mb-2 px-1" v-if="authStore.getProfile">
    <AvatarBadge :profile="authStore.getProfile" @show-user-profile="$emit('showUserProfile')" />
    <VTextField
      v-model="search"
      density="compact"
      rounded
      placeholder="Chercher un groupe de chat..."
      class="ms-4 me-1 transparent-input-box"
    >
      <template #prepend-inner>
        <VIcon size="22" icon="tabler-search" />
      </template>
    </VTextField>
  </div>
  <VDivider />
  <PerfectScrollbar tag="ul" class="px-3" :options="{ wheelPropagation: false }">
    <li class="py-4">
      <span class="text-primary text-xl font-weight-medium">Mes chats</span>
    </li>
    <RoomContact
      v-for="room in roomsStore.filteredRooms"
      :key="room.id"
      :room="room"
      @click="showMessages(room.id)"
    />
    <span v-show="!roomsStore.filteredRooms.length" class="text-disabled mb-2">
      Aucuns groupes de chat
    </span>
    <li class="my-4">
      <span class="text-primary text-xl font-weight-medium">
        Public,
        <span class="text-sm font-weight-light">non inscrit</span>
      </span>
    </li>
    <RoomContact
      v-for="room in roomsStore.publicButNotJoined"
      :key="room.id"
      :room="room"
      @clik="showMessages(room.id)"
    />
  </PerfectScrollbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import RoomContact from '@/components/rooms/RoomContact.vue'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import useRoomsStore from '@/stores/RoomsStore'

export default defineComponent({
  components: {
    PerfectScrollbar,
    AvatarBadge,
    RoomContact
  },
  setup() {
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    return {
      authStore,
      roomsStore
    }
  },
  emits: ['openChatOfContact', 'showUserProfile', 'close'],
  data() {
    return {
      loading: false
    }
  },
  computed: {
    search: {
      get(): string {
        return this.roomsStore.searchTerm
      },
      set(value: string) {
        this.roomsStore.setSearchTerm(value)
      }
    }
  },
  methods: {
    showMessages(userId: number) {
      this.$emit('openChatOfContact', userId)
    }
  }
})
</script>
