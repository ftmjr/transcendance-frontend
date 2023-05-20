
<template>
<!--  <div class="h-screen w-screen grid place-items-center items-center">-->
<!--     test login-->
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <LoginForm/>
<!--    Test login -->
<!--    <button :class="schoolBtn.style" @click="submit">-->
<!--      {{schoolBtn.label}}-->
<!--    </button>-->
  </div>

</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import axios from "axios";
  import LoginForm from '../components/LoginForm.vue'

  export default defineComponent({
    name: "LoginView",
    components: {
      LoginForm
    },
  })
</script>



