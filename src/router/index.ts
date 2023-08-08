import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useAuthStore from '@/stores/AuthStore'
import * as auth from "Auth";


const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth-state-2',
      name: 'auth-state-2',
      component: ()=> import("@/views/AuthStateTwoView.vue")
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/auth/two-factors',
      name: 'two-factors',
      component: () => import('../views/TwoFactorsView.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/reset-password',
      name: 'rest-password',
      component: ()=> import("@/views/ResetPasswordView.vue")
    },
    // ROUTE NOT FOUND REGEX
    {
      path: '/:catchALL(.*)', //regex to catch non existing routes
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  switch (to.name)
  {
    case "auth":
    case"auth-state-2":
      return next();
      break;
    default:
      if (!authStore.isAuthenticated)
        return next("/auth");
      else
        return next();
  }
})

export default router
