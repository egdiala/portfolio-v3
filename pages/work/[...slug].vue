<script setup lang="ts">
import { useMotion } from '@vueuse/motion';
import type { MotionVariants } from "@vueuse/motion";
import { useMouse } from "@/composables/useMouse"

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
      delay: 300,
      duration: 800,
      velocity: 690
    }
  }
})

const paragraphAnimation = () => ({
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 400,
      duration: 800,
      velocity: 690
    }
  }
})

const details: MotionVariants = {
  initial: {
    y: 0,
    opacity: 0
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      delay: 500,
      duration: 800
    }
  }
}

const route = useRoute()

const { data } = await useAsyncData(
    route.path,
    () => queryContent().where({ _path: route.path }).findOne()
);

onMounted(() => {
  useMouse();
  const paragraphTags = document.querySelectorAll('.paragraph')
  const titleTags = document.querySelectorAll('.title')

  paragraphTags.forEach((paragraphTag: any, i: number) => {
    useMotion(paragraphTag, paragraphAnimation())
  })

  titleTags.forEach((titleTag: any, i: number) => {
    useMotion(titleTag, titleAnimation())
  })
});
</script>

<template>
    <Container outer-class="mt-24 md:mt-28">
        <div class="dark:text-white text-black mx-auto max-w-7xl px-0 mb-6">
            <div class="relative px-0 lg:px-12">
                <div class="mx-auto max-w-2xl lg:max-w-5xl">
                    <div class="flex items-center justify-between">
                        <NuxtLink to="/work" class="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0">
                            <Icon name="heroicons:arrow-left-solid" class="h-4 w-4 text-base stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        <div class="mx-auto max-w-7xl px-0 sm:px-6 lg:px-0 h-full">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
                <span class="title mt-10 block text-center max-w-5xl font-display text-5xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50 [text-wrap:balance] sm:text-6xl mx-auto">{{ data?.caption }}</span>
                <p class="paragraph my-6 max-w-3xl text-center text-xl text-neutral-600 dark:text-neutral-400 mx-auto">{{ data?.description }}.</p>
                <div v-motion="{ initial: details.initial, enter: details.enter }" class="flex items-center justify-center gap-3">
                    <span class="text-base text-zinc-400 dark:text-zinc-500">{{ data?.title }}</span>
                    <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                    <time :datetime="data?.date" class="flex items-center text-base text-zinc-400 dark:text-zinc-500">
                        {{ data?.date }}
                    </time>
                    <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                    <span class="text-base text-zinc-400 dark:text-zinc-500">{{ data?.service }}</span>
                </div>
            </div>
        </div>
    </Container>
    <ContentRendererMarkdown class="content-doc" :value="data" />
    <Container outer-class="mt-24 md:mt-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 h-full">
            <Contact />
        </div>
    </Container>
</template>

<style scoped>

.content-doc {
    @apply mx-auto dark:text-zinc-400 text-zinc-600;
}
</style>