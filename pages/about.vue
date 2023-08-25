<script setup lang="ts">
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

const portraitImage = "/images/egdiala.png"

const skills = [
    { icon: "carbon:pen-fountain", title: "Design", description: "I use industry standard software such as Figma to create aesthetic designs." },
    { icon: "carbon:code", title: "Development", description: "Expertise in Vue allows me to build out designs I will create for you." },
    { icon: "bi:bezier", title: "Motion", description: "Motion adds life to products. Using Figma, I will show how I can bring your products to life." },
]

onMounted(() => {
    useMouse();
});
</script>

<template>
    <Container class="mt-16 sm:mt-32">
        <div class="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
            <div class="lg:pl-20">
                <div class="max-w-xs px-2.5 lg:max-w-none">
                    <NuxtImg
                    :src="portraitImage"
                    alt=""
                    sizes="lg:512px 320px"
                    class="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover object-top dark:bg-zinc-800"
                    />
                </div>
            </div>
            <div class="lg:order-first lg:row-span-2">
                <h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl leading-10  sm:leading-[3.5rem]">
                    I create memorable experiences for brands around the world.
                </h1>
                <div class="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
                    <p>
                        With my experience, I have helped brands using frontend skills as well as my understanding of the principles of design to level up their visual language
                    </p>
                    <p>
                        As a frontend engineer with over 3 years of experience, I have helped various brands to stand out among their competition by providing them with various solutions.
                    </p>
                    <p>
                        By applying the principles of design to my processes, I am able to keep users at the center focus of my process. This allows me to create <em>highly functional</em> products.
                    </p>
                    <p>
                        Today, I create stuff at NenLabs, where we build open source projects for the Vue ecosystem.
                    </p>
                </div>
            </div>
            <div class="lg:pl-20">
                <ul role="list">
                    <SocialLink href="https://twitter.com/e_diala" icon="bxl:twitter">
                        Follow on Twitter
                    </SocialLink>
                    <!-- <SocialLink href="#" icon="bxl:instagram" outer-class="mt-4">
                        Follow on Instagram
                    </SocialLink> -->
                    <SocialLink href="https://github.com/egdiala" icon="bxl:github" outer-class="mt-4">
                        Follow on GitHub
                    </SocialLink>
                    <SocialLink href="https://www.linkedin.com/in/egwuchukwu-diala/" icon="bxl:linkedin-square" outer-class="mt-4">
                        Follow on LinkedIn
                    </SocialLink>
                    <SocialLink href="mailto:dialaegwuchukwu@gmail.com" icon="heroicons:envelope-solid" outer-class="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40">
                        dialaegwuchukwu@gmail.com
                    </SocialLink>
                </ul>
            </div>
        </div>
    </Container>
    <Container class="mt-16 sm:mt-32">
        <div class="grid max-w-xl mx-auto text-center">
            <blockquote>
                <h2 class="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-2xl sm:leading-9">
                    “Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible”
                </h2>
            </blockquote>
            <div class="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
                <p>
                    -Don Norman
                </p>
            </div>
        </div>
    </Container>
    <Container outer-class="mt-16 sm:mt-32">
      <header class="max-w-2xl">
        <h3 class="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
          My skill set will match your needs
        </h3>
        <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          With expertise in Vue and React, including other frontend technologies, I can help make your product more functional and scale it past expectations
        </p>
      </header>
      <div class="mt-16 sm:mt-20">
        <ul
          role="list"
          class="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
            <Card v-for="skill in skills" :key="skill.title" as="li" titleTag="h4" :linkText="skill.title" :description="skill.description">
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