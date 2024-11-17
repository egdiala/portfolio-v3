<script setup lang="ts">
import { useMotion } from '@vueuse/motion';
import { useMouse } from '~/composables/useMouse';
import type { MotionVariants } from "@vueuse/motion";

const route = useRoute()
useHead({
  title: 'Frontend engineer, designer, music lover',
  meta: [
    { charset: 'utf-8' },
    { name: 'description', content: 'Egwuchukwu is a design-focused frontend engineer and designer based in Lagos, Nigeria. He combines his expertise to create meaningful experiences.' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
    }
  ],
  bodyAttrs: {
    class: 'flex h-full flex-col bg-zinc-50 dark:bg-black scrollbar-hide'
  },
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Home',
  description: 'Frontend engineer, designer, music lover.',
  ogTitle: 'Egwuchukwu S. Diala',
  ogDescription: 'Egwuchukwu is a design-focused frontend engineer.',
  ogImage: '/images/egdiala-mini.jpg',
  twitterCard: 'summary',
  twitterTitle: 'Egwuchukwu S. Diala',
  twitterDescription: 'Frontend engineer, designer, music lover',
  twitterImage: '/favicon.ico'
})

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
      delay: 600,
      duration: 800,
      velocity: 690
    }
  }
})

const icons: MotionVariants = {
  initial: {
    y: 0,
    opacity: 0
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      delay: 600,
      duration: 800
    }
  }
}

const scrollImagesAnimation = (i: number) => ({
  initial: {
    opacity: 0, x: 50
  },
  enter: {
    opacity: 1, x: 0,
    transition: {
      type: 'keyframe', ease: 'linear', duration: 500, delay: (i+1) * 250
    }
  }
})

const scrollImages = [
  'v1702938451/portfolio-v3/work/gaming_peasants/gaming_peasants_review_f9q2rs.webp',
  'v1699039494/portfolio-v3/work/sojorne/sojorne_dashboard.webp',
  'v1702938419/portfolio-v3/work/clearline/clearline_hmo_admin_admins_yl5ro8.webp',
  'v1702938480/portfolio-v3/work/kitchenshare/kitchen_share_i0creu.webp',
  'v1702938451/portfolio-v3/work/gaming_peasants/gaming_peasants_zhdfcx.webp',
  'v1700252209/portfolio-v3/work/sojorne/sojorne_providers_list.webp',
  'v1702938420/portfolio-v3/work/clearline/clearline_hmo_admin_templates_k5pphk.webp'
]

onMounted(() => {
  useMouse();
  umTrackView(route.path)
  const paragraphTags = document.querySelectorAll('.paragraph')
  const titleTags = document.querySelectorAll('.title')
  const scrollContainer = document.querySelectorAll('.scrollContainer')

  paragraphTags.forEach((paragraphTag: any, i: number) => {
    useMotion(paragraphTag, paragraphAnimation())
  })

  titleTags.forEach((titleTag: any, i: number) => {
    useMotion(titleTag, titleAnimation())
  })

  scrollContainer.forEach((img: any, i: number) => {
    useMotion(img, scrollImagesAnimation(i))
  })
});
</script>

<template>
    <Container outer-class="mt-9">
        <div class="max-w-2xl">
          <h1 class="title text-4xl leading-10 font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl sm:leading-[3.5rem]">
            Frontend engineer, designer, and music lover.
          </h1>
          <p class="paragraph mt-6 text-base text-zinc-600 dark:text-zinc-400 leading-7">
            I’m Egwuchukwu, a <span class="text-zinc-900 dark:text-zinc-50">design-focused</span> frontend engineer and designer based in Lagos, Nigeria. <span class="text-zinc-900 dark:text-zinc-50">I combine my expertise</span> in all levels of development and my <span class="text-zinc-900 dark:text-zinc-50">understanding of UI design</span> to <span class="text-zinc-900 dark:text-zinc-50">create meaningful experiences</span>.
          </p>
          <div v-motion="{ initial: icons.initial, enter: icons.enter }" class="mt-6 flex gap-6">
            <SocialIcon v-umami="'View-Twitter-Page'"
              href="https://twitter.com/e_diala"
              aria-label="Follow on Twitter"
              icon="bxl:twitter"
            />
            <SocialIcon v-umami="'View-GitHub-Page'"
              href="https://github.com/egdiala"
              aria-label="Follow on GitHub"
              icon="bxl:github"
            />
            <SocialIcon v-umami="'View-LinkedIn-Page'"
              href="https://www.linkedin.com/in/egwuchukwu-diala/"
              aria-label="Follow on LinkedIn"
              icon="bxl:linkedin-square"
            />
          </div>
        </div>
    </Container>
    <div class="mt-4 overflow-hidden">
      <NuxtImg provider="cloudinary" src="v1702933419/portfolio-v3/photos/work-scribble_lxztcg.svg" sizes="sm:1500px" alt="image_1" class="w-52 mix-blend-difference" />
      <div class="flex justify-start space-x-6 overflow-x-scroll py-8 scrollbar-hide">
        <NuxtImg v-for="(img, i) in scrollImages" :key="i" provider="cloudinary" :src="img" sizes="sm:1500px" :alt="`image_${i}`" width="620" height="400" class="scrollContainer object-cover lg:border-2 lg:border-zinc-100/10 w-[350px] md:w-[620px]" />
      </div>
    </div>
    <Container outer-class="mt-24 md:mt-28">
        <div class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
            <div class="flex flex-col gap-4">
              <span class="text-gray-500 dark:text-gray-100 text-base md:text-lg">About me</span>
              <h2 class="title text-2xl leading-10 font-bold tracking-tight text-gray-600 dark:text-neutral-400 sm:text-3xl">
              “My understanding of <span class="text-gray-900 dark:text-white">design principles</span> and <span class="text-gray-900 dark:text-gray-50">performant code</span> allows me to create usable digital products.”
              </h2>
              <p class="paragraph text-base text-zinc-600 dark:text-neutral-300 leading-7">With over 5 years of experience in frontend development and product design, I have worked with startups to create useful solutions.</p>
              <p class="paragraph text-base text-zinc-600 dark:text-neutral-300 leading-7">With a passion for accessibility, I ensure that products I work on are simple. Most importantly, they solve user problems and keep business goals in mind.</p>
            </div>
            <div class="space-y-10 lg:pl-16 xl:pl-24">
                <Resume />
            </div>
        </div>
    </Container>
    <Container outer-class="mt-24 md:mt-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 h-full">
            <Testimonial />
        </div>
    </Container>
    <Container outer-class="mt-24 md:mt-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 h-full">
            <Contact />
        </div>
    </Container>
</template>

<style>

</style>
