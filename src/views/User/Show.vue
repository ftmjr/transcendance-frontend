<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import type { ProfileData } from 'Auth'
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
        friendshipStatus: 'none'
      } as ProfileData
    }
  },
  computed: {
    userIdValue(): number {
      if (this.userId === 'me') return this.authStore.getUser?.id || 0
      return this.userId ? parseInt(this.userId) : 0
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
    async fetchProfileData() {}
  }
})
</script>

<template>
  <div>
    <UserProfileHeader
      class="mb-5"
      :info="profileData.header"
      :friend-ship-status="profileData.friendshipStatus"
    />
    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTabs v-model="activeTab" class="v-tabs-pill">
        <VTab v-for="item in tabs" :key="item.icon" :value="item.tab" :to="getRoute(item.tab)">
          <VIcon size="20" start :icon="item.icon" />
          {{ item.title }}
        </VTab>
      </VTabs>
    </VTabs>
  </div>
</template>

<style scoped></style>
