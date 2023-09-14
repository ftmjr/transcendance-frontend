<template>
  <VCard color="transparent" :loading="isLoading" title="Locked">
    <VCardText class="flex flex-col justify-center">
      <h5 class="text-h5 text-center font-semibold mb-1">Salut, {{ authStore.getProfile.name }}</h5>
      <VAvatar rounded size="120" class="user-profile-avatar mx-auto">
        <VImg v-if="authStore.getProfile.avatar" :src="authStore.getProfile.avatar" />
        <VIcon v-else color="primary" icon="tabler-user" />
      </VAvatar>
      <p class="text-center font-light">Votre session est actuellement bloqué, reconnectez-vous</p>
      <VBtn @click="unlock" variant="text"> Debloquer</VBtn>
    </VCardText>
  </VCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'

export default defineComponent({
  name: 'LockedScreen',
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async unlock() {
      this.isLoading = true
      await this.authStore.logout()
      this.isLoading = false
      this.$router.push({ name: 'auth' })
    }
  }
})
</script>

<style scoped></style>
