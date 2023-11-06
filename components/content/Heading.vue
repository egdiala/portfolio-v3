<script setup lang="ts">
import { useMotion } from '@vueuse/motion';
import type { MotionVariants } from "@vueuse/motion";

defineProps(['tag'])

const titleAnimation = () => ({
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 500,
      duration: 800,
      velocity: 690
    }
  }
})

onMounted(() => {
    const titleTags = document.querySelectorAll('.content-heading') as HTMLHeadingElement[]

    titleTags.forEach((titleTag: any, i: number) => {
        useMotion(titleTag, titleAnimation())
    })
});
</script>

<template>
    <Container outer-class="my-5">
        <div class="content-heading font-semibold text-xl dark:text-zinc-200 text-zinc-800">
            <ContentSlot :use="$slots.default" />
        </div>
    </Container>
</template>