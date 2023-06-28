<template>
    <div>
        <label :for="name">{{ label }}</label>
        <input @input="handleInput" :type="type" :required="required" :name="name" :value="value"
            :placeholder="placeholder">
        <p>Is valid email? : {{ isDataValid }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
    name: "EmailInput",
    props: {
        label: {
            type: String,
            required: true
        },
        type: {
            type: String as PropType<'email' | 'text'>,
            required: true
        },
        required: {
            type: Boolean,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            required: false,
            default: "Please enter your email."
        }
    },
    computed: {
        isDataValid(): boolean {
            if (this.type === "email") {
                return this.isValidEmail(this.value);
            }
            return true;
        }
    },
    methods: {
        handleInput(e: Event) {
            console.log("send event", e.target?.value);
            this.$emit(
                "update:value", e.target?.value
            )
        },
        isValidEmail(email: string) {
            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

            if (regex.test(email)) return true
            return false
        }
    }
})
</script>

        <!-- return /^[^@]+@\w+(\.\w+)+\w$/.test(this.email); -->