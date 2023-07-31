import { defineStore } from 'pinia'
import router from '@/router'
import type { AuthState, User, RegisterBody } from 'Auth'
import axios from 'axios'

const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => {
    const token = localStorage.getItem('__token__')
    const user = localStorage.getItem('__user__')
    return {
      token,
      user: user ? JSON.parse(user) : null,
      error: {
        state: false,
        message: ''
      }
    }
  },
  getters: {
    getToken(): string | null {
      return this.token
    },
    getUser(): User | null {
      return this.user
    }
  },
  actions: {
    async login(credentials: { username: string; password: string }): Promise<void> {
      try {
        const { data } = await axios.post('/api/auth/login', credentials, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const { token, user } = data
        localStorage.setItem('__token__', token)
        this.token = token
        localStorage.setItem('__user__', JSON.stringify(user))
        this.user = user

        router.push('/')
      } catch (error) {
        //
      }
    },
    async logout(): Promise<void> {
      try {
        localStorage.removeItem('__token__')
        localStorage.removeItem('__user__')
        this.token = null
        this.user = null

        await axios.get('/api/logout')

        router.push('/login')
      } catch (error) {
        this.error = {
          state: true,
          message: "Une erreur s'est produite lors de la déconnexion"
        }
      }
    },
    async register(userInfos: RegisterBody): Promise<void> {
      if (!userInfos || userInfos.password !== userInfos.passwordConfirmation) return

      const { passwordConfirmation, ...body } = userInfos

      console.log(body)

      try {
        const { data } = await axios.post('/api/auth/signup', body, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const { ...user } = data
        this.user = user
        router.push('/auth/two-factors')
      } catch (error: any) {
        this.error = {
          state: true,
          message: error.response.data.message
        }
        console.log(error.response.data.message)
      }
    }
  }
})

export default useAuthStore
