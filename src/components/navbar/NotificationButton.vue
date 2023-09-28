<template>
  <VBtn icon variant="text" color="default" class="mx-1">
    <VBadge color="info" content="4">
      <VIcon icon="tabler-bell" size="24" />
    </VBadge>
    <VMenu activator="parent" width="380px" location="bottom end" offset="14px">
      <VList class="py-0">
        <VListItem title="Notifications" height="48px">
          <template #append>
            <VChip
              v-if="notificationStore.unreadNotificationsCount > 0"
              color="primary"
              size="small"
            >
              {{ notificationStore.unreadNotificationsCount }} nouvelles notifications
            </VChip>
          </template>
        </VListItem>
        <VDivider />
        <template
          v-for="notification in notificationStore.unreadNotifications"
          :key="notification.id"
        >
          <Notification :notification="notification" @markAsRead="markAsRead" />
        </template>
      </VList>
    </VMenu>
  </VBtn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useNotificationStore from '@/stores/NotificationStore'
import Notification from '@/components/Notification.vue'

export default defineComponent({
  components: { Notification },
  setup() {
    const notificationStore = useNotificationStore()
    return {
      notificationStore
    }
  },
  data() {
    return {}
  },
  methods: {
    markAsRead(notificationId: number) {
      this.notificationStore.markNotificationAsRead(notificationId)
    },
    deleteNotification(notificationId: number) {
      this.notificationStore.deleteNotification(notificationId)
    }
  }
})
</script>

<style scoped></style>
