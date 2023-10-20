<template>
  <v-dialog max-width="400">
    <v-card>
      <v-card-title>You received an invite to play Pong</v-card-title>
      <v-card-title>From: {{ globalStore.invite.username }}</v-card-title>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="globalStore.acceptInvite"
        >
          Accept
        </v-btn>
        <v-btn
          color="primary"
          @click="globalStore.rejectInvite"
        >
          Reject
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useGlobalStore from '@/stores/GlobalStore'

export default defineComponent({
  name: 'InviteDialog',
  setup() {
    const globalStore = useGlobalStore()
    return { globalStore }
  }
})
</script>

<style scoped></style>
