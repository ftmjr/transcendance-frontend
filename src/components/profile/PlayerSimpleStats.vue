<template>
  <v-card color="transparent">
    <div :class="colorClass">
      <v-card-title class="text-h6">
        [STATS]
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="3"
            class="text-center"
          >
            <VAvatar
              icon="icon-park-twotone:game-three"
              color="primary"
              variant="tonal"
            />
            <p>Parties Jouée(s)</p>
            <p class="font-weight-bold">
              {{ numberOfGames }}
            </p>
          </v-col>
          <v-col
            cols="3"
            class="text-center"
          >
            <VAvatar
              icon="tabler-trophy"
              color="yellow"
            />
            <p>Victoire</p>
            <p class="font-weight-bold">
              {{ numberOfWins }}
            </p>
          </v-col>
          <v-col
            cols="3"
            class="text-center"
          >
            <VAvatar
              icon="ph:soccer-ball-fill"
              color="blue"
              variant="tonal"
            />
            <p>Buts</p>
            <p class="font-weight-bold">
              {{ numberOfGoals }}
            </p>
          </v-col>
          <v-col
            cols="3"
            class="text-center"
          >
            <VAvatar
              icon="tabler-shield-x"
              color="red"
              variant="tonal"
            />
            <p>Défaite(s)</p>
            <p class="font-weight-bold">
              {{ numberOfLostGames }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
  </v-card>
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
      gameHistories: [],
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
    numberOfGames(): number {
      return Object.keys(this.gameActions).length
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
    }
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

<style scoped></style>
