import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useAuthStore from '@/stores/AuthStore'
import * as auth from 'Auth'

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth-state-2',
      name: 'auth-state-2',
      component: () => import('@/views/AuthStateTwoView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Auth State 2'
      }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
        title: 'Home'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
        title: 'My Profile'
      }
    },
    {
      path: '/auth/two-factors',
      name: 'two-factors',
      component: () => import('@/views/TwoFactorsView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Two Factors'
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Authentification'
      }
    },
    {
      path: '/reset-password',
      name: 'rest-password',
      component: () => import('@/views/ResetPasswordView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Reset Password'
      }
    },
    // ROUTE NOT FOUND REGEX
    {
      path: '/:catchALL(.*)', //regex to catch non existing routes
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Not Found'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record?.meta.requiresAuth ?? false)
  const isAuth = authStore.isAuthenticated
  if (requiresAuth && !isAuth) {
    next({ name: 'auth' })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (to?.meta?.title) {
    let title = 'Transcendence'
    title = `${to.meta.title} | ${title}`
    document.title = title
  }
})

export default router
