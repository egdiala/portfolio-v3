<script setup lang="ts">
import { useMotion } from '@vueuse/motion';
import type { MotionVariants } from "@vueuse/motion";
import { useMouse } from "@/composables/useMouse";

const sections = [
  { 
    "heading": "Project Overview",
    "subTexts": ["Sojorne is a parent and family support app designed to help people in need of special care by providing them access to special care providers. It is an empathetic venture to help parents and caregivers of special needs kids navigate care management.", "Efe Odeleye, CEO of Sojorne, had her life changed several years ago when her firstborn was diagnosed with a health condition that would impact her for life. It was a journey filled with countless doctor's appointments, therapy sessions, tears and triumphs, resilience, hope, and the power of innovating Sojorne."]
  }
]

const titleAnimation = () => ({
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      delay: 300,
      duration: 800,
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
      ease: 'easeOut',
      delay: 400,
      duration: 800
    }
  }
})

const subTextAnimation = () => ({
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      delay: 400,
      duration: 800,
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

const headingAnimation = () => ({
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      delay: 300,
      duration: 800,
    }
  }
})

onMounted(() => {
  useMouse();
  const paragraphTags = document.querySelectorAll('.paragraph')
  const titleTags = document.querySelectorAll('.title')
  const headingTags = document.querySelectorAll('.content-heading')
  const contentParagraphs = document.querySelectorAll('.content-paragraph')

  headingTags.forEach((headTag: any, i: number) => {
      useMotion(headTag, headingAnimation())
  })

  contentParagraphs.forEach((tag: any, i: number) => {
      useMotion(tag, subTextAnimation())
  })

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
        <span class="title mt-10 block text-center max-w-5xl font-display text-5xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50 [text-wrap:balance] sm:text-6xl mx-auto">Ready. Set. Live.</span>
        <p class="paragraph my-6 max-w-3xl text-center text-xl text-neutral-600 dark:text-neutral-400 mx-auto">A parent support app designed to help people live their best lives by coordinating tasks that rob them of time and mental space to enjoy their parenting journey.</p>
        <div v-motion="{ initial: details.initial, enter: details.enter }" class="flex items-center justify-center gap-3">
          <span class="text-base text-zinc-400 dark:text-zinc-500">Sojorne</span>
          <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
          <time datetime="March 20, 2023" class="flex items-center text-base text-zinc-400 dark:text-zinc-500">
            March 20, 2023
          </time>
          <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
          <span class="text-base text-zinc-400 dark:text-zinc-500">Admin Dashboard</span>
        </div>
      </div>
    </div>
  </Container>
  <CHero image="v1699039494/portfolio-v3/work/sojorne/sojorne_dashboard.webp" />
  <Container v-for="(section, s) in sections" :key="s">
    <h1 class="content-heading my-5 font-semibold text-xl dark:text-zinc-200 text-zinc-800">{{ section?.heading }}</h1>
    <p v-for="(subText, i) in section?.subTexts" :key="i" class="content-paragraph mb-2 text-lg dark:text-zinc-400 text-zinc-600">{{ subText }}</p>
  </Container>
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