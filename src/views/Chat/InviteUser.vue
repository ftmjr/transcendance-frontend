<template>
  <div class="h-full shrink-0 grow-0">
    <PerfectScrollbar
      tag="ul"
      :options="{
        wheelPropagation: false,
        suppressScrollX: true
      }"
      class="h-full pt-4 pb-16 grow-0 srink-0 hide-scrollbar"
    >
      <li v-for="m in users" :key="m.id" class="block px-2 py-2">
        <div class="flex items-center gap-2">
          <AvatarBadgeVue :user-id="m.id" :user="m" />
          <span class="flex-1 inline-block w-16 max-w-full text-sm line-clamp-1">
            {{ m.username }}
          </span>
          <v-btn :size="24" icon color="transparent" @click.prevent="(_) => inviteUsers(m.id)">
            <v-icon :size="16"> mingcute:add-fill </v-icon>
          </v-btn>
        </div>
      </li>
    </PerfectScrollbar>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useUserStore from '@/stores/UserStore'
import { User } from '@/interfaces/User'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import useRoomsStore from '@/stores/RoomsStore'
import AvatarBadgeVue from '@/components/profile/AvatarBadge.vue'

const userStore = useUserStore()
const roomStore = useRoomsStore()

const loading = ref(false)
let users = ref<User[]>([])

const fetchUsers = async () => {
  loading.value = true
  const data = await userStore.searchUsers({
    searchTerm: '',
    currentPage: 1,
    perPage: 100
  })

  const currentRoomMembers = roomStore.getCurrentRoomMembers
  users.value = data.filter((user) => {
    return !currentRoomMembers.find((m) => m.memberId === user.id)
  })

  console.log(users.value)
  loading.value = false
}

onMounted(() => {
  fetchUsers()
})

const inviteUsers = async (userId: number) => {}
</script>
