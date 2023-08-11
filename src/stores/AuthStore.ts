import { defineStore } from 'pinia'
import router from '@/router'
import type { AuthState, User, RegisterBody, ILoginData } from 'Auth'
import type { AxiosError } from 'axios'
import axios from '@/utils/axios'

const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => {
    const token = localStorage.getItem('__token__')
    const expiry = localStorage.getItem('__tokenExpiry__')
    const tokenExpiry: number = expiry ? parseInt(expiry) : 0
    const user = JSON.parse(localStorage.getItem('__user__') ?? 'null') as User | null
    return {
      token,
      tokenExpiry,
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
    isExpired(): boolean {
      return Date.now() > this.tokenExpiry
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
      this.tokenExpiry = JSON.parse(atob(token.split('.')[1])).exp * 1000
      localStorage.setItem('__tokenExpiry__', this.tokenExpiry.toString())
      this.scheduleTokenRefresh()
    },
    scheduleTokenRefresh() {
      const refreshAt = this.tokenExpiry - 30 * 1000
      const delay = refreshAt - Date.now()
      if (delay > 0) {
        // console.log('scheduling token refresh', delay)
        setTimeout(() => {
          this.refreshToken()
        }, delay)
      }
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
      localStorage.removeItem('__tokenExpiry__')
      this.token = null
    },
    removeUser() {
      this.user = null
      localStorage.removeItem('__user__')
    },
    async fetchUser(): Promise<boolean> {
      try {
        const { data } = await axios.get('auth/me')
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
    async logout() {
      try {
        await axios.get('auth/logout')
      } catch (error: AxiosError | any) {
        this.setError({ state: true, message: error.response.data.message })
      }
      this.removeToken()
      this.removeUser()
      await router.push({ name: 'auth' })
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
        return true
      } catch (error: AxiosError | any) {
        if (error.response && error.response.status === 403) {
          // get the backend error msg
          this.setError({ state: true, message: error.response.data.message })
        }
        return false
      }
    },
    async refreshToken(): Promise<string | null> {
      try {
        if (!this.token) return null
        const { data } = await axios.get('/auth/refresh', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const { accessToken } = data as { accessToken: string }
        this.setToken(accessToken)
        this.setError({ state: false, message: '' })
        return accessToken
      } catch (error: AxiosError | any) {
        if (error.response && error.response.status === 401) {
          await this.logout()
          this.setError({ state: true, message: error.response.data.message })
        } else {
          this.setError({ state: true, message: 'Failed to refresh token' })
        }
        return null
      }
    },
    // first usage
    async generate2FAQrCode(): Promise<string | null> {
      try {
        const { data } = await axios.post('auth/2fa/generate')
        return data.qrCode
      } catch (error) {
        this.setError({ state: true, message: `Can't generate 2FA code` })
        return null
      }
    },
    // every validation if 2FA is enabled
    async validate2FACode(totpCode: string): Promise<boolean> {
      try {
        const { data } = await axios.post('auth/2fa/authenticate', {
          twoFactorAuthenticationCode: totpCode
        })
        return data as boolean
      } catch (error) {
        this.setError({ state: true, message: `Can't validate OTP code` })
        return false
      }
    },
    // subsequent usage when activating 2FA
    async activate2FA(totpCode: string): Promise<boolean> {
      try {
        // check if user has 2FA enabled
        const user = this.getUser()
        if (!user.twoFactorEnabled) {
          const { data } = await axios.post('auth/2fa/turn-on', {
            twoFactorAuthenticationCode: totpCode
          })
          await this.fetchUser()
          return data as boolean
        }
        return true
      } catch (error) {
        this.setError({ state: true, message: `Can't validate OTP code` })
        return false
      }
    }
  }
})

export default useAuthStore
