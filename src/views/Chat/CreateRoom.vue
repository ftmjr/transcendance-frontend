<template>
  <div>
    <span> Créer un chat </span>
    <v-menu
      transition="scale-transition"
      v-model="menu"
      :close-on-content-click="false"
      location="end top"
      offset="10px -20px"
    >
      <template v-slot:activator="{ props }">
        <v-btn icon color="transparent" class="w-full p-2 text-left" v-bind="props">
          <v-icon color="primary" icon="ic:round-add" size="24" />
        </v-btn>
      </template>

      <v-card class="">
        <v-list>
          <v-list-item>
            <div class="p-4">
              <v-sheet width="300" class="mx-auto">
                <h2 class="mb-4 text-sm font-bold">Création de room</h2>
                <v-form @submit.prevent="tryToUpateRooInfos">
                  <div class="flex flex-col gap-4">
                    <div class="flex gap-4">
                      <span class="w-12 h-12 border rounded-full"></span>
                      <v-file-input
                        label="Choisir une image"
                        prepend-icon="mdi-camera"
                        variant="solo-filled"
                      ></v-file-input>
                    </div>
                    <v-text-field v-model="name" :rules="rules.name" label="nom"></v-text-field>
                    <v-select v-model="type" :items="typeList"></v-select>
                    <v-text-field
                      :disabled="type === RoomType.PUBLIC"
                      v-model="password"
                      :rules="rules.password"
                      label="mot de passe"
                    ></v-text-field>
                    <v-text-field
                      :disabled="type === RoomType.PUBLIC"
                      v-model="confirmPassword"
                      :rules="rules.passwordConfirmation"
                      label="Verifiez le mot de passe"
                    ></v-text-field>
                    <v-btn
                      @click="createRoom"
                      :loading="loading"
                      type="submit"
                      block
                      class="mt-2"
                      text="Créer"
                    ></v-btn>
                  </div>
                </v-form>
                <NotificationPopUp
                  v-model:visible="showErrorPopUp"
                  message="Impossible de créer la salle de discussion"
                />
              </v-sheet>
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue'
import NotificationPopUp from '@/components/notifications/NotificationPopUp.vue'
import useRoomsStore, { CreateRoom } from '@/stores/RoomsStore'
import useAuthStore from '@/stores/AuthStore'
import { RoomType } from '@/utils/chatSocket'

const roomStore = useRoomsStore()
const authStore = useAuthStore()
const menu = ref(false)
const emit = defineEmits(['close'])

const showErrorPopUp = ref(false)
const name = ref('room name')
const isPrivateRoom = ref(false)
const password = ref('********')
const confirmPassword = ref('********')

const typeList: RoomType[] = [RoomType.PUBLIC, RoomType.PROTECTED, RoomType.PRIVATE]

const type = ref(typeList[0])

const loading = ref(false)
const rules = reactive({
  name: [
    (v: string) => !!v || 'Le nom de la salle est requis',
    (v: string) =>
      (v && v.length <= 20) || 'Le nom de la salle doit être inférieur à 20 caractères',
    (v: string) => (v && v.length >= 3) || 'Le nom de la salle doit être supérieur à 3 caractères',
    (v: string) => !checkBadWord(v) || 'Le nom de la salle contient un mot interdit'
  ],
  password: [
    (v: string) => !!v || 'Le mot de passe est requis',
    (v: string) => (v && v.length <= 20) || 'Le mot de passe doit être inférieur à 20 caractères',
    (v: string) => (v && v.length >= 3) || 'Le mot de passe doit être supérieur à 3 caractères'
  ],
  passwordConfirmation: [
    (v: string) => !!v || 'La confirmation du mot de passe est requise',
    (v: string) =>
      (v && v.length <= 20) ||
      'La confirmation du mot de passe doit être inférieur à 20 caractères',
    (v: string) =>
      (v && v.length >= 3) || 'La confirmation du mot de passe doit être supérieur à 3 caractères',
    (v: string) => v === password.value || 'Les mots de passe ne correspondent pas'
  ]
})

const forbiddenWords = [
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
]

const checkBadWord = (str: string) => {
  const lowerCaseStr = str.toLowerCase()
  for (const word of forbiddenWords) {
    if (lowerCaseStr.includes(word.toLowerCase())) {
      return true
    }
  }
  return false
}

const tryToUpateRooInfos = async (e: Event) => {
  e.preventDefault()
  try {
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  name.value = ''
  type.value = RoomType.PUBLIC
  password.value = ''
  confirmPassword.value = ''
  showErrorPopUp.value = false
  return
}

const createRoom = async (e: Event) => {
  loading.value = true
  const result = await roomStore.createRoom(<CreateRoom>{
    name: name.value,
    ownerId: authStore.getUser?.id ?? 1,
    type: type.value,
    password:
      type.value === RoomType.PROTECTED || type.value === RoomType.PRIVATE
        ? password.value
        : undefined
  })
  if (result === 'success') {
    resetForm()
    loading.value = false
    emit('close')
    return
  }
  showErrorPopUp.value = true
  loading.value = false
  emit('close')
}
</script>
