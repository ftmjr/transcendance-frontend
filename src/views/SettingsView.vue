<template>
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
      blockedUsers: [],
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
  },
  methods: {
    async unblock(user) {
      console.log(user)
      try {
        await axios.delete("/users/block/" + user.id)
        await this.getBlockedUsers()
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
