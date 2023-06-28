<template>
    <div>
        <input type="email" name="email" :value="value" @input="(e: Event) => handleChange(e)"
            :class="error ? 'border-red-400' : 'border-green-100'" />
    </div>
</template>
<script lang="ts">
export default {
    data() {


        return {
            error: false,
            value: "",
        }
    },
    methods: {
        isEMail(value: string) {
            const emailRegex;


        },
        handleChange(e: Event) {
            const { name, value } = e.target;

            if (!this.isEMail(value))
                this.error = true;
            else
                this.error = false;

            this.value = value;
            this.$emit("input-update", {
                value: this.value,
                error: this.error,
                name: name
            })
        }
    }
}
</script>
