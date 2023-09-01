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
        title: 'My Profile'
      },
      children: [
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue'),
          meta: {
            requiresAuth: true,
            title: 'Settings'
          },
        },
        {
            path: 'history',
            name: 'history',
            component: () => import('@/views/HistoryView.vue'),
            meta: {
              requiresAuth: true,
              title: 'Player game History'
            }
        }
      ],
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
  ]
}

export default dashboardRoutes
