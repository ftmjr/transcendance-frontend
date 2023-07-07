declare module 'Auth' {
  export type User = {
    name: string
    email: string
    avatar: string
  }

  export interface AuthState {
    token: string | null
    user: User | null
    error: {
      state: boolean
      message: string
    }
  }
  export interface RegisterBody {
    lastname: string
    firstname: string
    email: string
    password: string
    username: string
    passwordConfirmation: string
  }
}
