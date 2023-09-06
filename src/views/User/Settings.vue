<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue'
import useAuthStore from '@/stores/AuthStore'

export default defineComponent({
  components: {
    SecuritySettings: defineAsyncComponent(() => import('@/views/User/SecuritySettings.vue'))
  },
  props: {
    tab: {
      type: String as PropType<'account' | 'security'>,
      default: () => 'account'
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      tabs: [
        { title: 'Compte', icon: 'tabler-users', tab: 'account' },
        { title: 'Paramètre de sécurité', icon: 'tabler-lock', tab: 'security' }
      ],
      activeTab: this.tab,
      fields: {
        firstName: '',
        lastName: '',
        bio: ''
      }
    }
  },
  computed: {
    inputElement(): HTMLInputElement {
      return this.$refs.refInputEl
    }
  },
  methods: {
    startUploadNewAvatar(fileInputEv: Event) {
      console.log(fileInputEv)
    },
    resetForm() {}
  }
})
</script>

<template>
  <div>
    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        :to="{ name: 'settings', params: { tab: item.tab } }"
      >
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VWindow v-model="activeTab" class="mt-6 disable-tab-transition" :touch="false">
      <VWindowItem value="account">
        <VRow>
          <VCol cols="12">
            <VCard title="Information du profil">
              <VCardText class="flex">
                <VAvatar rounded size="100" class="me-6" :image="authStore.user?.profile?.avatar" />
                <form
                  ref="refUpdateAvatarForm"
                  class="flex flex-column justify-center gap-4"
                  @submit.prevent
                >
                  <div class="flex flex-wrap gap-2">
                    <VBtn color="primary" @click="inputElement?.click()">
                      <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                      <span class="d-none d-sm-block">Changer d'avatar</span>
                    </VBtn>

                    <input
                      ref="refInputEl"
                      type="file"
                      name="file"
                      accept=".jpeg,.png,.jpg,GIF"
                      hidden
                      @input="startUploadNewAvatar"
                    />
                  </div>
                  <p class="text-sm font-weight-light mb-0">
                    Fichier pris en charge: JPG, GIF or PNG
                  </p>
                </form>
              </VCardText>

              <VDivider />

              <VCardText class="pt-2">
                <VForm class="mt-6" @submit.prevent>
                  <VRow>
                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="fields.firstName"
                        label="Prénom"
                        class="transparent-input-box"
                      />
                    </VCol>

                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="fields.lastName"
                        label="Nom de famille"
                        class="transparent-input-box"
                      />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VTextarea
                        v-model="fields.bio"
                        label="Biographie"
                        class="transparent-input-box"
                      />
                    </VCol>

                    <VCol cols="12" class="d-flex flex-wrap gap-4">
                      <VBtn>Enregistrer</VBtn>
                      <VBtn
                        color="secondary"
                        variant="tonal"
                        type="reset"
                        @click.prevent="resetForm"
                      >
                        Renitialiser
                      </VBtn>
                    </VCol>
                  </VRow>
                </VForm>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
      <VWindowItem value="security">
        <SecuritySettings />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<style lang="scss" scoped>
.transparent-bg-input {
  .v-field__input {
    background-color: transparent !important;
    &:focus {
      --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
        var(--tw-ring-offset-color);
      --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width))
        var(--tw-ring-color);
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    }
  }
}
</style>
