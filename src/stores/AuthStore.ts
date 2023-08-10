import { defineStore } from 'pinia'
import type { AuthState, User, RegisterBody, ILoginData } from 'Auth'
import type { AxiosError } from 'axios'
import axios from '@/utils/axios'

const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => {
    const token = localStorage.getItem('__token__')
    const user = JSON.parse(localStorage.getItem('__user__') ?? 'null') as User | null
    return {
      token,
      user,
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
    },
    isAuthenticated(): boolean {
      return !!this.token
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('__token__', token)
    },
    setUser(user: User) {
      this.user = user
      localStorage.setItem('__user__', JSON.stringify(user))
    },
    setError(error: { state: boolean; message: string }) {
      this.error = error
    },
    removeToken() {
      localStorage.removeItem('__token__')
      this.token = null
    },
    removeUser() {
      this.user = null
      localStorage.removeItem('__user__')
    },
    async fetchUser(): Promise<boolean> {
      try {
        const { data } = await axios.get('auth/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        this.setUser(data)
        return true
      } catch (e: unknown) {
        this.removeToken()
        this.removeUser()
        return false
      }
    },
    async login(credentials: { username: string; password: string }): Promise<boolean> {
      try {
        const { data } = await axios.post('auth/login', credentials, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const { accessToken, user } = data as ILoginData
        this.setUser(user)
        this.setToken(accessToken)
        this.setError({ state: false, message: '' })
        return true
      } catch (error: AxiosError | any) {
        if (error.response && error.response.status === 401) {
          this.setError({ state: true, message: error.response.data.message })
          return false
        }
      }
    },
    async logout(): Promise<boolean> {
      try {
        this.removeToken()
        this.removeUser()
        await axios.get('auth/logout')
        return true
      } catch (error: AxiosError | any) {
        this.setError({ state: true, message: error.response.data.message })
        return false
      }
    },
    async register(userInfos: RegisterBody): Promise<boolean> {
      if (!userInfos || userInfos.password !== userInfos.passwordConfirmation) return false
      const { passwordConfirmation, ...body } = userInfos
      try {
        const { data } = await axios.post('auth/signup', body, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const { accessToken, user } = data as ILoginData
        this.setUser(user)
        this.setToken(accessToken)
        this.setError({ state: false, message: '' })
        this.setError({ state: false, message: '' })
        return true
      } catch (error: AxiosError | any) {
        if (error.response && error.response.status === 403) {
          // get the backend error msg
          this.setError({ state: true, message: error.response.data.message })
        }
        return false
      }
    }
  }
})

export default useAuthStore
