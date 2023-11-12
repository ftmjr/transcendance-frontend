<template>
  <div class="border-green-400/30 block cursor-pointer" @click="handleRead">
    <div
      v-if="isShort"
      :class="[
        'flex justify-between items-start gap-1 py-3 px-3 rounded-md gap-4',
        notification.status === 'READ' ? 'bg-[#343851]/30' : 'bg-green-600/30'
      ]"
    >
      <AvatarBadge :user-id="notification.referenceId" />
      <div class="flex justify-between">
        <div class="flex flex-col gap-2">
          <p class="text-left text-sm fomt-semiBold">
            {{ notification.title }}
          </p>
          <p class="text-xs text-gray-500 text-left">
            {{ notification.message }}
          </p>
        </div>
        <div class="flex flex-column justify-between items-center">
          <VTooltip v-if="notification.status === 'UNREAD'" bottom>
            <template #activator="{ props }">
              <VIcon color="pink" small v-bind="props"> ph-dot-duotone </VIcon>
            </template>
            <span>Non lue</span>
          </VTooltip>
          <VTooltip v-else bottom>
            <template #activator="{ props }">
              <VBtn variant="tonal" color="pink" :size="15" :icon="true" @click.stop="handleDelete">
                <VIcon color="pink" :size="10" v-bind="props"> tabler-x </VIcon>
              </VBtn>
            </template>
            <span>Supprimer</span>
          </VTooltip>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-rows gap-8">
      <AvatarBadge :user-id="notification.referenceId" />
      <div class="flex justify-between flex-1">
        <div class="flex flex-col gap-2">
          <p class="text-left text-sm fomt-semiBold">
            {{ notification.title }}
          </p>
          <p class="text-xs text-gray-500 text-left">
            {{ notification.message }}
          </p>
        </div>
        <div class="flex flex-column justify-between items-center">
          <VTooltip v-if="notification.status === 'UNREAD'" bottom>
            <template #activator="{ props }">
              <VIcon color="pink" small v-bind="props"> ph-dot-duotone </VIcon>
            </template>
            <span>Non lue</span>
          </VTooltip>
          <VTooltip v-else bottom>
            <template #activator="{ props }">
              <VBtn variant="tonal" color="pink" :size="15" :icon="true" @click.stop="handleDelete">
                <VIcon color="pink" :size="10" v-bind="props"> tabler-x </VIcon>
              </VBtn>
            </template>
            <span>Supprimer</span>
          </VTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useRouter } from 'vue-router'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import { Notification } from '@/utils/notificationSocket'
import useNotificationStore from '@/stores/NotificationStore'

// Friend request
// {
//   // userId: number, // current user, user receiving the notification
//   type: NotificationType.FRIEND_REQUEST,
//   title: `Demande d'amitié`,
//   message: message,
//   referenceId: sourceUserId,
// }

const { isShort, notification } = defineProps({
  notification: {
    type: Object as PropType<Notification>,
    required: true
  },
  isShort: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const notificationStore = useNotificationStore()
const handleDelete = (e: Event) => {
  e.preventDefault()
  notificationStore.deleteNotification(notification.id)
}

const handleRead = (e: Event) => {
  e.preventDefault()
  notificationStore.markNotificationAsRead(notification.id)
  router.push({
    name: 'user-profile',
    params: { userId: notification.referenceId }
  })
}
</script>

<style scoped></style>
