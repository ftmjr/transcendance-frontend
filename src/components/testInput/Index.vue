Vue.createApp({
    data: () => ({ email: 'john@gmail.com' }),
    computed: {
      isValidEmail() {
        return /^[^@]+@\w+(\.\w+)+\w$/.test(this.email);
      }
    },
    template: `
<div>
      <div>
        <input v-model="email" />
      </div>
<div>
        Email is {{isValidEmail ? 'valid' : 'invalid'}}
      </div>
    </div>
    `
  }).mount('#example');
  