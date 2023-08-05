import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// import useAuthStore from '@/stores/AuthStore'

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Transcendance - Home',
        requiresAuth: false,
      }
    },
    {
      path: '/auth/two-factors',
      name: 'two-factors',
      component: () => import('@/views/TwoFactorsView.vue'),
      meta: {
        title: 'Verify your identity',
        requiresAuth: true,
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: {
        title: 'Authentication',
        requiresAuth: false,
      }
    },
    {
      path: '/reset-password',
      name: 'rest-password',
      component: () => import('@/views/ResetPasswordView.vue'),
      meta: {
        title: 'Reset your password',
        requiresAuth: false,
      }
    },
    {
      path: '/auth-state-2',
      name: 'auth-query-extractor',
      component: () => import('@/views/AuthStateTwoView.vue'),
      meta: {
        title: 'Authentication',
        requiresAuth: false,
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  return next()
})

export default router
