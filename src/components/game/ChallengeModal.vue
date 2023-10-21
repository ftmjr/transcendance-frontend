<template>
  <VDialog v-model="isDialogVisible" max-width="600">
    <template #activator="{ props }">
      <VBtn v-bind="props" variant="outlined" size="small">
        Challenge <v-icon left> mdi-sword-cross </v-icon>
      </VBtn>
    </template>
    <VBtn icon class="v-dialog-close-btn" @click="isDialogVisible = !isDialogVisible">
      <VIcon icon="tabler-x" />
    </VBtn>
    <VCard title="Règles du jeu">
      <VAlert v-if="isDialogError" type="error" dismissible>
        {{ errorMsg }}
      </VAlert>
      <VCardText>
        <VRow>
          <VCol>
            <v-row class="mb-4" justify="space-between">
              <VCol class="text-left">
                <span class="text-h2 font-weight-light" v-text="gameRulesFields.maxScore" />
                <span class="subheading font-weight-light me-1">Buts</span>
              </VCol>
              <VCol class="text-right">
                <v-slider
                  v-model="gameRulesFields.maxScore"
                  :color="color"
                  track-color="grey"
                  min="2"
                  max="20"
                  :step="1"
                  show-ticks
                >
                  <template #prepend>
                    <v-btn
                      size="small"
                      variant="text"
                      icon="mdi-minus"
                      :color="color"
                      @click="decrement"
                    />
                  </template>
                  <template #append>
                    <v-btn
                      size="small"
                      variant="text"
                      icon="mdi-plus"
                      :color="color"
                      @click="increment"
                    />
                  </template>
                </v-slider>
              </VCol>
            </v-row>
          </VCol>
          <VCol cols="12">
            <VAutocomplete
              v-model="gameRulesFields.theme"
              :items="themes"
              item-value="name"
              item-title="name"
              label="Theme"
              variant="outlined"
            >
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item?.raw?.name"
                  :color="item.raw.color"
                  :active-color="item.raw.color"
                  :class="item?.raw?.styleClassName"
                />
              </template>
            </VAutocomplete>
          </VCol>
        </VRow>
      </VCardText>
      <VCardText class="flex justify-end flex-wrap gap-3 items-center">
        <VAlert v-if="status !== 'Online'" type="warning" variant="outlined" dismissible>
          You can't challenge this player because he is not online
        </VAlert>
        <VBtn variant="tonal" color="secondary" @click="isDialogVisible = false"> Fermer </VBtn>
        <VBtn :disabled="!canBeChallenged" @click="startChallenge"> Challenger </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { computed, PropType, reactive, ref, watch } from 'vue'
import useGameStore, { GameSession } from '@/stores/GameStore'
import type { PongTheme } from '@/Game/pong-scenes/Assets'
import { Status } from '@/interfaces/User'

const props = defineProps({
  userGameStatus: {
    type: Object as PropType<{
      status: 'playing' | 'inQueue' | 'free'
      gameSession?: GameSession
    }>,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  status: {
    type: String as PropType<Status>,
    required: true
  }
})
const gameStore = useGameStore()
const isDialogVisible = ref(false)
const isDialogLoading = ref(false)
const isDialogError = ref(false)
const errorMsg = ref('')

const themes = ref<
  Array<{
    name: PongTheme
    styleClassName: string[]
    color: string
  }>
>([
  { name: 'Classic', styleClassName: ['classic-theme-bg', 'bg-dark-100'], color: 'dark' },
  { name: 'Arcade', styleClassName: ['arcade-theme-bg bg', 'bg-blue-300'], color: 'sky-blue' },
  { name: 'Soccer', styleClassName: ['soccer-theme-bg', 'bg-green-300'], color: 'light-green' }
])

const gameRulesFields = reactive({
  maxScore: 12,
  maxTime: 300,
  theme: 'Classic' as PongTheme
})

// computed can be challenged or not (if user is playing or in queue)
// if user is playing or in queue, we can't challenge him
// if user is free, we can challenge him if status is online
const canBeChallenged = computed(() => {
  return props.userGameStatus?.status === 'free' && props.status === Status.Online
})

const color = computed<string>(() => {
  if (gameRulesFields.maxScore < 5) return 'red'
  if (gameRulesFields.maxScore < 8) return 'orange'
  if (gameRulesFields.maxScore <= 12) return 'success'
  if (gameRulesFields.maxScore < 18) return 'teal'
  return 'indigo'
})

const increment = () => {
  if (gameRulesFields.maxScore < 20) {
    gameRulesFields.maxScore++
  }
}
const decrement = () => {
  if (gameRulesFields.maxScore > 2) {
    gameRulesFields.maxScore--
  }
}

const startChallenge = async () => {
  isDialogLoading.value = true
  const r = await gameStore.startGameAgainstPlayer(props.userId as number, gameRulesFields)
  isDialogLoading.value = false
  if (r !== 'preparing') {
    isDialogError.value = true
    errorMsg.value = r
  } else {
    isDialogVisible.value = false
  }
}

// set all fields to default values when dialog is closed
watch(isDialogVisible, (newVal) => {
  if (!newVal) {
    gameRulesFields.maxScore = 12
    gameRulesFields.maxTime = 300
    gameRulesFields.theme = 'Classic'
    errorMsg.value = ''
    isDialogError.value = false
  }
})
</script>

<style scoped>
.classic-theme-bg {
  background-color: #000;
}
.arcade-theme-bg {
  background-image: url('public/pong/arcade/back_blue.png');
  background-size: cover;
}
.soccer-theme-bg {
  background-image: url('public/pong/soccer/ground_grass.png');
}
</style>
