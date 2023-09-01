<template>
  <div :class="['layout-wrapper', ...layoutClasses(windowWidth, windowScrollY)]">
    <SideBarNav
      :isOverlayNavActive="isOverlayNavActive"
      :toggle-is-overlay-nav-active="toggleIsOverlayNavActive"
      :nav-items="menuItems"
    />
    <div class="layout-content-wrapper">
      <header :class="['layout-navbar', { 'navbar-blur': isNavbarBlurEnabled }]">
        <NavBar :toggle-vertical-overlay-nav-active="toggleIsOverlayNavActive" />
      </header>
      <main class="layout-page-content">
        <div class="page-content-container">
          <router-view />
        </div>
      </main>
      <FooterSection />
    </div>
    <div
      :class="['layout-overlay', { visible: isLayoutOverlayVisible }]"
      @click="toggleOverlayVisibility"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import { useToggle, useWindowScroll, useWindowSize } from '@vueuse/core'
import { useLayouts } from '@/layouts/config/useLayouts'
import { useRouter } from 'vue-router'
import SideBarNav from '@/layouts/SideBarNav.vue'
import navItems from '@/layouts/navigation'
import NavBar from '@/layouts/NavBar.vue'
import FooterSection from '@/layouts/FooterSection.vue'

export default defineComponent({
  components: { FooterSection, NavBar, SideBarNav },
  setup() {
    const authStore = useAuthStore()
    const { y: windowScrollY } = useWindowScroll()
    const { width: windowWidth } = useWindowSize()
    const {
      _layoutClasses: layoutClasses,
      isLessThanOverlayNavBreakpoint,
      isNavbarBlurEnabled
    } = useLayouts()
    const isOverlayNavActive = ref(false)
    const isLayoutOverlayVisible = ref(false)
    const toggleIsOverlayNavActive = useToggle(isOverlayNavActive)
    watch(windowWidth, (value) => {
      if (!isLessThanOverlayNavBreakpoint.value(value) && isLayoutOverlayVisible.value)
        isLayoutOverlayVisible.value = false
    })
    const router = useRouter()
    const shallShowPageLoading = ref(false)
    const menuItems = ref(navItems)
    return {
      authStore,
      windowWidth,
      windowScrollY,
      layoutClasses,
      isLessThanOverlayNavBreakpoint,
      isNavbarBlurEnabled,
      isOverlayNavActive,
      isLayoutOverlayVisible,
      toggleIsOverlayNavActive,
      router,
      shallShowPageLoading,
      menuItems
    }
  },
  beforeCreate() {
    // alert("me");
    //   check if the user is authenticated
  },
  methods: {
    toggleOverlayVisibility() {
      this.isLayoutOverlayVisible = !this.isLayoutOverlayVisible
    }
  }
})
</script>

<style scoped></style>
