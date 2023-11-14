<template>
  <VerticalNavLayout :nav-items="navItemsRefined" v-bind="layoutAttrs">
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="flex h-100 justify-between items-center">
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

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onBeforeUnmount } from 'vue'
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
import useRoomsStore from '@/stores/RoomsStore'
import useUserStore from '@/stores/UserStore'
import { NavLink, VerticalNavItems } from '@layouts/types'

export default defineComponent({
  components: {
    UserProfileButton,
    FooterSection,
    VerticalNavLayout,
    NavSearchBar,
    NotificationButton
  },
  setup() {
    const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig()
    const { width: windowWidth } = useWindowSize()
    const { layoutAttrs, injectSkinClasses } = useSkins()
    injectSkinClasses()
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    const notificationStore = useNotificationStore()
    const gameStore = useGameStore()
    const usersStore = useUserStore()

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
        gameStore.getAllMyGameSessions()
      }
    })
    onBeforeUnmount(() => {
      if (!authStore.isLoggedIn) {
        usersStore.disconnectStatusSocket()
      }
    })
    // const setBadge = (
    //     item:  NavLink,
    //     content: string | undefined,
    //     badgeClass: string | undefined
    // ) => {
    //   item.badgeContent= content;
    //   item.badgeClass= badgeClass;
    // }
    const navItemsRefined = computed<VerticalNavItems>(() => {
      // check in roomsStore if new message update came from socket
      // const mp = roomsStore.getNewMPMessageCount;
      // if (mp > 0) {
      //   setBadge(navItems[7] as NavLink, mp.toString(), 'bg-light-primary text-primary');
      // } else {
      //   setBadge(navItems[7] as NavLink, undefined, undefined);
      // }
      return navItems
    })
    return {
      layoutAttrs,
      navItemsRefined,
      appRouteTransition,
      isLessThanOverlayNavBreakpoint,
      windowWidth
    }
  }
})
</script>

<style lang="scss">
@use '@layouts/styles/default-layout';
</style>
