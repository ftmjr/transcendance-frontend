<template>
  <div>
    <UserProfileHeader
      class="mb-5"
      :info="profileData.header"
      :friend-ship-status="profileData.friendshipStatus"
    />
    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTabs v-model="activeTab" class="v-tabs-pill">
        <VTab
          v-for="item in tabs"
          :key="item.icon"
          :value="item.tab"
          :to="getRoute(item.tab)"
          :loading="loading"
        >
          <VIcon size="20" start :icon="item.icon" />
          {{ item.title }}
        </VTab>
      </VTabs>
    </VTabs>
    <VWindow v-model="activeTab" class="mt-6 disable-tab-transition" :touch="false">
      <VWindowItem value="history">
        <VCard title="Historiques des Actions">
          <VTable class="bg-transparent">
            <thead>
              <tr>
                <th>Jeu</th>
                <th>Evenement</th>
                <th>Temps</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="history in gameHistories" :key="history.id">
                <td>{{ history.gameId }}</td>
                <td>{{ history.event }}</td>
                <td>{{ history.timestamp }}</td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VWindowItem>
    </VWindow>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import type { ProfileData, User, GameHistory } from 'Auth'
import axios from '@/utils/axios'
import formatDate from '@/vuetify/@core/utils/formatters';

export default defineComponent({
  name: 'ShowProfile',
  components: {
    UserProfileHeader: defineAsyncComponent(() => import('@/components/profile/Header.vue'))
  },
  props: {
    userId: {
      type: String,
      default: () => 'me'
    },
    tab: {
      type: String,
      default: () => 'profile'
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      loading: false,
      activeTab: this.tab,
      tabs: [
        { title: 'Profile', icon: 'tabler-user-check', tab: 'profile' },
        { title: 'Awards', icon: 'dashicons:awards', tab: 'awards' },
        { title: 'Amis', icon: 'tabler-link', tab: 'friends' },
        { title: 'Historique', icon: 'tabler-history', tab: 'history' }
      ],
      profileData: {
        id: 0,
        header: {
          coalition: 'Legion',
          avatar: '',
          fullName: 'no name',
          username: 'maxi',
          joiningDate: Date.now()
        },
        bio: '',
        status: 'online',
        friendshipStatus: 'none',
        friendStart: null
      } as unknown as ProfileData,
      gameHistories: [] as GameHistory[],
      errorMsg: ''
    }
  },
  computed: {
    userIdValue(): number {
      if (this.userId === 'me') return this.authStore.getUser?.id || 0
      return this.userId ? parseInt(this.userId) : 0
    }
  },
  async beforeMount() {
    await this.fetchProfileData()
    await this.checkFriendShip()
  },
  methods: {
    formatDate,
    getRoute(tab: string) {
      if (this.userId === 'me') {
        return { name: 'me', params: { tab: tab } }
      } else {
        return { name: 'user-profile', params: { userId: this.userIdValue, tab: tab } }
      }
    },
    async fetchProfileData() {
      this.loading = true
      this.errorMsg = ''
      try {
        // to-do a route for fetching unique profile
        const { data } = await axios.get<User>(`/users/profile/${this.userIdValue}`)
        this.profileData = {
          id: data.id,
          header: {
            coalition: this.getCoalition(data.profile.oauth),
            avatar: data?.profile.avatar,
            fullName: data.profile.name + ' ' + data.profile.lastname,
            username: data.username,
            joiningDate: data.createdAt
          },
          bio: data.profile.bio,
          status: data.profile.status,
          friendshipStatus: 'none',
          friendStart: null
        }
      } catch (error) {
        this.errorMsg = 'Failed to load profile'
      }
      this.loading = false
    },
    getCoalition(OauthInfo: unknown): 'Legion' | 'Torrent' | 'Armada' {
      if (OauthInfo) {
        // do something to get 42 colation
      }
      return 'Legion'
    },
    async checkFriendShip() {
      this.loading = true
      this.errorMsg = ''
      try {
        // to-do a route for fetching unique profile
        const { data } = await axios.get<{
          status: 'none' | 'pending' | 'accepted' | 'blocked'
          data: { createdAt?: string } | null
        }>(`/friends/check/${this.userIdValue}`)
        this.profileData.friendshipStatus = data.status
        this.profileData.friendStart = data.data?.createdAt
      } catch (error) {
        this.errorMsg = 'Not friends'
      }
      this.loading = false
    }
  }
})
</script>

<style scoped></style>
