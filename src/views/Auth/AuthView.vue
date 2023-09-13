<template>
  <VCard color="transparent" :loading="isLoading">
    <v-tabs v-model="activeTab" color="red" fixed-tabs align-tabs="end" class="w-full" >
      <VTab v-for="item in tabs" :key="item.tab" :value="item.tab" >
        <VIcon v-if="item.tab === activeTab" size="24" start :icon="item.icon" />
        <template v-if="item.tab !== activeTab">
          {{ item.callToAction }}
        </template>
      </VTab>
    </v-tabs>
    <VDivider />
    <VWindow v-model="activeTab">
      <VWindowItem :value="tabs[0].tab" class="pt-12 px-4">
        <VCardText>
          <h4 class="text-2xl font-semibold text-center">Connexion</h4>
        </VCardText>
        <VForm @submit.prevent="login">
          <VRow>
            <VCol cols="12">
              <VTextField
                  class="transparent-input-box"
                  v-model="loginFields.username"
                  label="Pseudo"
                  type="text"
                  :rules="[rules.required, rules.min]"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                  class="transparent-input-box"
                  v-model="loginFields.password"
                  label="Mot de passe"
                  :rules="[rules.required]"
                  :type="passwordFieldsVisibility.password ? 'text' : 'password'"
                  :append-inner-icon="passwordFieldsVisibility.password ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="passwordFieldsVisibility.password = !passwordFieldsVisibility.password"
              />
              <VAlert v-if="authError.state" variant="tonal" color="error" class="mt-4">{{ authError.message }}</VAlert>
              <VBtn type="submit" block class="mt-4 mb-8">
                Se Connecter
              </VBtn>
            </VCol>
            <VCol cols="12" class="flex align-center">
              <VDivider />
              <span class="rounded-md font-medium text-gray-400 mx-4">Avec</span>
              <VDivider />
            </VCol>
            <VCol
                cols="12"
                class="text-center"
            >
              <div class="d-flex justify-center flex-wrap gap-3">
                <VBtn
                    variant="tonal"
                    color="cyan"
                    rounded
                    size="large"
                    href='/api/auth/42'
                >
                  <VIcon  icon="simple-icons:42" class="mr-1"/>
                  Best school
                </VBtn>
                <VBtn
                    variant="outlined"
                    color="#dd4b39"
                    rounded
                    size="large"
                    href='/api/auth/google'
                >
                  <VIcon  icon="flat-color-icons:google" class="mr-1"/>
                  Google
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VWindowItem>
      <VWindowItem :value="tabs[1].tab" class="pt-12 px-4">
        <VCardText>
          <h4 class="text-2xl font-semibold text-center">Création de compte</h4>
        </VCardText>
        <VForm @submit.prevent="signUp">
          <VRow>
          </VRow>
        </VForm>
      </VWindowItem>
    </VWindow>
  </VCard>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import useAuthStore, {LoginStatus} from '@/stores/AuthStore'

type Tab = 'connect'| 'register'
const tabList : Array<{title:string; callToAction:string; icon:string; tab:Tab }> = [
  {title: '', callToAction:`Vous avez deja un compte ?`, icon:'tabler-lock', tab:'connect'},
  {title: '', callToAction:`Vous n'avez pas de compte ?`, icon:'fluent:form-new-48-regular', tab:'register'}
]

export default defineComponent({
  name: 'auth-view',
  components: {
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      isLoading: false,
      tabs: tabList,
      activeTab: tabList[0].tab,
      loginFields:{
        username: '',
        password: ''
      },
      creationFields:{
        username: '',
        newPassword: '',
        confirmPassword: '',
      },
      passwordFieldsVisibility: {
        password: false,
        newPassword: false,
        confirmPassword: false
      },
      rules: {
        required: (value) => !!value || 'Ce champ est requis',
        minPass: (v) => v.length >= 6 || 'Minimum 6 caractères',
        min: (v) => v.length >= 3 || 'Minimum 3 caractères',
        match: () => {
          return (
              this.passwordFields.newPassword === this.passwordFields.confirmPassword ||
              'Les mots de passe ne correspondent pas'
          )
        },
        upperCase: (v) => /[A-Z]/.test(v) || 'Doit contenir au moins une lettre majuscule'
      },
    }
  },
  computed: {
    authError():{state: boolean, message: string} {
      return this.authStore.error
    }
  },
  created() {
    this.moveToCorrectRoute()
  },
  mounted() {
    this.moveToCorrectRoute();
  },
  methods: {
    moveToCorrectRoute(){
      this.isLoading = true;
      switch (this.authStore.status){
        case LoginStatus.LOCKED:
          this.$router.push({name: 'locked-screen'});
          break;
        case LoginStatus.TWOFA_CHECK:
          this.$router.push({name: 'two-factors'});
          break;
        default:
          // nothing
      }
      this.isLoading = false;
    },
    async login(){
      this.isLoading = true;
      const worked = await this.authStore.login(this.loginFields);
      this.isLoading = false;
    },
    async signUp(){
      this.isLoading = true;
      // code to do
      this.isLoading = false;
    }
  }
})
</script>

<style></style>
