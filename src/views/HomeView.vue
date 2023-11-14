<template>
  <div class="w-full">
    <greetings />
    <div class="w-full">
      <VCol class="w-full">
        <top-chat-card />
      </VCol>
    </div>
  </div>
  <div class="flex flex-row py-8 flex-wrap">
    <div v-for="meta in userListStatsMeta" :key="meta.title" class="basis-1/2 p-2">
      <VCard>
        <VCardText class="flex justify-space-between">
          <div>
            <span>{{ meta.title }}</span>
            <div class="flex items-center gap-2 my-1">
              <h6 class="text-h6">
                {{ Math.round(meta.stats) }}
              </h6>
            </div>
            <span>{{ meta.subtitle }}</span>
          </div>
          <VAvatar rounded variant="tonal" :color="meta.color" :icon="meta.icon" />
        </VCardText>
      </VCard>
    </div>
  </div>
  <div class="w-full">
    <VRow>
      <VCol>
        <player-simple-stats
          v-if="authStore.getUser"
          :histories="authStore.getUser.gameHistories"
          :user-id="authStore.getUser.id"
          :color-class="colorClasses"
        />
      </VCol>
    </VRow>
  </div>
  <div class="my-16">
    <friends v-if="authStore.getUser" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useUserStore from '@/stores/UserStore'
import TopChatCard from '@/components/chatRooms/TopsChatCard.vue'
import PlayerSimpleStats from '@/components/profile/PlayerSimpleStats.vue'
import Friends from '@/components/profile/Friends.vue'
import Greetings from '@/components/profile/Greetings.vue'
import { avatarText } from '@/vuetify/@core/utils/formatters'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'

export default defineComponent({
  components: { PlayerSimpleStats, TopChatCard, Friends, Greetings },
  setup() {
    const authStore = useAuthStore()
    const coalition = authStore.getCoalition
    const colorClasses = [`bg-[${coalition.color}]`, 'bg-opacity-30']
    const userStore = useUserStore()
    return { authStore, colorClasses, userStore }
  },
  data() {
    const userListStatsMeta: Array<{
      icon: string
      color: 'primary' | 'error' | 'success' | 'warning'
      title: string
      stats: number
      subtitle: string
    }> = [
      {
        icon: 'tabler-user',
        color: 'primary',
        title: 'Utilisateurs',
        stats: 0,
        subtitle: 'Nombre total des utilisateurs'
      },
      {
        icon: 'tabler-table',
        color: 'error',
        title: 'Sessions',
        stats: 0,
        subtitle: 'Session creer les 30 derniers jours'
      },
      {
        icon: 'game-icons:ping-pong-bat',
        color: 'success',
        title: 'Parties par joeur',
        stats: 0,
        subtitle: 'Moyenne de parties, par utilisateur'
      },
      {
        icon: 'arcticons:games-2',
        color: 'warning',
        title: 'Total Parties',
        stats: 0,
        subtitle: 'Total, nombres de partie jouees'
      }
    ]
    return {
      userListStatsMeta,
      totalUser: 0
    }
  },
  beforeMount() {
    this.loadStats()
  },
  methods: {
    async loadStats() {
      await this.userStore.getAppStatistics()
      this.userListStatsMeta[0].stats = this.userStore.getStats.totalUsers
      this.userListStatsMeta[1].stats = this.userStore.getStats.activeUsers
      this.userListStatsMeta[2].stats = this.userStore.getStats.averageGamesPerUser
      this.userListStatsMeta[3].stats = this.userStore.getStats.totalGamesPlayed
      this.totalUser = this.userStore.getStats.totalUsers
    }
  }
})
</script>
