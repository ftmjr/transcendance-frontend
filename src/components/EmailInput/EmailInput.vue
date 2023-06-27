<template>
    <div>
        <label :for="name">{{ label }}</label>
        <input :value="value" @input="handleInput" :type="type" :required="required" :name="name"
            :placeholder="placeholder">
        <!-- <input @input="handleInput" :type="type" :required="required" :name="name" :value="value"
            :placeholder="placeholder"> -->
        <p> {{ isDataValid }}</p>
    </div>
</template>

<script lang="ts">
// import { placeholder } from '@babel/types';
import { defineComponent, type PropType } from 'vue';
//____________________Email_Input_Component____________________//
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
    data() {
        return {
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
            const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

            if (reg.test(email)) return false
            return true
        }
    },
    watch: {
    }
})
</script>

        <!-- return /^[^@]+@\w+(\.\w+)+\w$/.test(this.email); -->