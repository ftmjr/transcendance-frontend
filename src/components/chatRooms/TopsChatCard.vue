<template>
  <VCard color="#952175" :loading="loading">
    <template #loader="{ isActive }">
      <v-progress-linear :active="isActive" color="blue" height="20" :indeterminate="true" />
    </template>
    <VCarousel
      v-if="!loading && topRooms.length > 0"
      cycle
      :continuous="false"
      :show-arrows="false"
      hide-delimiter-background
      :delimiter-icon="() => h(VIcon, { icon: 'fa-circle', size: '10' })"
      height="320"
    >
      <VCarouselItem v-for="(room, index) in topRooms" :key="room.id">
        <div class="p-8 h-[320px]">
          <div class="">
            <h6 class="font-weight-semibold text-white">Les Top Chat - {{ index + 1 }}</h6>
          </div>
          <div class="flex h-full">
            <div class="basis-full md:basis-1/2 flex flex-col gap-4">
              <p class="text-xl font-weight-semibold">
                {{ room.name }}
              </p>
              <div class="flex gap-4">
                <div>
                  <VChip label class="me-2">
                    {{ room.members.length }}
                  </VChip>
                  <span>Membres(s)</span>
                </div>
                <div>
                  <VChip label class="me-2">
                    {{ room.type }}
                  </VChip>
                </div>
              </div>
              <div class="flex gap-4">
                <VBtn
                  v-if="!isCurrentUserAMember(room)"
                  color="white"
                  class="text-no-wrap"
                  @click="joinRoom(room.id)"
                >
                  <VIcon left> mdi-account-plus </VIcon>
                  <span>Rejoindre</span>
                </VBtn>
                <VBtn v-else color="white" @click="goToChatRoom(room.id)">
                  <VIcon left> tabler-eye </VIcon>
                  <span>Voir</span>
                </VBtn>
              </div>
            </div>
            <div class="basis-full md:basis-1/2 h-full py-4">
              <img
                v-if="room.avatar"
                :src="room.avatar"
                class="rounded object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </VCarouselItem>
    </VCarousel>
  </VCard>
  <NotificationPopUp v-model:visible="popUpVisible" :snackbar-msg="popUpMessage" />
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import { VIcon } from 'vuetify/components'
import useAuthStore from '@/stores/AuthStore'
import useRoomsStore, { ChatRoomWithMembers } from '@/stores/RoomsStore'
import NotificationPopUp from '@/components/notifications/NotificationPopUp.vue'

export default defineComponent({
  name: 'TopChatCard',
  components: { NotificationPopUp },
  setup() {
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    return {
      authStore,
      roomsStore
    }
  },
  data() {
    return {
      loading: false,
      popUpVisible: false,
      popUpMessage: ''
    }
  },
  computed: {
    VIcon() {
      return VIcon
    },
    topRooms(): ChatRoomWithMembers[] {
      const publicRoom = this.roomsStore.AllPublic
      return publicRoom.slice(0, 3)
    }
  },
  async beforeMount() {
    await this.fetchRooms()
  },
  methods: {
    h,
    async fetchRooms() {
      this.loading = true
      await this.roomsStore.fetchPublicRooms()
      this.loading = false
    },
    isCurrentUserAMember(room: ChatRoomWithMembers) {
      return room.members.some((member) => member.id === this.authStore.getUser?.id)
    },
    goToChatRoom(roomId: number) {
      this.$router.push({ name: 'chat', params: { roomId: roomId } })
    },
    async joinRoom(roomId: number) {
      this.loading = true
      const result = await this.roomsStore.joinRoom(roomId, {
        userId: this.authStore.getUser?.id ?? 0
      })
      if (typeof result === 'string') {
        this.popUpMessage = result
        this.popUpVisible = true
      } else {
        this.popUpMessage = 'Vous avez rejoint le chat avec succès'
        this.popUpVisible = true
      }
      this.loading = false
    }
  }
})
</script>

<style scoped></style>
