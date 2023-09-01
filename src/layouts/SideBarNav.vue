<script lang="ts" setup>
import type { Component } from 'vue'
import { VNodeRenderer } from '@/layouts/NavBarUtils/VNodeRenderer'
import { injectionKeyIsVerticalNavHovered, useLayouts } from '@/layouts/config/useLayouts'

import { config } from './config/config'
import type {
  NavGroup,
  NavLink,
  NavSectionTitle,
  VerticalNavItems
} from '@/layouts/NavBarUtils/types'
import { provide, ref, watch } from 'vue'
import { useElementHover, useWindowSize } from '@vueuse/core'
import MenuSectionTitle from '@/layouts/NavBarUtils/MenuSectionTitle.vue'
import MenuItemGroup from '@/layouts/NavBarUtils/MenuItemGroup.vue'
import MenuItemLink from '@/layouts/NavBarUtils/MenuItemLink.vue'
import { useRoute } from 'vue-router'

interface Props {
  tag?: string | Component
  navItems: VerticalNavItems
  isOverlayNavActive: boolean
  toggleIsOverlayNavActive: (value: boolean) => void
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'aside',
  isOverlayNavActive: false
})

const refNav = ref()

const { width: windowWidth } = useWindowSize()

const isHovered = useElementHover(refNav)

provide(injectionKeyIsVerticalNavHovered, isHovered)

const {
  isVerticalNavCollapsed: isCollapsed,
  isLessThanOverlayNavBreakpoint,
  isVerticalNavMini,
  isAppRtl
} = useLayouts()

const hideTitleAndIcon = isVerticalNavMini(windowWidth, isHovered)

const resolveNavItemComponent = (item: NavLink | NavSectionTitle | NavGroup) => {
  if ('heading' in item) return MenuSectionTitle
  if ('children' in item) return MenuItemGroup
  return MenuItemLink
}

const route = useRoute()

watch(
  () => route.name,
  () => {
    props.toggleIsOverlayNavActive(false)
  }
)

const isVerticalNavScrolled = ref(false)
const updateIsVerticalNavScrolled = (val: boolean) => (isVerticalNavScrolled.value = val)
</script>

<template>
  <Component
    :is="props.tag"
    ref="refNav"
    class="layout-vertical-nav"
    :class="[
      {
        'overlay-nav': isLessThanOverlayNavBreakpoint(windowWidth),
        hovered: isHovered,
        visible: isOverlayNavActive,
        scrolled: isVerticalNavScrolled
      }
    ]"
  >
    <div class="nav-header">
      <slot name="nav-header">
        <RouterLink to="/" class="app-logo d-flex align-center gap-x-3 app-title-wrapper">
          <VNodeRenderer :nodes="config.app.logo" />

          <Transition name="vertical-nav-app-title">
            <h1
              v-show="!hideTitleAndIcon"
              class="app-title font-weight-bold leading-normal text-xl"
            >
              {{ config.app.title }}
            </h1>
          </Transition>
        </RouterLink>
        <template v-if="!isLessThanOverlayNavBreakpoint(windowWidth)">
          <Component
            :is="config.app.iconRenderer || 'div'"
            v-show="isCollapsed && !hideTitleAndIcon"
            class="header-action"
            v-bind="config.icons.verticalNavUnPinned"
            @click="isCollapsed = !isCollapsed"
          />
          <Component
            :is="config.app.iconRenderer || 'div'"
            v-show="!isCollapsed && !hideTitleAndIcon"
            class="header-action"
            v-bind="config.icons.verticalNavPinned"
            @click="isCollapsed = !isCollapsed"
          />
        </template>
        <template v-else>
          <Component
            :is="config.app.iconRenderer || 'div'"
            class="header-action"
            v-bind="config.icons.close"
            @click="toggleIsOverlayNavActive(false)"
          />
        </template>
      </slot>
    </div>
    <slot name="before-nav-items">
      <div class="vertical-nav-items-shadow" />
    </slot>
    <slot name="nav-items" :update-is-vertical-nav-scrolled="updateIsVerticalNavScrolled">
      <Component
        :is="resolveNavItemComponent(item)"
        v-for="(item, index) in navItems"
        :key="index"
        :item="item"
      />
    </slot>
  </Component>
</template>

<style lang="scss"></style>
