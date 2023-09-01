import useAuthStore from "@/stores/AuthStore";
import { defineStore } from 'pinia'
import axios from "@/utils/axios";
import useGlobalStore from "@/stores/GlobalStore";
import useChatStore from "@/stores/ChatStore";
const useUsersStore = defineStore({
  id: 'users',
  state: () => {
    const authStore = useAuthStore()
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    return {
      authStore,
      chatStore,
      globalStore,
      filteredUsers: [],
      allUsers: [],
      users: [],
      leaderboard: [],
      blockedUsers: [],
      friends: [],
      sentRequests: [],
      receivedRequests: [],
      selectedFile: null,
      loading: false,
      username: '',
      }
  },
  getters:{
    getAllUsers() { return this.allUsers },
    getUsers() { return this.users },
    getLeaderboard() { return this.leaderboard }
  },
  actions: {
    async getPaginatedUsers(page: number) {
      // get all users
      console.log('getPaginatedUsers', page)
    },
    async setAllUsers() {
      this.allUsers.splice(0)
      try {
        const { data } = await axios.get("/users/all")
        this.allUsers.push(...data)
        console.log(data)
      } catch (e) {
        // to think about
      }
    },
    getCountByEvent(gameHistories, event) {
      return gameHistories.filter(history => history.event === event).length;
    },
    async setLeaderboard() {
      this.leaderboard.splice(0)
      try {
        const { data } = await axios.get("/users/leaderboard")
        this.leaderboard.push(...data)
        this.leaderboard.sort((a, b) => {
          const aWinCount = this.getCountByEvent(a.gameHistories, 'MATCH_WON');
          const bWinCount = this.getCountByEvent(b.gameHistories, 'MATCH_WON');
          return bWinCount - aWinCount;
        });
      } catch (e) {
        // to think about
      }
    },
    async setUsers() {
      this.users.splice(0)
      try {
        const { data } = await axios.get("/users")
        this.users.push(...data)
      } catch (e) {
        // to think about
      }
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadFile() {
      if (!this.selectedFile) {
        console.log('No file selected.');
        return;
      }
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);

        const response = await axios.post('/files/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        await this.authStore.refreshUser()
        this.user = this.authStore.getUser
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    },
    async randomizeAvatar() {
      try {
        await axios.delete('/files/avatar')
        await this.authStore.refreshUser()
        this.user = this.authStore.getUser
      } catch (error) {
        // to think about
      }
    },
    async unblock(user) {
      try {
        await axios.delete("/users/block/" + user.id)
        await this.getBlockedUsers()
      } catch (e) {
        // to think about
      }
    },
    async cancelRequest(request) {
      try {
        await axios.delete("/friends/sent/" + request.id)
        await this.getSentRequests()
      } catch (e) {
        // to think about
      }
    },
    async approveRequest(request) {
      try {
        await axios.post("/friends/approve/" + request.id)
        await this.getReceivedRequests()
        await this.getFriends()
      } catch (e) {
        // to think about
      }
    },
    async rejectRequest(request) {
      try {
        await axios.post("/friends/reject/" + request.id)
        await this.getReceivedRequests()
      } catch (e) {
        // to think about
      }
    },
    async unfriend(user) {
      try {
        await axios.delete("/friends/" + user.id)
        await this.getFriends()
      } catch (e) {
        // to think about
      }
    },
    async refreshUserData() {
      this.loading = true
      // await this.authStore.fetchUser()
      this.loading = false
    },
    async getBlockedUsers() {
      this.blockedUsers.splice(0)
      try {
        const { data } = await axios.get("/users/block")
        this.blockedUsers.push(...data)
      } catch (e) {
        // to think about
      }
    },
    async blockUser() {
      try {
        await axios.post("/users/block/" + this.chatStore.selectedUser.memberId)
        await this.authStore.refreshUser()
        this.globalStore.socketMembersUpdate()
        await this.chatStore.setRoomMessages()
        this.globalStore.socketBlockUser(this.chatStore.selectedUser.member.username)
        this.globalStore.closeProfileDialog()
      } catch (error) {
        if (error.response) {
          this.chatStore.error = error.response.data.message;
        } else {
          this.chatStore.error = 'Something bad happened. Try again later'
        }
        await this.authStore.refreshUser()
        this.globalStore.socketUpdateUser()

      }
    },
    async getFriends() {
      this.friends.splice(0)
      try {
        const { data } = await axios.get("/friends")
        this.friends.push(...data)
      } catch (e) {
        // to think about
      }
    },
    async addFriend() {
      try {
        await axios.post("/friends/" + this.chatStore.selectedUser.memberId)
        this.globalStore.closeProfileDialog()
      } catch (error) {
        if (error.response && error.response === 409) {
          this.chatStore.error = 'Request already sent'
        } else {
          this.chatStore.error = 'Something weird happened'
        }
      }
    },
    async getSentRequests() {
      this.sentRequests.splice(0)
      try {
        const { data } = await axios.get("/friends/sent")
        this.sentRequests.push(...data)
      } catch (e) {
        // to think about
      }
    },
    async getReceivedRequests() {
      this.receivedRequests.splice(0)
      try {
        const { data } = await axios.get("/friends/received")
        this.receivedRequests.push(...data)
      } catch (e) {
        // to think about
      }
    },
    formatDate(date, includeTime = false) {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const options = {
        timeZone: userTimezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      if (includeTime) {
        options.hour = 'numeric';
        options.minute = 'numeric';
      }
      return new Date(date).toLocaleString('en-US', options);
    },
  }
})

export default useUsersStore
