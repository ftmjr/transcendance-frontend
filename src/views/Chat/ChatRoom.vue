<template>
  <div class="flex flex-col flex-1 h-full">
    <div class="w-full border-b h-14 text-primary">
      <div class="flex items-center justify-between w-full h-full">
        <v-btn
          @click="roomStore.toggleLeftNav()"
          icon
          color="transparent"
          class="inline-block lg:hidden"
        >
          <v-icon icon="ion:menu"></v-icon>
        </v-btn>
        <room-settings />
        <v-btn
          @click="roomStore.toggleRightNav"
          icon
          color="transparent"
          class="inline-block md:hidden"
        >
          <v-icon>heroicons:user-group-solid</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="relative flex-1 w-full pb-0 overflow-hidden">
      <div class="w-full h-full">
        <perfect-scrollbar
          tag="ul"
          :options="{
            wheelPropagation: false,
            suppressScrollX: true
          }"
          ref="MessagesLogScroller"
          id="messages-log"
          class="flex flex-col h-full gap-4 px-4 pt-6 pb-16 overflow-scroll hide-scroolbar"
        >
          <li class="self-start">
            <message :is-sender="false" message="test message pour faire 1" />
          </li>
          <li class="self-end">
            <message :is-sender="true" message="test message pour faire" />
          </li>
          <li class="self-start">
            <message :is-sender="false" message="test message pour faire" />
          </li>
          <li class="self-end">
            <message :is-sender="true" message="test message pour faire" />
          </li>
          <li class="self-start">
            <message :is-sender="false" message="test message pour faire" />
          </li>
          <li class="self-end">
            <message :is-sender="true" message="test message pour faire" />
          </li>
          <li class="self-start">
            <message :is-sender="false" message="test message pour faire" />
          </li>
          <li class="self-end">
            <message :is-sender="true" message="test message pour faire" />
          </li>
          <li class="self-start">
            <message
              :is-sender="false"
              message="test message pour faire test message pour faire test message pour faire"
            />
          </li>
          <li class="self-end">
            <message :is-sender="true" message="test message pour faire" />
          </li>
          <li class="self-end">
            <message
              :is-sender="true"
              message="test message pour faire test message pour faire test message pour faire"
            />
          </li>
          <li class="self-start">
            <message :is-sender="false" message="test message pour faire" />
          </li>
          <li class="self-end">
            <message :is-sender="true" message="test message pour faire" />
          </li>
          <li class="self-start">
            <message :is-sender="false" message="test message pour faire" />
          </li>
          <li class="self-end">
            <message :is-sender="true" message="test message pour faire dernier" />
          </li>
        </perfect-scrollbar>
      </div>
      <div
        class="absolute w-full px-8 py-2 h-[65px] bottom-0 bg-gradient-to-b from-cyan-900/0 to-[50%] to-cyan-950"
      >
        <form action="" class="flex items-center justify-center w-full h-full">
          <div class="w-full h-[40px] relative">
            <input
              type="text"
              placeholder="Envoyer un message dans le chat général"
              name=""
              id=""
              class="w-full h-full px-4 text-sm font-light border rounded-md"
              style="background-color: #0e1231"
            />
            <v-btn
              color="transparent"
              @click="handleSendMessage"
              class="absolute -translate-y-1/2 border right-2 top-1/2"
              size="26"
              icon
            >
              <v-icon color="primary" size="16" icon="mingcute:send-fill"></v-icon>
            </v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import RoomSettings from './Settings.vue'
import useRoomsStore from '@/stores/RoomsStore'
import Message from './Message.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { ref, onMounted } from 'vue'

const roomStore = useRoomsStore()
const MessagesLogScroller = ref<PerfectScrollbar | null>(null)

const handleSendMessage = async (e: Event) => {
  e.preventDefault()
}

const roomsStore = useRoomsStore()

const scrollToBottomInChatLog = () => {
  const el = MessagesLogScroller.value?.$el as HTMLElement
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

onMounted(() => {
  scrollToBottomInChatLog()
})
</script>
