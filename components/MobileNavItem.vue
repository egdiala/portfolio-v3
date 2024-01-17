<script setup lang="ts">
interface MobileNavItemProps {
    href: string
}
defineProps<MobileNavItemProps>()
</script>

<template>
    <li>
      <NuxtLink :to="href" v-bind="$attrs" class="block py-2">
        <slot />
      </NuxtLink>
    </li>
</template>

<style scoped>

</style>