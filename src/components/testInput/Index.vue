<template>
    <div>
        <label :for="name">{{ label }}</label>
        <input @input="handleChange" :type="type" :required="required" :name="name" :value="value"
            :placeholder="placeholder">
    </div>
</template>
<script lang="ts">
import { placeholder } from '@babel/types';
import { defineComponent } from 'vue';
export default defineComponent({
    name: "EmailInput",
    props: {
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
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
    methods: {
        handleChange(e: Event) {
            this.$emit(
                "handleInputchange", e.target?.value
            )
        },
    }
})
</script>

        <!-- return /^[^@]+@\w+(\.\w+)+\w$/.test(this.email); -->