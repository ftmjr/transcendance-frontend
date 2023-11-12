<template>
  <v-card class="mx-auto" max-width="">
    <v-card-title> THE PONG LEADERBOARD </v-card-title>

    <v-divider />

    <v-virtual-scroll v-if="!loading" :items="users" height="500" item-height="48">
      <template #default="{ item, index }">
        <v-list-item
          :style="index === 0 ? 'font-weight: bold; color: #99842e;' : ''"
          :title="index == 0 ? item.username + ' <PONG BOSS>' : item.username"
          :subtitle="`Wins: ${getCountByEvent(
            item?.gameHistories,
            'MATCH_WON'
          )}  Loss: ${getCountByEvent(item?.gameHistories, 'MATCH_LOST')}`"
        >
          <template #prepend>
            <v-avatar
              :size="60"
              :class="{
                'special-avatar-gold': index === 0, // Apply gold style for 1st place
                'special-avatar-silver': index === 1, // Apply silver style for 2nd place
                'special-avatar-bronze': index === 2, // Apply bronze style for 3rd place
                'special-avatar-trans': index > 2 // Apply bronze style for 3rd place
              }"
            >
              {{ index + 1 }}
            </v-avatar>
            <AvatarBadge :user-id="item.id" :user="item" />
          </template>
          <template #append>
            <GameStatusBadge
              v-if="item.gameStatus && item.id !== authStore.user?.id"
              :user-game-status="item.gameStatus"
              :user-id="item.id"
              :status="item?.profile?.status"
            />
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useUserStore, { UserWithScore } from '@/stores/UserStore'
import AvatarBadge from '@/components/profile/AvatarBadge.vue'
import GameStatusBadge from '@/components/game/GameStatusBadge.vue'
import useGameStore from '@/stores/GameStore'
import { GameEvent, GameHistory } from "@/interfaces/User";

export default defineComponent({
  name: 'LeaderBoardView',
  components: { GameStatusBadge, AvatarBadge },
  setup() {
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const gameStore = useGameStore()
    return {
      userStore,
      authStore,
      gameStore
    }
  },
  data() {
    return {
      users: [] as UserWithScore[],
      loading: false,
    }
  },
  async beforeMount() {
    await this.fetchUsersGameStatusAndScores();
  },
  methods: {
    getCountByEvent(gameHistories: GameHistory[] | undefined, event: GameEvent) {
      if (!gameHistories) return 0;
      return gameHistories.filter((history) => history.event === event).length
    },
    async fetchUsersGameStatusAndScores() {
      this.loading = true;
      const users = await this.userStore.getPaginatedUsersWithScore({ take: 100 })
      const usersIds = users.map((user) => user.id)
      const usersGameStatus = await this.gameStore.getUsersGameStatus(usersIds);
      this.users = users.map((user, index) => {
        const userGameStatus = usersGameStatus[index]
        return {
          ...user,
          gameStatus: userGameStatus
        }
      })
      this.loading = false;
    }
  }
})
</script>

<style lang="css">
.texte {
  color: white;
}
.special-avatar-gold {
  background-color: gold; /* Define gold style */
  /* Add any other custom styling for gold here */
}

.special-avatar-silver {
  background-color: silver; /* Define silver style */
  /* Add any other custom styling for silver here */
}

.special-avatar-bronze {
  background-color: #cd7f32; /* Define bronze style */
  /* Add any other custom styling for bronze here */
}

.special-avatar-trans {
  background-color: transparent; /* Define bronze style */
  /* Add any other custom styling for bronze here */
}
</style>
