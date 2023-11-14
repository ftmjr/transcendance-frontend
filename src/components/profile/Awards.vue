<template>
  <p v-if="numberOfWins > 0"> [WINNER WINNER] achievement! : win one game</p>
  <p v-if="numberOfGoals >= 10"> [BIG SCORER] achievement! : scored 10 goals</p>
  <p v-if="numberOfGames > 0 && numberOfLostGames <= 0"> [CLEAN SLATE] achievement: never lost a game</p>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { GameEvent, GameHistory } from '@/interfaces/User'
import useGameStore from '@/stores/GameStore'
export default defineComponent({
  props: {
    histories: {
      type: Array as PropType<GameHistory[]>,
      required: false,
      default: () => []
    },
    colorClass: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => ['bg-red-500/30']
    },
    userId: {
      type: Number,
      required: true
    }
  },
  setup() {
    const gameStore = useGameStore()
    return {
      gameStore
    }
  },
  data() {
    return {
      gameHistories: [] as GameHistory[],
      loading: false
    }
  },
  computed: {
    gameActions(): Record<number, GameHistory[]> {
      return this.gameHistories.reduce(
        (acc, curr) => {
          const gameActions = acc[curr.gameId]
          if (gameActions) {
            gameActions.push(curr)
          } else {
            acc[curr.gameId] = [curr]
          }
          return acc
        },
        {} as Record<number, GameHistory[]>
      )
    },
    numberOfWins(): number {
      return this.gameHistories.filter((gameHistory) => {
        return gameHistory.event === GameEvent.MATCH_WON
      }).length
    },
    numberOfGoals(): number {
      return this.gameHistories.filter((gameHistory) => {
        return gameHistory.event === GameEvent.ACTION_PERFORMED
      }).length
    },
    numberOfLostGames(): number {
      return this.gameHistories.filter((gameHistory) => {
        return gameHistory.event === GameEvent.MATCH_LOST
      }).length
    },
    numberOfGames(): number {
      return this.numberOfWins + this.numberOfLostGames;
    },
  },
  beforeMount() {
    if (!this.histories || this.histories.length === 0) {
      this.fetchHistories()
    } else {
      this.gameHistories = this.histories
    }
  },
  methods: {
    async fetchHistories() {
      this.loading = true
      try {
        this.gameHistories = await this.gameStore.getSimpleGameHistory(this.userId)
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
<style>
    
</style>