<template>
  <VerticalNavLayout :nav-items="navItems" v-bind="layoutAttrs" class="">
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="flex items-center justify-between h-100">
        <VBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          icon
          variant="text"
          color="default"
          class="ms-n3"
          size="small"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="tabler-menu-2" size="24" />
        </VBtn>
        <NavSearchBar class="ms-lg-n3" />
        <VSpacer />
        <NotificationButton />
        <UserProfileButton />
      </div>
    </template>

    <RouterView v-slot="{ Component }">
      <Transition :name="appRouteTransition" mode="out-in">
        <Component :is="Component" />
      </Transition>
    </RouterView>

    <template #footer>
      <FooterSection />
    </template>
  </VerticalNavLayout>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import navItems from '@/layouts/navigation'
import { VerticalNavLayout } from '@layouts'
import { useWindowSize } from '@vueuse/core'
import { useSkins } from '@core/composable/useSkins'
import FooterSection from '@/layouts/FooterSection.vue'
import NavSearchBar from '@/components/navbar/NavSearchBar.vue'
import UserProfileButton from '@/components/navbar/UserProfileButton.vue'
import NotificationButton from '@/components/navbar/NotificationButton.vue'
import useGameStore from '@/stores/GameStore'
import useAuthStore from '@/stores/AuthStore'
import useNotificationStore from '@/stores/NotificationStore'
import { Notification as NotificationT, NotificationType } from '@/utils/notificationSocket'
import useRoomsStore from '@/stores/RoomsStore'
import useUserStore from '@/stores/UserStore'

const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig()
const { width: windowWidth } = useWindowSize()
const { layoutAttrs, injectSkinClasses } = useSkins()
injectSkinClasses()
const authStore = useAuthStore()
const roomsStore = useRoomsStore()
const notificationStore = useNotificationStore()
const gameStore = useGameStore()
const usersStore = useUserStore()
const router = useRouter()

const showChallengeAcceptedDialog = ref(false)
const checkIfNewNotificationIsANewGameChallenge = (notification: NotificationT) => {
  if (notification.type === NotificationType.GAME_EVENT && notification.title === 'Game Started') {
    showChallengeAcceptedDialog.value = true
  }
}

// watch if is locked and move him to locked page
watch(
  () => authStore.isLocked,
  (isLocked) => {
    if (isLocked) {
      router.push({ name: 'locked-screen' })
    }
  }
)

// watch if new notification is a new game challenge
watch(
  () => notificationStore.allNotifications,
  (notifications) => {
    if (notifications.length > 0) {
      checkIfNewNotificationIsANewGameChallenge(notifications[0])
    }
  }
)

// a beforeMount hook would be better
onBeforeMount(() => {
  if (authStore.isLoggedIn && authStore.getUser?.id) {
    if (!notificationStore.socketOperational) {
      notificationStore.init(authStore.getUser.id)
    }
    if (!roomsStore.socketOperational) {
      roomsStore.init(authStore.getUser.id)
    }
    if (!usersStore.socketOperational) {
      usersStore.initStatusSocket(authStore.getUser.id)
    }
    gameStore.getAllGameSessions()
  }
})

onBeforeUnmount(() => {
  if (!authStore.isLoggedIn) {
    usersStore.disconnectStatusSocket()
  }
})
</script>

<style lang="scss">
@use '@layouts/styles/default-layout';
</style>
