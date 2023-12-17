<script setup lang="ts">
import type { MotionVariants } from '@vueuse/motion';

const variants: MotionVariants = {
  initial: {
    opacity: 0,
    y: -24
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      duration: 800,
    }
  }
}
</script>

<template>
    <footer v-motion="variants" class="mt-32">
      <Container inner-class="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
        <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <NavLink href="/about">About</NavLink>
                <NavLink href="/work">Work</NavLink>
                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/tools">Tools</NavLink>
            </div>
            <p class="text-sm text-zinc-400 dark:text-zinc-500">
            &copy; {{ new Date().getFullYear() }} Egwuchukwu S. Diala. All rights
            reserved.
            </p>
        </div>
      </Container>
    </footer>
</template>

<style scoped>

</style>