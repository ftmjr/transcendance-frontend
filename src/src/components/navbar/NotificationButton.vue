<template>
  <VBtn icon variant="text" color="default" class="mx-1">
    <VBadge
      :color="notificationStore.unreadNotificationsCount > 0 ? 'red' : 'secondary'"
      :content="notificationStore.unreadNotificationsCount"
    >
      <VIcon icon="tabler-bell" size="24" />
    </VBadge>
    <VMenu activator="parent" width="380px" location="bottom end" offset="14px">
      <VList class="py-0">
        <VListItem title="Notifications" height="48px">
          <template #append>
            <VChip color="primary" size="small">
              {{ notificationStore.unreadNotificationsCount }} notifications non lues
            </VChip>
          </template>
        </VListItem>
        <VDivider />
        <template v-if="notificationStore.unreadNotificationsCount > 0">
          <VListItem
            v-for="notification in notificationStore.unreadNotifications"
            :key="notification.id"
          >
            <Notification :notification="notification" @markAsRead="markAsRead" />
          </VListItem>
        </template>
        <VListItem v-else>
          <div class="flex justify-center items-center">
            <span class="text-gray-400">Aucune notification</span>
          </div>
        </VListItem>
        <VDivider />
        <VListItem class="p-2">
          <VBtn block @click="readAllNotifications"> VOIR TOUTES LES NOTIFICATIONS </VBtn>
        </VListItem>
      </VList>
    </VMenu>
  </VBtn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useNotificationStore from '@/stores/NotificationStore'
import Notification from '@/components/notifications/Notification.vue'

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
    },
    readAllNotifications() {
      this.$router.push({ name: 'notifications' })
    }
  }
})
</script>

<style scoped></style>
