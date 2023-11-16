<template>
  <div class="w-full">
    <div class="py-4 px-8">
      <h1 class="">
        <span class=""> {{ greetMe() }}, </span>
        <span class="text-2xl font-bold">
          {{
            `${authStore.user?.profile?.name.split(' ').shift()} ${authStore.user?.profile?.lastname
              .split(' ')
              .shift()}! `
          }}
        </span>
      </h1>
      <div>
        <div class="flex flex-col md:flex-row justify-between gap-4">
          <p v-if="dateObject.hours" class="text-7xl font-thin">
            {{ `${dateObject.hours}:${dateObject.minutes}:${dateObject.seconds}` }}
          </p>
          <div class="">
            <p class="">Partie Rapide</p>
            <div class="flex gap-2">
              <button
                class="px-4 py-2 text-sm border bg-none inline-block rounded-md hover:bg-orange/10"
                @click.prevent="goToPlayWithBot"
              >
                <span class="flex gap-1 items-center">
                  <v-avatar rounded variant="tonal" color="orange" icon="mdi-gamepad-circle-up" />
                  <span>Contre l'IA</span>
                </span>
              </button>
              <button
                class="px-4 py-2 text-sm border bg-none inline-block rounded-md hover:bg-cyan-400/10"
                @click.prevent="goToWaitingRoom"
              >
                <v-avatar rounded variant="tonal" color="cyan" icon="mdi-loading" />
                <span> Salle d'attente </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useAuthStore from '@/stores/AuthStore'
import { ref, Ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const greetMe = () => {
  const now = new Date()
  if (now.getHours() >= 6 && now.getHours() < 12) {
    return 'Bonjour'
  } else if (now.getHours() >= 12 && now.getHours() < 18) {
    return 'Bon après-midi'
  } else if (now.getHours() >= 18 && now.getHours() < 24) {
    return 'Bonsoir'
  } else if (now.getHours() >= 0 && now.getHours() < 6) {
    return 'Bonne nuit'
  }
}

type DateObject = {
  now: Date
  hours: number | string
  minutes: number | string
  seconds: number | string
}
const now = new Date()
const dateObject = ref<DateObject>({
  now,
  hours: now.getHours(),
  minutes: now.getMinutes(),
  seconds: now.getSeconds()
})

const getDate = (dateObject: Ref<DateObject>) => {
  dateObject.value['now'] = new Date()
  return dateObject
}
const getHours = (dateObject: Ref<DateObject>) => {
  dateObject.value['hours'] = dateObject.value.now.getHours()
  return dateObject
}
const getMinutes = (dateObject: Ref<DateObject>) => {
  dateObject.value['minutes'] = dateObject.value.now.getMinutes()
  return dateObject
}
const getSeconds = (dateObject: Ref<DateObject>) => {
  dateObject.value['seconds'] = dateObject.value.now.getSeconds()
  return dateObject
}
const formatTime = (dateObject: Ref<DateObject>) => {
  const { hours, minutes, seconds } = dateObject.value
  if (+hours < 10) dateObject.value['hours'] = `0${hours}`
  if (+minutes < 10) dateObject.value['minutes'] = `0${minutes}`
  if (+seconds < 10) dateObject.value['seconds'] = `0${seconds}`
  return dateObject
}

const compose =
  (...fns: Function[]) =>
  (x: any) =>
    fns.reduceRight((y, f) => f(y), x)

const makeDate = compose(formatTime, getSeconds, getMinutes, getHours, getDate)
let timer: NodeJS.Timer | null = null

const getUserPosLonLat = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position)
    })
  }
}

onMounted(() => {
  timer = setInterval(() => {
    dateObject.value = makeDate(dateObject)
  }, 1000)

  getUserPosLonLat()
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const goToPlayWithBot = () => {
  router.push({ name: 'bot-game' })
}
const goToWaitingRoom = () => {
  router.push({ name: 'waiting-room' })
}
</script>
