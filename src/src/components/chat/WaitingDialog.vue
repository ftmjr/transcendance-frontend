<template>
  <v-dialog v-model="globalStore.dialogs.waiting" max-width="400">
    <v-card>
      <v-card-title>Waiting for the response</v-card-title>
      <v-progress-linear
        color="deep-purple-accent-4"
        indeterminate
        rounded
        height="6"
      ></v-progress-linear>
      <v-card-actions>
        <v-btn color="primary" @click="globalStore.cancelInvite">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useGlobalStore from '@/stores/GlobalStore'
import useChatStore from '@/stores/ChatStore'

export default defineComponent({
  name: 'waiting-dialog',
  setup() {
    const chatStore = useChatStore()
    const globalStore = useGlobalStore()
    return { chatStore, globalStore }
  }
})
</script>

<style scoped></style>
