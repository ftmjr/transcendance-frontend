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
        v-if="alreadyMember && !isMuted && !isBanned"
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
                  <v-form validate-on="submit lazy" @submit.prevent="upateRoomInfos" v-if="isOwner">
                    <div class="flex gap-4">
                      <VAvatar
                        v-if="roomsStore.getCurrentRoomStatus.room.avatar"
                        :size="42"
                        :image="roomsStore.getCurrentRoomStatus.room.avatar"
                      />
                      <v-file-input
                        :disabled="loading || !isOwner"
                        v-model="file"
                        label="Choisir une image"
                        prepend-icon="mdi-camera"
                        variant="solo-filled"
                      ></v-file-input>
                    </div>
                    <VSelect
                      :disabled="loading || !isOwner"
                      v-model="type"
                      :items="typeList"
                      item-title="text"
                      item-value="value"
                      label="Type de la salle"
                      outlined
                      dense
                      class="mt-4"
                    />
                    <div>
                      <v-text-field
                        :disabled="loading"
                        v-if="type !== 'PUBLIC'"
                        v-model="oldPassword"
                        label="Ancien mot de passe"
                        placeholder=""
                        class="mt-4"
                        dense
                        :rules="rules.oldPassword"
                        type="password"
                      />
                      <v-text-field
                        v-if="type !== 'PUBLIC'"
                        :disabled="loading"
                        v-model="passwordConfirmation"
                        label="Nouveau Mot de passe"
                        placeholder=""
                        :rules="rules.password"
                        outlined
                        type="password"
                        class="mt-4"
                        dense
                      />
                      <v-text-field
                        v-if="type !== 'PUBLIC'"
                        :disabled="loading"
                        v-model="passwordConfirmation"
                        label="Cofirmer le mot de passe"
                        placeholder=""
                        outlined
                        class="mt-4"
                        dense
                        :rules="rules.passwordConfirmation"
                        type="password"
                      />
                    </div>
                    <v-btn
                      :disabled="loading || !isOwner"
                      :loading="loading"
                      type="submit"
                      block
                      class="mt-2"
                      text="Mettre à jour"
                    ></v-btn>
                  </v-form>

                  <v-divider class="my-4"></v-divider>
                  <v-btn
                    :disabled="loading"
                    v-show="!isMuted"
                    @click="quitRoom"
                    type="button"
                    block
                    class="mt-2"
                    text="Quittez la salle"
                  ></v-btn>
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
    name: '',
    roomDescription: '',
    type: RoomType.PUBLIC as RoomType,
    file: null,
    oldPassword: '',
    password: '',
    passwordConfirmation: '',
    rules: {
      name: [
        (v: string) => !!v || 'Le nom de la salle est requis',
        (v: string) =>
          (v && v.length <= 20) || 'Le nom de la salle doit être inférieur à 20 caractères',
        (v: string) =>
          (v && v.length >= 3) || 'Le nom de la salle doit être supérieur à 3 caractères',
        (v: string) => !this.checkBadWord(v) || 'Le nom de la salle contient un mot interdit'
      ],
      oldPassword: [
        (v: string) => !!v || 'Le mot de passe est requis',
        (v: string) =>
          (v && v.length <= 20) || 'Le mot de passe doit être inférieur à 20 caractères',
        (v: string) => (v && v.length >= 3) || 'Le mot de passe doit être supérieur à 3 caractères'
      ],
      password: [
        (v: string) => !!v || 'Le mot de passe est requis',
        (v: string) =>
          (v && v.length <= 20) || 'Le mot de passe doit être inférieur à 20 caractères',
        (v: string) => (v && v.length >= 3) || 'Le mot de passe doit être supérieur à 3 caractères'
      ],
      passwordConfirmation: [
        (v: string) => !!v || 'La confirmation du mot de passe est requise',
        (v: string) =>
          (v && v.length <= 20) ||
          'La confirmation du mot de passe doit être inférieur à 20 caractères',
        (v: string) =>
          (v && v.length >= 3) ||
          'La confirmation du mot de passe doit être supérieur à 3 caractères',
        (v: string) => v === this.password || 'Les mots de passe ne correspondent pas'
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
    isOwner(): boolean {
      return this.roomsStore.getCurrentRoomStatus.role === 'OWNER'
    },
    isMuted(): boolean {
      return this.roomsStore.getCurrentRoomStatus.role === 'MUTED'
    },
    isBanned(): boolean {
      return this.roomsStore.getCurrentRoomStatus.role === 'BAN'
    },
    alreadyMember(): boolean {
      return this.roomsStore.getCurrentRoomStatus.state
    },
    askPassword(): boolean {
      return this.type === type.PRIVATE || this.type === type.PROTECTED
    },
    hasPassword(): boolean {
      if (!this.roomsStore.getCurrentRoomStatus.state) return false
      if (!this.roomsStore.getCurrentRoomStatus.room) return false
      const hashedPass = this.roomsStore.getCurrentRoomStatus.room.password
      if (!hashedPass) return false
      return hashedPass.length > 0
    },
    typeList(): { text: string; value: RoomType }[] {
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
  watch: {
    'roomsStore.currentRoomStatus': {
      handler(value: boolean) {
        if (value) {
          this.fillForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    upateRoomInfos() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.menu = false
      }, 2000)
    },
    fillForm() {
      if (!this.roomsStore.getCurrentRoomStatus.room) return
      this.name = this.roomsStore.getCurrentRoomStatus.room.name
      this.type = this.roomsStore.getCurrentRoomStatus.room.type
      this.oldPassword = this.roomsStore.getCurrentRoomStatus.room.password ? '********' : ''
    },
    async quitRoom() {
      this.loading = true
      const room = this.roomsStore.getCurrentRoomStatus.room
      if (!room) {
        this.loading = false
        return
      }
      const res = await this.roomsStore.quitRoom(room.id)
      if (res === 'success') {
        this.$router.push({ name: 'chat' })
      } else {
        this.showErrorPopUp = true
      }
      this.loading = false
    },
    async handleSubmit() {
      if (this.file) {
        const data = await this.roomsStore.updateAvatar(this.file)
        if (data) {
          //
        }
      }
      //
    }
  }
})
</script>
