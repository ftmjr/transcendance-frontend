<template>
  <div class="my-2">
    <h6 class="text-base text-center font-weight-bold mb-3">Tapez les {{ totalInput }} chiffres</h6>
    <div ref="refOtpComp" class="flex align-center gap-4">
      <VTextField
        v-for="i in totalInput"
        :key="i"
        :model-value="digits[i - 1]"
        class="transparent-input-box"
        maxlength="1"
        @keydown="handleKeyDown($event, i)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    totalInput: {
      type: Number,
      default: 6
    }
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  data() {
    return {
      digits: this.modelValue.split('')
    }
  },
  computed: {
    refOtpComp(): HTMLDivElement | null {
      return this.$refs.refOtpComp
    }
  },
  methods: {
    handleKeyDown(event: KeyboardEvent, index: number) {
      if (event.code !== 'Tab' && event.code !== 'ArrowRight' && event.code !== 'ArrowLeft')
        event.preventDefault()
      if (event.code === 'Backspace') {
        this.digits[index - 1] = ''
        if (this.refOtpComp !== null && index > 1) {
          const inputEl = this.refOtpComp.children[index - 2].querySelector('input')
          if (inputEl) inputEl.focus()
        }
      }
      const numberRegExp = /^([0-9])$/
      if (numberRegExp.test(event.key)) {
        this.digits[index - 1] = event.key
        if (this.refOtpComp !== null && index !== 0 && index < this.refOtpComp.children.length) {
          const inputEl = this.refOtpComp.children[index].querySelector('input')
          if (inputEl) inputEl.focus()
        }
      }
      this.$emit('update:modelValue', this.digits.join(''))
    }
  },
  watch: {
    modelValue(value: string) {
      this.digits = value.split('')
    }
  }
})
</script>

<style lang="scss" scoped>
.transparent-input-box {
  .v-field__input {
    max-width: 54px;
    text-align: center;
    background-color: transparent;
    &:focus {
      outline: none;
    }
  }
}
</style>
