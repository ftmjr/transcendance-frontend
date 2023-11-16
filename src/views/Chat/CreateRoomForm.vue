<template>
  <div>
    <div class="text-end mt-2">
      <VBtn variant="text" color="default" icon size="small" @click="$emit('close')">
        <VIcon size="18" icon="tabler-x" color="error" class="text-medium-emphasis" />
      </VBtn>
    </div>
    <div>
      <VForm v-model="form" title="Créer une salle" class="px-2" @submit.prevent="createRoom">
        <p class="text-center text-lg text-primary">Créer votre salle</p>
        <VTextField
          v-model="roomName"
          label="Nom de la salle"
          placeholder="Entrez le nom de la salle"
          outlined
          dense
          :rules="rules.roomName"
          class="mt-4"
        />
        <VSelect
          v-model="roomType"
          :items="roomTypes"
          item-title="text"
          item-value="value"
          label="Type de la salle"
          outlined
          dense
          class="mt-4"
        />
        <!--        <VCheckboxBtn-->
        <!--          v-if="roomType === 'PRIVATE'"-->
        <!--          v-model="privateWithPassword"-->
        <!--          label="Privée et protégée par mot de passe"-->
        <!--          class="my-2"-->
        <!--        />-->
        <div v-if="askPassword">
          <VTextField
            v-model="roomPassword"
            label="Mot de passe"
            placeholder="Entrez le mot de passe"
            outlined
            dense
            :rules="rules.roomPassword"
            class="mt-4"
          />
          <VTextField
            v-model="roomPasswordConfirmation"
            label="Confirmation du mot de passe"
            placeholder="Confirmez le mot de passe"
            outlined
            dense
            :rules="rules.roomPasswordConfirmation"
            class="mt-4"
          />
        </div>
        <VBtn
          :disabled="!form"
          :loading="loading"
          color="purple"
          variant="elevated"
          type="submit"
          class="my-4"
        >
          Créer la salle
        </VBtn>
      </VForm>
      <NotificationPopUp
        v-model:visible="showErrorPopUp"
        message="Impossible de créer la salle de discussion"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useRoomsStore, { CreateRoom } from '@/stores/RoomsStore'
import useAuthStore from '@/stores/AuthStore'
import { RoomType } from '@/utils/chatSocket'
import NotificationPopUp from '@/components/notifications/NotificationPopUp.vue'

export default defineComponent({
  name: 'CreateRoomForm',
  components: { NotificationPopUp },
  emits: ['close'],
  setup() {
    const roomStore = useRoomsStore()
    const authStore = useAuthStore()
    return {
      roomStore,
      authStore
    }
  },
  data() {
    return {
      roomName: '',
      roomDescription: '',
      roomType: RoomType.PUBLIC as RoomType,
      roomPassword: '',
      roomPasswordConfirmation: '',
      privateWithPassword: false,
      forbiddenWords: [
        'con',
        'connard',
        'salope',
        'pute',
        'merde',
        'enculé',
        'calis',
        'tabarnak',
        'sacrament',
        'ostie'
      ],
      rules: {
        roomName: [
          (v) => !!v || 'Le nom de la salle est requis',
          (v) => (v && v.length <= 20) || 'Le nom de la salle doit être inférieur à 20 caractères',
          (v) => (v && v.length >= 3) || 'Le nom de la salle doit être supérieur à 3 caractères',
          (v) => !this.checkBadWord(v) || 'Le nom de la salle contient un mot interdit'
        ],
        roomPassword: [
          (v) => !!v || 'Le mot de passe est requis',
          (v) => (v && v.length <= 20) || 'Le mot de passe doit être inférieur à 20 caractères',
          (v) => (v && v.length >= 3) || 'Le mot de passe doit être supérieur à 3 caractères'
        ],
        roomPasswordConfirmation: [
          (v) => !!v || 'La confirmation du mot de passe est requise',
          (v) =>
            (v && v.length <= 20) ||
            'La confirmation du mot de passe doit être inférieur à 20 caractères',
          (v) =>
            (v && v.length >= 3) ||
            'La confirmation du mot de passe doit être supérieur à 3 caractères',
          (v) => v === this.roomPassword || 'Les mots de passe ne correspondent pas'
        ]
      },
      form: false,
      showErrorPopUp: false,
      loading: false
    }
  },
  computed: {
    roomTypes(): { text: string; value: RoomType }[] {
      return [
        {
          text: 'Publique',
          value: RoomType.PUBLIC
        },
        {
          text: 'Protégée',
          value: RoomType.PROTECTED
        },
        {
          text: 'Privée',
          value: RoomType.PRIVATE
        }
      ]
    },
    askPassword(): boolean {
      if (this.roomType === RoomType.PROTECTED) {
        return true
      } else if (this.roomType === RoomType.PRIVATE && this.privateWithPassword) {
        return true
      }
      return false
    }
  },
  methods: {
    async createRoom() {
      this.loading = true
      const result = await this.roomStore.createRoom(<CreateRoom>{
        name: this.roomName,
        ownerId: this.authStore.getUser?.id ?? 1,
        type: this.roomType,
        password: this.roomType === RoomType.PROTECTED ? this.roomPassword : undefined
      })
      if (result === 'success') {
        this.resetForm()
        this.$emit('close')
      } else {
        this.showErrorPopUp = true
      }
      this.loading = false
      this.$emit('close')
    },
    resetForm() {
      return {
        roomName: '',
        roomDescription: '',
        roomType: RoomType.PUBLIC as RoomType,
        roomPassword: '',
        roomPasswordConfirmation: '',
        privateWithPassword: false
      }
    },
    checkBadWord(str: string) {
      const lowerCaseStr = str.toLowerCase()
      for (const word of this.forbiddenWords) {
        if (lowerCaseStr.includes(word.toLowerCase())) {
          return true
        }
      }
      return false
    }
  }
})
</script>

<style scoped></style>
