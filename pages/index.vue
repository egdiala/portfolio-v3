<script setup lang="ts">
import { MotionVariants, useMotion } from '@vueuse/motion';
import { useMouse } from '~/composables/useMouse';

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
    <Container outer-class="mt-9">
        <div class="max-w-2xl">
          <h1 class="title text-4xl leading-10 font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl sm:leading-[3.5rem]">
            Frontend engineer, designer, and music lover.
          </h1>
          <p class="paragraph mt-6 text-base text-zinc-600 dark:text-zinc-400 leading-7">
            I’m Egwuchukwu, a <span class="text-zinc-900 dark:text-zinc-50">design-focused</span> frontend engineer and designer based in Lagos, Nigeria. <span class="text-zinc-900 dark:text-zinc-50">I combine my expertise</span> in all levels of development and my <span class="text-zinc-900 dark:text-zinc-50">understanding of UI design</span> to <span class="text-zinc-900 dark:text-zinc-50">create meaningful experiences</span>.
          </p>
          <div v-motion="{ initial: icons.initial, enter: icons.enter }" class="mt-6 flex gap-6">
            <SocialIcon
              href="https://twitter.com/e_diala"
              aria-label="Follow on Twitter"
              icon="bxl:twitter"
            />
            <SocialIcon
              href="https://github.com/egdiala"
              aria-label="Follow on GitHub"
              icon="bxl:github"
            />
            <SocialIcon
              href="https://www.linkedin.com/in/egwuchukwu-diala/"
              aria-label="Follow on LinkedIn"
              icon="bxl:linkedin-square"
            />
          </div>
        </div>
    </Container>
    <div class="mt-4 sm:mt-20">
        <div class="-my-4 flex justify-center gap-5 overflow-hidden py-11 sm:gap-8">
            <div v-motion="{ initial: { opacity: 0, y: 24, rotate: 0 }, enter: { opacity: 1, y: 0, rotate: 2, transition:{ type: 'tween', ease: 'ease', duration: 500, delay: 250 } } }"
            :class="`relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl`">
                <NuxtImg provider="cloudinary" src="v1693016225/portfolio-v3/photos/image-1.jpg" alt="image_1" sizes="sm:640px" class="absolute inset-0 h-full w-44 sm:w-72 object-cover" />
            </div>
            <div v-motion="{ initial: { opacity: 0, y: 24, rotate: 0 }, enter: { opacity: 1, y: 0, rotate: -2, transition:{ type: 'tween', ease: 'ease', duration: 500, delay: 500 } } }"
            :class="`relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl`">
                <NuxtImg provider="cloudinary" src="v1693016225/portfolio-v3/photos/image-2.jpg" alt="image_2" sizes="sm:640px" class="absolute inset-0 h-full w-44 sm:w-72 object-cover" />
            </div>
            <div v-motion="{ initial: { opacity: 0, y: 24, rotate: 0 }, enter: { opacity: 1, y: 0, rotate: 2, transition:{ type: 'tween', ease: 'ease', duration: 500, delay: 750 } } }"
            :class="`relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl`">
                <NuxtImg provider="cloudinary" src="v1693016224/portfolio-v3/photos/image-3.jpg" alt="image_3" sizes="sm:640px" class="absolute inset-0 h-full w-44 sm:w-72 object-cover" />
            </div>
            <div v-motion="{ initial: { opacity: 0, y: 24, rotate: 0 }, enter: { opacity: 1, y: 0, rotate: -2, transition:{ type: 'tween', ease: 'ease', duration: 500, delay: 1000 } } }"
            :class="`relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl`">
                <NuxtImg provider="cloudinary" src="v1693016224/portfolio-v3/photos/image-4.jpg" alt="image_4" sizes="sm:640px" class="absolute inset-0 h-full w-44 sm:w-72 object-cover" />
            </div>
            <div v-motion="{ initial: { opacity: 0, y: 24, rotate: 0 }, enter: { opacity: 1, y: 0, rotate: 2, transition:{ type: 'tween', ease: 'ease', duration: 500, delay: 1250 } } }"
            :class="`relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl`">
                <NuxtImg provider="cloudinary" src="v1693016224/portfolio-v3/photos/image-5.jpg" alt="image_5" sizes="sm:640px" class="absolute inset-0 h-full w-44 sm:w-72 object-cover" />
            </div>
          </div>
    </div>
    <Container outer-class="mt-24 md:mt-28">
        <div class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
            <div class="flex flex-col gap-4">
              <span class="text-gray-500 dark:text-gray-100 text-base md:text-lg">About me</span>
              <h2 class="title text-2xl leading-10 font-bold tracking-tight text-gray-600 dark:text-neutral-400 sm:text-3xl">
              “My understanding of <span class="text-gray-900 dark:text-white">design principles</span> and <span class="text-gray-900 dark:text-gray-50">performant code</span> allows me to create usable digital products.”
              </h2>
              <p class="paragraph text-base text-zinc-600 dark:text-neutral-300 leading-7">With over 4 years of experience in frontend development and product design, I have worked with startups to create useful solutions.</p>
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
