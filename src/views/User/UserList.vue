<template>
  <VRow>
    <VCol v-for="meta in userListStatsMeta" :key="meta.title" cols="12" sm="6" lg="3">
      <VCard>
        <VCardText class="flex justify-space-between">
          <div>
            <span>{{ meta.title }}</span>
            <div class="flex items-center gap-2 my-1">
              <h6 class="text-h6">
                {{ meta.stats }}
              </h6>
            </div>
            <span>{{ meta.subtitle }}</span>
          </div>
          <VAvatar rounded variant="tonal" :color="meta.color" :icon="meta.icon" />
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12">
      <VCard title="Rechercher un Joeur">
        <VCardText class="flex flex-wrap py-4 gap-4">
          <div class="w-24">
            <VSelect
              v-model="rowPerPage"
              density="compact"
              variant="outlined"
              :items="[10, 20, 30, 50]"
            />
          </div>
          <VSpacer />
          <VTextField
            class="transparent-input-box"
            v-model="searchQuery"
            placeholder="Rechercher"
            density="compact"
          />
        </VCardText>

        <VDivider />
        <VTable class="bg-transparent">
          <thead>
            <tr>
              <th scope="col">UTILISATEURS</th>
              <th scope="col">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="flex items-center">
                  <AvatarBadge :profile="user.profile" :username="user.username" />

                  <div class="d-flex flex-column">
                    <h6 class="text-base">
                      <RouterLink
                        :to="{ name: 'user-profile', params: { userId: user.id } }"
                        class="font-weight-medium user-list-name"
                      >
                        {{ user.profile.name }} {{ user.profile.lastname }}
                      </RouterLink>
                    </h6>
                    <span class="text-sm text-disabled">@{{ user.username }}</span>
                  </div>
                </div>
              </td>
              <td>
                {{ user.profile.status }}
              </td>
            </tr>
          </tbody>
        </VTable>
        <VDivider />

        <VCardText class="flex items-center fjustify-space-between gap-4 py-3 px-5">
          <span class="text-sm text-disabled">
            {{ paginationData }}
          </span>
          <VPagination v-model="currentPage" size="small" :total-visible="5" :length="totalPage" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useUserStore from '@/stores/UserStore'
import type { User } from 'Auth'
import { avatarText } from '@/vuetify/@core/utils/formatters'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'

const userListStatsMeta: Array<{
  icon: string
  color: 'primary' | 'error' | 'succes' | 'warning'
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
    color: 'succes',
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

export default defineComponent({
  name: 'UserList',
  components: { AvatarBadge },
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  data() {
    return {
      loading: false,
      rowPerPage: 10,
      currentPage: 1,
      totalUser: 0,
      searchQuery: '',
      userListStatsMeta,
      users: [] as User[]
    }
  },
  computed: {
    paginationData(): string {
      const firstIndex = this.users.length ? (this.currentPage - 1) * this.rowPerPage + 1 : 0
      const lastIndex = this.users.length + (this.currentPage - 1) * this.rowPerPage
      return `${firstIndex} de ${lastIndex} a ${this.totalUser} utilisateurs`
    },
    totalPage(): number {
      return Math.ceil(this.totalUser / this.rowPerPage) ?? 0
    }
  },
  beforeMount() {
    this.loadStats().then(() => {
      this.fetchUsers()
    })
  },
  methods: {
    avatarText,
    async loadStats() {
      await this.userStore.getAppStatistics()
      this.userListStatsMeta[0].stats = this.userStore.getStats.totalUsers
      this.userListStatsMeta[1].stats = this.userStore.getStats.activeUsers
      this.userListStatsMeta[2].stats = this.userStore.getStats.averageGamesPerUser
      this.userListStatsMeta[3].stats = this.userStore.getStats.totalGamesPlayed
      this.totalUser = this.userStore.getStats.totalUsers
    },
    async fetchUsers() {
      this.loading = true
      const users = await this.userStore.getPaginatedUser({
        currentPage: this.currentPage,
        perPage: this.rowPerPage
      })
      this.users = users
      this.loading = false
    }
  },
  watch: {
    currentPage(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.fetchUsers()
      }
    },
    rowPerPage() {
      this.currentPage = 1
      this.fetchUsers()
    }
  }
})
</script>

<style scoped></style>
