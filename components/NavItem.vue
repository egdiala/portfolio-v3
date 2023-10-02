<script setup lang="ts">
interface NavItemProps {
    label: string
    to: string
}

const navLinkProps = defineProps<NavItemProps>()
const route = useRoute()
const link = ref()
const isActive = computed(() => {
    return navLinkProps.to === route.path
})
</script>

<template>
    <li>
        <NuxtLink ref="link" :to="to" active-class="active" exact-active-class="exact" :class="(!!isActive || route.path.startsWith(to)) ? 'active' : ''" class="relative inline-block text-zinc-800 dark:text-zinc-200 px-3 py-2 transition hover:text-emerald-500 dark:hover:text-emerald-400">
            {{ label }}
            <span v-if="!!isActive || route.path.startsWith(to)" v-motion="{ initial: { scale: 0 }, enter: { scale: 1, transition: { ease: 'ease', duration: 500 } } }" class="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/80 to-emerald-500/0 dark:from-emerald-400/0 dark:via-emerald-400/80 dark:to-emerald-400/0" />
        </NuxtLink>
    </li>
</template>

<style scoped>
.active {
    @apply text-emerald-500 dark:text-emerald-400;
}

.exact {
    @apply text-emerald-500 dark:text-emerald-400;
}
</style>