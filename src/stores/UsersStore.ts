import useAuthStore from "@/stores/AuthStore";
import { defineStore } from 'pinia'
import axios from "@/utils/axios";
import userCircle from "@/components/icons/UserCircle.vue";
const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    filteredUsers: [],
    allUsers: [],
    users: [],
    blockedUsers: [],
    friends: [],
    sentRequests: [],
    receivedRequests: [],
    selectedFile: null,
    loading: false,
    username: '',
    authStore: useAuthStore()
  }),
  getters:{
    getAllUsers() { return this.allUsers },
    getUsers() { return this.users },
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
    async getFriends() {
      this.friends.splice(0)
      try {
        const { data } = await axios.get("/friends")
        this.friends.push(...data)
      } catch (e) {
        // to think about
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
