import { defineStore } from 'pinia'
import type { AuthState, ILoginData, RegisterBody, User, Profile } from 'Auth'
import type { AxiosError } from 'axios'
import axios from '@/utils/axios'

export enum Status {
  Online = 'Online',
  Offline = 'Offline',
  Away = 'Away',
  Busy = 'Busy'
}

export interface JwtPayload {
  email: string
  sub: {
    userId: number
    sessionId: number
    needToPassTwoFactor: boolean
  }
  exp: number
  iat: number
}

export enum LoginStatus {
  NOT_LOGGED = 'notLogged',
  LOGGED = 'logged',
  TWOFA_CHECK = '2faCheck',
  LOCKED = 'locked'
}
function decodeJWT(token): JwtPayload | null {
  try {
    const payloadBase64 = token.split('.')[1]
    const decodedPayload = atob(payloadBase64)
    const decoded = JSON.parse(decodedPayload)
    if (!decoded || !decoded.exp) throw new Error('Invalid token')
    return decoded
  } catch (e) {
    return null // Or handle the error as you see fit
  }
}

const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => {
    const token = localStorage.getItem('__token__') || null
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
    getTokenData(): JwtPayload | null {
      return decodeJWT(this.token)
    },
    isExpired() {
      return this.getTokenData?.exp < Math.floor(Date.now() / 1000)
    },
    status(): LoginStatus {
      if (this.user) {
        if (this.token) {
          if (this.isExpired) {
            return LoginStatus.LOCKED
          }

          const decoded = this.getTokenData
          if (!decoded) {
            return LoginStatus.LOCKED
          }

          if (decoded.sub.needToPassTwoFactor) {
            return LoginStatus.TWOFA_CHECK
          } else {
            return LoginStatus.LOGGED
          }
        } else {
          return LoginStatus.LOCKED
        }
      }
      return LoginStatus.NOT_LOGGED
    },
    isLoggedIn() {
      return this.status === LoginStatus.LOGGED
    },
    is2FA() {
      return this.status === LoginStatus.TWOFA_CHECK
    },
    isLocked() {
      return this.status === LoginStatus.LOCKED
    },
    getUser(): User | null {
      return this.user
    },
    getProfile(): Profile | null {
      return this.getUser?.profile ?? null
    },
    visibleStatus(): Status {
      return this.getProfile.status ?? Status.Offline
    }
  },
  actions: {
    setUser(user: User) {
      this.user = user
      localStorage.setItem('__user__', JSON.stringify(user))
    },
    setToken(token: string) {
      this.token = token
      localStorage.setItem('__token__', token)
    },
    removeToken() {
      this.token = null
      localStorage.removeItem('__token__')
    },
    removeUser() {
      this.user = null
      localStorage.removeItem('__user__')
    },
    async login(credentials: { username: string; password: string }): Promise<boolean> {
      this.error = { state: false, message: '' }
      try {
        const { data } = await axios.post('auth/login', credentials, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const { accessToken, user } = data as ILoginData
        this.setUser(user)
        this.setToken(accessToken)
        return true
      } catch (error: AxiosError | any) {
        if (error.response && error.response.status === 401) {
          this.error = { state: true, message: error.response.data.message }
        }
      }
      return false
    },
    async logout() {
      this.error = { state: false, message: '' }
      try {
        await axios.get('auth/logout')
      } catch (error: AxiosError | any) {
        this.error = { state: true, message: error.response.data.message }
      }
      this.removeToken()
      this.removeUser()
    },
    async register(userInfos: RegisterBody): Promise<boolean> {
      this.error = { state: false, message: '' }
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
        return true
      } catch (error: AxiosError | any) {
        if (error.response && error.response.status === 403) {
          this.error = { state: true, message: error.response.data.message }
        }
      }
      return false
    },
    async refreshCurrentUser() {
      this.error = { state: false, message: '' }
      try {
        const { data } = await axios.get('auth/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        this.setUser(data)
      } catch (e) {
        this.error = { state: false, message: 'Failed to refresh user data' }
      }
    },
    async refreshToken(): Promise<string | null> {
      this.error = { state: false, message: '' }
      try {
        if (!this.token) return null
        const { data } = await axios.get('/auth/refresh', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const { accessToken } = data as { accessToken: string }
        this.setToken(accessToken)
        return accessToken
      } catch (error: AxiosError | any) {
        if (error.response && error.response.status === 401) {
          await this.logout()
          this.error = { state: true, message: error.response.data.message }
        } else {
          this.error = { state: true, message: 'Failed to refresh token' }
        }
      }
      return null
    },
    async generate2FAQrCode(): Promise<string | null> {
      this.error = { state: false, message: '' }
      try {
        const { data } = await axios.post('auth/2fa/generate')
        return data as string
      } catch (error) {
        this.error = { state: true, message: `Can't generate 2FA code` }
        return null
      }
    },
    async activate2FA(otpCode: string): Promise<boolean> {
      this.error = { state: false, message: '' }
      try {
        if (!this.user.twoFactorEnabled) {
          await axios.post('auth/2fa/turn-on', {
            twoFactorAuthenticationCode: otpCode
          })
          await this.refreshCurrentUser()
        }
        return true
      } catch (error) {
        this.error = { state: true, message: `Can't validate OTP code` }
        return false
      }
    },
    async validate2FACode(totpCode: string): Promise<boolean> {
      this.error = { state: false, message: '' }
      try {
        const { data } = await axios.post('auth/2fa/authenticate', {
          twoFactorAuthenticationCode: totpCode
        })
        await this.refreshToken()
        return data as boolean
      } catch (error) {
        this.error = { state: true, message: `Can't validate OTP code` }
        return false
      }
    },
    async deactivate2FA(): Promise<boolean> {
      this.error = { state: false, message: '' }
      try {
        await axios.get('auth/2fa/turn-off')
        await this.refreshCurrentUser()
        return true
      } catch (error) {
        this.error = { state: true, message: `Can't deactivate 2FA` }
        return false
      }
    },
    async updatePassword(info: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }): Promise<boolean> {
      this.error = { state: false, message: '' }
      try {
        const { data } = await axios.post('auth/updatePassword', info)
        this.setUser(data)
        return true
      } catch (error) {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
          const message = JSON.stringify(error.response.data.message ?? 'error')
          this.error = { state: true, message }
        } else {
          this.error = { state: true, message: `Can't update password` }
        }
        return false
      }
    },
    async updateUserInfo(info: { firstName: string; lastName: string; bio: string }) {
      this.error = { state: false, message: '' }
      try {
        const { data } = await axios.post('auth/updateInfo', info)
        this.setUser(data)
        return true
      } catch (error) {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
          this.error = { state: true, message: error.response.data.message }
        } else {
          this.error = { state: true, message: `Can't update user info` }
        }
        return false
      }
    },
    async changeMyStatus(value: Status): Promise<'success' | 'error'> {
      try {
        // code to change status
        return 'success'
      } catch (e) {
        return 'error'
      }
    },
    resolveAvatarBadgeVariant(status: Status): 'success' | 'error' | 'warning' | 'secondary' {
      if (status === Status.Online) return 'success'
      else if (status === Status.Offline) return 'error'
      else if (status === Status.Busy) return 'warning'
      return 'secondary'
    }
  }
})

export default useAuthStore
