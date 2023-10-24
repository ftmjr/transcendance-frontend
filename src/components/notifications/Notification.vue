<template>
  <component
    :is="component"
    :notification="notification"
    :is-short="isShort"
    @mark-as-read="$emit('markAsRead', notification.id)"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Notification, NotificationType } from '@/utils/notificationSocket'
import FriendRequest from '@/components/notifications/friend/FriendRequest.vue'
import FriendRequestAccepted from '@/components/notifications/friend/RequestAccepted.vue'
import FriendRequestRejected from '@/components/notifications/friend/RequestRejected.vue'
import AddedToRoom from '@/components/notifications/chat/AddedToRoom.vue'
import RoomAdministrator from '@/components/notifications/chat/RoomAdministrator.vue'
import GameChallengeAccepted from '@/components/notifications/game/GameChallengeAccepted.vue'
import GameInvitation from '@/components/notifications/game/GameInvitation.vue'
import GamePaused from '@/components/notifications/game/GamePaused.vue'
import GameResumed from '@/components/notifications/game/GameResumed.vue'

export default defineComponent({
  components: {
    FriendRequest,
    FriendRequestAccepted,
    FriendRequestRejected,
    AddedToRoom,
    RoomAdministrator,
    GameChallengeAccepted,
    GameInvitation,
    GamePaused
  },
  props: {
    notification: {
      type: Object as PropType<Notification>,
      required: true
    },
    isShort: {
      type: Boolean,
      default: false
    }
  },
  emits: ['markAsRead'],
  setup() {},
  computed: {
    component() {
      switch (this.notification.type) {
        case NotificationType.FRIEND_REQUEST:
          return this.getComponentForFriends()
        case NotificationType.GAME_EVENT:
          return this.getComponentForGameEvent()
        case NotificationType.GAME_INVITE:
          return this.getComponentForGameInvitation()
        case NotificationType.PRIVATE_MESSAGE:
          return this.getComponentForChat()
        default:
          return null
      }
    }
  },
  methods: {
    getComponentForFriends() {
      switch (this.notification.title) {
        case 'Friend Request Accepted':
          return FriendRequestAccepted
        case 'Friend Request Rejected':
          return FriendRequestRejected
        case 'Friend Request':
        default:
          return FriendRequest
      }
    },
    getComponentForGameInvitation() {
      switch (this.notification.title) {
        case 'Game Challenge Accepted':
          return GameChallengeAccepted
        case 'Game Challenge':
        default:
          return GameInvitation
      }
    },
    getComponentForGameEvent() {
      switch (this.notification.title) {
        case 'Game Resumed':
          return GameResumed
        case 'Game Paused':
        default:
          return GamePaused
      }
    },
    getComponentForChat() {
      switch (this.notification.title) {
        case 'Room Administrator':
          return RoomAdministrator
        case 'Added to Room':
        default:
          return AddedToRoom
      }
    }
  }
})
</script>

<style scoped></style>
