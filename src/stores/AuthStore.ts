import { defineStore } from 'pinia'
import type { AuthState, User, RegisterBody, ILoginData  } from 'Auth'
import axiosInstance from "@/utils/axios.ts";
import type {AxiosError} from "axios";

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
    async fetchUser(){
      const {data} = await axiosInstance.get("/api/auth/me", {
        headers: {}
      });
      this.setUser(data.User);
    },
    async login(credentials: { username: string; password: string }): Promise<boolean> {
      try {
        const { data } = await axiosInstance.post('/api/auth/login', credentials, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const { accessToken, user } = data as ILoginData;
        this.setUser(user);
        this.setToken(accessToken);
        return true;
      } catch (error: AxiosError | any) {
        if (error.response && error.response.status === 401) {
        }
      }
      return false;
    },
    async logout(): Promise<void> {
      try {
        localStorage.removeItem('__token__')
        localStorage.removeItem('__user__')
        this.token = null
        this.user = null

        await axiosInstance.get('/api/logout')

      } catch (error: AxiosError | any) {
        if (error.response){
        //
        }
      }
    },
    async register(userInfos: RegisterBody): Promise<boolean> {
      if (!userInfos || userInfos.password !== userInfos.passwordConfirmation) return false;

      const { passwordConfirmation, ...body } = userInfos

      try {
        console.log(body);
        const { data } = await axiosInstance.post('/api/auth/signup', body, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
       console.log(data);
        return true;
      } catch (error: AxiosError | any) {
        if (error.response && error.response.status === 403) {
          // get the backend error msg
        }
      }
      return false;
    }
  }
})

export default useAuthStore
