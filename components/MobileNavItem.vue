<script setup lang="ts">
interface MobileNavItemProps {
    href: string
}
defineProps<MobileNavItemProps>()
</script>

<template>
    <li>
      <HeadlessPopoverButton as="a" :href="href" class="block py-2">
        <slot />
      </HeadlessPopoverButton>
    </li>
</template>

<style scoped>

</style>