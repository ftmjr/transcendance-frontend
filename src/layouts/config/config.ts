import { breakpointsVuetify } from '@vueuse/core'
import { h, ref } from 'vue'
import { Icon } from '@iconify/vue'

export const ContentWidth = {
  Fluid: 'fluid',
  Boxed: 'boxed'
} as const

export const NavbarType = {
  Sticky: 'sticky',
  Static: 'static',
  Hidden: 'hidden'
} as const

export const FooterType = {
  Sticky: 'sticky',
  Static: 'static',
  Hidden: 'hidden'
} as const

export const AppContentLayoutNav = {
  Vertical: 'vertical',
  Horizontal: 'horizontal'
} as const

export const config = {
  app: {
    title: 'Pong',
    logo: h('img', { src: '/src/assets/favicon.ico' }),

    // logo: () => h('img', { src: 'assets/colored-logo.png' }, null),
    contentWidth: ref(ContentWidth.Boxed),
    contentLayoutNav: ref(AppContentLayoutNav.Vertical),
    overlayNavFromBreakpoint: breakpointsVuetify.md + 16,
    enableI18n: false,
    isRtl: ref(false),
    iconRenderer: Icon
  },
  navbar: {
    type: ref(NavbarType.Sticky),
    navbarBlur: ref(true)
  },
  footer: { type: ref(FooterType.Static) },
  verticalNav: {
    isVerticalNavCollapsed: ref(false),
    defaultNavItemIconProps: { icon: 'tabler-circle' }
  },
  horizontalNav: {
    type: ref('sticky')
  },
  icons: {
    chevronDown: { icon: 'tabler-chevron-down' },
    chevronRight: { icon: 'tabler-chevron-right' },
    close: { icon: 'tabler-x' },
    verticalNavPinned: { icon: 'tabler-circle-dot' },
    verticalNavUnPinned: { icon: 'tabler-circle' },
    sectionTitlePlaceholder: { icon: 'tabler-minus' }
  }
}
