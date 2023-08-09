import { RouteRecordRaw } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'

const authRoutes: RouteRecordRaw = {
  path: '/auth',
  component: AuthLayout,
  children: [
    {
      path: '',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Authentification'
      }
    },
    {
      path: 'reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPasswordView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Reset Password'
      }
    },
    {
      path: 'two-factors',
      name: 'two-factors',
      component: () => import('@/views/TwoFactorsView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Two Factors'
      }
    },
    {
      path: 'auth-state-2',
      name: 'auth-state-2',
      component: () => import('@/views/AuthStateTwoView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Auth State 2'
      }
    }
  ]
}
export default authRoutes
