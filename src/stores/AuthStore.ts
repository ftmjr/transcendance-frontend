import { defineStore } from 'pinia'
import type { AuthState, User, RegisterBody, ILoginData  } from 'Auth'
import axios, {AxiosError} from 'axios'

const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => {
    const token = localStorage.getItem('__token__')
    const user = JSON.parse(localStorage.getItem('__user__') ?? 'null') as User | null;
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
    isAuthenticated(): boolean{
      return this.token ?  true : false;
    }
  },
  actions: {
    setToken(token: string){
      this.token = token;
      localStorage.setItem("__token__", token);
    },
    setUser(user: User) {
      this.user = user;
      localStorage.setItem("__user__", JSON.stringify(user));
    },
    removeToken()
    {
      localStorage.removeItem("__token__");
      this.token = null;
    },
    removeUser(){
      this.user = null;
      localStorage.removeItem("__user__")
    },
    async fetchUser():Promise<boolean>{
      try{
        const {data} = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.setUser(data);
        return (true)
      }
      catch (e: unknown)
      {
        this.removeToken()
        this.removeUser()
        return false;
      }
    },
    async login(credentials: { username: string; password: string }): Promise<boolean> {
      try {
        const { data } = await axios.post('/api/auth/login', credentials, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const { accessToken, user } = data as ILoginData;
        this.setUser(user);
        this.setToken(accessToken);
        return true;
      } catch (error: AxiosError) {
        if (error.response && error.response.status === 401) {
          return false;
        }
      }
    },
    async logout(): Promise<boolean> {
      try {
        this.removeToken()
        this.removeUser()
        this.token = null
        this.user = null

        await axios.get('/api/auth/logout')
        return true;
      } catch (error: AxiosError) {
        return false;
      }
    },
    async register(userInfos: RegisterBody): Promise<boolean> {
      if (!userInfos || userInfos.password !== userInfos.passwordConfirmation) return false;

      const { passwordConfirmation, ...body } = userInfos

      try {
        const { data } = await axios.post('/api/auth/signup', body, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        return true;
      } catch (error: AxiosError) {
        if (error.response && error.response.status === 403) {
          // get the backend error msg
        }
        return false;
      }
    }
  }
})

export default useAuthStore
