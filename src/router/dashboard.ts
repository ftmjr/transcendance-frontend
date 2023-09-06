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
        requiresAuth: false,
        title: 'Dashboard'
      }
    },
    {
      path: 'profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
        title: 'My User'
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
      component: () => import('@/views/ChatView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Chat'
      }
    },
    {
      path: 'dm',
      name: 'dm',
      component: () => import('@/views/DmView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Dm'
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
    {
      path: 'settings/:tab',
      name: 'settings',
      component: () => import('@/views/User/Settings.vue'),
      meta: {
        requiresAuth: false,
        title: 'Settings'
      }
    },
    usersRoutes
  ]
}

export default dashboardRoutes
