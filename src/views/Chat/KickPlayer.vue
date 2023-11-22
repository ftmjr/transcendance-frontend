<template>
  <div class="flex items-center justify-end gap-6">
    <v-btn
      :disabled="isLoading"
      @click="handleUpdateKick"
      color="primary"
      text
      size="large"
      class="text-xs"
    >
      Sortir de force
    </v-btn>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import useRoomsStore from '@/stores/RoomsStore'

const roomsStore = useRoomsStore()

const props = defineProps({
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

const handleUpdateKick = async (e: Event) => {
  e.preventDefault()
  try {
    isLoading.value = true
    await roomsStore.kickMember(props.roomId, props.userId)
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
</script>
<style></style>
