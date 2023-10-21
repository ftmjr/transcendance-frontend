<template>
  <div>
    <div class="text-end mt-2">
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
    <div class="flex mb-2 px-1">
      <AvatarBadge
        v-if="authStore.getProfile && authStore.getUser"
        :profile="authStore.getProfile"
        :username="authStore.getUser.username"
        @show-user-profile="$emit('showUserProfile')"
      />
      <VTextField
        v-model="search"
        density="compact"
        rounded
        placeholder="Chercher une salle de discussion..."
        class="ms-4 me-1 transparent-input-box"
      >
        <template #prepend-inner>
          <VIcon size="22" icon="tabler-search" />
        </template>
      </VTextField>
    </div>
    <v-toolbar color="#C8CAFEFF">
      <v-toolbar-title class="text-slate-700">Salles de discussion</v-toolbar-title>
      <VBtn
        variant="elevated"
        icon
        size="small"
        color="primary"
        rounded
        @click="$emit('createRoom')"
      >
        <VIcon size="18" icon="tabler-edit" color="#C8CAFEFF" class="text-medium-emphasis" />
      </VBtn>
    </v-toolbar>
    <VDivider />
    <PerfectScrollbar
      tag="ul"
      class="chat-contacts-list px-3"
      :options="{ wheelPropagation: true }"
    >
      <li class="py-4">
        <span
          v-show="roomsStore.filteredRooms.length === 0"
          class="no-chat-items-text text-disabled"
        >
          Aucune salle de discussion
          <template v-if="search.length"> pour `{{ search }}`</template>
        </span>
      </li>
      <li v-for="room in roomsStore.filteredRooms" :key="room.id" @click="showRoom(room.id)">
        <RoomCard :room="room" />
      </li>
      <li class="py-4">
        <span class="chat-contact-header text-primary text-xl font-weight-medium"
          >Salles publique</span
        >
      </li>
      <li>
        <span
          v-show="roomsStore.filteredPublic.length === 0"
          class="no-chat-items-text text-disabled"
        >
          Aucune salle de discussion publique
          <template v-if="search.length"> pour `{{ search }}`</template>
        </span>
      </li>
      <li v-for="room in roomsStore.filteredPublic" :key="room.id" @click="showRoom(room.id)">
        <RoomCard :room="room" />
      </li>
    </PerfectScrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import useAuthStore from '@/stores/AuthStore'
import useUserStore from '@/stores/UserStore'
import useRoomsStore from '@/stores/RoomsStore'
import RoomCard from '@/components/chatRooms/RoomCard.vue'

export default defineComponent({
  name: 'ChatLeftSideBar',
  components: {
    RoomCard,
    AvatarBadge,
    PerfectScrollbar
  },
  emits: ['close', 'showUserProfile', 'showRoom', 'createRoom'],
  setup() {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const roomsStore = useRoomsStore()
    return {
      authStore,
      userStore,
      roomsStore
    }
  },
  data() {
    return {}
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
    showRoom(roomId: number) {
      console.log('trying to show room', roomId)
    },
    showUserProfile() {
      this.$emit('showUserProfile')
    }
  }
})
</script>

<style scoped></style>