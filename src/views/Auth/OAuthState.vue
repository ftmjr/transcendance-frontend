<template>
  <div id="AppLoader" @click="toggleLoader" :class="isActive ? 'start' : ''">
    <div class="loader-box" :class="isActive ? 'active' : ''">
      <div class="pad01"></div>
      <div class="loading-text">
        <svg viewBox="0 0 480 150">
          <symbol id="loading-s-text">
            <text text-anchor="middle" x="50%" y="80%">Loading...</text>
          </symbol>
          <g class="loader-g-ants">
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
            <use xlink:href="#loading-s-text" class="text-loader-copy"></use>
          </g>
        </svg>
      </div>
      <div class="pad02"></div>
      <div class="ball"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore, {LoginStatus} from '@/stores/AuthStore.ts'

export default defineComponent({
  name: 'auth-state',
  setup() {
    const authStore = useAuthStore();
    return { authStore }
  },
  async mounted() {
    const { token } = this.$route.query
    if (token) {
      this.authStore.setToken(token);
      await this.authStore.refreshCurrentUser();
      if (this.authStore.status === LoginStatus.LOGGED) {
        return this.$router.push({ name: 'dashboard' })
      } else if (this.authStore.status === LoginStatus.TWOFA_CHECK){
        return this.$router.push({ name: 'two-factors' })
      }
    }
    return this.$router.push({ name: 'auth' })
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    toggleLoader() {
      this.isActive = !this.isActive
    }
  },
})
</script>
