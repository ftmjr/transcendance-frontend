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
      component: HomeView
    },
    {
      path: '/auth/two-factors',
      name: 'two-factors',
      component: () => import('@/views/TwoFactorsView.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue')
    },
    {
      path: '/reset-password',
      name: 'rest-password',
      component: () => import('@/views/ResetPasswordView.vue')
    },
    {
      path: '/auth-state-2',
      name: 'auth-query-extractor',
      component: () => import('@/views/AuthStateTwoView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  return next()
})

export default router
