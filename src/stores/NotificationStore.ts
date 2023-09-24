import { defineStore } from 'pinia'
import type { AxiosError } from 'axios'
import axios from '@/utils/axios'

interface NotificationState {}

const useNotificationStore = defineStore({
  id: 'notification',
  state: (): NotificationState => {},
  getters: {},
  actions: {}
})

export default useNotificationStore
