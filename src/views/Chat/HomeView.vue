<template>
  <section class="w-full h-full overflow-auto border rounded-md">
    <div class="relative flex w-full h-full overflow-hidden flex-nowrap">
      <chat-left-nav
        @close="isLeftSidebarOpen = false"
        @create-room="showCreateRoomForm = !showCreateRoomForm"
        @show-user-profile="showUserProfileCard"
        @show-room="changeRoom"
      />
      <chat-room />
      <chat-right-nav />
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
// @ts-ignore
import { useDisplay } from 'vuetify'
import useAuthStore from '@/stores/AuthStore'
import useRoomsStore, { ChatRoomWithMembers } from '@/stores/RoomsStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import useUserStore from '@/stores/UserStore'
import ChatMembersListButton from './ChatMembersListButton.vue'
import RoomSettings from './Settings.vue'
import MessageVue from './Message.vue'
import CreateRoom from './CreateRoom.vue'
import ChatLeftNav from './ChatLeftNav.vue'
import ChatRightNav from './ChatRightNav.vue'
import ChatRoom from './ChatRoom.vue'
import { ChatMemberRole, ChatRoom as TChatRoom } from '@/utils/chatSocket'

export default defineComponent({
  components: {
    ChatMembersListButton,
    MessageVue,
    RoomSettings,
    CreateRoom,
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
    const vuetifyDisplays = useDisplay()
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    const userStore = useUserStore()
    const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)
    return {
      authStore,
      isLeftSidebarOpen,
      roomsStore,
      vuetifyDisplays,
      userStore
    }
  },
  data() {
    return {
      loading: false,
      errorRoomAccessMsg: '',
      showCreateRoomForm: false,
      showErrorPopUp: false,
      isRightSidebarOpen: false,
      currentRoomStatus: { state: false, role: null } as {
        state: boolean
        role: ChatMemberRole | null
        room?: TChatRoom
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'chat-new') {
        const id = to.params.roomId
        this.prepareRoomAccess(id)
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
    await this.prepareRoomAccess(this.roomId)
  },
  methods: {
    async prepareRoomAccess(roomId?: number) {
      await this.loadRooms()
      if (this.roomId) {
        await this.accessRoom(this.roomId)
      }
    },
    async loadRooms() {
      this.loading = true
      await this.roomsStore.fetchPublicRooms()
      await this.roomsStore.getAllMyRooms()
      await this.userStore.loadAllMyFriends()
      await this.userStore.loadBlockedUsers()
      this.loading = false
    },
    async accessRoom(roomId: number) {
      if (!roomId) return
      this.loading = true
      this.currentRoomStatus = await this.roomsStore.checkRoomRole(roomId)
      if (this.currentRoomStatus.state) {
        // is a member of the room
        const setRoomResult = await this.roomsStore.setCurrentRoom(roomId)
        if (setRoomResult !== 'success') {
          this.errorRoomAccessMsg = setRoomResult
          this.showErrorPopUp = true
        }
      }
      this.loading = false
    },
    showUserProfileCard() {
      console.log('show user profile card')
    },
    changeRoom(roomId: number) {
      this.$router.push({ name: 'chat-new', params: { roomId: roomId } })
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
