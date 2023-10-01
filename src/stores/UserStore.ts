import { defineStore } from 'pinia'
import type { User, Profile } from 'Auth'
import type { AxiosError } from 'axios'
import axios from '@/utils/axios'

export interface FriendRequest {
  id: number
  senderId: number
  receiverId: number
  createdAt: Date
}

export interface FriendRequestWithReceiver extends FriendRequest {
  receiver: {
    profile: Profile
  }
}
export interface FriendRequestWithSender extends FriendRequest {
  sender: {
    profile: Profile
  }
}

export interface BlockedUser {
  id: number
  userId: number
  blockedUserId: number
  createdAt: Date
  blockedUser?: {
    profile: Profile
  }
}

export interface UserWithScore extends User {
  score: number
}

export interface AppStatData {
  totalUsers: number
  activeUsers: number
  totalGamesPlayed: number
  totalCompetitions: number
  totalNotificationsSent: number
  averageGamesPerUser: number
  mostActiveGame: number
  mostActiveUser: number
}

export interface UserStoreState {
  contacts: User[]
  receivedRequest: FriendRequestWithSender[]
  sentRequest: FriendRequestWithReceiver[]
  blockedUsers: BlockedUser[]
  stats: AppStatData
}

type SortOrder = 'asc' | 'desc'
export interface userOrderBy {
  username?: SortOrder
  email?: SortOrder
  profile?: {
    name?: SortOrder
    lastname?: SortOrder
    status?: SortOrder
  }
  createdAt?: SortOrder
  updatedAt?: SortOrder
}

const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserStoreState => {
    const stats: AppStatData = {
      totalUsers: 0,
      activeUsers: 0,
      totalGamesPlayed: 0,
      totalCompetitions: 0,
      totalNotificationsSent: 0,
      averageGamesPerUser: 0,
      mostActiveGame: 0, //gameId
      mostActiveUser: 0 //userId
    }
    return {
      contacts: [],
      receivedRequest: [],
      sentRequest: [],
      blockedUsers: [],
      stats
    }
  },
  getters: {
    getStats(): AppStatData {
      return this.stats
    },
    getContact() {
      return this.contacts
    },
    getBlockedUsers(): BlockedUser[] {
      return this.blockedUsers
    },
    getReceivedRequests(): FriendRequestWithSender[] {
      return this.receivedRequest
    },
    getSentRequests(): FriendRequestWithReceiver[] {
      return this.sentRequest
    }
  },
  actions: {
    /* Friendship section */
    async askFriendRequest(userId: number): Promise<'success' | 'already' | 'error'> {
      let message: 'success' | 'already' | 'error' = 'success'
      try {
        await axios.post(`/friends/request-friendship-with/${userId}`)
      } catch (error: AxiosError | any) {
        if (error.response && error.response === 409) {
          this.error = 'already'
        } else {
          message = 'error'
        }
      }
      return message
    },
    async cancelFriendRequest(requestId: number): Promise<'success' | 'error'> {
      try {
        await axios.delete(`/friends/sent/${requestId}`)
        await this.fetchSentRequests()
        return 'success'
      } catch (e) {
        return 'error'
      }
    },
    async approveFriendRequest(requestId: number): Promise<'success' | 'error'> {
      try {
        await axios.post(`/friends/approve-friendship-request-for/${requestId}`)
        return 'success'
      } catch (e) {
        return 'error'
      }
    },
    async rejectFriendRequest(requestId: number): Promise<'success' | 'error'> {
      try {
        await axios.delete(`/friends/reject/${requestId}`)
        await this.getReceivedRequests()
        return 'success'
      } catch (e) {
        return 'error'
      }
    },
    async unFriend(frienId: number): Promise<'success' | 'error'> {
      try {
        await axios.delete(`/friends/${frienId}`)
        await this.loadAllMyFriends()
        return 'success'
      } catch (e) {
        return 'error'
      }
    },
    async loadAllMyFriends(): Promise<'success' | 'error'> {
      try {
        const { data } = await axios.get('/friends')
        this.contacts = data as User[]
        return 'success'
      } catch (e) {
        return 'error'
      }
    },
    async fetchSentRequests(): Promise<'success' | 'error'> {
      try {
        const { data } = await axios.get('/friends/sent')

        this.sentRequest = data as FriendRequestWithReceiver[]
        return 'success'
      } catch (e) {
        return 'error'
      }
    },
    async checkFriendShip(userId: number) {
      try {
        const { data } = await axios.get<{
          status: 'none' | 'pending' | 'accepted' | 'blocked'
          data: { createdAt?: string } | null
        }>(`/friends/check/${userId}`)
        return data
      } catch (error) {
        this.errorMsg = 'Not friends'
      }
      return { status: 'none', data: null }
    },

    /* Blocked users */
    async loadBlockedUsers(): Promise<'success' | 'error'> {
      try {
        const { data } = await axios.get<BlockedUser[]>('/users/block', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        this.blockedUsers = data
        return 'success'
      } catch (e) {
        return 'error'
      }
    },
    async blockUser(userId: number): Promise<'success' | 'error'> {
      try {
        const { data } = await axios.post(`/users/block/${userId}`)
        const blocked = data as BlockedUser
        //to-do filter contact and remove the blocked user
        return 'success'
      } catch (error) {
        return 'error'
      }
    },
    async unblockUser(userId: number): Promise<'success' | 'error'> {
      try {
        await axios.delete(`block/${userId}`)
        return 'success'
      } catch (e) {
        return 'error'
      }
    },

    /* User section */
    async getPaginatedUser(params: {
      currentPage: number
      perPage: number
      orderBy?: userOrderBy
    }): Promise<User[]> {
      const { currentPage, perPage, orderBy } = params
      const skip = (currentPage - 1) * perPage
      const take = perPage
      try {
        const { data } = await axios.get<User[]>('/users/all', {
          params: {
            skip,
            take,
            orderBy
          }
        })
        return data
      } catch (e) {
        console.log(e)
      }
      return []
    },
    async getPaginatedUsersWithScore(params: {
      skip?: number
      take?: number
    }): Promise<UserWithScore[]> {
      const { skip, take } = params
      try {
        const { data } = await axios.get<UserWithScore[]>('/users/leaderboard', {
          params: {
            skip,
            take
          }
        })
        return data
      } catch (e) {
        console.log(e)
      }
      return []
    },

    /* Statistics */
    async getAppStatistics(): Promise<'success' | 'error'> {
      try {
        const { data } = await axios.get<AppStatData>('/users/stats')
        this.stats = data
        return 'success'
      } catch (e) {
        console.log(e)
        return 'error'
      }
    },

    async loadReceivedRequests(): Promise<'success' | 'error'> {
      this.receivedRequest = []
      return 'success'
    }
  }
})

export default useUserStore
