import axios from 'axios'
import useAuthStore from '@/stores/AuthStore'

const authStore = useAuthStore()

// Create an Axios instance if you wish or use the default axios object
const axiosInstance = axios.create({
  baseURL: '/api'
  // other config here
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authStore.token
    // If the token exists, set it in the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error)
  }
)

export default axiosInstance
