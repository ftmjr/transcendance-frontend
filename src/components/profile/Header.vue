<template>
  <VCard v-if="info">
    <VImg :src="info.coalition.cover_url" :cover="true" max-height="12rem" />
    <VCardText class="justify-center align-bottom d-flex flex-sm-row flex-column gap-x-5">
      <div class="flex">
        <VAvatar rounded size="120" class="mx-auto user-profile-avatar">
          <VImg v-if="info.avatar" :src="info.avatar" />
          <VIcon v-else color="primary" icon="tabler-user" />
        </VAvatar>
        <CoalitionFlag :color="info.coalition.color" :image="info.coalition.image_url" />
      </div>
      <div class="md:pt-6 md:mt-6 user-profile-info w-full pt-sm-0 mt-sm-0">
        <h6 class="mb-3 text-center text-h6 text-sm-start font-weight-semibold">
          {{ info?.fullName }}
        </h6>
        <div class="flex-wrap justify-center gap-4 d-flex align-center justify-sm-space-between">
          <div class="flex-wrap justify-center gap-2 d-flex justify-sm-start flex-grow-1">
            <span class="d-flex">
              <VIcon size="20" icon="tabler-planet" class="me-1" />
              <span class="text-lg font-weight-semibold text-primary">
                {{ info?.username }}
              </span>
            </span>

            <span class="d-flex align-center">
              <VIcon size="20" icon="tabler-calendar" class="me-2" />
              <span class="text-body-1">
                Membre depuis: {{ showDateFormated(info?.joiningDate) }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <FriendRequestBox class="w-full" v-if="id !== 0" :friendId="id" />
    </VCardText>
  </VCard>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { ProfileHeaderData } from 'Auth'
import useAuthStore from '@/stores/AuthStore'
import useUserStore from '@/stores/UserStore'
import FriendRequestBox from '@/components/profile/FriendRequestBox.vue'
import CoalitionFlag from '@/components/profile/CoalitionFlag.vue'

export default defineComponent({
  components: {
    CoalitionFlag,
    FriendRequestBox
  },
  props: {
    info: {
      type: Object as PropType<ProfileHeaderData>,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  setup() {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    return { authStore, userStore }
  },
  computed: {},
  methods: {
    showDateFormated(date): string {
      return new Date(date).toLocaleDateString('fr-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  beforeMount() {}
})
</script>

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
