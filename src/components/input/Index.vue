<template>
    <div>
        <email-input v-if="type === 'email'" @input-update="($e) => handleChange($e)" />
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'

const EmailInput = () => import('./EmailInput.vue')

export default defineComponent({
    name: 'BaseInput',
    props: {
        type: {
            type: String as PropType<'email' | 'password'>,
            required: true
        }
    },
    components: {
        EmailInput
    },
    methods: {
        handleChange(e: Event) {
            const { name, value, error } = e;
        }
    }
})
</script>
