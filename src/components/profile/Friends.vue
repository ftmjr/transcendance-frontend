<template>
  <VCard :loading="loading" color="transparent" class="">
    <VCardTitle class="text-center text-lg font-weight-bold my-4">List of Friends</VCardTitle>
    <VRow>
      <VCol cols="12" md="6" v-for="data in userStore.contacts" :key="data.id">
        <div class="bg-slate-700/30 rounded-lg mx-1">
          <div class="flex items-center justify-center">
            <VAvatar rounded size="120" class="user-profile-avatar">
              <VImg v-if="data.profile.avatar" :src="data.profile.avatar" />
              <VIcon v-else color="primary" icon="tabler-user" />
            </VAvatar>
          </div>
          <div class="relative -top-12">
            <VCardText>
              <p class="text-center text-lg font-weight-bold">
                {{ data.profile.name }} {{ data.profile.lastname }}
              </p>
            </VCardText>
            <FriendRequestBox :friend-id="data.id" />
            <!--            <GameStatusBadge status="" user-id="" user-game-status="" />-->
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

export default defineComponent({
  components: { GameStatusBadge, FriendRequestBox },
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  data() {
    return {
      loading: false
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
      this.loading = false
    }
  }
})
</script>

<style scoped></style>
