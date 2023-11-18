<script setup lang="ts">
import { useMotion } from '@vueuse/motion';
import type { MotionVariants } from "@vueuse/motion";
import { useMouse } from "@/composables/useMouse";

const sections = [
  { 
    "heading": "Introduction",
    "subTexts": ["Sojorne is a parent and family support app designed to help people in need of special care by providing them access to special care providers. It is an empathetic venture to help parents and caregivers of special needs kids navigate care management.", "Efe Odeleye, CEO of Sojorne, had her life changed several years ago when her firstborn was diagnosed with a health condition that would impact her for life. It was a journey filled with countless doctor's appointments, therapy sessions, tears and triumphs, resilience, hope, and the power of innovating Sojorne."]
  },
  { 
    "heading": "Problem Statement",
    "subTexts": ["Our primary aim was to deliver an MVP for the Sojorne project on which it can scale, within the duration of 3 months. This MVP consisted of various modules including providers, communities, admin, customers and dashboard analytics.", "My role on Sojorne project was to lead the frontend team in delivering high quality and fully responsive admin dashboard."]
  },
]

const solutions = [
  { 
    "heading": "Solution",
    "subTexts": ["Sojorne was built using Agile methodology. The project was broken down into three milestones, and each milestone further broken down into sprints.", "The project was setup with <i>Atomic Design Principle</i> in mind, creating and documenting our component set with StorybookJs which helped our development process become more modular and manageable.",
    "Testing environment was setup with Jest, React Testing Library. Formik and Yup for handling forms and validation. Redux Toolkit for state management. HeadlessUI and TailwindCSS for UI and styling."
    ]
  },
  { 
    "heading": "Implementation",
    "subTexts": ["The implementation phase is where ideas transform into tangible solutions and as the driving force behind the frontend engineering of this project, my role extended beyond conceptualization to the meticulous crafting of a robust and efficient system. Let's delve into the intricacies of the coding journey that brought the envisioned solution to life."]
  },
]

const infos = [
  { title: "Role", text: "Lead Frontend Engineer", icon: "carbon:user-role"},
  { title: "Timeline", text: "3 months", icon: "mdi:chart-timeline-variant-shimmer"},
  { title: "Tools", text: "ReactJs, TailwindCSS, Jest", icon: "ph:code"},
]

const slides = ["v1700252201/portfolio-v3/work/sojorne/sojorne_create_subcategory.webp", "v1700252204/portfolio-v3/work/sojorne/sojorne_invite_admin.webp", "v1700252202/portfolio-v3/work/sojorne/sojorne_provider_categories.webp", "v1700252209/portfolio-v3/work/sojorne/sojorne_providers_list.webp", "v1699039494/portfolio-v3/work/sojorne/sojorne_dashboard.webp"]

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

const infoAnimation = (i: number) => ({
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
      delay: 250*i,
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
  const infoTags = document.querySelectorAll('.info')

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

  infoTags.forEach((infoTag: any, i: number) => {
      useMotion(infoTag, infoAnimation(i))
  })
});
</script>

<template>
  <Container outer-class="mt-14 md:mt-28">
    <div class="dark:text-white text-black mx-auto max-w-7xl px-0">
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
        <span class="title md:mt-10 block text-center max-w-5xl font-display text-5xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50 [text-wrap:balance] sm:text-6xl mx-auto">Ready. Set. Live.</span>
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
  <Container>
    <div v-for="(section, s) in sections" :key="s" class="mx-auto max-w-2xl lg:max-w-3xl">
      <h1 class="content-heading mt-5 mb-2 font-semibold text-xl dark:text-zinc-200 text-zinc-800">{{ section?.heading }}</h1>
      <p v-for="(subText, i) in section?.subTexts" :key="i" class="content-paragraph mb-2 text-base dark:text-zinc-400 text-zinc-600">{{ subText }}</p>
    </div>
  </Container>
  <Container outer-class="mb-10 md:mb-20">
      <div class="mt-16 sm:mt-20">
        <ul
          role="list"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <li v-for="skill in infos" :key="skill.title" class="info p-6 group relative flex flex-col items-start">
            <div class="relative z-10 flex h-12 w-12 mb-2.5 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                <Icon :name="skill.icon" class="dark:text-gray-50 text-gray-800 text-xl" />
            </div>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-50 opacity-100 dark:bg-zinc-800/50 rounded-2xl" />
            <h4 class="relative text-base font-semibold tracking-tight text-zinc-600 dark:text-zinc-400">
              {{ skill.title }}
            </h4>
            <p class="relative z-10 mt-1 text-lg text-zinc-800 dark:text-zinc-100 leading-6">
            {{ skill.text }}
            </p>
          </li>
        </ul>
      </div>
  </Container>
  <Container>
    <div v-for="(solution, s) in solutions" :key="s" class="mx-auto max-w-2xl lg:max-w-3xl">
      <h1 class="content-heading mt-5 mb-2 font-semibold text-xl dark:text-zinc-200 text-zinc-800">{{ solution?.heading }}</h1>
      <p v-for="(subText, i) in solution?.subTexts" :key="i" class="content-paragraph mb-2 text-base dark:text-zinc-400 text-zinc-600" v-html="subText"></p>
    </div>
  </Container>
  <CImplementation v-motion="{ initial: details.initial, enter: details.enter }" :slides="slides" />
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