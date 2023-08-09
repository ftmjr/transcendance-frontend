import { defineStore } from 'pinia'
const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    filteredUsers: []
  }),
  actions: {
    async getPaginatedUsers(page: number) {
      // get all users
      console.log('getPaginatedUsers', page)
    }
  }
})

export default useUsersStore
