<script>
export default {
  data(){
    return {
      schoolBtn:{
        label: "Login with 42",
        style: "text-red-500 text-sm font-sans bg-cyan-400 text-white inline-block px-4 py-2 max-w-xs mx-auto rounded-md font-bold"
      },
      input:{
        value: "",
        error: false,
        username: '',
        password: '',
      }
    }
  },
  methods: {
    createCustomer() {
      let customerData = {
        email: this.email,
        name: this.name,
        password: this.password,
      };
    },
    async sendPostRequest() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.input.username,
          password: this.input.password,
        }),
      };

      try {
        const response = await fetch("https://localhost/api/users", requestOptions);
        const data = await response.json();
        console.log(data);
        // Handle the response or perform any necessary actions
      } catch (error) {
        console.log('salut');
        console.error(error);
        // Handle the error
      }
    }
  }
}
</script>

<template>
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Username
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
      <p class="text-red-500 text-xs italic">Please choose a password.</p>
    </div>
    <div class="flex items-center justify-between">
      <button :class="schoolBtn.style" @submit="sendPostRequest">
        Sign In
      </button>
      <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
      </a>
    </div>
    <button :class="schoolBtn.style" @click="submit">
      {{schoolBtn.label}}
    </button>
  </form>
</template>