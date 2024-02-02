<script setup lang="ts">
import { useMotion } from '@vueuse/motion';
import { useMouse } from '#imports';

const route = useRoute();
useHead({
  title: 'Things I’ve made trying to put my dent in the universe',
  meta: [
    { charset: 'utf-8' },
    { name: 'description', content: 'He has worked on tons of little projects over the years but these are the ones that he\'s most proud of.' },
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
  title: 'Projects',
  description: 'He has worked on tons of little projects over the years but these are the ones that he\'s most proud of.',
  ogTitle: 'Egwuchukwu S. Diala',
  ogDescription: 'Things I’ve made trying to put my dent in the universe.',
  ogImage: '/images/egdiala-mini.jpg',
  twitterCard: 'summary',
  twitterTitle: 'Egwuchukwu S. Diala',
  twitterDescription: 'Things I’ve made trying to put my dent in the universe',
  twitterImage: '/favicon.ico'
})

const projects = [
  {
    name: 'Nen UI',
    description:
      'An unstyled component set library that provides functionalities and can be styled with TailwindCSS classes.',
    link: { href: 'https://ui.nenlabs.org', label: 'nen-ui' },
    logo: 'https://avatars.githubusercontent.com/u/114816453?s=200&v=4',
  },
  {
    name: 'Typed Res',
    description:
      '🧩 A browser extension that converts HTTP response objects to their exact typescript interfaces.',
    link: { href: 'https://github.com/NenLabs/typed-res', label: 'typed-res' },
    logo: 'https://avatars.githubusercontent.com/u/114816453?s=200&v=4',
  },
]

const titleAnimation = (i: number) => ({
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      delay: 200*i,
      duration: 800
    }
  }
})

const projectAnimation = (i: number) => ({
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      delay: 300*i,
      duration: 800,
    }
  }
})

onMounted(() => {
    useMouse();
    umTrackView(route.path)
    const titleTags = document.querySelectorAll('.titleText')
    const projectTags = document.querySelectorAll('.project')

    titleTags.forEach((titleTag: any, i: number) => {
        useMotion(titleTag, titleAnimation(i))
    })

    projectTags.forEach((project: any, i: number) => {
        useMotion(project, projectAnimation(i))
    })
});
</script>

<template>
  <Container class="mt-16 sm:mt-32">
    <div class="max-w-2xl">
      <h1 class="text-4xl leading-10 font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl sm:leading-[3.5rem] titleText">
        Things I’ve made trying to put my dent in the universe.
      </h1>
      <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400 leading-7 titleText">
        I’ve worked on tons of little projects over the years but these are the ones that I’m most proud of. Many of them are open-source, so if you see something that piques your interest, check out the code and contribute if you have ideas for how it can be improved.
      </p>
    </div>
    <div class="mt-16 sm:mt-20">
      <ul
        role="list"
        class="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
          <Card v-for="project in projects" as="li" :key="project.name" class="project" title-tag="h2" :linkText="project.name" :description="project.description" :label="project.link.label" :link="project.link.href" icon="heroicons:link">
            <template #image>
              <div class="relative z-10 flex h-12 w-12 mb-6 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                <NuxtImg
                  :src="project.logo"
                  :alt="project.name"
                  class="h-8 w-8 rounded-full"
                />
              </div>
            </template>
          </Card>
      </ul>
    </div>
  </Container>
</template>

<style scoped>

</style>