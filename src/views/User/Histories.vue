<template>
  <v-card title="Historiques des Actions" :loading="loading">
    <VTable>
      <thead>
        <tr>
          <th>Opposant</th>
          <th>Date</th>
          <th>Résultat</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="history in histories" :key="history.gameId">
        <td>
          <div>
            {{ getUserName(getOpponentId(history)) }}
          </div>
        </td>
        <td>{{ getDate(history) }}</td>
        <td>{{ getIsUserWon(history) ? 'Victoire' : 'Perdu/Abandon' }}</td>
        <td>
          {{ getActions(history) }}
        </td>
      </tr>
      </tbody>
    </VTable>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { formatDate } from '@core/utils/formatters'
import useGameStore, { CompleteGameHistory, GameSessionType } from '@/stores/GameStore'
import useUserStore from "@/stores/UserStore";
import {User} from "Auth";
import AvatarBadge from '@/components/profile/AvatarBadge.vue'

// TODO: This component is not finished yet, need to be refatored to display correctly
export default defineComponent({
  components: {
    // AvatarBadge
  },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  setup() {
    const userStore = useUserStore()
    const gameStore = useGameStore()
    return {
      gameStore,
      userStore
    }
  },
  data() {
    return {
      histories: [] as CompleteGameHistory[],
      users: [] as User[],
      loading: false
    }
  },
  mounted() {
    this.fetchNames()
  },
  methods: {
    formatDate,
    async fetchHistories() {
      this.loading = true
      try {
        this.histories = await this.gameStore.getUserCompleteGameHistory(this.userId)
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    getGameType(gameHistory: CompleteGameHistory): GameSessionType {
      // Determine the game type base on game name
      switch (gameHistory.gameName) {
        case 'Bot Game':
          return GameSessionType.Bot
        case 'QueList Game':
          return GameSessionType.QueListGame
        case 'Challenge Game':
        default:
          return GameSessionType.PrivateGame
      }
    },
    getPlayersIds(gameHistory: CompleteGameHistory): number[] {
      const ids = Object.keys(gameHistory.histories)
      return ids.map((id) => parseInt(id, 10))
    },
    getOpponentId(gameHistory: CompleteGameHistory): number | null {
      const gameType = this.getGameType(gameHistory)
      if (gameType === GameSessionType.Bot) {
        return 0
      }
      // find the first one different from the user
      const playersId = this.getPlayersIds(gameHistory)
      const opponentId = playersId.find((id) => id !== this.userId)
      if (!opponentId) {
        return null
      }
      return opponentId
    },
    getDate(gameHistory: CompleteGameHistory): string {
      // find the last history in the gameHistory
      const eventOfCurrentUser = Object.values(gameHistory.histories).find((UserHistories) => {
        return UserHistories.find((userHistory) => userHistory.userId === this.userId)
      })
      if (!eventOfCurrentUser) {
        return ''
      }
      const timestamp = eventOfCurrentUser[0].timestamp
      return formatDate(timestamp)
    },
    getIsUserWon(gameHistory: CompleteGameHistory) {
      const winner = gameHistory.winnerId
      return winner === this.userId
    },
    getActions(gameHistory: CompleteGameHistory): string {
      //
      const usersHistories = Object.values(gameHistory.histories)
      const goals = usersHistories.map((userHistory) => {
        const goals = userHistory.filter((hist) => hist.event === 'ACTION_PERFORMED')
        return {
          userId: userHistory[0].userId,
          goals: goals.length
        }
      })
      const goalStrings = goals.map((goal) => `${goal.goals}`);
      const goalsString = goalStrings.join(' vs ');
      return goalsString;
    },
    async fetchNames() {
      this.loading = true
      const users = await this.userStore.getAllUsers(100)
      this.users = users
      this.loading = false
    },
    getUserName(userId: number): string {
      if (userId === 0) return 'AI BOT'
      const user = this.users.find((user) => user.id === userId)
      return user ? user.username : ''
    }
  }
})
</script>
