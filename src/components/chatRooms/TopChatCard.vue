<template>
  <VCard
    color="#952175"
    :loading="loading"
  >
    <template #loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="blue"
        height="20"
        :indeterminate="true"
      />
    </template>
    <VCarousel
      cycle
      :continuous="false"
      :show-arrows="false"
      hide-delimiter-background
      :delimiter-icon="() => h(VIcon, { icon: 'fa-circle', size: '10' })"
      height="320"
    >
      <VCarouselItem
        v-for="(room, index) in topRooms"
        :key="room.id"
      >
        <VCardText class="h-full">
          <VRow class="h-25">
            <VCol cols="12">
              <h6 class="font-weight-semibold text-white">
                Les Top Chat - {{ index + 1 }}
              </h6>
            </VCol>
            <VCol
              cols="12"
              sm="6"
              order="2"
              order-sm="1"
            >
              <VRow>
                <VCol
                  cols="12"
                  class="pb-0"
                >
                  <p class="text-xl font-weight-semibold">
                    {{ room.name }}
                  </p>
                </VCol>
                <VCol
                  cols="6"
                  class="text-no-wrap"
                >
                  <VChip
                    label
                    class="me-2"
                  >
                    {{ room.members.length }}
                  </VChip>
                  <span>Membres(s)</span>
                </VCol>
                <VCol
                  cols="6"
                  class="text-no-wrap"
                >
                  <VChip
                    label
                    class="me-2"
                  >
                    {{ room.type }}
                  </VChip>
                </VCol>
                <VCol
                  cols="12"
                  class="pt-2 items-center justify-center"
                >
                  <VBtn
                    v-if="!isCurrentUserAMember(room)"
                    color="white"
                    class="text-no-wrap"
                    @click="joinRoom(room.id)"
                  >
                    <VIcon left>
                      mdi-account-plus
                    </VIcon>
                    <span>Rejoindre</span>
                  </VBtn>
                  <VBtn
                    v-else
                    color="white"
                    @click="goToChatRoom(room.id)"
                  >
                    <VIcon left>
                      tabler-eye
                    </VIcon>
                    <span>Voir</span>
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
            <VCol
              cols="12"
              sm="6"
              order="1"
              order-sm="2"
            >
              <img
                v-if="room.avatar"
                :src="room.avatar"
                class="rounded object-cover"
              >
            </VCol>
          </VRow>
        </VCardText>
      </VCarouselItem>
    </VCarousel>
  </VCard>
  <NotificationPopUp
    v-model:visible="popUpVisible"
    :snackbar-msg="popUpMessage"
  />
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
  methods: {
    h,
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
