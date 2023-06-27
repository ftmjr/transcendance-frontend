<template>
  <div>
    <EmailInput @handleInputchange="($data) => handleP($data)" label="Email Address " name="emailInput" type="email"
      :required="true" :value="value" placeholder="">
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
      value: "salut rony"
    }
  },
  components: { EmailInput },
  methods: {
    handleP(data: string | null) {
      this.value = data ?? "";
      console.log(this.value)
    },
  }
})
</script>
