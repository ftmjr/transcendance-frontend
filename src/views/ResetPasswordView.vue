<template>
  <div class="absolute top-0 left-0 flex justify-between w-full my-2">
    <div></div>
    <div class="flex items-center px-4">
      <router-link
        :to="{ name: 'auth' }"
        class="block ml-auto mr-0 text-xs text-white cursor-pointer hover:underline"
      >
        Retour
      </router-link>
    </div>
  </div>
  <form
    class="block w-full px-10 py-4 mt-10 space-y-8 rounded-md mx:-auto md:p-4 md:space-y-10 md:w-1/2 lg:w-3/4"
  >
    <div class="space-y-6 text-white">
      <h2 class="text-center text-white/60">
        <span class="text-xl font-bold text-center text-white"
          >Reinitialiser votre mot de passe</span
        >
      </h2>
      <p class="text-base text-center text-white/80 text-md">
        Veuillez saisir votre courriel pour recevoir un lien de réinitialisation
      </p>
    </div>
    <div class="flex justify-center gap-4"></div>
    <base-input
      name="email"
      type="email"
      :error="false"
      errorMessage=""
      id="email"
      placeholder="gamerpro@monjeu.com"
      :required="true"
      label="Pseudo:"
      v-model:value="value"
      classnames="bg-darkBlue border-2 border-light/10 shadow-lg text-white/80 sm:text-sm rounded-md focus:ring-none block w-full p-2.5 placeholder-white/30 focus:outline-none focus:ring-0 relative focus:border-2 focus:border-light/30 animate-anime-in"
    />
    <div class="my-2">
      <base-button
        size="medium"
        variant="primary"
        :onclick="($event) => {}"
        type="submit"
        classnames="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-orange shadow-lg hover:bg-darkBlue hover:border-2 hover:border-light/10 transition-all duration-300 ease-in-out border-2 border-orange animate-anime-in mt-4"
      >
        Recevoir un lien
      </base-button>
    </div>
    <div class="formGroup">
      <router-link
        :to="{ name: 'auth' }"
        class="block text-xs text-right text-white/90 hover:underline hover:text-white"
      >
        Retour
      </router-link>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseInput from '@/components/Input.vue'
import BaseButton from '@/components/Button.vue'
import useAuthStore from '@/stores/AuthStore'

export default defineComponent({
  name: 'reset-password',
  components: {
    BaseInput,
    BaseButton
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      value: ''
    }
  },
  computed: {
    styles() {
      const inputStyle = ''
      return {
        inputStyle
      }
    }
  },
  methods: {
    async handleSubmit(e: Event) {
      e.preventDefault()
    },
    formatinput(value: string) {
      const char = value.slice(0, 1)
      const isDigit = /\d/.test(char)
      return isDigit ? char : ''
    }
  }
})
</script>

<style></style>
