import { defineStore } from 'pinia'
import router from '@/router'
import type { AuthState, User, RegisterBody } from 'Auth'

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
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...credentials
          })
        })
        const { token, user } = await response.json()
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
      localStorage.removeItem('__token__')
      localStorage.removeItem('__user__')
      this.token = null
      this.user = null

      const response = fetch('/api/logout', {
        method: 'POST'
      })

      router.push('/login')
    },
    async register(body: RegisterBody): Promise<void> {
      if (!body) return

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
      } catch (error) {
        //
      }
    }
  }
})

export default useAuthStore
