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
    if (authStore.isLoggedIn && !notificationStore.socketOperational) {
      notificationStore.init(authStore.getUser.id)
    }
    return {
      layoutAttrs,
      navItems,
      appRouteTransition,
      isLessThanOverlayNavBreakpoint,
      windowWidth
    }
  }
})
</script>

<style lang="scss">
@use '@layouts/styles/default-layout';

.transparent-input-box {
  .v-field__input {
    padding-block-end: 0.425rem;
    padding-block-start: 0.9375rem;
    background-color: transparent;

    &:focus {
      --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
        var(--tw-ring-offset-color);
      --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width))
        var(--tw-ring-color);
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    }
  }
}
</style>
