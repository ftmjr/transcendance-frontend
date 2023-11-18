<template>
  <div class="flex items-center gap-6">
    <v-select
      :disabled="stateOfIsMuted"
      v-model="delay"
      label="Select"
      :items="delayList"
      variant="outlined"
    ></v-select>
    <v-switch v-model="isMuted" color="primary" label="Mute" hide-details></v-switch>
    <v-btn
      :disabled="isMuted === stateOfIsMuted || isLoading"
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

const delayList = [
  '30 sec',
  '1 min',
  '5 min',
  '10 min',
  '30 min',
  '1 h',
  '1 j',
  '1 sem',
  '1 mois',
  '1 an'
]

const props = defineProps({
  stateOfIsMuted: {
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
const isMuted = ref(props.stateOfIsMuted)
const delay = ref(delayList[0])

const tryToMute = async (e: Event) => {
  e.preventDefault()
  try {
    if (isMuted.value == props.stateOfIsMuted) return
    isLoading.value = true
    console.log(`trying to mute user`)
  } catch (error) {
    console.log(error)
  }
}
</script>
<style></style>
