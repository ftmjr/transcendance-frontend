<template>
  <main>
    <div class="login-page-wrapper">
      <div class="container h-screen">
        <div class="grid grid-cols-12 place-content-center place-items-center h-full">
          <div class="col-span-12"></div>
          <div id="login" :class="['col-span-12 w-full']">
            <form class="block p-4 rounded-md w-full md:w-1/2 lg:w-1/4 bg-white mx-auto">
              <div class="">
                <h1 v-show="isLogin" class="font-bold">Connexion avec identifiants</h1>
                <h1 v-show="!isLogin" class="font-bold">Création de compte</h1>
              </div>
              <base-input
                v-show="!isLogin"
                name="firstname"
                type="text"
                id="credentialsfirstname"
                placeholder="John"
                :required="true"
                label="Prenom:"
                :value="credentials.firstname.value"
                :error="credentials.firstname.error"
              />
              <base-input
                v-show="!isLogin"
                name="lastname"
                type="text"
                id="credentialslastname"
                placeholder="Doe"
                :required="true"
                label="Nom:"
                :value="credentials.lastname.value"
                :error="credentials.lastname.error"
              />
              <base-input
                name="username"
                type="text"
                id="credentialsusername"
                placeholder="gamerpro"
                :required="true"
                label="Pseudo:"
                :value="credentials.username.value"
                :error="credentials.username.error"
              />
              <base-input
                v-show="!isLogin"
                :value="credentials.email.value"
                name="email"
                type="email"
                id="credentialsEmail"
                placeholder="email@provider.com"
                label="Email:"
                :error="credentials.email.error"
                errorMessage="Veuillez entrer un email valide"
                @update:value="handleEmits"
                :required="true"
              />
              <base-input
                :value="credentials.password.value"
                name="password"
                type="password"
                id="credentialsPassword"
                placeholder="*********"
                label="Mot de passe:"
                :error="credentials.password.error"
                :required="true"
                errorMessage="Ce champ est requis"
                @update:value="handleEmits"
              />
              <base-input
                v-show="!isLogin"
                :value="credentials.passwordConfirm.value"
                name="password"
                type="password"
                id="credentialsPassword"
                placeholder="*********"
                label="Confirmer le mot de passe:"
                :error="credentials.passwordConfirm.error"
                errorMessage="Les deux mots de passe ne correspondent pas"
                @update:value="handleEmits"
                :required="true"
              />

              <div class="my-2">
                <base-button
                  :text="isLogin ? 'Se connecter' : 'Créer un compte'"
                  size="medium"
                  variant="primary"
                  :onclick="handleSubmit"
                  type="submit"
                />
              </div>
              <div class="formGroup">
                <a v-show="isLogin" href="#" class="text-xs text-right block hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
              <div class="relative">
                <p
                  class="text-black before:absolute before:left-0 before:right-0 before:h-[1px] before:bg-black before:top-1/2 before:-translate-y-1/2 -z-10 text-center"
                >
                  <span class="relative text-xs z-10 mx-auto inline-block py-1 px-4 bg-white">
                    ou
                  </span>
                </p>
              </div>
              <div>
                <social-login-button
                  provider="42"
                  size="small"
                  :text="isLogin ? 'se connecter avec ' : 'S\'inscrire avec '"
                />
                <social-login-button
                  provider="google"
                  size="small"
                  :text="isLogin ? 'se connecter avec ' : 'S\'inscrire avec '"
                />
              </div>
              <div class="my-2">
                <base-button
                  :text="isLogin ? 'Créer un compte' : 'Se connecter'"
                  size="small"
                  variant="tertiary"
                  :onclick="handleForms"
                  type="button"
                  classnames="hover:underline block ml-auto mr-0"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import * as validators from '@/utils/valiadator'

const BaseButton = defineAsyncComponent(() => import('@/components/Button.vue'))
const BaseInput = defineAsyncComponent(() => import('@/components/Input.vue'))
const SocialLoginButton = defineAsyncComponent(() => import('@/components/SocialLoginButton.vue'))

const authStore = useAuthStore()
export default defineComponent({
  name: 'auth-view',
  components: {
    BaseButton,
    SocialLoginButton,
    BaseInput
  },
  data() {
    return {
      isLogin: true,
      credentials: {
        email: {
          value: '',
          error: false
        },
        password: {
          value: '',
          error: false
        },
        passwordConfirm: {
          value: '',
          error: false
        },
        firstname: {
          value: '',
          error: false
        },
        lastname: {
          value: '',
          error: false
        },
        username: {
          value: '',
          error: false
        }
      }
    }
  },
  methods: {
    async handleSubmit(e: Event) {
      e.preventDefault()
      const { email, password, passwordConfirm, firstname, lastname, username } = this.credentials

      const userDatas = {
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
        firstname: firstname.value,
        lastname: lastname.value,
        username: username.value
      }

      switch (this.isLogin) {
        case true:
          await authStore.login(username.value, password.value)
          break
        case false:
          await authStore.register(userDatas)
          break
      }
    },
    handleForms(e: Event) {
      e.preventDefault()
      this.isLogin = !this.isLogin
      return
    },
    handleEmits(changes: any) {
      const { name, value } = changes
      type CredentialFields =
        | 'email'
        | 'password'
        | 'passwordConfirm'
        | 'firstname'
        | 'lastname'
        | 'username'
      this.credentials[name as CredentialFields].value = value

      switch (name) {
        case 'email':
          this.credentials['email'].error = !validators.isEmail(value)
          break
        case 'password':
          this.credentials['password'].error = !validators.isPassword(value)
          break
        case 'passwordConfirm':
          this.credentials['passwordConfirm'].error = this.credentials['password'].value !== value
          break
        case 'firstname':
        case 'lastname':
          this.credentials[name as CredentialFields].error = !validators.isName(value)
          break
        case 'username':
          this.credentials['username'].error = !validators.isValidUsername(value)
          break
      }
    }
  }
})
</script>

<style>
.login-page-wrapper {
  @apply h-screen w-screen;
  @apply bg-primary;
}
</style>
