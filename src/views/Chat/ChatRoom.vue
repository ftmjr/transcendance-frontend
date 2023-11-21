<template>
  <div class="flex flex-col flex-1 h-full">
    <div class="w-full border-b h-14 text-primary">
      <div class="flex items-center justify-between w-full h-full">
        <v-btn
          @click="roomStore.toggleLeftNav()"
          icon
          color="transparent"
          class="inline-block lg:hidden"
        >
          <v-icon icon="ion:menu"></v-icon>
        </v-btn>
        <room-settings />
        <v-btn
          @click="roomStore.toggleRightNav"
          icon
          color="transparent"
          class="inline-block md:hidden"
        >
          <v-icon>heroicons:user-group-solid</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="relative flex-1 w-full pb-0 overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <v-progress-circular :size="70" :width="7" color="sky" indeterminate />
      </div>
      <template v-else>
        <chat-room-message-list v-if="roomStore.getCurrentRoomStatus.state === true" />
        <chat-room-join v-else-if="roomStore.getCurrentRoomStatus.state === false" />
        <template v-else>
          <div
            v-if="roomStore.isLeftNavOpen === false"
            class="flex items-center justify-center h-full flex-column"
          >
            <VAvatar size="109" class="mb-6 elevation-3 bg-surface">
              <VIcon size="50" class="rounded-0 text-high-emphasis" icon="tabler-message" />
            </VAvatar>
            <p
              class="px-6 py-1 mb-0 text-lg font-weight-medium elevation-3 rounded-xl text-high-emphasis bg-surface"
            >
              Rejoignez une salle pour commencer à chatter
            </p>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore from '@/stores/RoomsStore'
import useAuthStore from '@/stores/AuthStore'
import RoomSettings from './Settings.vue'
import ChatRoomMessageList from '@/views/Chat/ChatRoomMessageList.vue'
import ChatRoomJoin from '@/views/Chat/ChatRoomJoin.vue'

export default defineComponent({
  components: { ChatRoomJoin, ChatRoomMessageList, RoomSettings },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const authStore = useAuthStore()
    const roomStore = useRoomsStore()
    return {
      authStore,
      roomStore
    }
  }
})
</script>
