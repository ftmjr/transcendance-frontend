<template>
  <v-card title="Historiques des Actions" :loading="loading">
    <VTable>
      <thead></thead>
      <tbody></tbody>
    </VTable>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatDate } from '@core/utils/formatters'
import useGameStore, { CompleteGameHistory } from '@/stores/GameStore'

export default defineComponent({
  props: {
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
      histories: [] as CompleteGameHistory[],
      loading: false
    }
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
    }
  },
  watch: {
    userId: {
      immediate: true,
      handler() {
        this.fetchHistories()
      }
    }
  }
})
</script>
