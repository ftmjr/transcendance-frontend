import type { Omit } from 'cypress/types/lodash'

declare module 'Components' {
  export interface ButtonProps {
    text?: string
    variant: 'primary' | 'secondary' | 'tertiary'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
    onclick?: (e: Event) => void
    type?: 'button' | 'submit' | 'reset'
    classnames?: string
  }

  export type ButtonPropsWithIcon = {
    icon: string
    iconPosition: 'left' | 'right'
  } & ButtonProps

  export type SocialLoginProps = Omit<ButtonPropsWithIcon, 'type' | 'variant' | 'text'> & {
    provider: 'google' | 'facebook' | '42'
  }
}
