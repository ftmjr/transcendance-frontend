<template>
  <div class="flex-1 h-full">
    <div
      v-if="roomsStore.currentRoom && isLoading"
      class="flex items-center justify-between h-full pl-8"
    >
      <div class="flex flex-row items-center gap-2">
        <VAvatar
          v-if="roomsStore.currentRoom.avatar"
          :size="42"
          :image="roomsStore.currentRoom.avatar"
        />
        <h2 v-if="roomsStore.isMemberOfRoom">
          {{ roomsStore.currentRoom.name }}
        </h2>
        <h2 v-else>
          Rejoindre {{ roomsStore.currentRoom.name }}
        </h2>
      </div>
      <v-menu
        v-if="roomsStore.isMemberOfRoom && !roomsStore.isMuted && !roomsStore.isBanned"
        v-model="menu"
        transition="scale-transition"
        :close-on-content-click="false"
        location="end top"
        offset="10px -20px"
      >
        <template #activator="{ props }">
          <v-btn
            icon
            color="transparent"
            class="w-full p-2 text-left"
            v-bind="props"
          >
            <v-icon
              color="primary"
              icon="tabler:settings"
              size="24"
            />
          </v-btn>
        </template>

        <v-card class="">
          <v-list>
            <v-list-item>
              <div class="p-4">
                <v-sheet
                  width="300"
                  class="mx-auto"
                >
                  <h2 class="mb-4 text-sm font-bold">
                    Paramètres
                  </h2>
                  <v-form
                    v-if="roomsStore.isOwner"
                    validate-on="submit lazy"
                    @submit.prevent="updateRoomInfos"
                  >
                    <VCardText class="flex flex-col items-center gap-1">
                      <VAvatar
                        v-if="roomsStore.currentRoom.avatar"
                        rounded
                        :size="100"
                        :image="roomsStore.currentRoom.avatar"
                      />
                      <v-file-input
                        v-model="filesToUpload"
                        placeholder="Charger votre image"
                        accept="image/png, image/jpeg, image/bmp"
                        :single-line="true"
                        :disabled="loading"
                        density="compact"
                        color="secondary"
                        variant="solo"
                        label="avatar"
                        :prepend-icon="loading ? 'mdi-loading mdi-spin' : 'mdi-upload'"
                      >
                        <template #selection="{ fileNames }">
                          <template
                            v-for="fileName in fileNames"
                            :key="fileName"
                          >
                            <v-chip
                              size="small"
                              label
                              color="primary"
                            >
                              {{ fileName }}
                            </v-chip>
                          </template>
                        </template>
                      </v-file-input>
                    </VCardText>
                    <VDivider />
                    <VSelect
                      v-model="type"
                      :disabled="loading || !roomsStore.isOwner"
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
                        v-if="type !== 'PUBLIC'"
                        v-model="oldPassword"
                        :disabled="loading"
                        label="Ancien mot de passe"
                        placeholder=""
                        class="mt-4"
                        dense
                        :rules="rules.oldPassword"
                        type="password"
                      />
                      <v-text-field
                        v-if="type !== 'PUBLIC'"
                        v-model="password"
                        :disabled="loading"
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
                        v-model="passwordConfirmation"
                        :disabled="loading"
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
                      :disabled="loading || !roomsStore.isOwner"
                      :loading="loading"
                      type="submit"
                      :block="true"
                      class="mt-2"
                      text="Mettre à jour"
                    />
                  </v-form>
                  <v-divider class="my-4" />
                  <v-btn
                    v-show="!roomsStore.isBanned"
                    :disabled="loading"
                    type="button"
                    :block="true"
                    class="mt-2"
                    text="Quittez la salle"
                    @click="quitRoom"
                  />
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
      color="warning"
    />
    <NotificationPopUp
      v-model:visible="showLeaveErrorPopUp"
      :message="leaveErrorMessage"
      color="error"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { RoomType } from '@/utils/chatSocket'
import useRoomsStore, { UpdateRoomData } from '@/stores/RoomsStore'
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
        (v: string) => (v && v.length >= 6) || 'Le mot de passe doit être supérieur à 3 caractères'
      ],
      password: [
        (v: string) => !!v || 'Le mot de passe est requis',
        (v: string) =>
          (v && v.length <= 20) || 'Le mot de passe doit être inférieur à 20 caractères',
        (v: string) => (v && v.length >= 6) || 'Le mot de passe doit être supérieur à 6 caractères'
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
    showErrorPopUp: false,
    showLeaveErrorPopUp: false,
    leaveErrorMessage: '',
    filesToUpload: undefined as File[] | undefined
  }),
  computed: {
    hasPassword(): boolean {
      return this.roomsStore.isPasswordProtected
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
    async updateRoomInfos() {
      this.loading = true
      const room = this.roomsStore.currentRoom
      if (!room) return
      const data: UpdateRoomData = {
        // name: this.name,
        roomId: room.id,
        roomType: this.type,
        oldPassword: this.oldPassword.length > 0 ? this.oldPassword : undefined,
        password: this.password.length > 0 ? this.password : undefined,
      }
      // to update the avatar we need to do it before the rest of the update
      const newAvatar = this.filesToUpload?.[0]
      if (newAvatar) {
        await this.roomsStore.updateAvatar(room.id, newAvatar)
      }
      const res = await this.roomsStore.updateRoom(room.id, data)
      if (res !== 'success') {
        this.showErrorPopUp = true
      }
      this.loading = false
    },
    fillForm() {
      if (!this.roomsStore.currentRoom) return
      this.name = this.roomsStore.currentRoom.name
      this.type = this.roomsStore.currentRoom.type
      this.oldPassword = this.roomsStore.isPasswordProtected ? '********' : ''
      this.filesToUpload = undefined
    },
    async quitRoom() {
      const room = this.roomsStore.currentRoom
      if (!room) return
      this.loading = true
      const res = await this.roomsStore.quitRoom(room.id)
      if (res !== 'success') {
        this.leaveErrorMessage = res
        this.showLeaveErrorPopUp = true
      }
      this.loading = false
    }
  }
})
</script>
