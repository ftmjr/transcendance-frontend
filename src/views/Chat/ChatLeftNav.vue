<template>
  <div
    :class="[
      'absolute z-50 w-64 h-full border-r border-gray-50/10 lg:left-0 lg:relative transition-all duration-300 ease-in',
      roomsStore.isLeftNavOpen ? 'left-0' : '-left-full'
    ]"
    style="background-color: #0e1231"
  >
    <div class="flex flex-col h-full gap-0">
      <div
        class="flex items-center justify-between w-full px-2 border-b lg:justify-center h-14 text-primary"
      >
        <create-room />
        <v-btn
          class="lg:hidden"
          icon
          color="transparent"
          size="24"
          @click="roomsStore.toggleLeftNav()"
        >
          <v-icon>iconamoon:close</v-icon>
        </v-btn>
      </div>
      <div class="flex-1">
        <div class="relative w-full border-b h-1/2 shrink-0 grow-0">
          <span
            class="absolute z-10 w-full px-8 py-2 h-[65px] bottom-0 bg-gradient-to-b from-[#262A46]/0 to-[80%] to-[#262A46]"
          ></span>
          <perfect-scrollbar
            tag="ul"
            :options="{ wheelPropagation: true }"
            class="h-full grow-0 srink-0 hidescroolbar"
          >
            <li class="sticky top-0 z-50 p-2 text-lg font-bold bg-primary">
              <span> Salles Rejoint</span>
            </li>
            <li class="self-center p-2">
              <span
                v-show="roomsStore.filteredRooms.length === 0"
                class="no-chat-items-text text-disabled"
              >
                Vous n'avez rejoins aucune salle de discussion.
              </span>
            </li>
            <li v-for="room in roomsStore.filteredRooms" :key="room.id" @click="showRoom(room.id)">
              <room-card :room="room" />
            </li>
          </perfect-scrollbar>
        </div>
        <div class="w-full h-1/2 shrink-0 grow-0">
          <span
            class="absolute z-10 w-full px-8 py-2 h-[65px] bottom-0 bg-gradient-to-b from-[#262A46]/0 to-[80%] to-[#262A46]"
          ></span>
          <perfect-scrollbar
            tag="ul"
            :options="{ wheelPropagation: true }"
            class="h-full grow-0 srink-0 hidescroolbar"
          >
            <li class="sticky top-0 z-50 p-2 text-lg font-bold bg-primary">
              <span> Salles publique</span>
            </li>
            <li class="px-2">
              <span
                v-show="roomsStore.filteredPublic.length === 0"
                class="no-chat-items-text text-disabled"
              >
                Aucune salle de discussion publique
                <template v-if="search.length"> pour `{{ search }}`</template>
              </span>
            </li>
            <li v-for="room in roomsStore.filteredPublic" :key="room.id" @click="showRoom(room.id)">
              <room-card :room="room" />
            </li>
          </perfect-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
//@ts-ignore
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import useAuthStore from '@/stores/AuthStore'
import useUserStore from '@/stores/UserStore'
import useRoomsStore from '@/stores/RoomsStore'
import RoomCard from '@/components/chatRooms/RoomCard.vue'
import CreateRoom from './CreateRoom.vue'

export default defineComponent({
  name: 'ChatLeftSideBar',
  components: {
    RoomCard,
    AvatarBadge,
    PerfectScrollbar,
    CreateRoom
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
      this.$emit('showRoom', roomId)
    },
    showUserProfile() {
      this.$emit('showUserProfile')
    }
  }
})
</script>
