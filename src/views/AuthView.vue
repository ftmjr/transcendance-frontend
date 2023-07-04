<template>
  <main>
    <div class="login-page-wrapper">
      <div class="container h-screen">
        <div class="grid grid-cols-12 place-content-center place-items-center h-full">
          <div class="col-span-12">
            
          </div>
          <div id="login" :class="['col-span-12 w-full']">
            <form class="block p-4 rounded-md w-full md:w-1/2 lg:w-1/3 bg-white mx-auto">
              <div class="">
                <h1 class="font-bold">Connexion avec identifiants</h1>
              </div>
              <base-input
                :value="credentials.email.value"
                name="email"
                type="email"
                id="credentialsEmail"
                placeholder="email@provider.com"
                label="Email:"
                :error="credentials.email.error"
                errorMessage="Veuillez entrer un email valide"
                @update:value="handleEmits"
              />
              <base-input
                :value="credentials.password.value"
                name="password"
                type="password"
                id="credentialsPassword"
                placeholder="*********"
                label="Mot de passe:"
                :error="credentials.password.error"
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

              <button @click="play">Play</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'

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
        }
      }
    }
  },
  methods: {
    async handleSubmit(e: Event) {
      e.preventDefault()
      switch (this.isLogin) {
        case true:
          break
        case false:
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
      this.credentials[name as 'email' | 'password' | 'passwordConfirm'].value = value
    },
    isValidEmail(email: string) {
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (regex.test(email)) return true
      return false
    },
    play(e: Event) {
      e.preventDefault()
      const audio = new Audio('/audios/startMusic.mp3')
      audio.play()
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
