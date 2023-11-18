<template>
  <div>
    <p
      :class="[
        'relative self-start inline-block max-w-xs px-4 py-2 text-sm rounded-md shadow-lg drop-shadow-lg',
        isSender ? 'reply' : 'sender'
      ]"
      style="background-color: #272b47"
    >
      {{ message }}
    </p>
    <div class="flex items-center gap-4 text-xs font-light">
      <span class="text-xs text-gray-400">12:00</span>
      <span>Nom et prénom</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'message',
  props: {
    message: {
      type: String,
      required: true
    },
    isSender: {
      type: Boolean,
      required: true
    }
  }
})
</script>
<style lang="scss">
.sender::before {
  display: block;
  clear: both;
  content: '';
  position: absolute;
  top: -6px;
  left: -7px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 12px 15px 12px;
  border-color: transparent transparent #272b47 transparent;
  -webkit-transform: rotate(-37deg);
  -ms-transform: rotate(-37deg);
  transform: rotate(-37deg);
}
.reply::before {
  display: block;
  clear: both;
  content: '';
  position: absolute;
  bottom: -5px;
  right: -7.5px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 12px 15px 12px;
  border-color: transparent transparent #272b47 transparent;
  -webkit-transform: rotate(37deg);
  -ms-transform: rotate(37deg);
  transform: rotate(37deg);
}
</style>
