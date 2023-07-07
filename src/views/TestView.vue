<template>
    <div align="center">
        <h1>test input</h1>
        <br>
        <label for="email" id="label-email">Email address</label>
        <input id="email" name="email" value="" placeholder="email">
        <br>
        <label for="password" id="label-email">Password</label>
        <input id="password" name="password" type="text" placeholder="********">
        <br>
        <button class="button button1">Test Button</button>
    </div>
</template>
<script lang="ts">
export default {

}
</script>
<style>
input {
    border: 1px solid black;
    padding: 1px;
    margin: 1px;
}

.button {
    border: none;
    font-size: 12px;
    transition-duration: 0.4s;
}

.button1:hover {
    background-color: black;
    color: gold;
    font-size: 20px;
    ;
}
</style>


<!-- <input type="email" id="email" pattern=".+@global\.com" size="30" -->