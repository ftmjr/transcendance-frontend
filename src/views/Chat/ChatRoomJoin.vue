<template>
  <div class="h-full mt-4" v-if="room">
    <div class="flex px-4">
      <div class="basis-full md:basis-3/4 flex flex-col gap-4">
        <span class="text-lg font-semibold text-gray-300">
          {{ room.name }}
        </span>
        <div>
          <VChip label class="me-2">
            {{ room.type }}
          </VChip>
        </div>
        <div class="flex flex-col gap-4 mx-2">
          <VTextField
            v-if="room.password"
            v-model="password"
            :rules="[rules.required]"
            :disabled="isJoining"
            outlined
            dense
            :type="passwordVisibility ? 'text' : 'password'"
            :append-inner-icon="passwordVisibility ? 'tabler-eye-off' : 'tabler-eye'"
            @click:append-inner="passwordVisibility = !passwordVisibility"
            placeholder="Mot de passe, de la salle de discussion"
          />
          <VBtn
            color="white"
            class="text-no-wrap text-sm bg-transparent border hover:bg-white hover:text-[#952175] flex gap-6 iems-center justify-center"
            @click="joinRoom()"
          >
            <span>
              <VIcon left> mdi-account-plus </VIcon>
            </span>
            <span>Rejoindre</span>
          </VBtn>
        </div>
      </div>
      <div class="basis-full md:basis-1/4 h-full py-4">
        <img v-if="room.avatar" :src="room.avatar" class="rounded object-cover h-full w-full" />
      </div>
    </div>
    <NotificationPopUp v-model:visible="popUpVisible" color="error" :snackbar-msg="errorMessage" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore from '@/stores/RoomsStore'

export default defineComponent({
  setup() {
    const roomsStore = useRoomsStore()
    return {
      roomsStore
    }
  },
  data() {
    return {
      password: '',
      passwordVisibility: false,
      isJoining: false,
      popUpVisible: false,
      errorMessage: 'sd',
      rules: {
        required: (value: string) => !!value || 'Ce champ est requis'
      }
    }
  },
  computed: {
    room() {
      return this.roomsStore.getCurrentRoomStatus.room
    }
  },
  methods: {
    async joinRoom() {
      if (!this.roomsStore.currentRoomId) return
      this.isJoining = true
      this.password = this.password.trim()
      const result = await this.roomsStore.joinRoom(this.roomsStore.currentRoomId, {
        userId: this.roomsStore.userId,
        password: this.password ? this.password : undefined
      })
      if (typeof result === 'string') {
        this.errorMessage = result as unknown as string
        this.popUpVisible = true
      }
      this.isJoining = false
    }
  }
})
</script>

<style scoped></style>
