<template>
  <div class="relative w-[100%] h-48 bg-orange mb-8 rounded-t-lg">
    <div
      class="absolute bottom-0 left-[5%] translate-y-[30%] z-20 flex flex-row gap-4 items-center"
    >
      <profile-image :avatar="profile?.avatar" />
      <div class="flex flex-col -mt-8 font-extraBold text-sm text-gray-50">
        <span class="">
          {{ profile?.name }}
        </span>
        <span class="">
          {{ profile?.lastname }}
        </span>
      </div>
    </div>
    <div class="absolute top-0 left-0 h-full w-full grid place-items-center">
      <span class="text-4xl -mt-16 uppercase font-bold text-gray-50">{{ user?.username }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useGlobalStore from '@/stores/GlobalStore'
import ProfileImage from '@/components/ProfileImage.vue'
export default defineComponent({
  name: 'profile-card',
  setup() {
    const authStore = useAuthStore()
    const globalStore = useGlobalStore()
    return { authStore, globalStore }
  },
  components: {
    ProfileImage
  },
  computed: {
    user() {
      return this.authStore.getUser
    },
    profile() {
      return this.authStore.getUser?.profile
    }
  },
  data() {
    return {
      loading: false,
      friends: []
    }
  }
})
</script>
