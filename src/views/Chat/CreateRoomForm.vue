<template>
  <div>
    <div class="text-end mt-2">
      <VBtn
        v-if="$vuetify.display.smAndDown"
        variant="text"
        color="default"
        icon
        size="small"
        @click="$emit('close')"
      >
        <VIcon
          size="18"
          icon="tabler-x"
          color="error"
          class="text-medium-emphasis"
        />
      </VBtn>
    </div>
    <div>
      <VForm
        title="Créer une salle"
        class="px-2"
      >
        <p class="text-center text-lg">
          Créer votre salle
        </p>
        <VTextField
          v-model="roomName"
          label="Nom de la salle"
          placeholder="Entrez le nom de la salle"
          outlined
          dense
          class="mt-4"
        />

        <VBtn
          v-if="!loading"
          color="primary"
          class="mt-4"
          @click="createRoom"
        >
          Créer la salle
        </VBtn>
        <VBtn
          v-else
          color="primary"
          :disabled="true"
          class="mt-4"
        >
          <VProgressCircular
            indeterminate
            :size="24"
            color="primary"
          />
        </VBtn>
      </VForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore from '@/stores/RoomsStore'

export default defineComponent({
  name: 'CreateRoomForm',
  emits: ['close'],
  setup() {
    const roomStore = useRoomsStore()
    return {
      roomStore
    }
  },
  data() {
    return {
      roomName: '',
      roomDescription: '',
      loading: false
    }
  },
  methods: {
    async createRoom() {
      this.loading = true
      console.log('creating room', this.roomName, this.roomDescription)
      this.loading = false
      this.$emit('close')
    }
  }
})
</script>

<style scoped></style>
