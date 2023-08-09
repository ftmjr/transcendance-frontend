import { defineStore } from 'pinia'

const useGlobalStore = defineStore({
  id: 'global',
  state: () => {
    return {
      isLoading: false
    }
  }
})

export default useGlobalStore
