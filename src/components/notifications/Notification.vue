<template>
  <div :class="notificationClass" @click="markAsRead">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <v-icon :class="iconClass">{{ iconType }}</v-icon>
        <strong class="ml-2">{{ translatedTitle }}</strong>
      </div>
      <div>
        <VIcon v-if="notification.status === 'UNREAD'" color="primary" small
          >tabler-circle-dot</VIcon
        >
        <VIcon v-else small color="primary">tabler-circle</VIcon>
      </div>
    </div>
    <div class="flex">
      <div>
        <p class="mt-2">{{ notification.message }}</p>
        <div v-if="isExpiringSoon" class="mt-2 text-red-500 text-sm flex items-center">
          <v-icon small>mdi-alert-circle</v-icon> Expire bientôt
        </div>
      </div>
    </div>
    <div>
      <VBtn
        v-if="showPlayButton"
        color="primary"
        @click.stop="handlePlay(notification.referenceId)"
      >
        Commencer
        <VIcon>mdi-sword-cross</VIcon>
      </VBtn>
      <VBtnGroup v-if="showAcceptRejectButtons" size="small">
        <VBtn
          @click.stop="handleAccept(notification.referenceId)"
          size="small"
          variant="outlined"
          color="success"
        >
          Accepter <VIcon>tabler-check</VIcon>
        </VBtn>
        <VBtn
          @click.stop="handleReject(notification.referenceId)"
          size="small"
          variant="outlined"
          color="error"
        >
          Refuser
        </VBtn>
      </VBtnGroup>
    </div>
    <div class="flex items-center justify-end">
      <VIcon small>tabler-calendar-event</VIcon>
      <span class="text-sm">{{ formattedDate }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Notification, NotificationType, NotificationStatus } from '@/utils/notificationSocket'
import useGameStore from '@/stores/GameStore'
import useUserStore from '@/stores/UserStore'

const notificationTranslations = [
  {
    type: 'GAME_INVITE',
    translations: {
      'Game Invite': 'Invitation de jeu',
      'Challenge Accepted': 'Défi accepté'
    }
  },
  {
    type: 'FRIEND_REQUEST',
    translations: {
      'Friend Request': 'Demande d’ami',
      'Friend Request Accepted': 'Demande d’ami acceptée',
      'Friend Request Rejected': 'Demande d’ami rejetée'
    }
  },
  {
    type: 'PRIVATE_MESSAGE',
    translations: {
      'Added to Chat': 'Ajouté au chat'
    }
  }
]
export default defineComponent({
  props: {
    notification: {
      type: Object as PropType<Notification>,
      required: true
    }
  },
  setup() {
    const gameStore = useGameStore()
    const userStore = useUserStore()
    return {
      gameStore,
      userStore
    }
  },
  emits: ['markAsRead'],
  computed: {
    notificationClass(): object {
      return {
        'p-4 mb-4 border-2 rounded cursor-pointer': true,
        'bg-gray-100/10': this.notification.status === NotificationStatus.UNREAD,
        'border-blue-400': this.notification.type === NotificationType.GAME_INVITE,
        'border-green-400/30': this.notification.type === NotificationType.FRIEND_REQUEST,
        'border-orange-400/10': this.notification.type === NotificationType.GAME_EVENT,
        'border-red-400': this.notification.type === NotificationType.PRIVATE_MESSAGE
      }
    },
    iconType(): string {
      switch (this.notification.type) {
        case NotificationType.GAME_INVITE:
          return 'tabler-device-gamepad'
        case NotificationType.FRIEND_REQUEST:
          return 'tabler-user-plus'
        case NotificationType.GAME_EVENT:
          return 'tabler-calendar-event'
        case NotificationType.PRIVATE_MESSAGE:
          return 'tabler-message-bolt'
        default:
          return 'tabler-info-square-rounded'
      }
    },
    iconClass(): object {
      return {
        'text-blue-400': this.notification.type === NotificationType.GAME_INVITE,
        'text-green-400': this.notification.type === NotificationType.FRIEND_REQUEST,
        'text-orange-400': this.notification.type === NotificationType.GAME_EVENT,
        'text-red-400': this.notification.type === NotificationType.PRIVATE_MESSAGE
      }
    },
    formattedDate(): string {
      return new Date(this.notification.createdAt)
        .toLocaleString('fr-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })
        .replace(',', ' à')
    },
    isExpiringSoon(): boolean {
      if (!this.notification.expiresAt) return false
      const now = new Date()
      const expiresAt = new Date(this.notification.expiresAt)
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      return expiresAt.getTime() - now.getTime() < oneDay
    },
    translatedTitle(): string {
      const notification = notificationTranslations.find((n) => n.type === this.notification.type)
      return notification
        ? notification.translations[this.notification.title]
        : this.notification.title
    },
    showPlayButton(): boolean {
      const isCorrectType =
        this.notification.type === NotificationType.GAME_INVITE &&
        this.notification.title === 'Challenge Accepted'
      const isExpired =
        this.notification.expiresAt && new Date(this.notification.expiresAt) < new Date()
      return isCorrectType && !isExpired
    },
    showAcceptRejectButtons(): boolean {
      const isCorrectType =
        (this.notification.type === NotificationType.GAME_INVITE &&
          this.notification.title === 'Game Invite') ||
        (this.notification.type === NotificationType.FRIEND_REQUEST &&
          this.notification.title === 'Friend Request')
      const isExpired =
        this.notification.expiresAt && new Date(this.notification.expiresAt) < new Date()
      const isAlreadyResponded = this.notification.status !== NotificationStatus.UNREAD
      return isCorrectType && !isExpired && !isAlreadyResponded
    }
  },
  methods: {
    markAsRead() {
      this.$emit('markAsRead', this.notification.id)
    },
    async handlePlay(gameId: number) {
      if (this.notification.type === NotificationType.GAME_INVITE) {
        this.$router.push({
          name: 'game',
          params: { gameId: gameId, isPlayer: true, theme: 'Arcade' }
        })
      }
    },
    async handleAccept(referenceId: number) {
      this.$emit('markAsRead', this.notification.id)
      if (this.notification.type === NotificationType.GAME_INVITE) {
        const r = await this.gameStore.acceptGameInvitation(referenceId)
        if (r === 'preparing') {
          this.$router.push({
            name: 'game',
            params: { gameId: referenceId, isPlayer: true, theme: 'Arcade' }
          })
        }
      } else if (this.notification.type === NotificationType.FRIEND_REQUEST) {
        await this.userStore.approveFriendRequest(referenceId)
      }
    },
    async handleReject(referenceId: number) {
      this.$emit('markAsRead', this.notification.id)
      if (this.notification.type === NotificationType.GAME_INVITE) {
        await this.gameStore.refuseGameInvitation(referenceId)
      } else if (this.notification.type === NotificationType.FRIEND_REQUEST) {
        await this.userStore.rejectFriendRequest(referenceId)
      }
    }
  }
})
</script>

<style scoped></style>
