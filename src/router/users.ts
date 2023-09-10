import Settings from '@/views/user/Settings.vue'

const usersRoutes = {
  path: 'users',
  children: [
    {
      path: '',
      name: 'user-list',
      component: () => import('@/views/User/UserList.vue'),
      meta: {
        requiresAuth: true,
        title: 'Liste des utilisateurs'
      }
    },
    {
      path: 'me/:tab?',
      name: 'me',
      component: () => import('@/views/User/Show.vue'),
      meta: {
        requiresAuth: true,
        title: 'Mon Profil'
      }
    },
    {
      path: 'show/:userId/:tab?',
      name: 'user-profile',
      component: () => import('@/views/User/Show.vue'),
      props: true,
      meta: {
        requiresAuth: true,
        title: 'Voir Le Profil'
      }
    },
    {
      path: 'settings/:tab',
      name: 'settings',
      component: Settings,
      meta: {
        requiresAuth: true,
        title: 'Réglages'
      }
    }
  ]
}

export default usersRoutes
