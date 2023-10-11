<template>
  <VCard :loading="loading" color="transparent" class="">
    <VCardTitle class="text-center text-lg font-weight-bold my-4">List of Friends</VCardTitle>
    <VRow>
      <VCol cols="12" md="6" v-for="(friend, index) in userStore.contacts" :key="friend.id">
        <div class="bg-slate-700/30 rounded-lg mx-1 mt-8">
          <div class="flex items-center justify-center">
            <VAvatar rounded size="120" class="user-profile-avatar">
              <VImg v-if="friend.profile.avatar" :src="friend.profile.avatar" />
              <VIcon v-else color="primary" icon="tabler-user" />
            </VAvatar>
          </div>
          <div class="relative -top-12">
            <VCardText>
              <p class="text-center text-lg font-weight-bold">
                {{ friend.profile.name }} {{ friend.profile.lastname }}
              </p>
            </VCardText>
            <div class="flex flex-column align-center justify-center gap-4">
              <FriendRequestBox :friend-id="friend.id" />
              <GameStatusBadge
                v-if="gameStatus[index] && friend.profile.status"
                :status="friend.profile.status"
                :user-id="friend.id"
                :user-game-status="gameStatus[index]"
              />
              <VBtnGroup size="small">
                <VBtn
                  size="small"
                  color="blue"
                  variant="outlined"
                  :to="{ name: 'user-profile', params: { userId: friend.id } }"
                >
                  <VIcon left>mdi-account</VIcon>
                  Voir le Profile
                </VBtn>
                <VBtn
                  size="small"
                  color="purple"
                  variant="tonal"
                  :to="{ name: 'dm', params: { friendId: friend.id } }"
                >
                  <VIcon left>mdi-chat</VIcon>
                  Envoyer un DM
                </VBtn>
              </VBtnGroup>
            </div>
          </div>
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useUserStore from '@/stores/UserStore'
import FriendRequestBox from '@/components/profile/FriendRequestBox.vue'
import GameStatusBadge from '@/components/game/GameStatusBadge.vue'
import useGameStore, { GameSession } from '@/stores/GameStore'

export default defineComponent({
  components: { GameStatusBadge, FriendRequestBox },
  setup() {
    const userStore = useUserStore()
    const gameStore = useGameStore()
    return {
      userStore,
      gameStore
    }
  },
  data() {
    return {
      loading: false,
      gameStatus: [] as Array<{ status: 'playing' | 'inQueue' | 'free'; gameSession?: GameSession }>
    }
  },
  computed: {},
  mounted() {
    this.fetchFriends()
  },
  methods: {
    async fetchFriends() {
      this.loading = true
      await this.userStore.loadAllMyFriends()
      await this.fetchAllGameStatus()
      this.loading = false
    },
    async fetchAllGameStatus() {
      const ids = this.userStore.contacts.map((contact) => contact.id)
      this.gameStatus = await this.gameStore.getUsersGameStatus(ids)
    }
  }
})
</script>

<style scoped></style>
