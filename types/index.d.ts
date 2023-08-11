declare module 'Auth' {

export interface Profile {
    id: number;
    userId: number;
    name:    string;
    lastname: string;
    avatar?: string;
    bio?:string;
    oauth?: unknown;
  }
  export interface User {
    id: number;
    username : string;
    email: string;
    role : {};
    profile?: Profile;
    sessions: []; //Session[]
    games: []; //Game[]
    groups : []; //             Group[]
    twoFactorEnabled: boolean;
  }

  export interface AuthState {
    token: string | null
    tokenExpiry: number
    user: User | null
    error: {
      state: boolean
      message: string
    }
  }
  export interface RegisterBody {
    lastName: string
    firstName: string
    email: string
    password: string
    username: string
    passwordConfirmation: string
  }

  export interface ILoginData {
    accessToken: string;
    user: User;
  }
}
