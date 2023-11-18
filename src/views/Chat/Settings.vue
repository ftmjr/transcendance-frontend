<template>
  <div class="flex-1 h-full">
    <div
      v-if="roomsStore.getCurrentRoomStatus.room && isLoading"
      class="flex items-center justify-between h-full pl-8"
    >
      <div class="flex flex-row items-center gap-2">
        <VAvatar
          v-if="roomsStore.getCurrentRoomStatus.room.avatar"
          :size="42"
          :image="roomsStore.getCurrentRoomStatus.room.avatar"
        />
        <h2 v-if="alreadyMember">{{ roomsStore.getCurrentRoomStatus.room.name }}</h2>
        <h2 v-else>Rejoindre {{ roomsStore.getCurrentRoomStatus.room.name }}</h2>
      </div>
      <v-menu
        v-if="!alreadyMember"
        transition="scale-transition"
        v-model="menu"
        :close-on-content-click="false"
        location="end top"
        offset="10px -20px"
      >
        <template v-slot:activator="{ props }">
          <v-btn icon color="transparent" class="w-full p-2 text-left" v-bind="props">
            <v-icon color="primary" icon="tabler:settings" size="24" />
          </v-btn>
        </template>

        <v-card class="">
          <v-list>
            <v-list-item>
              <div class="p-4">
                <v-sheet width="300" class="mx-auto">
                  <h2 class="mb-4 text-sm font-bold">Paramètres</h2>
                  <v-form validate-on="submit lazy" @submit.prevent="upateRoomInfos">
                    <div class="flex flex-col gap-4">
                      <div class="flex gap-4">
                        <span class="w-12 h-12 border rounded-full"></span>
                        <v-file-input
                          label="Choisir une image"
                          prepend-icon="mdi-camera"
                          variant="solo-filled"
                        ></v-file-input>
                      </div>
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
                      <v-btn
                        :disabled="!form"
                        :loading="loading"
                        type="submit"
                        block
                        class="mt-2"
                        text="Mettre à jour"
                      ></v-btn>
                    </div>
                  </v-form>
                </v-sheet>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
    <NotificationPopUp
      v-model:visible="showErrorPopUp"
      message="Impossible de modifier la salle de discussion"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { RoomType } from '@/utils/chatSocket'
import useRoomsStore from '@/stores/RoomsStore'
export default defineComponent({
  props: {
    isLoading: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const roomsStore = useRoomsStore()
    return {
      roomsStore
    }
  },
  data: () => ({
    menu: false,
    roomName: '',
    roomDescription: '',
    roomType: RoomType.PUBLIC as RoomType,
    roomOldPassword: '',
    roomPassword: '',
    roomPasswordConfirmation: '',
    rules: {
      roomName: [
        (v: string) => !!v || 'Le nom de la salle est requis',
        (v: string) =>
          (v && v.length <= 20) || 'Le nom de la salle doit être inférieur à 20 caractères',
        (v: string) =>
          (v && v.length >= 3) || 'Le nom de la salle doit être supérieur à 3 caractères',
        (v: string) => !this.checkBadWord(v) || 'Le nom de la salle contient un mot interdit'
      ],
      roomOldPassword: [
        (v: string) => !!v || 'Le mot de passe est requis',
        (v: string) =>
          (v && v.length <= 20) || 'Le mot de passe doit être inférieur à 20 caractères',
        (v: string) => (v && v.length >= 3) || 'Le mot de passe doit être supérieur à 3 caractères'
      ],
      roomPassword: [
        (v: string) => !!v || 'Le mot de passe est requis',
        (v: string) =>
          (v && v.length <= 20) || 'Le mot de passe doit être inférieur à 20 caractères',
        (v: string) => (v && v.length >= 3) || 'Le mot de passe doit être supérieur à 3 caractères'
      ],
      roomPasswordConfirmation: [
        (v: string) => !!v || 'La confirmation du mot de passe est requise',
        (v: string) =>
          (v && v.length <= 20) ||
          'La confirmation du mot de passe doit être inférieur à 20 caractères',
        (v: string) =>
          (v && v.length >= 3) ||
          'La confirmation du mot de passe doit être supérieur à 3 caractères',
        (v: string) => v === this.roomPassword || 'Les mots de passe ne correspondent pas'
      ]
    },
    loading: false,
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
    showErrorPopUp: false
  }),
  computed: {
    alreadyMember(): boolean {
      return this.roomsStore.getCurrentRoomStatus.state
    },
    askPassword(): boolean {
      return this.roomType === RoomType.PRIVATE || this.roomType === RoomType.PROTECTED
    },
    hasPassword(): boolean {
      if (!this.roomsStore.getCurrentRoomStatus.state) return false
      if (!this.roomsStore.getCurrentRoomStatus.room) return false
      const hashedPass = this.roomsStore.getCurrentRoomStatus.room.password
      if (!hashedPass) return false
      return hashedPass.length > 0
    },
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
    }
  },
  methods: {
    upateRoomInfos() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.menu = false
      }, 2000)
    }
  }
})
</script>
