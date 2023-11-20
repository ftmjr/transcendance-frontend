<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="auto">
      <v-card>
        <v-card-title class="text-h5"> Votre Adversaire a accepté le défi ! </v-card-title>
        <v-card-text>
          {{ notification.message }}
        </v-card-text>
        <v-card-text>
          Vous allez être redirigé vers la page de jeu. si vous ne voulez pas jouer, vous pouvez
          abandonner. Acceptez-vous le défi ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="refuseChallenge"> Abandonner </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="acceptChallenge"> Jouer </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Notification as NotificationT } from '@/utils/notificationSocket'
import useGameStore from '@/stores/GameStore'
import useNotificationStore from '@/stores/NotificationStore'

export default defineComponent({
  name: 'ChallengeAcceptedDialog',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    notification: {
      type: Object as PropType<NotificationT>,
      required: true
    }
  },
  emits: ['update:showDialog'],
  setup(props) {
    const gameStore = useGameStore()
    const notificationStore = useNotificationStore()
    return {
      gameStore,
      notificationStore
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    dialog: {
      get() {
        return this.showDialog
      },
      set(value: boolean) {
        this.$emit('update:showDialog', value)
      }
    }
  },
  methods: {
    async acceptChallenge() {
      this.loading = true
      await this.notificationStore.markNotificationAsRead(this.notification.id)
      await this.gameStore.getAllGameSessions()
      this.$router.push({ name: 'game', params: { gameId: this.notification.referenceId } })
      this.loading = false
      this.dialog = false
    },
    async refuseChallenge() {
      this.loading = true
      await this.notificationStore.markNotificationAsRead(this.notification.id)
      await this.gameStore.quitGameSession(this.notification.referenceId)
      this.loading = false
      this.dialog = false
    }
  }
})
</script>

<style scoped></style>
