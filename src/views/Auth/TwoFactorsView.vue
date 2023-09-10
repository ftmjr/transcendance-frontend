<template>
  <VCard
    :max-width="500"
    class="mx-auto flex flex-col items-center"
    color="transparent"
    :loading="isLoading"
  >
    <VCardText class="">
      <h5 class="text-h5 text-center font-semibold mb-1">Verification à double facteur</h5>
      <p class="text-center font-light">
        Veuillez entrer le code de vérification inscrit dans votre application d'authentification.
      </p>
    </VCardText>
    <VCardText class="">
      <VForm @submit.prevent="validateCode">
        <VCol>
          <OtpInput v-model="verificationCode" />
          <p v-if="errorMessage" class="text-error text-center font-lighter">{{ errorMessage }}</p>
        </VCol>
        <VCol cols="12">
          <VBtn block type="submit">Valider</VBtn>
        </VCol>
      </VForm>
      <VBtn variant="text" @click="logout" color="secondary">Déconnexion</VBtn>
    </VCardText>
  </VCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import OtpInput from '@/components/profile/OtpInput.vue'

export default defineComponent({
  name: 'two-factors',
  components: {
    OtpInput
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      verificationCode: '',
      errorMessage: '',
      isLoading: false
    }
  },
  beforeMount() {},
  methods: {
    async validateCode() {
      this.isLoading = true
      const worked = await this.authStore.validate2FACode(this.verificationCode)
      if (worked) {
        this.$router.push({ name: 'dashboard' })
      } else {
        this.errorMessage = 'Le code est invalide'
      }
      this.isLoading = false
    },
    async logout() {
      this.isLoading = true
      await this.authStore.logout()
      this.isLoading = false
      this.$router.push({ name: 'auth' })
    }
  }
})
</script>

<style></style>
