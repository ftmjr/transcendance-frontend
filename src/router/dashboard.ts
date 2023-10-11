import DashboardLayout from '@/layouts/DashboardLayout.vue'
import HomeView from '@/views/HomeView.vue'
import usersRoutes from '@/router/users'
import DirectMessagesView from '@/views/Dm/DirectMessagesView.vue'
import ChatWindowView from '@/views/Chat/ChatWindowView.vue'
import Notifications from '@/views/Notifications.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'
import { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw = {
  path: '/',
  component: DashboardLayout,
  children: [
    {
      path: '',
      name: 'dashboard',
      component: HomeView,
      meta: {
        requiresAuth: true,
        title: 'Dashboard'
      }
    },
    {
      path: 'game/:gameId?',
      name: 'game',
      component: () => import('@/views/GameView.vue'),
      props: (route) => {
        const waitingRoom = route.query.waitingRoom ? route.query.waitingRoom === 'true' : false
        const isPlayer = route.query.isPlayer ? route.query.isPlayer === 'true' : true
        const gameId = route.params.gameId ? parseInt(route.params.gameId.toString()) : undefined
        return {
          gameId,
          waitingRoom: waitingRoom,
          isPlayer: isPlayer
        }
      },
      meta: {
        requiresAuth: true,
        title: 'Game Test'
      }
    },
    {
      path: 'chat',
      name: 'chat',
      component: ChatWindowView,
      meta: {
        requiresAuth: true,
        title: 'Chat',
        layoutWrapperClasses: 'layout-content-height-fixed'
      }
    },
    {
      path: 'dm/:friendId?',
      name: 'dm',
      component: DirectMessagesView,
      props: (route) => {
        const friendId = route.params.friendId
          ? parseInt(route.params.friendId.toString())
          : undefined
        return {
          friendId
        }
      },
      meta: {
        requiresAuth: true,
        title: 'Mes Dm',
        layoutWrapperClasses: 'layout-content-height-fixed'
      }
    },
    {
      path: 'notifications',
      name: 'notifications',
      component: Notifications,
      meta: {
        requiresAuth: true,
        title: 'Vos notifications'
      }
    },
    {
      path: 'leaderboard',
      name: 'leaderboard',
      component: LeaderboardView,
      meta: {
        requiresAuth: true,
        title: 'Message'
      }
    },
    usersRoutes
  ]
}

export default dashboardRoutes
