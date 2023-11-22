<template>
  <div class="relative h-full mt-4" v-if="room">
    <div
      v-if="canViewMessagesList"
      class="absolute left-0 z-10 w-full h-full -top-[40px]"
      :class="[]"
    >
      <chat-room-message-list />
    </div>
    <div class="relative z-20 flex flex-col items-start justify-center h-full px-4">
      <div class="flex flex-col items-center justify-center w-full gap-4 md:flex-row">
        <div class="">
          <span class="text-4xl font-semibold text-gray-300">
            {{ room.name }}
          </span>
          <div class="my-4">
            <VChip label class="me-2">
              {{ room.type }}
            </VChip>
          </div>
        </div>
        <div class="py-4 w-72 h-72">
          <img v-if="room.avatar" :src="room.avatar" class="object-cover w-full h-full rounded" />
        </div>
      </div>
      <v-divider class="mx-auto w-72" />
      <div class="flex flex-col gap-4 mx-auto my-8">
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
          color="primary"
          size="large"
          class="inline-flex w-64 py-4 text-sm bg-transparent border hover:bg-white hover:text-[#952175] gap-6 iems-center justify-center"
          @click="joinRoom()"
        >
          <span class="mr-2">
            <VIcon left> mdi-account-plus </VIcon>
          </span>
          <span>Rejoindre</span>
        </VBtn>
      </div>
    </div>
    <NotificationPopUp v-model:visible="popUpVisible" color="error" :snackbar-msg="errorMessage" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore from '@/stores/RoomsStore'
import ChatRoomMessageList from './ChatRoomMessageList.vue'
import { RoomType } from '@/utils/chatSocket'

export default defineComponent({
  components: {
    ChatRoomMessageList
  },
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
    },
    canViewMessagesList() {
      return this.room?.type === RoomType.PUBLIC
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
