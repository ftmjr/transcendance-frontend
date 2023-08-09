<template>
  <header>
    <div class="container text-white">
      <div class="flex justify-between py-4">
        <div>
          <a href="/">Logo</a>
        </div>
        <div>
          <ul class="flex flex-row gap-8">
            <li v-for="route in routes" :key="route.name" class="text-white">
              <router-link :to="{name: route.name}"> {{ route.text }}</router-link>
            </li>
          </ul>
        </div>
        <div class="flex flex-row gap-8 items-center">
          <a href="/profile">Profile</a>
          <base-button
            :onclick="($event) => logout($event)"
            type="text"
            classnames="text-sm text-white border border-white"
            size="medium"
            variant="primary"
          >
            Logout
          </base-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore.ts'
import BaseButton from '@/components/Button.vue'

export default defineComponent({
  name: 'nav-bar',
  components: {
    BaseButton
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      routes: [
        {
          name: 'dashboard',
          text: 'Accueil'
        },
        {
          name: 'profile',
          text: 'Profile'
        }
      ]
    }
  },
  methods: {
    logout(e: Event) {
      e.preventDefault()
      this.authStore.logout()
      this.$router.push({ name: 'auth' })
    }
  }
})
</script>
