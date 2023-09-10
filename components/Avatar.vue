<script setup lang="ts">
interface AvatarProps {
    large?: boolean
    src?: string
    alt?: string
    outerClass?: string
    provider?: string
}
defineProps<AvatarProps>()
</script>

<template>
    <NuxtLink
      to="/"
      aria-label="Home"
      :class="`pointer-events-auto ${outerClass ?? ''}`"
        v-bind="$attrs"
    >
      <nuxt-img
        :src="src"
        :alt="alt"
        :provider="provider"
        :sizes="`${large ? 'sm:128px' : 'sm:72px'}`"
        :class="`${large ? 'h-16 w-16' : 'h-9 w-9'} rounded-full bg-zinc-100 object-cover object-top dark:bg-zinc-800`"
      />
    </NuxtLink>
</template>

<style scoped>

</style>