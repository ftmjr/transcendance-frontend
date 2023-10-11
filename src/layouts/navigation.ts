export default [
  {
    title: 'Tableau de bord',
    icon: { icon: 'tabler-smart-home' },
    to: 'dashboard'
  },
  {
    title: 'Partie rapide 🤖',
    icon: { icon: 'noto-v1:game-die' },
    to: 'game'
  },
  {
    title: 'Waiting Room',
    icon: { icon: 'medical-icon:i-waiting-area', color: 'green' },
    to: { name: 'game', query: { waitingRoom: true } }
  },
  {
    title: 'Trouver un joueur',
    icon: { icon: 'tabler-users-group', color: 'blue' },
    to: 'user-list'
  },
  {
    title: 'Leader Board',
    icon: { icon: 'solar:ranking-linear' },
    to: 'leaderboard'
  },
  { heading: 'Messagerie' },
  {
    title: 'Chat',
    icon: { icon: 'tabler-message' },
    to: 'chat'
  },
  {
    title: 'DM',
    icon: { icon: 'tabler-mail' },
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
