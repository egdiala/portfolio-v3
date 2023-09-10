<script setup lang="ts">
import { useMotion } from '@vueuse/motion';

useHead({
  title: 'Stuff I built at previous roles.',
  meta: [
    { charset: 'utf-8' },
    { name: 'description', content: 'Stuff I worked on at current and previous roles.' },
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
  title: 'Work',
  description: 'Stuff I built at previous roles.',
  ogTitle: 'Egwuchukwu S. Diala',
  ogDescription: 'Stuff I built at previous roles.',
  ogImage: 'https://res.cloudinary.com/egdiala/image/upload/v1693016247/portfolio-v3/images/egdiala-mini.jpg',
  twitterCard: 'summary',
  twitterTitle: 'Egwuchukwu S. Diala',
  twitterDescription: 'Stuff I built at previous roles.',
  twitterImage: '/favicon.ico'
})

const works = [
  {
    firm: 'Enyata',
    projects: [
      {
        name: 'Clearline HMO',
        description: 'A health insurance company offering robust healthcare plans tailored to satisfy the needs of individuals, families, groups, companies and the public sector.',
        link: { href: '/work/', label: 'Read case study' },
        logo: 'https://clearline-admin.enyata.com/logo-40-gradient.svg',
        tasks: 'UI Kit, Admin Dashboard'
      },
      {
        name: 'Sojorne',
        description: 'A parent support app designed to help people live their best lives by coordinating tasks that rob them of time and mental space to enjoy their parenting journey.',
        link: { href: '/work/', label: 'Read case study' },
        logo: 'https://admin.sojorne.com/androidChrome.png',
        tasks: 'Admin Dashboard'
      },
    ]
  },
  {
    firm: 'Melli',
    projects: [
      {
        name: 'Melli',
        description: 'A personal assistant device, primarily targeted towards older people living in Germany, to make their lives easier and bring them closer to their loved ones.',
        link: { href: '/work/', label: 'Read case study' },
        logo: 'https://assets.melli.com/logo.svg',
        tasks: 'Website'
      },
    ]
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
  <Container  class="mt-16 sm:mt-32">
    <div class="max-w-2xl">
      <h1 class="text-4xl leading-10 font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl sm:leading-[3.5rem] titleText">
        I build solutions for real-world problems.
      </h1>
      <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400 leading-7 titleText">
        A collection of products I've worked on at different stages of my career, collected in chronological order. If you see something that piques your interest, read the case study to learn more about the product and development process.
      </p>
    </div>
    <div class="mt-16 sm:mt-20">
      <div class="grid gap-20">
        <Section v-for="work in works" :title="work.firm" :id="work.firm.toLowerCase()">
          <div class="grid gap-16">
            <Card v-for="project in work.projects" as="article" :key="project.name" class="project" title-tag="h2" :linkText="project.name" :description="project.description" :label="project.link.label" :link="project.link.href" icon="heroicons:link">
              <template #image>
                <div class="grid gap-3">
                  <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                    <NuxtImg
                      :src="project.logo"
                      :alt="project.name"
                      class="h-8 w-8 rounded-full p-1 bg-white"
                    />
                  </div>
                  <p class="relative z-10 mb-2 flex items-center text-sm text-zinc-400 dark:text-zinc-500 pl-3.5">
                    <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                      <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                    </span>
                    {{ project.tasks }}
                  </p>
                </div>
              </template>
            </Card>
          </div>
        </Section>
      </div>
    </div>
  </Container>
</template>

<style scoped>

</style>