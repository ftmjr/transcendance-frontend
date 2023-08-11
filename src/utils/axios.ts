import axios from 'axios'
import useAuthStore from '@/stores/AuthStore'

// Create an Axios instance if you wish or use the default axios object
const axiosInstance = axios.create({
  baseURL: '/api'
  // other config here
})

let isRefreshing = false
// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore()
    if (authStore.token && !authStore.isExpired) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`
      isRefreshing = false
    } else if (authStore.isExpired) {
      if (!isRefreshing) {
        const token = await authStore.refreshToken()
        config.headers['Authorization'] = `Bearer ${token}`
        isRefreshing = true
      }
    }
    return config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error)
  }
)

export default axiosInstance
