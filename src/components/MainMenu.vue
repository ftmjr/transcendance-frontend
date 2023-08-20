<template>
  <nav class="mt-1 w-11/12 rounded-md">
    <ul class="flex flex-col gap-8">
      <li v-for="(route, index) in menuRoutes" :key="index">
      <RouterLink :to="route.name" class="text-white flex items-center gap-2 text-3xl py-2 hover:bg-darkBlue hover:rounded-sm px-2">
        <component :is="route.icon" b-class="w-8 h-8 text-currentColor dark:text-white" />
        <span>{{route.text}}</span>
      </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { initFlowbite } from 'flowbite'
import useAuthStore from '@/stores/AuthStore'
import ChatIcon from "@/components/icons/Chat.vue"
import UserCircle from "@/components/icons/UserCircle.vue"

export default defineComponent({
  name: 'main-menu',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  components:{
    ChatIcon,
    UserCircle
  },
  data() {
    return {
      menuRoutes: [
        {
          name: 'profile',
          text: 'Profile',
          icon: 'UserCircle'
        },
        {
          name: 'game',
          text: 'Game Test',
          icon: ''
        },
        {
          name: 'chat',
          text: "Chat",
          icon: "ChatIcon"
        },
        {
          name: 'settings',
          text: 'Settings',
          icon: "Setting"
        },
      ],
      userRoutes: [
        {
          name: 'profile', // to be changed to real route name
          text: 'Réglages'
        },
        {
          name: 'profile', // to be changed to real route name
          text: 'Awards'
        },
        {
          name: 'profile', // to be changed to real route name
          text: 'Historique'
        }
      ]
    }
  },
  computed: {
    user() {
      return this.authStore.user
    },
    profile() {
      return this.user?.profile
    }
  },
  mounted() {
    initFlowbite()
  },
  methods: {
    async logout() {
      await this.authStore.logout()
    }
  }
})
</script>

<style scoped></style>
