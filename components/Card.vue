<script setup lang="ts">
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
    <component :is="as" :class="`${cardClass ?? ''} group relative flex flex-col items-start`">
        <slot name="image" />
        <div className="absolute -inset-x-4 -inset-y-6 -z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 sm:-inset-x-6 sm:rounded-2xl" />
        <component :is="titleTag" class="relative text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            <NuxtLink v-if="link" :to="link">{{ linkText }}</NuxtLink>
            <template v-else>{{ linkText }}</template>
        </component>
        <p class="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-6">
        {{ description }}
        </p>
        <NuxtLink v-if="label" :to="link" class="relative z-10 mt-6 flex items-center text-sm font-medium text-zinc-400 transition group-hover:text-emerald-500 dark:text-zinc-200">
            <Icon :name="icon" class="h-4 w-4 flex-none" />
            <span class="ml-2">{{ label }}</span>
        </NuxtLink>
    </component>
</template>

<style scoped>

</style>