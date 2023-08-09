<template>
  <header>
    <div class="container text-white">
      <div class="flex justify-between py-4">
        <div>
          <a href="/">Logo</a>
        </div>
        <div>
          <ul class="flex flex-row gap-8">
            <li v-for="route in routes" class="text-white">
              <router-link :to="route.path">{{ route.name }}</router-link>
            </li>
          </ul>
        </div>
        <div class="flex flex-row gap-8 items-center">
          <a href="/profile">Profile</a>
          <base-button
            :onclick="($event) => logout($event)"
            text="Logout"
            type="text"
            classnames="text-sm text-white border border-white"
            size="medium"
            variant="primary"
          ></base-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { RouterLink } from 'vue-router'
import useAuthStore from '@/stores/AuthStore.ts'

const BaseButton = defineAsyncComponent(() => import('@/components/Button.vue'))

export default defineComponent({
  name: 'nav-bar',
  components: {
    RouterLink,
    BaseButton
  },
  data() {
    return {
      routes: [
        {
          name: 'Home',
          path: '/'
        },
        {
          name: 'Profile',
          path: '/profile'
        }
      ]
    }
  },
  methods: {
    logout(e: Event) {
      e.preventDefault()
      useAuthStore().logout()
      this.$router.push('/auth')
    }
  }
})
</script>
