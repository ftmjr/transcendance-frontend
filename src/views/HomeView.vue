<template>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <TopChatCard />
    </VCol>
    <VCol>
      <PlayerSimpleStats
        v-if="authStore.getUser"
        :histories="authStore.getUser.gameHistories"
        :user-id="authStore.getUser.id"
        :color-class="colorClasses"
      />
    </VCol>
  </VRow>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import TopChatCard from '@/components/chatRooms/TopsChatCard.vue'
import PlayerSimpleStats from '@/components/profile/PlayerSimpleStats.vue'

export default defineComponent({
  components: { PlayerSimpleStats, TopChatCard },
  setup() {
    const authStore = useAuthStore()
    const coalition = authStore.getCoalition
    const colorClasses = [`bg-[${coalition.color}]`, 'bg-opacity-30']
    return { authStore, colorClasses }
  }
})
</script>
