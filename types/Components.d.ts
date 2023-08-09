declare module 'Components' {
  import type { Omit } from 'cypress/types/lodash'
  export interface ButtonProps {
    variant: 'primary' | 'secondary' | 'tertiary'
    size: 'small' | 'medium' | 'large'
    disabled?: boolean
    onclick?: (e: Event) => void
    type?: 'button' | 'submit' | 'reset'
    classnames?: string
  }

  export type ButtonPropsWithIcon = {
    icon: string
    iconPosition: 'left' | 'right'
  } & ButtonProps

  export type SocialLoginProps = Omit<ButtonPropsWithIcon, 'type' | 'variant'> & {
    provider: 'google' | 'facebook' | '42'
  }

  export interface InputProps {
    type: 'text' | 'password' | 'email' | 'number'
    name: string
    value: string
    placeholder?: string
    classnames?: string
    error?: boolean
    label: string
    errorMessage?: string
    required?: boolean
    iconClasses?: string
    maxLength?: number
    min?: number
    max?: number
    formatinput?: (value: string) => string
    handleKeyPress?: (e: KeyboardEvent) => boolean
    handleKeyUp?: (e: KeyboardEvent) => boolean|void
    validate?: (value: string) => boolean
  }
}
