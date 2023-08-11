<template>
  <div class="absolute top-0 left-0 flex justify-between w-full my-2">
    <div></div>
    <div class="flex items-center">
      <span class="text-xs text-white/60">
        {{ isLogin ? "Vous n'avez pas de compte ?" : 'Vous avez déjà un compte ?' }}
      </span>
      <base-button
        size="small"
        variant="tertiary"
        :onclick="handleForms"
        type="button"
        classnames="hover:underline block ml-auto mr-0 text-white"
      >
        {{ isLogin ? 'Créer un compte' : 'Se connecter' }}
      </base-button>
    </div>
  </div>
  <form
    class="block w-full px-10 py-4 mt-10 space-y-2 duration-200 ease-in rounded-md mx:-auto md:p-4 md:space-y-4 md:w-1/2 lg:w-5/6 transition-height 2xl:w-1/2"
    autocomplete="off"
  >
    <div class="">
      <h1 v-show="isLogin" class="text-xl font-bold text-left text-white uppercase">Connexion</h1>
      <h1 v-show="!isLogin" class="text-xl font-bold text-left text-white uppercase">
        Création de compte
      </h1>
    </div>
    <div class="flex gap-2">
      <div class="w-1/2">
        <base-input
          v-show="!isLogin"
          :error="credentials.firstname.error"
          :errorMessage="credentials.firstname.errorMessage"
          v-model:value="credentials.firstname.value"
          name="firstname"
          type="text"
          id="credentialsfirstname"
          placeholder="John"
          :required="true"
          label="Prenom:"
          :validate="(value) => !formValidator.isValidenames(value)"
          :classnames="`${styles.inputStyle}`"
        />
      </div>
      <div class="w-1/2">
        <base-input
          v-show="!isLogin"
          name="lastname"
          :error="credentials.lastname.error"
          :errorMessage="credentials.lastname.errorMessage"
          type="text"
          id="credentialslastname"
          placeholder="Doe"
          :required="true"
          label="Nom:"
          v-model:value="credentials.lastname.value"
          :classnames="styles.inputStyle"
          :validate="(value) => !formValidator.isValidenames(value)"
        />
      </div>
    </div>
    <base-input
      name="username"
      type="text"
      :error="credentials.username.error"
      :errorMessage="credentials.username.errorMessage"
      id="credentialsusername"
      placeholder="gamerpro"
      :required="true"
      label="Pseudo:"
      v-model:value="credentials.username.value"
      :validate="!isLogin ? (value) => !formValidator.isValidUsername(value) : undefined"
      :classnames="styles.inputStyle"
    />
    <base-input
      v-show="!isLogin"
      v-model:value="credentials.email.value"
      :error="credentials.email.error"
      name="email"
      type="email"
      id="credentialsEmail"
      placeholder="email@provider.com"
      label="Email:"
      :errorMessage="credentials.email.errorMessage"
      :required="true"
      :classnames="styles.inputStyle"
      :validate="(value) => !formValidator.isEmail(value)"
    />
    <base-input
      v-model:value="credentials.password.value"
      name="password"
      type="password"
      :error="credentials.password.error"
      id="credentialsPassword"
      placeholder="*********"
      label="Mot de passe:"
      :required="true"
      :errorMessage="credentials.password.errorMessage"
      :classnames="styles.inputStyle"
      iconClasses="fill-white"
      :validate="!isLogin ? (value) => !formValidator.isStrongPassword(value) : undefined"
    />
    <base-input
      v-show="!isLogin"
      v-model:value="credentials.passwordConfirm.value"
      :error="credentials.passwordConfirm.error"
      name="passwordConfirm"
      type="password"
      id="credentialsPassword2"
      placeholder="*********"
      label="Confirmer le mot de passe:"
      :errorMessage="credentials.passwordConfirm.errorMessage"
      :required="true"
      :classnames="styles.inputStyle"
      :validate="(value) => credentials.password.value !== value"
      iconClasses="fill-white"
    />

    <div class="my-2">
      <base-button
        size="medium"
        variant="primary"
        :onclick="
          ($event) => {
            handleSubmit($event)
          }
        "
        type="submit"
        classnames="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-orange shadow-lg hover:bg-darkBlue hover:border-2 hover:border-light/10 transition-all duration-300 ease-in-out border-2 border-orange animate-anime-in mt-4"
      >
        {{ isLogin ? 'Se connecter' : 'Créer un compte' }}
      </base-button>
    </div>
    <div class="formGroup">
      <router-link
        v-show="isLogin"
        :to="{ name: 'reset-password' }"
        class="block text-xs text-right text-white/80 hover:underline hover:text-white"
      >
        Mot de passe oublié ?
      </router-link>
    </div>
    <div class="inline-flex items-center justify-center w-full">
      <hr class="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <span
        class="absolute px-3 font-medium text-gray-600 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900 rounded"
        >Ou continuer avec</span
      >
    </div>
    <div class="flex items-center justify-center gap-2">
      <social-login-button
        provider="42"
        size="small"
        text="Avec"
        classnames="text-white inline-block w-1/2 text-center shadow-lg py-2 border-2 border-light/10 rounded-md hover:bg-cyan-500 hover:text-black font-medium animate-anime-in"
      />
      <social-login-button
        provider="google"
        size="small"
        text="Avec"
        classnames="text-white inline-block w-1/2 text-center shadow-lg py-2 border-2 border-light/10 rounded-md hover:bg-orange animate-anime-in"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import { formValidator } from '@/utils/valiadator'
