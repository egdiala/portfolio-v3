<script setup lang="ts">

</script>

<template>
    <nav v-bind="$attrs">
        <ul class="flex space-x-0 lg:space-x-2 rounded-full bg-white/90 backdrop-filter px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
            <NavItem to="/about" label="About" v-umami="'View-About-Page'" />
            <NavItem to="/work" label="Work" v-umami="'View-Work-Page'" />
            <NavItem to="/projects" label="Projects" v-umami="'View-Projects-Page'" />
            <NavItem to="https://blog.egdiala.dev" target="_blank" label="Blog" v-umami="'View-Blog-Page'" />
        </ul>
    </nav>
</template>

<style scoped>

</style>