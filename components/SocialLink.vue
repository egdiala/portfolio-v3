<script setup lang="ts">
interface SocialLinkProps {
    outerClass?: string
    href: string
    icon: string
}

defineProps<SocialLinkProps>()
</script>

<template>
    <li :class="`${outerClass} flex`">
      <NuxtLink
        :to="href" target="_blank"
        class="group flex text-sm font-medium text-zinc-800 transition hover:text-emerald-500 dark:text-zinc-200 dark:hover:text-emerald-500"
      >
        <Icon :name="icon" class="h-6 w-6 flex-none text-zinc-500 transition group-hover:text-emerald-500" />
        <span class="ml-4"><slot/></span>
      </NuxtLink>
    </li>
</template>

<style scoped>

</style>