<script setup lang="ts">
interface ButtonProps {
    to?: string
    link?: string
    variant: string
    extraClass?: string
}
const buttonProps = defineProps<ButtonProps>()
const classes = computed(() => ({
    'button': true,
    [`${buttonProps.variant}`]: true,
    [`${buttonProps.extraClass}`]: buttonProps.extraClass
}))
</script>

<template>
    <a v-if="link" :href="link" :class="classes" v-bind="$attrs"><slot/></a>
    <button v-if="!to && !link" v-bind="$attrs" type="button" :class="classes"><slot/></button>
    <NuxtLink v-if="to" v-bind="$attrs" :class="classes"><slot/></NuxtLink>
</template>

<style scoped>
.button {
    @apply flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none;
}
.primary {
    @apply bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70;
}

.secondary {
    @apply bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70;
}
</style>
