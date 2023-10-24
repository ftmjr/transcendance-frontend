<template>
  <div class="border-green-400/30" @click="handleRead">
    <div v-if="isShort" class="flex justify-between items-start gap-1">
      <AvatarBadge :user-id="notification.referenceId" />
      <div class="flex justify-between">
        <div>
          <p class="text-center text-sm font-weight-semibold">{{ notification.title }}</p>
          <p class="text-sm text-center">{{ notification.message }}</p>
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
              <VBtn
                variant="tonal"
                color="pink"
                :size="15"
                :icon="true"
                @click.stop="handleDelete"
              >
                <VIcon color="pink" :size="10" v-bind="props"> tabler-x </VIcon>
              </VBtn>
            </template>
            <span>Supprimer</span>
          </VTooltip>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Big version here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import { Notification } from '@/utils/notificationSocket'
import useNotificationStore from '@/stores/NotificationStore'
defineProps({
  notification: {
    type: Object as PropType<Notification>,
    required: true
  },
  isShort: {
    type: Boolean,
    default: false
  }
})

const notificationStore = useNotificationStore()
const handleDelete = () => {
  console.log('delete')
}

const handleRead = () => {
  console.log('try to set to read')
}
</script>

<style scoped></style>
