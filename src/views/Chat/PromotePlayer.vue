<template>
  <div class="flex items-center gap-6">
    <v-select
      :disabled="playerRole === role || isLoading"
      v-model="role"
      label="Select"
      :items="rolesList"
      variant="outlined"
    ></v-select>

    <v-btn
      :disabled="playerRole === role"
      @click="tryToMute"
      color="primary"
      text
      size="small"
      class="text-xs"
      >Sauvegarder</v-btn
    >
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const rolesList = ['admin', 'moderator', 'player']

const props = defineProps({
  playerRole: {
    type: String,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  roomId: {
    type: Number,
    required: true
  }
})

const isLoading = ref(false)
const role = ref(rolesList[0])

const tryToMute = async (e: Event) => {
  e.preventDefault()
  try {
    if (role.value === props.playerRole) return
    isLoading.value = true
    console.log(`trying to promote user ${props.userId} in room ${props.roomId}`)
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>
<style></style>
