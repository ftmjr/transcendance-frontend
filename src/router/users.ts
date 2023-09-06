const usersRoutes = {
  path: 'users',
  children: [
    {
      path: '',
      name: 'user-list',
      component: () => import('@/views/User/UserList.vue'),
      meta: {
        requiresAuth: false,
        title: 'Liste des utilisateurs'
      }
    },
    {
      path: 'show/:userId/:tab?',
      name: 'user-profile',
      component: () => import('@/views/User/Show.vue'),
      props: true,
      meta: {
        requiresAuth: false,
        title: 'Voir Le Profil'
      }
    },
    {
      path: 'me/:tab?',
      name: 'me',
      component: () => import('@/views/User/Show.vue'),
      meta: {
        requiresAuth: false,
        title: 'Mon Profil'
      }
    }
  ]
}

export default usersRoutes