import type { RegisterBody } from 'Auth'

const BaseButton = defineAsyncComponent(() => import('@/components/Button.vue'))
const BaseInput = defineAsyncComponent(() => import('@/components/Input.vue'))
const SocialLoginButton = defineAsyncComponent(() => import('@/components/SocialLoginButton.vue'))

export default defineComponent({
  name: 'auth-view',
  components: {
    BaseButton,
    SocialLoginButton,
    BaseInput
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      isLogin: true,
      credentials: {
        email: {
          value: '',
          error: false,
          errorMessage: 'Veuillez entrer un email valide'
        },
        password: {
          value: '',
          error: false,
          errorMessage: 'Ce champ est requis'
        },
        passwordConfirm: {
          value: '',
          error: false,
          errorMessage: 'Les deux mots de passe ne correspondent pas'
        },
        firstname: {
          value: '',
          error: false,
          errorMessage: 'Ce champ est requis'
        },
        lastname: {
          value: '',
          error: false,
          errorMessage: 'Ce champ est requis'
        },
        username: {
          value: '',
          error: false,
          errorMessage: 'Ce champ est requis'
        }
      },
      formValidator
    }
  },
  created() {
    if (this.authStore.isAuthenticated) this.$router.push('/')
  },
  computed: {
    styles() {
      const inputStyle =
        'bg-darkBlue border-2 border-light/60 shadow-lg text-white/80 sm:text-sm rounded-md focus:ring-none block w-full p-2.5 placeholder-white/20 focus:outline-none focus:ring-0 relative focus:border-2 focus:border-light/30 animate-anime-in'
      return {
        inputStyle
      }
    },
    authError() {
      // Errors from the authStore are handled here
      return this.authStore.error
    }
  },
  methods: {
    async handleSubmit(e: Event) {
      e.preventDefault()

      // if (!this.isLogin && this.hasError()) return

      const { email, password, passwordConfirm, firstname, lastname, username } = this.credentials

      const userDatas: RegisterBody = {
        email: email.value,
        password: password.value,
        passwordConfirmation: passwordConfirm.value,
        firstName: firstname.value,
        lastName: lastname.value,
        username: username.value
      }

      const success = this.isLogin
        ? await this.authStore.login({ username: username.value, password: password.value })
        : await this.authStore.register(userDatas)

      success && (await this.$router.push({ name: 'two-factors' }))
    },
    handleForms(e: Event) {
      e.preventDefault()
      this.isLogin = !this.isLogin
      return
    },
    verifyEmail() {
      const { email } = this.credentials
      if (!email.value) {
        ;(email.error = true), (email.errorMessage = 'Ce champ est requis')
      }
      email.error = !formValidator.isEmail(email.value)
      if (email.error) email.errorMessage = 'Veuillez entrer un email valide'
      return email.error
    },
    verifyPassword() {
      const { password } = this.credentials
      if (!password.value) {
        ;(password.error = true), (password.errorMessage = 'Ce champ est requis')
      }
      password.error = !formValidator.isStrongPassword(password.value)
      if (password.error) password.errorMessage = 'Veuillez entrer un mot de passe valide'
      return password.error
    },
    confirmPassword() {
      const { password, passwordConfirm } = this.credentials
      if (!passwordConfirm.value) {
        ;(passwordConfirm.error = true), (passwordConfirm.errorMessage = 'Ce champ est requis')
      }
      passwordConfirm.error = password.value !== passwordConfirm.value
      if (passwordConfirm.error)
        passwordConfirm.errorMessage = 'Les deux mots de passe ne correspondent pas'
      return passwordConfirm.error
    },
    verifyFirstName() {
      const { firstname } = this.credentials
      if (!firstname.value) {
        console.log(firstname.value)
        ;(firstname.error = true), (firstname.errorMessage = 'Ce champ est requis')
        return firstname.error
      }

      if (!formValidator.isValidenames(firstname.value)) {
        ;(firstname.error = true), (firstname.errorMessage = 'Veuillez entrer un prénom valide')
        return firstname.error
      }
      return false
    },
    verifyLastName() {
      const { lastname } = this.credentials
      if (!lastname.value) {
        ;(lastname.error = true), (lastname.errorMessage = 'Ce champ est requis')
        return lastname.error
      }
      if (!formValidator.isValidenames(lastname.value)) {
        ;(lastname.error = true), (lastname.errorMessage = 'Veuillez entrer un nom valide')
        return lastname.error
      }
      return false
    },
    verifyUsername() {
      const { username } = this.credentials
      if (!username.value) {
        ;(username.error = true), (username.errorMessage = 'Ce champ est requis')
        return username.error
      }
      if (!formValidator.isValidUsername(username.value)) {
        ;(username.error = true), (username.errorMessage = 'Veuillez entrer un psoeudo valide')
        return username.error
      }
      return false
    },
    hasError() {
      return (
        this.verifyFirstName() ||
        this.verifyLastName() ||
        this.verifyUsername() ||
        this.verifyEmail() ||
        this.verifyPassword() ||
        this.confirmPassword()
      )
    }
  }
})
</script>

<style></style>
