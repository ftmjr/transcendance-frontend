export default [
  {
    title: 'Tableau de bord',
    icon: { icon: 'tabler-smart-home' },
    to: 'dashboard'
  },
  {
    title: 'Partie rapide',
    icon: { icon: 'noto-v1:game-die' },
    to: 'game'
  },
  {
    title: 'Leader Board',
    icon: { icon: 'solar:ranking-linear' },
    to: 'game'
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
      { title: 'Réglages', to: 'settings' },
      { title: 'Historique', to: { name: 'history' } }
    ]
  }
]
