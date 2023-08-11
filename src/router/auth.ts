import AuthLayout from '@/layouts/AuthLayout.vue'

const authRoutes = {
  path: '/auth',
  component: AuthLayout,
  children: [
    {
      path: '',
      name: 'auth',
      component: () => import('@/views/Auth/AuthView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Authentification'
      }
    },
    {
      path: 'reset-password',
      name: 'reset-password',
      component: () => import('@/views/Auth/ResetPasswordView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Reset Password'
      }
    },
    {
      path: 'two-factors',
      name: 'two-factors',
      component: () => import('@/views/Auth/TwoFactorsView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Two Factors'
      }
    },
    {
      path: 'oauth-auth',
      name: 'oauth-auth',
      component: () => import('@/views/Auth/OAuthState.vue'),
      meta: {
        requiresAuth: false,
        title: 'OAuth Auth'
      }
    }
  ]
}
export default authRoutes
