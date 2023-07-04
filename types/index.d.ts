export type SocialLoginProviders = 'Facebook' | '42'

export type User = {
  name: string
  email: string
  avatar: string
}

export interface AuthState {
  token: string | null
  user: User | null
}
