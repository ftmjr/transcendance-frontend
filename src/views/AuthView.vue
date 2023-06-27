<template>
  <div>
    <EmailInput v-model:value="firstName" label="Email Address " name="emailInput" type="email" :required="true">
    </EmailInput>
    <p> firstName: {{ firstName }}</p>

    <EmailInput v-model:value="value" label="Email Address " name="emailInput" type="email" :required="true"
      placeholder="">
    </EmailInput>
    <p> Value: {{ value }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EmailInput from "../components/EmailInput/EmailInput.vue"
export default defineComponent({
  name: 'AuthView',
  data() {
    return {
      value: "salut rony",
      firstName: ""
    }
  },
  components: { EmailInput },
  methods: {

  }
})
</script>
