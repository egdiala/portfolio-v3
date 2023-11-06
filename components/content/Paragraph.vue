<script setup lang="ts">
import { useMotion } from '@vueuse/motion';
import type { MotionVariants } from "@vueuse/motion";

const paragraphAnimation = {
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 600,
      duration: 800,
      velocity: 690
    }
  }
}
</script>

<template>
    <Container v-motion="{ initial: paragraphAnimation.initial, visibleOnce: paragraphAnimation.visibleOnce }" outer-class="mb-2" inner-class="text-lg dark:text-zinc-400 text-zinc-600">
       <slot />  
    </Container>
</template>