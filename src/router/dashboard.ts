import DashboardLayout from '@/layouts/DashboardLayout.vue'
import HomeView from '@/views/HomeView.vue'
import usersRoutes from '@/router/users'
import DirectMessagesView from '@/views/Dm/DirectMessagesView.vue'
import ChatWindowView from '@/views/Chat/ChatWindowView.vue'
import Notifications from '@/views/User/Notifications.vue'

const dashboardRoutes = {
  path: '/',
  component: DashboardLayout,
  children: [
    {
      path: '',
      name: 'dashboard',
      component: HomeView,
      meta: {
        requiresAuth: true,
        title: 'Dashboard'
      }
    },
    {
      path: 'game',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Game Test'
      }
    },
    {
      path: 'chat',
      name: 'chat',
      component: ChatWindowView,
      meta: {
        requiresAuth: true,
        title: 'Chat'
      }
    },
    {
      path: 'dm',
      name: 'dm',
      component: DirectMessagesView,
      meta: {
        requiresAuth: true,
        title: 'Direct Messages'
      }
    },
    {
      path: 'notifications',
      name: 'notifications',
      component: Notifications,
      meta: {
        requiresAuth: true,
        title: 'Vos notifications'
      }
    },
    {
      path: 'leaderboard',
      name: 'leaderboard',
      component: () => import('@/views/LeaderboardView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Message'
      }
    },
    usersRoutes
  ]
}

export default dashboardRoutes
