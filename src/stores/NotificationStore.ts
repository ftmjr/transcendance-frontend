import { defineStore } from 'pinia'
import { Notification, NotificationSocket } from '@/utils/notificationSocket'
import axios from '@/utils/axios'
import { NotificationType, NotificationStatus } from '@/utils/notificationSocket'

export interface NotificationState {
  notifications: Notification[]
  socketManager: NotificationSocket | null
}

const samples = [
  {
    type: NotificationType.GAME_INVITE,
    id: 45454,
    userId: 9,
    message: 'Veut jouer une partie avec vous',
    status: NotificationStatus.UNREAD,
    title: 'Game Invite',
    referenceId: 13,
    createdAt: 1699842634715,
    updatedAt: 1699842634715,
    expiresAt: 1699842634715
  },
  {
    type: NotificationType.GAME_INVITE,
    id: 45454,
    userId: 9,
    message: 'Veut jouer une partie avec vous',
    status: NotificationStatus.UNREAD,
    title: 'Game Invite',
    referenceId: 11,
    createdAt: 1699842634715,
    updatedAt: 1699842634715,
    expiresAt: 1699920000000
  },
   {
    type: NotificationType.GAME_INVITE,
    id: 45,
    userId: 9,
    message: 'Veut jouer une partie avec vous',
    status: NotificationStatus.READ,
    title: 'Game Invite',
    referenceId: 9,
    createdAt: 1699842634715,
    updatedAt: 1699842634715,
    expiresAt: 1699920000000
  }
]

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
        const { data } = await axios.get<Notification[]>('notifications/')
        this.notifications = [...samples, ...data]
      } catch (e) {
        console.error(e)
      }
    },
    async deleteNotification(notificationId: number) {
      try {
        await axios.delete<Notification>(`notifications/${notificationId}`)
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
        const { data } = await axios.post<Notification>(`notifications/${notificationId}`)
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
