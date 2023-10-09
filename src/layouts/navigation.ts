export default [
  {
    title: 'Dashboard',
    icon: { icon: 'tabler-smart-home' },
    to: 'dashboard'
  },
  {
    title: 'Quick Game',
    icon: { icon: 'noto-v1:game-die' },
    to: 'game'
  },
  {
    title: 'Find a Player',
    icon: { icon: 'tabler-users-group', color: 'blue' },
    to: 'user-list'
  },
  {
    title: 'Leaderboard',
    icon: { icon: 'solar:ranking-linear' },
    to: 'leaderboard'
  },
  { heading: 'Conversation' },
  {
    title: 'Chatroom',
    icon: { icon: 'tabler-message' },
    to: 'chat'
  },
  {
    title: 'DMs',
    icon: { icon: 'tabler-mail' },
    to: 'dm'
  },
  { heading: 'Info' },
  {
    title: 'Profile',
    icon: { icon: 'tabler-user' },
    children: [
      { title: 'View my profile', to: { name: 'me', params: { tab: 'profile' } } },
      { title: 'Settings', to: { name: 'settings', params: { tab: 'account' } } },
      { title: 'Historics', to: { name: 'me', params: { tab: 'history' } } }
    ]
  }
]
