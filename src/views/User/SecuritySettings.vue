<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import axiosInstance from '@/utils/axios'

interface Session {
  id: number
  userAgent: string
  ipAddress: string
  createdAt: Date
  expiresAt: Date
}
export default defineComponent({
  name: 'SecuritySettings',
  components: {
    DoubleFactorModal: defineAsyncComponent(
      () => import('@/components/profile/DoubleFactorModal.vue')
    )
  },
  data() {
    return {
      lastSessions: [] as Session[],
      loading: false,
      isDoubleFactorDialogVisible: false,
      passwordFieldsVisibility: {
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      },
      passwordFields: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      allowTwoFactorDisable: false
    }
  },
  computed: {
    isDoubleFactorEnabled() {
      return false
    }
  },
  methods: {
    async getSessions() {
      this.loading = true
      try {
        const data = (await axiosInstance.get('/auth/sessions')).data
        this.lastSessions = data
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    },
    async disconnectSession(session: Session) {
      try {
        await axiosInstance.delete(`/auth/sessions/${session.id}`)
      } catch (e) {
        console.log(e)
      }
    },
    async changePassword() {
      //
    },
    deactivateTwoFactor() {
      //
    }
  }
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Modifier le mot de passe">
        <VForm @submit.prevent="changePassword">
          <VCardText class="pt-0">
            <VRow class="mb-3">
              <VCol cols="12" md="6">
                <VTextField
                  class="transparent-input-box"
                  v-model="passwordFields.currentPassword"
                  :type="passwordFieldsVisibility.currentPassword ? 'text' : 'password'"
                  :append-inner-icon="
                    passwordFieldsVisibility.currentPassword ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="Mot de passe actuel"
                  @click:append-inner="
                    passwordFieldsVisibility.currentPassword =
                      !passwordFieldsVisibility.currentPassword
                  "
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  class="transparent-input-box"
                  v-model="passwordFields.newPassword"
                  :type="passwordFieldsVisibility.newPassword ? 'text' : 'password'"
                  :append-inner-icon="
                    passwordFieldsVisibility.newPassword ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="Nouveau mot de passe"
                  @click:append-inner="
                    passwordFieldsVisibility.newPassword = !passwordFieldsVisibility.newPassword
                  "
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  class="transparent-input-box"
                  v-model="passwordFields.confirmPassword"
                  :type="passwordFieldsVisibility.confirmPassword ? 'text' : 'password'"
                  :append-inner-icon="
                    passwordFieldsVisibility.confirmPassword ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="Confirmer le mot de passe"
                  @click:append-inner="
                    passwordFieldsVisibility.confirmPassword =
                      !passwordFieldsVisibility.confirmPassword
                  "
                />
              </VCol>
            </VRow>
          </VCardText>
          <VCardText class="flex flex-wrap gap-4">
            <VBtn @submit.prevent="changePassword">Modifier</VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Double facteur">
        <VCardText v-if="!isDoubleFactorEnabled">
          <h6 class="text-base font-weight-semibold mb-3">
            L'authentification à deux facteurs n'est pas encore activée.
          </h6>
          <p class="text-sm">
            L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre
            compte en nécessitant plus qu'un simple mot de passe pour se connecter. Nous vous
            recommandons fortement d'activer cette option.
          </p>

          <VBtn class="mt-1" @click="isDoubleFactorDialogVisible = true"> Activez </VBtn>
        </VCardText>
        <VCardText v-else>
          <VAlert color="warning" variant="tonal" class="mb-4">
            <VAlertTitle class="mb-1 text-sm">
              Double facteur<span class="text-white pl-1"> activé</span>, etes-vous sur de vouloir
              le désactiver ?
            </VAlertTitle>
          </VAlert>
          <div>
            <v-checkboxBtn
              v-model="allowTwoFactorDisable"
              color="primary"
              true-icon="tabler-check"
              false-icon="tabler-x"
              label="Je confirme la désactivation de mon compte"
            />
          </div>
          <VBtn
            :disabled="!allowTwoFactorDisable"
            color="error"
            class="mt-3"
            @click="deactivateTwoFactor"
          >
            Désactiver
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Sessions récentes">
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">NAVIGATEUR</th>
              <th scope="col">IP</th>
              <th scope="col">Créer le</th>
              <th scope="col">Valide</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in lastSessions" :key="session.id">
              <td>{{ session.userAgent }}</td>
              <td>{{ session.ipAddress }}</td>
              <td>{{ session.createdAt }}</td>
              <td>{{ session.expiresAt }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
  <DoubleFactorModal v-model:is-dialog-visible="isDoubleFactorDialogVisible" />
</template>

<style scoped></style>
