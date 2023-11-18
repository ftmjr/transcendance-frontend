<template>
  <div>
    <div
      :class="[
        'relative self-start inline-block max-w-xs px-4 py-2 text-sm rounded-md shadow-lg drop-shadow-lg',
        isSender ? 'reply' : 'sender'
      ]"
      style="background-color: #272b47"
    >
      <p :key="msg.message" class="" v-for="(msg, index) in msgGroup.messages">
        {{ msg.message }}
      </p>
    </div>
    <div class="flex items-center gap-4 text-xs font-light">
      <span class="text-xs text-gray-400">
        {{
          formatDate(msgGroup.messages[msgGroup.messages.length - 1].time, {
            hour: 'numeric',
            minute: 'numeric'
          })
        }}
      </span>
      <span>Nom et prénom</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { type ChatMessageGroup } from './ChatRoom.vue'
import { formatDate } from '@core/utils/formatters'

export default defineComponent({
  name: 'message',
  props: {
    msgGroup: {
      type: Object as PropType<ChatMessageGroup>,
      required: true
    },
    isSender: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    formatDate
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
