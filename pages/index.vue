<script setup lang="ts">
const images = [
    '/photos/image-1.jpg',
    '/photos/image-2.jpg',
    '/photos/image-3.jpg',
    '/photos/image-4.jpg',
    '/photos/image-5.jpg',
]
const rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']
</script>

<template>
    <Container outer-class="mt-9">
        <div class="max-w-2xl">
          <h1 class="text-4xl leading-10 font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl sm:leading-[3.5rem]">
            Frontend engineer, designer, and music lover.
          </h1>
          <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400 leading-7">
            I’m Egwuchukwu, a <span class="text-zinc-900 dark:text-zinc-50">design-focused</span> frontend engineer and designer based in Lagos, Nigeria. <span class="text-zinc-900 dark:text-zinc-50">I combine my expertise</span> in all levels of development and my <span class="text-zinc-900 dark:text-zinc-50">understanding of UI design</span> to <span class="text-zinc-900 dark:text-zinc-50">create meaningful experiences</span>.
          </p>
          <div class="mt-6 flex gap-6">
            <SocialLink
              href="https://twitter.com"
              aria-label="Follow on Twitter"
              icon="bxl:twitter"
            />
            <SocialLink
              href="https://instagram.com"
              aria-label="Follow on Instagram"
              icon="bxl:instagram"
            />
            <SocialLink
              href="https://github.com"
              aria-label="Follow on GitHub"
              icon="bxl:github"
            />
            <SocialLink
              href="https://linkedin.com"
              aria-label="Follow on LinkedIn"
              icon="bxl:linkedin-square"
            />
          </div>
        </div>
    </Container>
    <div class="mt-4 sm:mt-20">
        <div class="-my-4 flex justify-center gap-5 overflow-hidden py-11 sm:gap-8">
            <div v-for="(image, imageIndex) in images" :key="imageIndex"
            :class="`relative aspect-[9/10] transform hover:sm:-translate-y-10 hover:-translate-y-3 transition-all ease duration-300 w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl ${rotations[imageIndex % rotations.length]}`">
                <NuxtImg :src="image" sizes="sm:640px" class="absolute inset-0 h-full w-full object-cover" />
            </div>
        </div>
    </div>
    <Container outer-class="mt-24 md:mt-28">
        <div class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
            <div class="flex flex-col gap-4">
                <h3 class="text-2xl leading-10 font-bold tracking-tight text-gray-600 dark:text-gray-500 sm:text-3xl">
                My understanding of <span class="text-gray-900 dark:text-gray-50">design principles</span> and <span class="text-gray-900 dark:text-gray-50">performant code</span> allows me to create usable digital products.
                </h3>
                <p class="text-base text-zinc-600 dark:text-zinc-400 leading-7">With over 4 years of experience in frontend development and product design, I have worked with startups to create useful solutions.</p>
                <p class="text-base text-zinc-600 dark:text-zinc-400 leading-7">With a passion for accessibility, I ensure that products I work on are simple. Most importantly, they solve user problems and keep business goals in mind.</p>
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
</template>

<style>

</style>
