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
        <NuxtLink ref="link" :to="to" class="relative inline-block text-zinc-800 dark:text-zinc-200 px-3 py-2 transition hover:text-teal-500 dark:hover:text-teal-400">
            {{ label }}
            <span v-if="!!isActive" class="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0" />
        </NuxtLink>
    </li>
</template>

<style scoped>
.router-link-exact-active {
    @apply text-teal-500 dark:text-teal-400;
}
</style>