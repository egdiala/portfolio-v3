<script setup lang="ts">
import type { MotionVariants } from "@vueuse/motion";

defineProps<{ image: string; }>()

const hero: MotionVariants = {
  initial: {
    y: 24,
    opacity: 0
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
        type: 'tween',
        delay: 550,
        duration: 800,
        velocity: 690
    }
  }
}
</script>

<template>
    <div class="flex w-full max-w-7xl mx-auto px-0 my-4 md:my-8 md:px-8">
      <div v-motion="hero" class="w-full">
        <div class="content-hero relative aspect-[9/10] h-64 md:h-[30rem] lg:h-[50rem] w-full mx-auto overflow-hidden bg-zinc-100 dark:bg-zinc-800 my-5">
            <NuxtImg provider="cloudinary" :src="image" alt="content_hero" sizes="sm:3000px" class="inset-0 h-64 md:h-[30rem] lg:h-[50rem] w-full object-cover" />
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>