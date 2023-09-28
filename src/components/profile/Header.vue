<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { Coalition, ProfileHeaderData, FriendshipStatus } from 'Auth'
import useAuthStore from '@/stores/AuthStore'
import armadaBanner from '@/assets/images/banners/Armada_banner.jpg'
import legionBanner from '@/assets/images/banners/legion_banner.jpg'
import torrentBanner from '@/assets/images/banners/Torrent_banner.jpg'
import useUserStore from '@/stores/UserStore'

const banners: { [key: string]: string } = {
  Armada: armadaBanner,
  Legion: legionBanner,
  Torrent: torrentBanner
}

export default defineComponent({
  name: 'ProfileHeader',
  props: {
    info: {
      type: Object as PropType<ProfileHeaderData>,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    FriendShipStatus: {
      type: String as PropType<FriendshipStatus>,
      required: true,
      default: () => 'none'
    }
  },
  setup() {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    return { authStore, userStore }
  },
  computed: {
    coverImg(): string {
      return banners[this.info?.coalition as Coalition] || ''
    },
    friendShipState(): string {
      const {
        blockedUsers,
        receivedContactRequests,
        sentContactRequests,
        contacts,
        contactedBy,
        id
      } = this.authStore.getUser

      if (id === this.id) return 'isCurrentUser'
      if (blockedUsers.some((user) => user.id === this.id)) return 'blocked'
      if (receivedContactRequests.some((user) => user.senderId === this.id))
        return 'heWantsToBeFriend'
      if (sentContactRequests.some((user) => user.receiverId === this.id)) return 'iWantToBeFriend'
      if (contactedBy.some((user) => user.userId === this.id)) return 'weAreFriends'
      return 'none'
    },
    requestSent(): boolean {
      return true
    },
    isBlocked(): boolean {
      // return this.userSTore.getBlockedUsers.some((user) => user.id === this.id)
      return true
    }
  },
  methods: {
    async unFriend() {
      const message = await this.userStore.unFriend(this.id)
    },
    async askFriendRequest() {
      const message = await this.userStore.askFriendRequest(this.id)
      alert(message)
    },
    async blockUser() {
      const message = await this.userStore.blockUser(this.id)
    },
    async unBlockUser() {
      const message = await this.userStore.unBlockUser(this.id)
    },
    showDateFormated(date): string {
      return new Date(date).toLocaleDateString()
    },
    async approveFriendRequest() {
      const { receivedContactRequests } = this.authStore.getUser

      // get the id of the frienfship request
      const requestId = receivedContactRequests.find((user) => user.senderId === this.id)?.id

      // approve the friendship request
      const message = await this.userStore.approveFriendRequest(requestId)

      // if the request is approved, change the friendship state
      if (message === 'success') {
        this.friendShipState = 'weAreFriends'
      }
    }
  },
  beforeMount() {
    console.log(this.authStore.getUser)
  }
})
</script>

<template>
  <VCard v-if="info">
    <VImg :src="coverImg" :cover="true" max-height="12rem" />

    <VCardText class="justify-center align-bottom d-flex flex-sm-row flex-column gap-x-5">
      <div class="flex h-0">
        <VAvatar rounded size="120" class="mx-auto user-profile-avatar">
          <VImg v-if="info.avatar" :src="info.avatar" />
          <VIcon v-else color="primary" icon="tabler-user" />
        </VAvatar>
      </div>

      <div class="pt-6 mt-16 user-profile-info w-100 pt-sm-0 mt-sm-0">
        <h6 class="mb-3 text-center text-h6 text-sm-start font-weight-semibold">
          {{ info?.fullName }}
        </h6>

        <div class="flex-wrap justify-center gap-4 d-flex align-center justify-sm-space-between">
          <div class="flex-wrap justify-center gap-2 d-flex justify-sm-start flex-grow-1">
            <span class="d-flex">
              <VIcon size="20" icon="tabler-planet" class="me-1" />
              <span class="text-body-1">
                {{ info?.username }}
              </span>
            </span>

            <span class="d-flex align-center">
              <VIcon size="20" icon="tabler-calendar" class="me-2" />
              <span class="text-body-1">
                {{ showDateFormated(info?.joiningDate) }}
              </span>
            </span>
          </div>
          <div v-if="friendShipState !== 'isCurrentUser'">
            <VBtn
              size="small"
              v-if="friendShipState === 'iWantToBeFriend' || friendShipState === 'none'"
              class="hover:bg-[#F26A4B]/20"
              color="primary"
              :disabled="friendShipState === 'iWantToBeFriend'"
              @click="askFriendRequest"
            >
              {{ friendShipState === 'iWantToBeFriend' ? 'envoyée' : 'Ajouter' }}
            </VBtn>
            <div v-if="friendShipState === 'heWantsToBeFriend'" class="flex gap-2">
              <span> {{ info.fullName }} souhaite vous ajouter en ami </span>
              <VBtn
                size="small"
                class="hover:bg-[#F26A4B]/20"
                color=""
                @click="approveFriendRequest"
              >
                <span class="flex flex-row items-center gap-2">
                  <svg
                    class="w-4 h-4 text-green-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                  <span> Accepter </span>
                </span>
              </VBtn>
              <VBtn size="small" class="hover:bg-[#F26A4B]/20" color="" @click="() => {}">
                <span class="flex flex-row items-center gap-2">
                  <svg
                    class="w-4 h-4 text-red-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span> Refuser </span>
                </span>
              </VBtn>
            </div>

            <VBtn
              size="small"
              v-if="friendShipState === 'weAreFriends'"
              color=""
              class="hover:bg-[#F26A4B]/20"
              @click="unFriend"
              title="Supprimer de la liste d'amis"
            >
              <span class="flex flex-row items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-50"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
                  />
                </svg>
                <span> Supprimer </span>
              </span>
            </VBtn>

            <VBtn
              size="small"
              class="hover:bg-[#F26A4B]/20"
              v-if="friendShipState === 'weAreFriends'"
              @click="unFriend"
              color="none"
            >
              <span class="flex flex-row items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-50"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="m19 2-8.4 7.05a1 1 0 0 1-1.2 0L1 2m18 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1m18 0v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2"
                  />
                </svg>
                <span> Chat </span>
              </span>
            </VBtn>
            <VBtn
              size="small"
              color="none"
              class="hover:bg-[#F26A4B]/20"
              @click="friendShipState === 'blocked' ? unBlockUser : blockUser"
            >
              <span v-if="friendShipState === 'blocked'"> Debloquer </span>
              <span v-else class="flex flex-row items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-50"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
                  />
                </svg>
                <span> Bloquer </span>
              </span>
            </VBtn>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.user-profile-avatar {
  border: 5px solid rgb(var(--v-theme-surface));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  .v-img__img {
    border-radius: 0.125rem;
  }
}
</style>
