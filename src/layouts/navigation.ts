export default [
  {
    title: 'Dashboards',
    icon: { icon: 'tabler-smart-home' },
    to: 'dashboard'
  },
  {
    title: 'Jouer',
    icon: { icon: 'tabler-game' },
    to: 'game'
  },
  {
    title: 'Leader Board',
    icon: { icon: 'board' },
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
  {
    title: 'Profile',
    icon: { icon: 'tabler-user' },
    children: [
      { title: 'Réglages', to: 'settings' },
      { title: 'Historique', to: { name: 'history' } }
    ]
  }
]
