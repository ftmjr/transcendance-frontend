import type { Router } from 'vue-router'
import type { NavGroup, NavLink, NavLinkProps } from './types'
import { computed, ref } from 'vue'

export const openGroups = ref<string[]>([])

/**
 * Return nav link props to use
 * @param {Object, String} item navigation routeName or route Object provided in navigation data
 */
export const getComputedNavLinkToProp = computed(() => (link: NavLink) => {
  const props: NavLinkProps = {
    target: link.target,
    rel: link.rel
  }

  // If route is string => it assumes string is route name => Create route object from route name
  // If route is not string => It assumes it's route object => returns passed route object
  if (link.to) props.to = typeof link.to === 'string' ? { name: link.to } : link.to
  else props.href = link.href

  return props
})

export const resolveNavLinkRouteName = (link: NavLink, router: Router) => {
  if (!link.to) return null

  if (typeof link.to === 'string') return link.to

  return router.resolve(link.to).name
}
export const isNavLinkActive = (link: NavLink, router: Router) => {
  // Matched routes array of current route
  const matchedRoutes = router.currentRoute.value.matched

  // Check if provided route matches route's matched route
  const resolveRoutedName = resolveNavLinkRouteName(link, router)

  if (!resolveRoutedName) return false

  return matchedRoutes.some((route) => {
    return route.name === resolveRoutedName || route.meta.navActiveLink === resolveRoutedName
  })
}
export const isNavGroupActive = (children: (NavLink | NavGroup)[], router: Router): boolean =>
  children.some((child) => {
    // If child have children => It's group => Go deeper(recursive)
    if ('children' in child) return isNavGroupActive(child.children, router)

    // else it's link => Check for matched Route
    return isNavLinkActive(child, router)
  })
