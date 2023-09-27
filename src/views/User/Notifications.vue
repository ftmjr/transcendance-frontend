<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Notifications</VCardTitle>
      <p class="text-sm mt-2 mb-0">
        Vous pouvez gérer les notifications de votre compte., y compris les notifications de jeu, les demandes d'amis, les événements de jeu et les messages privés.
        <br /> Vous avez {{ notificationStore.unreadNotificationsCount }} nouvelles notifications.
      </p>
    </VCardItem>
    <VCardText>
      <VTable class="text-no-wrap rounded border bg-surface">
        <thead>
          <tr>
            <th scope="col">
              Notification
            </th>
            <th scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="notification in notificationStore.allNotifications" :key="notification.id">
            <td>
              <Notification :notification="notification" @markAsRead="markAsRead" />
            </td>
            <td>
              <VBtn icon small @click="markAsRead(notification.id)">
                <VIcon icon="tabler-check" />
              </VBtn>
              <VBtn icon small @click="deleteNotification(notification.id)">
                <VIcon icon="tabler-" />
              </VBtn>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import useNotificationStore from "@/stores/NotificationStore";
import Notification from "@/components/Notification.vue";

export default defineComponent({
  components: {Notification},
  setup() {
    const notificationStore = useNotificationStore();
    return {
      notificationStore
    }
  },
  data() {
    return {}
  },
  methods: {
    markAsRead(notificationId: number) {
      this.notificationStore.markNotificationAsRead(notificationId);
    },
    deleteNotification(notificationId: number) {
      this.notificationStore.deleteNotification(notificationId);
    },
    openNotification() {
      // to do: implement, open the notification in a modal or the appropriate page
    },
    readAllNotifications() {
      // TODO: Implement
    },
  }
})
</script>

<style scoped>

</style>
