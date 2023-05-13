<template>
  <div class="h-screen w-screen grid place-items-center items-center">
    <button :class="schoolBtn.style" @click="submit">
      {{schoolBtn.label}}
    </button>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  export default defineComponent({
    name: "LoginView",
    data(){
      return {
        schoolBtn:{
          label: "Login with 42",
          style: "text-red-500 text-sm font-sans bg-cyan-400 text-white inline-block px-4 py-2 max-w-xs mx-auto rounded-md font-bold"
        },
        input:{
          value: "",
          error: false
        }
      }
    },
    methods:{
      submit(){
        fetch('https://api.intra.42.fr/oauth/token', {
          method: 'POST',
          body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': 'u-s4t2ud-618818154b26420d4cb2bdcfb8a4b9d532d60f5daa6dc2e51152cb506324549b',
            'client_secret': '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'
          })
        }).then(response => response.json()).then(res => console.log(res.data)).catch(e => console.log(e.message))
      },
    }
  })
</script>