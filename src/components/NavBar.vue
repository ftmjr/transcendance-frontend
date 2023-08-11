<template>
  <nav class="mt-1 w-11/12 rounded-md bg-lightDarkBlue">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <RouterLink :to="{ name: 'dashboard' }" class="flex items-center">
        <img src="/logo_test.png" class="h-8 mr-3" alt="Logo" />
      </RouterLink>
      <div class="flex items-center md:order-2">
        <button
          type="button"
          class="flex mr-3 text-sm bg-black rounded-full md:mr-0 focus:ring-4 focus:ring-secondary"
          id="user-menu-button"
          aria-expanded="false"
          data-dropdown-toggle="user-dropdown"
          data-dropdown-placement="bottom"
        >
          <span class="sr-only">Ouvrir le menu utilisateur</span>
          <img class="w-8 h-8 rounded-full" :src="profile?.avatar" alt="user photo" />
        </button>
        <!-- Dropdown menu -->
        <div
          class="z-50 hidden my-4 text-base list-none bg-slate-800 divide-y divide-secondary rounded-lg shadow dark:bg-lightDarkBlue"
          id="user-dropdown"
        >
          <div class="px-4 py-3">
            <span class="block text-sm text-white">{{ user?.username }}</span>
            <span class="block text-sm text-secondary truncate">{{ user?.email }}</span>
          </div>
          <ul class="py-2" aria-labelledby="user-menu-button">
            <li v-for="(route, index) in userRoutes" :key="index">
              <RouterLink
                :to="{ name: route.name }"
                class="block px-4 py-2 text-sm text-white hover:bg-lightDarkBlue"
              >
                {{ route.text }}
              </RouterLink>
            </li>
            <li>
              <button
                @click="logout"
                class="block w-full px-4 py-2 text-sm text-left text-white bg-orange hover:bg-lightDarkBlue"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
        <button
          data-collapse-toggle="navbar-user"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-secondary rounded-lg md:hidden hover:bg-lightDarkBlue focus:outline-none focus:ring-2 focus:ring-secondary"
          aria-controls="navbar-user"
          aria-expanded="false"
        >
          <span class="sr-only">Ouvrir le menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-user"
      >
        <ul
          class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-secondary rounded-lg bg-lightDarkBlue md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent"
        >
          <li v-for="(route, index) in menuRoutes" :key="index">
            <RouterLink
              :to="{ name: route.name }"
              class="block py-2 pl-3 pr-4 text-white bg-purpleBlue rounded md:bg-transparent md:text-white md:p-0"
              aria-current="page"
            >
              {{ route.text }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { initFlowbite } from 'flowbite'
import useAuthStore from '@/stores/AuthStore'

export default defineComponent({
  name: 'NavBar',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      menuRoutes: [
        {
          name: 'profile',
          text: 'Profile'
        },
        {
          name: 'game',
          text: 'Game Test'
        }
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
