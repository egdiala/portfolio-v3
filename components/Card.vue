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

const cardProps = defineProps<Card>()

const visitPage = async () => {
    if (cardProps?.link?.startsWith('http')) {
        await navigateTo(cardProps.link, {
            external: true,
            open: {
                target: '_blank',
                windowFeatures: {
                    width: 500,
                    height: 500
                }
            }
        })
    } else if (cardProps?.link?.startsWith('/')) {
        await navigateTo(cardProps.link)
    }
}
</script>

<template>
    <component :is="as" :class="`${cardClass ?? ''} group relative flex flex-col items-start`" @click="visitPage()">
        <slot name="image" />
        <div className="absolute -inset-x-4 -inset-y-6 -z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 sm:-inset-x-6 sm:rounded-2xl" />
        <component :is="titleTag" class="relative text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            <template v-if="link" :to="link">{{ linkText }}</template>
            <template v-else>{{ linkText }}</template>
        </component>
        <p class="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-6">
        {{ description }}
        </p>
        <div v-if="label" class="relative z-10 mt-6 flex items-center text-sm font-medium text-zinc-400 transition-all ease-out duration-300 group-hover:text-emerald-500 dark:text-zinc-200">
            <Icon :name="icon" class="h-4 w-4 flex-none" />
            <span class="ml-2">{{ label }}</span>
        </div>
    </component>
</template>

<style scoped>

</style>