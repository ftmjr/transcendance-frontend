<template>
  <div class="absolute top-0 left-0 flex justify-between w-full my-2">
    <div></div>
    <div class="flex items-center px-4">
      <router-link
        :to="{ name: 'auth' }"
        class="block ml-auto mr-0 text-xs text-right text-white/90 hover:underline hover:text-white"
      >
        Retour
      </router-link>
    </div>
  </div>
  <form
    class="block w-full px-10 py-4 mt-10 space-y-8 rounded-md mx:-auto md:p-4 md:space-y-10 md:w-1/2 lg:w-3/4"
    @submit.prevent="handleSubmit"
  >
    <div class="space-y-6 text-white">
      <h2 class="text-center text-white">
        <span class="text-xl font-bold text-center">Authentification à deux facteurs</span>
      </h2>
      <p class="text-base text-center text-white/60">
        Veuillez entre le code de votre application d'authentification
      </p>
    </div>
    <div class="flex justify-center gap-4">
      <base-input
        v-for="(value, index) in values"
        :key="index"
        ref="otpInputs"
        v-model:value="values[index]"
        :required="true"
        type="text"
        :maxlength="1"
        :formatinput="formatinput"
        :name="`otp-${index}`"
        classnames="inline-block w-10 h-10 bg-darkBlue border-2 border-light/50 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white text-center focus:border-light/80 focus:outline-none shadow-lg"
        label=""
        :handleKeyUp="(e) => moveCursorToNext(e, index)"
      />
    </div>
    <div class="block text-center">
      <base-button
        size="medium"
        variant="primary"
        type="submit"
        :disabled="validString"
        classnames="inline-block text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-orange shadow-lg hover:bg-darkBlue hover:border-2 hover:border-light/10 transition-all duration-300 ease-in-out border-2 border-orange"
      >
        Valider
      </base-button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import BaseInput from '@/components/Input.vue'
import BaseButton from '@/components/Button.vue'

export default defineComponent({
  name: 'two-factors',
  components: {
    BaseInput,
    BaseButton
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    const values: string[] = new Array(6).fill('')
    return {
      values
    }
  },
  created() {
    const { user, token } = useAuthStore()
    // if (!token || !user) this.$router.push("/auth")
    // else{
    //  if (!user.twoFactorEnabled)
    //    this.$router.push({ name: 'home' });
    // }
  },
  computed: {
    styles() {
      const inputStyle =
        'bg-darkBlue border-2 border-light/10 shadow-lg text-white/50 sm:text-sm rounded-md focus:ring-none block w-full p-2.5 placeholder-white/10 focus:outline-none focus:ring-0 relative focus:border-2 focus:border-light/30 animate-anime-in'
      return {
        inputStyle
      }
    },
    inputsElements(): HTMLInputElement[] {
      return this.$refs.otpInputs.map((input) => input.element)
    },
    mergedValues(): string {
      // string build from values
      return this.values.join('')
    },
    validString(): boolean {
      return this.mergedValues.length !== 6
    }
  },
  methods: {
    async handleSubmit() {
      if (this.mergedValues.length !== 6) return
      console.log('string to be sent to the server', this.mergedValues)
    },
    formatinput(value: string) {
      const char = value.slice(0, 1)
      const isDigit = /\d/.test(char)
      return isDigit ? char : ''
    },
    moveCursorToNext(e: KeyboardEvent, currIndex: number): boolean {
      const isBackspace = e.key === 'Backspace'
      const isDelete = e.key === 'Delete'
      const isDigit = /\d/.test(e.key)
      const isArrowLeft = e.key === 'ArrowLeft'
      const isArrowRight = e.key === 'ArrowRight'
      const inputs = this.inputsElements

      if (!isDigit && !isBackspace && !isDelete && !isArrowLeft && !isArrowRight) {
        e.preventDefault()
        return false
      }
      if (isDigit && currIndex < inputs.length - 1) {
        if (this.values[currIndex] !== e.key) {
          this.values[currIndex + 1] = e.key
        }
        this.$nextTick(() => {
          inputs[currIndex + 1].focus()
        })
      } else if ((isBackspace || isDelete) && currIndex > 0) {
        this.$nextTick(() => {
          if (this.values[currIndex] === '' && currIndex > 0) {
            inputs[currIndex - 1].focus()
          } else {
            this.values[currIndex] = ''
          }
        })
      } else if (isArrowLeft && currIndex > 0) {
        inputs[currIndex - 1].focus()
      } else if (isArrowRight && currIndex < inputs.length - 1) {
        inputs[currIndex + 1].focus()
      }
      return true
    }
  }
})
</script>

<style></style>
