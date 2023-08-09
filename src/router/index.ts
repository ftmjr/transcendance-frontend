import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '@/stores/AuthStore'
import dashboardRoutes from '@/router/dashboard'
import authRoutes from '@/router/auth'

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    dashboardRoutes,
    authRoutes,
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
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuth = authStore.isAuthenticated
  if (requiresAuth && !isAuth) {
    console.log('not authenticated')
    next({ name: 'auth' })
  } else {
    console.log('no auth required')
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
