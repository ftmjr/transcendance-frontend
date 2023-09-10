<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore';

export default defineComponent({
  name: 'LockedScreen',
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  methods:{
    async unlock(){
      await this.authStore.logout();
      this.$router.push({name: 'auth'});
    }
  }
})
</script>

<template>
  <VCard
    :max-width="500"
    class="mx-auto flex flex-col items-center"
    color="transparent"
    title="Locked"
  >
    <VCardText class="">
      <h5 class="text-h5 text-center font-semibold mb-1">Salut, {{ authStore.getProfile.name }}</h5>
      <p class="text-center font-light">
        Votre session est actuellement bloqué, reconnectez-vous
      </p>
      <VBtn @click="unlock" variant="text"> Debloquer</VBtn>
    </VCardText>
  </VCard>
</template>

<style scoped></style>
