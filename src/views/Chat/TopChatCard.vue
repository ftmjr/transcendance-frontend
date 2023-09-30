<template>
  <VCard color="#952175" :loading="loading" src="./public/pong/backgrounds/pink_big_bg.png">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear :active="isActive" color="blue" height="4" :indeterminate="true" />
    </template>
    <VCarousel
      cycle
      :continuous="false"
      :show-arrows="false"
      hide-delimiter-background
      :delimiter-icon="() => h(VIcon, { icon: 'fa-circle', size: '10' })"
      height="auto"
      class=""
    >
      <VCarouselItem v-for="(room, index) in topChatsRooms" :key="room.id">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <h6 class="font-weight-semibold text-white mb-1">Les Top Chat - {{ index + 1 }}</h6>
            </VCol>
            <VCol cols="12" sm="6" order="2" order-sm="1">
              <VRow>
                <VCol cols="12" class="pb-0">
                  <p class="text-xl font-weight-semibold">{{ room.name }}</p>
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12" sm="6" order="1" order-sm="2" class="position-relative text-center">
              <img :src="room.avatar" class="inset-1.5 rounded" />
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
import axiosInstance from '@/utils/axios'
import { ChatRoom } from '@/utils/chatSocket'

export default defineComponent({
  name: 'TopChatCard',
  data() {
    return {
      loading: false,
      topChatsRooms: [] as ChatRoom[],
      chats: [] as ChatRoom[]
    }
  },
  computed: {
    VIcon() {
      return VIcon
    }
  },
  beforeMount() {
    this.getPublicTopChats()
  },
  methods: {
    h,
    async getPublicTopChats() {
      this.loading = true
      try {
        const { data } = await axiosInstance.get<ChatRoom[]>('/chat/public', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        this.chats = data
        this.topChatsRooms = this.chats.slice(0, 3)
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    }
  }
})
</script>

<style scoped></style>
