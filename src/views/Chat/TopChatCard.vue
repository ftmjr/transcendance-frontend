<template>
  <VCard color="#952175" :loading="loading" src="./public/pong/backgrounds/pink_big_bg.png">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear :active="isActive" color="blue" height="64" :indeterminate="true" />
    </template>
    <VCarousel
      cycle
      :continuous="false"
      :show-arrows="false"
      hide-delimiter-background
      :delimiter-icon="() => h(VIcon, { icon: 'fa-circle', size: '10' })"
      height="320"
    >
      <VCarouselItem v-for="(room, index) in topChatsRooms" :key="room.id">
        <VCardText class="h-full">
          <VRow class="h-25">
            <VCol cols="12">
              <h6 class="font-weight-semibold text-white">Les Top Chat - {{ index + 1 }}</h6>
            </VCol>
            <VCol cols="12" sm="6" order="2" order-sm="1">
              <VRow>
                <VCol cols="12" class="pb-0">
                  <p class="text-xl font-weight-semibold">{{ room.name }}</p>
                </VCol>
                <VCol cols="6" class="text-no-wrap">
                  <VChip label class="me-2">
                    {{ room.members.length }}
                  </VChip>
                  <span>Membres(s)</span>
                </VCol>
                <VCol cols="6" class="text-no-wrap">
                  <VChip label class="me-2">
                    {{ room.type }}
                  </VChip>
                </VCol>
                <VCol cols="12" class="pt-2 items-center justify-center">
                  <VBtn
                    v-if="!isCurrentUserAMember(room)"
                    color="white"
                    class="text-no-wrap"
                    @click="joinRoom(room.id)"
                  >
                    <VIcon left>mdi-account-plus</VIcon>
                    <span>Rejoindre</span>
                  </VBtn>
                  <VBtn v-else color="white" @click="goToChatRoom(room.id)">
                    <VIcon left>tabler-eye</VIcon>
                    <span>Voir</span>
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12" sm="6" order="1" order-sm="2">
              <img :src="room.avatar" class="rounded object-cover" />
            </VCol>
          </VRow>
        </VCardText>
      </VCarouselItem>
    </VCarousel>
  </VCard>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import { VIcon } from 'vuetify/components'
import { ChatRoom } from '@/utils/chatSocket'
import useAuthStore from '@/stores/AuthStore'
import useRoomsStore from '@/stores/RoomsStore'

export default defineComponent({
  name: 'TopChatCard',
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
      topChatsRooms: [] as ChatRoom[]
    }
  },
  computed: {
    VIcon() {
      return VIcon
    },
    chats() {
      return this.roomsStore.AllPublic
    }
  },
  beforeMount() {
    this.getPublicTopChats()
  },
  methods: {
    h,
    async getPublicTopChats() {
      this.topChatsRooms = this.chats.slice(0, 3)
    },
    isCurrentUserAMember(room: ChatRoom) {
      return room.members.some((member) => member.id === this.authStore.getUser.id)
    },
    goToChatRoom(roomId: number) {
      // go to chat room
    },
    joinRoom(roomId: number) {
      // join room
    }
  }
})
</script>

<style scoped></style>
