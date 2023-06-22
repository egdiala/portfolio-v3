<script setup lang="ts">

</script>

<template>
    <nav v-bind="$attrs" class="fixed flex z-10 cursor-pointer top-8 flex-row items-center">
        <ul class="flex space-x-0 lg:space-x-2 rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
            <NavItem to="/" label="Home" />
        </ul>
    </nav>
</template>

<style scoped>

</style>