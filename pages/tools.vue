<script setup lang="ts">
useHead({
  title: 'Tools I love to use',
  meta: [
    { charset: 'utf-8' },
    { name: 'description', content: 'Egwuchukwu Diala lives in Lagos where he creates memorable experiences for brands around the world.' },
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
  title: 'Stack',
  description: 'Tools I love to use.',
  ogTitle: 'Egwuchukwu S. Diala',
  ogDescription: 'Tools I love to use.',
  ogImage: '/images/egdiala-mini.jpg',
  twitterCard: 'summary',
  twitterTitle: 'Egwuchukwu S. Diala',
  twitterDescription: 'Tools I love to use.',
  twitterImage: '/favicon.ico'
})

const tools = [
  {
    firm: 'Workstation',
    projects: [
      {
        name: '16” MacBook Pro, Intel Core i7, 16GB RAM (2019)',
        description: 'I was using an AMD-based 16” HP Pavilion Notebook prior to this and the difference is night and day. I get to see the vibrant colors of designs I\'m converting.',
      },
      {
        name: 'Mi 32” Curved Gaming Monitor',
        description: 'The only display on the market if you want something UHD and bigger than 27”. It has enough room to multitask and the curved edged prevent you from glancing to the far end of the screen.',
      },
    ]
  },
  {
    firm: 'Melli',
    projects: [
      {
        name: 'Melli',
        description: 'A personal assistant device, primarily targeted towards older people living in Germany, to make their lives easier and bring them closer to their loved ones.',
      },
    ]
  },
]
</script>

<template>
  <Container outer-class="mt-16 sm:mt-32">
    <div class="max-w-2xl">
      <h1 class="text-4xl leading-10 font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl sm:leading-[3.5rem] titleText">
        Software I use, gadgets I love, and other things I recommend.
      </h1>
      <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400 leading-7 titleText">
        Here’s a big list of all of my favorite things I use to build software, stay productive, or buy to fool myself into thinking I’m being productive when I’m really just procrastinating.
      </p>
    </div>
  </Container>
</template>

<style scoped>

</style>