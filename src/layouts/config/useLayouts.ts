import type { MaybeRef } from '@vueuse/shared'
import type { InjectionKey, Ref } from 'vue'
import { config, AppContentLayoutNav, NavbarType } from './config'
import { computed, inject, ref, unref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const injectionKeyIsVerticalNavHovered: InjectionKey<Ref<boolean>> =
  Symbol('isVerticalNavHovered')
export const useLayouts = () => {
  const navbarType = computed({
    get() {
      return config.navbar.type.value
    },
    set(value: typeof config.navbar.type.value) {
      config.navbar.type.value = value
    }
  })

  const isNavbarBlurEnabled = computed({
    get() {
      return config.navbar.navbarBlur.value
    },
    set(value: typeof config.navbar.navbarBlur.value) {
      config.navbar.navbarBlur.value = value
      localStorage.setItem(`${config.app.title}-navbarBlur`, value.toString())
    }
  })

  const _setAppDir = (dir: 'ltr' | 'rtl') => {
    document.documentElement.setAttribute('dir', dir)
  }

  const footerType = computed({
    get() {
      return config.footer.type.value
    },
    set(value: typeof config.footer.type.value) {
      config.footer.type.value = value
    }
  })

  const isVerticalNavCollapsed = computed({
    get() {
      return config.verticalNav.isVerticalNavCollapsed.value
    },
    set(val: typeof config.verticalNav.isVerticalNavCollapsed.value) {
      config.verticalNav.isVerticalNavCollapsed.value = val
      localStorage.setItem(`${config.app.title}-isVerticalNavCollapsed`, val.toString())
    }
  })

  const appContentWidth = computed({
    get() {
      return config.app.contentWidth.value
    },
    set(val: typeof config.app.contentWidth.value) {
      config.app.contentWidth.value = val
      localStorage.setItem(`${config.app.title}-contentWidth`, val.toString())
    }
  })

  const appContentLayoutNav = computed({
    get() {
      return config.app.contentLayoutNav.value
    },
    set(val: typeof config.app.contentLayoutNav.value) {
      config.app.contentLayoutNav.value = val
    }
  })

  const horizontalNavType = computed({
    get() {
      return config.horizontalNav.type.value
    },
    set(value: typeof config.horizontalNav.type.value) {
      config.horizontalNav.type.value = value
    }
  })

  const isLessThanOverlayNavBreakpoint = computed(() => {
    return (windowWidth: MaybeRef<number>) =>
      unref(windowWidth) < config.app.overlayNavFromBreakpoint
  })

  const _layoutClasses = computed(
    () => (windowWidth: MaybeRef<number>, windowScrollY: MaybeRef<number>) => {
      const route = useRoute()

      return [
        `layout-nav-type-${appContentLayoutNav.value}`,
        `layout-navbar-${navbarType.value}`,
        `layout-footer-${footerType.value}`,
        {
          'layout-vertical-nav-collapsed':
            isVerticalNavCollapsed.value &&
            appContentLayoutNav.value === 'vertical' &&
            !isLessThanOverlayNavBreakpoint.value(windowWidth)
        },
        `layout-content-width-${appContentWidth.value}`,
        { 'layout-overlay-nav': isLessThanOverlayNavBreakpoint.value(windowWidth) },
        { 'window-scrolled': unref(windowScrollY) },
        route.meta.layoutWrapperClasses ? route.meta.layoutWrapperClasses : null
      ]
    }
  )

  const switchToVerticalNavOnLtOverlayNavBreakpoint = (windowWidth: MaybeRef<number>) => {
    /*
          ℹ️ This is flag will hold nav type need to render when switching between lgAndUp from mdAndDown window width

          Requirement: When we nav is set to `horizontal` and we hit the `mdAndDown` breakpoint nav type shall change to `vertical` nav
          Now if we go back to `lgAndUp` breakpoint from `mdAndDown` how we will know which was previous nav type in large device?

          Let's assign value of `appContentLayoutNav` as default value of lgAndUpNav. Why 🤔?
            If template is viewed in lgAndUp
              We will assign `appContentLayoutNav` value to `lgAndUpNav` because at this point both constant is same
              Hence, for `lgAndUpNav` it will take value from theme config file
            else
              It will always show vertical nav and if user increase the window width it will fallback to `appContentLayoutNav` value
              But `appContentLayoutNav` will be value set in theme config file
        */
    const lgAndUpNav = ref(appContentLayoutNav.value)

    /*
          There might be case where we manually switch from vertical to horizontal nav and vice versa in `lgAndUp` screen
          So when user comes back from `mdAndDown` to `lgAndUp` we can set updated nav type
          For this we need to update the `lgAndUpNav` value if screen is `lgAndUp`
        */
    watch(appContentLayoutNav, (value) => {
      if (!isLessThanOverlayNavBreakpoint.value(windowWidth)) lgAndUpNav.value = value
    })

    /*
          This is layout switching part
          If it's `mdAndDown` => We will use vertical nav no matter what previous nav type was
          Or if it's `lgAndUp` we need to switch back to `lgAndUp` nav type. For this we will tracker property `lgAndUpNav`
        */
    watch(
      () => isLessThanOverlayNavBreakpoint.value(windowWidth),
      (val) => {
        if (!val) appContentLayoutNav.value = lgAndUpNav.value
        else appContentLayoutNav.value = AppContentLayoutNav.Vertical
      },
      { immediate: true }
    )
  }
  const isVerticalNavMini = (
    windowWidth: MaybeRef<number>,
    isVerticalNavHovered: Ref<boolean> | null = null
  ) => {
    const isVerticalNavHoveredLocal =
      isVerticalNavHovered || inject(injectionKeyIsVerticalNavHovered) || ref(false)

    return computed(
      () =>
        isVerticalNavCollapsed.value &&
        !isVerticalNavHoveredLocal.value &&
        !isLessThanOverlayNavBreakpoint.value(unref(windowWidth))
    )
  }

  const dynamicI18nProps = computed(() => (key: string, tag = 'span') => {
    if (config.app.enableI18n) {
      return {
        keypath: key,
        tag,
        scope: 'global'
      }
    }

    return {}
  })

  const isAppRtl = computed({
    get() {
      return config.app.isRtl.value
    },
    set(value: typeof config.app.isRtl.value) {
      config.app.isRtl.value = value
      localStorage.setItem(`${config.app.title}-isRtl`, value.toString())
      _setAppDir(value ? 'rtl' : 'ltr')
    }
  })

  return {
    navbarType,
    isNavbarBlurEnabled,
    footerType,
    isVerticalNavCollapsed,
    appContentWidth,
    appContentLayoutNav,
    horizontalNavType,
    isLessThanOverlayNavBreakpoint,
    _layoutClasses,
    switchToVerticalNavOnLtOverlayNavBreakpoint,
    isVerticalNavMini,
    dynamicI18nProps,
    isAppRtl,
    _setAppDir
  }
}
