<script setup lang="ts">
interface NavLinkProps {
    href: string
}

defineProps<NavLinkProps>()
</script>

<template>
    <NuxtLink :to="href" class="transition hover:text-teal-500 dark:hover:text-teal-400">
      <slot/>
    </NuxtLink>
</template>

<style scoped>

</style>