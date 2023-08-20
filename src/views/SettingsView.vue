<template>
  <v-container fluid>
  <v-avatar size="100">
    <v-img :src="profile.avatar"></v-img>
  </v-avatar>
  <v-card
      class="mx-auto"
      max-width="500"
  >
    <v-card-title>
      Blocked Users List
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll
        :items="blockedUsers"
        height="120"
        item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.username"
            :subtitle="`Since ${formatDate(item.createdAt)}`"
        >
          <template v-slot:prepend>
            <v-avatar size="50">
                <v-img :src="item.profile.avatar"></v-img>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn size="small" variant="tonal" @click="() => unblock(item)">
              Unblock
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
  <v-card
      class="mx-auto"
      max-width="500"
  >
    <v-card-title>
      Friends List
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll
        :items="friends"
        height="120"
        item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.username"
            :subtitle="`Since ${formatDate(item.createdAt)}`"
        >
          <template v-slot:prepend>
            <v-avatar size="50">
              <v-img :src="item.avatar"></v-img>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn size="small" variant="tonal" @click="() => unfriend(item)">
              Unblock
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
  <v-card
      class="mx-auto"
      max-width="500"
  >
    <v-card-title>
      Sent Friends Requests
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll
        :items="sentRequests"
        height="120"
        item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.username"
            :subtitle="`Since ${formatDate(item.createdAt)}`"
        >
          <template v-slot:prepend>
            <v-avatar size="50">
              <v-img :src="item.profile.avatar"></v-img>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn size="small" variant="tonal" @click="() => cancelRequest(item)">
              Unblock
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
  <v-card
      class="mx-auto"
      max-width="500"
  >
    <v-card-title>
      Received Friends Requests
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll
        :items="sentRequests"
        height="120"
        item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.username"
            :subtitle="`Since ${formatDate(item.createdAt)}`"
        >
          <template v-slot:prepend>
            <v-avatar size="50">
              <v-img :src="item.profile.avatar"></v-img>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn size="small" variant="tonal" @click="() => approveRequest(item)">
              Approve
            </v-btn>
            <v-btn size="small" variant="tonal" @click="() => rejectRequest(item)">
              Reject
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
  <v-card
      class="mx-auto"
      max-width="500"
  >
    <v-card-title>
      All Users
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll
        :items="users"
        height="120"
        item-height="48"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.username"
            :subtitle="`Since ${formatDate(item.createdAt)}`"
        >
          <template v-slot:prepend>
            <v-avatar size="50">
              <v-img :src="item.profile.avatar"></v-img>
            </v-avatar>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
  <div>
    <input type="file" @change="handleFileChange" />
    <v-btn color="background" @click="uploadFile">Upload</v-btn>
  </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import { initFlowbite } from 'flowbite'
import axios from "@/utils/axios";

export default defineComponent({
  name: 'settings-view',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      users: [],
      blockedUsers: [],
      friends: [],
      sentRequests: [],
      receivedRequests: [],
      selectedFile: null,
      loading: false
    }
  },
  computed: {
    user() {
      return this.authStore.getUser
    },
    profile() {
      return this.authStore.getUser?.profile
    }
  },
  mounted() {
    initFlowbite()
    this.refreshUserData()
    this.getBlockedUsers()
    this.getUsers()
    this.getFriends()
    // this.getSentRequests()
    // this.getReceivedRequests()
  },
  methods: {
    async getUsers() {
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
        await axios.delete("/users/block/" + request.id)
        await this.getSentRequests()
      } catch (e) {
        // to think about
      }
    },
    async approveRequest(request) {
      try {
        await axios.post("/users/friends/approve/" + request.id)
        await this.getReceivedRequests()
      } catch (e) {
        // to think about
      }
    },
    async rejectRequest(request) {
      try {
        await axios.post("/users/friends/add/" + request.id)
        await this.getReceivedRequests()
      } catch (e) {
        // to think about
      }
    },
    async unfriend(user) {
      try {
        await axios.delete("/users/friend/remove/" + user.id)
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
        const { data } = await axios.get("/users/friends/add")
        this.sentRequests.push(...data)
      } catch (e) {
        // to think about
      }
    },
    async getReceivedRequests() {
      this.receivedRequests.splice(0)
      try {
        const { data } = await axios.get("/users/friends/requests")
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
</script>

<style lang="css"></style>
