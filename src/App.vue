<script lang="ts">
import { defineComponent } from 'vue'
import { useTheme } from 'vuetify'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import useNotificationStore from '@/stores/NotificationStore'
import useAuthStore from '@/stores/AuthStore'
import useRoomsStore from '@/stores/RoomsStore'
import useGameStore from "@/stores/GameStore";
import useUserStore from "@/stores/UserStore";
export default defineComponent({
  setup() {
    const {
      syncInitialLoaderTheme,
      syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
      isAppRtl
    } = useThemeConfig()
    syncInitialLoaderTheme()
    syncConfigThemeWithVuetifyTheme()
    const { global } = useTheme()
    const color = global.current.value.colors.primary
    const notificationStore = useNotificationStore()
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    const gameStore = useGameStore()
    const usersStore = useUserStore()
    return {
      isAppRtl,
      color,
      authStore,
      roomsStore,
      gameStore,
      usersStore,
      notificationStore
    }
  },
  computed: {
    rgbPrimary(): string | null {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      const hex = this.color.replace(
        shorthandRegex,
        (m: string, r: string, g: string, b: string) => {
          return r + r + g + g + b + b
        }
      )
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
        : null
    }
  },
  watch:{
    'authStore.isLoggedIn':{
      handler(value){
        if (value) {
          this.connectAllSockets()
        }else{
          this.disconnectAllSocket()
        }
      },
      immediate:true
    },
    'authStore.isLocked':{
      handler(value){
        if (value) {
          this.$router.push({ name: 'locked-screen' });
        }
      },
      immediate:true
    },
    'authStore.closeToExpire':{
      handler(value){
        if (value && this.authStore.isLoggedIn) {
          this.authStore.refreshToken()
        }
      },
      immediate:true
    },
  },
  created() {
    window.addEventListener('storage', () => {
      this.authStore.storageUpdated()
    })
  },
  beforeMount() {
    this.connectAllSockets();
  },
  beforeUnmount() {
    this.disconnectAllSocket();
  },
  methods:{
    connectAllSockets(){
      if (this.authStore.isLoggedIn && this.authStore.getUser?.id) {
        if (!this.usersStore.socketOperational) {
          this.usersStore.initStatusSocket(this.authStore.getUser.id)
        }
        if (!this.notificationStore.socketOperational) {
          this.notificationStore.init(this.authStore.getUser.id)
        }
        if (!this.roomsStore.socketOperational) {
          this.roomsStore.init(this.authStore.getUser.id)
        }
        if (!this.gameStore.socketOperational) {
          this.gameStore.initSocket()
        }
      }
    },
    disconnectAllSocket(){
      if (!this.authStore.isLoggedIn) {
        this.usersStore.disconnectStatusSocket()
        this.notificationStore.disconnect()
        this.roomsStore.disconnect()
        this.gameStore.disconnectSocket()
      }
    },
  }
})
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <VApp :style="`--v-global-theme-primary: ${rgbPrimary}`">
      <RouterView />
    </VApp>
  </VLocaleProvider>
</template>
