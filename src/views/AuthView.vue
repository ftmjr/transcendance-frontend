<template>
  <div>
    <!-- email Input component 1 -->
    <EmailInput v-model:value="emailInput" label="Email Address " name="emailInput" type="email" :required="true">
    </EmailInput>
    <p>{{ emailInput }}</p>
    <br>
    <!-- email Input component 2 -->
    <EmailInput v-model:value="emailInput" label="Email Address " name="emailInput" type="email" :required="true">
    </EmailInput>
    <p>{{ emailInput }}</p>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import EmailInput from "../components/EmailInput/EmailInput.vue"

export default defineComponent({
  name: 'AuthView',
  data() {
    return {
      emailInput: ""
    }
  },
  components: { EmailInput }
})
</script>
