import DashboardLayout from '@/layouts/DashboardLayout.vue'
import HomeView from '@/views/HomeView.vue'
import usersRoutes from '@/router/users'

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
      component: () => import('@/views/Chat/ChatWindowView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Chat'
      }
    },
    {
      path: 'dm',
      name: 'dm',
      component: () => import('@/views/Dm/DirectMessagesView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Direct Messages'
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
