<script setup lang="ts">
import { useMotion } from '@vueuse/motion';
import { useMouse } from '~/composables/useMouse';

useHead({
  title: 'I create memorable experiences for brands around the world',
  meta: [
    { charset: 'utf-8' },
    { name: 'description', content: 'As a frontend engineer with over 3 years of experience, he has helped various brands to stand out among their competition by providing them with various solutions.' },
  ],
  bodyAttrs: {
    class: 'flex h-full flex-col bg-zinc-50 dark:bg-black scrollbar-hide'
  },
  htmlAttrs: {
    lang: 'en'
  }
})

const portraitImage = "v1693016247/portfolio-v3/images/egdiala_n6s2o9.png"

const skills = [
    { icon: "carbon:pen-fountain", title: "Design", description: "I use industry standard software such as Figma to create aesthetic designs." },
    { icon: "carbon:code", title: "Development", description: "Expertise in Vue allows me to build out designs I will create for you." },
    { icon: "bi:bezier", title: "Motion", description: "Motion adds life to products. Using Figma, I will show how I can bring your products to life." },
]

const socialLinks = [
    {
        link: 'https://twitter.com/e_diala',
        icon: 'bxl:twitter',
        name: 'Follow on Twitter',
        class: 'socialLink'
    },
    {
        link: 'https://github.com/egdiala',
        icon: 'bxl:github',
        name: 'Follow on GitHub',
        class: 'socialLink mt-4'
    },
    {
        link: 'https://www.linkedin.com/in/egwuchukwu-diala/',
        icon: 'bxl:linkedin-square',
        name: 'Follow on LinkedIn',
        class: 'socialLink mt-4'
    },
    {
        link: 'mailto:dialaegwuchukwu@gmail.com',
        icon: 'heroicons:envelope-solid',
        name: 'dialaegwuchukwu@gmail.com',
        class: 'socialLink mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40'
    },
]

const aboutAnimation = (i: number) => ({
  initial: {
    y: 24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      delay: 200*i,
      duration: 800,
      velocity: 690
    }
  }
})

const socialAnimation = (i: number) => ({
  initial: {
    y: -24,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      delay: 200*i,
      duration: 500,
      velocity: 690
    }
  }
})

const skillAnimation = (i: number) => ({
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

const myImageAnimation = () => ({
  initial: { opacity: 0, y: -24, rotate: 0 },
  visibleOnce: { opacity: 1, y: 0, rotate: 3, transition:{ type: 'tween', ease: 'easeOut', duration: 500, delay: 200 } }
})

const quoteAnimation = () => ({
  initial: { opacity: 0, y: 24 },
  visibleOnce: { opacity: 1, y: 0, transition:{ type: 'tween', ease: 'easeOut', duration: 500, delay: 300 } }
})

onMounted(() => {
    useMouse();
    const aboutTags = document.querySelectorAll('.aboutText')
    const socialTags = document.querySelectorAll('.socialLink')
    const skillTags = document.querySelectorAll('.skill')
    const quoteTags = document.querySelectorAll('.quote')
    const myImage = document.querySelector('.aspect-square') as any

    useMotion(myImage, myImageAnimation())

    quoteTags.forEach((quoteTag: any, i: number) => {
        useMotion(quoteTag, quoteAnimation())
    })

    aboutTags.forEach((aboutTag: any, i: number) => {
        useMotion(aboutTag, aboutAnimation(i))
    })

    socialTags.forEach((socialTag: any, i: number) => {
        useMotion(socialTag, socialAnimation(i))
    })

    skillTags.forEach((skillTag: any, i: number) => {
        useMotion(skillTag, skillAnimation(i))
    })
});
</script>

<template>
    <Container class="mt-16 sm:mt-32">
        <div class="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
            <div class="lg:pl-20">
                <div class="max-w-xs px-2.5 lg:max-w-none">
                    <NuxtImg provider="cloudinary"
                    :src="portraitImage"
                    alt="Egwuchukwu_Stephen_Diala"
                    sizes="lg:512px 320px"
                    class="aspect-square rounded-2xl bg-zinc-100 object-cover object-top dark:bg-zinc-800"
                    />
                </div>
            </div>
            <div class="lg:order-first lg:row-span-2">
                <h1 class="aboutText text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl leading-10  sm:leading-[3.5rem]">
                    I create memorable experiences for brands around the world.
                </h1>
                <div class="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
                    <p class="aboutText">
                        With my experience, I have helped brands using frontend skills as well as my understanding of the principles of design to level up their visual language
                    </p>
                    <p class="aboutText">
                        As a frontend engineer with over 3 years of experience, I have helped various brands to stand out among their competition by providing them with various solutions.
                    </p>
                    <p class="aboutText">
                        By applying the principles of design to my processes, I am able to keep users at the center focus of my process. This allows me to create <em>highly functional</em> products.
                    </p>
                    <p class="aboutText">
                        Today, I create stuff at NenLabs, where we build open source projects for the Vue ecosystem.
                    </p>
                </div>
            </div>
            <div class="lg:pl-20">
                <ul role="list">
                    <SocialLink v-for="(link, index) in socialLinks" :key="index" :href="link.link" :icon="link.icon" :outer-class="link?.class">
                        {{ link.name }}
                    </SocialLink>
                </ul>
            </div>
        </div>
    </Container>
    <Container class="mt-16 sm:mt-32">
        <div class="grid max-w-xl mx-auto text-center">
            <blockquote class="overflow-hidden max-h-28">
                <h2 class="quote text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-2xl sm:leading-9">
                    “Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible”
                </h2>
            </blockquote>
            <div class="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400 max-h-4">
                <p class="quote">
                    -Don Norman
                </p>
            </div>
        </div>
    </Container>
    <Container outer-class="mt-16 sm:mt-32">
      <header class="max-w-2xl">
        <h3 class="aboutText text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
          My skill set will match your needs
        </h3>
        <p class="aboutText mt-6 text-base text-zinc-600 dark:text-zinc-400">
          With expertise in Vue and React, including other frontend technologies, I can help make your product more functional and scale it past expectations
        </p>
      </header>
      <div class="mt-16 sm:mt-20">
        <ul
          role="list"
          class="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
            <Card v-for="skill in skills" :key="skill.title" as="li" titleTag="h4" class="skill" :linkText="skill.title" :description="skill.description">
                <template #image>
                    <div class="relative z-10 flex h-12 w-12 mb-2 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                        <Icon :name="skill.icon" class="dark:text-gray-50 text-gray-800 text-xl" />
                    </div>
                </template>
            </Card>
        </ul>
      </div>
    </Container>
    <Container outer-class="mt-24 md:mt-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 h-full">
            <Contact />
        </div>
    </Container>
</template>

<style scoped>
p {
    @apply leading-7;
}
</style>