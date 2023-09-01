import { RouteLocationRaw } from 'vue-router'

interface AclProperties {
  action: string
  subject: string
}

export interface NavSectionTitle extends Partial<AclProperties> {
  heading: string
}

type ATagTargetAttrValues = '_blank' | '_self' | '_parent' | '_top' | 'framename'
type ATagRelAttrValues =
  | 'alternate'
  | 'author'
  | 'bookmark'
  | 'external'
  | 'help'
  | 'license'
  | 'next'
  | 'nofollow'
  | 'noopener'
  | 'noreferrer'
  | 'prev'
  | 'search'
  | 'tag'

export interface NavLinkProps {
  to?: RouteLocationRaw | string | null
  href?: string
  target?: ATagTargetAttrValues
  rel?: ATagRelAttrValues
}

export interface NavLink extends NavLinkProps, Partial<AclProperties> {
  title: string
  icon?: unknown
  badgeContent?: string
  badgeClass?: string
  disable?: boolean
}

// 👉 Vertical nav group
export interface NavGroup extends Partial<AclProperties> {
  title: string
  icon?: unknown
  badgeContent?: string
  badgeClass?: string
  children: (NavLink | NavGroup)[]
  disable?: boolean
}

export type VerticalNavItems = (NavLink | NavGroup | NavSectionTitle)[]
