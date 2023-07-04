<template>
  <main>
    <div class="login-page-wrapper">
      <div class="container h-screen">
        <div class="grid grid-cols-12 place-content-center place-items-center h-full">
          <div id="login" :class="['col-span-12 w-full', !isLogin && 'hidden']">
            <form class="block p-4 rounded-md w-full md:w-1/2 lg:w-1/4 bg-white mx-auto">
              <div class="">
                <h1 class="font-bold">Connexion avec identifiants</h1>
              </div>
              <div class="formGroup">
                <label for="email">
                  <span class="text-xs"> Email: </span>
                  <input
                    type="email"
                    name="email"
                    id="credentialsEmail"
                    :value="credentials.email.value"
                    placeholder="email@provider.com"
                    class="p-2 text-xs appearance-none border border-black/10 w-full focus:ring-none focus:outline-none focus:border-b"
                  />
                </label>
              </div>
              <div class="formGroup">
                <label for="password">
                  <span class="text-xs"> Mot de passe: </span>
                  <input
                    type="password"
                    name="password"
                    id="credentialsPassword"
                    :value="credentials.password.value"
                    placeholder=".........."
                    class="p-2 text-xs appearance-none border border-black/10 w-full focus:ring-none focus:outline-none focus:border-b"
                  />
                </label>
              </div>
              <div class="formGroup">
                <base-button
                  text="Se connecter"
                  size="small"
                  variant="primary"
                  :onclick="handleSubmit"
                  type="submit"
                />
              </div>
              <div class="formGroup">
                <a href="#" class="text-xs text-right block hover:underline">
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
                <social-login-button provider="42" size="small" />
                <social-login-button provider="google" size="small" />
              </div>
              <div class="formGroup">
                <base-button
                  text="Créer un compte"
                  size="small"
                  variant="tertiary"
                  :onclick="handleForms"
                  type="submit"
                  classnames="hover:underline block ml-auto mr-0"
                />
              </div>
            </form>
          </div>
          <div id="register" :class="['col-span-12 w-full', isLogin && 'hidden']">
            <form class="block p-4 rounded-md w-full md:w-1/2 lg:w-1/4 bg-white mx-auto">
              <div class="">
                <h1 class="font-bold">Création de compte</h1>
              </div>
              <div class="formGroup">
                <label for="email">
                  <span class="text-xs"> Email: </span>
                  <input
                    type="email"
                    name="email"
                    :value="register.email.value"
                    id=""
                    placeholder="email@provider.com"
                    class="p-2 text-xs appearance-none border border-black/10 w-full focus:ring-none focus:outline-none focus:border-b"
                  />
                </label>
              </div>
              <div class="formGroup">
                <label for="password">
                  <span class="text-xs"> Mot de passe: </span>
                  <input
                    type="password"
                    name="password"
                    :value="register.password.value"
                    id=""
                    placeholder=".........."
                    class="p-2 text-xs appearance-none border border-black/10 w-full focus:ring-none focus:outline-none focus:border-b"
                  />
                </label>
              </div>
              <div class="formGroup">
                <label for="confirmPassword">
                  <span class="text-xs"> Confirmer le mot de passe: </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    :value="register.confirmPassword.value"
                    id=""
                    placeholder=".........."
                    class="p-2 text-xs appearance-none border border-black/10 w-full focus:ring-none focus:outline-none focus:border-b"
                  />
                </label>
              </div>
              <div class="formGroup">
                <base-button
                  text="Créer un compte"
                  size="small"
                  variant="primary"
                  :onclick="handleSubmit"
                  type="submit"
                />
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
                <social-login-button provider="42" size="small" />
                <social-login-button provider="google" size="small" />
              </div>
              <div class="formGroup">
                <base-button
                  text="Se connecter avec identifiants"
                  size="small"
                  variant="tertiary"
                  :onclick="handleForms"
                  type="submit"
                  classnames="hover:underline block mr-0 ml-auto"
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

const BaseButton = defineAsyncComponent(() => import('@/components/Button.vue'))
const SocialLoginButton = defineAsyncComponent(() => import('@/components/SocialLoginButton.vue'))
export default defineComponent({
  name: 'auth-view',
  components: {
    BaseButton,
    SocialLoginButton
  },
  data() {
    return {
      isLogin: true,
      credentials: {
        email: {
          value: '',
          error: ''
        },
        password: {
          value: '',
          error: ''
        }
      },
      register: {
        email: {
          value: '',
          error: ''
        },
        password: {
          value: '',
          error: ''
        },
        confirmPassword: {
          value: '',
          error: ''
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
    handleChanges(e: Event) {
      const { name, value } = e.target as HTMLInputElement
      if (this.isLogin) {
        this.credentials[name as 'email' | 'password'].value = value
      } else {
        this.register[name as 'email' | 'password' | 'confirmPassword'].value = value
      }
    },
    handleForms(e: Event) {
      e.preventDefault()
      this.isLogin = !this.isLogin
      return
    }
  }
})
</script>

<style>
.login-page-wrapper {
  @apply h-screen w-screen;
  @apply bg-primary;
}
.formGroup {
  @apply my-2;
}
</style>
