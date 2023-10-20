<template>
  <VerticalNavLayout
    :nav-items="navItems"
    v-bind="layoutAttrs"
  >
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
          <VIcon
            icon="tabler-menu-2"
            size="24"
          />
        </VBtn>
        <NavSearchBar class="ms-lg-n3" />
        <VSpacer />
        <NotificationButton />
        <UserProfileButton />
      </div>
    </template>

    <RouterView v-slot="{ Component }">
      <Transition
        :name="appRouteTransition"
        mode="out-in"
      >
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
</style>
