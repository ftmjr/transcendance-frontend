import DashboardLayout from '@/layouts/DashboardLayout.vue'
import HomeView from '@/views/HomeView.vue'

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
      path: 'profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
        title: 'My Profile'
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
      path: 'settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Settings'
      }
    },
  ]
}

export default dashboardRoutes
