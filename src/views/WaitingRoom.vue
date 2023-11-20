<template>
  <v-container fluid>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        md="8"
      >
        <v-card color="secondary">
          <v-card-title class="text-h5">
            Bienvenue dans la salle d'attente
          </v-card-title>
          <v-card-actions>
            <v-btn
              v-if="!gameStore.getCurrentGameSession"
              :loading="loading"
              :disabled="loading"
              color="primary"
              @click="joinQueue"
            >
              Rejoindre la file d'attente
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <NotificationPopUp
      v-model:visible="showErrorPopUp"
      :message="popUpMessage"
    />
  </v-container>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import useGameStore, {GameSessionQResponse} from "@/stores/GameStore";
import useNotificationStore from "@/stores/NotificationStore";
import NotificationPopUp from "@/components/notifications/NotificationPopUp.vue";
import {NotificationType} from "@/utils/notificationSocket";

export default defineComponent({
  components: { NotificationPopUp },
  props:{},
  setup() {
    const gameStore = useGameStore();
    const notificationStore = useNotificationStore();
    return {
      gameStore,
      notificationStore
    }
  },
  data() {
    return {
      showErrorPopUp: false,
      popUpMessage: '',
      loading: false,
      queuResponse: null as unknown as GameSessionQResponse
    }
  },
  watch: {
    'gameStore.getCurrentGameSession': {
      handler() {
        this.checkIfAlreadyInGame();
      },
      immediate: true
    },
    'notificationStore.allNotifications': {
      handler() {
        this.checkIfGameMatched();
      },
      deep: true,
    },
  },
  async beforeMount() {
    await this.gameStore.getAllGameSessions();
  },
  async beforeUnmount() {
    if (this.queuResponse){
      await this.gameStore.quitQueList();
    }
  },
  methods: {
    async checkIfAlreadyInGame() {
      if (this.gameStore.getCurrentGameSession) {
        this.$router.push({ name: 'game', params: { gameId: this.gameStore.getCurrentGameSession.gameId } });
      }
    },
    async joinQueue() {
      if (this.gameStore.getCurrentGameSession) {
        this.$router.push({ name: 'game', params: { gameId: this.gameStore.getCurrentGameSession.gameId } })
      } else {
        this.loading = true;
        const qResponse = await this.gameStore.enterInQueList();
        this.queuResponse = qResponse;
        if (qResponse.gameSession) {
          this.$router.push({ name: 'game', params: { gameId: qResponse.gameSession?.gameId } })
        } else {
          this.popUpMessage = `Vous êtes dans la file d'attente.`
          this.showErrorPopUp = true;
        }
        this.loading = false;
      }
    },
    async checkIfGameMatched(){
      console.log(this.notificationStore.allNotifications);
      if (this.notificationStore.allNotifications.length > 0) {
        const notification = this.notificationStore.allNotifications[0];
        if (notification.type === NotificationType.GAME_EVENT && notification.title === 'Game Matched') {
          this.$router.push({ name: 'game', params: { gameId: notification.referenceId } })
        }
      }
    }
  }
})
</script>

<style scoped>

</style>