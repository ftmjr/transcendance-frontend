<template>
  <v-card title="Game Record">
    <VTable>
      <thead>
      <tr>
<!--        <th class="text-left">Event</th>-->
        <th class="text-left">Player</th>
        <th class="text-left">Competitor</th>
        <th class="text-left">Result</th>
        <th class="text-left">Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="group in groupedHistories" :key="group.gameId" :class="getTdClass(group.events)">
<!--        <td>-->
<!--            <span v-for="(count, event) in group.events" :key="event">-->
<!--              <v-icon v-if="getIcon(event)">{{ getIcon(event) }}</v-icon>-->
<!--              <span v-if="count > 1">({{ count }})</span>-->
<!--            </span>-->
<!--        </td>-->
        <td>{{ getUserName(group.userId) }}</td>
        <td>{{ getUserName(group.competitorId) }}</td>
        <td>
          <span v-for="(count, event) in group.events" :key="event">
              <v-icon v-if="getIcon(event)">{{ getIcon(event) }}</v-icon>
            </span>
          {{ group.result }}
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
import type { GameHistory } from 'Auth'
import useUserStore from "@/stores/UserStore";
import {User} from "Auth";
import get = Reflect.get;

interface GroupedHistory {
  gameId: number
  events: Record<string, number>
  latestTimestamp: string
}

export default defineComponent({
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  data() {
    return {
      loading: false,
      users: [] as User[]
    }
  },
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
            userId: history.userId,
            competitorId: history.competitorId,
            events: {},
            latestTimestamp: history.timestamp,
            result: 'Left',
          }
        }
        groups[history.gameId].events[history.event] =
            (groups[history.gameId].events[history.event] || 0) + 1
        if (new Date(history.timestamp) > new Date(groups[history.gameId].latestTimestamp)) {
          groups[history.gameId].latestTimestamp = history.timestamp
        }
        if (history.event === 'MATCH_WON') {
          groups[history.gameId].result = 'Won'
        } else if (history.event === 'MATCH_LOST') {
          groups[history.gameId].result = 'Lost'
        } else if (history.event === 'PLAYER_LEFT') {
          groups[history.gameId].result = 'Left'
        }
      })
      this.fetchNames()
      return Object.values(groups).sort((a, b) => b.gameId - a.gameId)
    }
  },
  methods: {
    get,
    getIcon(event: string): string | undefined {
      const icons: Record<string, string> = {
        //GAME_STARTED: 'tabler-play',
        //GAME_ENDED: 'tabler-skull',
        //PLAYER_JOINED: 'tabler-user-plus',
        PLAYER_LEFT: 'mdi-account-arrow-left',
        //ACTION_PERFORMED: 'mdi-soccer',
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
    formatDate,
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
