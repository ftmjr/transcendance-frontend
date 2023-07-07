<script setup>
import { ref, computed } from 'vue';

const startValidation = ref(false);
const firstNameInput = ref('');
const lastNameInput = ref('');
const nicknameInput = ref('');
const emailInput = ref('');
const passwordInput = ref('');
const confirmPasswordInput = ref('');

// const nameRegex = ref('^[A-Za-z]+$');
// const emailRegex = ref('^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
// const strongPasswordRegex = ref('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

function register() {
    startValidation.value = true;
}

const isValidFirstName = computed(() => {
    return startValidation.value ? /^[A-Za-z]+$/.test(firstNameInput.value) : null;
})

const isValidLastName = computed(() => {
    return startValidation.value ? /^[A-Za-z]+$/.test(lastNameInput.value) : null;
})

const isValidNickname = computed(() => {
    return startValidation.value ? /^[A-Za-z]+$/.test(nicknameInput.value) : null;
})

const isValidEmail = computed(() => {
    return startValidation.value ? /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value) : null;
})

const isStrongPassword = computed(() => {
    return startValidation.value ? /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(passwordInput.value) : null;
})

const isConfirmedPassword = computed(() => {
    return startValidation.value ? passwordInput.value === confirmPasswordInput.value : null;
})
</script>

<template>
    <div class="title" align="center">
        <p>Page test formulaire</p>
    </div>
    <div align="center">
        <br>
        <br>
        <label for="firstNameInput">First Name</label>
        <br>
        <input v-model="firstNameInput" id="firstNameInput" type="text" placeholder="enter First Name">
        {{ isValidFirstName }}
        <br>
        <br>
        <label for="lastNameInput">Last Name</label>
        <br>
        <input v-model="lastNameInput" id="lastNameInput" type="text" placeholder="enter Last Name">
        {{ isValidLastName }}
        <br>
        <br>
        <label for="nicknameInput">Nickname</label>
        <br>
        <input v-model="nicknameInput" id="nicknameInput" type="text" placeholder="enter Nickname">
        {{ isValidNickname }}
        <br>
        <br>
        <label for="emailInput">Email address</label>
        <br>
        <input v-model="emailInput" id="emailInput" type="text" placeholder="enter email">
        {{ isValidEmail }}
        <br>
        <br>
        <label for="passwordInput">Password</label>
        <br>
        <input v-model="passwordInput" id="passwordInput" type="text" placeholder="enter password">
        {{ isStrongPassword }}
        <br>
        <br>
        <label for="confirmPasswordInput">Confirm Password</label>
        <br>
        <input v-model="confirmPasswordInput" id="confirmPasswordInput" type="text" placeholder="re-enter password">
        {{ isConfirmedPassword }}
        <br>
        <br>
        <button @click="register">[Register button]</button>
    </div>
</template>

<style>
input {
    border: 2px solid black;
}

button {
    background-color: aquamarine;
    border: 2px solid black;
}

.title {
    font-size: 20px;
}
</style>