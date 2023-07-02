<script setup lang="ts">
const slot = useSlots()

interface Card {
    as: string | Component
    titleTag: string | Component
    cardClass?: string
    link?: string
    linkText?: string
    description: string
    icon?: string
    label?: string
}

defineProps<Card>()
</script>

<template>
    <component :is="as" :class="`${cardClass} group relative flex flex-col items-start`">
        <slot name="image" />
        <component :is="titleTag" class="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            <NuxtLink v-if="link" :to="link">{{ linkText }}</NuxtLink>
            <template v-else>{{ linkText }}</template>
        </component>
        <p class=" z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {{ description }}
        </p>
        <p v-if="label" class="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
            <Icon :name="icon" class="h-6 w-6 flex-none" />
            <span class="ml-2">{{ label }}</span>
        </p>
    </component>
</template>

<style scoped>

</style>