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
          <p>[SHORT BIO]</p>
          <p>
            <i>{{ this.authStore.getProfile?.bio }}</i>
          </p>
          <br />
          <br />
          <p>[PONG STATS]</p>
          <p>Number of wins :</p>
        </div>
      </VWindowItem>
      <VWindowItem value="awards">
        <div>Les recompenses</div>
      </VWindowItem>
      <VWindowItem value="friends">
        <Friends />
      </VWindowItem>
      <VWindowItem value="history">
        <Histories :user-id="userIdValue" />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import type { ProfileData, User, GameHistory, Coalition } from 'Auth'
import axios from '@/utils/axios'
import Histories from '@/views/User/Histories.vue'
import UserProfileHeader from '@/components/profile/Header.vue'
import Friends from '@/components/profile/Friends.vue'

export default defineComponent({
  components: {
    Histories,
    UserProfileHeader,
    Friends
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
      if (this.userId === 'me') return this.authStore.getUser?.id ?? 0
      return this.userId ? parseInt(this.userId) : 0
    },
    tabs(): { title: string; icon: string; tab: string }[] {
      if (this.userIdValue === this.authStore.getUser?.id) return this.meTabs
      return this.otherTabs
    }
  },
  async beforeMount() {
    await this.fetchProfileData(this.userIdValue)
    if (this.profileData.header.username) {
      // change page Title
      document.title = `${this.profileData.header.username} - ${this.activeTab} - Profile | Transcendence`
    }
  },
  methods: {
    getRoute(tab: string) {
      if (this.userId === 'me') {
        return { name: 'me', params: { tab: tab } }
      } else {
        return { name: 'user-profile', params: { userId: this.userIdValue, tab: tab } }
      }
    },
    async fetchProfileData(userId: number) {
      this.loading = true
      this.errorMsg = ''
      try {
        const { data } = await axios.get<User>(`/users/profile/${userId}`)
        this.profileData = {
          id: data.id,
          header: {
            coalition: this.authStore.resolveCoalition(data.profile),
            avatar: data?.profile.avatar,
            fullName: `${data.profile.name} ${data.profile.lastname}`,
            username: data.username,
            joiningDate: data.createdAt,
            isCurrentUser: userId === this.authStore.getUser?.id
          },
          bio: data.profile.bio,
          status: data.profile.status
        }
        this.gameHistories = data.gameHistories ?? []
      } catch (error) {
        this.errorMsg = 'Failed to load profile'
      }
      this.loading = false
    }
  },
  watch: {
    $route(to, from) {
      // if we moving to the same route we update the profile data
      const showProfile = to.name === 'user-profile' || to.name === 'me'
      if (showProfile) {
        if (to.params.userId !== from.params.userId) {
          const id = to.params.userId ?? this.authStore.getUser?.id
          this.fetchProfileData(id)
        }
      }
    }
  }
})
</script>

<style scoped></style>
