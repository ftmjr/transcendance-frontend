<template>
  <div :class="notificationClass" @click="markAsRead">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <v-icon :class="iconClass">{{ iconType }}</v-icon>
        <strong class="ml-2">{{ notification.title }}</strong>
      </div>
      <span class="text-sm">{{ formattedDate }}</span>
    </div>
    <p class="mt-2">{{ notification.message }}</p>
    <div v-if="isExpiringSoon" class="mt-2 text-red-500 text-sm flex items-center">
      <v-icon small>mdi-alert-circle</v-icon> Expiring Soon
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {Notification, NotificationType, NotificationStatus } from "@/utils/notificationSocket";

export default defineComponent({
  props: {
    notification: {
      type: Object as PropType<Notification>,
      required: true,
    },
  },
  emits: ['markAsRead'],
  computed: {
    notificationClass(): object {
      return {
        'p-4 mb-4 border rounded cursor-pointer': true,
        'bg-gray-100': this.notification.status === NotificationStatus.UNREAD,
        'border-blue-400': this.notification.type === NotificationType.GAME_INVITE,
        'border-green-400': this.notification.type === NotificationType.FRIEND_REQUEST,
        'border-orange-400': this.notification.type === NotificationType.GAME_EVENT,
        'border-red-400': this.notification.type === NotificationType.PRIVATE_MESSAGE,
      };
    },
    iconType(): string {
      switch (this.notification.type) {
        case NotificationType.GAME_INVITE:
          return 'mdi-gamepad-variant';
        case NotificationType.FRIEND_REQUEST:
          return 'mdi-account-plus';
        case NotificationType.GAME_EVENT:
          return 'mdi-calendar';
        case NotificationType.PRIVATE_MESSAGE:
          return 'mdi-message';
        default:
          return 'mdi-information';
      }
    },
    iconClass(): object {
      return {
        'text-blue-400': this.notification.type === NotificationType.GAME_INVITE,
        'text-green-400': this.notification.type === NotificationType.FRIEND_REQUEST,
        'text-orange-400': this.notification.type === NotificationType.GAME_EVENT,
        'text-red-400': this.notification.type === NotificationType.PRIVATE_MESSAGE,
      };
    },
    formattedDate(): string {
      return new Date(this.notification.createdAt).toLocaleString('fr-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).replace(',', ' à');
    },
    isExpiringSoon(): boolean {
      const now = new Date();
      const expiresAt = new Date(this.notification.expiresAt);
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      return (expiresAt.getTime() - now.getTime()) < oneDay;
    },
  },
  methods: {
    markAsRead() {
      this.$emit('markAsRead', this.notification.id);
    },
  },
});
</script>

<style scoped>

</style>
