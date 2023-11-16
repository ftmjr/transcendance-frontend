<template>
  <div class="h-full">
    <div class="flex align-center text-medium-emphasis my-1">
      <!-- menu button when sm-->
      <VBtn
        variant="text"
        color="default"
        icon
        size="small"
        class="d-md-none me-3"
        :active="isLeftSidebarOpenLocal"
        @click="isLeftSidebarOpenLocal = !isLeftSidebarOpenLocal"
      >
        <VIcon size="24" icon="tabler-menu-2" />
      </VBtn>
    </div>
    <VDivider class="my-1" />
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
    <NotificationPopUp v-model:visible="popUpVisible" :snackbar-msg="errorMessage" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ChatRoom, ChatRoomMember } from '@/utils/chatSocket'
import useRoomsStore from '@/stores/RoomsStore'
import useAuthStore from '@/stores/AuthStore'
import NotificationPopUp from '@/components/notifications/NotificationPopUp.vue'

export default defineComponent({
  components: { NotificationPopUp },
  props: {
    room: {
      type: Object as PropType<ChatRoom>,
      required: true
    },
    isLeftSidebarOpen: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['update:isLeftSidebarOpen', 'joinRoom'],
  setup() {
    const roomsStore = useRoomsStore()
    const authStore = useAuthStore()
    return {
      roomsStore,
      authStore
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
    isLeftSidebarOpenLocal: {
      get(): boolean {
        return this.isLeftSidebarOpen
      },
      set(value: boolean) {
        this.$emit('update:isLeftSidebarOpen', value)
      }
    }
  },
  methods: {
    async joinRoom() {
      this.isJoining = true
      this.password = this.password.trim()
      const result = this.roomsStore.joinRoom(this.room.id, {
        userId: this.authStore.getUser?.id ?? 0,
        password: this.password
      })
      if (typeof result === 'string') {
        this.errorMessage = result as unknown as string
        this.popUpVisible = true
      } else {
        const member = result as unknown as ChatRoomMember
        this.popUpVisible = true
        this.errorMessage = `Vous avez rejoint la salle de discussion ${this.room.name}`
        this.$nextTick(() => {
          this.$emit('joinRoom', member.chatroomId)
        })
      }
      this.isJoining = false
    }
  }
})
</script>

<style scoped></style>
