<template>
  <v-card title="Historiques des Actions">
    <VTable>
      <thead>
        <tr>
          <th class="text-left">Événement</th>
          <th class="text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in groupedHistories" :key="group.gameId" :class="getTdClass(group.events)">
          <td>
            <span v-for="(count, event) in group.events" :key="event">
              <v-icon v-if="getIcon(event)">{{ getIcon(event) }}</v-icon>
              <span v-if="count > 1">({{ count }})</span>
            </span>
          </td>
          <td>{{ formatDate(group.latestTimestamp) }}</td>
        </tr>
      </tbody>
    </VTable>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatDate } from '@core/utils/formatters'
import { GameHistory } from 'Auth'

interface GroupedHistory {
  gameId: number
  events: Record<string, number>
  latestTimestamp: string
}

export default defineComponent({
  props: {
    histories: {
      type: Array as PropType<GameHistory[]>,
      required: true
    }
  },
  computed: {
    groupedHistories(): GroupedHistory[] {
      const groups: Record<number, GroupedHistory> = {}
      this.histories.forEach((history: GameHistory) => {
        if (!groups[history.gameId]) {
          groups[history.gameId] = {
            gameId: history.gameId,
            events: {},
            latestTimestamp: history.timestamp
          }
        }
        groups[history.gameId].events[history.event] =
          (groups[history.gameId].events[history.event] || 0) + 1
        if (new Date(history.timestamp) > new Date(groups[history.gameId].latestTimestamp)) {
          groups[history.gameId].latestTimestamp = history.timestamp
        }
      })
      return Object.values(groups).sort((a, b) => b.gameId - a.gameId)
    }
  },
  methods: {
    getIcon(event: string): string | undefined {
      const icons: Record<string, string> = {
        GAME_STARTED: 'tabler-play',
        GAME_ENDED: 'tabler-skull',
        PLAYER_JOINED: 'tabler-user-plus',
        PLAYER_LEFT: 'mdi-account-arrow-left',
        ACTION_PERFORMED: 'mdi-soccer',
        MATCH_WON: 'mdi-trophy',
        MATCH_LOST: 'mdi-skull'
      }
      return icons[event]
    },
    getTdClass(events: Record<string, number>): string {
      if (Object.keys(events).includes('MATCH_WON')) return 'bg-green-400'
      if (Object.keys(events).includes('MATCH_LOST')) return 'bg-red-400'
      return ''
    },
    formatDate
  }
})
</script>
