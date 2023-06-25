<script setup lang="ts">
interface SocialLinkProps {
    href: string
    icon: string
}

defineProps<SocialLinkProps>()
</script>

<template>
    <a :href="href" target="_blank" class="group -m-1 p-1" v-bind="$attrs">
        <Icon :name="icon" class="h-6 w-6 text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300" />
    </a>
</template>

<style scoped>

</style>