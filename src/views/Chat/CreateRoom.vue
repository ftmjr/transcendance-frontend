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
                <v-form validate-on="submit lazy" @submit.prevent="tryToUpateRooInfos">
                  <div class="flex flex-col gap-4">
                    <div class="flex gap-4">
                      <span class="w-12 h-12 border rounded-full"></span>
                      <v-file-input
                        label="Choisir une image"
                        prepend-icon="mdi-camera"
                        variant="solo-filled"
                      ></v-file-input>
                    </div>
                    <v-text-field v-model="roomName" :rules="rules" label="nom"></v-text-field>
                    <v-select v-model="roomType" :items="roomTypeList"></v-select>
                    <v-text-field
                      :disabled="roomType === 'public'"
                      v-model="roomName"
                      :rules="rules"
                      label="mot de passe"
                    ></v-text-field>
                    <v-text-field
                      :disabled="roomType === 'public'"
                      v-model="roomName"
                      :rules="rules"
                      label="Verifiez le mot de passe"
                    ></v-text-field>
                    <v-btn
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
</template>
<script setup lang="ts">
import { ref } from 'vue'

const menu = ref(false)

const roomName = ref('room name')
const isPrivateRoom = ref(false)
const password = ref('password')
const confirmPassword = ref('password')

const roomTypeList = ['public', 'private', 'protected']

const roomType = ref(roomTypeList[0])

const loading = ref(false)
const rules = ref([
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length <= 10) || 'Name must be less than 10 characters'
])

const tryToUpateRooInfos = async (e: Event) => {
  e.preventDefault()
  try {
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>
