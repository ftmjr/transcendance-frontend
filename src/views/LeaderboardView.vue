<template>
  <main class="texte">
    <div>
      <p>Hello from Leaderboard</p>
    </div>
    <br>
    <div>
      <ul>
        <li v-for="user in usersStore.getAllUsers">
          Username : {{user.username}}
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAuthStore from '@/stores/AuthStore'
import useUsersStore from "@/stores/UsersStore";
import { initFlowbite } from 'flowbite'
export default defineComponent({
  name: 'learderboard-view',
  setup(){
    const authStore = useAuthStore()
    const usersStore = useUsersStore()
    return {
      authStore,
      usersStore
    }
  },
  mounted(){
      this.usersStore.setAllUsers()
  },
})
</script>

<style lang="css">
.texte{
  color: white;
}
</style>
