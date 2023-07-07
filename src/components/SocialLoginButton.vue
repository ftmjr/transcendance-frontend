<template>
  <a
    :href="`/api/auth/${provider}`"
    :class="[sizeStyles[size], styles[provider], 'block py-3 my-1 text-center']"
  >
    <span class="text-xs"> {{ text }} {{ provider }} </span>
  </a>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { SocialLoginButtonProps, ButtonProps } from 'Components'

export default defineComponent({
  name: 'social-login-button',
  props: {
    provider: {
      type: String as PropType<SocialLoginButtonProps['provider']>,
      required: true
    },
    size: {
      type: String as PropType<ButtonProps['size']>,
      default: 'medium'
    },
    text: {
      type: String as PropType<ButtonProps['text']>,
      default: 'Se connecter avec'
    }
  },
  data() {
    return {}
  },
  computed: {
    styles() {
      const rtn: {
        [key in SocialLoginButtonProps['provider']]: string
      } = {
        '42': 'bg-cyan-500 text-black',
        facebook: 'bg-blue-500 text-white',
        google: 'bg-red-500 text-white'
      }
      return rtn
    },
    sizeStyles() {
      const rtn: {
        [key in ButtonProps['size']]: string
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
