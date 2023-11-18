<template>
  <div class="flex items-center justify-end gap-6">
    <v-switch v-model="banned" color="primary" label="Bannir" hide-details></v-switch>
    <v-btn
      :disabled="stateOfIsBanned === banned || isLoading"
      @click="handleUpdateIsBanned"
      color="primary"
      text
      size="small"
      class="text-xs"
    >
      Sauvegarder
    </v-btn>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  stateOfIsBanned: {
    type: Boolean,
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
const banned = ref(props.stateOfIsBanned)

const handleUpdateIsBanned = async (e: Event) => {
  e.preventDefault()
  try {
    if (banned.value == props.stateOfIsBanned) return
    isLoading.value = true
    console.log(
      `trying to ${banned.value ? 'banne' : 'unbanne'} user ${props.userId} in room ${props.roomId}`
    )
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>
<style></style>
