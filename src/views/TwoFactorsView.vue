<template>
  <div class="w-screen h-screen">
    <main class="grid w-full h-full grid-cols-12">
      <div class="relative hidden h-full lg:block lg:col-span-8">
        <img src="../assets/images/authBg.png" alt="landing" class="object-cover w-full h-full" />
        <div
          class="absolute top-0 left-0 z-10 grid w-full h-full bg-gradient place-items-center"
        ></div>
      </div>
      <div
        class="relative grid h-full col-span-12 overflow-scroll lg:col-span-4 bg-darkBlue place-items-center"
      >
        <div class="absolute top-0 left-0 flex justify-between w-full my-2">
          <div></div>
          <div class="flex items-center px-4">
            <a
              href="/auth"
              class="block ml-auto mr-0 text-xs text-white cursor-pointer hover:underline text-white/40"
            >
              retour
            </a>
          </div>
        </div>
        <form
          class="block w-full px-10 py-4 mt-10 space-y-8 rounded-md mx:-auto md:p-4 md:space-y-10 md:w-1/2 lg:w-3/4"
        >
          <div class="space-y-6 text-white">
            <h2 class="text-center text-white/60">
              <span class="text-xl font-bold text-center">Authentification à deux facteurs</span>
            </h2>
            <p class="text-base text-center text-white/50">
              Veuillez entre le code de votre application d'authentification
            </p>
          </div>
          <div class="flex justify-center gap-4">
            <base-input
              v-for="index in 6"
              v-model:value="values[index - 1]"
              :ref="`reference${index}`"
              :key="index"
              type="text"
              :name="`${index}`"
              :formatinput="formatinput"
              classnames="inline-block w-12 h-12 bg-darkBlue border-2 border-light/50 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white text-center focus:border-light/80 focus:outline-none shadow-lg"
              label=""
              :required="true"
            />
          </div>
          <div class="block text-center">
            <base-button
              text="Valider"
              size="medium"
              variant="primary"
              type="submit"
              classnames="w-1/3 inline-block text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-orange shadow-lg hover:bg-darkBlue hover:border-2 hover:border-light/10 transition-all duration-300 ease-in-out border-2 border-orange"
            />
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'

const BaseInput = defineAsyncComponent(() => import('@/components/Input.vue'))
const BaseButton = defineAsyncComponent(() => import('@/components/Button.vue'))

export default defineComponent({
  name: 'two-factors',
  components: {
    BaseInput,
    BaseButton
  },
  data() {
    const values: string[] = new Array(6).fill('')
    return {
      values
    }
  },
  computed: {
    styles() {
      const inputStyle =
        'bg-darkBlue border-2 border-light/10 shadow-lg text-white/50 sm:text-sm rounded-md focus:ring-none block w-full p-2.5 placeholder-white/10 focus:outline-none focus:ring-0 relative focus:border-2 focus:border-light/30 animate-anime-in'
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

<style>
.bg-gradient {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, #797e9e90 95%);
}
</style>
