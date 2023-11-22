<template>
  <section class="w-full h-full overflow-auto border rounded-md">
    <div class="relative flex w-full h-full overflow-hidden flex-nowrap">
      <chat-left-nav
        @create-room="showCreateRoomForm = !showCreateRoomForm"
        @show-room="changeRoom"
      />
      <chat-room :is-loading="loading" />
      <chat-right-nav :is-loading="loading" />
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useRoomsStore, { ChatRoomWithMembers } from '@/stores/RoomsStore'
import useUserStore from '@/stores/UserStore'
import ChatLeftNav from './ChatLeftNav.vue'
import ChatRightNav from './ChatRightNav.vue'
import ChatRoom from './ChatRoom.vue'

export default defineComponent({
  components: {
    ChatLeftNav,
    ChatRightNav,
    ChatRoom
  },
  props: {
    roomId: {
      type: Number,
      default: undefined
    }
  },
  setup() {
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    const userStore = useUserStore()
    return {
      authStore,
      roomsStore,
      userStore
    }
  },
  data() {
    return {
      loading: false,
      errorRoomAccessMsg: '',
      showCreateRoomForm: false,
      showErrorPopUp: false,
      isRightSidebarOpen: false
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'chat') {
        const id = to.params.roomId
        this.accessRoom(id)
      }
    },
    'roomsStore.currentRoom': {
      handler(value: ChatRoomWithMembers | null) {
        if (value) {
          document.title = `${value.name} - Room | Transcendence`
        }
      },
      immediate: true
    }
  },
  async beforeMount() {
    await this.roomsStore.fetchPublicRooms()
    await this.accessRoom(this.roomId)
  },
  methods: {
    async accessRoom(roomId?: number) {
      if (!roomId) return
      this.loading = true
      await this.roomsStore.getAllMyRooms()
      await this.roomsStore.selectRoom(roomId)
      this.loading = false
    },
    changeRoom(roomId: number) {
      this.$router.push({ name: 'chat', params: { roomId: roomId } })
    }
  }
})
</script>
<style lang="scss">
.h-\[65\] {
  height: 75px;
  bottom: 0rem;
}
.h-\[40px\] {
  height: 45px;
}
.relative {
  position: relative;
}
.bottom-\1\/2 {
  bottom: 50%;
}

.max-h-\1\/2 {
  height: 400px;
  max-height: 50%;
}
</style>
