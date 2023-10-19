<template>
  <VerticalNavLayout :nav-items="navItems" v-bind="layoutAttrs">
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
import { defineComponent } from 'vue'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import navItems from '@/layouts/navigation'
import { VerticalNavLayout } from '@layouts'
import { useWindowSize } from '@vueuse/core'
import { useSkins } from '@core/composable/useSkins'
import FooterSection from '@/layouts/FooterSection.vue'
import NavSearchBar from '@/components/navbar/NavSearchBar.vue'
import UserProfileButton from '@/components/navbar/UserProfileButton.vue'
import NotificationButton from '@/components/navbar/NotificationButton.vue'
import useNotificationStore from '@/stores/NotificationStore'
import useAuthStore from '@/stores/AuthStore'
import roomsStore from '@/stores/RoomsStore'
import useRoomsStore from '@/stores/RoomsStore'

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
    const notificationStore = useNotificationStore()
    const authStore = useAuthStore()
    const roomsStore = useRoomsStore()
    return {
      layoutAttrs,
      navItems,
      appRouteTransition,
      isLessThanOverlayNavBreakpoint,
      windowWidth,
      authStore,
      roomsStore,
      notificationStore
    }
  },
  beforeMount() {
    if (this.authStore.isLoggedIn) {
      if (!this.notificationStore.socketOperational) {
        this.notificationStore.init(this.authStore.getUser.id)
      }
      if (!this.roomsStore.socketOperational) {
        this.roomsStore.init(this.authStore.getUser.id)
      }
    }
  }
})
</script>

<style lang="scss">
@use '@layouts/styles/default-layout';
</style>
