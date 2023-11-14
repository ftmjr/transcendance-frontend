import { VerticalNavItems } from '@layouts/types'

const navItems: VerticalNavItems = [
  {
    title: 'Tableau de bord',
    icon: { icon: 'tabler-smart-home' },
    to: 'dashboard'
  },
  {
    title: 'Play solo 🤖',
    icon: { icon: 'noto-v1:game-die' },
    to: 'bot-game'
  },
  {
    title: 'Waiting Room',
    icon: { icon: 'medical-icon:i-waiting-area', color: 'green' },
    to: { name: 'waiting-room' }
  },
  {
    title: 'Trouver un joueur',
    icon: { icon: 'tabler-users-group', color: 'blue' },
    to: 'user-list'
  },
  {
    title: 'Leaderboard',
    icon: { icon: 'solar:ranking-linear', color: 'yellow' },
    to: 'leaderboard'
  },
  { heading: 'Conversation' },
  {
    title: 'Chatrooms',
    icon: { icon: 'tabler-message' },
    to: 'chat'
  },
  {
    title: 'DMs',
    icon: { icon: 'tabler-mail' },
    badgeContent: '2',
    badgeClass: 'bg-light-primary text-primary',
    to: 'dm'
  },
  { heading: 'Info' },
  {
    title: 'Profile',
    icon: { icon: 'tabler-user' },
    children: [
      { title: 'Mon profile', to: { name: 'me', params: { tab: 'profile' } } },
      { title: 'Réglages', to: { name: 'settings', params: { tab: 'account' } } },
      { title: 'Historique', to: { name: 'me', params: { tab: 'history' } } }
    ]
  }
]
export default navItems
