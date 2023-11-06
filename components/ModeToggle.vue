<script setup lang="ts">
const colorMode = useColorMode()

const toggleMode = () => {
    if (colorMode.value === 'dark') {
        colorMode.preference = 'light'
    } else {
        colorMode.preference = 'dark'
    }
}
</script>

<template>
    <button
      type="button"
      aria-label="Toggle dark mode"
      class="group rounded-full bg-white/90 backdrop-filter p-1.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20 grid content-center justify-items-center"
      @click="toggleMode"
    >
        <Icon v-show="$colorMode.value === 'dark'" name="ri:moon-fill" class="hidden h-6 w-6 text-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-emerald-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-emerald-500" />
        <Icon v-show="$colorMode.value === 'light'" name="heroicons:sun" class="h-6 w-6 fill-zinc-100 text-zinc-500 transition group-hover:fill-zinc-200 group-hover:text-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-emerald-50 [@media(prefers-color-scheme:dark)]:text-emerald-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-emerald-50 [@media(prefers-color-scheme:dark)]:group-hover:text-emerald-600" />
    </button>
</template>

<style scoped>

</style>