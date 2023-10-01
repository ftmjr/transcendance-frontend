import Settings from '@/views/user/Settings.vue'
import UserList from '@/views/User/UserList.vue'
import UserShowView from '@/views/user/Show.vue'

const usersRoutes = {
  path: 'users',
  children: [
    {
      path: '',
      name: 'user-list',
      component: UserList,
      meta: {
        requiresAuth: true,
        title: 'Liste des utilisateurs'
      }
    },
    {
      path: 'me/:tab?',
      name: 'me',
      component: UserShowView,
      meta: {
        requiresAuth: true,
        title: 'Mon Profil'
      }
    },
    {
      path: 'show/:userId/:tab?',
      name: 'user-profile',
      component: UserShowView,
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
