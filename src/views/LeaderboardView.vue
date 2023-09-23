<template>
  <v-card class="mx-auto" max-width="500">
    <v-card-title> THE PONG LEADERBOARD </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll :items="users" height="320" item-height="48">
      <template v-slot:default="{ item, index }">
        <v-list-item
          :style="index === 0 ? 'font-weight: bold; color: #99842e;' : ''"
          :title="index == 0 ? item.username + ' <PONG BOSS>' : item.username"
          :subtitle="`Wins: ${getCountByEvent(
            item.gameHistories,
            'MATCH_WON'
          )}  Loss: ${getCountByEvent(item.gameHistories, 'MATCH_LOST')}`"
        >
          <template v-slot:prepend>
            <AvatarBadge :profile="item.profile" :username="item.username" />
          </template>

          <template v-slot:append>
            <v-avatar
              :size="index < 3 ? 60 : 30"
              :class="{
                'special-avatar-gold': index === 0, // Apply gold style for 1st place
                'special-avatar-silver': index === 1, // Apply silver style for 2nd place
                'special-avatar-bronze': index === 2 // Apply bronze style for 3rd place
              }"
            >
              {{ index + 1 }}
            </v-avatar>
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
// import useUsersStore from '@/stores/UsersStore'
// import useGlobalStore from '@/stores/GlobalStore'
// import InviteDialog from '@/components/chat/InviteDialog.vue'
export default defineComponent({
  name: 'learderboard-view',
  setup() {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    return {
      authStore,
      userStore
    }
  },
  data() {
    return {
      users: [] as UserWithScore[]
    }
  },
  async beforeMount() {
    this.users = await this.userStore.getPaginatedUsersWithScore({})
  },
  methods: {
    getCountByEvent(gameHistories, event) {
      return gameHistories.filter((history) => history.event === event).length
    }
  },
  components: { AvatarBadge }
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
</style>
