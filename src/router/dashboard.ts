import DashboardLayout from '@/layouts/DashboardLayout.vue'
import HomeView from '@/views/HomeView.vue'
import usersRoutes from '@/router/users'
import DirectMessagesView from '@/views/Dm/DirectMessagesMainView.vue'
import ChatWindowView from '@/views/Chat/ChatWindowView.vue'
import Notifications from '@/views/Notifications.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'
import { RouteRecordRaw } from 'vue-router'
import GameView from '@/views/GameView.vue'

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
      path: 'bot-game/:gameId?',
      name: 'bot-game',
      component: GameView,
      props: (route) => {
        const gameId = route.params.gameId ? parseInt(route.params.gameId.toString()) : undefined
        return {
          gameId,
          waitingRoom: false,
          isPlayer: true
        }
      },
      meta: {
        requiresAuth: true,
        layoutWrapperClasses: 'layout-content-height-fixed',
        title: 'Bot Game'
      }
    },
    {
      path: 'waiting-room/:gameId?',
      name: 'waiting-room',
      component: GameView,
      props: (route) => {
        const gameId = route.params.gameId ? parseInt(route.params.gameId.toString()) : undefined
        return {
          gameId,
          waitingRoom: true,
          isPlayer: true
        }
      },
      meta: {
        requiresAuth: true,
        layoutWrapperClasses: 'layout-content-height-fixed',
        title: 'Waiting Room'
      }
    },
    {
      path: 'game/:gameId?',
      name: 'game',
      component: GameView,
      props: (route) => {
        const waitingRoom = route.query.waitingRoom ? route.query.waitingRoom == 'true' : false
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
        layoutWrapperClasses: 'layout-content-height-fixed',
        title: 'Pong'
      }
    },
    {
      path: 'chat/:roomId?',
      name: 'chat',
      component: ChatWindowView,
      props: (route) => {
        const roomId = route.params.roomId ? parseInt(route.params.roomId.toString()) : undefined
        return {
          roomId
        }
      },
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
        title: 'LeaderBoard'
      }
    },
    usersRoutes
  ]
}

export default dashboardRoutes
