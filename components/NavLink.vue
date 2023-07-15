<script setup lang="ts">
interface NavLinkProps {
    href: string
}

defineProps<NavLinkProps>()
</script>

<template>
    <NuxtLink :to="href" class="transition hover:text-emerald-500 dark:hover:text-emerald-400">
      <slot/>
    </NuxtLink>
</template>

<style scoped>

</style>