<template>
  <header>
    <div class="container">
      <div>
        <h1>Logo</h1>
      </div>
      <div>
        <div class="container mx-auto inl">
          <ul>
            <li v-for="item in menu" :key="item.name">
              <router-link :to="item.link">{{ item.name }}</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div></div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'nav-bar',
  components: {
    RouterLink
  },
  data() {
    const menu = [
      {
        name: 'Accueil',
        link: '/'
      },
      {
        name: 'Profile',
        link: '/profile'
      }
    ]
    return {
      menu
    }
  }
})
</script>
