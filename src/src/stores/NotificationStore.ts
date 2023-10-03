import { defineStore } from 'pinia'
import { Notification, NotificationSocket } from '@/utils/notificationSocket'
import axios from '@/utils/axios'

export interface NotificationState {
  notifications: Notification[]
  socketManager: NotificationSocket | null
}

const useNotificationStore = defineStore({
  id: 'notification',
  state: (): NotificationState => {
    return {
      notifications: [],
      socketManager: null
    }
  },
  getters: {
    allNotifications(): Notification[] {
      return this.notifications
    },
    unreadNotifications(): Notification[] {
      return this.notifications.filter(
        (notification: Notification) => notification.status === 'UNREAD'
      )
    },
    unreadNotificationsCount(): number {
      return this.unreadNotifications.length
    },
    socketOperational(): boolean {
      return this.socketManager?.operational ?? false
    }
  },
  actions: {
    async init(userId: number) {
      await this.getNotifications()
      this.socketManager = new NotificationSocket(userId, (notification) => {
        this.notifications.unshift(notification)
      })
    },
    disconnect() {
      this.socketManager?.disconnect()
      this.socketManager = null
    },
    async getNotifications() {
      try {
        const { data } = await axios.get<Notification[]>('messages/notifications')
        this.notifications = data
      } catch (e) {
        console.error(e)
      }
    },
    async deleteNotification(notificationId: number) {
      try {
        await axios.delete<Notification>(`messages/notifications/${notificationId}`)
        const index = this.notifications.findIndex(
          (notification) => notification.id === notificationId
        )
        if (index === -1) return
        this.notifications.splice(index, 1)
      } catch (e) {
        console.error(e)
      }
    },
    async markNotificationAsRead(notificationId: number) {
      try {
        const { data } = await axios.post<Notification>(`messages/notifications/${notificationId}`)
        const index = this.notifications.findIndex(
          (notification) => notification.id === notificationId
        )
        if (index === -1) return
        this.notifications[index] = data
      } catch (e) {
        console.error(e)
      }
    }
  }
})

export default useNotificationStore
