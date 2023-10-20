<template>
  <button
    :type="type"
    :class="[
      classnames ?? styles[variant],
      sizeStyles[size ?? 'medium'],

      'appearence-none disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1'
    ]"
    :disabled="disabled"
    @click="onclick"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { ButtonProps } from 'Components'
export default defineComponent({
  name: 'BaseButton',
  props: {
    type: {
      type: String as PropType<ButtonProps['type']>,
      default: 'button'
    },
    variant: {
      type: String as PropType<ButtonProps['variant']>,
      default: 'primary'
    },
    size: {
      type: String as PropType<ButtonProps['size']>,
      default: 'medium'
    },
    disabled: {
      type: Boolean as PropType<ButtonProps['disabled']>,
      default: false
    },
    classnames: {
      type: String as PropType<ButtonProps['classnames']>,
      default: undefined
    },
    onclick: {
      type: Function as PropType<ButtonProps['onclick']>,
      default: undefined
    }
  },
  data() {
    return {}
  },
  computed: {
    styles() {
      const rtn: {
        [key in ButtonProps['variant']]: string
      } = {
        primary: 'bg-primary text-white disabled:bg-gray-400 disabled:text-gray-800',
        secondary: 'bg-transparent text-primary border border-primary',
        tertiary: 'bg-transparent text-primary'
      }

      return rtn
    },
    sizeStyles() {
      const rtn: {
        [key: string]: string
      } = {
        small: 'text-xs height-[32px] rounded-sm',
        medium: 'text-md height-[44px] rounded-md',
        large: 'text-lg height-[56px] rounded-md'
      }
      return rtn
    }
  }
})
</script>
