<template>
  <div>
    <user-profile-header class="mb-5" :id="profileData.id" :info="profileData.header" />
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
      <VWindowItem value="profile">
        <div>
          <p>Profil, bio, major stats etc...</p>
        </div>
      </VWindowItem>
      <VWindowItem value="awards">
        <div>Les recompenses</div>
      </VWindowItem>
      <VWindowItem value="friends">
        <Friends />
      </VWindowItem>
      <VWindowItem value="history">
        <Histories :histories="gameHistories" />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import type { ProfileData, User, GameHistory } from 'Auth'
import axios from '@/utils/axios'
import Histories from '@/views/User/Histories.vue'
import UserProfileHeader from '@/components/profile/Header.vue'

export default defineComponent({
  components: {
    Histories,
    UserProfileHeader
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
      otherTabs: [
        { title: 'Profile', icon: 'tabler-user-check', tab: 'profile' },
        { title: 'Awards', icon: 'dashicons:awards', tab: 'awards' },
        { title: 'Historique', icon: 'tabler-history', tab: 'history' }
      ],
      meTabs: [
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
          fullName: '',
          username: 'no username',
          joiningDate: Date.now()
        },
        bio: ''
      } as ProfileData,
      gameHistories: [] as GameHistory[],
      errorMsg: ''
    }
  },
  computed: {
    userIdValue(): number {
      if (this.userId === 'me') return this.authStore.getUser?.id || 0
      return this.userId ? parseInt(this.userId) : 0
    },
    tabs(): { title: string; icon: string; tab: string }[] {
      if (this.userIdValue === this.authStore.getUser?.id) return this.meTabs
      return this.otherTabs
    }
  },
  async beforeMount() {
    await this.fetchProfileData()
  },
  methods: {
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
        const { data } = await axios.get<User>(`/users/profile/${this.userIdValue}`)
        this.profileData = {
          id: data.id,
          header: {
            coalition: this.getCoalition(data.profile.oauth),
            avatar: data?.profile.avatar,
            fullName: `${data.profile.name} ${data.profile.lastname}`,
            username: data.username,
            joiningDate: data.createdAt,
            isCurrentUser: this.userIdValue === this.authStore.getUser?.id
          },
          bio: data.profile.bio,
          status: data.profile.status
        }
        this.gameHistories = data.gameHistories ?? []
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
    }
  }
})
</script>

<style scoped></style>
