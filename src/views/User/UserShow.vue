<template>
  <div>
    <user-profile-header :id="profileData.id" class="mb-5" :info="profileData.header" />
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
        <VCard :loading="loading" color="transparent">
          <VCard v-if="profileData.profile">
            <div class="bg-[#1a1f3c] p-2 md:p-6">
              <h3 class="underline underline-offset-4">Description</h3>
              <p v-if="profileData.profile.bio" class="text-left md:w-1/2 py-2 font-mono">
                <i>{{ profileData.profile.bio }}</i>
              </p>
              <p v-else class="text-left pb-2 font-mono text-sm md:w-1/2 py-2">
                <i>Aucune bio, pour l'instant</i>
              </p>
            </div>
          </VCard>
          <div class="my-2" />
          <PlayerSimpleStats
            v-if="gameHistories && userId"
            :histories="gameHistories"
            :user-id="userId"
          />
        </VCard>
      </VWindowItem>
      <VWindowItem value="awards">
        <div>Les recompenses</div>
      </VWindowItem>
      <VWindowItem value="friends">
        <Friends v-if="userId === authStore.getUser?.id" />
      </VWindowItem>
      <VWindowItem value="history">
        <Histories v-if="userId" :user-id="userId" />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import type { ProfileData, User, GameHistory, Profile } from '@/interfaces/User'
import axios from '@/utils/axios'
import Histories from '@/components/profile/Histories.vue'
import UserProfileHeader from '@/components/profile/ProfileHeader.vue'
import Friends from '@/components/profile/Friends.vue'
import PlayerSimpleStats from '@/components/profile/PlayerSimpleStats.vue'
import { Status } from '@/interfaces/User'

type Tab = 'profile' | 'awards' | 'history' | 'friends'
type TabItem = { title: string; icon: string; tab: Tab }
const emptyCoalition = {
  color: '#cc0000',
  cover_url:
    'https://cdn.intra.42.fr/coalition/cover/243/42Q_035_22_BG_Coalitions_Legion_3000x2000.jpg',
  id: 243,
  image_url: 'https://cdn.intra.42.fr/coalition/image/243/42Q_035_22_Logo_Legion.svg',
  name: 'Les pongistes',
  score: 0,
  slug: 'Pongiste',
  user_id: 0
}
export default defineComponent({
  components: {
    PlayerSimpleStats,
    Histories,
    UserProfileHeader,
    Friends
  },
  props: {
    userId: {
      type: Number,
      required: true
    },
    tab: {
      type: String as PropType<Tab>,
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
      ] as TabItem[],
      meTabs: [
        { title: 'Profile', icon: 'tabler-user-check', tab: 'profile' },
        { title: 'Awards', icon: 'dashicons:awards', tab: 'awards' },
        { title: 'Amis', icon: 'tabler-link', tab: 'friends' },
        { title: 'Historique', icon: 'tabler-history', tab: 'history' }
      ] as TabItem[],
      profileData: {
        id: 0,
        header: {
          coalition: emptyCoalition,
          avatar: '',
          fullName: 'Hidden',
          username: 'no-username',
          joiningDate: Date.now(),
          status: Status.Offline
        },
        bio: '',
        email: '',
        profile: null
      } as unknown as ProfileData,
      gameHistories: [] as GameHistory[],
      errorMsg: ''
    }
  },
  computed: {
    tabs(): TabItem[] {
      if (this.userId === this.authStore.getUser?.id) return this.meTabs
      return this.otherTabs
    }
  },
  watch: {
    $route(to, from) {
      const showProfile = to.name === 'user-profile' || to.name === 'me'
      if (showProfile) {
        if (to.params.userId !== from.params.userId) {
          const id = to.params.userId ?? this.authStore.getUser?.id
          this.fetchProfileData(id)
        }
      }
    }
  },
  async beforeMount() {
    await this.fetchProfileData(this.userId)
    if (this.profileData.header.username) {
      document.title = `${this.profileData.header.username} - ${this.activeTab} | Transcendence`
    }
  },
  methods: {
    getRoute(tab: string) {
      if (this.userId === this.authStore.getUser?.id) {
        return { name: 'me', params: { tab: tab } }
      } else {
        return { name: 'user-profile', params: { userId: this.userId, tab: tab } }
      }
    },
    async fetchProfileData(userId: number) {
      this.loading = true
      this.errorMsg = ''
      try {
        const { data } = await axios.get<User & { profile: Profile }>(`/users/profile/${userId}`)
        if (data) {
          this.profileData = {
            id: data.id,
            header: {
              coalition: this.authStore.resolveCoalition(data.profile),
              avatar: data.profile.avatar,
              fullName: `${data.profile.name} ${data.profile.lastname}`,
              username: data.username,
              joiningDate: data.createdAt,
              isCurrentUser: userId === this.authStore.getUser?.id,
              status: data.profile.status
            },
            profile: data.profile,
            email: data.email
          }
        }
        this.gameHistories = data.gameHistories ?? []
      } catch (error) {}
      this.loading = false
    }
  }
})
</script>

<style scoped></style>
