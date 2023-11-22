<template>
  <component
    :is="component"
    :notification="notification"
    :is-short="isShort"
    @mark-as-read="$emit('markAsRead', notification.id)"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Notification, NotificationTitle, NotificationType } from "@/utils/notificationSocket";
import FriendRequest from "@/components/notifications/friend/FriendRequest.vue";
import FriendRequestAccepted from "@/components/notifications/friend/FriendRequestAccepted.vue";
import FriendRequestRejected from "@/components/notifications/friend/FriendRequestRejected.vue";

export default defineComponent({
  components: {
    // List all components that can be used in notifications
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
        case NotificationTitle.FriendRequest:
          return FriendRequest;
        case NotificationTitle.FriendRequestAccepted:
          return FriendRequestAccepted;
        case NotificationTitle.FriendRequestRejected:
          return FriendRequestRejected;
        default:
          return null
      }
    },
    getComponentForGameInvitation() {
      switch (this.notification.title) {
        case NotificationTitle.GameInvitation:
          return GameInvitation;
        case NotificationTitle.GameInvitationRejected:
          return GameInvitationRejected;
        default:
          return null
      }
    },
    getComponentForGameEvent() {
      switch (this.notification.title) {
        case NotificationTitle.JoinedGame:
          return JoinedGame;
        default:
          return null
      }
    },
    getComponentForChat() {
      switch (this.notification.title) {
        case NotificationTitle.PrivateChatInvitation:
          return PrivateChatInvitation;
        case NotificationTitle.MemberJoinedChatRoom:
          return MemberJoinedChatRoom;
        case NotificationTitle.RemovedFromChatRoom:
          return RemovedFromChatRoom;
        case NotificationTitle.PromotedToAdmin:
          return PromotedToAdmin;
        default:
          return null
      }
    }
  }
})
</script>

<style scoped></style>
